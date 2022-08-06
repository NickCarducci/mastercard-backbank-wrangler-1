// let stored = this.el.storage.get("esm"); //Read requests	100,000 / day, ($free)
//import MasterCardPHP from "./glue";//"./ifWAM.mjs"; //"./babelphp.mjs";
import MasterCardPHP from "./WASI.mjs";//"./ifWAM.mjs"; //"./babelphp.mjs";

//(set) keyvalue.set(bytes, ptr); "bytememory"
//const keyvalue = new Uint8Array(store.buffer);
//const keyvalue = new Uint8Array(MasterCardPHP.Memory().buffer);
//(read) let resultBytes = keyvalue.slice(ptr, ptr + newSize)
/*
const options = { env:{ memory: new WebAssembly.Memory({initial: 512}) } };
const MasterCardPHP = new WebAssembly.Instance(BACKBANK_WASM, options).exports;
const store = MasterCardPHP.Memory();
*/

export class DurableObjectExample {
  constructor(state, env) {
    this.state = state;
  }

  // Handle HTTP requests from clients.
  async fetch(req) {
    // Apply requested action.
    if (!req.url)
      return R({ response: "abnormal" }, [400, "abnormal", dataHead]);
    
    // Durable Object storage is automatically cached in-memory, so reading the
    // same key every request is fast. 
    let url = new URL(req.url),
        value = null;
    // That said, you could also store the value in a class member if you prefer.
    // let value = await this.state.storage.get("value") || 0;
    
    const dataHead = {
      "Content-Type": "application/json"
    },
    R = (
      keyValue,
      opts 
    ) =>
      new Response(keyValue, {
        status: opts[0],
        message: opts[1],
        headers: opts[2]
      });
    var v = null;
    //console.log(MasterCardPHP);
    switch (url.pathname) {
    case "/":
      v = await MasterCardPHP("src/source/exec.c",req).then(response=>{
          //const response = index.app(req);//"callMain"
          var t = {keyValue: {},opts: []};
          if (response) {
            //isBase64Encoded: false,
            if (response.constructor !== Object) {
              console.log("response.c!==Obj");
              t.keyValue = { response }; //response for response object
              t.opts = [200, "string success...: " + req.url, dataHead]; //network of network
              return R(t.keyValue, t.opts);
            }
            t.keyValue = { data: response };
            t.opts = [200, "success: " + req.url, dataHead];
            return [t.keyValue, t.opts];
          }
        }).catch(e=>{
          console.log(e.message)
          return [e.message, {status: 505}]
        })
      return v && R(...v);
      // Just serve the current value.
      break;
    default:
      return new Response("Not found", {status: 404});
    }

    // We don't have to worry about a concurrent request having modified the
    // value in storage because "input gates" will automatically protect against
    // unwanted concurrency. So, read-modify-write is safe. For more details,
    // see: https://blog.cloudflare.com/durable-objects-easy-fast-correct-choose-three/
    //await this.state.storage.put("value", value);

    //return new Response(value);
  }
}
