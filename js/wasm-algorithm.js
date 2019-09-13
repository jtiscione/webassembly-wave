function wasmWaveAlgorithm(wasm) {

  return {
    module: wasm,
    // The initialization function
    init(width, height) {
      const area  = width * height;
      this.width  = width;
      this.height = height;
      this.area   = area;

      const instance = wasm.instance;
      const memory = wasm.importsObject ? wasm.importsObject.env.memory : instance.exports.memory;
      this.byteOffset = wasm.importsObject ? instance.exports._getByteOffset() : 9192;
      const pages = 2 + ((5 * 4 * width * height) >> 16);
      memory.grow(pages);

      const heap = memory.buffer;
      this.heap = heap;

      this.force  = new Int32Array(heap, this.byteOffset +  4 * area, area);
      this.status = new Int32Array(heap, this.byteOffset +  8 * area, area);
      this.u      = new Int32Array(heap, this.byteOffset + 12 * area, area);
      this.v      = new Int32Array(heap, this.byteOffset + 16 * area, area);

      this.step = this.module.instance.exports._step || this.module.instance.exports.step;
      this.init = this.module.instance.exports._init || this.module.instance.exports.init;

      this.init(heap, this.byteOffset, width, height);
    },
    // The main hot spot function:
    step(signalAmplitude, dampingBitShift = 0) {
      this.step(signalAmplitude, dampingBitShift);
    },
    // The "output" from WASM
    getImageArray() {
      return new Uint8ClampedArray(this.heap, this.byteOffset, 4 * this.area);
    },
    // Input to WASM: mouse movements cause writes to this array
    getForceArray() {
      return this.force;
    },
    // Input to WASM: wall and transmitter statuses can be set programmatically
    getStatusArray() {
      return this.status;
    },
    getUArray() {
      return this.u;
    },
    getVArray() {
      return this.v;
    },
    // For bulk copying, etc.
    getEntireArray() {
      return new Uint32Array(this.heap, this.byteOffset, 5 * this.area);
    },
  };
}
