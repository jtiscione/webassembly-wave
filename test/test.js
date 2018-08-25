const width = 5;
const height = 5;
const algorithm = jsWaveAlgorithm(width, height);
const unsignedMemory = algorithm.getEntireArray();
const signedMemory = new Int32Array(unsignedMemory.buffer, 0);
unsignedMemory[137] = 2;   // Stick a transmitter pixel right in the middle
// signedMemory[37] = 0x3FFFFFFF;  // and stick the value in u region to avoid startup glitches

algorithm.singleFrame(0x3FFFFFFF >> 1, 0);

let output = '';
output += ('<br>RGBA:<br>');
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
document.getElementById('output').innerHTML = output;

if (0 > 1)
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
    const unsignedMemory = new Uint32Array(instance.exports.memory.buffer, offset, 6 * width * height);
    const signedMemory = new Int32Array(instance.exports.memory.buffer, offset, 6 * width * height);

    unsignedMemory[137] = 2;   // Stick a transmitter pixel right in the middle
    signedMemory[37] = 0x3FFFFFFF;  // and stick the value in u region to avoid startup glitches

    instance.exports.singleFrame(0x3FFFFFFF >> 1, 0);
    // instance.exports.singleFrame(0x3FFFFFFF >> 2, 0);
    // instance.exports.singleFrame(0x3FFFFFFF >> 3, 0);
    // instance.exports.singleFrame(0x3FFFFFFF >> 4, 0);
    // instance.exports.singleFrame(0x3FFFFFFF >> 5, 0);
    output += ('<br>RGBA:<br>');
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
    document.getElementById('output').innerHTML = output;
  }
);
