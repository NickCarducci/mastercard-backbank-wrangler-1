use futures::executor::LocalPool;

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

/*struct Mast {
    //Arc<Mutex<Bosun>>, //
    bosun: dyn std::future::Future<Output = u8>,
    //state: Watcher,
}
impl std::future::Future for Mast {
    fn bosun(&self) -> Pin<Box<dyn Future<Output = User> + Send + '_>>;
}*/

struct DropOnce <'a>{
    _bosun: dyn PhantomData<&'a mut std::sync::Once<'a>>,
}
trait Mak {
    fn resolve(self) -> Self::Output;
       fn bosun() {
        let lock: std::path::PathBuf = pathify("./exec.c"); //.iter();
        cc::Build::new().file(lock).expand().await; //= Default::default().await
    }
}

//std::future::Future
impl <'a>std::future::Future for DropOnce<'a> {
    fn poll(&'a mut self) -> &'a mut Self {
        println!("poll");
        self
    }
    async fn bosun() {
        let lock: std::path::PathBuf = pathify("./exec.c"); //.iter();
        cc::Build::new().file(lock).expand().await; //= Default::default().await
    }
    fn do_drop(&'a mut self) {
        println!("last_poll");
    }
}
impl<T> Mak <&std::future::Future> for T {
        fn poll(&'a mut self) -> &'a mut Self {
        println!("poll");
        self
    }
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

//howdeeho discount damages
//"[contractor profit ]is essential,
//immigrant president,
//regret out of control immigration"
//"civil common uniform legislated[ republic]"
fn main() {
    let mut pool = LocalPool::new();
_bosun = 
    // run tasks in the pool until `my_app` completes, by default spawning
    // further tasks back onto the pool
    pool.run_until(my_app);
//https://rust-lang-nursery.github.io/futures-api-docs/0.3.0-alpha.19/futures/executor/struct.LocalPool.html
    /*
    let mut c = DropOnce {
        _bosun: PhantomData,
    };
    let r = &mut c;
    let r = r.poll();
    let r = r.poll();
    r.do_drop();
    c.poll(); // borrow checker error
    */
}
