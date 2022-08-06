import m from "./exec.mjs";
async function MasterCardPHP(request) {
  /*async function app() {
  if (Module["instantiateWasm"]) {}*/
  console.log(m);
  return await m.run().Module({
    locateFile: function (path, prefix) {
      // if (path.endsWith(".mem")) return "https://mycdn.com/memory-init-dir/" + path
      let url = new URL(request.url); // if it's a mem init file, return custom dir
      return /*prefix*/ url + path; // (default) prefix dir + path
    },
    //{env:{ memory: new WebAssembly.Memory({initial: 512}) }},//32MB wasmMemory
    print: (text) => (output += `${text}\n`),
    printErr: (text) => (output += `${text}\n`), // Instead of downloading the .wasm file, fetch it from a global var
    instantiateWasm: (imports, callback) => {
      if (!WebAssembly.validate(BACKBANK_WASM))
        return console.log({
          name: "not bufferable",
          message: "instantiable already-buffered by cf workers"
        });
      console.log("instantiateWasm:");
      const inst = new //wrangler.toml\(wasm_modules={BACKBANK_WASM="./backbank.wasm"};)
      WebAssembly.Instance(BACKBANK_WASM, imports); //https://cloudflare.tv/event/5H5JZQgQZWQwYonKhekr80 7-9' //resource-binding-UI/API.
      callback(inst);
      console.log("app=WebAssembly.Instance(BACKBANK_WASM,imports).exports.ccall('index');");
      return inst.exports;
    }
  })
    .then((module) => {
      return {
        app: module.ccall(
          "index",
          null /*return type*/,
          [null] /*argument types*/,
          request /*arguments*/,
          { async: "true" }
        )
      };
    })
    .catch((err) => console.log(err.message)); //'null' == object return/argument type "since the beginning of javascript" - MDN typeof
}
export default async function () {return await MasterCardPHP().app()}
