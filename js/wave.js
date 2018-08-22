function wave(canvas) {

  let width = canvas.width;
  let height = canvas.height;
  let applyBrakes = false;
  const context = canvas.getContext('2d');

  const algorithm = waveAlgorithm(width, height);
  let startTime = Date.now();

  function animate() {
    if (lastX !== null && lastY !== null) {
     applyBrush(lastX, lastY);
    }
    algorithm.iterate(Math.floor(0x3FFFFFFF * Math.sin(3 * (Date.now() - startTime) / 1000)), false, applyBrakes);
    const arr = algorithm.getImageArray();
    const imgData = context.createImageData(width, height);
    imgData.data.set(arr);
    context.putImageData(imgData, 0, 0);
    setTimeout(animate, 1); // 1 ms delay
  }

  /*
  if (!boosted) {
    algorithm = waveAlgorithm(width, height);

    setTimeout(animate, 1); // 1 ms delay
  } else {
    // Need room for five Int32 arrays, each with width * height elements.
    const canvas_offset = 0;
    const force_offset = 4 * width * height;
    const pageSize = 0x80000; // This is 64k. Older version used 0x400000 (about 4MB)

    const numPages = Math.ceil((5 * 4 * width * height) / pageSize);
    const memory = new WebAssembly.memory({ initial: numPages });
    const heap = memory.buffer;

    fetch('wave.masm', {
      imports: {
        memory: memory,
        width: width,
        height: height,
      }
    }).then(function(obj) {

        algorithm = {
          getForceArray: function() {
            return new Int32Array(heap, 4 * force_offset, 4 * width * height);
          },
          getFlagsArray: function() {
            return new Int32Array(heap, 4 * flags_offset, 4 * width * height);
          },
          getImageArray: function() {
            return new Uint8ClampedArray(heap, canvas_offset, 4 * width * height);
          },
          iterate: function(forceAmplitude, skipRGB, applyBrakes) {
            obj.exports.iterate(forceAmplitude, skipRGB, applyBrakes);
          }
        };

        setTimeout(animate, 10);
      });
  }
  */

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
    const forceArray = algorithm.getForceArray();
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
  const flagsArray = algorithm.getFlagsArray();

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

  canvas.onmouseenter = function(e) {
    applyBrakes = true;
  };

  canvas.onmouseout = function(e) {
    applyBrakes = false;
    console.log('onmouseout');
    lastX = null;
    lastY = null;
  };

  initializeNoise();
  animate();
}

document.addEventListener("DOMContentLoaded", function(event) {
  // console.log('RUNNING.');
  wave(document.getElementById('canvas'), false);
});
