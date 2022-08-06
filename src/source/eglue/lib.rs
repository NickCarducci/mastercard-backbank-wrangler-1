mod bupkis;
use crate::bupkis::{/*console,n,*/jsfuture,arguments};//'arguments'/stringifu::from_iter(std::env::args_os()) gets rewritten inside deepest scope "apply" thisArg, argsArrayArg
//mod jfmast; mod only needed if with pub mod
use crate::jfmast;

//fn ego () -> jsfuture awaitfm(arguments[0]);

//(&*&0,)
/*fn _<T>(v: Vec<T>) -> Vec<T> {
    let mut v = v;
    v.reverse();
    v
}*/
//https://www.reddit.com/r/rust/comments/6ln5du/mut_mut_why_is_this_required/
/*struct typ {//option+fn+v
    n:u8//unsigned smol num, then (+/-) i32 and String
}*/
//static n : Option<u8>;
//static n:0; //<u8 = 0>;
//impl none {}
//typ{n:0}.n
//impl none for typ {self.n=0}
//const arg = 0;
//https://www.reddit.com/r/rust/comments/ns9xsr/what_does_a_struct_return/

fn main () -> jfmast( &arguments(n0) );
//pub fn main () -> jsfuture println!("{}",  jfmast( &arguments((&*&0,)) ) );
/*pub fn main () -> jsfuture {
  console!(&<n:?Sized>);//&0:?Sized
  //impl JFMast for JsFuture;
  //https://docs.smithy.rs/wasm_bindgen_futures/index.html
  println!("{}",jfmast(&arguments( (&*&0,) )) );//"src/source/exec.c"
  //jsfuture(&jfmast(&arguments(n 0)));
}*/
