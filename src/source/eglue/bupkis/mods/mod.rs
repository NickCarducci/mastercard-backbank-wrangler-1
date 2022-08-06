

use crate::bupkis::{resultable,arguments,null,dev};

//each crate has one main function
//with pub uses
//[[bin]] path globals preclude `crate`
//https://stackoverflow.com/a/57453866/11711280
//use crate certain pub members (rust)?
use dev::{pathbuf};
pub fn pathify () -> resultable {
  let mut input_file = pathbuf();
  fn iteration () -> null {
    input_file.push(&arguments()[0]);
  }
  let out = mods::utils::iterationforeach(&arguments(), iteration);
  println!("{}", out);
   Ok(())
}
