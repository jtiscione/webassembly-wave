function wasmWaveAlgorithm(wasm) {

  return {
    module: wasm,
    // The initialization function
    init(width, height) {

      this.width = width;
      this.height = height;
      const area = width * height;
      this.area = area;

      this.byteOffset = 65536; // Step above the first 64K to clear the stack

      const instance = wasm.instance;
      const memory = instance.exports.memory;
      const pages = 1 + ((5 * 4 * width * height) >> 16);
      memory.grow(pages);

      const heap = memory.buffer;
      this.heap = heap;

      this.force = new Int32Array(heap, this.byteOffset + (4 * area), area);
      this.status = new Int32Array(heap, this.byteOffset + (8 * area), area);

      instance.exports.init(heap, this.byteOffset, width, height);
    },
    // The main hot spot function:
    step(signalAmplitude, drag = false) {
      this.module.instance.exports.step(signalAmplitude, drag ? 5 : 0);
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
    // For bulk copying, etc.
    getEntireArray() {
      return new Uint32Array(this.heap, this.byteOffset, 5 * this.area);
    },
  };
}
