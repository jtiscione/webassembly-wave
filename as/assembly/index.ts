class Pointer {
  constructor(offset: usize = 0) {
    return changetype<Pointer>(offset);
  }

  @inline @operator("[]") get(index: i32): i32 {
    return load<i32>(changetype<usize>(this) + (<usize>index << alignof<i32>()));
  }

  @inline @operator("[]=") set(index: i32, value: i32): void {
    store<i32>(changetype<usize>(this) + (<usize>index << alignof<i32>()), value);
  }
}

// Full int32 range is -0x80000000 to 0x7FFFFFFF. Use half.
@inline function applyCap(x: i32): i32 {
  // return x < -0x40000000 ? -0x40000000 : (x > 0x3FFFFFFF ? 0x3FFFFFFF : x);
  return select(-0x40000000, select(0x3FFFFFFF, x, x > 0x3FFFFFFF), x < -0x40000000);
}

@inline function toRGB(x: i32): i32 {
  // Map negative values to red, positive to blue-green, zero to black
  var val = x >> 22;
  // if (val < 0) return ((-(val + 1))  | 0xFF000000); // red
  // return (((val << 8) | (val << 16)) | 0xFF000000); // cyan
  return select(-(val + 1) << 16, (val | (val << 8) | (val << 16)), val < 0) | 0xFF000000;
}

const STATUS_DEFAULT: i32 = 0;
const STATUS_WALL: i32 = 1;
const STATUS_POS_TRANSMITTER: i32 = 2;
const STATUS_NEG_TRANSMITTER: i32 = 3;

const FORCE_DAMPING_BIT_SHIFT: i32 = 4;

let width: i32 = 0;
let height: i32 = 0;
let area: i32 = 0;

let image:Pointer = null;
let force:Pointer = null;
let status:Pointer = null;
let u:Pointer = null;
let v:Pointer = null;

export function init(ignored: i32, offset: i32, w: i32, h: i32): void {

  width = w;
  height = h;
  area = width * height;
  status = new Pointer(offset + 8 * area);
  image  = new Pointer(offset);
  force  = new Pointer(offset + 4  * area);
  status = new Pointer(offset + 8  * area);
  u      = new Pointer(offset + 12 * area);
  v    = new Pointer(offset + 16 * area);
  for (let i = 0; i < height; ++i) {
    status[i * width] = 1;
    status[i * width + width - 1] = STATUS_WALL;
  }

  for (let i = 0; i < width; ++i) {
    status[i] = 1;
    status[area - width + i] = STATUS_WALL;
  }
}

export function step(signalAmplitude: i32, dampingBitShift: i32): void {

  // First loop: look for noise generator pixels and set their values in u
  for (let i = 0; i < area; i++) {
    if (status[i] === STATUS_POS_TRANSMITTER) {
      u[i] = signalAmplitude;
      v[i] = 0;
      force[i] = 0;
    }
    if (status[i] === STATUS_NEG_TRANSMITTER) {
      u[i] = -signalAmplitude;
      v[i] = 0;
      force[i] = 0;
    }
  }

  for (let i = 0; i < area; ++i) {
    if (status[i] === STATUS_DEFAULT) {
      let uCen   = u[i];
      let uNorth = u[i - width];
      let uSouth = u[i + width];
      let uEast  = u[i + 1];
      let uWest  = u[i - 1];

      let uxx = (((uWest  + uEast)  >> 1) - uCen);
      let uyy = (((uNorth + uSouth) >> 1) - uCen);

      let vel = v[i] + (uxx >> 1) + (uyy >> 1);
      if (dampingBitShift) {
        vel -= (vel >> dampingBitShift);
      }
      v[i] = applyCap(vel);
    }
  }

  for (let i = 0; i < area; ++i) {
    if (status[i] === STATUS_DEFAULT) {
      let f = force[i];
      let capped = applyCap(u[i] + v[i]);
      u[i] = applyCap(f + capped);
      force[i] = f >> FORCE_DAMPING_BIT_SHIFT;
    }
  }

  for (let i = 0; i < area; ++i) {
    if (status[i] === STATUS_WALL) {
      image[i] = 0x00000000;
    } else {
      image[i] = toRGB(u[i]);
    }
  }
}
