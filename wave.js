const STATUS_DEFAULT = 0;
const STATUS_WALL = 1;
const STATUS_POS_TRANSMITTER = 2;
const STATUS_NEG_TRANSMITTER = 3;

function wave(modules) {

  const canvas = document.getElementById('canvas');
  const fps = document.getElementById('fps');
  const jsBox = document.getElementById('js-box');
  const clangBox = document.getElementById('clang-box');
  const emscriptenBox = document.getElementById('emscripten-box');
  const waltBox = document.getElementById('walt-box');
  const assemblyBox = document.getElementById('assembly-box');
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
  let clangAlgorithm = null;
  let emscriptenAlgorithm = null;
  let waltAlgorithm = null;
  let assemblyScriptAlgorithm = null;
  if (modules) {

    if (modules.clang) {
      clangAlgorithm = wasmWaveAlgorithm(modules.clang);
      clangAlgorithm.init(width, height);
    }

    if (modules.emscripten) {
      emscriptenAlgorithm = wasmWaveAlgorithm(modules.emscripten);
      emscriptenAlgorithm.init(width, height);
    }

    if (modules.walt) {
      waltAlgorithm = wasmWaveAlgorithm(modules.walt);
      waltAlgorithm.init(width, height);
    }

    if (modules.assemblyScript) {
      assemblyScriptAlgorithm = wasmWaveAlgorithm(modules.assemblyScript);
      assemblyScriptAlgorithm.init(width, height);
    }

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
    clangBox.addEventListener('click', function(event) {
      swap(clangAlgorithm);
    });
    emscriptenBox.addEventListener('click', function(event) {
      swap(emscriptenAlgorithm);
    });
    waltBox.addEventListener('click', function(event) {
      swap(waltAlgorithm);
    });
    assemblyBox.addEventListener('click', function(event) {
      swap(assemblyScriptAlgorithm);
    });

  } else {
    jsBox.disabled = true;
    clangBox.disabled = true;
    emscriptenBox.disabled = true;
    waltBox.disabled = true;
    assemblyBox.disabled = true;
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
      scatterTransmitterPoints(algorithm);
      drawCircularWall(algorithm);
      applyBrakes = true;
    }

    if (animationCount === 100) {
      // Hundredth frame- clear noise generator pixels and clear applyBrakes flag
      clearTransmitterPoints(algorithm);
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

function scatterTransmitterPoints(algorithm) {
  const statusArray = algorithm.getStatusArray();
  for (let i = 0; i < statusArray.length; i++) {
    if (statusArray[i] === STATUS_DEFAULT) {
      if (Math.random() < 0.001) {
        statusArray[i] = (i % 2 === 0) ? 2 : 3;
      }
    }
  }
}

function clearTransmitterPoints(algorithm) {
  const statusArray = algorithm.getStatusArray();
  for (let i=0; i < statusArray.length; i++) {
    if (statusArray[i] === STATUS_POS_TRANSMITTER || statusArray[i] === STATUS_NEG_TRANSMITTER) {
      statusArray[i] = STATUS_DEFAULT;
    }
  }
}

function drawCircularWall(algorithm) {
  const { width, height } = algorithm;
  const statusArray = algorithm.getStatusArray();
  // Draw a circular wall
  const centerX = algorithm.width / 2;
  const centerY = algorithm.height / 2;
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

    let emscripten = null;
    let clang = null;
    let walt = null;
    let assemblyScript = null;

    // Emscripten doesn't support exporting memory, only importing
    let emscriptenImportsObject = {
      env: {
        __memory_base: 0,
        __table_base: 0,
        memory: new WebAssembly.Memory({
          initial: 512,
        }),
        table: new WebAssembly.Table({
          initial: 0,
          element: 'anyfunc',
        })
      }
    };

    fetch('clang/main.wasm')
      .then(response => response.arrayBuffer())
      .then((bytes) =>  WebAssembly.instantiate(bytes, {}))
      .then((wasm) => {
        clang = wasm;

        return fetch('emscripten/emscripten.wasm');
      })
      .then(response => response.arrayBuffer())
      .then((bytes) =>  WebAssembly.instantiate(bytes, emscriptenImportsObject))
      .then((wasm) => {
        emscripten = wasm;
        emscripten.importsObject = emscriptenImportsObject;

        return fetch('walt/waves.wasm');
      })
      .then(response => response.arrayBuffer())
      .then((bytes) => WebAssembly.instantiate(bytes, {}))
      .then((wasm) => {
        walt = wasm;

        return fetch('as/build/optimized.wasm');
      })
      .then(response => response.arrayBuffer())
      .then((bytes) => WebAssembly.instantiate(bytes, {}))
      .then((wasm) => {
        assemblyScript = wasm;

        return { clang, emscripten, walt, assemblyScript };
      }).then(wave);
  }
});
