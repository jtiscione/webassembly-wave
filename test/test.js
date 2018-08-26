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
    let output = '';
    const instance = result.instance;
    const width = 5;
    const height = 5;
    const algorithm = instance.exports;
    algorithm.init(width, height);
    const offset = algorithm.getStartByteOffset();
    console.log('offset', offset);
    const unsignedMemory = new Uint32Array(instance.exports.memory.buffer, offset, 6 * width * height);
    const signedMemory = new Int32Array(instance.exports.memory.buffer, offset, 6 * width * height);

    const outerDiv = document.getElementById('outer');

    // Set initial conditions: designate outer boundary as a wall
    for (let i=0; i < 5; i++) {
      signedMemory[125 + i] = 1;
      signedMemory[145 + i] = 1;
      signedMemory[125 + (5 * i)] = 1;
      signedMemory[129 + (5 * i)] = 1;
    }
    // Plant large and small values in top left and right corners
    signedMemory[31] = 0x3FFFFFFF;
    signedMemory[43] = -0x40000000;

    for (let run = 0; run < 8; run++) {
      const columnDiv = document.createElement('div');
      columnDiv.className = 'column';
      outerDiv.appendChild(columnDiv);

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
      let output = ('<br>RGBA:<br>');
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
  });
