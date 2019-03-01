(module
 (type $iiii_ (func (param i32 i32 i32 i32)))
 (type $ii_ (func (param i32 i32)))
 (type $_ (func))
 (memory $0 0)
 (table $0 1 funcref)
 (elem (i32.const 0) $null)
 (global $assembly/index/width (mut i32) (i32.const 0))
 (global $assembly/index/height (mut i32) (i32.const 0))
 (global $assembly/index/area (mut i32) (i32.const 0))
 (global $assembly/index/image (mut i32) (i32.const 0))
 (global $assembly/index/force (mut i32) (i32.const 0))
 (global $assembly/index/status (mut i32) (i32.const 0))
 (global $assembly/index/u (mut i32) (i32.const 0))
 (global $assembly/index/v (mut i32) (i32.const 0))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "init" (func $assembly/index/init))
 (export "step" (func $assembly/index/step))
 (func $assembly/index/init (; 0 ;) (type $iiii_) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
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
  loop $repeat|0
   local.get $0
   global.get $assembly/index/height
   i32.lt_s
   if
    global.get $assembly/index/status
    global.get $assembly/index/width
    local.get $0
    i32.mul
    i32.const 2
    i32.shl
    i32.add
    i32.const 1
    i32.store
    global.get $assembly/index/status
    global.get $assembly/index/width
    local.tee $1
    local.get $0
    local.get $1
    i32.mul
    i32.add
    i32.const 1
    i32.sub
    i32.const 2
    i32.shl
    i32.add
    i32.const 1
    i32.store
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $repeat|0
   end
  end
  i32.const 0
  local.set $0
  loop $repeat|1
   local.get $0
   global.get $assembly/index/width
   i32.lt_s
   if
    global.get $assembly/index/status
    local.get $0
    i32.const 2
    i32.shl
    i32.add
    i32.const 1
    i32.store
    global.get $assembly/index/status
    global.get $assembly/index/area
    global.get $assembly/index/width
    i32.sub
    local.get $0
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.const 1
    i32.store
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $repeat|1
   end
  end
 )
 (func $assembly/index/step (; 1 ;) (type $ii_) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  global.get $assembly/index/area
  local.set $7
  global.get $assembly/index/status
  local.set $8
  global.get $assembly/index/u
  local.set $3
  global.get $assembly/index/v
  local.set $5
  global.get $assembly/index/force
  local.set $6
  global.get $assembly/index/image
  local.set $9
  global.get $assembly/index/width
  local.set $10
  loop $repeat|0
   local.get $2
   local.get $7
   i32.lt_s
   if
    local.get $2
    i32.const 2
    i32.shl
    local.get $8
    i32.add
    i32.load
    local.tee $4
    i32.const 2
    i32.eq
    if
     local.get $2
     i32.const 2
     i32.shl
     local.get $3
     i32.add
     local.get $0
     i32.store
     local.get $2
     i32.const 2
     i32.shl
     local.get $5
     i32.add
     i32.const 0
     i32.store
     local.get $2
     i32.const 2
     i32.shl
     local.get $6
     i32.add
     i32.const 0
     i32.store
    end
    local.get $4
    i32.const 3
    i32.eq
    if
     local.get $2
     i32.const 2
     i32.shl
     local.get $3
     i32.add
     i32.const 0
     local.get $0
     i32.sub
     i32.store
     local.get $2
     i32.const 2
     i32.shl
     local.get $5
     i32.add
     i32.const 0
     i32.store
     local.get $2
     i32.const 2
     i32.shl
     local.get $6
     i32.add
     i32.const 0
     i32.store
    end
    local.get $2
    i32.const 1
    i32.add
    local.set $2
    br $repeat|0
   end
  end
  i32.const 0
  local.set $2
  loop $repeat|1
   local.get $2
   local.get $7
   i32.lt_s
   if
    local.get $2
    i32.const 2
    i32.shl
    local.get $8
    i32.add
    i32.load
    i32.eqz
    if
     local.get $2
     i32.const 2
     i32.shl
     local.tee $4
     local.get $3
     i32.add
     i32.load
     local.set $0
     local.get $2
     i32.const 2
     i32.shl
     local.get $5
     i32.add
     local.get $4
     local.get $5
     i32.add
     i32.load
     local.get $2
     i32.const 1
     i32.add
     i32.const 2
     i32.shl
     local.get $3
     i32.add
     i32.load
     local.get $2
     i32.const 1
     i32.sub
     i32.const 2
     i32.shl
     local.get $3
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
     local.get $10
     i32.sub
     i32.const 2
     i32.shl
     local.get $3
     i32.add
     i32.load
     local.get $2
     local.get $10
     i32.add
     i32.const 2
     i32.shl
     local.get $3
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
     local.tee $4
     i32.const -1073741824
     i32.lt_s
     if (result i32)
      i32.const -1073741824
     else      
      i32.const 1073741823
      local.get $4
      local.get $4
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
    br $repeat|1
   end
  end
  i32.const 0
  local.set $2
  loop $repeat|2
   local.get $2
   local.get $7
   i32.lt_s
   if
    local.get $2
    i32.const 2
    i32.shl
    local.get $8
    i32.add
    i32.load
    local.tee $1
    i32.eqz
    if
     local.get $2
     i32.const 2
     i32.shl
     local.tee $0
     local.get $6
     i32.add
     i32.load
     local.set $4
     local.get $2
     i32.const 2
     i32.shl
     local.get $3
     i32.add
     local.get $0
     local.get $3
     i32.add
     i32.load
     local.get $0
     local.get $5
     i32.add
     i32.load
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
     local.get $4
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
     i32.store
     local.get $2
     i32.const 2
     i32.shl
     local.get $6
     i32.add
     local.get $4
     local.get $4
     i32.const 4
     i32.shr_s
     i32.sub
     i32.store
    end
    local.get $1
    i32.const 1
    i32.eq
    if
     local.get $2
     i32.const 2
     i32.shl
     local.get $9
     i32.add
     i32.const 0
     i32.store
    else     
     local.get $2
     i32.const 2
     i32.shl
     local.get $9
     i32.add
     block $assembly/index/toRGB|inlined.0 (result i32)
      local.get $2
      i32.const 2
      i32.shl
      local.get $3
      i32.add
      i32.load
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
       i32.const -16777216
       i32.or
       br $assembly/index/toRGB|inlined.0
      end
      local.get $0
      i32.const 8
      i32.shl
      local.get $0
      i32.const 16
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
    br $repeat|2
   end
  end
 )
 (func $null (; 2 ;) (type $_)
  nop
 )
)
