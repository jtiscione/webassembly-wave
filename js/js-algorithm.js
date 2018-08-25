function jsWaveAlgorithm(width, height) {


  const ALPHA = 0xFF000000;

  const STATUS_WALL = 1;
  const STATUS_POS_TRANSMITTER = 2;
  const STATUS_NEG_TRANSMITTER = 3;

  const DRAG_BIT_SHIFT = 6;
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
  function singleFrame(signalAmplitude, skipRGB = false, drag = false) {

    let index = 0, i = 0, j = 0;

    let uCen = 0, uNorth = 0, uSouth = 0, uEast = 0, uWest = 0;

    for (let cycle = 0; cycle < 2; cycle++) {
      index = 0;
      for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
          if (i === 0) {
            index++;
            continue;
          }
          if (i + 1 === height) {
            index++;
            continue;
          }
          if (j === 0) {
            index++;
            continue;
          }
          if (j + 1 === width) {
            index++;
            continue;
          }
          const status = signedHeap[status_offset + index];
          if (status === STATUS_WALL) {
            index++;
            continue;
          }
          if (status === STATUS_POS_TRANSMITTER) {
            signedHeap[u0_offset + index] = signalAmplitude;
            signedHeap[vel_offset + index] = 0;
            signedHeap[force_offset + index] = 0;
            index++;
            continue;
          }
          if (status === STATUS_NEG_TRANSMITTER) {
            signedHeap[u0_offset + index] = -signalAmplitude;
            signedHeap[vel_offset + index] = 0;
            signedHeap[force_offset + index] = 0;
            index++;
            continue;
          }
          uCen = signedHeap   [u0_offset + index];
          uNorth = signedHeap[u0_offset + index - width];
          uSouth = signedHeap[u0_offset + index + width];
          uWest = signedHeap[u0_offset + index - 1];
          uEast = signedHeap[u0_offset + index + 1];

          const uxx = (((uWest + uEast) >> 1) - uCen);
          const uyy = (((uNorth + uSouth) >> 1) - uCen);

          let vel = signedHeap[vel_offset + index];
          vel = vel + (uxx >> 1);
          vel = vel + (uyy >> 1);
          vel = applyCap(vel);

          let force = signedHeap[force_offset + index];

          let u1 = applyCap(force + applyCap(uCen + vel));
          signedHeap[u1_offset + index] = u1;

          force -=(force >> FORCE_DAMPING_BIT_SHIFT);
          signedHeap[force_offset + index] = force;

          if (drag) {
            vel -= (vel >> DRAG_BIT_SHIFT);
          }

          signedHeap[vel_offset + index] = vel;

          index++;
        }
      }
      const swap = u0_offset;
      u0_offset = u1_offset;
      u1_offset = swap;
    }

    if (!skipRGB) {
      index = 0;
      for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
          if (signedHeap[status_offset + index] === 1) {
            unsignedHeap[index] = 0x00000000;
          } else {
            unsignedHeap[index] = toRGB(signedHeap[u0_offset + index]);
          }
          index++;
        }
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
