(module
 (type $iiiiv (func (param i32 i32 i32 i32)))
 (type $iii (func (param i32 i32) (result i32)))
 (type $iiiv (func (param i32 i32 i32)))
 (type $iiv (func (param i32 i32)))
 (type $v (func))
 (memory $0 0)
 (table $0 1 anyfunc)
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
 (global $HEAP_BASE i32 (i32.const 8))
 (export "memory" (memory $0))
 (export "table" (table $0))
 (export "init" (func $assembly/index/init))
 (export "step" (func $assembly/index/step))
 (func $assembly/index/Pointer#constructor (; 0 ;) (type $iii) (param $0 i32) (param $1 i32) (result i32)
  get_local $1
 )
 (func $assembly/index/Pointer#set (; 1 ;) (type $iiiv) (param $0 i32) (param $1 i32) (param $2 i32)
  get_local $0
  get_local $1
  i32.const 2
  i32.shl
  i32.add
  get_local $2
  i32.store
 )
 (func $assembly/index/init (; 2 ;) (type $iiiiv) (param $0 i32) (param $1 i32) (param $2 i32) (param $3 i32)
  (local $4 i32)
  get_local $2
  set_global $assembly/index/width
  get_local $3
  set_global $assembly/index/height
  get_global $assembly/index/width
  get_global $assembly/index/height
  i32.mul
  set_global $assembly/index/area
  i32.const 0
  get_local $1
  i32.const 8
  get_global $assembly/index/area
  i32.mul
  i32.add
  call $assembly/index/Pointer#constructor
  set_global $assembly/index/status
  i32.const 0
  get_local $1
  call $assembly/index/Pointer#constructor
  set_global $assembly/index/image
  i32.const 0
  get_local $1
  i32.const 4
  get_global $assembly/index/area
  i32.mul
  i32.add
  call $assembly/index/Pointer#constructor
  set_global $assembly/index/force
  i32.const 0
  get_local $1
  i32.const 8
  get_global $assembly/index/area
  i32.mul
  i32.add
  call $assembly/index/Pointer#constructor
  set_global $assembly/index/status
  i32.const 0
  get_local $1
  i32.const 12
  get_global $assembly/index/area
  i32.mul
  i32.add
  call $assembly/index/Pointer#constructor
  set_global $assembly/index/u
  i32.const 0
  get_local $1
  i32.const 16
  get_global $assembly/index/area
  i32.mul
  i32.add
  call $assembly/index/Pointer#constructor
  set_global $assembly/index/v
  block $break|0
   i32.const 0
   set_local $4
   loop $repeat|0
    get_local $4
    get_global $assembly/index/height
    i32.lt_s
    i32.eqz
    br_if $break|0
    block
     get_global $assembly/index/status
     get_local $4
     get_global $assembly/index/width
     i32.mul
     i32.const 1
     call $assembly/index/Pointer#set
     get_global $assembly/index/status
     get_local $4
     get_global $assembly/index/width
     i32.mul
     get_global $assembly/index/width
     i32.add
     i32.const 1
     i32.sub
     get_global $assembly/index/STATUS_WALL
     call $assembly/index/Pointer#set
    end
    get_local $4
    i32.const 1
    i32.add
    set_local $4
    br $repeat|0
    unreachable
   end
   unreachable
  end
  block $break|1
   i32.const 0
   set_local $4
   loop $repeat|1
    get_local $4
    get_global $assembly/index/width
    i32.lt_s
    i32.eqz
    br_if $break|1
    block
     get_global $assembly/index/status
     get_local $4
     i32.const 1
     call $assembly/index/Pointer#set
     get_global $assembly/index/status
     get_global $assembly/index/area
     get_global $assembly/index/width
     i32.sub
     get_local $4
     i32.add
     get_global $assembly/index/STATUS_WALL
     call $assembly/index/Pointer#set
    end
    get_local $4
    i32.const 1
    i32.add
    set_local $4
    br $repeat|1
    unreachable
   end
   unreachable
  end
 )
 (func $assembly/index/Pointer#get (; 3 ;) (type $iii) (param $0 i32) (param $1 i32) (result i32)
  get_local $0
  get_local $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
 )
 (func $assembly/index/step (; 4 ;) (type $iiv) (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  block $break|0
   i32.const 0
   set_local $2
   loop $repeat|0
    get_local $2
    get_global $assembly/index/area
    i32.lt_s
    i32.eqz
    br_if $break|0
    block
     get_global $assembly/index/status
     get_local $2
     call $assembly/index/Pointer#get
     get_global $assembly/index/STATUS_POS_TRANSMITTER
     i32.eq
     if
      get_global $assembly/index/u
      get_local $2
      get_local $0
      call $assembly/index/Pointer#set
      get_global $assembly/index/v
      get_local $2
      i32.const 0
      call $assembly/index/Pointer#set
      get_global $assembly/index/force
      get_local $2
      i32.const 0
      call $assembly/index/Pointer#set
     end
     get_global $assembly/index/status
     get_local $2
     call $assembly/index/Pointer#get
     get_global $assembly/index/STATUS_NEG_TRANSMITTER
     i32.eq
     if
      get_global $assembly/index/u
      get_local $2
      i32.const 0
      get_local $0
      i32.sub
      call $assembly/index/Pointer#set
      get_global $assembly/index/v
      get_local $2
      i32.const 0
      call $assembly/index/Pointer#set
      get_global $assembly/index/force
      get_local $2
      i32.const 0
      call $assembly/index/Pointer#set
     end
    end
    get_local $2
    i32.const 1
    i32.add
    set_local $2
    br $repeat|0
    unreachable
   end
   unreachable
  end
  block $break|1
   i32.const 0
   set_local $2
   loop $repeat|1
    get_local $2
    get_global $assembly/index/area
    i32.lt_s
    i32.eqz
    br_if $break|1
    get_global $assembly/index/status
    get_local $2
    call $assembly/index/Pointer#get
    get_global $assembly/index/STATUS_DEFAULT
    i32.eq
    if
     get_global $assembly/index/u
     get_local $2
     call $assembly/index/Pointer#get
     set_local $3
     get_global $assembly/index/u
     get_local $2
     get_global $assembly/index/width
     i32.sub
     call $assembly/index/Pointer#get
     set_local $4
     get_global $assembly/index/u
     get_local $2
     get_global $assembly/index/width
     i32.add
     call $assembly/index/Pointer#get
     set_local $5
     get_global $assembly/index/u
     get_local $2
     i32.const 1
     i32.add
     call $assembly/index/Pointer#get
     set_local $6
     get_global $assembly/index/u
     get_local $2
     i32.const 1
     i32.sub
     call $assembly/index/Pointer#get
     set_local $7
     get_local $7
     get_local $6
     i32.add
     i32.const 1
     i32.shr_s
     get_local $3
     i32.sub
     set_local $8
     get_local $4
     get_local $5
     i32.add
     i32.const 1
     i32.shr_s
     get_local $3
     i32.sub
     set_local $9
     get_global $assembly/index/v
     get_local $2
     call $assembly/index/Pointer#get
     get_local $8
     i32.const 1
     i32.shr_s
     i32.add
     get_local $9
     i32.const 1
     i32.shr_s
     i32.add
     set_local $10
     get_local $1
     if
      get_local $10
      get_local $10
      get_local $1
      i32.shr_s
      i32.sub
      set_local $10
     end
     get_global $assembly/index/v
     get_local $2
     block $assembly/index/applyCap|inlined.0 (result i32)
      i32.const -1073741824
      i32.const 1073741823
      get_local $10
      get_local $10
      i32.const 1073741823
      i32.gt_s
      select
      get_local $10
      i32.const -1073741824
      i32.lt_s
      select
     end
     call $assembly/index/Pointer#set
    end
    get_local $2
    i32.const 1
    i32.add
    set_local $2
    br $repeat|1
    unreachable
   end
   unreachable
  end
  block $break|2
   i32.const 0
   set_local $2
   loop $repeat|2
    get_local $2
    get_global $assembly/index/area
    i32.lt_s
    i32.eqz
    br_if $break|2
    get_global $assembly/index/status
    get_local $2
    call $assembly/index/Pointer#get
    get_global $assembly/index/STATUS_DEFAULT
    i32.eq
    if
     get_global $assembly/index/force
     get_local $2
     call $assembly/index/Pointer#get
     set_local $10
     block $assembly/index/applyCap|inlined.1 (result i32)
      get_global $assembly/index/u
      get_local $2
      call $assembly/index/Pointer#get
      get_global $assembly/index/v
      get_local $2
      call $assembly/index/Pointer#get
      i32.add
      set_local $9
      i32.const -1073741824
      i32.const 1073741823
      get_local $9
      get_local $9
      i32.const 1073741823
      i32.gt_s
      select
      get_local $9
      i32.const -1073741824
      i32.lt_s
      select
     end
     set_local $9
     get_global $assembly/index/u
     get_local $2
     block $assembly/index/applyCap|inlined.2 (result i32)
      get_local $10
      get_local $9
      i32.add
      set_local $8
      i32.const -1073741824
      i32.const 1073741823
      get_local $8
      get_local $8
      i32.const 1073741823
      i32.gt_s
      select
      get_local $8
      i32.const -1073741824
      i32.lt_s
      select
     end
     call $assembly/index/Pointer#set
     get_global $assembly/index/force
     get_local $2
     get_local $10
     get_global $assembly/index/FORCE_DAMPING_BIT_SHIFT
     i32.shr_s
     call $assembly/index/Pointer#set
    end
    get_local $2
    i32.const 1
    i32.add
    set_local $2
    br $repeat|2
    unreachable
   end
   unreachable
  end
  block $break|3
   i32.const 0
   set_local $2
   loop $repeat|3
    get_local $2
    get_global $assembly/index/area
    i32.lt_s
    i32.eqz
    br_if $break|3
    get_global $assembly/index/status
    get_local $2
    call $assembly/index/Pointer#get
    get_global $assembly/index/STATUS_WALL
    i32.eq
    if
     get_global $assembly/index/image
     get_local $2
     i32.const 0
     call $assembly/index/Pointer#set
    else     
     get_global $assembly/index/image
     get_local $2
     block $assembly/index/toRGB|inlined.0 (result i32)
      get_global $assembly/index/u
      get_local $2
      call $assembly/index/Pointer#get
      set_local $9
      get_local $9
      i32.const 22
      i32.shr_s
      set_local $10
      i32.const 0
      get_local $10
      i32.const 1
      i32.add
      i32.sub
      get_local $10
      get_local $10
      i32.const 8
      i32.shl
      i32.or
      get_local $10
      i32.const 16
      i32.shl
      i32.or
      get_local $10
      i32.const 0
      i32.lt_s
      select
      i32.const -16777216
      i32.or
     end
     call $assembly/index/Pointer#set
    end
    get_local $2
    i32.const 1
    i32.add
    set_local $2
    br $repeat|3
    unreachable
   end
   unreachable
  end
 )
 (func $null (; 5 ;) (type $v)
 )
)
