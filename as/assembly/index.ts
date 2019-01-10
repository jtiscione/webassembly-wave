/// <reference path="../node_modules/assemblyscript/index.d.ts" />

class Pointer {
  // just need for making tslint happy
  [key: number]: number;

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
  return x < -0x40000000 ? -0x40000000 : (x > 0x3FFFFFFF ? 0x3FFFFFFF : x);
}

@inline function toRGB(x: i32): i32 {
  // Map negative values to red, positive to blue-green, zero to black
  var val = x >> 22;
  if (val < 0) return ((-(val + 1))  | 0xFF000000); // red
  return (((val << 8) | (val << 16)) | 0xFF000000); // cyan
}

const STATUS_DEFAULT: i32 = 0;
const STATUS_WALL: i32 = 1;
const STATUS_POS_TRANSMITTER: i32 = 2;
const STATUS_NEG_TRANSMITTER: i32 = 3;

const FORCE_DAMPING_BIT_SHIFT: i32 = 4;

let width:  i32 = 0;
let height: i32 = 0;
let area:   i32 = 0;

let image:  Pointer;
let force:  Pointer;
let status: Pointer;
let u:      Pointer;
let v:      Pointer;

export function init(_ignored: i32, offset: i32, w: i32, h: i32): void {

  width  = w;
  height = h;
  area   = width * height;
  image  = new Pointer(offset);
  force  = new Pointer(offset + 4  * area);
  status = new Pointer(offset + 8  * area);
  u      = new Pointer(offset + 12 * area);
  v      = new Pointer(offset + 16 * area);

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
  let _area = area,
    _status = status,
    _u = u,
    _v = v,
    _force = force,
    _image = image,
    _width = width;

  // First loop: look for noise generator pixels and set their values in u
  for (let i = 0; i < _area; ++i) {
    let s = _status[i];
    if (s === STATUS_POS_TRANSMITTER) {
      _u[i] = signalAmplitude;
      _v[i] = 0;
      _force[i] = 0;
    }
    if (s === STATUS_NEG_TRANSMITTER) {
      _u[i] = -signalAmplitude;
      _v[i] = 0;
      _force[i] = 0;
    }
  }

  for (let i = 0; i < _area; ++i) {
    if (_status[i] === STATUS_DEFAULT) {
      let uCen   = _u[i];
      let uNorth = _u[i - _width];
      let uSouth = _u[i + _width];
      let uEast  = _u[i + 1];
      let uWest  = _u[i - 1];

      let uxx = (((uWest  + uEast)  >> 1) - uCen);
      let uyy = (((uNorth + uSouth) >> 1) - uCen);

      let vel = _v[i] + (uxx >> 1) + (uyy >> 1);
      vel -= select(vel >> dampingBitShift, 0, dampingBitShift != 0);
      _v[i] = applyCap(vel);
    }
  }

  for (let i = 0; i < _area; ++i) {
    let stat = _status[i];
    if (stat === STATUS_DEFAULT) {
      let f = _force[i];
      let capped = applyCap(_u[i] + _v[i]);
      _u[i] = applyCap(f + capped);
      _force[i] -= (f >> FORCE_DAMPING_BIT_SHIFT);
    }
    if (stat === STATUS_WALL) {
      _image[i] = 0x00000000;
    } else {
      _image[i] = toRGB(_u[i]);
    }
  }
}
