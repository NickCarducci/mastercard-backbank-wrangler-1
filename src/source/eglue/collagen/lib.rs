mod bupkis;
use crate::bupkis::{jsfuture,arguments};
use crate::jfmast;

struct Number(u8);//vec![0]
//see `../bumkis/null.rs` `src/source/eglue/bumkis/null.rs` for potential `ident` example
/*macro_rules! arguments {
    ($($args:expr),*) => {{
        $(
           jfmast( $args.iter );
        )*
    }}
}*/ //https://blog.logrocket.com/macros-in-rust-a-tutorial-with-examples
//following indicates an unlimited amount of arguments, which call
macro_rules! array {//"if you need it to be indexable, then you'll want to collect it into a vector."
    ($args:expr,$($array:tt)*) => { //let y: Vec<_> =
        //$args.push(..$array.push($($array)*)) (NOOPe)
         //stackoverflow.com/questions/54607493/what-is-the-rust-equivalent-of-javascripts-spread-operator-for-arrays
        [$args].iter().chain($($array)*)//.map(|&x|x).collect();
    }
}//https://danielkeep.github.io/tlborm/book/pat-incremental-tt-munchers.html

//fn main() -> arguments!(1, 2, "Hello");
//https://stackoverflow.com/a/57454769/11711280
//fn main ()->arguments!( Number(0));

fn main (args: &mut [i32]) -> jfmast::Jship ( jfmast( args ));//args[0];
//fn main (arg:String) -> jfmast::Jship ( jfmast( &array!(Number(0)) ));
//&mut : Option<String>
//https://doc.rust-lang.org/rust-by-example/std/option.html
//
//implement a functional type?
//fn main (arg: Option<String>) -> jfmast::Jship ( jfmast( &array!(Number(0)) ));

//fn main () -> jfmast( &array(Number(0)) );
//fn main () -> jfmast( &arguments(Number(0)) );
