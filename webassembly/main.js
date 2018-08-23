console.log('Running...');

// initial size of 10 pages (640KiB), and a maximum size of 100 pages (6.4MiB)
/*
const memory = new WebAssembly.Memory({initial:10, maximum:100});
WebAssembly.instantiateStreaming(fetch('../out/main.wasm'), { js: { mem: memory } })
  .then(obj => {
    var i32 = new Uint32Array(memory.buffer);
    for (var i = 0; i < 10; i++) {
      i32[i] = i;
    }
    var sum = obj.instance.exports.accumulate(0, 10);
    console.log(sum);
  });
*/

// https://webassembly.studio/?f=oj4l8ovvex
// https://stackoverflow.com/questions/46748572/how-to-access-webassembly-linear-memory-from-c-c
fetch('../out/main.wasm').then(response => response.arrayBuffer())
  .then((bytes) => {
    return WebAssembly.instantiate(bytes, {});
  })
  .then((result) => {
      const instance = result.instance;
      instance.exports.init(5, 5);
      const offset = instance.exports.getStartByteOffset();
      // Six arrays - image, u0, u1, vel, force, flags
      const linearMemory = new Uint32Array(instance.exports.memory.buffer, offset, 6 * 25);
      // Fill "u0" with random crap
      for (let i = 0; i < 25; i++) {
        linearMemory[25 + i] = Math.floor(0x7FFFFFFF * Math.random()) - 0x40000000;
      }

      // See if it breaks
      instance.exports.iterate(0, 0, 0);

      for (let i = 0; i < linearMemory.length; i++) {
        console.log(`${i}: ${linearMemory[i]}`);
      }
    }
  );