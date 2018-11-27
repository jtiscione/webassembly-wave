function wasmWaveAlgorithm(wasm) {

  const byteOffset = 65536; // Step above the first 64K to clear the stack

  // These are int32 offsets- multiply by 4 to get byte offsets.
  let width = 0, height = 0, wh = 0, force_offset = 0, status_offset = 0;
  let heap = null;

  return {
    // The "output" from WASM
    getImageArray: function() {
      return new Uint8ClampedArray(heap, byteOffset, 4 * wh);
    },
    // Input to WASM: mouse movements cause writes to this array
    getForceArray: function() {
      return new Int32Array(heap, byteOffset + (4 * force_offset), wh);
    },
    // Input to WASM: wall and transmitter statuses can be set programmatically
    getStatusArray: function() {
      return new Int32Array(heap, byteOffset + (4 * status_offset), wh);
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
      force_offset = wh;
      status_offset = 2 * wh;
      u_offset = 3 * wh;
      vel_offset = 4 * wh;
      instance = wasm.instance;
      memory = instance.exports.memory;
      const pages = 1 + ((5 * 4 * width * height) >> 16);
      memory.grow(pages);
      heap = memory.buffer;
      instance.exports.init(heap, byteOffset, width, height);
    },
    // The main hot spot function that needs to run in WebAssembly:
    singleFrame: function(signalAmplitude, drag = false) {
      instance.exports.singleFrame(signalAmplitude, drag ? 5 : 0);
    },
  };

}
