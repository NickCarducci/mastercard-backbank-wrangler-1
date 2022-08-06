export {DurableObjectExample} from ".index"
  
export default {
  async fetch(request, env /*, ctx*/) {
    //Response class must be a promise
    try {
      if (request.method === "OPTIONS")
        return new Response(`preflight response for POST`, {
          status: 200,
          message: `preflight response for POST`,
          headers: {
            "Access-Control-Allow-Headers": [
              //"Access-Control-Allow-Origin",
              "Access-Control-Allow-Methods",
              "Content-Type"
              //"Origin",
              //"X-Requested-With",
              //"Accept"
            ],
            "Access-Control-Allow-Methods": ["POST", "OPTIONS"]
          }
        });
      return await noException(request, env);
      // wrap the body of your callback in a try/catch block to ensure it cannot throw an exception.
      // is return, "the body?"
    } catch (e) {
      return new Response(e.message);
    }
  }
};
const noaccess = (origin) =>
  new Response(
    JSON.stringify(`{error:${"no access for this origin- " + origin}}`),
    {
      status: 400,
      message: "no access for this origin: " + origin
      //headers: { "Content-Type": "application/json" }
    }
  );
async function noException(req, env) {
  // key => Object ID; return new Response(JSON.stringify(backbank));
  // boot instance, if necessary //https://<worker-name>.<your-namespace>.workers.dev/
  //https://linc.sh/blog/durable-objects-in-production
  //const clientId = request.headers.get("cf-connecting-ip");
  const urlObject = new URL(req.url); //.pathname;//path
  var origin = urlObject.origin; // request.headers.get("Origin");
  var allowedOrigins = [
    "https://vau.money",
    "https://jwi5k.csb.app",
    "https://mastercard-backbank.backbank.workers.dev"
  ];
  if (allowedOrigins.indexOf(origin) === -1) return noaccess(origin);
  console.log("env", env, origin, ": making example class durable object");
  return await ((eo) => eo.get(eo.idFromName(urlObject.href)))(
    env.EXAMPLE_CLASS_DURABLE_OBJECT
  )
    .fetch(
      req /*, {
      headers: {
        "Content-Type": "application/octet-stream" //"application/json"
      },
      method: "POST",
      body: requir.arrayBuffer()
    }*/
    ) // Forward the current HTTP request to it
    .then(async (res) => {
      console.log("response from worker object", res);
      return res; //await res.json();
    })
    .then((r) => {
      console.log("fetched EXAMPLE_CLASS_DURABLE_OBJECT : ", r);
      /*return new Response(`{ok: true,data: ${r} }`);*/
      const dataHead = {
          "Content-Type": "application/json"
        },
        R = (ok, keyValue, opts) => {
          //`{\nsuccess: ${ok},\n${keyValue.success=ok}\n}`
          const R = JSON.stringify({ success: ok, ...keyValue });
          return new Response(R, {
            status: opts[0],
            message: opts[1],
            headers: opts[2]
          });
        },
        Y = (m) => (() => true)(m);
      var t = {};
      Y((t.opts = [])) && (t.obj = {});
      if (!r) {
        t.opts = [400, "no Response from durable object chain", dataHead];
        t.obj = { data: {} };
        return R(false, t.obj, t.opts);
      }
      if (!r.data) {
        t.opts = [
          r.status,
          "no data on Response: " + r.statusText ? r.statusText : r.message,
          dataHead
        ];
        t.obj = { response: r };
        return R(false, t.obj, t.opts);
      }
      t.opts = [200, `success: ${req.url}`, dataHead];
      t.obj = { true: JSON.stringify(r.data) };
      return R(true, t.obj, t.opts);
}
