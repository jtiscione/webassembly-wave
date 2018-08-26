function wave(wasm) {

  const canvas = document.getElementById('canvas');
  const fps = document.getElementById('fps');
  const jsBox = document.getElementById('js-box');
  const wasmBox = document.getElementById('wasm-box');
  const noiseBtn = document.getElementById('noiseBtn');
  const clearBtn = document.getElementById('clearBtn');

  let width = canvas.width;
  let height = canvas.height;
  const context = canvas.getContext('2d');

  let imageArray = null;
  let forceArray = null;
  let statusArray = null;
  let applyBrakes = false;

  const jsAlgorithm = jsWaveAlgorithm(width, height);
  let algorithm = jsAlgorithm;
  let wasmAlgorithm = null;

  if (wasm) {
    wasmAlgorithm = wasmWaveAlgorithm(wasm, width, height);
    algorithm = wasmAlgorithm;
    wasmBox.checked = true;
    const swap = function(replacement) {
      replacement.getEntireArray().set(algorithm.getEntireArray());
      algorithm = replacement;
      forceArray = null;
      statusArray = null;
      imageArray = null;
    };
    jsBox.addEventListener('click', function(event) {
      swap(jsAlgorithm);
    });
    wasmBox.addEventListener('click', function(event) {
      swap(wasmAlgorithm);
    });
  } else {
    jsBox.disabled = true;
    wasmBox.disabled = true;
    document.getElementById('radio').style.display='none';
    document.getElementById('sorry').style.display='block';
  }

  let timestamps = [];
  let lastFpsJitter = 0;
  let animationCount = 0;

  let lastMouseX = null, lastMouseY = null;

  function animate() {
    setTimeout(animate, 0);

    if (animationCount === 0) {
      // First frame-
      // Sprinkle noise generator pixels and set applyBrakes flag
      const threshold = 0.001;
      if (statusArray === null) {
        statusArray = algorithm.getStatusArray();
      }
      for (let i = 0; i < statusArray.length; i++) {
        if (Math.random() < threshold) {
          statusArray[i] = (i %2 === 0) ? 2 : 3;
        }
      }
      // Draw a circular wall
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min((width / 2), (height / 2));
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          let dist = Math.sqrt(((i - centerY) * (i - centerY)) + ((j - centerX) * (j - centerX)));
          if (dist > radius) {
            const targetIndex = i * width + j;
            statusArray[targetIndex] = 1;
          }
        }
      }
      applyBrakes = true;
    }

    if (animationCount === 100) {
      // After 100 frames- clear noise generator pixels and applyBrakes flag
      for (let i = 0; i < statusArray.length; i++) {
        if (statusArray[i] === 2 || statusArray[i] === 3) {
          statusArray[i] = 0;
        }
      }
      applyBrakes = false;
    }

    if (lastMouseX !== null && lastMouseY !== null) {
      applyBrush(lastMouseX, lastMouseY);
    }

    let amplitude = Math.floor(0x3FFFFFFF * Math.sin(6.283 * animationCount / 100));
    algorithm.singleFrame(amplitude, applyBrakes ? 5 : 0);

    if (imageArray === null) {
      imageArray = algorithm.getImageArray();
    }
    const imgData = context.createImageData(width, height);
    imgData.data.set(imageArray);
    context.putImageData(imgData, 0, 0);
    const now = Date.now();
    timestamps.push(now);
    timestamps = timestamps.filter(function(e) {
      return ((now - e) < 1000);
    });

    const count = timestamps.length;
    if (now - lastFpsJitter > 400) {
      lastFpsJitter = now;
      fps.innerHTML = count;
    }
    animationCount++;
  }

  function windowToCanvas(canvas, x, y) {
    const bbox = canvas.getBoundingClientRect();
    return {
      x: Math.round(x - bbox.left * (canvas.width / bbox.width)),
      y: Math.round(y - bbox.top * (canvas.height / bbox.height))
    };
  }

  const brushMatrix = [];
  const brushMatrixRadius = 28;
  for (let p = -brushMatrixRadius; p <= brushMatrixRadius; p++) {
    const row = [];
    brushMatrix.push(row);
    for (let q = -brushMatrixRadius; q <= brushMatrixRadius; q++) {
      const element = Math.floor(0x3FFFFFFF * Math.exp(-0.05 * ((p * p) + (q * q))));
      row.push(element);
    }
  }

  function applyBrush(x, y) {
    if (forceArray === null) {
      forceArray = algorithm.getForceArray();
    }
    for (let p = -brushMatrixRadius; p <= brushMatrixRadius; p++) {
      const targetY = y + p;
      if (targetY <= 0 || targetY >= height - 1) {
        continue;
      }
      function applyCap(x) {
        return x < -0x40000000 ? -0x40000000 : (x > 0x3FFFFFFF ? 0x3FFFFFFF : x);
      }
      for (q = -brushMatrixRadius; q <= brushMatrixRadius; q++) {
        const targetX = x + q;
        if (targetX <= 0 || targetX >= width - 1) {
          continue;
        }
        const brushValue = brushMatrix[p + brushMatrixRadius][q + brushMatrixRadius];
        const targetIndex = targetY * width + targetX;
        forceArray[targetIndex] += brushValue;
        forceArray[targetIndex] = applyCap(forceArray[targetIndex]);
      }
    }
  }

  canvas.onmousedown = function (e) {
    e.preventDefault();
    applyBrakes = false;
    const loc = windowToCanvas(canvas, e.clientX, e.clientY);
    lastMouseX = loc.x;
    lastMouseY = loc.y;
    applyBrush(loc.x, loc.y);
  };

  canvas.ontouchstart = function (e) {
    e.preventDefault();
    applyBrakes = false;
    const loc = windowToCanvas(canvas, e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    lastMouseX = loc.x;
    lastMouseY = loc.y;
    applyBrush(loc.x, loc.y);
  };

  canvas.onmousemove = function (e) {
    e.preventDefault();
    const loc = windowToCanvas(canvas, e.clientX, e.clientY);
    const targetX = loc.x, targetY = loc.y;
    if (lastMouseX !== null && lastMouseY !== null) {
      // draw a line from the last place we were to the current place
      const r = Math.sqrt((loc.x - lastMouseX) * (loc.x - lastMouseX) + (loc.y - lastMouseY) * (loc.y - lastMouseY));
      for (let t = 0; t < r; t++) {
        const currX = Math.round(lastMouseX + (targetX - lastMouseX) * (t / r));
        const currY = Math.round(lastMouseY + (targetY - lastMouseY) * (t / r));
        applyBrush(currX, currY);
      }
      applyBrush(loc.x, loc.y);
      lastMouseX = loc.x;
      lastMouseY = loc.y;
    }
  };

  canvas.ontouchmove = function (e) {
    e.preventDefault();
    const loc = windowToCanvas(canvas, e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    const targetX = loc.x, targetY = loc.y;
    if (lastMouseX !== null && lastMouseY !== null) {
      // draw a line from the last place we were to the current place
      const r = Math.sqrt((loc.x - lastMouseX) * (loc.x - lastMouseX) + (loc.y - lastMouseY) * (loc.y - lastMouseY));
      for (let t = 0; t < r; t++) {
        const currX = Math.round(lastMouseX + (targetX - lastMouseX) * (t / r));
        const currY = Math.round(lastMouseY + (targetY - lastMouseY) * (t / r));
        applyBrush(currX, currY);
      }
      applyBrush(loc.x, loc.y);
      lastMouseX = loc.x;
      lastMouseY = loc.y;
    }
  };

  canvas.onmouseover = canvas.onmouseout = canvas.onmouseup = canvas.ontouchend = function (e) {
    e.preventDefault();
    lastMouseX = null;
    lastMouseY = null;
  };

  if (noiseBtn) {
    noiseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      animationCount = 0;
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function(e) {
      e.preventDefault();
      applyBrakes = true;
    });
  }

  animate();
}

// https://stackoverflow.com/questions/47879864/how-can-i-check-if-a-browser-supports-webassembly
function webAssemblySupported() {
  try {
    if (typeof WebAssembly === "object"
      && typeof WebAssembly.instantiate === "function") {
      const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
      if (module instanceof WebAssembly.Module)
        return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
    }
  } catch (e) {}
  return false;
}

document.addEventListener("DOMContentLoaded", function(event) {
  if (!webAssemblySupported()) {
    wave(null);
  } else {
    fetch('wasm/waves.wasm').then(response => response.arrayBuffer())
      .then((bytes) => {
        WebAssembly.instantiate(bytes, {
          env: {
            memoryBase: 0,
            memory: new WebAssembly.Memory({
              initial: 512
            })
          }
        }).then(wave);
      });
  }
});
