function wave(canvas, algorithm) {

  let width = canvas.width;
  let height = canvas.height;
  let applyBrakes = false;
  const context = canvas.getContext('2d');

  let startTime = Date.now();

  let msgCount = 0;

  let imageArray = null;

  function animate() {
    if (lastX !== null && lastY !== null) {
     applyBrush(lastX, lastY);
    }
    if (msgCount < 100) {
      console.time('iterate');
      algorithm.iterate(Math.floor(0x3FFFFFFF * Math.sin(3 * (Date.now() - startTime) / 1000)), false, applyBrakes);
      console.timeEnd('iterate');
    } else {
      algorithm.iterate(Math.floor(0x3FFFFFFF * Math.sin(3 * (Date.now() - startTime) / 1000)), false, applyBrakes);
    }
    msgCount++;
    if (imageArray === null) {
      imageArray = algorithm.getImageArray();
    }
    const imgData = context.createImageData(width, height);
    imgData.data.set(imageArray);
    context.putImageData(imgData, 0, 0);
    setTimeout(animate, 1); // 1 ms delay
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

  let forceArray = null;

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
  let flagsArray = null;

  function drawCircularWall() {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min((width / 2), (height / 2));
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        let dist = Math.sqrt(((i - centerY) * (i - centerY)) + ((j - centerX) * (j - centerX)));
        if (dist > radius) {
          const targetIndex = i * width + j;
          flagsArray[targetIndex] = 1;
        }
      }
    }
  }

  function initializeNoise() {
    if (flagsArray === null) {
      flagsArray = algorithm.getFlagsArray();
    }
    for (let i = 0; i < flagsArray.length; i++) {
      if (Math.random() < 0.01) {
        flagsArray[i] = (i %2 === 0) ? 2 : 3;
      }
    }

    drawCircularWall();

    for (let j = 0; j < 100; j++) {
      const amplitude = (Math.sin(6.283 * j / 50)
        + Math.sin(6.283 * j / 100)
        + Math.sin(6.283 * j / 200)) / 3;
      algorithm.iterate(
        Math.floor(0x3FFFFFFF * amplitude), true, false);
    }

    for (let i = 0; i < flagsArray.length; i++) {
      if (flagsArray[i] === 2 || flagsArray[i] === 3) {
        flagsArray[i] = 0;
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

  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function(e) {
      e.preventDefault();
      applyBrakes = true;
    });
  }

  initializeNoise();
  animate();
}

document.addEventListener("DOMContentLoaded", function(event) {
  let width = canvas.width;
  let height = canvas.height;
  const useJS = false;
  if (useJS) {
    wave(document.getElementById('canvas'), waveAlgorithm(width, height));
  } else {

    // From https://rot47.net/base64encoder.html
    const b64 = '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';
    const binaryString = window.atob(b64);
    const len = binaryString.length;
    const arry = new Uint8Array(len);
    for (var i = 0; i < len; i++)        {
      arry[i] = binaryString.charCodeAt(i);
    }
    const bytes = arry.buffer;

    const importObject = {
      env: {
        memoryBase: 0,
        tableBase: 0,
        memory: new WebAssembly.Memory({
          initial: 512
        }),
        table: new WebAssembly.Table({
          initial: 0,
          element: 'anyfunc'
        })
      }
    };
    WebAssembly.instantiate(bytes, importObject).then((wasm) => {
      const algorithm = cWaveAlgorithm(wasm, width, height);
      wave(document.getElementById('canvas'), algorithm);
    });

    /*
    Using the main.wasm file (this should be changed to instantiateStreaming())
    fetch('wasm/main.wasm').then(response => response.arrayBuffer())
      .then((bytes) => {
        return WebAssembly.instantiate(bytes, importObject);
      })
      .then((wasm) => {
        const algorithm = cWaveAlgorithm(wasm, width, height);
        wave(document.getElementById('canvas'), algorithm);
      });
    */
  }
});
