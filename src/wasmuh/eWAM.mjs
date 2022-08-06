//import * as __asyncjs__openXML from "src/backbank.mjs";
import _wasm from "../a.out.wasm";

const _wasm_memory = new WebAssembly.Memory({ initial: 512 });
let importsObject = {
  env: { memory: _wasm_memory },
  //"src/backbank.mjs": __asyncjs__openXML,
};

export default new WebAssembly.Instance(_wasm, importsObject).exports;
