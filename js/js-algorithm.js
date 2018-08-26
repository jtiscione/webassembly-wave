/*
 * This is an ordinary JavaScript implementation:
 */
function jsWaveAlgorithm(width, height) {

  const ALPHA = 0xFF000000;

  const STATUS_DEFAULT = 0;
  const STATUS_WALL = 1;
  const STATUS_POS_TRANSMITTER = 2;
  const STATUS_NEG_TRANSMITTER = 3;

  const FORCE_DAMPING_BIT_SHIFT = 4;

  const wh = width * height;
  let u0_offset = wh;
  let u1_offset = 2 * wh;
  const vel_offset = 3 * wh;
  const force_offset = 4 * wh;
  const status_offset = 5 * wh;

  // Need room for six Int32 arrays, each with imageWidth * imageHeight elements.
  const heapSize = 6 * 4 * wh;
  const heap = new ArrayBuffer(heapSize);

  const unsignedHeap = new Uint32Array(heap);
  const signedHeap = new Int32Array(heap);

  // To avoid falling off edges, mark the pixels along the edge as being wall pixels.
  // Walls implement a Dirichlet boundary condition by setting u=0.
  for (let i = 0; i < height; i++) {
    unsignedHeap[status_offset + i * width] = STATUS_WALL; // left edge
    unsignedHeap[status_offset + (i * width) + (width - 1)] = STATUS_WALL; // right edge
  }
  for (let j = 0; j < width; j++) {
    unsignedHeap[status_offset + j] = STATUS_WALL; // top edge
    unsignedHeap[status_offset + (width * (height - 1)) + j] = STATUS_WALL; // bottom edge
  }

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

  /*
   * Applies the wave equation d2u/dt2 = c*c*(d2u/dx2+d2u/dy2)
   * where all derivatives on the right are partial 2nd derivatives
   */
  function singleFrame(signalAmplitude, dampingBitShift = 0) {

    let uCen = 0, uNorth = 0, uSouth = 0, uEast = 0, uWest = 0;

    // Do two iterations- first writing into swap and then writing back into u0 region
    for (let cycle = 0; cycle < 2; cycle++) {
      // First loop: look for noise generator pixels and set their values in u
      for (let i = 0; i < wh; i++) {
        const status = unsignedHeap[status_offset + i];
        if (status === STATUS_POS_TRANSMITTER) {
          signedHeap[u1_offset + i] = signalAmplitude;
          signedHeap[vel_offset + i] = 0;
          signedHeap[force_offset + i] = 0;
        }
        if (status === STATUS_NEG_TRANSMITTER) {
          signedHeap[u1_offset + i] = -signalAmplitude;
          signedHeap[vel_offset + i] = 0;
          signedHeap[force_offset + i] = 0;
        }
      }
      // Second loop: apply wave equation at all pixels
      for (let i = 0; i < wh; i++) {
        if (unsignedHeap[status_offset + i] === STATUS_DEFAULT) {
          uCen = signedHeap   [u0_offset + i];
          uNorth = signedHeap[u0_offset + i - width];
          uSouth = signedHeap[u0_offset + i + width];
          uWest = signedHeap[u0_offset + i - 1];
          uEast = signedHeap[u0_offset + i + 1];

          const uxx = (((uWest + uEast) >> 1) - uCen);
          const uyy = (((uNorth + uSouth) >> 1) - uCen);

          let vel = signedHeap[vel_offset + i];
          vel = vel + (uxx >> 1);
          vel = vel + (uyy >> 1);
          vel = applyCap(vel);

          let force = signedHeap[force_offset + i];
          signedHeap[u1_offset + i] =  applyCap(force + applyCap(uCen + vel));
          force -=(force >> FORCE_DAMPING_BIT_SHIFT);
          signedHeap[force_offset + i] = force;

          if (dampingBitShift) {
            vel -= (vel >> dampingBitShift);
          }
          signedHeap[vel_offset + i] = vel;
        }
      }
      const swap = u0_offset;
      u0_offset = u1_offset;
      u1_offset = swap;
    }

    // Final pass: calculate color values
    for (let i = 0; i < wh; i++) {
      if (signedHeap[status_offset + i] === STATUS_WALL) {
        unsignedHeap[i] = 0x00000000;
      } else {
        unsignedHeap[i] = toRGB(signedHeap[u0_offset + i]);
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
    singleFrame
  };
}
