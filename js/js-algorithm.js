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
      rgba = (val << 8) | (val << 16) | ALPHA; // blue-green
    } else if (val < 0) {
      val = val + 1;  // OR: val = Math.max(val, -255);
      rgba = -val | ALPHA; // red
    }
    return rgba;
  }

  let width = 0, height = 0, wh = 0, u_offset = 0, vel_offset = 0, force_offset = 0, status_offset = 0;
  let heap = null, unsignedHeap = null;

  function init(w, h) {
    width = w;
    height = h;
    wh = width * height;
    force_offset = wh;
    status_offset = 2 * wh;
    u_offset = 3 * wh;
    vel_offset = 4 * wh;

    // Need room for five Int32 arrays, each with imageWidth * imageHeight elements.
    heap = new ArrayBuffer(5 * 4 * wh);
    unsignedHeap = new Uint32Array(heap);
    // To avoid falling off edges, mark the pixels along the edge as being wall pixels.
    // Walls implement a Dirichlet boundary condition by setting u=0.
    const status = new Int32Array(heap, 4 * status_offset, wh);
    for (let i = 0; i < height; i++) {
      status[i * width] = STATUS_WALL; // left edge
      status[(i * width) + (width - 1)] = STATUS_WALL; // right edge
    }
    for (let j = 0; j < width; j++) {
      status[j] = STATUS_WALL; // top edge
      status[(width * (height - 1)) + j] = STATUS_WALL; // bottom edge
    }
  }

  /*
   * Applies the wave equation d2u/dt2 = c*c*(d2u/dx2+d2u/dy2)
   * where all derivatives on the right are partial 2nd derivatives
   */
  function singleFrame(signalAmplitude, dampingBitShift = 0) {

    const image = new Int32Array(heap, 0, wh);
    const force = new Int32Array(heap, 4 * force_offset, wh);
    const status = new Int32Array(heap, 4 * status_offset, wh);
    const u = new Int32Array(heap, 4 * u_offset, wh);
    const vel = new Int32Array(heap, 4 * vel_offset, wh);

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
    for (let i=0; i < wh; i++) {
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
  }

  return {
    getImageArray: function() {
      return new Uint8ClampedArray(heap, 0, 4 * wh);
    },
    getForceArray: function() {
      return new Int32Array(heap, 4 * force_offset, wh);
    },
    getStatusArray: function() {
      return new Int32Array(heap, 4 * status_offset, wh);
    },
    getEntireArray: function() {
      return unsignedHeap;
    },
    init,
    singleFrame
  };
}
