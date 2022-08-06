
use wasm_bindgen::JsValue;
//use wasm_bindgen_futures::future_to_promise;
use wasm_bindgen::prelude::wasm_bindgen;

pub fn pathify(path: &str) -> std::path::PathBuf {
    let mut input_file = std::path::PathBuf::new();

    let _arr: () = path.split("/").map(|x| input_file.push(x)).collect();
    return input_file;
}

#[wasm_bindgen]
pub async fn main() -> Result<String, JsValue> {
            let lock: std::path::PathBuf = pathify("./exec.c");
            let app: String = String::from_utf8(cc::Build::new().file(lock).expand()).unwrap();
    Ok(app)
}
