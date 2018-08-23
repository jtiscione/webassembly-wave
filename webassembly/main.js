console.log('Running...');

// initial size of 10 pages (640KiB), and a maximum size of 100 pages (6.4MiB)
/*
const memory = new WebAssembly.Memory({initial:10, maximum:100});
WebAssembly.instantiateStreaming(fetch('../out/main.wasm'), { js: { mem: memory } })
  .then(obj => {
    obj.instance and obj.module are now available
  });
*/

// https://webassembly.studio/?f=oj4l8ovvex
// https://stackoverflow.com/questions/46748572/how-to-access-webassembly-linear-memory-from-c-c
fetch('../out/main.wasm').then(response => response.arrayBuffer())
  .then((bytes) => {
    return WebAssembly.instantiate(bytes, {
      env: {
        memoryBase: 0,
        tableBase: 0,
        memory: new WebAssembly.Memory({
          initial: 512
        }),
        table: new WebAssembly.Table({
          initial: 0,
          element: 'anyfunc'
        })
      }
    });
  })
  .then((result) => {
      const instance = result.instance;
      const width = 500;
      const height = 500;
      instance.exports.init(width, height);
      const offset = instance.exports.getStartByteOffset();
      console.log('offset: ' + offset);
      // Six arrays - image, u0, u1, vel, force, flags
      const linearMemory = new Uint32Array(instance.exports.memory.buffer, offset, 6 * width * height);
      // Fill "u0" with random crap
      for (let i = 0; i < width * height; i++) {
        linearMemory[width * height + i] = Math.floor(0x7FFFFFFF * Math.random()) - 0x40000000;
      }

      // See if it breaks
      const t0 = Date.now();
      instance.exports.iterate(0, 0, 0);
      const t1 = Date.now();
      console.log(`That took ${t1-t0} ms`);

      for (let i = 0; i < 10; i++) {
        console.log(`${i}: ${linearMemory[i].toString(16)}`);
      }

    }
  );
