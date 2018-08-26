/*
 * This is the JavaScript version; returns an object with the same methods as the object returned by wasmWaveAlgorithm.
 */
function jsWaveAlgorithm(width, height) {

  const ALPHA = 0xFF000000;

  const STATUS_WALL = 1;
  const STATUS_POS_TRANSMITTER = 2;
  const STATUS_NEG_TRANSMITTER = 3;

  const FORCE_DAMPING_BIT_SHIFT = 4;

  const wh = width * height;
  let u0_offset = wh;
  let u1_offset = 2 * wh;
  const vel_offset = 3 * wh;
  const force_offset = 4 * wh;
  const status_offset = 5 * wh;

  // Need room for six Int32 arrays, each with imageWidth * imageHeight elements.
  const heapSize = 6 * 4 * wh;
  const heap = new ArrayBuffer(heapSize);

  const unsignedHeap = new Uint32Array(heap);
  const signedHeap = new Int32Array(heap);

  // Full int32 range is -0x80000000 to 0x7FFFFFFF. Use half.
  function applyCap(x) {
    return x < -0x40000000 ? -0x40000000 : (x > 0x3FFFFFFF ? 0x3FFFFFFF : x);
  }

  function toRGB(signed32bitValue) {
    // Map negative values to red, positive to blue-green, zero to black
    let val = (signed32bitValue >> 22);
    let rgba = ALPHA;
    if (val > 0) {
      rgba = (val << 8) | (val << 16) | ALPHA; // blue-green
    } else if (val < 0) {
      val = val + 1;  // OR: val = Math.max(val, -255);
      rgba = -val | ALPHA; // red
    }
    return rgba;
  }

  /*
   * Applies the wave equation d2u/dt2 = c*c*(d2u/dx2+d2u/dy2)
   * where all derivatives on the right are partial 2nd derivatives
   */
  function singleFrame(signalAmplitude, dampingBitShift = 0) {

    let index = 0, i = 0, j = 0;

    let uCen = 0, uNorth = 0, uSouth = 0, uEast = 0, uWest = 0;

    for (let cycle = 0; cycle < 2; cycle++) {
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
          const status = signedHeap[status_offset + index];
          if (status === STATUS_WALL) {
            index++;
            continue;
          }
          if (status === STATUS_POS_TRANSMITTER) {
            signedHeap[u1_offset + index] = signalAmplitude;
            signedHeap[vel_offset + index] = 0;
            signedHeap[force_offset + index] = 0;
            index++;
            continue;
          }
          if (status === STATUS_NEG_TRANSMITTER) {
            signedHeap[u1_offset + index] = -signalAmplitude;
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
          force -=(force >> FORCE_DAMPING_BIT_SHIFT);
          signedHeap[force_offset + index] = force;

          if (dampingBitShift) {
            vel -= (vel >> dampingBitShift);
          }
          signedHeap[vel_offset + index] = vel;
          index++;
        }
      }
      const swap = u0_offset;
      u0_offset = u1_offset;
      u1_offset = swap;
    }

    index = 0;
    for (i = 0; i < height; i++) {
      for (j = 0; j < width; j++) {
        if (signedHeap[status_offset + index] === 1) {
          unsignedHeap[index] = 0x00000000;
        } else {
          unsignedHeap[index] = toRGB(signedHeap[u0_offset + index]);
        }
        index++;
      }
    }
  }

  return {
    getImageArray: function() {
      return new Uint8ClampedArray(heap, 0, 4 * wh);
    },
    getForceArray: function() {
      return new Int32Array(heap, 4 * force_offset, wh);
    },
    getStatusArray: function() {
      return new Int32Array(heap, 4 * status_offset, wh);
    },
    getEntireArray: function() {
      return unsignedHeap;
    },
    singleFrame
  };
}

function wasmWaveAlgorithm(wasm, width, height) {

  const instance = wasm.instance;

  instance.exports.init(width, height);

  const startByteOffset = instance.exports.getStartByteOffset();

  // These are int32 offsets- multiply by 4 to get byte offsets.
  const wh = width * height;
  const force_offset = 4 * wh;
  const status_offset = 5 * wh;

  const heap = instance.exports.memory.buffer;

  return {
    // The "output" from WASM
    getImageArray: function() {
      return new Uint8ClampedArray(heap, startByteOffset, 4 * wh);
    },
    // Input to WASM: mouse movements cause writes to this array
    getForceArray: function() {
      return new Int32Array(heap, startByteOffset + (4 * force_offset), wh);
    },
    // Input to WASM: wall and transmitter statuses can be set programmatically
    getStatusArray: function() {
      return new Int32Array(heap, startByteOffset + (4 * status_offset), wh);
    },
    // For bulk copying, etc.
    getEntireArray: function() {
      return new Uint32Array(heap, startByteOffset, 6 * wh);
    },
    // The main hot spot function that needs to run in WebAssembly:
    singleFrame: function(signalAmplitude, drag = false) {
      instance.exports.singleFrame(signalAmplitude, drag);
    },
  };
}

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
      // Hundredth frame- clear noise generator pixels and clear applyBrakes flag
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
      }
    }
  }

  canvas.onmousedown = canvas.ontouchstart = function (e) {
    applyBrakes = false;
    const loc = windowToCanvas(canvas, e.clientX, e.clientY);
    lastMouseX = loc.x;
    lastMouseY = loc.y;
    applyBrush(loc.x, loc.y);
  };

  canvas.onmousemove = canvas.ontouchmove = function (e) {
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

  canvas.onmouseover = canvas.onmouseout = canvas.onmouseup = canvas.ontouchend = function (e) {
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
    // Use inlined string (https://rot47.net/base64encoder.html)
    const b64 = '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';
    const binaryString = window.atob(b64);
    const len = binaryString.length;
    const unsigned = new Uint8Array(len);
    for (let i = 0; i < len; i++)        {
      unsigned[i] = binaryString.charCodeAt(i);
    }
    WebAssembly.instantiate(unsigned.buffer, {
      env: {
        memoryBase: 0,
        memory: new WebAssembly.Memory({
          initial: 512
        })
      }
    }).then(wave);
  }
});