//import Module from "./exec.js";
//import FSA from "./fileserve.js";
//import FSA from "../a.out.wasm";

// Initialize WebAssembly module
//let output = "";
// By default, stdout/stderr is output to console.log/warn
export default async function MasterCardPHP(request) {
  async function app() {
    //var asmArg = { __asyncjs__openXML: () => FSA({ startIn: "src/backbank.mjs" }) };
    //const info = { env: asmArg, wasi_snapshot_preview1: asmArg }; //asmLibraryArg
    //fetch the final return/arrow, 'this-deepest-function'
    return await WebAssembly.instantiateStreaming(//fetch("src/backbank.mjs")
      //info
      fetch('a.out.wasm')/*await fetch('a.out.wasm').then(response =>
        //response.arrayBuffer()//WebAssembly.instantiateStreaming(fetch('a.out.wasm'), importObject)*/
    )
      .then((bufferSource) => {
        if (!WebAssembly.validate(bufferSource))
          throw {
            name: "not bufferable",
            message: "cloudflare workers buffers array 'in-house'"
          };
        console.log(
          "the buffer is WAM binary: fetch(), return param arrayBuffer()=initiateStreaming()"
        );
        return WebAssembly.instantiate(bufferSource, arguments).instance
          .exports;
      })
      .catch(async (err) => {
        console.log(
          "the source is not a bufferable 'WAM binary': should then be already instantiable thru" +
            " 'new WebAssembly.Instance.exports' emcc out[-file] ['exec'].js"
        );
        if (!WebAssembly.validate(this))
          return console.log({
            name: "not bufferable",
            message: "instantiable already-buffered by cf workers"
          });
        return await new WebAssembly.Instance(this, arguments).exports; //callback(inst);
      });
  }
  return app.apply(BACKBANK_WASM, request);
}
