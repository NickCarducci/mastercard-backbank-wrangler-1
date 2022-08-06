// a reading, module referencing, and expansion of a rust file source
// https://docs.rs/syn-file-expand/latest/syn_file_expand/fn.read_full_crate_source_code.html
//use stringify;// no Vec<Oostring> allocation needed, no methods like from_iter?
use pubmain::{arguments,resultable};
pub fn swing () -> resultable {
  let source = syn_file_expand::read_full_crate_source_code(&arguments[1], |_|Ok(false))?;
  println!("{}", source.into_token_stream() );
   Ok(())
}//https://doc.rust-lang.org/std/result/
//opens crate
