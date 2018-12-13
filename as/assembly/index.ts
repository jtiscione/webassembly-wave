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
    return select(-(val + 1), (val << 8) | (val << 16), val < 0) | 0xFF000000;
}

var width: i32 = 0;
var height: i32 = 0;
var area: i32 = 0;
var HEAP_BASE:i32 = 0;

export function init(ignored: i32, offset: i32, w: i32, h: i32): void {
    HEAP_BASE = offset;
    width = w;
    height = h;
    area = width * height;
    var status = new Pointer(HEAP_BASE + 8 * area);

    for (let i = 0; i < height; ++i) {
        status[i * width] = 1;
        status[i * width + width - 1] = 1;
    }

    for (let i = 0; i < width; ++i) {
        status[i] = 1;
        status[area - width + i] = 1;
    }
}

export function step(signalAmplitude: i32, dampingBitShift: i32): void {

    var image  = new Pointer(HEAP_BASE);
    var force  = new Pointer(HEAP_BASE + 4  * area);
    var status = new Pointer(HEAP_BASE + 8  * area);
    var u      = new Pointer(HEAP_BASE + 12 * area);
    var vel    = new Pointer(HEAP_BASE + 16 * area);

    for (let i = 0; i < area; ++i) {
        if (!status[i]) {
            let uCen   = u[i];
            let uNorth = u[i - width];
            let uSouth = u[i + width];
            let uEast  = u[i + 1];
            let uWest  = u[i - 1];

            let uxx = (((uWest  + uEast)  >> 1) - uCen);
            let uyy = (((uNorth + uSouth) >> 1) - uCen);

            vel[i] = applyCap(vel[i] + (uxx >> 1) + (uyy >> 1));
        }
    }

    for (let i = 0; i < area; ++i) {
        if (!status[i]) {
            let f = force[i];
            u[i] = applyCap(f + u[i] + vel[i]);
            force[i] = f >> 1;
        }
    }

    for (let i = 0; i < area; ++i) {
        image[i] = status[i] == 1 ? 0xFFFF0000 : toRGB(u[i]);
    }
}
