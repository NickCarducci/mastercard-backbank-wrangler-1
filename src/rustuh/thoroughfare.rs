use js_sys::Promise;
use wasm_bindgen::prelude::*;

async fn module() -> Result<JsValue, KvError> {
    let engine = Engine::default();
    let module = Module::from_file(&engine, "a.out.wat")?;
    let mut store = Store::new(
        &engine,
        MyState {
            name: "hello, world!".to_string(),
            count: 0,
        },
    );
    let hello_func = Func::wrap(&mut store, |mut caller: Caller<'_, MyState>| {
        //println!("> {}", caller.data().name);
        //caller.data_mut().count += 1;
    });
    let imports = [hello_func.into()];
    let instance = Instance::new(&mut store, &module, &imports)?;

    let run = instance.get_typed_func::<(), (), _>(&mut store, "run")?;

    run.call(&mut store, ())?;
}

#[wasm_bindgen]
pub fn MastercardPHP() -> Promise {
    wasm_bindgen_futures::future_to_promise(async { module() })
}
