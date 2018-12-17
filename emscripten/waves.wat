(module
  (type $t0 (func))
  (type $t1 (func (param i32 i32 i32 i32)))
  (type $t2 (func (param i32 i32)))
  (func $__wasm_call_ctors (type $t0))
  (func $init (export "init") (type $t1) (param $p0 i32) (param $p1 i32) (param $p2 i32) (param $p3 i32)
    (local $l0 i32) (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32)
    i32.const 0
    set_local $l0
    i32.const 0
    get_local $p0
    i32.store offset=1028
    i32.const 0
    get_local $p2
    i32.store offset=1024
    i32.const 0
    get_local $p1
    i32.store offset=1032
    i32.const 0
    get_local $p3
    get_local $p2
    i32.mul
    tee_local $l1
    i32.store offset=1036
    i32.const 0
    get_local $p0
    get_local $p1
    i32.const -4
    i32.and
    i32.add
    i32.store offset=1040
    i32.const 0
    get_local $p0
    get_local $l1
    get_local $p1
    i32.const 2
    i32.shr_s
    tee_local $l2
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.store offset=1044
    i32.const 0
    get_local $p0
    get_local $l1
    i32.const 1
    i32.shl
    get_local $l2
    i32.add
    i32.const 2
    i32.shl
    i32.add
    tee_local $p1
    i32.store offset=1048
    i32.const 0
    get_local $p0
    get_local $l1
    i32.const 3
    i32.mul
    get_local $l2
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.store offset=1052
    i32.const 0
    get_local $p0
    get_local $l1
    i32.const 2
    i32.shl
    get_local $l2
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.store offset=1056
    block $B0
      get_local $p3
      i32.const 1
      i32.lt_s
      br_if $B0
      get_local $p0
      get_local $l2
      i32.const 2
      i32.shl
      i32.add
      get_local $p2
      get_local $p3
      i32.const 3
      i32.shl
      i32.const 4
      i32.or
      i32.mul
      i32.add
      i32.const -4
      i32.add
      set_local $l3
      get_local $p2
      i32.const 2
      i32.shl
      set_local $l4
      get_local $p3
      set_local $l1
      loop $L1
        get_local $p1
        get_local $l0
        i32.add
        i32.const 1
        i32.store
        get_local $l3
        get_local $l0
        i32.add
        i32.const 1
        i32.store
        get_local $l0
        get_local $l4
        i32.add
        set_local $l0
        get_local $l1
        i32.const -1
        i32.add
        tee_local $l1
        br_if $L1
      end
    end
    block $B2
      get_local $p2
      i32.const 1
      i32.lt_s
      br_if $B2
      get_local $p0
      get_local $l2
      i32.const 2
      i32.shl
      i32.add
      get_local $p2
      get_local $p3
      i32.const 12
      i32.mul
      i32.const -4
      i32.add
      i32.mul
      i32.add
      set_local $l0
      loop $L3
        get_local $p1
        i32.const 1
        i32.store
        get_local $l0
        i32.const 1
        i32.store
        get_local $p1
        i32.const 4
        i32.add
        set_local $p1
        get_local $l0
        i32.const 4
        i32.add
        set_local $l0
        get_local $p2
        i32.const -1
        i32.add
        tee_local $p2
        br_if $L3
      end
    end)
  (func $step (export "step") (type $t2) (param $p0 i32) (param $p1 i32)
    (local $l0 i32) (local $l1 i32) (local $l2 i32) (local $l3 i32) (local $l4 i32) (local $l5 i32) (local $l6 i32) (local $l7 i32)
    block $B0
      i32.const 0
      i32.load offset=1036
      i32.const 1
      i32.lt_s
      br_if $B0
      i32.const 0
      get_local $p0
      i32.sub
      set_local $l0
      i32.const 0
      i32.load offset=1044
      set_local $l1
      i32.const 0
      i32.load offset=1056
      set_local $l2
      i32.const 0
      i32.load offset=1052
      set_local $l3
      i32.const 0
      i32.load offset=1048
      set_local $l4
      i32.const 0
      set_local $l5
      loop $L1
        get_local $p0
        set_local $l6
        block $B2
          block $B3
            get_local $l4
            i32.load
            tee_local $l7
            i32.const 2
            i32.eq
            br_if $B3
            get_local $l7
            i32.const 3
            i32.ne
            br_if $B2
            get_local $l0
            set_local $l6
          end
          get_local $l3
          get_local $l6
          i32.store
          get_local $l2
          i32.const 0
          i32.store
          get_local $l1
          i32.const 0
          i32.store
        end
        get_local $l4
        i32.const 4
        i32.add
        set_local $l4
        get_local $l1
        i32.const 4
        i32.add
        set_local $l1
        get_local $l2
        i32.const 4
        i32.add
        set_local $l2
        get_local $l3
        i32.const 4
        i32.add
        set_local $l3
        get_local $l5
        i32.const 1
        i32.add
        tee_local $l5
        i32.const 0
        i32.load offset=1036
        tee_local $l6
        i32.lt_s
        br_if $L1
      end
      get_local $l6
      i32.const 1
      i32.lt_s
      br_if $B0
      i32.const 0
      i32.load offset=1056
      set_local $l1
      i32.const 0
      i32.load offset=1052
      set_local $l7
      i32.const 0
      i32.load offset=1048
      set_local $l4
      block $B4
        block $B5
          get_local $p1
          i32.eqz
          br_if $B5
          get_local $l7
          set_local $l2
          i32.const 0
          set_local $l5
          loop $L6
            get_local $l5
            i32.const 1
            i32.add
            set_local $l3
            block $B7
              get_local $l4
              i32.load
              br_if $B7
              get_local $l1
              get_local $l7
              get_local $l5
              i32.const 0
              i32.load offset=1024
              tee_local $l6
              i32.add
              i32.const 2
              i32.shl
              i32.add
              i32.load
              get_local $l2
              get_local $l6
              i32.const 2
              i32.shl
              i32.sub
              i32.load
              i32.add
              i32.const 1
              i32.shr_s
              get_local $l2
              i32.load
              tee_local $l5
              i32.sub
              i32.const 1
              i32.shr_s
              get_local $l2
              i32.const -4
              i32.add
              i32.load
              get_local $l2
              i32.const 4
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
              get_local $l1
              i32.load
              i32.add
              tee_local $l5
              get_local $l5
              get_local $p1
              i32.shr_s
              i32.sub
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
              i32.const 0
              i32.load offset=1036
              set_local $l6
            end
            get_local $l4
            i32.const 4
            i32.add
            set_local $l4
            get_local $l1
            i32.const 4
            i32.add
            set_local $l1
            get_local $l2
            i32.const 4
            i32.add
            set_local $l2
            get_local $l3
            set_local $l5
            get_local $l3
            get_local $l6
            i32.lt_s
            br_if $L6
            br $B4
          end
        end
        get_local $l7
        set_local $l2
        i32.const 0
        set_local $l5
        loop $L8
          get_local $l5
          i32.const 1
          i32.add
          set_local $l3
          block $B9
            get_local $l4
            i32.load
            br_if $B9
            get_local $l1
            get_local $l7
            get_local $l5
            i32.const 0
            i32.load offset=1024
            tee_local $l6
            i32.add
            i32.const 2
            i32.shl
            i32.add
            i32.load
            get_local $l2
            get_local $l6
            i32.const 2
            i32.shl
            i32.sub
            i32.load
            i32.add
            i32.const 1
            i32.shr_s
            get_local $l2
            i32.load
            tee_local $l5
            i32.sub
            i32.const 1
            i32.shr_s
            get_local $l2
            i32.const -4
            i32.add
            i32.load
            get_local $l2
            i32.const 4
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
            get_local $l1
            i32.load
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
            i32.const 0
            i32.load offset=1036
            set_local $l6
          end
          get_local $l4
          i32.const 4
          i32.add
          set_local $l4
          get_local $l2
          i32.const 4
          i32.add
          set_local $l2
          get_local $l1
          i32.const 4
          i32.add
          set_local $l1
          get_local $l3
          set_local $l5
          get_local $l3
          get_local $l6
          i32.lt_s
          br_if $L8
        end
      end
      get_local $l6
      i32.const 1
      i32.lt_s
      br_if $B0
      i32.const 0
      i32.load offset=1040
      set_local $l1
      i32.const 0
      i32.load offset=1056
      set_local $l6
      i32.const 0
      i32.load offset=1044
      set_local $l3
      i32.const 0
      i32.load offset=1048
      set_local $l2
      i32.const 0
      i32.load offset=1052
      tee_local $p1
      set_local $l4
      i32.const 0
      set_local $l7
      loop $L10
        block $B11
          block $B12
            block $B13
              block $B14
                get_local $l2
                i32.load
                tee_local $p0
                i32.eqz
                br_if $B14
                get_local $l4
                set_local $l0
                i32.const 0
                set_local $l5
                get_local $p0
                i32.const 1
                i32.eq
                br_if $B11
                get_local $l0
                i32.load
                tee_local $p0
                i32.const 22
                i32.shr_s
                set_local $l0
                get_local $p0
                i32.const 4194304
                i32.lt_s
                br_if $B13
                br $B12
              end
              get_local $l4
              get_local $l6
              i32.load
              get_local $l4
              i32.load
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
              get_local $l3
              i32.load
              tee_local $l5
              i32.add
              tee_local $p0
              i32.const 1073741823
              get_local $p0
              i32.const 1073741823
              i32.lt_s
              select
              tee_local $p0
              i32.const -1073741824
              get_local $p0
              i32.const -1073741824
              i32.gt_s
              select
              i32.store
              get_local $l3
              get_local $l5
              get_local $l5
              i32.const 4
              i32.shr_s
              i32.sub
              i32.store
              get_local $p1
              get_local $l7
              i32.const 2
              i32.shl
              i32.add
              i32.load
              tee_local $p0
              i32.const 22
              i32.shr_s
              set_local $l0
              get_local $p0
              i32.const 4194304
              i32.ge_s
              br_if $B12
            end
            i32.const -16777216
            set_local $l5
            get_local $p0
            i32.const -1
            i32.gt_s
            br_if $B11
            get_local $l0
            i32.const -16777216
            i32.or
            i32.const 16777215
            i32.xor
            set_local $l5
            br $B11
          end
          get_local $l0
          i32.const 8
          i32.shl
          get_local $l0
          i32.const 16
          i32.shl
          i32.or
          i32.const -16777216
          i32.or
          set_local $l5
        end
        get_local $l1
        get_local $l5
        i32.store
        get_local $l2
        i32.const 4
        i32.add
        set_local $l2
        get_local $l3
        i32.const 4
        i32.add
        set_local $l3
        get_local $l6
        i32.const 4
        i32.add
        set_local $l6
        get_local $l4
        i32.const 4
        i32.add
        set_local $l4
        get_local $l1
        i32.const 4
        i32.add
        set_local $l1
        get_local $l7
        i32.const 1
        i32.add
        tee_local $l7
        i32.const 0
        i32.load offset=1036
        i32.lt_s
        br_if $L10
      end
    end)
  (table $T0 1 1 anyfunc)
  (memory $memory (export "memory") 2)
  (global $g0 (mut i32) (i32.const 66608))
  (global $__heap_base (export "__heap_base") i32 (i32.const 66608))
  (global $__data_end (export "__data_end") i32 (i32.const 1060))
  (data (i32.const 1024) "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00"))
