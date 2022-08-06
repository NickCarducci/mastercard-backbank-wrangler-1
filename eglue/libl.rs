//#![feature(into_future)]
//#![cfg(feature(into_future))]
use wasm_bindgen::prelude::wasm_bindgen;

pub fn pathify(path: &str) -> std::path::PathBuf {
    let mut input_file = std::path::PathBuf::new();

    let arr: () = path.split("/").map(|x| input_file.push(x)).collect();
    return input_file;
}

use js_sys::Promise;
//#![feature(into_future)]

use std::future::IntoFuture;
use wasm_bindgen::JsValue;
use wasm_bindgen_futures::future_to_promise;

#[wasm_bindgen]
pub async fn main() -> Result<Promise, JsValue> {
    struct Ship;
    impl IntoFuture for Ship {
        type Output = u8;//vec![u8];
        type IntoFuture = Self::Output;
        fn into_future(self) -> Self::IntoFuture {
            let lock: std::path::PathBuf = pathify("./exec.c");
            let app: u8 = cc::Build::new().file(lock).expand();
            println!("{}", app);
        }
    }
    let result: Promise = future_to_promise(Ship.await);
    Ok(result)
}
