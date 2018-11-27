function wasmWaveAlgorithm(wasm) {

  const byteOffset = 65536; // Step above the first 64K to clear the stack

  let width = 0, height = 0, wh = 0;
  let heap = null;

  let force;
  let status;

  return {
    // The "output" from WASM
    getImageArray: function() {
      return new Uint8ClampedArray(heap, byteOffset, 4 * wh);
    },
    // Input to WASM: mouse movements cause writes to this array
    getForceArray: function() {
      return force;
    },
    // Input to WASM: wall and transmitter statuses can be set programmatically
    getStatusArray: function() {
      return status;
    },
    // For bulk copying, etc.
    getEntireArray: function() {
      return new Uint32Array(heap, byteOffset, 5 * wh);
    },
    // The initialization function
    init: function(w, h) {
      width = w;
      height = h;
      wh = width * height;
      instance = wasm.instance;
      const memory = instance.exports.memory;
      const pages = 1 + ((5 * 4 * width * height) >> 16);
      memory.grow(pages);
      heap = memory.buffer;

      force = new Int32Array(heap, byteOffset + (4 * wh), wh);
      status = new Int32Array(heap, byteOffset + (8 * wh), wh);

      instance.exports.init(heap, byteOffset, width, height);
    },
    // The main hot spot function that needs to run in WebAssembly:
    singleFrame: function(signalAmplitude, drag = false) {
      instance.exports.singleFrame(signalAmplitude, drag ? 5 : 0);
    },
  };

}
