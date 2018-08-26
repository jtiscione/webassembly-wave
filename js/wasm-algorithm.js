/*
 * This initializes the WebAssembly module instance and returns an object that encapsulates it.
 */
function wasmWaveAlgorithm(wasm, width, height) {

  const instance = wasm.instance;

  instance.exports.init(width, height);

  const startByteOffset = instance.exports.getStartByteOffset();
  console.log('WebAssembly buffer offset', startByteOffset);

  // These are int32 offsets- multiply by 4 to get byte offsets.
  // const canvas_offset = 0;
  const wh = width * height;
  const force_offset = 4 * wh;
  const status_offset = 5 * wh;

  const heap = instance.exports.memory.buffer;

  return {
    // The "output" from WASM
    getImageArray: function() {
      return new Uint8ClampedArray(heap, startByteOffset, 4 * wh);
    },
    // Input to WASM: mouse movements cause writes to this array
    getForceArray: function() {
      return new Int32Array(heap, startByteOffset + (4 * force_offset), wh);
    },
    // Input to WASM: wall and transmitter statuses can be set programmatically
    getStatusArray: function() {
      return new Int32Array(heap, startByteOffset + (4 * status_offset), wh);
    },
    // For bulk copying, etc.
    getEntireArray: function() {
      return new Uint32Array(heap, startByteOffset, 6 * wh);
    },
    // The main hot spot function that needs to run in WebAssembly:
    singleFrame: function(signalAmplitude, drag = false) {
      instance.exports.singleFrame(signalAmplitude, drag);
    },
  };
}