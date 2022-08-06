//importScripts('./require.js');
//https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js
//import m from "./browserii.js.map"; //'webworkify';
//import * as browserify from "browserify";
/*import { createRequire } from "module";
const require = createRequire(import.meta.url);
const browserify = require("browserify");*/
//const locs = require("mastercard-locations");
//const places = require("mastercard-places");
//const crs = require("cors");
//const work = require('webworkify');
//import module from "./browserii.js";
//const { locs, places, crs } = module.Window(); //Window.sourcesContent();

export class DurableObjectExample {
  constructor(el, env) {
    console.log(el.textContent, "- From the example module");
    this.el = el;
    this.env = env;
    this.el.blockConcurrencyWhile(async () => {
      let stored = await this.el.storage.get("value");
      // After initialization, future reads do not need to access storage.
      this.value = stored || 0;
      //this.modules = work(this)??
      this.el.storage = work(import("./browseri.js"))
    });
    
    /*"./browserii.js", {
      entry: "./browseri.js",
      output: "./browserii.js"
    } best guess https://stackoverflow.com/questions/34752771/how-can-i-get-browserifys-bundle-function-to-emit-an-end-event*/
    browserify()
      .add("./browseri.js")
      .bundle(function (err) {
        if (err) throw err;
      })
    /*(path,opts) => import(path).then((module) => 
    //const { locs, places, crs } = module.Window()
    this.modules = { ...module.Window() })*/
      .pipe(fs.createWriteStream("./browserii.js")); 
    
    import("./browserii.js").then((module) => {
      //const { locs, places, crs } = module.Window()
      this.modules = { ...module.Window() };
    });
  }
  /*static toRouteParams(pathname) {
    const match = pathname.match(
      /^\/((client)|(server))\/([\w-]+)\/([a-f0-9]{15})\/ws$/
    )
    if (!match) return { match: false }
    const [_, __, client, server, sitename, tree_id] = match
    return { match: true, client, server, sitename, tree_id }
  }*/
  //'86 await: simply by omitting the await for the POST request. The request will complete before the Durable Object exits
  async fetch(req, env) {
    if (!this.modules) {
      return new Response(
        {},
        {
          status: "400",
          message: "not ready for use",
          headers: dataHead
        }
      );
    } else {
      //const { locs, places, crs } = this.modules; //Window.sourcesContent();
      const dataHead = {
        "Content-Type": "application/json"
      }; 
      
      /*var require = null;
        return await import("./require.js").then(async obj => {
          require = await obj.require
          if (!require) {
            return new Response(
              {},
              {
                status: "400",
                message: "./require.js not working, is dev error",
                headers: dataHead
              }
            );
          } else {
            require.config({
              baseUrl:
                "src" */
      
      var iMCard = null,
        mc = null;
      const initializeMCard = () => {
        if (!iMCard) {
          console.log("initializing mastercard api");
          mc = locs.MasterCardAPI;
          iMCard = true;
          mc.init({
            sandbox: secrets.NODE_ENV !== "production",
            authentication: new mc.OAuth(
              secrets.MASTERCARD_CONSUMER_KEY,
              Buffer.from(secrets.MASTERCARD_P12_BINARY, "base64"),
              "keyalias",
              "keystorepassword"
            )
          });
        }
      };
      const mastercardRoute = async (req, func) => {
        const cb = (error, data) => (error ? error : data);
        initializeMCard();
        let rs = null;
        if (func === "getAtms") {
          const {
            PageLength, //"5"
            PostalCode, //"11101"
            PageOffset //"0"
          } = req.body; //query
          rs = await locs.ATMLocations.query(
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
          rs = await places.MerchantPointOfInterest.create(q, cb);
        } else if (func === "getNames") {
          rs = await places.MerchantCategoryCodes.query({}, cb);
        } else if (func === "getTypes") {
          rs = await places.MerchantIndustries.query({}, cb);
        }
        return rs && rs;
      };
      const cors = crs({
        origin: true,
        allowedHeaders: [
          "Access-Control-Allow-Origin",
          "Access-Control-Allow-Methods",
          "Content-Type",
          "Origin",
          "X-Requested-With",
          "Accept"
        ],
        methods: ["POST", "OPTIONS"],
        credentials: true
      });
      //return async handleRequest(request)async (req) => {
      var origin = req.get("Origin");
      var allowedOrigins = ["https://vau.money", "https://jwi5k.csb.app"];
      if (allowedOrigins.indexOf(origin) > -1) {
        // Origin Allowed!!
        if (req.method === "OPTIONS") {
          // Method accepted for next request
          return new Response(
            {},
            {
              status: "200",
              statusText:
                "successful header check for POST process: " + req.url,
              headers: {
                ...dataHead,
                "Access-Control-Allow-Methods": "POST"
              }
            }
          );
        } else {
          let rs = null;
          if (req.url === "/deposit") {
            rs = await mastercardRoute(req, "getAtms");
          } else if (req.url === "/merchant_names") {
            rs = await mastercardRoute(req, "getNames");
          } else if (req.url === "/merchant_types") {
            rs = await mastercardRoute(req, "getTypes");
          } else if (req.url === "/merchants") {
            rs = await mastercardRoute(req, "getMerchants");
          }
          if (rs) {
            //isBase64Encoded: false,

            return new Response(
              {
                data: rs
              },
              {
                status: "200",
                message: "success: " + req.url,
                headers: dataHead
              }
            );
          } else {
            return new Response(
              {},
              {
                status: "500",
                message: "no success doof: " + req.url,
                headers: dataHead
              }
            );
          }
        }
      } else
        return new Response(
          {},
          {
            status: "400",
            message: "no access for this origin: " + origin,
            headers: dataHead
          }
        );
    }
  }
}
/*addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})*/

/*export class Stripe {
    checkout: typeof checkout
    constructor(
        stripe_secret: string,
        params?: {
            apiVersion?: string
            fetch?: Function
            userAgent?: string
        },
    ) {
        let client = new HTTPClient(
            stripe_secret,
            params?.apiVersion,
            params?.userAgent,
            params?.fetch,
        )
        this.checkout = checkout
        this.checkout.client = client.request
    }
}*/
