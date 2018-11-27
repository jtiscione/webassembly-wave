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
    i32.store offset=1032
    i32.const 0
    get_local $p3
    i32.store offset=1036
    i32.const 0
    get_local $p3
    get_local $p2
    i32.mul
    tee_local $l0
    i32.store offset=1040
    get_local $p0
    get_local $l0
    i32.const 1
    i32.shl
    get_local $p1
    i32.const 2
    i32.shr_u
    i32.add
    i32.const 2
    i32.shl
    i32.add
    set_local $p0
    block $B0
      get_local $p3
      i32.const 1
      i32.lt_s
      br_if $B0
      i32.const 0
      set_local $p3
      loop $L1
        get_local $p0
        get_local $p2
        get_local $p3
        i32.mul
        i32.const 2
        i32.shl
        i32.add
        i32.const 1
        i32.store
        get_local $p0
        i32.const 0
        i32.load offset=1032
        tee_local $p2
        get_local $p2
        get_local $p3
        i32.mul
        i32.add
        i32.const 2
        i32.shl
        i32.add
        i32.const -4
        i32.add
        i32.const 1
        i32.store
        i32.const 0
        i32.load offset=1032
        set_local $p2
        get_local $p3
        i32.const 1
        i32.add
        tee_local $p3
        i32.const 0
        i32.load offset=1036
        i32.lt_s
        br_if $L1
      end
    end
    block $B2
      get_local $p2
      i32.const 1
      i32.lt_s
      br_if $B2
      i32.const 0
      set_local $p3
      loop $L3
        get_local $p0
        i32.const 1
        i32.store
        get_local $p0
        i32.const 0
        i32.load offset=1032
        i32.const 0
        i32.load offset=1036
        i32.const -1
        i32.add
        i32.mul
        i32.const 2
        i32.shl
        i32.add
        i32.const 1
        i32.store
        get_local $p0
        i32.const 4
        i32.add
        set_local $p0
        get_local $p3
        i32.const 1
        i32.add
        tee_local $p3
        i32.const 0
        i32.load offset=1032
        i32.lt_s
        br_if $L3
      end
    end)
  (func $singleFrame (export "singleFrame") (type $t2) (param $p0 i32) (param $p1 i32)
    (local $l0 i32) (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32) (local $l8 i32) (local $l9 i32) (local $l10 i32) (local $l11 i32) (local $l12 i32) (local $l13 i32) (local $l14 i32) (local $l15 i32) (local $l16 i32)
    block $B0
      i32.const 0
      i32.load offset=1036
      tee_local $l0
      i32.const 0
      i32.load offset=1032
      tee_local $l1
      i32.mul
      tee_local $l2
      i32.const 1
      i32.lt_s
      br_if $B0
      i32.const 0
      i32.load offset=1024
      tee_local $l3
      i32.const 0
      i32.load offset=1028
      tee_local $l4
      i32.const -4
      i32.and
      i32.add
      set_local $l5
      i32.const 0
      get_local $p0
      i32.sub
      set_local $l6
      get_local $l3
      get_local $l4
      i32.const 2
      i32.shr_s
      tee_local $l7
      get_local $l2
      i32.add
      tee_local $l8
      get_local $l2
      i32.add
      tee_local $l9
      i32.const 2
      i32.shl
      i32.add
      tee_local $l10
      set_local $l4
      get_local $l3
      get_local $l9
      get_local $l2
      i32.add
      tee_local $l11
      i32.const 2
      i32.shl
      i32.add
      tee_local $l12
      set_local $l9
      get_local $l3
      get_local $l11
      get_local $l2
      i32.add
      i32.const 2
      i32.shl
      i32.add
      tee_local $l13
      set_local $l11
      get_local $l3
      get_local $l8
      i32.const 2
      i32.shl
      i32.add
      tee_local $l14
      set_local $l8
      get_local $l2
      set_local $l15
      loop $L1
        block $B2
          get_local $l4
          i32.load
          tee_local $l16
          i32.const 2
          i32.ne
          br_if $B2
          get_local $l9
          get_local $p0
          i32.store
          get_local $l11
          i32.const 0
          i32.store
          get_local $l8
          i32.const 0
          i32.store
          get_local $l4
          i32.load
          set_local $l16
        end
        block $B3
          get_local $l16
          i32.const 3
          i32.ne
          br_if $B3
          get_local $l9
          get_local $l6
          i32.store
          get_local $l11
          i32.const 0
          i32.store
          get_local $l8
          i32.const 0
          i32.store
        end
        get_local $l4
        i32.const 4
        i32.add
        set_local $l4
        get_local $l9
        i32.const 4
        i32.add
        set_local $l9
        get_local $l11
        i32.const 4
        i32.add
        set_local $l11
        get_local $l8
        i32.const 4
        i32.add
        set_local $l8
        get_local $l15
        i32.const -1
        i32.add
        tee_local $l15
        br_if $L1
      end
      get_local $l2
      i32.const 1
      i32.lt_s
      br_if $B0
      block $B4
        block $B5
          get_local $p1
          i32.eqz
          br_if $B5
          get_local $l10
          set_local $l9
          get_local $l12
          set_local $l4
          get_local $l13
          set_local $l8
          i32.const 0
          set_local $l16
          loop $L6
            get_local $l16
            i32.const 1
            i32.add
            set_local $l11
            block $B7
              get_local $l9
              i32.load
              br_if $B7
              get_local $l8
              get_local $l12
              get_local $l16
              i32.const 0
              i32.load offset=1032
              tee_local $l15
              i32.add
              i32.const 2
              i32.shl
              i32.add
              i32.load
              get_local $l4
              get_local $l15
              i32.const 2
              i32.shl
              i32.sub
              i32.load
              i32.add
              i32.const 1
              i32.shr_s
              get_local $l4
              i32.load
              tee_local $l16
              i32.sub
              i32.const 1
              i32.shr_s
              get_local $l4
              i32.const -4
              i32.add
              i32.load
              get_local $l4
              i32.const 4
              i32.add
              i32.load
              i32.add
              i32.const 1
              i32.shr_s
              get_local $l16
              i32.sub
              i32.const 1
              i32.shr_s
              i32.add
              get_local $l8
              i32.load
              i32.add
              tee_local $l16
              get_local $l16
              get_local $p1
              i32.shr_s
              i32.sub
              tee_local $l16
              i32.const 1073741823
              get_local $l16
              i32.const 1073741823
              i32.lt_s
              select
              tee_local $l16
              i32.const -1073741824
              get_local $l16
              i32.const -1073741824
              i32.gt_s
              select
              i32.store
            end
            get_local $l9
            i32.const 4
            i32.add
            set_local $l9
            get_local $l4
            i32.const 4
            i32.add
            set_local $l4
            get_local $l8
            i32.const 4
            i32.add
            set_local $l8
            get_local $l11
            set_local $l16
            get_local $l2
            get_local $l11
            i32.ne
            br_if $L6
            br $B4
          end
        end
        get_local $l7
        i32.const 2
        i32.shl
        set_local $l15
        get_local $l3
        get_local $l0
        get_local $l1
        i32.mul
        tee_local $l9
        i32.const 3
        i32.shl
        i32.add
        set_local $l4
        get_local $l3
        get_local $l9
        i32.const 12
        i32.mul
        i32.add
        set_local $l11
        get_local $l3
        get_local $l9
        i32.const 4
        i32.shl
        i32.add
        set_local $l8
        i32.const 0
        set_local $l16
        loop $L8
          get_local $l16
          i32.const 1
          i32.add
          set_local $l9
          block $B9
            get_local $l4
            get_local $l15
            i32.add
            i32.load
            br_if $B9
            get_local $l8
            get_local $l15
            i32.add
            tee_local $p0
            get_local $l12
            get_local $l16
            i32.const 0
            i32.load offset=1032
            tee_local $l6
            i32.add
            i32.const 2
            i32.shl
            i32.add
            i32.load
            get_local $l11
            get_local $l15
            i32.add
            tee_local $l16
            get_local $l6
            i32.const 2
            i32.shl
            i32.sub
            i32.load
            i32.add
            i32.const 1
            i32.shr_s
            get_local $l16
            i32.load
            tee_local $l6
            i32.sub
            i32.const 1
            i32.shr_s
            get_local $l16
            i32.const -4
            i32.add
            i32.load
            get_local $l16
            i32.const 4
            i32.add
            i32.load
            i32.add
            i32.const 1
            i32.shr_s
            get_local $l6
            i32.sub
            i32.const 1
            i32.shr_s
            i32.add
            get_local $p0
            i32.load
            i32.add
            tee_local $l16
            i32.const 1073741823
            get_local $l16
            i32.const 1073741823
            i32.lt_s
            select
            tee_local $l16
            i32.const -1073741824
            get_local $l16
            i32.const -1073741824
            i32.gt_s
            select
            i32.store
          end
          get_local $l4
          i32.const 4
          i32.add
          set_local $l4
          get_local $l11
          i32.const 4
          i32.add
          set_local $l11
          get_local $l8
          i32.const 4
          i32.add
          set_local $l8
          get_local $l9
          set_local $l16
          get_local $l2
          get_local $l9
          i32.ne
          br_if $L8
        end
      end
      get_local $l2
      i32.const 1
      i32.lt_s
      br_if $B0
      get_local $l2
      set_local $l4
      loop $L10
        block $B11
          get_local $l10
          i32.load
          br_if $B11
          get_local $l12
          get_local $l13
          i32.load
          get_local $l12
          i32.load
          i32.add
          tee_local $l9
          i32.const 1073741823
          get_local $l9
          i32.const 1073741823
          i32.lt_s
          select
          tee_local $l9
          i32.const -1073741824
          get_local $l9
          i32.const -1073741824
          i32.gt_s
          select
          get_local $l14
          i32.load
          tee_local $l9
          i32.add
          tee_local $l11
          i32.const 1073741823
          get_local $l11
          i32.const 1073741823
          i32.lt_s
          select
          tee_local $l11
          i32.const -1073741824
          get_local $l11
          i32.const -1073741824
          i32.gt_s
          select
          i32.store
          get_local $l14
          get_local $l9
          get_local $l9
          i32.const 4
          i32.shr_s
          i32.sub
          i32.store
        end
        get_local $l10
        i32.const 4
        i32.add
        set_local $l10
        get_local $l14
        i32.const 4
        i32.add
        set_local $l14
        get_local $l12
        i32.const 4
        i32.add
        set_local $l12
        get_local $l13
        i32.const 4
        i32.add
        set_local $l13
        get_local $l4
        i32.const -1
        i32.add
        tee_local $l4
        br_if $L10
      end
      get_local $l2
      i32.const 1
      i32.lt_s
      br_if $B0
      get_local $l0
      get_local $l1
      i32.mul
      tee_local $l4
      i32.const 3
      i32.shl
      set_local $l8
      get_local $l4
      i32.const 12
      i32.mul
      set_local $l16
      loop $L12
        i32.const 0
        set_local $l4
        block $B13
          block $B14
            get_local $l5
            get_local $l8
            i32.add
            i32.load
            i32.const 1
            i32.eq
            br_if $B14
            get_local $l5
            get_local $l16
            i32.add
            i32.load
            tee_local $l9
            i32.const 22
            i32.shr_s
            set_local $l11
            block $B15
              get_local $l9
              i32.const 4194304
              i32.lt_s
              br_if $B15
              get_local $l5
              get_local $l11
              i32.const 8
              i32.shl
              get_local $l11
              i32.const 16
              i32.shl
              i32.or
              i32.const -16777216
              i32.or
              i32.store
              get_local $l5
              i32.const 4
              i32.add
              set_local $l5
              get_local $l2
              i32.const -1
              i32.add
              tee_local $l2
              br_if $L12
              br $B0
            end
            i32.const -16777216
            set_local $l4
            get_local $l9
            i32.const -1
            i32.le_s
            br_if $B13
          end
          get_local $l5
          get_local $l4
          i32.store
          get_local $l5
          i32.const 4
          i32.add
          set_local $l5
          get_local $l2
          i32.const -1
          i32.add
          tee_local $l2
          br_if $L12
          br $B0
        end
        get_local $l5
        get_local $l11
        i32.const -16777216
        i32.or
        i32.const 16777215
        i32.xor
        i32.store
        get_local $l5
        i32.const 4
        i32.add
        set_local $l5
        get_local $l2
        i32.const -1
        i32.add
        tee_local $l2
        br_if $L12
      end
    end)
  (table $T0 1 1 anyfunc)
  (memory $memory (export "memory") 2)
  (global $g0 (mut i32) (i32.const 66592))
  (global $__heap_base (export "__heap_base") i32 (i32.const 66592))
  (global $__data_end (export "__data_end") i32 (i32.const 1044))
  (data (i32.const 1024) "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00"))
