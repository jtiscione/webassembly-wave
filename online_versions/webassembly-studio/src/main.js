function jsWaveAlgorithm() {
  const ALPHA = 0xFF000000;

  const STATUS_DEFAULT = 0;
  const STATUS_WALL = 1;
  const STATUS_POS_TRANSMITTER = 2;
  const STATUS_NEG_TRANSMITTER = 3;

  const FORCE_DAMPING_BIT_SHIFT = 4;

  // Full int32 range is -0x80000000 to 0x7FFFFFFF. Use half.
  function applyCap(x) {
    return x < -0x40000000 ? -0x40000000 : (x > 0x3FFFFFFF ? 0x3FFFFFFF : x);
  }

  function toRGB(signed32bitValue) {
    // Map negative values to red, positive to blue-green, zero to black
    let val = (signed32bitValue >> 22);
    let rgba = ALPHA;
    if (val > 0) {
      rgba = val | (val << 8) | ALPHA; // yellow
    } else if (val < 0) {
      val = val + 1;  // OR: val = Math.max(val, -255);
      rgba = -val | ((-val) << 16) | ALPHA; // purple
    }
    return rgba;
  }

  return {

    init(width, height) {

      this.width = width;
      this.height = height;
      const area = width * height;
      this.area = area;

      // Need room for five Int32 arrays, each with imageWidth * imageHeight elements.
      const heap = new ArrayBuffer(5 * 4 * area);
      this.heap = heap;

      this.image = new Int32Array(heap, 0, area);
      this.force = new Int32Array(heap, 4 * area, area);
      this.status = new Int32Array(heap, 8 * area, area);
      this.u = new Int32Array(heap, 12 * area, area);
      this.v = new Int32Array(heap, 16 * area, area);

      // To avoid falling off edges, mark the pixels along the edge as being wall pixels.
      // Walls implement a Dirichlet boundary condition by setting u=0.
      for (let i = 0; i < height; i++) {
        this.status[i * width] = STATUS_WALL; // left edge
        this.status[(i * width) + (width - 1)] = STATUS_WALL; // right edge
      }
      for (let j = 0; j < width; j++) {
        this.status[j] = STATUS_WALL; // top edge
        this.status[(width * (height - 1)) + j] = STATUS_WALL; // bottom edge
      }
    },

    step(signalAmplitude, dampingBitShift = 0) {

      const { width, area, image, force, status, u, v } = this;

      // First loop: look for noise generator pixels and set their values in u
      for (let i = 0; i < area; i++) {
        if (status[i] === STATUS_POS_TRANSMITTER) {
          u[i] = signalAmplitude;
          v[i] = 0;
          force[i] = 0;
        }
        if (status[i] === STATUS_NEG_TRANSMITTER) {
          u[i] = -signalAmplitude;
          v[i] = 0;
          force[i] = 0;
        }
      }

      // Second loop: apply wave equation at all pixels
      for (let i = 0; i < area; i++) {
        if (status[i] === STATUS_DEFAULT) {
          const uCen = u[i];
          const uNorth = u[i - width];
          const uSouth = u[i + width];
          const uEast = u[i + 1];
          const uWest = u[i - 1];
          const uxx = (((uWest + uEast) >> 1) - uCen);
          const uyy = (((uNorth + uSouth) >> 1) - uCen);
          let vel = v[i] + (uxx >> 1) + (uyy >> 1);
          if (dampingBitShift) {
            vel -= (vel >> dampingBitShift);
          }
          v[i] = applyCap(vel);
        }
      }

      // Apply forces from mouse
      for (let i = 0; i < area; i++) {
        if (status[i] === STATUS_DEFAULT) {
          let f = force[i];
          u[i] = applyCap(f + applyCap(u[i] + v[i]));
          f -= (f >> FORCE_DAMPING_BIT_SHIFT);
          force[i] = f;
        }
      }

      // Final pass: calculate color values
      for (let i = 0; i < area; i++) {
        if (status[i] === STATUS_WALL) {
          image[i] = 0x00000000;
        } else {
          image[i] = toRGB(u[i]);
        }
      }
    },

    getImageArray() {
      return new Uint8ClampedArray(this.heap, 0, 4 * this.area);
    },

    getForceArray() {
      return this.force;
    },

    getStatusArray() {
      return this.status;
    },

    getEntireArray() {
      return new Uint32Array(this.heap);
    },
  };
}

function wasmWaveAlgorithm(wasm) {
  return {
    module: wasm,
    // The initialization function
    init(width, height) {

      this.width = width;
      this.height = height;
      const area = width * height;
      this.area = area;

      this.byteOffset = 65536; // Step above the first 64K to clear the stack

      const instance = wasm.instance;
      const memory = instance.exports.memory;
      const pages = 1 + ((5 * 4 * width * height) >> 16);
      memory.grow(pages);

      const heap = memory.buffer;
      this.heap = heap;

      this.force = new Int32Array(heap, this.byteOffset + (4 * area), area);
      this.status = new Int32Array(heap, this.byteOffset + (8 * area), area);

      instance.exports.init(heap, this.byteOffset, width, height);
    },
    // The main hot spot function:
    step(signalAmplitude, drag = false) {
      this.module.instance.exports.step(signalAmplitude, drag ? 5 : 0);
    },
    // The "output" from WASM
    getImageArray() {
      return new Uint8ClampedArray(this.heap, this.byteOffset, 4 * this.area);
    },
    // Input to WASM: mouse movements cause writes to this array
    getForceArray() {
      return this.force;
    },
    // Input to WASM: wall and transmitter statuses can be set programmatically
    getStatusArray() {
      return this.status;
    },
    // For bulk copying, etc.
    getEntireArray() {
      return new Uint32Array(this.heap, this.byteOffset, 5 * this.area);
    },
  };
}

function wave(modules) {

  const canvas = document.getElementById('canvas');
  const fps = document.getElementById('fps');
  const jsBox = document.getElementById('js-box');
  const emscriptenBox = document.getElementById('wasm-box');
  const noiseBtn = document.getElementById('noiseBtn');
  const clearBtn = document.getElementById('clearBtn');

  let width = canvas.width;
  let height = canvas.height;
  const context = canvas.getContext('2d');

  let imageArray = null;
  let forceArray = null;
  let statusArray = null;
  let applyBrakes = false;

  const jsAlgorithm = jsWaveAlgorithm();
  jsAlgorithm.init(width, height);
  let algorithm = jsAlgorithm;
  let emscriptenAlgorithm = null;
  if (modules) {
    if (modules.emscripten) {
      emscriptenAlgorithm = wasmWaveAlgorithm(modules.emscripten);
      emscriptenAlgorithm.init(width, height);
    }

    const swap = function(replacement) {
      replacement.getEntireArray().set(algorithm.getEntireArray());
      algorithm = replacement;
      forceArray = null;
      statusArray = null;
      imageArray = null;
    };
    console.log('jsBox', jsBox);
    jsBox.addEventListener('click', function(event) {
      swap(jsAlgorithm);
    });
    console.log("emscriptenBox", emscriptenBox);
    emscriptenBox.addEventListener('click', function(event) {
      swap(emscriptenAlgorithm);
    });
  } else {
    jsBox.disabled = true;
    emscriptenBox.disabled = true;
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
          statusArray[i] = (i % 2 === 0) ? 2 : 3;
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
    algorithm.step(amplitude, (applyBrakes ? 5 : 0));

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
    function applyCap(x) {
      return x < -0x40000000 ? -0x40000000 : (x > 0x3FFFFFFF ? 0x3FFFFFFF : x);
    }
    if (forceArray === null) {
      forceArray = algorithm.getForceArray();
    }
    for (let p = -brushMatrixRadius; p <= brushMatrixRadius; p++) {
      const targetY = y + p;
      if (targetY <= 0 || targetY >= height - 1) {
        continue;
      }
      for (let q = -brushMatrixRadius; q <= brushMatrixRadius; q++) {
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
    for (let i = 0; i < e.targetTouches.length; i++) {
      const touch = e.targetTouches[i];
      const loc = windowToCanvas(canvas, touch.clientX, touch.clientY);
      lastMouseX = loc.x;
      lastMouseY = loc.y;
      applyBrush(loc.x, loc.y);
    }
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
    if (lastMouseX !== null && lastMouseY !== null) {
      for (let i = 0; i < e.targetTouches.length; i++) {
        const touch = e.targetTouches[i];
        const loc = windowToCanvas(canvas, touch.clientX, touch.clientY);
        const targetX = loc.x, targetY = loc.y;
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

document.addEventListener("DOMContentLoaded", function(event) {
  let emscripten = null;
  fetch('../out/main.wasm')
    .then(response => response.arrayBuffer())
    .then(bytes =>  WebAssembly.instantiate(bytes, {}))
    .then(wasm => ({ emscripten: wasm }))
    .then(wave)
    .catch(console.log);
});
