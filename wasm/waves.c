#define WASM_EXPORT __attribute__((visibility("default")))

const unsigned int ALPHA = 0xFF000000;

const int STATUS_WALL = 1;
const int STATUS_POS_TRANSMITTER = 2;
const int STATUS_NEG_TRANSMITTER = 3;

const int FORCE_DAMPING_BIT_SHIFT = 4;

int width = 0, height = 0, wh=0;
int canvas_offset = 0;
int u0_offset = 0;
int u1_offset = 0;
int vel_offset = 0;
int force_offset = 0;
int status_offset = 0;

// TODO: use imports.env.memory instead of a global
int array[6000000]; // Room for 1000x1000 pixels, visible to JS as an ArrayBuffer

WASM_EXPORT
void init(w, h) {
  width = w;
  height = h;
  wh = w * h;
  u0_offset = wh;
  u1_offset = 2 * wh;
  vel_offset = 3 * wh;
  force_offset = 4 * wh;
  status_offset = 5 * wh;
}

WASM_EXPORT
int* getStartByteOffset() {
  return &array[0];
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

WASM_EXPORT
void singleFrame(int signalAmplitude, int dampingBitShift) {

  int index = 0, i = 0, j = 0;
  int uCen = 0, uNorth = 0, uSouth = 0, uEast = 0, uWest = 0;

  for (int cycle = 0; cycle < 2; cycle++) {
    index = 0;
    for (i = 0; i < height; i++) {
      for (j = 0; j < width; j++) {
        if (i == 0) {
          index++;
          continue;
        }
        if (i + 1 == height) {
          index++;
          continue;
        }
        if (j == 0) {
          index++;
          continue;
        }
        if (j + 1 == width) {
          index++;
          continue;
        }
        int status = array[status_offset + index];
        if (status == STATUS_WALL) {
          index++;
          continue;
        }
        if (status == STATUS_POS_TRANSMITTER) {
          array[u0_offset + index] = signalAmplitude;
          array[vel_offset + index] = 0;
          array[force_offset + index] = 0;
          index++;
          continue;
        }
        if (status == STATUS_NEG_TRANSMITTER) {
          array[u0_offset + index] = -signalAmplitude;
          array[vel_offset + index] = 0;
          array[force_offset + index] = 0;
          index++;
          continue;
        }
        uCen = array[u0_offset + index];
        uNorth = array[u0_offset + index - width];
        uSouth = array[u0_offset + index + width];
        uWest = array[u0_offset + index - 1];
        uEast = array[u0_offset + index + 1];

        int uxx = (((uWest + uEast) >> 1) - uCen);
        int uyy = (((uNorth + uSouth) >> 1) - uCen);

        int vel = array[vel_offset + index];
        vel = vel + (uxx >> 1);
        vel = vel + (uyy >> 1);
        vel = applyCap(vel);

        int force = array[force_offset + index];

        int u1 = applyCap(force + applyCap(uCen + vel));
        array[u1_offset + index] = u1;
        force -= (force >> FORCE_DAMPING_BIT_SHIFT);
        array[force_offset + index] = force;

        if (dampingBitShift > 0) {
           vel -= (vel >> dampingBitShift);
        }

        array[vel_offset + index] = vel;

        index++;
      }
    }
    int swap = u0_offset;
    u0_offset = u1_offset;
    u1_offset = swap;
  }
  index = 0;
  for (i = 0; i < height; i++) {
    for (j = 0; j < width; j++) {
      if (array[status_offset + index] == STATUS_WALL) {
        array[canvas_offset + index] = 0x00000000;
      } else {
        array[canvas_offset + index] = toRGB(array[u0_offset + index]);
      }
      index++;
    }
  }
}