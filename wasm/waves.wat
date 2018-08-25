(module
 (table 0 anyfunc)
 (memory $0 367)
 (data (i32.const 12) "\00\00\00\ff")
 (data (i32.const 16) "\01\00\00\00")
 (data (i32.const 20) "\02\00\00\00")
 (data (i32.const 24) "\03\00\00\00")
 (data (i32.const 28) "\04\00\00\00")
 (data (i32.const 32) "\00\00\00\00")
 (data (i32.const 36) "\00\00\00\00")
 (data (i32.const 40) "\00\00\00\00")
 (data (i32.const 44) "\00\00\00\00")
 (data (i32.const 48) "\00\00\00\00")
 (data (i32.const 52) "\00\00\00\00")
 (data (i32.const 56) "\00\00\00\00")
 (data (i32.const 60) "\00\00\00\00")
 (data (i32.const 64) "\00\00\00\00")
 (export "memory" (memory $0))
 (export "init" (func $init))
 (export "getStartByteOffset" (func $getStartByteOffset))
 (export "applyCap" (func $applyCap))
 (export "toRGB" (func $toRGB))
 (export "singleFrame" (func $singleFrame))
 (func $init (; 0 ;) (param $0 i32) (param $1 i32)
  (i32.store offset=36
   (i32.const 0)
   (get_local $1)
  )
  (i32.store offset=32
   (i32.const 0)
   (get_local $0)
  )
  (i32.store offset=40
   (i32.const 0)
   (tee_local $0
    (i32.mul
     (get_local $1)
     (get_local $0)
    )
   )
  )
  (i32.store offset=48
   (i32.const 0)
   (get_local $0)
  )
  (i32.store offset=52
   (i32.const 0)
   (i32.shl
    (get_local $0)
    (i32.const 1)
   )
  )
  (i32.store offset=56
   (i32.const 0)
   (i32.mul
    (get_local $0)
    (i32.const 3)
   )
  )
  (i32.store offset=60
   (i32.const 0)
   (i32.shl
    (get_local $0)
    (i32.const 2)
   )
  )
  (i32.store offset=64
   (i32.const 0)
   (i32.mul
    (get_local $0)
    (i32.const 5)
   )
  )
 )
 (func $getStartByteOffset (; 1 ;) (result i32)
  (i32.const 80)
 )
 (func $applyCap (; 2 ;) (param $0 i32) (result i32)
  (select
   (tee_local $0
    (select
     (get_local $0)
     (i32.const 1073741823)
     (i32.lt_s
      (get_local $0)
      (i32.const 1073741823)
     )
    )
   )
   (i32.const -1073741824)
   (i32.gt_s
    (get_local $0)
    (i32.const -1073741824)
   )
  )
 )
 (func $toRGB (; 3 ;) (param $0 i32) (result i32)
  (local $1 i32)
  (set_local $1
   (i32.const -16777216)
  )
  (block $label$0
   (br_if $label$0
    (i32.lt_s
     (tee_local $0
      (i32.shr_s
       (get_local $0)
       (i32.const 22)
      )
     )
     (i32.const 1)
    )
   )
   (set_local $1
    (i32.or
     (i32.or
      (i32.shl
       (get_local $0)
       (i32.const 16)
      )
      (i32.shl
       (get_local $0)
       (i32.const 8)
      )
     )
     (i32.const -16777216)
    )
   )
  )
  (select
   (i32.xor
    (i32.or
     (get_local $0)
     (i32.const -16777216)
    )
    (i32.const 16777215)
   )
   (get_local $1)
   (i32.lt_s
    (get_local $0)
    (i32.const 0)
   )
  )
 )
 (func $singleFrame (; 4 ;) (param $0 i32) (param $1 i32)
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
  (local $21 i32)
  (local $22 i32)
  (local $23 i32)
  (local $24 i32)
  (local $25 i32)
  (local $26 i32)
  (local $27 i32)
  (block $label$0
   (br_if $label$0
    (i32.lt_s
     (tee_local $2
      (i32.load offset=36
       (i32.const 0)
      )
     )
     (i32.const 1)
    )
   )
   (set_local $7
    (i32.sub
     (i32.const 0)
     (get_local $0)
    )
   )
   (set_local $13
    (i32.sub
     (tee_local $11
      (i32.shl
       (tee_local $8
        (i32.load offset=48
         (i32.const 0)
        )
       )
       (i32.const 2)
      )
     )
     (tee_local $24
      (i32.shl
       (tee_local $3
        (i32.load offset=32
         (i32.const 0)
        )
       )
       (i32.const 2)
      )
     )
    )
   )
   (set_local $12
    (i32.add
     (get_local $24)
     (get_local $11)
    )
   )
   (set_local $16
    (i32.shl
     (tee_local $9
      (i32.load offset=52
       (i32.const 0)
      )
     )
     (i32.const 2)
    )
   )
   (set_local $15
    (i32.shl
     (tee_local $6
      (i32.load offset=60
       (i32.const 0)
      )
     )
     (i32.const 2)
    )
   )
   (set_local $14
    (i32.shl
     (tee_local $5
      (i32.load offset=56
       (i32.const 0)
      )
     )
     (i32.const 2)
    )
   )
   (set_local $22
    (i32.add
     (get_local $3)
     (i32.const -1)
    )
   )
   (set_local $10
    (i32.shl
     (tee_local $4
      (i32.load offset=64
       (i32.const 0)
      )
     )
     (i32.const 2)
    )
   )
   (set_local $27
    (i32.const 0)
   )
   (set_local $24
    (i32.const 0)
   )
   (block $label$1
    (loop $label$2
     (block $label$3
      (br_if $label$3
       (i32.le_s
        (get_local $3)
        (i32.const 0)
       )
      )
      (set_local $17
       (i32.add
        (get_local $24)
        (i32.const 1)
       )
      )
      (block $label$4
       (br_if $label$4
        (i32.eqz
         (get_local $24)
        )
       )
       (set_local $23
        (i32.shl
         (get_local $27)
         (i32.const 2)
        )
       )
       (set_local $25
        (i32.const 0)
       )
       (set_local $24
        (i32.const 80)
       )
       (loop $label$5
        (set_local $25
         (i32.add
          (tee_local $18
           (get_local $25)
          )
          (i32.const 1)
         )
        )
        (block $label$6
         (br_if $label$6
          (i32.eq
           (get_local $22)
           (get_local $18)
          )
         )
         (br_if $label$6
          (i32.eqz
           (get_local $18)
          )
         )
         (br_if $label$6
          (i32.eq
           (get_local $17)
           (get_local $2)
          )
         )
         (br_if $label$6
          (i32.eq
           (tee_local $19
            (i32.load
             (i32.add
              (i32.add
               (get_local $24)
               (get_local $10)
              )
              (get_local $23)
             )
            )
           )
           (i32.const 1)
          )
         )
         (block $label$7
          (block $label$8
           (block $label$9
            (br_if $label$9
             (i32.eq
              (get_local $19)
              (i32.const 3)
             )
            )
            (br_if $label$8
             (i32.ne
              (get_local $19)
              (i32.const 2)
             )
            )
            (i32.store
             (i32.add
              (i32.add
               (get_local $24)
               (get_local $11)
              )
              (get_local $23)
             )
             (get_local $0)
            )
            (set_local $19
             (i32.const 0)
            )
            (i32.store
             (i32.add
              (i32.add
               (get_local $24)
               (get_local $14)
              )
              (get_local $23)
             )
             (i32.const 0)
            )
            (set_local $26
             (i32.const 60)
            )
            (br $label$7)
           )
           (i32.store
            (i32.add
             (i32.add
              (get_local $24)
              (get_local $11)
             )
             (get_local $23)
            )
            (get_local $7)
           )
           (set_local $19
            (i32.const 0)
           )
           (i32.store
            (i32.add
             (i32.add
              (get_local $24)
              (get_local $14)
             )
             (get_local $23)
            )
            (i32.const 0)
           )
           (set_local $26
            (i32.const 60)
           )
           (br $label$7)
          )
          (i32.store
           (i32.add
            (i32.add
             (get_local $24)
             (get_local $16)
            )
            (get_local $23)
           )
           (select
            (tee_local $21
             (select
              (tee_local $21
               (i32.add
                (select
                 (tee_local $26
                  (select
                   (tee_local $26
                    (i32.add
                     (tee_local $19
                      (select
                       (tee_local $19
                        (select
                         (tee_local $19
                          (i32.add
                           (i32.add
                            (i32.shr_s
                             (i32.sub
                              (i32.shr_s
                               (i32.add
                                (i32.load
                                 (i32.add
                                  (i32.add
                                   (get_local $24)
                                   (get_local $12)
                                  )
                                  (get_local $23)
                                 )
                                )
                                (i32.load
                                 (i32.add
                                  (i32.add
                                   (get_local $24)
                                   (get_local $13)
                                  )
                                  (get_local $23)
                                 )
                                )
                               )
                               (i32.const 1)
                              )
                              (tee_local $26
                               (i32.load
                                (tee_local $19
                                 (i32.add
                                  (i32.add
                                   (get_local $24)
                                   (get_local $11)
                                  )
                                  (get_local $23)
                                 )
                                )
                               )
                              )
                             )
                             (i32.const 1)
                            )
                            (i32.load
                             (i32.add
                              (i32.add
                               (get_local $24)
                               (get_local $14)
                              )
                              (get_local $23)
                             )
                            )
                           )
                           (i32.shr_s
                            (i32.sub
                             (i32.shr_s
                              (i32.add
                               (i32.load
                                (i32.add
                                 (get_local $19)
                                 (i32.const 4)
                                )
                               )
                               (i32.load
                                (i32.add
                                 (get_local $19)
                                 (i32.const -4)
                                )
                               )
                              )
                              (i32.const 1)
                             )
                             (get_local $26)
                            )
                            (i32.const 1)
                           )
                          )
                         )
                         (i32.const 1073741823)
                         (i32.lt_s
                          (get_local $19)
                          (i32.const 1073741823)
                         )
                        )
                       )
                       (i32.const -1073741824)
                       (i32.gt_s
                        (get_local $19)
                        (i32.const -1073741824)
                       )
                      )
                     )
                     (get_local $26)
                    )
                   )
                   (i32.const 1073741823)
                   (i32.lt_s
                    (get_local $26)
                    (i32.const 1073741823)
                   )
                  )
                 )
                 (i32.const -1073741824)
                 (i32.gt_s
                  (get_local $26)
                  (i32.const -1073741824)
                 )
                )
                (tee_local $26
                 (i32.load
                  (tee_local $20
                   (i32.add
                    (i32.add
                     (get_local $24)
                     (get_local $15)
                    )
                    (get_local $23)
                   )
                  )
                 )
                )
               )
              )
              (i32.const 1073741823)
              (i32.lt_s
               (get_local $21)
               (i32.const 1073741823)
              )
             )
            )
            (i32.const -1073741824)
            (i32.gt_s
             (get_local $21)
             (i32.const -1073741824)
            )
           )
          )
          (i32.store
           (get_local $20)
           (i32.sub
            (get_local $26)
            (i32.shr_s
             (get_local $26)
             (i32.const 4)
            )
           )
          )
          (set_local $19
           (i32.sub
            (get_local $19)
            (select
             (i32.shr_s
              (get_local $19)
              (get_local $1)
             )
             (i32.const 0)
             (i32.gt_s
              (get_local $1)
              (i32.const 0)
             )
            )
           )
          )
          (set_local $26
           (i32.const 56)
          )
         )
         (i32.store
          (i32.add
           (i32.shl
            (i32.add
             (i32.add
              (get_local $27)
              (get_local $18)
             )
             (i32.load
              (get_local $26)
             )
            )
            (i32.const 2)
           )
           (i32.const 80)
          )
          (get_local $19)
         )
        )
        (set_local $24
         (i32.add
          (get_local $24)
          (i32.const 4)
         )
        )
        (br_if $label$5
         (i32.ne
          (get_local $3)
          (get_local $25)
         )
        )
       )
      )
      (set_local $27
       (i32.add
        (get_local $3)
        (get_local $27)
       )
      )
      (br_if $label$2
       (i32.lt_s
        (tee_local $24
         (get_local $17)
        )
        (get_local $2)
       )
      )
      (br $label$1)
     )
     (br_if $label$2
      (i32.lt_s
       (tee_local $24
        (i32.add
         (get_local $24)
         (i32.const 1)
        )
       )
       (get_local $2)
      )
     )
    )
   )
   (br_if $label$0
    (i32.lt_s
     (get_local $2)
     (i32.const 1)
    )
   )
   (set_local $13
    (i32.sub
     (tee_local $11
      (i32.shl
       (get_local $9)
       (i32.const 2)
      )
     )
     (tee_local $24
      (i32.shl
       (get_local $3)
       (i32.const 2)
      )
     )
    )
   )
   (set_local $12
    (i32.add
     (get_local $11)
     (get_local $24)
    )
   )
   (set_local $22
    (i32.add
     (get_local $3)
     (i32.const -1)
    )
   )
   (set_local $10
    (i32.shl
     (get_local $4)
     (i32.const 2)
    )
   )
   (set_local $14
    (i32.shl
     (get_local $5)
     (i32.const 2)
    )
   )
   (set_local $16
    (i32.shl
     (get_local $6)
     (i32.const 2)
    )
   )
   (set_local $15
    (i32.shl
     (get_local $8)
     (i32.const 2)
    )
   )
   (set_local $27
    (i32.const 0)
   )
   (set_local $24
    (i32.const 0)
   )
   (block $label$10
    (loop $label$11
     (block $label$12
      (br_if $label$12
       (i32.le_s
        (get_local $3)
        (i32.const 0)
       )
      )
      (set_local $17
       (i32.add
        (get_local $24)
        (i32.const 1)
       )
      )
      (block $label$13
       (br_if $label$13
        (i32.eqz
         (get_local $24)
        )
       )
       (set_local $23
        (i32.shl
         (get_local $27)
         (i32.const 2)
        )
       )
       (set_local $25
        (i32.const 0)
       )
       (set_local $24
        (i32.const 80)
       )
       (loop $label$14
        (set_local $25
         (i32.add
          (tee_local $18
           (get_local $25)
          )
          (i32.const 1)
         )
        )
        (block $label$15
         (br_if $label$15
          (i32.eq
           (get_local $22)
           (get_local $18)
          )
         )
         (br_if $label$15
          (i32.eqz
           (get_local $18)
          )
         )
         (br_if $label$15
          (i32.eq
           (get_local $17)
           (get_local $2)
          )
         )
         (br_if $label$15
          (i32.eq
           (tee_local $19
            (i32.load
             (i32.add
              (i32.add
               (get_local $24)
               (get_local $10)
              )
              (get_local $23)
             )
            )
           )
           (i32.const 1)
          )
         )
         (block $label$16
          (block $label$17
           (block $label$18
            (br_if $label$18
             (i32.eq
              (get_local $19)
              (i32.const 2)
             )
            )
            (br_if $label$17
             (i32.ne
              (get_local $19)
              (i32.const 3)
             )
            )
            (i32.store
             (i32.add
              (i32.add
               (get_local $24)
               (get_local $11)
              )
              (get_local $23)
             )
             (get_local $7)
            )
            (set_local $19
             (i32.const 0)
            )
            (i32.store
             (i32.add
              (i32.add
               (get_local $24)
               (get_local $14)
              )
              (get_local $23)
             )
             (i32.const 0)
            )
            (set_local $26
             (i32.const 60)
            )
            (br $label$16)
           )
           (i32.store
            (i32.add
             (i32.add
              (get_local $24)
              (get_local $11)
             )
             (get_local $23)
            )
            (get_local $0)
           )
           (set_local $19
            (i32.const 0)
           )
           (i32.store
            (i32.add
             (i32.add
              (get_local $24)
              (get_local $14)
             )
             (get_local $23)
            )
            (i32.const 0)
           )
           (set_local $26
            (i32.const 60)
           )
           (br $label$16)
          )
          (i32.store
           (i32.add
            (i32.add
             (get_local $24)
             (get_local $15)
            )
            (get_local $23)
           )
           (select
            (tee_local $21
             (select
              (tee_local $21
               (i32.add
                (select
                 (tee_local $26
                  (select
                   (tee_local $26
                    (i32.add
                     (tee_local $19
                      (select
                       (tee_local $19
                        (select
                         (tee_local $19
                          (i32.add
                           (i32.add
                            (i32.shr_s
                             (i32.sub
                              (i32.shr_s
                               (i32.add
                                (i32.load
                                 (i32.add
                                  (i32.add
                                   (get_local $24)
                                   (get_local $12)
                                  )
                                  (get_local $23)
                                 )
                                )
                                (i32.load
                                 (i32.add
                                  (i32.add
                                   (get_local $24)
                                   (get_local $13)
                                  )
                                  (get_local $23)
                                 )
                                )
                               )
                               (i32.const 1)
                              )
                              (tee_local $26
                               (i32.load
                                (tee_local $19
                                 (i32.add
                                  (i32.add
                                   (get_local $24)
                                   (get_local $11)
                                  )
                                  (get_local $23)
                                 )
                                )
                               )
                              )
                             )
                             (i32.const 1)
                            )
                            (i32.load
                             (i32.add
                              (i32.add
                               (get_local $24)
                               (get_local $14)
                              )
                              (get_local $23)
                             )
                            )
                           )
                           (i32.shr_s
                            (i32.sub
                             (i32.shr_s
                              (i32.add
                               (i32.load
                                (i32.add
                                 (get_local $19)
                                 (i32.const 4)
                                )
                               )
                               (i32.load
                                (i32.add
                                 (get_local $19)
                                 (i32.const -4)
                                )
                               )
                              )
                              (i32.const 1)
                             )
                             (get_local $26)
                            )
                            (i32.const 1)
                           )
                          )
                         )
                         (i32.const 1073741823)
                         (i32.lt_s
                          (get_local $19)
                          (i32.const 1073741823)
                         )
                        )
                       )
                       (i32.const -1073741824)
                       (i32.gt_s
                        (get_local $19)
                        (i32.const -1073741824)
                       )
                      )
                     )
                     (get_local $26)
                    )
                   )
                   (i32.const 1073741823)
                   (i32.lt_s
                    (get_local $26)
                    (i32.const 1073741823)
                   )
                  )
                 )
                 (i32.const -1073741824)
                 (i32.gt_s
                  (get_local $26)
                  (i32.const -1073741824)
                 )
                )
                (tee_local $26
                 (i32.load
                  (tee_local $20
                   (i32.add
                    (i32.add
                     (get_local $24)
                     (get_local $16)
                    )
                    (get_local $23)
                   )
                  )
                 )
                )
               )
              )
              (i32.const 1073741823)
              (i32.lt_s
               (get_local $21)
               (i32.const 1073741823)
              )
             )
            )
            (i32.const -1073741824)
            (i32.gt_s
             (get_local $21)
             (i32.const -1073741824)
            )
           )
          )
          (i32.store
           (get_local $20)
           (i32.sub
            (get_local $26)
            (i32.shr_s
             (get_local $26)
             (i32.const 4)
            )
           )
          )
          (set_local $19
           (i32.sub
            (get_local $19)
            (select
             (i32.shr_s
              (get_local $19)
              (get_local $1)
             )
             (i32.const 0)
             (i32.gt_s
              (get_local $1)
              (i32.const 0)
             )
            )
           )
          )
          (set_local $26
           (i32.const 56)
          )
         )
         (i32.store
          (i32.add
           (i32.shl
            (i32.add
             (i32.add
              (get_local $27)
              (get_local $18)
             )
             (i32.load
              (get_local $26)
             )
            )
            (i32.const 2)
           )
           (i32.const 80)
          )
          (get_local $19)
         )
        )
        (set_local $24
         (i32.add
          (get_local $24)
          (i32.const 4)
         )
        )
        (br_if $label$14
         (i32.ne
          (get_local $3)
          (get_local $25)
         )
        )
       )
      )
      (set_local $27
       (i32.add
        (get_local $3)
        (get_local $27)
       )
      )
      (br_if $label$11
       (i32.lt_s
        (tee_local $24
         (get_local $17)
        )
        (get_local $2)
       )
      )
      (br $label$10)
     )
     (br_if $label$11
      (i32.lt_s
       (tee_local $24
        (i32.add
         (get_local $24)
         (i32.const 1)
        )
       )
       (get_local $2)
      )
     )
    )
   )
   (br_if $label$0
    (i32.le_s
     (get_local $2)
     (i32.const 0)
    )
   )
   (br_if $label$0
    (i32.lt_s
     (get_local $3)
     (i32.const 1)
    )
   )
   (set_local $17
    (i32.shl
     (get_local $3)
     (i32.const 2)
    )
   )
   (set_local $10
    (i32.add
     (i32.shl
      (get_local $4)
      (i32.const 2)
     )
     (i32.const 80)
    )
   )
   (set_local $26
    (i32.add
     (i32.shl
      (get_local $8)
      (i32.const 2)
     )
     (i32.const 80)
    )
   )
   (set_local $27
    (i32.add
     (i32.shl
      (i32.load offset=44
       (i32.const 0)
      )
      (i32.const 2)
     )
     (i32.const 80)
    )
   )
   (set_local $1
    (i32.const 0)
   )
   (loop $label$19
    (set_local $22
     (get_local $3)
    )
    (set_local $24
     (get_local $10)
    )
    (set_local $18
     (get_local $26)
    )
    (set_local $25
     (get_local $27)
    )
    (loop $label$20
     (set_local $23
      (i32.const 0)
     )
     (block $label$21
      (br_if $label$21
       (i32.eq
        (i32.load
         (get_local $24)
        )
        (i32.const 1)
       )
      )
      (block $label$22
       (block $label$23
        (br_if $label$23
         (i32.lt_s
          (tee_local $23
           (i32.shr_s
            (i32.load
             (get_local $18)
            )
            (i32.const 22)
           )
          )
          (i32.const 1)
         )
        )
        (set_local $19
         (i32.or
          (i32.or
           (i32.shl
            (get_local $23)
            (i32.const 8)
           )
           (i32.shl
            (get_local $23)
            (i32.const 16)
           )
          )
          (i32.const -16777216)
         )
        )
        (br $label$22)
       )
       (set_local $19
        (i32.const -16777216)
       )
      )
      (set_local $23
       (select
        (i32.xor
         (i32.or
          (get_local $23)
          (i32.const -16777216)
         )
         (i32.const 16777215)
        )
        (get_local $19)
        (i32.lt_s
         (get_local $23)
         (i32.const 0)
        )
       )
      )
     )
     (i32.store
      (get_local $25)
      (get_local $23)
     )
     (set_local $24
      (i32.add
       (get_local $24)
       (i32.const 4)
      )
     )
     (set_local $18
      (i32.add
       (get_local $18)
       (i32.const 4)
      )
     )
     (set_local $25
      (i32.add
       (get_local $25)
       (i32.const 4)
      )
     )
     (br_if $label$20
      (tee_local $22
       (i32.add
        (get_local $22)
        (i32.const -1)
       )
      )
     )
    )
    (set_local $10
     (i32.add
      (get_local $10)
      (get_local $17)
     )
    )
    (set_local $26
     (i32.add
      (get_local $26)
      (get_local $17)
     )
    )
    (set_local $27
     (i32.add
      (get_local $27)
      (get_local $17)
     )
    )
    (br_if $label$19
     (i32.lt_s
      (tee_local $1
       (i32.add
        (get_local $1)
        (i32.const 1)
       )
      )
      (get_local $2)
     )
    )
   )
  )
 )
)
