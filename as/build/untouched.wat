(module
 (type $FUNCSIG$viiii (func (param i32 i32 i32 i32)))
 (type $FUNCSIG$iii (func (param i32 i32) (result i32)))
 (type $FUNCSIG$ii (func (param i32) (result i32)))
 (type $FUNCSIG$vi (func (param i32)))
 (type $FUNCSIG$vii (func (param i32 i32)))
 (type $FUNCSIG$v (func))
 (memory $0 0)
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $assembly/index/STATUS_DEFAULT i32 (i32.const 0))
 (global $assembly/index/STATUS_WALL i32 (i32.const 1))
 (global $assembly/index/STATUS_POS_TRANSMITTER i32 (i32.const 2))
 (global $assembly/index/STATUS_NEG_TRANSMITTER i32 (i32.const 3))
 (global $assembly/index/FORCE_DAMPING_BIT_SHIFT i32 (i32.const 4))
 (global $assembly/index/width (mut i32) (i32.const 0))
 (global $assembly/index/height (mut i32) (i32.const 0))
 (global $assembly/index/area (mut i32) (i32.const 0))
 (global $assembly/index/image (mut i32) (i32.const 0))
 (global $assembly/index/force (mut i32) (i32.const 0))
 (global $assembly/index/status (mut i32) (i32.const 0))
 (global $assembly/index/u (mut i32) (i32.const 0))
 (global $assembly/index/v (mut i32) (i32.const 0))
 (export "memory" (memory $0))
 (export "init" (func $assembly/index/init))
 (export "step" (func $assembly/index/step))
 (func $~lib/rt/stub/__retain (; 0 ;) (type $FUNCSIG$ii) (param $0 i32) (result i32)
  local.get $0
 )
 (func $assembly/index/Pointer#constructor (; 1 ;) (type $FUNCSIG$iii) (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  call $~lib/rt/stub/__retain
 )
 (func $~lib/rt/stub/__release (; 2 ;) (type $FUNCSIG$vi) (param $0 i32)
  nop
 )
 (func $assembly/index/init (; 3 ;) (type $FUNCSIG$viiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  local.get $2
  global.set $assembly/index/width
  local.get $3
  global.set $assembly/index/height
  global.get $assembly/index/width
  global.get $assembly/index/height
  i32.mul
  global.set $assembly/index/area
  i32.const 0
  local.get $1
  call $assembly/index/Pointer#constructor
  local.set $4
  global.get $assembly/index/image
  call $~lib/rt/stub/__release
  local.get $4
  global.set $assembly/index/image
  i32.const 0
  local.get $1
  i32.const 4
  global.get $assembly/index/area
  i32.mul
  i32.add
  call $assembly/index/Pointer#constructor
  local.set $4
  global.get $assembly/index/force
  call $~lib/rt/stub/__release
  local.get $4
  global.set $assembly/index/force
  i32.const 0
  local.get $1
  i32.const 8
  global.get $assembly/index/area
  i32.mul
  i32.add
  call $assembly/index/Pointer#constructor
  local.set $4
  global.get $assembly/index/status
  call $~lib/rt/stub/__release
  local.get $4
  global.set $assembly/index/status
  i32.const 0
  local.get $1
  i32.const 12
  global.get $assembly/index/area
  i32.mul
  i32.add
  call $assembly/index/Pointer#constructor
  local.set $4
  global.get $assembly/index/u
  call $~lib/rt/stub/__release
  local.get $4
  global.set $assembly/index/u
  i32.const 0
  local.get $1
  i32.const 16
  global.get $assembly/index/area
  i32.mul
  i32.add
  call $assembly/index/Pointer#constructor
  local.set $4
  global.get $assembly/index/v
  call $~lib/rt/stub/__release
  local.get $4
  global.set $assembly/index/v
  block $break|0
   i32.const 0
   local.set $4
   loop $loop|0
    local.get $4
    global.get $assembly/index/height
    i32.lt_s
    i32.eqz
    br_if $break|0
    global.get $assembly/index/status
    local.set $7
    local.get $4
    global.get $assembly/index/width
    i32.mul
    local.set $6
    global.get $assembly/index/STATUS_WALL
    local.set $5
    local.get $7
    local.get $6
    i32.const 2
    i32.shl
    i32.add
    local.get $5
    i32.store
    global.get $assembly/index/status
    local.set $7
    local.get $4
    global.get $assembly/index/width
    i32.mul
    global.get $assembly/index/width
    i32.add
    i32.const 1
    i32.sub
    local.set $6
    global.get $assembly/index/STATUS_WALL
    local.set $5
    local.get $7
    local.get $6
    i32.const 2
    i32.shl
    i32.add
    local.get $5
    i32.store
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $loop|0
   end
   unreachable
  end
  block $break|1
   i32.const 0
   local.set $4
   loop $loop|1
    local.get $4
    global.get $assembly/index/width
    i32.lt_s
    i32.eqz
    br_if $break|1
    global.get $assembly/index/status
    local.set $7
    local.get $4
    local.set $6
    global.get $assembly/index/STATUS_WALL
    local.set $5
    local.get $7
    local.get $6
    i32.const 2
    i32.shl
    i32.add
    local.get $5
    i32.store
    global.get $assembly/index/status
    local.set $7
    global.get $assembly/index/area
    global.get $assembly/index/width
    i32.sub
    local.get $4
    i32.add
    local.set $6
    global.get $assembly/index/STATUS_WALL
    local.set $5
    local.get $7
    local.get $6
    i32.const 2
    i32.shl
    i32.add
    local.get $5
    i32.store
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $loop|1
   end
   unreachable
  end
 )
 (func $assembly/index/step (; 4 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  (local $19 i32)
  (local $20 i32)
  global.get $assembly/index/area
  local.set $2
  global.get $assembly/index/status
  call $~lib/rt/stub/__retain
  local.set $3
  global.get $assembly/index/u
  call $~lib/rt/stub/__retain
  local.set $4
  global.get $assembly/index/v
  call $~lib/rt/stub/__retain
  local.set $5
  global.get $assembly/index/force
  call $~lib/rt/stub/__retain
  local.set $6
  global.get $assembly/index/image
  call $~lib/rt/stub/__retain
  local.set $7
  global.get $assembly/index/width
  local.set $8
  block $break|0
   i32.const 0
   local.set $9
   loop $loop|0
    local.get $9
    local.get $2
    i32.lt_s
    i32.eqz
    br_if $break|0
    local.get $3
    local.set $11
    local.get $9
    local.set $10
    local.get $11
    local.get $10
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.set $11
    local.get $11
    i32.const 2
    i32.eq
    if
     local.get $4
     local.set $13
     local.get $9
     local.set $12
     local.get $0
     local.set $10
     local.get $13
     local.get $12
     i32.const 2
     i32.shl
     i32.add
     local.get $10
     i32.store
     local.get $5
     local.set $13
     local.get $9
     local.set $12
     i32.const 0
     local.set $10
     local.get $13
     local.get $12
     i32.const 2
     i32.shl
     i32.add
     local.get $10
     i32.store
     local.get $6
     local.set $13
     local.get $9
     local.set $12
     i32.const 0
     local.set $10
     local.get $13
     local.get $12
     i32.const 2
     i32.shl
     i32.add
     local.get $10
     i32.store
    end
    local.get $11
    i32.const 3
    i32.eq
    if
     local.get $4
     local.set $13
     local.get $9
     local.set $12
     i32.const 0
     local.get $0
     i32.sub
     local.set $10
     local.get $13
     local.get $12
     i32.const 2
     i32.shl
     i32.add
     local.get $10
     i32.store
     local.get $5
     local.set $13
     local.get $9
     local.set $12
     i32.const 0
     local.set $10
     local.get $13
     local.get $12
     i32.const 2
     i32.shl
     i32.add
     local.get $10
     i32.store
     local.get $6
     local.set $13
     local.get $9
     local.set $12
     i32.const 0
     local.set $10
     local.get $13
     local.get $12
     i32.const 2
     i32.shl
     i32.add
     local.get $10
     i32.store
    end
    local.get $9
    i32.const 1
    i32.add
    local.set $9
    br $loop|0
   end
   unreachable
  end
  block $break|1
   i32.const 0
   local.set $11
   loop $loop|1
    local.get $11
    local.get $2
    i32.lt_s
    i32.eqz
    br_if $break|1
    local.get $3
    local.set $12
    local.get $11
    local.set $10
    local.get $12
    local.get $10
    i32.const 2
    i32.shl
    i32.add
    i32.load
    i32.const 0
    i32.eq
    if
     local.get $4
     local.set $9
     local.get $11
     local.set $13
     local.get $9
     local.get $13
     i32.const 2
     i32.shl
     i32.add
     i32.load
     local.set $9
     local.get $4
     local.set $12
     local.get $11
     local.get $8
     i32.sub
     local.set $10
     local.get $12
     local.get $10
     i32.const 2
     i32.shl
     i32.add
     i32.load
     local.set $12
     local.get $4
     local.set $10
     local.get $11
     local.get $8
     i32.add
     local.set $13
     local.get $10
     local.get $13
     i32.const 2
     i32.shl
     i32.add
     i32.load
     local.set $10
     local.get $4
     local.set $14
     local.get $11
     i32.const 1
     i32.add
     local.set $13
     local.get $14
     local.get $13
     i32.const 2
     i32.shl
     i32.add
     i32.load
     local.set $14
     local.get $4
     local.set $15
     local.get $11
     i32.const 1
     i32.sub
     local.set $13
     local.get $15
     local.get $13
     i32.const 2
     i32.shl
     i32.add
     i32.load
     local.set $15
     local.get $15
     local.get $14
     i32.add
     i32.const 1
     i32.shr_s
     local.get $9
     i32.sub
     local.set $13
     local.get $12
     local.get $10
     i32.add
     i32.const 1
     i32.shr_s
     local.get $9
     i32.sub
     local.set $16
     local.get $5
     local.set $18
     local.get $11
     local.set $17
     local.get $18
     local.get $17
     i32.const 2
     i32.shl
     i32.add
     i32.load
     local.get $13
     i32.const 1
     i32.shr_s
     i32.add
     local.get $16
     i32.const 1
     i32.shr_s
     i32.add
     local.set $18
     local.get $1
     if
      local.get $18
      local.get $18
      local.get $1
      i32.shr_s
      i32.sub
      local.set $18
     end
     local.get $5
     local.set $20
     local.get $11
     local.set $19
     local.get $18
     local.set $17
     local.get $17
     i32.const -1073741824
     i32.lt_s
     if (result i32)
      i32.const -1073741824
     else
      local.get $17
      i32.const 1073741823
      i32.gt_s
      if (result i32)
       i32.const 1073741823
      else
       local.get $17
      end
     end
     local.set $17
     local.get $20
     local.get $19
     i32.const 2
     i32.shl
     i32.add
     local.get $17
     i32.store
    end
    local.get $11
    i32.const 1
    i32.add
    local.set $11
    br $loop|1
   end
   unreachable
  end
  block $break|2
   i32.const 0
   local.set $11
   loop $loop|2
    local.get $11
    local.get $2
    i32.lt_s
    i32.eqz
    br_if $break|2
    local.get $3
    local.set $19
    local.get $11
    local.set $17
    local.get $19
    local.get $17
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.set $19
    local.get $4
    local.set $9
    local.get $11
    local.set $20
    local.get $9
    local.get $20
    i32.const 2
    i32.shl
    i32.add
    i32.load
    local.set $9
    local.get $19
    i32.const 0
    i32.eq
    if
     local.get $6
     local.set $10
     local.get $11
     local.set $12
     local.get $10
     local.get $12
     i32.const 2
     i32.shl
     i32.add
     i32.load
     local.set $10
     local.get $9
     local.get $5
     local.set $15
     local.get $11
     local.set $14
     local.get $15
     local.get $14
     i32.const 2
     i32.shl
     i32.add
     i32.load
     i32.add
     local.set $13
     local.get $13
     i32.const -1073741824
     i32.lt_s
     if (result i32)
      i32.const -1073741824
     else
      local.get $13
      i32.const 1073741823
      i32.gt_s
      if (result i32)
       i32.const 1073741823
      else
       local.get $13
      end
     end
     local.set $13
     local.get $10
     local.get $13
     i32.add
     local.set $16
     local.get $16
     i32.const -1073741824
     i32.lt_s
     if (result i32)
      i32.const -1073741824
     else
      local.get $16
      i32.const 1073741823
      i32.gt_s
      if (result i32)
       i32.const 1073741823
      else
       local.get $16
      end
     end
     local.set $9
     local.get $4
     local.set $20
     local.get $11
     local.set $17
     local.get $9
     local.set $18
     local.get $20
     local.get $17
     i32.const 2
     i32.shl
     i32.add
     local.get $18
     i32.store
     local.get $6
     local.set $15
     local.get $11
     local.set $14
     local.get $10
     local.get $10
     global.get $assembly/index/FORCE_DAMPING_BIT_SHIFT
     i32.shr_s
     i32.sub
     local.set $12
     local.get $15
     local.get $14
     i32.const 2
     i32.shl
     i32.add
     local.get $12
     i32.store
    end
    local.get $19
    i32.const 1
    i32.eq
    if
     local.get $7
     local.set $17
     local.get $11
     local.set $18
     i32.const 0
     local.set $16
     local.get $17
     local.get $18
     i32.const 2
     i32.shl
     i32.add
     local.get $16
     i32.store
    else
     local.get $7
     local.set $15
     local.get $11
     local.set $14
     block $assembly/index/toRGB|inlined.0 (result i32)
      local.get $9
      local.set $20
      local.get $20
      i32.const 22
      i32.shr_s
      local.set $17
      local.get $17
      i32.const 0
      i32.lt_s
      if
       i32.const 0
       local.get $17
       i32.const 1
       i32.add
       i32.sub
       i32.const 0
       local.get $17
       i32.const 1
       i32.add
       i32.sub
       i32.const 254
       i32.and
       i32.const 15
       i32.shl
       i32.or
       i32.const -16777216
       i32.or
       br $assembly/index/toRGB|inlined.0
      end
      local.get $17
      i32.const 8
      i32.shl
      local.get $17
      i32.const 254
      i32.and
      i32.const 15
      i32.shl
      i32.or
      i32.const -16777216
      i32.or
     end
     local.set $12
     local.get $15
     local.get $14
     i32.const 2
     i32.shl
     i32.add
     local.get $12
     i32.store
    end
    local.get $11
    i32.const 1
    i32.add
    local.set $11
    br $loop|2
   end
   unreachable
  end
  local.get $3
  call $~lib/rt/stub/__release
  local.get $4
  call $~lib/rt/stub/__release
  local.get $5
  call $~lib/rt/stub/__release
  local.get $6
  call $~lib/rt/stub/__release
  local.get $7
  call $~lib/rt/stub/__release
 )
 (func $null (; 5 ;) (type $FUNCSIG$v)
 )
)
