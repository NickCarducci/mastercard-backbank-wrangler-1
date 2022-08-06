import MasterCardPHP from "./babelphp.mjs";

export class DurableObjectExample {
  constructor(el, env) {
    /*console.log(
      "Example headers, ev's :",
      JSON.stringify(el),
      JSON.stringify(env)
    );*/ //el.textContent
    const dataHead = {
        "Content-Type": "application/json"
      },
      R = (
        keyValue,
        obj /*{
      return {
        [keyValue[0]]: keyValue[1],
        status: obj[0],
        message: obj[1],
        headers: obj[2]
      };
    };*/
      ) =>
        new Response(keyValue, {
          status: obj[0],
          message: obj[1],
          headers: obj[2]
        });
    (this.el = el) &&
      (this.env = env) &&
      this.el.blockConcurrencyWhile(() => {
        // let stored = this.el.storage.get("esm"); //Read requests	100,000 / day, ($free)
        // After initialization, future reads do not need to access storage.
        //this.value = stored || 0;
        //thi.el.storage.put("esm", product);
      });
  }

  //Omit  for syncronous defer, -ish
  async fetch(req) {
    if (false /*!thi.value*/) {
      return new Response(`{}`, {
        status: "400",
        message: "not ready for use",
        statusText: "still retrieving {Key: Value} storage: " + req.url,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return await MasterCardPHP(req);
    }
  }
}
