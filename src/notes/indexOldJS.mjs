//import requir from "./requirecd";
//import Window from "./app"
//const {locs, places} = Window;

const locs = require("mastercard-locations");
const places = require("mastercard-places");
var iMCard = null,
  mc = null;
//const requi = requir();//, 
  //locs = requi("mastercard-locations"),
  //places = requi("mastercard-places");
//const { locs, places, crs } = thi//.value//.default(); //Window() //thi.modules; //Window.sourcesContent();

const initializeMCard = () =>
    !iMCard &&
    console.log("initializing mastercard api") &&
    (mc = locs.MasterCardAPI) &&
    (iMCard = true) &&
    mc.init({
      sandbox: secrets.NODE_ENV !== "production",
      authentication: new mc.OAuth(
        secrets.MASTERCARD_CONSUMER_KEY,
        Buffer.from(secrets.MASTERCARD_P12_BINARY, "base64"),
        "keyalias",
        "keystorepassword"
      )
    }),
  mastercardRoute = async (req, func) => {
    const cb = (error, data) => (error ? error : data);
    initializeMCard();
    let response = null;
    if (func === "getAtms") {
      const {
        PageLength, //"5"
        PostalCode, //"11101"
        PageOffset //"0"
      } = req.body; //query
      response = await locs.ATMLocations.query(
        {
          PageLength,
          PostalCode,
          PageOffset
        },
        cb
      );
    } else if (func === "getMerchants") {
      const { countryCode, latitude, longitude, distance } = req.body; //query
      const q = {
        pageOffset: 0,
        pageLength: 10,
        radiusSearch: "true",
        unit: "km",
        distance,
        place: {
          countryCode,
          latitude,
          longitude
        }
      };
      response = await places.MerchantPointOfInterest.create(q, cb);
    } else if (func === "getNames") {
      response = await places.MerchantCategoryCodes.query({}, cb);
    } else if (func === "getTypes") {
      response = await places.MerchantIndustries.query({}, cb);
    }
    return response ? response : [func, requir];
  };

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
    this.handle = async (req) => {
      if (!req.url)
        return R({ response: "abnormal" }, [400, "abnormal", dataHead]);
      console.log(
        "req.url" + req.url
      ); /*console.log(
              "gotten/(-piped) REQUIRE_CLASS_DURABLE_OBJECT (requirer) :",
              requir
            );*/ //https://developers.cloudflare.com/workers/platform/compatibility-dates/ //.then((R) => thi.handle(R, req)); // Create a URL to give to the Worker constructor //const url = URL.createObjectURL(blob); //reader.readAsArrayBuffer(requi); //reader.onloadend = () => (requir = reader.result); //const requirer = await requir.fetch(req); //.then(async (res) => await res.text()); //console.log("Fetched REQUIRE_CLASS_DURABLE_OBJECT (requirer) :", requir); //const { requir } = Require();//"nutritious but not delicious."
      //new Int32Array(requ)
      /*var readable = req.body.getReader(/*{ mode: "byob" }*), //new FileReader(),
              // Create a blob containing the worker code
              //const blob = new Blob(requi, { type: "text/javascript" });
              stream = "",
              charsReceived = 0,
              requir = await readable.read().then(async function processText(r) {
                // done = true, if the stream has already given you all its data.
                // value = some_data. Always undefined when done is true.
                if (r.done) {
                  console.log("Stream complete : ", stream);
                  const product = new Uint8Array(stream)
                    .buffer; /*new TextDecoder("utf-8").decode(
                    new Uint8Array(stream)
                  );*/
      /* String.fromCharCode.apply(
                    null,
                    new Uint8Array(stream) /*Uint8Array,Int32Array*
              );*
                  console.log("Stream complete : ", product);
                  return product;
                }
                if (r.value) {
                  charsReceived += r.value.length; // 'value' for fetch streams is a Uint8Array
                  console.log(
                    `Total (${charsReceived}) Uint8Array ck = (${r.value})++`
                  );
                  stream += r.value;
                }
                return await readable.read().then(processText); // Read some more, and call thi function again
              });*/
      console.log("locs", locs, "requi", requi);
      let response = null;
      if (req.url === "/deposit") {
        response = await mastercardRoute(req, "getAtms");
      } else if (req.url === "/merchant_names") {
        response = await mastercardRoute(req, "getNames");
      } else if (req.url === "/merchant_types") {
        response = await mastercardRoute(req, "getTypes");
      } else if (req.url === "/merchants") {
        response = await mastercardRoute(req, "getMerchants");
      }
      /*return new Response(`{ok: true,data: ${r} }`);*/

      var t = {};
      t.obj = {};
      t.opts = [];
      /*if (!response) {
        //doof
        console.log("!response");
        t.obj = { error: requir };
        const url = req.path && req.path.split("://");
        t.opts = [
          400,
          url ? url[1] + JSON.stringify(requir) : req.path,
          dataHead
        ];
        return R(t.obj, t.opts);
      }*/
      if (response) {
        //isBase64Encoded: false,
        if (response.constructor !== Object) {
          console.log("response.c!==Obj");
          t.obj = { response }; //response for response object
          t.opts = [200, "string success...: " + req.url, dataHead]; //network of network
          return R(t.obj, t.opts);
        }
        t.obj = { data: response };
        t.opts = [200, "success: " + req.url, dataHead];
        return R(t.obj, t.opts);
      }
    };
    (this.el = el) &&
      (this.env = env) &&
      this.el.blockConcurrencyWhile(() => {
        // let stored = this.el.storage.get("esm"); //Read requests	100,000 / day, ($free)
        // After initialization, future reads do not need to access storage.
        //this.value = stored || 0;
        /* rollup(manifest)
                .then( (bundle) => {
                  console.log(Object.keys(bundle), " is bundle");
                  pages.forEach( (output) =>  bundle.write(output));
                thi.value = bundle
                 // return hydrate(bundle)
                })
                .catch((err) => console.log("rollup.rollup error", err.message));*/
        //thi.el.storage.put("esm", product);
      });
    /*thi.makeRequire = async (req) =>
          await ((eo) => eo.get(eo.idFromName(new URL(req.url))))(
            env.REQUIRE_CLASS_DURABLE_OBJECT
          );*/
  }

  //Omit  for syncronous defer, -ish
  async fetch(req) {
    if (false /*!thi.value*/) {
      //thi.modules) {
      return new Response(`{}`, {
        status: "400",
        message: "not ready for use",
        statusText: "still retrieving {Key: Value} storage: " + req.url,
        headers: { "Content-Type": "application/json" }
      });
      //const requir =  makeRequire(req, env);
    } else {
      //console.log("thi :", thi);
      //const requirer = thi.makeRequire(req);
      //console.log("requirer: ", requirer);
      return await this.handle(req);
      // await thi.makeRequire(req) //new Promise((resolve) => requirer && resolve(requirer)) // thi.makeRequire(req)
      //.then(async (r) => await r.body.blob())
      /*.then(
                async (requireObj) =>
                  /*{
                  var reader = new FileReader(),
                    result;
                  reader.readAsDataURL(requireAsBlob);
                  reader.onloadend = async () =>
                    (result = await thi.handle(reader.result, req));
                  return new Promise((resolve) => result && resolve(result));
                }* await thi.handle(
                    requireObj, //requireAsBlob,
                    req
                  )*/
      /*let { readable, writable } = new TransformStream(); // Create an identity TransformStream (a.k.a. a pipe).
                // result = "", //The readable side will become our new response body.
                //charsReceived = 0;
                res.body.pipeTo(writable); // Start pumping the body. NOTE: No await!
                //return new Response(readable, res); //deliver running ReadableStream Running & Transformed to writable pipe
      
                return thi.handle(
                  readable,
                  req
                );*/
      /*await readable
                  .read()
                  .then(async function processText({ done, value }) {
                    // done = true, if the stream has already given you all its data.
                    // value = some_data. Always undefined when done is true.
                    if (done) {
                      console.log("Stream complete : ", result);
                      const product = String.fromCharCode.apply(
                        null,
                        Array(result) /*Uint8Array*
                      );
                      console.log("Stream complete : ", product);
                      return product;
                    }
                    charsReceived += value.length; // 'value' for fetch streams is a Uint8Array
                    const chunk = value;
                    console.log(`Total (${charsReceived}) Uint8Array = (${chunk})++`);
                    result += chunk;
                    return await readable.read().then(processText); // Read some more, and call thi function again
                  })
                  .then((R) => thi.handle(R, req));*/
    }
    /*.catch(
              (err) =>
                new Response(JSON.stringify(`{thenError:${err.message}}`), {
                  status: "400",
                  message: err.message,
                  headers: dataHead
                })
            );*/
  }
}
//"smart fight, accross the board, we want improvement," - school is IN!
/*
  // To accept the WebSocket request, we create a WebSocketPair (which is like a socketpair,
  // i.e. two WebSockets that talk to each other), we return one end of the pair in the
  // response, and we operate when the other end. Note that thi API is not part of the
  // Fetch API standard; unfortunately, the Fetch API / Service Workers specs do not define
  // any way to act as a WebSocket server today.
  let pair = new WebSocketPair();
  // We're going to take pair[1] as our end, and return pair[0] to the client.
  await thi.handleSession(pair[1]);
  // Now we return the other end of the pair to the client.
  return new Response(null, { status: 101, webSocket: pair[0] });
  // handleSession() implements our WebSocket-based chat protocol.
  handleSession = async (webSocket) => {
    // Accept our end of the WebSocket. This tells the runtime that we'll be terminating the
    // WebSocket in JavaScript, not sending it elsewhere.
    webSocket.accept();
    webSocket.addEventListener("message", async (msg) => {
      try {
        //https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/message_event
        webSocket.send(msg.data);
        webSocket.close(1011, "finished");
      } catch (e) {
        console.log(e);
      }
    });
    // On "close" and "error" events, remove the WebSocket from the sessions list and broadcast
    // a quit message.
    let closeOrErrorHandler = (e) => console.log("closeOrErrorHandler", e);
    webSocket.addEventListener("close", closeOrErrorHandler);
    webSocket.addEventListener("error", closeOrErrorHandler);
  };*/
