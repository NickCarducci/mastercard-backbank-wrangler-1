(module
  (type $t0 (func (result i32)))
  (type $t1 (func))
  (type $t2 (func (param i32 i32) (result i32)))
  (type $t3 (func (param i32)))
  (type $t4 (func (param i32) (result i32)))
  (import "env" "__asyncjs__openXML" (func $env.__asyncjs__openXML (type $t0)))
  (func $__wasm_call_ctors (type $t1)
    nop)
  (func $main (type $t2) (param $p0 i32) (param $p1 i32) (result i32)
    call $env.__asyncjs__openXML
    drop
    i32.const 0)
  (func $stackSave (type $t0) (result i32)
    global.get $g0)
  (func $stackRestore (type $t3) (param $p0 i32)
    local.get $p0
    global.set $g0)
  (func $stackAlloc (type $t4) (param $p0 i32) (result i32)
    global.get $g0
    local.get $p0
    i32.sub
    i32.const -16
    i32.and
    local.tee $p0
    global.set $g0
    local.get $p0)
  (func $__errno_location (type $t0) (result i32)
    i32.const 1120)
  (table $__indirect_function_table 1 1 funcref)
  (memory $memory 256 256)
  (global $g0 (mut i32) (i32.const 5244016))
  (export "memory" (memory 0))
  (export "__wasm_call_ctors" (func $__wasm_call_ctors))
  (export "main" (func $main))
  (export "__indirect_function_table" (table 0))
  (export "__errno_location" (func $__errno_location))
  (export "stackSave" (func $stackSave))
  (export "stackRestore" (func $stackRestore))
  (export "stackAlloc" (func $stackAlloc)))
