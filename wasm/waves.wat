(module
  (type $t0 (func))
  (type $t1 (func (param i32 i32 i32 i32)))
  (type $t2 (func (param i32 i32)))
  (func $__wasm_call_ctors (type $t0))
  (func $init (export "init") (type $t1) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l0 i32)
    i32.const 0
    get_local $p1
    i32.store offset=1028
    i32.const 0
    get_local $p0
    i32.store offset=1024
    i32.const 0
    get_local $p2
    i32.store offset=1036
    i32.const 0
    get_local $p3
    i32.store offset=1040
    i32.const 0
    get_local $p1
    i32.const 4
    i32.div_s
    tee_local $p1
    i32.store offset=1032
    i32.const 0
    get_local $p3
    get_local $p2
    i32.mul
    tee_local $l0
    i32.store offset=1044
    i32.const 0
    get_local $l0
    get_local $p1
    i32.add
    i32.store offset=1048
    i32.const 0
    get_local $l0
    i32.const 1
    i32.shl
    get_local $p1
    i32.add
    i32.store offset=1052
    i32.const 0
    get_local $l0
    i32.const 3
    i32.mul
    get_local $p1
    i32.add
    i32.store offset=1056
    i32.const 0
    get_local $l0
    i32.const 2
    i32.shl
    get_local $p1
    i32.add
    i32.store offset=1060
    i32.const 0
    get_local $l0
    i32.const 5
    i32.mul
    get_local $p1
    i32.add
    tee_local $p1
    i32.store offset=1064
    block $B0
      get_local $p3
      i32.const 1
      i32.lt_s
      br_if $B0
      get_local $p0
      get_local $p1
      i32.const 2
      i32.shl
      i32.add
      i32.const 1
      i32.store
      get_local $p0
      i32.const 0
      i32.load offset=1064
      i32.const 0
      i32.load offset=1036
      i32.add
      i32.const 2
      i32.shl
      i32.add
      i32.const -4
      i32.add
      i32.const 1
      i32.store
      block $B1
        i32.const 0
        i32.load offset=1040
        i32.const 2
        i32.lt_s
        br_if $B1
        i32.const 1
        set_local $p1
        loop $L2
          get_local $p0
          i32.const 0
          i32.load offset=1036
          get_local $p1
          i32.mul
          i32.const 0
          i32.load offset=1064
          i32.add
          i32.const 2
          i32.shl
          i32.add
          i32.const 1
          i32.store
          get_local $p0
          i32.const 0
          i32.load offset=1064
          i32.const 0
          i32.load offset=1036
          tee_local $l0
          i32.add
          get_local $l0
          get_local $p1
          i32.mul
          i32.add
          i32.const 2
          i32.shl
          i32.add
          i32.const -4
          i32.add
          i32.const 1
          i32.store
          get_local $p1
          i32.const 1
          i32.add
          tee_local $p1
          i32.const 0
          i32.load offset=1040
          i32.lt_s
          br_if $L2
        end
      end
      i32.const 0
      i32.load offset=1036
      set_local $p2
    end
    block $B3
      get_local $p2
      i32.const 1
      i32.lt_s
      br_if $B3
      i32.const 0
      set_local $p1
      loop $L4
        get_local $p0
        get_local $p1
        i32.const 0
        i32.load offset=1064
        i32.add
        i32.const 2
        i32.shl
        i32.add
        i32.const 1
        i32.store
        get_local $p0
        get_local $p1
        i32.const 0
        i32.load offset=1064
        i32.const 0
        i32.load offset=1036
        i32.const 0
        i32.load offset=1040
        i32.const -1
        i32.add
        i32.mul
        i32.add
        i32.add
        i32.const 2
        i32.shl
        i32.add
        i32.const 1
        i32.store
        get_local $p1
        i32.const 1
        i32.add
        tee_local $p1
        i32.const 0
        i32.load offset=1036
        i32.lt_s
        br_if $L4
      end
    end)
  (func $singleFrame (export "singleFrame") (type $t2) (param $p0 i32) (param $p1 i32)
    (local $l0 i32) (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32)
    i32.const 0
    get_local $p0
    i32.sub
    set_local $l0
    i32.const 0
    i32.load offset=1044
    set_local $l1
    i32.const 0
    i32.load offset=1024
    set_local $l2
    i32.const 0
    set_local $l3
    loop $L0
      block $B1
        get_local $l1
        i32.const 1
        i32.lt_s
        br_if $B1
        i32.const 0
        set_local $l4
        loop $L2
          get_local $p0
          set_local $l1
          block $B3
            block $B4
              get_local $l2
              get_local $l4
              i32.const 0
              i32.load offset=1064
              i32.add
              i32.const 2
              i32.shl
              i32.add
              i32.load
              tee_local $l5
              i32.const 2
              i32.eq
              br_if $B4
              get_local $l5
              i32.const 3
              i32.ne
              br_if $B3
              get_local $l0
              set_local $l1
            end
            get_local $l2
            get_local $l4
            i32.const 0
            i32.load offset=1052
            i32.add
            i32.const 2
            i32.shl
            i32.add
            get_local $l1
            i32.store
            get_local $l2
            get_local $l4
            i32.const 0
            i32.load offset=1056
            i32.add
            i32.const 2
            i32.shl
            i32.add
            i32.const 0
            i32.store
            get_local $l2
            get_local $l4
            i32.const 0
            i32.load offset=1060
            i32.add
            i32.const 2
            i32.shl
            i32.add
            i32.const 0
            i32.store
          end
          get_local $l4
          i32.const 1
          i32.add
          tee_local $l4
          i32.const 0
          i32.load offset=1044
          tee_local $l1
          i32.lt_s
          br_if $L2
        end
      end
      block $B5
        get_local $l1
        i32.const 1
        i32.lt_s
        br_if $B5
        block $B6
          get_local $p1
          i32.const 0
          i32.le_s
          br_if $B6
          i32.const 0
          set_local $l4
          loop $L7
            block $B8
              get_local $l2
              get_local $l4
              i32.const 0
              i32.load offset=1064
              i32.add
              i32.const 2
              i32.shl
              i32.add
              i32.load
              i32.eqz
              br_if $B8
              get_local $l4
              i32.const 1
              i32.add
              tee_local $l4
              get_local $l1
              i32.lt_s
              br_if $L7
              br $B5
            end
            get_local $l2
            get_local $l4
            i32.const 0
            i32.load offset=1052
            i32.add
            i32.const 2
            i32.shl
            i32.add
            get_local $l2
            get_local $l4
            i32.const 0
            i32.load offset=1036
            tee_local $l5
            i32.const 0
            i32.load offset=1048
            tee_local $l1
            i32.add
            i32.add
            i32.const 2
            i32.shl
            i32.add
            i32.load
            get_local $l2
            get_local $l4
            get_local $l1
            get_local $l5
            i32.sub
            i32.add
            i32.const 2
            i32.shl
            i32.add
            i32.load
            i32.add
            i32.const 1
            i32.shr_s
            get_local $l2
            get_local $l4
            get_local $l1
            i32.add
            i32.const 2
            i32.shl
            i32.add
            tee_local $l1
            i32.load
            tee_local $l5
            i32.sub
            i32.const 1
            i32.shr_s
            get_local $l1
            i32.const 4
            i32.add
            i32.load
            get_local $l1
            i32.const -4
            i32.add
            i32.load
            i32.add
            i32.const 1
            i32.shr_s
            get_local $l5
            i32.sub
            i32.const 1
            i32.shr_s
            i32.add
            get_local $l2
            get_local $l4
            i32.const 0
            i32.load offset=1056
            i32.add
            i32.const 2
            i32.shl
            i32.add
            i32.load
            i32.add
            tee_local $l1
            i32.const 1073741823
            get_local $l1
            i32.const 1073741823
            i32.lt_s
            select
            tee_local $l1
            i32.const -1073741824
            get_local $l1
            i32.const -1073741824
            i32.gt_s
            select
            tee_local $l1
            get_local $l5
            i32.add
            tee_local $l5
            i32.const 1073741823
            get_local $l5
            i32.const 1073741823
            i32.lt_s
            select
            tee_local $l5
            i32.const -1073741824
            get_local $l5
            i32.const -1073741824
            i32.gt_s
            select
            get_local $l2
            get_local $l4
            i32.const 0
            i32.load offset=1060
            i32.add
            i32.const 2
            i32.shl
            i32.add
            i32.load
            tee_local $l5
            i32.add
            tee_local $l6
            i32.const 1073741823
            get_local $l6
            i32.const 1073741823
            i32.lt_s
            select
            tee_local $l6
            i32.const -1073741824
            get_local $l6
            i32.const -1073741824
            i32.gt_s
            select
            i32.store
            get_local $l2
            get_local $l4
            i32.const 0
            i32.load offset=1060
            i32.add
            i32.const 2
            i32.shl
            i32.add
            get_local $l5
            get_local $l5
            i32.const 4
            i32.shr_s
            i32.sub
            i32.store
            get_local $l2
            get_local $l4
            i32.const 0
            i32.load offset=1056
            i32.add
            i32.const 2
            i32.shl
            i32.add
            get_local $l1
            get_local $l1
            get_local $p1
            i32.shr_s
            i32.sub
            i32.store
            get_local $l4
            i32.const 1
            i32.add
            tee_local $l4
            i32.const 0
            i32.load offset=1044
            tee_local $l1
            i32.lt_s
            br_if $L7
            br $B5
          end
        end
        i32.const 0
        set_local $l4
        loop $L9
          block $B10
            get_local $l2
            get_local $l4
            i32.const 0
            i32.load offset=1064
            i32.add
            i32.const 2
            i32.shl
            i32.add
            i32.load
            i32.eqz
            br_if $B10
            get_local $l4
            i32.const 1
            i32.add
            tee_local $l4
            get_local $l1
            i32.lt_s
            br_if $L9
            br $B5
          end
          get_local $l2
          get_local $l4
          i32.const 0
          i32.load offset=1052
          i32.add
          i32.const 2
          i32.shl
          i32.add
          get_local $l2
          get_local $l4
          i32.const 0
          i32.load offset=1036
          tee_local $l5
          i32.const 0
          i32.load offset=1048
          tee_local $l1
          i32.add
          i32.add
          i32.const 2
          i32.shl
          i32.add
          i32.load
          get_local $l2
          get_local $l4
          get_local $l1
          get_local $l5
          i32.sub
          i32.add
          i32.const 2
          i32.shl
          i32.add
          i32.load
          i32.add
          i32.const 1
          i32.shr_s
          get_local $l2
          get_local $l4
          get_local $l1
          i32.add
          i32.const 2
          i32.shl
          i32.add
          tee_local $l1
          i32.load
          tee_local $l5
          i32.sub
          i32.const 1
          i32.shr_s
          get_local $l1
          i32.const 4
          i32.add
          i32.load
          get_local $l1
          i32.const -4
          i32.add
          i32.load
          i32.add
          i32.const 1
          i32.shr_s
          get_local $l5
          i32.sub
          i32.const 1
          i32.shr_s
          i32.add
          get_local $l2
          get_local $l4
          i32.const 0
          i32.load offset=1056
          i32.add
          i32.const 2
          i32.shl
          i32.add
          i32.load
          i32.add
          tee_local $l1
          i32.const 1073741823
          get_local $l1
          i32.const 1073741823
          i32.lt_s
          select
          tee_local $l1
          i32.const -1073741824
          get_local $l1
          i32.const -1073741824
          i32.gt_s
          select
          tee_local $l6
          get_local $l5
          i32.add
          tee_local $l1
          i32.const 1073741823
          get_local $l1
          i32.const 1073741823
          i32.lt_s
          select
          tee_local $l1
          i32.const -1073741824
          get_local $l1
          i32.const -1073741824
          i32.gt_s
          select
          get_local $l2
          get_local $l4
          i32.const 0
          i32.load offset=1060
          i32.add
          i32.const 2
          i32.shl
          i32.add
          i32.load
          tee_local $l1
          i32.add
          tee_local $l5
          i32.const 1073741823
          get_local $l5
          i32.const 1073741823
          i32.lt_s
          select
          tee_local $l5
          i32.const -1073741824
          get_local $l5
          i32.const -1073741824
          i32.gt_s
          select
          i32.store
          get_local $l2
          get_local $l4
          i32.const 0
          i32.load offset=1060
          i32.add
          i32.const 2
          i32.shl
          i32.add
          get_local $l1
          get_local $l1
          i32.const 4
          i32.shr_s
          i32.sub
          i32.store
          get_local $l2
          get_local $l4
          i32.const 0
          i32.load offset=1056
          i32.add
          i32.const 2
          i32.shl
          i32.add
          get_local $l6
          i32.store
          get_local $l4
          i32.const 1
          i32.add
          tee_local $l4
          i32.const 0
          i32.load offset=1044
          tee_local $l1
          i32.lt_s
          br_if $L9
        end
      end
      i32.const 0
      i32.load offset=1048
      set_local $l4
      i32.const 0
      i32.const 0
      i32.load offset=1052
      i32.store offset=1048
      i32.const 0
      get_local $l4
      i32.store offset=1052
      get_local $l3
      i32.const 1
      i32.add
      tee_local $l3
      i32.const 2
      i32.ne
      br_if $L0
    end
    block $B11
      get_local $l1
      i32.const 1
      i32.lt_s
      br_if $B11
      i32.const 0
      set_local $l4
      loop $L12
        get_local $l4
        i32.const 0
        i32.load offset=1032
        i32.add
        set_local $l5
        i32.const 0
        set_local $l1
        block $B13
          get_local $l2
          get_local $l4
          i32.const 0
          i32.load offset=1064
          i32.add
          i32.const 2
          i32.shl
          i32.add
          i32.load
          i32.const 1
          i32.eq
          br_if $B13
          get_local $l2
          get_local $l4
          i32.const 0
          i32.load offset=1048
          i32.add
          i32.const 2
          i32.shl
          i32.add
          i32.load
          tee_local $l1
          i32.const 22
          i32.shr_s
          set_local $p0
          i32.const -16777216
          set_local $l6
          block $B14
            get_local $l1
            i32.const 4194304
            i32.lt_s
            br_if $B14
            get_local $p0
            i32.const 8
            i32.shl
            get_local $p0
            i32.const 16
            i32.shl
            i32.or
            i32.const -16777216
            i32.or
            set_local $l6
          end
          get_local $p0
          i32.const -16777216
          i32.or
          i32.const 16777215
          i32.xor
          get_local $l6
          get_local $l1
          i32.const 0
          i32.lt_s
          select
          set_local $l1
        end
        get_local $l2
        get_local $l5
        i32.const 2
        i32.shl
        i32.add
        get_local $l1
        i32.store
        get_local $l4
        i32.const 1
        i32.add
        tee_local $l4
        i32.const 0
        i32.load offset=1044
        i32.lt_s
        br_if $L12
      end
    end)
  (table $T0 1 1 anyfunc)
  (memory $memory (export "memory") 2)
  (global $g0 (mut i32) (i32.const 66608))
  (global $__heap_base (export "__heap_base") i32 (i32.const 66608))
  (global $__data_end (export "__data_end") i32 (i32.const 1068))
  (data (i32.const 1024) "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00"))
