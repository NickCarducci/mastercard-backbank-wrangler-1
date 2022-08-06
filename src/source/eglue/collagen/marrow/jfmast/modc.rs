//https://stackoverflow.com/a/47641166/11711280
//https://internals.rust-lang.org/t/asynchronous-destructors/11127/46
//elide life time


pub fn pathify(path: &str) -> std::path::PathBuf {
    let mut input_file = std::path::PathBuf::new();
    //let path: Vec<&str> = path.split("/").collect()
    //.map(str::to_owned).collect::<Vec<_>>()//stdin.lock().lines()
    //let arr:Vec<_> =
    let arr: () = path.split("/").map(|x| input_file.push(x)).collect();
    return input_file;
    //return arr//.iter();
    //println!("{}", out);
}

struct Mast {
    //Arc<Mutex<Bosun>>, //
    bosun: dyn std::future::Future<Output = u8>,
    //state: Watcher,
}
impl std::future::Future for Mast {
    fn bosun(&self) -> Pin<Box<dyn Future<Output = User> + Send + '_>>;
}
//enum Watcher {Start, Bosun,}
trait FutureResolve: std::future::Future<Output = u8> {
    fn resolve(self) -> Self::Output;
    //type Output = <wasm_bindgen_futures::JsFuture as std::future::Future>::Output;
    async fn bosun() {
        let lock: std::path::PathBuf = pathify("./exec.c"); //.iter();
        cc::Build::new().file(lock).expand().await; //= Default::default().await
    }
    fn bosun(&self) -> Pin<Box<dyn Future<Output = User> + Send + '_>>;
}

struct DropOnce<'a> {
    _bosun: PhantomData<&'a mut std::sync::Once<'a>>,
}

impl<'a> DropOnce<'a> {
    fn poll(&'a mut self) -> &'a mut Self {
        println!("poll");
        self
    }   

    fn do_drop(&'a mut self) {
        println!("last_poll");
    }   
}

fn main() {
    let mut c = DropOnce { _bosun: PhantomData };
    let r = &mut c;
    let r = r.poll();
    let r = r.poll();
    r.do_drop();
    c.poll(); // borrow checker error
}
//"emphasize for users that implementing poll_drop does not do anything outside of async contexts!
//...async destructors possible (using poll methods)"

/*
 The function will block the calling thread only until the future f completes; 
 there may still be incomplete tasks in the pool, which will be inert after the call completes, 
 but can continue with further use of one of the pool's run or poll methods. While the function is running, 
 however, all tasks in the pool will try to make progress.
 */
