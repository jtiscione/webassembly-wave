#define WASM_EXPORT __attribute__((visibility("default")))

const int ALPHA = 0xFF000000;

const int STATUS_DEFAULT = 0;
const int STATUS_WALL = 1;
const int STATUS_POS_TRANSMITTER = 2;
const int STATUS_NEG_TRANSMITTER = 3;

const int FORCE_DAMPING_BIT_SHIFT = 4;

// Full int32 range is -0x80000000 to 0x7FFFFFFF. Use half.
int applyCap(x) {
  return x < -0x40000000 ? -0x40000000 : (x > 0x3FFFFFFF ? 0x3FFFFFFF : x);
}

unsigned int toRGB(x) {
  // Map negative values to red, positive to blue-green, zero to black
  int val = x >> 22;
  int rgba = ALPHA;
  if (val > 0) {
    rgba = (val << 8) | (val << 16) | ALPHA;
  } else if (val < 0) {
    val = val + 1; // OR: val = Math.max(val, -255);
    rgba = -val | ALPHA; // red
  }
  return rgba;
}

int* heap;
int heapStart;
int width;
int height;
int wh;

WASM_EXPORT
void init(int *arr, int offset, int w, int h) {
  heap = arr;
  heapStart = offset;
  width = w;
  height = h;
  wh = width * height;

  int intOffset = heapStart >> 2;
  int* image = &heap[intOffset];
  int* force = &heap[intOffset + wh];
  int* status = &heap[intOffset + wh + wh];

  // Draw walls along outer boundary
  for (int i=0; i < height; i++) {
    status[i * width] = 1;
    status[i * width + width - 1] = 1;
  }

  for (int i=0; i < width; i++) {
    status[i] = 1;
    status[width * height - width + i] = 1;
  }
}

WASM_EXPORT
void singleFrame(signalAmplitude, dampingBitShift) {

  int wh = width * height;
  int intOffset = heapStart >> 2;
  int* image = &heap[intOffset];
  int* force = &heap[intOffset + wh];
  int* status = &heap[intOffset + wh + wh];
  int* u = &heap[intOffset + wh + wh + wh];
  int* vel = &heap[intOffset + wh + wh + wh + wh];

  // First loop: look for noise generator pixels and set their values in u
  for (int i=0; i < wh; i++) {
    if (status[i] == STATUS_POS_TRANSMITTER) {
      u[i] = signalAmplitude;
      vel[i] = 0;
      force[i] = 0;
    }
    if (status[i] == STATUS_NEG_TRANSMITTER) {
      u[i] = -signalAmplitude;
      vel[i] = 0;
      force[i] = 0;
    }
  }

  // Second loop: apply wave equation at all pixels
  for (int i=0; i < wh; i++) {
    if (status[i] == 0) {
      int uCen = u[i];
      int uNorth = u[i - width];
      int uSouth = u[i + width];
      int uEast = u[i + 1];
      int uWest = u[i - 1];
      int uxx = (((uWest + uEast) >> 1) - uCen);
      int uyy = (((uNorth + uSouth) >> 1) - uCen);
      int v = vel[i] + (uxx >> 1) + (uyy >> 1);
      if (dampingBitShift) {
        v -= (v >> dampingBitShift);
      }
      vel[i] = applyCap(v);
    }
  }

  // Apply forces from mouse
  for (int i = 0; i < wh; i++) {
    if (status[i] == 0) {
      int f = force[i];
      u[i] = applyCap(f + applyCap(u[i] + vel[i]));
      f -= (f >> FORCE_DAMPING_BIT_SHIFT);
      force[i] = f;
    }
  }

  // Final pass: calculate color values
  for (int i = 0; i < wh; i++) {
    if (status[i] == 1) {
      image[i] = 0x00000000;
    } else {
      image[i] = toRGB(u[i]);
    }
  }
}
