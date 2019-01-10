(module
 (type $iiiiv (func (param i32 i32 i32 i32)))
 (type $iiv (func (param i32 i32)))
 (type $v (func))
 (memory $0 0)
 (table $0 1 anyfunc)
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
 (func $assembly/index/init (; 0 ;) (type $iiiiv) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  get_local $2
  set_global $assembly/index/width
  get_local $3
  set_global $assembly/index/height
  get_global $assembly/index/width
  get_global $assembly/index/height
  i32.mul
  set_global $assembly/index/area
  get_local $1
  set_global $assembly/index/image
  get_global $assembly/index/area
  i32.const 2
  i32.shl
  get_local $1
  i32.add
  set_global $assembly/index/force
  get_global $assembly/index/area
  i32.const 3
  i32.shl
  get_local $1
  i32.add
  set_global $assembly/index/status
  get_global $assembly/index/area
  i32.const 12
  i32.mul
  get_local $1
  i32.add
  set_global $assembly/index/u
  get_global $assembly/index/area
  i32.const 4
  i32.shl
  get_local $1
  i32.add
  set_global $assembly/index/v
  i32.const 0
  set_local $0
  loop $repeat|0
   get_local $0
   get_global $assembly/index/height
   i32.lt_s
   if
    get_global $assembly/index/status
    get_global $assembly/index/width
    get_local $0
    i32.mul
    i32.const 2
    i32.shl
    i32.add
    i32.const 1
    i32.store
    get_global $assembly/index/status
    get_global $assembly/index/width
    tee_local $1
    get_local $0
    get_local $1
    i32.mul
    i32.add
    i32.const 1
    i32.sub
    i32.const 2
    i32.shl
    i32.add
    i32.const 1
    i32.store
    get_local $0
    i32.const 1
    i32.add
    set_local $0
    br $repeat|0
   end
  end
  i32.const 0
  set_local $0
  loop $repeat|1
   get_local $0
   get_global $assembly/index/width
   i32.lt_s
   if
    get_global $assembly/index/status
    get_local $0
    i32.const 2
    i32.shl
    i32.add
    i32.const 1
    i32.store
    get_global $assembly/index/status
    get_global $assembly/index/area
    get_global $assembly/index/width
    i32.sub
    get_local $0
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.const 1
    i32.store
    get_local $0
    i32.const 1
    i32.add
    set_local $0
    br $repeat|1
   end
  end
 )
 (func $assembly/index/step (; 1 ;) (type $iiv) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  get_global $assembly/index/area
  set_local $7
  get_global $assembly/index/status
  set_local $8
  get_global $assembly/index/u
  set_local $3
  get_global $assembly/index/v
  set_local $5
  get_global $assembly/index/force
  set_local $6
  get_global $assembly/index/image
  set_local $9
  get_global $assembly/index/width
  set_local $10
  loop $repeat|0
   get_local $2
   get_local $7
   i32.lt_s
   if
    get_local $2
    i32.const 2
    i32.shl
    get_local $8
    i32.add
    i32.load
    tee_local $4
    i32.const 2
    i32.eq
    if
     get_local $2
     i32.const 2
     i32.shl
     get_local $3
     i32.add
     get_local $0
     i32.store
     get_local $2
     i32.const 2
     i32.shl
     get_local $5
     i32.add
     i32.const 0
     i32.store
     get_local $2
     i32.const 2
     i32.shl
     get_local $6
     i32.add
     i32.const 0
     i32.store
    end
    get_local $4
    i32.const 3
    i32.eq
    if
     get_local $2
     i32.const 2
     i32.shl
     get_local $3
     i32.add
     i32.const 0
     get_local $0
     i32.sub
     i32.store
     get_local $2
     i32.const 2
     i32.shl
     get_local $5
     i32.add
     i32.const 0
     i32.store
     get_local $2
     i32.const 2
     i32.shl
     get_local $6
     i32.add
     i32.const 0
     i32.store
    end
    get_local $2
    i32.const 1
    i32.add
    set_local $2
    br $repeat|0
   end
  end
  i32.const 0
  set_local $2
  loop $repeat|1
   get_local $2
   get_local $7
   i32.lt_s
   if
    get_local $2
    i32.const 2
    i32.shl
    get_local $8
    i32.add
    i32.load
    i32.eqz
    if
     get_local $2
     i32.const 2
     i32.shl
     get_local $5
     i32.add
     get_local $2
     i32.const 2
     i32.shl
     get_local $5
     i32.add
     i32.load
     get_local $2
     i32.const 1
     i32.add
     i32.const 2
     i32.shl
     get_local $3
     i32.add
     i32.load
     get_local $2
     i32.const 1
     i32.sub
     i32.const 2
     i32.shl
     get_local $3
     i32.add
     i32.load
     i32.add
     i32.const 1
     i32.shr_s
     get_local $2
     i32.const 2
     i32.shl
     get_local $3
     i32.add
     i32.load
     tee_local $4
     i32.sub
     i32.const 1
     i32.shr_s
     i32.add
     get_local $2
     get_local $10
     i32.sub
     i32.const 2
     i32.shl
     get_local $3
     i32.add
     i32.load
     get_local $2
     get_local $10
     i32.add
     i32.const 2
     i32.shl
     get_local $3
     i32.add
     i32.load
     i32.add
     i32.const 1
     i32.shr_s
     get_local $4
     i32.sub
     i32.const 1
     i32.shr_s
     i32.add
     tee_local $4
     get_local $4
     get_local $1
     i32.shr_s
     i32.const 0
     get_local $1
     select
     i32.sub
     tee_local $4
     i32.const -1073741824
     i32.lt_s
     if (result i32)
      i32.const -1073741824
     else      
      i32.const 1073741823
      get_local $4
      get_local $4
      i32.const 1073741823
      i32.gt_s
      select
     end
     i32.store
    end
    get_local $2
    i32.const 1
    i32.add
    set_local $2
    br $repeat|1
   end
  end
  i32.const 0
  set_local $2
  loop $repeat|2
   get_local $2
   get_local $7
   i32.lt_s
   if
    get_local $2
    i32.const 2
    i32.shl
    get_local $8
    i32.add
    i32.load
    tee_local $4
    i32.eqz
    if
     get_local $2
     i32.const 2
     i32.shl
     get_local $6
     i32.add
     i32.load
     set_local $1
     get_local $2
     i32.const 2
     i32.shl
     get_local $3
     i32.add
     get_local $2
     i32.const 2
     i32.shl
     get_local $3
     i32.add
     i32.load
     get_local $2
     i32.const 2
     i32.shl
     get_local $5
     i32.add
     i32.load
     i32.add
     tee_local $0
     i32.const -1073741824
     i32.lt_s
     if (result i32)
      i32.const -1073741824
     else      
      i32.const 1073741823
      get_local $0
      get_local $0
      i32.const 1073741823
      i32.gt_s
      select
     end
     get_local $1
     i32.add
     tee_local $0
     i32.const -1073741824
     i32.lt_s
     if (result i32)
      i32.const -1073741824
     else      
      i32.const 1073741823
      get_local $0
      get_local $0
      i32.const 1073741823
      i32.gt_s
      select
     end
     i32.store
     get_local $2
     i32.const 2
     i32.shl
     get_local $6
     i32.add
     get_local $2
     i32.const 2
     i32.shl
     get_local $6
     i32.add
     i32.load
     get_local $1
     i32.const 4
     i32.shr_s
     i32.sub
     i32.store
    end
    get_local $4
    i32.const 1
    i32.eq
    if
     get_local $2
     i32.const 2
     i32.shl
     get_local $9
     i32.add
     i32.const 0
     i32.store
    else     
     get_local $2
     i32.const 2
     i32.shl
     get_local $9
     i32.add
     block $assembly/index/toRGB|inlined.0 (result i32)
      get_local $2
      i32.const 2
      i32.shl
      get_local $3
      i32.add
      i32.load
      i32.const 22
      i32.shr_s
      tee_local $1
      i32.const 0
      i32.lt_s
      if
       i32.const 0
       get_local $1
       i32.const 1
       i32.add
       i32.sub
       i32.const -16777216
       i32.or
       br $assembly/index/toRGB|inlined.0
      end
      get_local $1
      i32.const 8
      i32.shl
      get_local $1
      i32.const 16
      i32.shl
      i32.or
      i32.const -16777216
      i32.or
     end
     i32.store
    end
    get_local $2
    i32.const 1
    i32.add
    set_local $2
    br $repeat|2
   end
  end
 )
 (func $null (; 2 ;) (type $v)
  nop
 )
)
