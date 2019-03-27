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
      val = val + 1;  // intent: val = max(val, -255);
      rgba = -val | ((-val) << 16) | ALPHA; // purple
    }

    return rgba;
  }

  return {

    init(width, height) {

      this.width = width;
      this.height = height;
      const area = width * height;
      this.area = area;

      // Need room for five Int32 arrays, each with imageWidth * imageHeight elements.
      const heap = new ArrayBuffer(5 * 4 * area);
      this.heap = heap;

      this.image  = new Int32Array(heap, 0, area);
      this.force  = new Int32Array(heap, 4 * area, area);
      this.status = new Int32Array(heap, 8 * area, area);
      this.u      = new Int32Array(heap, 12 * area, area);
      this.v      = new Int32Array(heap, 16 * area, area);

      // To avoid falling off edges, mark the pixels along the edge as being wall pixels.
      // Walls implement a Dirichlet boundary condition by setting u=0.
      for (let i = 0; i < height; ++i) {
        this.status[i * width] = STATUS_WALL; // left edge
        this.status[(i * width) + (width - 1)] = STATUS_WALL; // right edge
      }
      for (let j = 0; j < width; ++j) {
        this.status[j] = STATUS_WALL; // top edge
        this.status[(width * (height - 1)) + j] = STATUS_WALL; // bottom edge
      }
    },

    step(signalAmplitude, dampingBitShift = 0) {

      const { width, area, image, force, status, u, v } = this;

      // First loop: look for noise generator pixels and set their values in u
      for (let i = 0; i < area; ++i) {
        let stat = status[i];
        if (stat === STATUS_POS_TRANSMITTER) {
          u[i] = signalAmplitude;
          v[i] = 0;
          force[i] = 0;
        }
        if (stat === STATUS_NEG_TRANSMITTER) {
          u[i] = -signalAmplitude;
          v[i] = 0;
          force[i] = 0;
        }
      }

      // Second loop: apply wave equation at all pixels
      for (let i = 0; i < area; ++i) {
        if (status[i] === STATUS_DEFAULT) {
          const uCen   = u[i];
          const uNorth = u[i - width];
          const uSouth = u[i + width];
          const uEast  = u[i + 1];
          const uWest  = u[i - 1];
          const uxx = ((uWest  + uEast)  >> 1) - uCen;
          const uyy = ((uNorth + uSouth) >> 1) - uCen;
          let vel = v[i] + (uxx >> 1) + (uyy >> 1);
          if (dampingBitShift) {
            vel -= (vel >> dampingBitShift);
          }
          v[i] = applyCap(vel);
        }
      }

      // Apply forces from mouse
      for (let i = 0; i < area; ++i) {
        let stat = status[i];
        if (stat === STATUS_DEFAULT) {
          let f = force[i];
          u[i] = applyCap(f + applyCap(u[i] + v[i]));
          f -= (f >> FORCE_DAMPING_BIT_SHIFT);
          force[i] = f;
        }
        if (stat === STATUS_WALL) {
          image[i] = 0x00000000;
        } else {
          image[i] = toRGB(u[i]);
        }
      }
    },

    getImageArray() {
      return new Uint8ClampedArray(this.heap, 0, 4 * this.area);
    },

    getForceArray() {
      return this.force;
    },

    getStatusArray() {
      return this.status;
    },

    getUArray() {
      return this.u;
    },

    getVArray() {
      return this.v;
    },

    getEntireArray() {
      return new Uint32Array(this.heap);
    },
  };
}
