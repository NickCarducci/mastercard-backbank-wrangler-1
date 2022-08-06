use wasm_bindgen::prelude::wasm_bindgen;
mod jfmast;

struct Number(u8);//vec![0]
#[wasm_bindgen(start)]
pub fn main () /*-> jfmast::Jship*/ { jfmast( args )}//args[0];
//no default args https://stackoverflow.com/a/24049607/11711280
