const STATUS_DEFAULT = 0;
const STATUS_WALL = 1;
const STATUS_POS_TRANSMITTER = 2;
const STATUS_NEG_TRANSMITTER = 3;

const BRUSH_RADIUS = 28;

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
  const stepsBtn = document.getElementById('stepsBtn');

  if (canvas.width > 512 || canvas.height > 512) {
    // Emscripten doesn't export its memory object, so we have to make one ourselves and import it.
    // But if the size exceeds a certain threshold it will be replaced with one that is inaccessible.
    document.querySelectorAll('.ems').forEach(e => { e.style.display = 'none' });
  }

  let width = canvas.width;
  let height = canvas.height;
  const context = canvas.getContext('2d');

  let imageArray = null;
  let imgData    = null;
  let forceArray = null;
  let applyBrakes = false;

  let steps = 1;

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

    const swap = replacement => {
      replacement.getEntireArray().set(algorithm.getEntireArray());
      algorithm = replacement;
      forceArray = null;
      imageArray = null;
      imgData = null;
    };
    jsBox.addEventListener('click',         () => { swap(jsAlgorithm) });
    clangBox.addEventListener('click',      () => { swap(clangAlgorithm) });
    emscriptenBox.addEventListener('click', () => { swap(emscriptenAlgorithm) });
    waltBox.addEventListener('click',       () => { swap(waltAlgorithm) });
    assemblyBox.addEventListener('click',   () => { swap(assemblyScriptAlgorithm) });
    stepsBtn.addEventListener('click',      () => { steps = parseInt(stepsBtn.value) || 1 });

  } else {
    jsBox.disabled = true;
    clangBox.disabled = true;
    emscriptenBox.disabled = true;
    waltBox.disabled = true;
    assemblyBox.disabled = true;
    stepsBtn.disabled = true;
    document.getElementsByClassName('radio').forEach(btn => btn.style.display = 'none');
    document.getElementById('sorry').style.display = 'block';
  }

  let lastTime = 0;
  let animationCount = 0;
  let fpsCount = 0;
  let accTime = 0;

  let lastMouseX = null, lastMouseY = null;

  function animate() {
    setTimeout(animate, 0);
    // requestAnimationFrame(animate);

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

    for (let i = 0; i < steps; i++) {
      algorithm.step(amplitude, applyBrakes ? 5 : 0);
    }

    if (imageArray === null) {
      imageArray = algorithm.getImageArray();
    }
    if (imgData == null) {
      imgData = context.createImageData(width, height);
    }
    imgData.data.set(imageArray);
    context.putImageData(imgData, 0, 0);

    const now = performance.now();
    fpsCount++;
    if (accTime >= 1000) {
      fps.innerHTML = Math.floor(1000 * fpsCount / accTime);
      fpsCount = 0;
      accTime = 0;
    } else {
      accTime += now - lastTime;
    }
    lastTime = now;
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
  for (let p = -BRUSH_RADIUS; p <= BRUSH_RADIUS; p++) {
    const row = [];
    brushMatrix.push(row);
    for (let q = -BRUSH_RADIUS; q <= BRUSH_RADIUS; q++) {
      const element = Math.floor(0x3FFFFFFF * Math.exp(-0.05 * ((p * p) + (q * q))));
      row.push(element);
    }
  }

  function applyCap(x) {
    return x < -0x40000000 ? -0x40000000 : (x > 0x3FFFFFFF ? 0x3FFFFFFF : x);
  }

  function applyBrush(x, y) {
    if (forceArray === null) {
      forceArray = algorithm.getForceArray();
    }
    for (let p = -BRUSH_RADIUS; p <= BRUSH_RADIUS; p++) {
      const targetY = y + p;
      if (targetY <= 0 || targetY >= height - 1) {
        continue;
      }
      const brushStride = brushMatrix[p + BRUSH_RADIUS];
      for (let q = -BRUSH_RADIUS; q <= BRUSH_RADIUS; q++) {
        const targetX = x + q;
        if (targetX <= 0 || targetX >= width - 1) {
          continue;
        }
        const brushValue = brushStride[q + BRUSH_RADIUS];
        const targetIndex = targetY * width + targetX;
        forceArray[targetIndex] = applyCap(forceArray[targetIndex] + brushValue);
      }
    }
  }

  canvas.onmousedown = e => {
    e.preventDefault();
    applyBrakes = false;
    const loc = windowToCanvas(canvas, e.clientX, e.clientY);
    lastMouseX = loc.x;
    lastMouseY = loc.y;
    applyBrush(loc.x, loc.y);
  };

  canvas.ontouchstart = e => {
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

  canvas.onmousemove = e => {
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

  canvas.ontouchmove = e => {
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

  canvas.onmouseover =
  canvas.onmouseout  =
  canvas.onmouseup   =
  canvas.ontouchend  = e => {
    e.preventDefault();
    lastMouseX = null;
    lastMouseY = null;
  };

  if (noiseBtn) {
    noiseBtn.addEventListener('click', e => {
      e.preventDefault();
      animationCount = 0;
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', e => {
      e.preventDefault();
      applyBrakes = true;
    });
  }

  animate();
}

function scatterTransmitterPoints(algorithm) {
  const statusArray = algorithm.getStatusArray();
  for (let i = 0, len = statusArray.length; i < len; i++) {
    if (statusArray[i] === STATUS_DEFAULT) {
      if (Math.random() < 0.001) {
        statusArray[i] = !(i & 1) ? 2 : 3;
      }
    }
  }
}

function clearTransmitterPoints(algorithm) {
  const statusArray = algorithm.getStatusArray();
  for (let i = 0, len = statusArray.length; i < len; i++) {
    if (statusArray[i] === STATUS_POS_TRANSMITTER || statusArray[i] === STATUS_NEG_TRANSMITTER) {
      statusArray[i] = STATUS_DEFAULT;
    }
  }
}

function drawCircularWall(algorithm) {
  const { width, height } = algorithm;
  const statusArray = algorithm.getStatusArray();
  // Draw a circular wall
  const halfW = width  >>> 1;
  const halfH = height >>> 1;
  const centerX = halfW;
  const centerY = halfH;
  const radius = Math.min(halfW, halfH);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const dx = j - centerX;
      const dy = i - centerY;
      if (dx * dx + dy * dy > radius * radius) {
        const targetIndex = i * width + j;
        statusArray[targetIndex] = 1;
      }
    }
  }
}


function webAssemblySupported() {
  return typeof WebAssembly !== 'undefined' && WebAssembly.validate(Uint32Array.of(0x6D736100, 1).buffer);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!webAssemblySupported()) {
    console.warn('WebAssembly not supported');
    wave(null);
    return;
  }

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

  // Hack: look for a "size" parameter in the URL
  const matches = window.location.href.match(/size=(\d+)/);
  if (matches) {
    const canvas = document.getElementById('canvas');
    canvas.width = canvas.height = parseInt(matches[1]);
  }

  fetch('clang/main.wasm')
    .then(response => response.arrayBuffer())
    .then(bytes =>  WebAssembly.instantiate(bytes, {}))
    .then(wasm => {
      clang = wasm;
      return fetch('emscripten/emscripten.wasm');
    })
    .then(response => response.arrayBuffer())
    .then(bytes =>  WebAssembly.instantiate(bytes, emscriptenImportsObject))
    .then(wasm => {
      emscripten = wasm;
      emscripten.importsObject = emscriptenImportsObject;
      return fetch('walt/waves.wasm');
    })
    .then(response => response.arrayBuffer())
    .then(bytes => WebAssembly.instantiate(bytes, {}))
    .then(wasm => {
      walt = wasm;
      return fetch('as/build/optimized.wasm');
    })
    .then(response => response.arrayBuffer())
    .then(bytes => WebAssembly.instantiate(bytes, {}))
    .then(wasm => {
      assemblyScript = wasm;
      return { clang, emscripten, walt, assemblyScript };
    }).then(wave);
});
