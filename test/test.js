fetch('../wasm/waves.wasm').then(response => response.arrayBuffer())
  .then((bytes) => {
    return WebAssembly.instantiate(bytes, {
      env: {
        memoryBase: 0,
        memory: new WebAssembly.Memory({
          initial: 512
        }),
      }
    });
  })
  .then((result) => {

    const width = 5;
    const height = 5;

    const jsAlgorithm = jsWaveAlgorithm(width, height);
    const wasmAlgorithm = wasmWaveAlgorithm(result, width, height);

    const outerDiv = document.getElementById('outer');

    [jsAlgorithm, wasmAlgorithm].forEach((algorithm, algorithmIndex) => {
      const algorithmDiv = document.createElement('div');
      algorithmDiv.className = 'algorithm';

      const unsignedMemory = algorithm.getEntireArray();
      const signedMemory = new Int32Array(unsignedMemory.buffer, unsignedMemory.byteOffset);

      // Plant large and small values in top left and bottom right corners of center 3x3 region
      signedMemory[31] = 0x3FFFFFFF;
      signedMemory[43] = -0x40000000;

      for (let run = 0; run < 10; run++) {
        const columnDiv = document.createElement('div');
        columnDiv.className = 'column';
        algorithmDiv.appendChild(columnDiv);

        const pixelsDiv = document.createElement('div');
        pixelsDiv.className = 'pixels';
        columnDiv.appendChild(pixelsDiv);

        const outputDiv = document.createElement('div');
        columnDiv.appendChild(outputDiv);

        algorithm.singleFrame(0, 0);

        for (let i = 0; i < 25; i++) {
          const pixelDiv = document.createElement('div');
          const rgba = unsignedMemory[i];
          const red = rgba & 0xFF;
          const green = (rgba >> 8) & 0xFF;
          const blue = (rgba >> 16) & 0xFF;
          const alpha = ((rgba >> 24) & 0xFF) / 255;
          pixelDiv.style.backgroundColor = `rgba(${red},${green},${blue},${alpha})`;
          pixelsDiv.appendChild(pixelDiv);
        }
        let output = (run === 0 ? ['<b>JAVASCRIPT</b>', '<b>WEBASSEMBLY</b>'][algorithmIndex] : '&nbsp;');
        output += ('<br>RGBA<br>');
        for (let i = 0; i < 24; i++) {
          output += (`${i}\t${unsignedMemory[i].toString(16)}<br>`);
        }
        for (let i = 25; i < 150; i++) {
          if (i === 25) {
            output += '<br>u:<br>';
          }
          if (i === 50) {
            output += '<br>swap:<br>';
          }
          if (i === 75) {
            output += '<br>v:<br>';
          }
          if (i === 100) {
            output += '<br>force:<br>';
          }
          if (i === 125) {
            output += '<br>status:<br>';
          }
          output += (`${i}\t${signedMemory[i]}<br>`);
        }
        outputDiv.innerHTML = output;
      }
      outerDiv.appendChild(algorithmDiv);
    });
  });
