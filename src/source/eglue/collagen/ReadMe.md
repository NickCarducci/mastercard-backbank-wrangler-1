From the top!

cargo install third party rust binaries.

make sure you use VS Code from your outermost found Cargo.toml and nightly rust-toolchain.

you can build with the stable version, as shown in `scripts:build` npm `package.json` or from your command line.

`cargo update` is like `npm install` - builds `[Cargo,package].lock` file

`cargo install _` is like `npm install _`

> `rustup update` new terminal/**VS Code window** `rm -rf ./cargo`, yadda yadda

ignore this `Failed to install 'rust-lang.rust-analyzer'.` when using Rust starred Visual Studio "extension" `Rust`

### This is not exactly composition, as default is not canonical except for the Default helper?

> I like [the article](https://www.reddit.com/r/rust/comments/p8jjnl/rust_doesnt_support_default_function_arguments_or/) of course but I must detest the `default` [idolization surplus of actual `composition` excess](https://stackoverflow.com/questions/70082393/why-cant-stdthreadspawn-accept-arguments-in-rust).

For wasm-bindgen, we need to instantiate for [passing arguments](https://stackoverflow.com/a/24049607/11711280).

`cargo clean` as you add to `Cargo.toml`, and then open VSCode new window
