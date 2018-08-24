// TODO: implement this function in WebAssembly
function waveAlgorithm(width, height) {

  const wh = width * height;

  const dragBitShift = 6;
  const forceDampingBitShift = 4;

  const canvas_offset = 0;
  let u0_offset = wh;
  let u1_offset = 2 * wh;
  const vel_offset = 3 * wh;
  const force_offset = 4 * wh;
  const flags_offset = 5 * wh;

  // Need room for six Int32 arrays, each with width * height elements.
  const heapSize = 6 * 4 * wh;
  const heap = new ArrayBuffer(heapSize);

  const unsignedHeap = new Uint32Array(heap);
  const signedHeap = new Int32Array(heap);

  // Full int32 range is -0x80000000 to 0x7FFFFFFF. Use half.
  function applyCap(x) {
    return x < -0x40000000 ? -0x40000000 : (x > 0x3FFFFFFF ? 0x3FFFFFFF : x);
  }
  function toRGB(signed32bitValue) {
    let val = (signed32bitValue >> 22);
    let rgba = 0;
    let alpha = (255 << 24);
    if (val > 0) {
      rgba = (val << 8) | (val << 16) | alpha; // blue-green
    } else if (val < 0) {
      val = val + 1;
      rgba = (-val) | alpha; // red
    } else {
      rgba = alpha; // clear
    }
    return rgba;
  }

  /*
   * Applies the wave equation d2u/dt2 = c*c*(d2u/dx2+d2u/dy2)
   * where all derivatives on the right are partial 2nd derivatives
   */
  function iterate(signalAmplitude, skipRGB = false, drag = false) {
    let index = 0, i = 0, j = 0;
    let uCen = 0, uNorth = 0, uSouth = 0, uEast = 0, uWest = 0;
    const totalCycles = 2;
    for (let cycle = 0; cycle < totalCycles; cycle++) {
      index = 0;
      for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
          if (i === 0) {
            index++;
            continue;
          }
          if (i + 1 === height) {
            index++;
            continue;
          }
          if (j === 0) {
            index++;
            continue;
          }
          if (j + 1 === width) {
            index++;
            continue;
          }
          const flags = signedHeap[flags_offset + index];
          if (flags === 1) {
            index++;
            continue;
          }
          if (flags === 2) {
            signedHeap[u0_offset + index] = signalAmplitude;
            signedHeap[vel_offset + index] = 0;
            signedHeap[force_offset + index] = 0;
            index++;
            continue;
          }
          if (flags === 3) {
            signedHeap[u0_offset + index] = -signalAmplitude;
            signedHeap[vel_offset + index] = 0;
            signedHeap[force_offset + index] = 0;
            index++;
            continue;
          }
          uCen = signedHeap   [u0_offset + index];
          uNorth = signedHeap[u0_offset + index - width];
          uSouth = signedHeap[u0_offset + index + width];
          uWest = signedHeap[u0_offset + index - 1];
          uEast = signedHeap[u0_offset + index + 1];

          const uxx = (((uWest + uEast) >> 1) - uCen);
          const uyy = (((uNorth + uSouth) >> 1) - uCen);

          let vel = signedHeap[vel_offset + index];
          vel = vel + (uxx >> 1);
          vel = vel + (uyy >> 1);
          vel = applyCap(vel);

          let force = signedHeap[force_offset + index];

          let u1 = applyCap(force + applyCap(uCen + vel));
          signedHeap[u1_offset + index] = u1;

          force -=(force >> forceDampingBitShift);
          signedHeap[force_offset + index] = force;

          if (drag) {
            vel -= (vel >> dragBitShift);
          }

          signedHeap[vel_offset + index] = vel;

          index++;
        }
      }

      const swap = u0_offset;
      u0_offset = u1_offset;
      u1_offset = swap;
    }

    if (!skipRGB) {
      index = 0;
      for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
          if (signedHeap[flags_offset + index] === 1) {
            unsignedHeap[canvas_offset + index] = 0x00000000;
          } else {
            unsignedHeap[canvas_offset + index] = toRGB(signedHeap[u0_offset + index]);
          }
          index++;
        }
      }
    }
  }

  return {
    getForceArray: function() {
      return new Int32Array(heap, 4 * force_offset, wh);
    },
    getFlagsArray: function() {
      return new Int32Array(heap, 4 * flags_offset, wh);
    },
    getImageArray: function() {
      return new Uint8ClampedArray(heap, 4 * canvas_offset, 4 * wh);
    },
    iterate: iterate,
  };
}

function wave(canvas) {

  let imageWidth = canvas.width;
  let imageHeight = canvas.height;
  let applyBrakes = false;
  const context = canvas.getContext('2d');

  const algorithm = waveAlgorithm(imageWidth, imageHeight);
  let startTime = Date.now();

  let imageArray = null;

  function animate() {
    if (lastX !== null && lastY !== null) {
      applyBrush(lastX, lastY);
    }
    algorithm.iterate(Math.floor(0x3FFFFFFF * Math.sin(3 * (Date.now() - startTime) / 1000)), false, applyBrakes);
    if (imageArray === null) {
      imageArray = algorithm.getImageArray();
    }
    const imgData = context.createImageData(imageWidth, imageHeight);
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
      if (targetY <= 0 || targetY >= imageHeight - 1) {
        continue;
      }
      function applyCap(x) {
        return x < -0x40000000 ? -0x40000000 : (x > 0x3FFFFFFF ? 0x3FFFFFFF : x);
      }
      for (q = -brushMatrixRadius; q <= brushMatrixRadius; q++) {
        const targetX = x + q;
        if (targetX <= 0 || targetX >= imageWidth - 1) {
          continue;
        }
        const brushValue = brushMatrix[p + brushMatrixRadius][q + brushMatrixRadius];
        const targetIndex = targetY * imageWidth + targetX;
        forceArray[targetIndex] += brushValue;
        forceArray[targetIndex] = applyCap(forceArray[targetIndex]);
      }
    }
  }

  let lastX = null, lastY = null;
  let flagsArray = null;

  function drawCircularWall() {
    const centerX = imageWidth / 2;
    const centerY = imageHeight / 2;
    const radius = Math.min((imageWidth / 2), (imageHeight / 2));
    for (let i = 0; i < imageHeight; i++) {
      for (let j = 0; j < imageWidth; j++) {
        let dist = Math.sqrt(((i - centerY) * (i - centerY)) + ((j - centerX) * (j - centerX)));
        if (dist > radius) {
          const targetIndex = i * imageWidth + j;
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

    for (let j = 0; j < 50; j++) {
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

  canvas.onmouseover = canvas.onmouseup = function (e) {
    if (neverEntered) {
      applyBrakes = true;
      neverEntered = false;
    }
    lastX = null;
    lastY = null;
  };

  canvas.onmouseout = function(e) {
    applyBrakes = false;
    console.log('onmouseout');
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
  wave(document.getElementById('canvas'), false);
});
