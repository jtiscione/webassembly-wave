#define WASM_EXPORT __attribute__((visibility("default")))

const unsigned int ALPHA = 0xFF000000;

const int STATUS_DEFAULT = 0;
const int STATUS_WALL = 1;
const int STATUS_POS_TRANSMITTER = 2;
const int STATUS_NEG_TRANSMITTER = 3;

const int FORCE_DAMPING_BIT_SHIFT = 4;

int byteOffset, intOffset, width, height, wh, u0_offset, u1_offset, vel_offset, force_offset, status_offset;

WASM_EXPORT
void init(int *array, int offset, int w, int h) {
  byteOffset = offset;
  intOffset = byteOffset / 4;
  width = w;
  height = h;
  wh = w * h;
  u0_offset = intOffset + wh;
  u1_offset = intOffset + 2 * wh;
  vel_offset = intOffset + 3 * wh;
  force_offset = intOffset + 4 * wh;
  status_offset = intOffset + 5 * wh;

  // To avoid falling off edges, mark the pixels along the edge as being wall pixels.
  // Walls implement a Dirichlet boundary condition by setting u=0.
  for (int i = 0; i < height; i++) {
    array[status_offset + i * width] = STATUS_WALL; // left edge
    array[status_offset + (i * width) + (width - 1)] = STATUS_WALL; // right edge
  }
  for (int j = 0; j < width; j++) {
    array[status_offset + j] = STATUS_WALL; // top edge
    array[status_offset + (width * (height - 1)) + j] = STATUS_WALL; // bottom edge
  }

}

// Full int32 range is -0x80000000 to 0x7FFFFFFF. Use half.
int applyCap(x) {
  return x < -0x40000000 ? -0x40000000 : (x > 0x3FFFFFFF ? 0x3FFFFFFF : x);
}

unsigned int toRGB(signed32bitValue) {
  // Map negative values to red, positive to blue-green, zero to black
  int val = signed32bitValue >> 22;
  unsigned int rgba = ALPHA;
  if (val > 0) {
    rgba = (val << 8) | (val << 16) | ALPHA;
  }
  if (val < 0) {
    val = val + 1;  // OR: val = max(val, -255)
    rgba = -val | ALPHA;
  }
  return rgba;
}

/*
 * Applies the wave equation d2u/dt2 = c*c*(d2u/dx2+d2u/dy2)
 * where all derivatives on the right are partial 2nd derivatives
 */
WASM_EXPORT
void singleFrame(int *array, int signalAmplitude, int dampingBitShift) {

  int uCen, uNorth, uSouth, uEast, uWest;

  // Do two iterations- first writing into swap and then writing back into u0 region
  for (int cycle = 0; cycle < 2; cycle++) {
    // First loop: look for noise generator pixels and set their values in u
    for (int i = 0; i < wh; i++) {
      int status = array[status_offset + i];
      if (status == STATUS_POS_TRANSMITTER) {
        array[u1_offset + i] = signalAmplitude;
        array[vel_offset + i] = 0;
        array[force_offset + i] = 0;
      }
      if (status == STATUS_NEG_TRANSMITTER) {
        array[u1_offset + i] = -signalAmplitude;
        array[vel_offset + i] = 0;
        array[force_offset + i] = 0;
      }
    }
    // Second loop: apply wave equation at all pixels
    for (int i = 0; i < wh; i++) {
      if (array[status_offset + i] == STATUS_DEFAULT) {
        uCen = array[u0_offset + i];
        uNorth = array[u0_offset + i - width];
        uSouth = array[u0_offset + i + width];
        uWest = array[u0_offset + i - 1];
        uEast = array[u0_offset + i + 1];

        int uxx = (((uWest + uEast) >> 1) - uCen);
        int uyy = (((uNorth + uSouth) >> 1) - uCen);

        int vel = array[vel_offset + i];
        vel = vel + (uxx >> 1);
        vel = vel + (uyy >> 1);
        vel = applyCap(vel);

        int force = array[force_offset + i];
        array[u1_offset + i] = applyCap(force + applyCap(uCen + vel));
        force -= (force >> FORCE_DAMPING_BIT_SHIFT);
        array[force_offset + i] = force;

        if (dampingBitShift > 0) {
           vel -= (vel >> dampingBitShift);
        }
        array[vel_offset + i] = vel;
      }
    }
    int swap = u0_offset;
    u0_offset = u1_offset;
    u1_offset = swap;
  }

  // Final pass: calculate color values
  for (int i = 0; i < wh; i++) {
    if (array[status_offset + i] == STATUS_WALL) {
      array[intOffset + i] = 0x00000000;
    } else {
      array[intOffset + i] = toRGB(array[u0_offset + i]);
    }
  }
}
