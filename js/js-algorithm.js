function jsWaveAlgorithm() {
  const ALPHA = 0xFF000000;

  const STATUS_DEFAULT = 0;
  const STATUS_WALL = 1;
  const STATUS_POS_TRANSMITTER = 2;
  const STATUS_NEG_TRANSMITTER = 3;

  const FORCE_DAMPING_BIT_SHIFT = 4;

  // Full int32 range is -0x80000000 to 0x7FFFFFFF. Use half.
  function applyCap(x) {
    return x < -0x40000000 ? -0x40000000 : (x > 0x3FFFFFFF ? 0x3FFFFFFF : x);
  }

  function toRGB(signed32bitValue) {
    // Map negative values to red, positive to blue-green, zero to black
    let val = (signed32bitValue >> 22);
    let rgba = ALPHA;
    if (val > 0) {
      rgba = val | (val << 8) | ALPHA; // yellow
    } else if (val < 0) {
      val = val + 1;  // OR: val = Math.max(val, -255);
      rgba = -val | ((-val) << 16) | ALPHA; // purple
    }
    return rgba;
  }

  return {

    init(width, height) {

      this.width = width;
      this.height = height;
      const wh = width * height;
      this.wh = wh;

      // Need room for five Int32 arrays, each with imageWidth * imageHeight elements.
      const heap = new ArrayBuffer(5 * 4 * wh);
      this.heap = heap;

      this.image = new Int32Array(heap, 0, wh);
      this.force = new Int32Array(heap, 4 * wh, wh);
      this.status = new Int32Array(heap, 8 * wh, wh);
      this.u = new Int32Array(heap, 12 * wh, wh);
      this.vel = new Int32Array(heap, 16 * wh, wh);

      // To avoid falling off edges, mark the pixels along the edge as being wall pixels.
      // Walls implement a Dirichlet boundary condition by setting u=0.
      for (let i = 0; i < height; i++) {
        this.status[i * width] = STATUS_WALL; // left edge
        this.status[(i * width) + (width - 1)] = STATUS_WALL; // right edge
      }
      for (let j = 0; j < width; j++) {
        this.status[j] = STATUS_WALL; // top edge
        this.status[(width * (height - 1)) + j] = STATUS_WALL; // bottom edge
      }
    },

    singleFrame(signalAmplitude, dampingBitShift = 0) {

      const { width, wh, image, force, status, u, vel } = this;

      // First loop: look for noise generator pixels and set their values in u
      for (let i = 0; i < wh; i++) {
        if (status[i] === STATUS_POS_TRANSMITTER) {
          u[i] = signalAmplitude;
          vel[i] = 0;
          force[i] = 0;
        }
        if (status[i] === STATUS_NEG_TRANSMITTER) {
          u[i] = -signalAmplitude;
          vel[i] = 0;
          force[i] = 0;
        }
      }

      // Second loop: apply wave equation at all pixels
      for (let i = 0; i < wh; i++) {
        if (status[i] === STATUS_DEFAULT) {
          const uCen = u[i];
          const uNorth = u[i - width];
          const uSouth = u[i + width];
          const uEast = u[i + 1];
          const uWest = u[i - 1];
          const uxx = (((uWest + uEast) >> 1) - uCen);
          const uyy = (((uNorth + uSouth) >> 1) - uCen);
          let v = vel[i] + (uxx >> 1) + (uyy >> 1);
          if (dampingBitShift) {
            v -= (v >> dampingBitShift);
          }
          vel[i] = applyCap(v);
        }
      }

      // Apply forces from mouse
      for (let i = 0; i < wh; i++) {
        if (status[i] === STATUS_DEFAULT) {
          let f = force[i];
          u[i] = applyCap(f + applyCap(u[i] + vel[i]));
          f -= (f >> FORCE_DAMPING_BIT_SHIFT);
          force[i] = f;
        }
      }

      // Final pass: calculate color values
      for (let i = 0; i < wh; i++) {
        if (status[i] === STATUS_WALL) {
          image[i] = 0x00000000;
        } else {
          image[i] = toRGB(u[i]);
        }
      }
    },

    getImageArray() {
      return new Uint8ClampedArray(this.heap, 0, 4 * this.wh);
    },

    getForceArray() {
      return this.force;
    },

    getStatusArray() {
      return this.status;
    },

    getEntireArray() {
      return new Uint32Array(this.heap);
    },
  };
}
