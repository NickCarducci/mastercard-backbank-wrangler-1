`cargo-expand/ cargo rustc` does *not require nightly to be the default toolchain* **nor the one with which `cargo expand` *itself* is executed**.

1. call c language from php[, etc.]

2. [🐋](https://github.com/Shopify/javy)? [jabstract](https://github.com/nickcarducci/jabstract.cc)


[[bin]] globals can use a ([pub](https://doc.rust-lang.org/reference/visibility-and-privacy.html?highlight=pub#pubin-path-pubcrate-pubsuper-and-pubself)) main function instead ofn just pub mod, but potentially (neither) may not be able to select members without calling the whole binary (or one at a time)

future_to_promise Ok::<JsValue, JsValue>(JsValue::undefined())

"unsigned[ primitive]" means polarity[ type]

````
macro_rules! mak {
    ($name:ident) => {
        fn $name<T>(a: T) -> $name<where Output = T> {
            info!(a);
        }
    };
}
mak("console").console(<String>"");
````
what the
````
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
````
