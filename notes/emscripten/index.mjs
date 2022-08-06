// import the emscripten glue code
import emscripten from './build/module.js'

export class DurableObjectExample {
  constructor(state, env) {
    this.state = state;
  }

  // Handle HTTP requests from clients.
  async fetch(request) {
    // Apply requested action.
    if (!req.url)
      return R({ response: "abnormal" }, [400, "abnormal", dataHead]);
    
    // Durable Object storage is automatically cached in-memory, so reading the
    // same key every request is fast. 
    let url = new URL(request.url),
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
    
    switch (url.pathname) {
    case "/":
      // '.wasm' as global scope-bound module of WASM instance, from emscripten('instantiateWasm')
      let MasterCardPHP = new Promise((resolve, reject) => {
        emscripten({
          instantiateWasm(info, receive) {
            let instance = new WebAssembly.Instance(wasm, info)
            receive(instance)
            return instance.exports
          },
        }).then(module => {
          resolve({
            init: module.cwrap('init', 'number', ['number']),
            resize: module.cwrap('resize', 'number', ['number', 'number']),
            module: module,
          })
        })
      })

      const response = MasterCardPHP(request);
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
        return R(t.keyValue, t.opts);
      }
      break;
    default:
      return new Response("Not found", {status: 404});
    }
  }
}
