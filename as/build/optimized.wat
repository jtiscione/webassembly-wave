(module
 (type $FUNCSIG$viiii (func (param i32 i32 i32 i32)))
 (type $FUNCSIG$vii (func (param i32 i32)))
 (type $FUNCSIG$v (func))
 (memory $0 0)
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
 (func $assembly/index/init (; 0 ;) (type $FUNCSIG$viiii) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  local.get $2
  global.set $assembly/index/width
  local.get $3
  global.set $assembly/index/height
  global.get $assembly/index/width
  global.get $assembly/index/height
  i32.mul
  global.set $assembly/index/area
  local.get $1
  global.set $assembly/index/image
  global.get $assembly/index/area
  i32.const 2
  i32.shl
  local.get $1
  i32.add
  global.set $assembly/index/force
  global.get $assembly/index/area
  i32.const 3
  i32.shl
  local.get $1
  i32.add
  global.set $assembly/index/status
  global.get $assembly/index/area
  i32.const 12
  i32.mul
  local.get $1
  i32.add
  global.set $assembly/index/u
  global.get $assembly/index/area
  i32.const 4
  i32.shl
  local.get $1
  i32.add
  global.set $assembly/index/v
  i32.const 0
  local.set $0
  loop $loop|0
   local.get $0
   global.get $assembly/index/height
   i32.lt_s
   if
    global.get $assembly/index/status
    local.tee $2
    global.get $assembly/index/width
    local.tee $1
    local.get $0
    i32.mul
    i32.const 2
    i32.shl
    i32.add
    i32.const 1
    i32.store
    local.get $0
    local.get $1
    i32.mul
    local.get $1
    i32.add
    i32.const 1
    i32.sub
    i32.const 2
    i32.shl
    local.get $2
    i32.add
    i32.const 1
    i32.store
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $loop|0
   end
  end
  i32.const 0
  local.set $0
  loop $loop|1
   local.get $0
   global.get $assembly/index/width
   i32.lt_s
   if
    global.get $assembly/index/status
    local.tee $1
    local.get $0
    i32.const 2
    i32.shl
    i32.add
    i32.const 1
    i32.store
    global.get $assembly/index/area
    global.get $assembly/index/width
    i32.sub
    local.get $0
    i32.add
    i32.const 2
    i32.shl
    local.get $1
    i32.add
    i32.const 1
    i32.store
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $loop|1
   end
  end
 )
 (func $assembly/index/step (; 1 ;) (type $FUNCSIG$vii) (param $0 i32) (param $1 i32)
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
  global.get $assembly/index/area
  local.set $8
  global.get $assembly/index/status
  local.set $9
  global.get $assembly/index/u
  local.set $4
  global.get $assembly/index/v
  local.set $5
  global.get $assembly/index/force
  local.set $6
  global.get $assembly/index/image
  local.set $10
  global.get $assembly/index/width
  local.set $7
  loop $loop|0
   local.get $2
   local.get $8
   i32.lt_s
   if
    local.get $2
    i32.const 2
    i32.shl
    local.get $9
    i32.add
    i32.load
    local.tee $11
    i32.const 2
    i32.eq
    if
     local.get $2
     i32.const 2
     i32.shl
     local.tee $3
     local.get $4
     i32.add
     local.get $0
     i32.store
     local.get $3
     local.get $5
     i32.add
     i32.const 0
     i32.store
     local.get $3
     local.get $6
     i32.add
     i32.const 0
     i32.store
    end
    local.get $11
    i32.const 3
    i32.eq
    if
     local.get $2
     i32.const 2
     i32.shl
     local.tee $3
     local.get $4
     i32.add
     i32.const 0
     local.get $0
     i32.sub
     i32.store
     local.get $3
     local.get $5
     i32.add
     i32.const 0
     i32.store
     local.get $3
     local.get $6
     i32.add
     i32.const 0
     i32.store
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $loop|0
   end
  end
  i32.const 0
  local.set $2
  loop $loop|1
   local.get $2
   local.get $8
   i32.lt_s
   if
    local.get $2
    i32.const 2
    i32.shl
    local.get $9
    i32.add
    i32.load
    i32.eqz
    if
     local.get $2
     i32.const 2
     i32.shl
     local.tee $3
     local.get $4
     i32.add
     i32.load
     local.set $0
     local.get $2
     i32.const 2
     i32.shl
     local.get $5
     i32.add
     local.get $3
     local.get $5
     i32.add
     i32.load
     local.get $2
     i32.const 1
     i32.add
     i32.const 2
     i32.shl
     local.get $4
     i32.add
     i32.load
     local.get $2
     i32.const 1
     i32.sub
     i32.const 2
     i32.shl
     local.get $4
     i32.add
     i32.load
     i32.add
     i32.const 1
     i32.shr_s
     local.get $0
     i32.sub
     i32.const 1
     i32.shr_s
     i32.add
     local.get $2
     local.get $7
     i32.sub
     i32.const 2
     i32.shl
     local.get $4
     i32.add
     i32.load
     local.get $2
     local.get $7
     i32.add
     i32.const 2
     i32.shl
     local.get $4
     i32.add
     i32.load
     i32.add
     i32.const 1
     i32.shr_s
     local.get $0
     i32.sub
     i32.const 1
     i32.shr_s
     i32.add
     local.tee $0
     local.get $0
     local.get $1
     i32.shr_s
     i32.sub
     local.get $0
     local.get $1
     select
     local.tee $0
     i32.const -1073741824
     i32.lt_s
     if (result i32)
      i32.const -1073741824
     else
      i32.const 1073741823
      local.get $0
      local.get $0
      i32.const 1073741823
      i32.gt_s
      select
     end
     i32.store
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $loop|1
   end
  end
  i32.const 0
  local.set $2
  loop $loop|2
   local.get $2
   local.get $8
   i32.lt_s
   if
    local.get $2
    i32.const 2
    i32.shl
    local.tee $1
    local.get $4
    i32.add
    i32.load
    local.set $0
    local.get $1
    local.get $9
    i32.add
    i32.load
    local.tee $7
    i32.eqz
    if
     local.get $2
     i32.const 2
     i32.shl
     local.tee $3
     local.get $6
     i32.add
     i32.load
     local.set $1
     local.get $3
     local.get $5
     i32.add
     i32.load
     local.get $0
     i32.add
     local.tee $0
     i32.const -1073741824
     i32.lt_s
     if (result i32)
      i32.const -1073741824
     else
      i32.const 1073741823
      local.get $0
      local.get $0
      i32.const 1073741823
      i32.gt_s
      select
     end
     local.get $1
     i32.add
     local.tee $0
     i32.const -1073741824
     i32.lt_s
     if (result i32)
      i32.const -1073741824
     else
      i32.const 1073741823
      local.get $0
      local.get $0
      i32.const 1073741823
      i32.gt_s
      select
     end
     local.set $0
     local.get $2
     i32.const 2
     i32.shl
     local.tee $3
     local.get $4
     i32.add
     local.get $0
     i32.store
     local.get $3
     local.get $6
     i32.add
     local.get $1
     local.get $1
     i32.const 4
     i32.shr_s
     i32.sub
     i32.store
    end
    local.get $7
    i32.const 1
    i32.eq
    if
     local.get $2
     i32.const 2
     i32.shl
     local.get $10
     i32.add
     i32.const 0
     i32.store
    else
     local.get $2
     i32.const 2
     i32.shl
     local.get $10
     i32.add
     block $assembly/index/toRGB|inlined.0 (result i32)
      local.get $0
      i32.const 22
      i32.shr_s
      local.tee $0
      i32.const 0
      i32.lt_s
      if
       i32.const 0
       local.get $0
       i32.const 1
       i32.add
       i32.sub
       local.tee $0
       local.get $0
       i32.const 254
       i32.and
       i32.const 15
       i32.shl
       i32.or
       i32.const -16777216
       i32.or
       br $assembly/index/toRGB|inlined.0
      end
      local.get $0
      i32.const 8
      i32.shl
      local.get $0
      i32.const 254
      i32.and
      i32.const 15
      i32.shl
      i32.or
      i32.const -16777216
      i32.or
     end
     i32.store
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $loop|2
   end
  end
 )
 (func $null (; 2 ;) (type $FUNCSIG$v)
  unreachable
 )
)
