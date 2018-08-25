function wave(canvas, fps, _algorithm) {

  let width = canvas.width;
  let height = canvas.height;
  let algorithm = _algorithm;
  let applyBrakes = false;
  const context = canvas.getContext('2d');

  let imageArray = null;
  let forceArray = null;
  let statusArray = null;

  let timestamps = [];
  let lastFpsJitter = 0;

  let animationCount = 0;

  function animate() {
    setTimeout(animate, 0);

    if (animationCount === 0) {
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
      drawCircularWall();
      applyBrakes = true;
    }

    let amplitude = Math.floor(0x3FFFFFFF * Math.sin(6.283 * animationCount / 100));
    if (animationCount === 100) {
      // Clear noise generator pixels and clear applyBrakes flag
      for (let i = 0; i < statusArray.length; i++) {
        if (statusArray[i] === 2 || statusArray[i] === 3) {
          statusArray[i] = 0;
        }
      }
      applyBrakes = false;
    }

    if (lastX !== null && lastY !== null) {
      applyBrush(lastX, lastY);
    }

    algorithm.singleFrame(amplitude, false, applyBrakes);

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
    for (p = -brushMatrixRadius; p <= brushMatrixRadius; p++) {
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
        // forceArray[targetIndex] = Math.max(forceArray[targetIndex], brushValue);
      }
    }
  }

  let lastX = null, lastY = null;

  function drawCircularWall() {
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
  }

  canvas.onmousedown = function (e) {
    applyBrakes = false;
    const loc = windowToCanvas(canvas, e.clientX, e.clientY);
    lastX = loc.x;
    lastY = loc.y;
    applyBrush(loc.x, loc.y);
  };

  canvas.onmousemove = function (e) {
    const loc = windowToCanvas(canvas, e.clientX, e.clientY);
    const targetX = loc.x, targetY = loc.y;
    if (lastX !== null && lastY !== null) {
      // draw a line from the last place we were to the current place
      const r = Math.sqrt((loc.x - lastX) * (loc.x - lastX) + (loc.y - lastY) * (loc.y - lastY));
      for (let t = 0; t < r; t++) {
        const currX = Math.round(lastX + (targetX - lastX) * (t / r));
        const currY = Math.round(lastY + (targetY - lastY) * (t / r));
        applyBrush(currX, currY);
      }
      applyBrush(loc.x, loc.y);
      lastX = loc.x;
      lastY = loc.y;
    }
  };

  let neverEntered = true;

  canvas.onmouseover = canvas.onmouseout = canvas.onmouseup = function (e) {
    if (neverEntered) {
      applyBrakes = true;
      neverEntered = false;
    }
    lastX = null;
    lastY = null;
  };

  canvas.onmouseout = function(e) {
    applyBrakes = false;
    lastX = null;
    lastY = null;
  };

  const noiseBtn = document.getElementById('noiseBtn');
  if (noiseBtn) {
    noiseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      animationCount = 0;
    });
  }

  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function(e) {
      e.preventDefault();
      applyBrakes = true;
    });
  }

  animate();

  return {
    swapAlgorithm: function(replacement) {
      replacement.getEntireArray().set(algorithm.getEntireArray());
      algorithm = replacement;
      forceArray = null;
      statusArray = null;
      imageArray = null;
    }
  }
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
  const canvas = document.getElementById('canvas');
  const fps = document.getElementById('fps');
  const width = canvas.width;
  const height = canvas.height;
  if (!webAssemblySupported()) {
    document.getElementById('js-box').disabled = true;
    document.getElementById('wasm-box').disabled = true;
    wave(canvas, fps, waveAlgorithm(width, height));
  } else {
    // Use inlined string (https://rot47.net/base64encoder.html)
    const b64 = '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';
    const binaryString = window.atob(b64);
    const len = binaryString.length;
    const arry = new Uint8Array(len);
    for (let i = 0; i < len; i++)        {
      arry[i] = binaryString.charCodeAt(i);
    }
    WebAssembly.instantiate(arry.buffer, {
      env: {
        memoryBase: 0,
        memory: new WebAssembly.Memory({
          initial: 512
        })
      }
    }).then((wasm) => {
      const wasmAlgorithm = cWaveAlgorithm(wasm, width, height);
      const jsAlgorithm = waveAlgorithm(width, height);
      const handle = wave(canvas, fps, jsAlgorithm);
      document.getElementById('js-box').addEventListener('click', function(event) {
        handle.swapAlgorithm(jsAlgorithm);
        console.log('JAVASCRIPT');
      });
      document.getElementById('wasm-box').addEventListener('click', function(event) {
        handle.swapAlgorithm(wasmAlgorithm);
        console.log('WEBASSEMBLY');
      });
    });
    // Use the main.wasm file
    // Not using WebAssembly.instantiateStreaming() because of MIME type error (expects application/wasm)
    /*
    fetch('wasm/main.wasm').then(response => response.arrayBuffer())
      .then((bytes) => {
        return WebAssembly.instantiate(bytes, {
          env: {
            memoryBase: 0,
            memory: new WebAssembly.Memory({
              initial: 512
            })
          }
        });
      })
      .then((wasm) => {
        const wasmAlgorithm = cWaveAlgorithm(wasm, width, height);
        const jsAlgorithm = waveAlgorithm(width, height);
        const handle = wave(document.getElementById('canvas'), jsAlgorithm);
        document.getElementById('js-box').addEventListener('click', function(event) {
          handle.swapAlgorithm(jsAlgorithm);
          console.log('JAVASCRIPT');
        });
        document.getElementById('wasm-box').addEventListener('click', function(event) {
          handle.swapAlgorithm(wasmAlgorithm);
          console.log('WEBASSEMBLY');
        });
      });
   */
  }
});
