
pub struct Null{mai:()}
pub fn main() -> mut {
    impl Null {
       fn mai()->(){ println!("{}",std::ptr::null_mut())};
    }
    
}

fn add<T>(a: T, b: T) -> T
where
    T: Add<Output = T>,
{
    a + b
}
/*macro_rules! mak {
($name:ident) => {
    fn $name<T>(a: T) -> T
    where
        T: $name<Output = T>,
    {
        info!(a);
    }
};
}*/

macro_rules! mak {
    ($name:ident) => {
        fn $name<T>(a: T) -> $name<where Output = T> {
            info!(a);
        }
    };
}
mak("console").

macro_rules! mak {
    ($name:ident) => {
        trait AnyExt {
            fn type_name(&self) -> &'static str;
        }
        impl<T> AnyExt for T {
            fn type_name(&self) -> &'static str {
                std::any::type_name::<T>()
            }
        }
        fn $name<T>(a: T) -> $name<where Output = type_name(a)> {
          type_name;
        }
    };
}
