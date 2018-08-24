function cWaveAlgorithm(wasm, width, height) {

  const instance = wasm.instance;

  instance.exports.init(width, height);

  const startByteOffset = instance.exports.getStartByteOffset();

  // These are int32 offsets- multiply by 4 to get byte offsets.
  // const canvas_offset = 0;
  const wh = width * height;
  const u0_offset = wh;
  const u1_offset = 2 * wh;
  const vel_offset = 3 * wh;
  const force_offset = 4 * wh;
  const flags_offset = 5 * wh;

  return {
    // The "output" from WASM
    getImageArray: function() {
      return new Uint8ClampedArray(
        instance.exports.memory.buffer,
        startByteOffset,
        4 * wh);
    },
    // internal state, here for debugging
    getU0Array: function() {
      return new Int32Array(
        instance.exports.memory.buffer,
        startByteOffset + (4 * u0_offset),
        wh);
    },
    // internal state, here for debugging
    getU1Array: function() {
      return new Int32Array(
        instance.exports.memory.buffer,
        startByteOffset + (4 * u1_offset),
        wh);
    },
    // internal state, here for debugging
    getVelArray: function() {
      return new Int32Array(
        instance.exports.memory.buffer,
        startByteOffset + (4 * vel_offset),
        wh);
    },
    // "Input" for WASM: mouse movements cause writes to this array
    getForceArray: function() {
      return new Int32Array(
        instance.exports.memory.buffer,
        startByteOffset + (4 * force_offset),
        wh);
    },
    // Input to WASM: wall and transmitter flags can be set programmatically
    getFlagsArray: function() {
      return new Int32Array(
        instance.exports.memory.buffer,
        startByteOffset + (4 * flags_offset),
        wh);
    },
    getEntireArray: function() {
      return new Uint32Array(
        instance.exports.memory.buffer,
        startByteOffset,
        6 * wh);
    },
    // The main hot spot function that needs to run in WebAssembly:
    iterate: function(signalAmplitude, skipRGB = false, drag = false) {
      instance.exports.iterate(signalAmplitude, skipRGB, drag);
    },
  };
}