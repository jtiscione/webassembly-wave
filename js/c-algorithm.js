function cWaveAlgorithm(wasm, width, height) {

  const instance = wasm.instance;

  instance.exports.init(width, height);

  const startByteOffset = instance.exports.getStartByteOffset();

  // These are int32 offsets- multiply by 4 to get byte offsets.
  // const canvas_offset = 0;
  const wh = width * height;
  // let u0_offset = wh;
  // let u1_offset = 2 * wh;
  // const vel_offset = 3 * wh;
  const force_offset = 4 * wh;
  const flags_offset = 5 * wh;

  return {
    getForceArray: function() {
      return new Int32Array(
        instance.exports.memory.buffer,
        startByteOffset + (4 * force_offset),
        wh);
    },
    getFlagsArray: function() {
      return new Int32Array(
        instance.exports.memory.buffer,
        startByteOffset + (4 * flags_offset),
        wh);
    },
    getImageArray: function() {
      return new Uint8ClampedArray(
        instance.exports.memory.buffer,
        startByteOffset,
        4 * wh);
    },
    iterate: function(signalAmplitude, skipRGB = false, drag = false) {
      instance.exports.iterate(signalAmplitude, skipRGB, drag);
    },
  };
}