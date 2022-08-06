//what primitive type is a vector type
/*struct Implementable { id: String, value: i32 }

let mut objectarray = Vec::new();
objectarray.push(Implementable { id: "giv",
                        value: 1525 });*/
//price controls fixed costs
mod null;
use null::{Null};
use env_logger;
use wasm_bindgen::JsValue;
pub fn main() -> Null {
  //env_logger::init();
  /*macro_rules! console {
    ($item:block | expr | ident | item | lifetime | literal | meta | pat | path | stmt | tt | ty | vis) => {
      info!($item)
    };//https://doc.rust-lang.org/rust-by-example/macros/designators.html
  }
  macro_rules! console {
    ($item:ident) => {
      fn $item() {
        info!();
      }
    };
  }*/
  //https://stackoverflow.com/questions/65164156/how-to-set-dependencies-for-a-macro-in-rust
  //trait Peel {info!()}
  //let Console = *info!();
  let out = vec![0]; //String.from("");
                     //console!(out);
                     //pub(crate) use info as console;
                     /*pub struct Console (Fn<T>);  //&info;//rename
                     impl Copy for Console {}
                     impl Info for Console {
                         fn clone(&self) -> Self { *self }
                     }*/
  //https://doc.rust-lang.org/std/string/struct.String.html
  //types and traits?
  pub struct Jship(Result<JsValue, JsValue>);
  //pub trait Mast { fn main (&self)->Ship ;}
  pub static resultable: Result<(), syn_file_expand::Error>;
  pub static stringifu: Vec<OsString>;
  pub static n: Option<i32>; //:?Sized;//Option struct with i32 +/- type ("unsigned")
                             //contructors ()able that begs for arguments, else in ./dev.rs
  pub fn arguments() -> stringifu {
    let arguments = stringifu::from_iter(std::env::args_os());
    if arguments.len() != 2 {
      std::process::exit(1);
    }
    while !args.is_empty() {
      //forwhile
      let &i = args.remove(0).to_lowercase();
      if env::args().collect() == i {
        arguments.push(&i);
      }
    }
    //https://stackoverflow.com/questions/56880696/how-do-i-run-a-command-that-can-take-an-unspecified-number-of-env-arguments
    println!("{}", arguments); //env::args().collect::<Vec<_>>();
  }
}
