use futures::executor::LocalPool;

pub fn pathify(path: &str) -> std::path::PathBuf {
    let mut input_file = std::path::PathBuf::new();

    let arr: () = path.split("/").map(|x| input_file.push(x)).collect();
    return input_file;
}


struct DropOnce<'a> {
    _bosun: dyn Mak<&'a mut std::sync::Once<'a>>,
}
trait Mak {
    fn resolve(self) -> Self::Output;
    fn bosun() {
        let lock: std::path::PathBuf = pathify("./exec.c"); //.iter();
        cc::Build::new().file(lock).expand(); //= Default::default().await
    }
}
//blanket implementation
//std::future::Future
impl<'a> std::future::Future for DropOnce<'a> {
    //trait FutureResolve: std::future::Future<Output = u8> {
    //fn resolve(self) -> Self::Output;
    fn poll(&'a mut self) -> &'a mut Self {
        println!("poll");
        self
    }
}
/*
impl std::future::Future for Mast {
    fn bosun(&self) -> Pin<Box<dyn Future<Output = User> + Send + '_>>;
}*/
//impl<T> Mak<&std::future::Future> for T {bosun()}

fn main() {
    let mut pool = LocalPool::new();
    //https://rust-lang-nursery.github.io/futures-api-docs/0.3.0-alpha.19/futures/executor/struct.LocalPool.html
    _bosun = pool.run_until(my_app);
}
