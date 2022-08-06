
use wasm_bindgen::JsValue;
//pub struct Jship(Result<JsValue, JsValue>);
//use wasm_bindgen_futures::JsFuture;
//use futures::task::Context;
use js_sys::Promise;
use std::pin::Pin;
use std::sync::{Arc, Mutex};
use std::task::{Context, Poll};

//struct Str(str);
//struct NewStr(Vec<Str>);
//fn NewStr (str)->Self{return Vec::<&str>::new()}
//fn pathArray (){return Vec<&str> = path.split("/").collect()}
//mod tools;
//use tools::iterationforeach;//args: &mut [i32]
//https://doc.rust-lang.org/std/keyword.struct.html

//[i32; 0]
//pub struct Pathboof(std::path::PathBuf);
/*impl std::convert::AsRef<std::path::Path> for Pathboof {
   fn as_ref(&self) -> &T;
}*/
pub fn pathify(path: &str) -> std::path::PathBuf {
    let mut input_file = std::path::PathBuf::new();
    //let path: Vec<&str> = path.split("/").collect()
    //.map(str::to_owned).collect::<Vec<_>>()//stdin.lock().lines()
    //let arr:Vec<_> = 
    let arr:() = path.split("/").map(|x| input_file.push(x)).collect();
    return input_file;
    //return arr//.iter();
    //println!("{}", out); 
}
//use std::sync::Arc;

/*struct Mast {
    state: State,
    bosun: dyn std::future::Future<Output = u8>,
}*/
struct Mast {
    bosun: Arc<Mutex<Bosun>>,
}
impl Mast {
    async fn bosun() {
        let lock: std::path::PathBuf = pathify("./exec.c");//.iter();
        cc::Build::new().file(lock).expand(); //= Default::default().await
    }
}
struct Bosun {
    state: Watcher,
    bosun: dyn std::future::Future<Output = u8>,
}
impl std::future::IntoFuture for Bosun {

}
enum Watcher {
    Start,
    Bosun,
}
trait FutureResolve: std::future::Future {
    fn resolve(self) -> Self::Output;//type Output = <wasm_bindgen_futures::JsFuture as std::future::Future>::Output;

}
//Immovable objects can store pointers between their fields
//and to enable async/await
impl FutureResolve for Bosun {
    
    fn poll(/*mut */self: Pin<&mut Self>, cx: &mut Context/*<'_>*/) -> Poll<Self::Output> {
        loop {
            //https://rust-lang.github.io/async-book/04_pinning/01_chapter.html?search=Context%20future
            match self.state {
                Watcher::Start => match self.bosun.poll(..) {
                    Poll::Ready(()) => self.state = Watcher::Bosun,
                    Poll::Pending => return Poll::Pending,
                },
                Watcher::Bosun => return Poll::Ready(()),
            }
        }
    }
}
//struct Jship(std::result::Result<wasm_bindgen::JsValue, wasm_bindgen::JsValue>);
//fn bosun() -> Jship {return cc::Build::new().file(lock).expand() = Default::default(arg).await;}
//async fn mastbosun() -> Jship {return bosun();}//only return requires `-> Option<type>/Self/String/i32/u8`
fn main() -> Promise {
    //fn default() -> Self
    return wasm_bindgen_futures::future_to_promise(  mastbosun()  );
}
