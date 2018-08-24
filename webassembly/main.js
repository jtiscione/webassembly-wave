fetch('../wasm/main.wasm').then(response => response.arrayBuffer())
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
      const width = 5;
      const height = 5;
      const wh = width * height;
      instance.exports.init(width, height);
      const offset = instance.exports.getStartByteOffset();
      console.log('offset: ' + offset);
      /*
      // Six arrays - image, u0, u1, vel, force, flags
      const linearMemory = new Uint32Array(instance.exports.memory.buffer, offset, 6 * width * height);
      const signedMemory = new Int32Array(instance.exports.memory.buffer, offset, 6 * width * height);

      linearMemory[137] = 2;   // Stick a transmitter pixel right in the middle
      // signedMemory[37] = 1000;  // and stick the value in u1 so our first pass doesn't confuse us while debugging.

      // See if it breaks
      const t0 = Date.now();
      instance.exports.iterate(0x3FFFFFFF >> 1, 0, 0);
      instance.exports.iterate(0x3FFFFFFF >> 2, 0, 0);
      instance.exports.iterate(0x3FFFFFFF >> 3, 0, 0);
      instance.exports.iterate(0x3FFFFFFF >> 4, 0, 0);
      instance.exports.iterate(0x3FFFFFFF >> 5, 0, 0);
      // instance.exports.iterate(0x3FFFFFFF, 0, 0);
      const t1 = Date.now();
      console.log(`That took ${t1-t0} ms`);

      for (let i = 0; i < 24; i++) {
        console.log(`${i}\t${linearMemory[i].toString(16)}`);
      }
      console.log('u0:');
      for (let i = 25; i < 50; i++) {
        console.log(`${i}\t${signedMemory[i]}`);
      }
      console.log('u1:');
      for (let i = 50; i < 75; i++) {
        console.log(`${i}\t${signedMemory[i]}`);
      }
      console.log('v:');
      for (let i = 75; i < 100; i++) {
        console.log(`${i}\t${signedMemory[i]}`);
      }
      */
    }
  );
