#define WASM_EXPORT __attribute__((visibility("default")))

const unsigned int ALPHA = 0xFF000000;

const int FLAG_WALL = 1;
const int FLAG_POS_TRANSMITTER = 2;
const int FLAG_NEG_TRANSMITTER = 3;

const int DRAG_BIT_SHIFT = 6;
const int FORCE_DAMPING_BIT_SHIFT = 4;

int width = 0, height = 0, wh=0;
int canvas_offset = 0;
int u0_offset = 0;
int u1_offset = 0;
int vel_offset = 0;
int force_offset = 0;
int flags_offset = 0;

// int *array;
int array[6000000];

WASM_EXPORT
void init(w, h) {

  width = w;
  height = h;
  wh = w * h;

  // int arr[6 * wh];
  // array = arr;

  u0_offset = wh;
  u1_offset = 2 * wh;
  vel_offset = 3 * wh;
  force_offset = 4 * wh;
  flags_offset = 5 * wh;

  /*
  for (int i=0; i < h; i++) {
    for (int j=0; j < w; j++) {
      arr[i * w + j] = i * j;
    }
  }
  */
}

WASM_EXPORT
int* getStartByteOffset() {
  return &array[0];
}
/*
WASM_EXPORT
void add(int value) {
  for (int i=0; i < SIZE; i++) {
    data[i] = data[i] + value;
  }
}

WASM_EXPORT
int* getData() {
    return &data[0];
}
*/

int applyCap(x) {
  return x < -0x40000000 ? -0x40000000 : (x > 0x3FFFFFFF ? 0x3FFFFFFF : x);
}

unsigned int toRGB(signed32bitValue) {
  int val = signed32bitValue >> 22;
  unsigned int rgba = ALPHA;
  if (val > 0) {
    rgba = (val << 8) | (val << 16) | ALPHA;
  }
  if (val < 0) {
    rgba = (-(val + 1)) | ALPHA;
  }
  return rgba;
}

WASM_EXPORT
void iterate(int signalAmplitude, int skipRGB, int drag) {

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
        int flags = array[flags_offset + index];
        if (flags == FLAG_WALL) {
          index++;
          continue;
        }
        if (flags == FLAG_POS_TRANSMITTER) {
          array[u0_offset + index] = signalAmplitude;
          array[vel_offset + index] = 0;
          array[force_offset + index] = 0;
          index++;
          continue;
        }
        if (flags == FLAG_NEG_TRANSMITTER) {
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

        if (drag > 0) {
           vel -= (vel >> DRAG_BIT_SHIFT);
        }

        array[vel_offset + index] = vel;

        index++;
      }
    }
    int swap = u0_offset;
    u0_offset = u1_offset;
    u1_offset = swap;
  }
  if (skipRGB == 0) {
    for (i = 0; i < height; i++) {
      for (j = 0; j < width; j++) {
        index = (width * i) + j;
        if (array[flags_offset + index] == FLAG_WALL) {
          array[canvas_offset + index] = 0x00000000;
        } else {
          array[canvas_offset + index] = toRGB(array[u0_offset + (width * i) + j]);
        }
      }
    }
  }
}