let clang = null;
let emscripten = null;
let walt = null;
let assemblyscript = null;
let emscriptenImportsObject = {
  env: {
    __memory_base: 0,
    __table_base: 0,
    memory: new WebAssembly.Memory({
      initial: 256,
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
  .then(bytes =>  WebAssembly.instantiate(bytes, emscriptenImportsObject))
  .then((wasm) => {
    emscripten = wasm;
    emscripten.importsObject = emscriptenImportsObject;

    return fetch('walt/waves.wasm');
  })
  .then(response => response.arrayBuffer())
  .then(bytes => WebAssembly.instantiate(bytes, {}))
  .then((wasm) => {

    walt = wasm;

    return fetch('as/build/optimized.wasm');
  })
  .then(response => response.arrayBuffer())
  .then(bytes => WebAssembly.instantiate(bytes, {}))
  .then((wasm) => {

    assemblyscript = wasm;

    const width = 5;
    const height = 5;

    const jsAlgorithm = jsWaveAlgorithm();

    const clangAlgorithm = wasmWaveAlgorithm(clang);

    const emscriptenAlgorithm = wasmWaveAlgorithm(emscripten);

    const waltAlgorithm = wasmWaveAlgorithm(walt);

    const assemblyScriptAlgorithm = wasmWaveAlgorithm(assemblyscript);

    const outerDiv = document.getElementById('outer');

    const title = ['JAVASCRIPT', 'CLANG', 'EMSCRIPTEN', 'WALT', 'ASSEMBLYSCRIPT'];

    [jsAlgorithm, clangAlgorithm, emscriptenAlgorithm, waltAlgorithm, assemblyScriptAlgorithm].forEach((algorithm, algorithmIndex) => {
      const algorithmDiv = document.createElement('div');
      algorithmDiv.className = 'algorithm';

      algorithm.init(width, height);
      const unsignedMemory = algorithm.getEntireArray();
      const signedMemory = new Int32Array(unsignedMemory.buffer, unsignedMemory.byteOffset);

      // Plant large and small values in top left and bottom right corners of center 3x3 region
      signedMemory[width * height + width + 1] = 0x3FFFFFFF;
      signedMemory[2 * width * height - width - 2] = -0x40000000;

      for (let run = 0; run < 10; run++) {
        const columnDiv = document.createElement('div');
        columnDiv.className = 'column';
        algorithmDiv.appendChild(columnDiv);

        const pixelsDiv = document.createElement('div');
        pixelsDiv.className = 'pixels';
        columnDiv.appendChild(pixelsDiv);

        const outputDiv = document.createElement('div');
        columnDiv.appendChild(outputDiv);

        algorithm.step(0, 0);

        for (let i = 0; i < width * height; i++) {
          const pixelDiv = document.createElement('div');
          const rgba = unsignedMemory[i];
          const red = rgba & 0xFF;
          const green = (rgba >> 8) & 0xFF;
          const blue = (rgba >> 16) & 0xFF;
          const alpha = ((rgba >> 24) & 0xFF) / 255;
          pixelDiv.style.backgroundColor = `rgba(${red},${green},${blue},${alpha})`;
          pixelsDiv.appendChild(pixelDiv);
        }
        let output = (run === 0 ? `<b>${title[algorithmIndex]}</b>` : '&nbsp;');
        output += ('<br>RGBA<br>');
        for (let i = 0; i < width * height; i++) {
          output += (`${i}\t${unsignedMemory[i].toString(16)}<br>`);
        }
        for (let i = width * height; i < 5 * width * height; i++) {
          if (i === width * height) {
            output += '<br>force:<br>';
          }
          if (i === 2 * width * height) {
            output += '<br>status:<br>';
          }
          if (i === 3 * width * height) {
            output += '<br>u:<br>';
          }
          if (i === 4 * width * height) {
            output += '<br>v:<br>';
          }
          output += (`${i}\t${signedMemory[i]}<br>`);
        }
        outputDiv.innerHTML = output;
      }
      outerDiv.appendChild(algorithmDiv);
    });
  });
