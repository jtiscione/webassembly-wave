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
    instance.exports.init(width, height);
    const offset = instance.exports.getStartByteOffset();
    output += (`offset: ${offset}<br>`);
    const linearMemory = new Uint32Array(instance.exports.memory.buffer, offset, 6 * width * height);
    const signedMemory = new Int32Array(instance.exports.memory.buffer, offset, 6 * width * height);

    linearMemory[137] = 2;   // Stick a transmitter pixel right in the middle
    signedMemory[37] = 1000;  // and stick the value in u1 so our first pass doesn't confuse us while debugging.

    instance.exports.singleFrame(0x3FFFFFFF >> 1, 0, 0);
    instance.exports.singleFrame(0x3FFFFFFF >> 2, 0, 0);
    instance.exports.singleFrame(0x3FFFFFFF >> 3, 0, 0);
    instance.exports.singleFrame(0x3FFFFFFF >> 4, 0, 0);
    instance.exports.singleFrame(0x3FFFFFFF >> 5, 0, 0);
    output += ('<br>RGBA:<br>');
    for (let i = 0; i < 24; i++) {
      output += (`${i}\t${linearMemory[i].toString(16)}<br>`);
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
    document.getElementById('output').innerHTML = output;
  }
);
