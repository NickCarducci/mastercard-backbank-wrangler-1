//const work = require('webworkify');
//import * as common from "./browseri.js" //cannot call a namespace
//https://github.com/rollup/rollup/issues/1267#issuecomment-294156756
//import Window from "./browseri.js"
import manifest from "./build/manifest.json";
//`${manifest.default}`
/*import { rollup, watch } from "rollup";
import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
//import nodeResolve from "@rollup/plugin-node-resolve";
//import json from "@rollup/plugin-json";
//import { babel } from "@rollup/plugin-babel";
import legacy from '@rollup/plugin-legacy';
//import replace from '@rollup/plugin-replace';
import { generate } from 'astring';*/

/*
https://github.com/rokid/node-webworker/blob/d6092272f9f49447e067eaa2603585251bc23368/src/bootstrap_worker.js#L133
function __importExternal__(filename, dirname, mName) {
    // for external modules, allows the name without .js
    // TODO(Yorkie): walk for package.json?
    if (!/.js$/.test(filename)) {
      filename += '.js';
    }
    const module = {
      dirname,
      exports: {},
    };

    const func = $compile(filename);
    if (typeof func !== 'function')
      throw new Error(`Cannot find module '${mName}' from ${filename}`);

    func(
      module.exports, 
      module, 
      require.bind(module), // require
      dirname);             // __dirname
    return module.exports;
  }
*/
//const { locs, places, crs } = module.Window(); //Window.sourcesContent();
export class DurableObjectExample {
  constructor(el, env) {
    console.log(el.textContent, "- From the example module");
    this.el = el;
    this.env = env;
    this.el.blockConcurrencyWhile(async () => {
      let stored = await this.el.storage.get("esm");
      // After initialization, future reads do not need to access storage.
      this.value = stored || 0;
      //this.modules = work(this)??

      /*const presets = [
        [
          "@babel/preset-env",
          {
            targets: 'defaults',
            //"esmodules": true,
            modules: "auto"
          }
        ],
        //"@babel/preset-react"
      ];

      const plugins = [
          /*replace({ 
            include: 'src/browseri.js',
            values: {//https://stackoverflow.com/questions/40568580/rollup-js-how-import-a-js-file-not-es6-module-without-any-change-myvarextras
              'module.exports =': 'export default'
            }//like banner, footer
          }),
        nodeResolve({
          browser: true,
          only: [/^\.{0,2}\//],
          extensions: [".js"],
          mainFields: ["module", "main"]
        }),*
        legacy({  'src/browserii.js': 'Window' }),
        commonjs({
          include: ["node_modules/**"],
          exclude: ["node_modules/process-es6/** /*","notes/** /*","src/builders/** /*"]
        }),
        /*babel({
          babelHelpers: "bundled",
          presets,
          exclude: "node_modules/**" // only transpile our source code
        }),
        json(),*
        terser()
      ];
      const inputOptions = {
        external: ['cors', 'mastercard-locations','mastercard-places'],
        input: "src/browseri.js",
        plugins
      };
      const output = {
        //banner,footer,
        name: "Window",
        strict: false,
        file: "src/browserii.js",
        format: "es",//"umd"
        sourcemap: false,
        //globals:{"Window":this.storage
      };
      const watchOptions = {
        ...inputOptions,
        output: [output],
        watch: {
          buildDelay: 5000,
          chokidar: {},
          clearScreen: true,
          skipWrite: false,
          exclude: ["node_modules/** /*","notes/** /*","src/builders/** /*"],
          include: "src/** /*"
        }
      };
      console.log("PLUGINS PASSED");
      const watcher = watch(watchOptions);
      console.log("WATCHER INITIALIZED");
      watcher.on("event", (event) => {
        //event.result.cache.modules.ast.sourceType = "module"
        const ast = event.result.cache.modules.ast//.body
        
        const esm = generate(ast)
      this.el.storage.put("esm", JSON.stringify(esm)) 

        console.log("G-FORCE:rollup: ", JSON.stringify(event));
        if (event.code === "BUNDLE_START") {
        } else if (event.code === "START") {
          //   START        — the watcher is (re)starting
        } else if (event.code === "END") {
          watcher.close();
        } else if (event.code === "ERROR") {
        } else if (event.code === "BUNDLE_END") {
        }
        if (event.result) {
          event.result.close();
        }
      });

      rollup(inputOptions)
        .then(async (bundle) => {
          await bundle.write(output);
        })
        .catch((err) => console.log("rollup.rollup error", err.message));
*/

      //this.el.storage.delete("esm");
      //const worker = work(import("./browseri.js"))
      //this.el.storage.put("esm", JSON.stringify(worker))
      //this.el.storage.put("esm", JSON.stringify(Window))

      /*
      // "Much faster! But (used to be) wrong."
      async function getUniqueNumber() {
        if (this.val === undefined) {
          this.val = await this.storage.get("esm");
        }

        let result = this.val;
        ++this.val;
        this.storage.put("esm", this.val);
        return result;

        // Move a value from "foo" to "bar".
      let val = await this.storage.get("foo");

      this.storage.delete("foo");
      this.storage.put("bar", val);
      // There's no possibility of data loss, because the delete() and the
      // following put() are automatically coalesced into one atomic
      // operation. This is true as long as you do not `await` anything
      // in between.
      
      //https://blog.cloudflare.com/durable-objects-easy-fast-correct-choose-three/
      */
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
    if (!Window){//this.modules) {
      return new Response(
        {},
        {
          status: "400",
          message: "not ready for use",
          headers: dataHead
        }
      );
    } else {
        
      const { locs, places, crs } = manifest.default(); //Window() //this.modules; //Window.sourcesContent();
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
