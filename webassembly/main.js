console.log('Running...');
// https://webassembly.studio/?f=oj4l8ovvex
// https://stackoverflow.com/questions/46748572/how-to-access-webassembly-linear-memory-from-c-c
fetch('../out/main.wasm').then(response => response.arrayBuffer())
  .then((bytes) => {
    return WebAssembly.instantiate(bytes, {});
  })
  .then((result) => {
      console.log('inside then');
      const instance = result.instance;
      console.log('got instance');
      const exporz = instance.exports;
      console.log('got exports.');
      const offset = instance.exports.getData();
      const linearMemory = new Uint32Array(instance.exports.memory.buffer, offset, 10);

      for (let i = 0; i < linearMemory.length; i++) {
        linearMemory[i] = i;
      }

      instance.exports.add(10);

      let sum = 0;
      for (let i = 0; i < linearMemory.length; i++) {
        sum += linearMemory[i];
        console.log(linearMemory[i]);
      }

      document.getElementById("container").innerText = sum;


    }
  );