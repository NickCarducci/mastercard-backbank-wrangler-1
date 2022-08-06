//mod bupkis; `bupkis/mod.rs` already modded in by `main.rs`
use crate::bupkis::{arguments,mods,jsfuture};

//#![crate_type="cdylib"] // only this bytecode not ./build.rs .. don't use binary/"bin" at all instead of binarily _serialized_ bytecode?
//extern crate bindgen;//https://stackoverflow.com/a/50307802/11711280
//extern crate bindgen;//mod use crate::c;
//use bindgen;//use ::ifcrate
// attribute
use wasm_bindgen::prelude::wasm_bindgen;
// utils
use wasm_bindgen_futures;
use wasm_bindgen_futures::JsFuture::from;
use cc;

use std::future::Future;//Trait
//let my_num_ptr:*const i32=&*Box<i32>=Box::new(10);//https://doc.rust-lang.org/std/primitive.pointer.html

//use crate::promise;
//use promise;//"promise-rs"
/*error[E0774]: `derive` may only be applied to `struct`s, `enum`s and `union`s
   --> /home/runner/.cargo/registry/src/github.com-1ecc6299db9ec823/promise-rs-0.3.0/src/lib.rs:192:9
    |
192 |         #[derive(Debug)]
    |         ^^^^^^^^^^^^^^^^ not applicable here
193 |         // let mut pending_promises_threads: Vec<Arc<Mutex<Option<std::thread::JoinHandle<()>>>>> = vec![];
194 |         let mut resoved_results: Vec<String> = vec![];
    |         ---------------------------------------------- not a `struct`, `enum` or `union`
*/
// Future<Output = Result<JsValue, JsValue>>
//"don't support use of references, or any explicit scope-based mutability"
//"['&' is ]not required for mutability 1. They're primarily to enforce temporary exclusive access."
//https://users.rust-lang.org/t/how-can-i-define-struct-that-holds-futures-of-function-which-functions-will-return-a-future/71619/34
//https://rustwasm.github.io/docs/wasm-bindgen/examples/without-a-bundler.html
//just use #[wasm_bindgen(start)] in lib.rs and init in the calling js code
//#[wasm_bindgen]//pub mod main start, promise::Promise
pub fn jfmast () -> jsfuture {
  let args = &arguments();
  let lock = &mods::pathify(&args[0].split("/"));
      //https://doc.rust-lang.org/rust-by-example/custom_types/structs.html
      //https://doc.rust-lang.org/rust-by-example/generics/impl.html
  //struct Mast { bosun: Future<Output = u8> };//<i32>
   
      //implement TraitMethods [Future] onin TypeStruct [Mast]
      //impl Future for Mast { fn app () -> jsfuture { cc::Build::new().file(lock).expand() = Default::default(&args[1]) }; };
      //https://doc.rust-lang.org/book/ch10-02-traits.html#returning-types-that-implement-traits
  //impl Future for Mast { async { bosun: () -> cc::Build::new().file(lock).expand() = Default::default(&args[1]) }; };
   
      //a Trait defines a 
      //https://stackoverflow.com/questions/28291349/can-you-implement-a-generic-struct-for-multiple-types
      //a StructType declaration which may be able to have more than one <T> generic types
      //as functional generics, at least, can `fn genericfn<T,U>(foo:T,bar:U)->{foo}`
      //https://oswalt.dev/2021/06/using-generic-types-in-rust/
      //an impl Trait for Struct uses member
  fn mastbosun () -> impl Future { async { cc::Build::new().file(lock).expand() = Default::default(&args[1]) }; };
   //https://stackoverflow.com/questions/32552593/is-it-possible-for-one-struct-to-extend-an-existing-struct-keeping-all-the-fiel
   //https://rust-lang.github.io/async-book/03_async_await/01_chapter.html
  wasm_bindgen_futures::future_to_promise(mastbosun());
}
