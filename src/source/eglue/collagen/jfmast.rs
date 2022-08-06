
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen_futures::JsFuture;
pub struct Jship(Result<JsValue, JsValue>);
#[wasm_bindgen(start)]
pub fn jfmast(arg: String) -> Jship {
    /* rust has command arguments. the type of Fn are Option<u8,String,etc>
    let args = &arguments();//arguments from scope is made by javascript but not rust.
    let lock = &mods::pathify(&args[0].split("/"));
    //use in a (!) `macro_rule!` if MacroFragSpec path exists?
    //https://stackoverflow.com/a/57454769/11711280
    ($p:path; $i:ident) => {
        {
            use $p as srcpath;
            do_stuff(srcpath::$i)
        }
    }
    */

    fn mastbosun() -> impl Future {
        async { await cc::Build::new().file(lock).expand() = Default::default(arg) };
    };
    wasm_bindgen_futures::future_to_promise(mastbosun());
}
