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
int* image;
int* force;
int* status;
int* u;
int* v;

int heapStart;
int width;
int area;

WASM_EXPORT
void init(int *arr, int offset, int w, int h) {
  width = w;
  heap = arr;
  heapStart = offset;

  area = w * h;
  int intOffset = heapStart >> 2;

  image  = &heap[intOffset];
  force  = &heap[intOffset + 1 * area];
  status = &heap[intOffset + 2 * area];
  u      = &heap[intOffset + 3 * area];
  v      = &heap[intOffset + 4 * area];

  // Draw walls along outer boundary
  for (int i = 0; i < h; ++i) {
    status[i * w] = STATUS_WALL;
    status[i * w + w - 1] = STATUS_WALL;
  }

  for (int i = 0; i < w; ++i) {
    status[i] = STATUS_WALL;
    status[w * h - w + i] = STATUS_WALL;
  }
}

WASM_EXPORT
void step(signalAmplitude, dampingBitShift) {
  // First loop: look for noise generator pixels and set their values in u
  for (int i = 0; i < area; ++i) {
    int stat = status[i];
    if (stat == STATUS_POS_TRANSMITTER) {
      u[i] = signalAmplitude;
      v[i] = 0;
      force[i] = 0;
    }
    if (stat == STATUS_NEG_TRANSMITTER) {
      u[i] = -signalAmplitude;
      v[i] = 0;
      force[i] = 0;
    }
  }

  // Second loop: apply wave equation at all pixels
  for (int i = 0; i < area; ++i) {
    if (status[i] == STATUS_DEFAULT) {
      int uCen   = u[i];
      int uNorth = u[i - width];
      int uSouth = u[i + width];
      int uEast  = u[i + 1];
      int uWest  = u[i - 1];
      int uxx = ((uWest  + uEast)  >> 1) - uCen;
      int uyy = ((uNorth + uSouth) >> 1) - uCen;
      int vel = v[i] + (uxx >> 1) + (uyy >> 1);
      if (dampingBitShift) {
        vel -= (vel >> dampingBitShift);
      }
      v[i] = applyCap(vel);
    }
  }

  // Apply forces from mouse
  for (int i = 0; i < area; ++i) {
    int stat = status[i];
    if (stat == STATUS_DEFAULT) {
      int f = force[i];
      u[i] = applyCap(f + applyCap(u[i] + v[i]));
      f -= (f >> FORCE_DAMPING_BIT_SHIFT);
      force[i] = f;
    }
    if (stat == STATUS_WALL) {
      image[i] = 0x00000000;
    } else {
      image[i] = toRGB(u[i]);
    }
  }
}
