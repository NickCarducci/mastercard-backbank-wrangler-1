//rollupCommonToUMD.js
import { rollup, watch } from "rollup";
import externalGlobals from "rollup-plugin-external-globals";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from '@rollup/plugin-node-resolve'
import nodePoly from "rollup-plugin-polyfill-node";
//import require from "../dependencies/shim.mjs";
//import virtual from '@rollup/plugin-virtual';
//import alias from "@rollup/plugin-alias";
/*
if (typeof global === 'undefined')
  globalThis.global = globalThis
*/
const pages = [
  {
    globals:{
     //"./dependencies/shim.js" "require",
     "mastercard-locations":"locs",
      "mastercard-places":"places",
       "cors":"crs" 
    },
    name:"app",
    format: "amd",
    sourcemap: false,
    strict: false,
    banner:"import * as Required from '../src/require.js';const {require,define} = Required;",//"const app = () => ",
    /*footer: `
      export default (() => {
        if (typeof globalThis === 'object') return;
        Object.prototype.__defineGetter__('window', () => this);
        window.globalThis = window;
        delete Object.prototype.window;
      }());

      console.log(globalThis);
    `,*/
    file: "dist/built.mjs",
    //footer: "globalThis"
    footer: "export default app"
  }
];
const manifest = {
  input: "src/dependencies/index.mjs",
  plugins: [
    /*virtual({
      "./require.js": `
        function require(app) {
          const module = { exports: {} };//const is shallow?
          ((module, exports) => {
            //function app() {locs,places,crs}
            exports = app;//exports != module.exports && export an empty default object (const, page)
            module.exports = app;//export app != default object (const, page)
          })(module, module.exports);
          return module.exports;
        }
        export { require as default }
      `,
      //require: `export default 'na na na na na'`,
      //'src/robin.js': `export default 'batmannnnn'`
    }),
    alias({
      entries: [
        { find: "require", replacement: "./require.js"},//"src/dependencies/shim.mjs" },
        //{ find: 'batman-1.0.0', replacement: './joker-1.5.0' }
      ]
    }),*/
    nodePoly(), 
    nodeResolve({browser:true,preferBuiltins:true}),
           
    /*externalGlobals({
      this: "globalThis"
    }),*/
            /*commonjs({
              
    include: 'node_modules/**'
            })*/
           ],
  //external: ["globalThis"]
};

const watchable = {
  ...manifest,
  output: pages,
  watch: {
    buildDelay: 5000,
    chokidar: {},
    clearScreen: true,
    skipWrite: false,
    exclude: ["node_modules/**/*", "notes/**/*", "src/notes/**/*"],
    include: "src/**/*",
  },
  onwarn: (message) => {
    if (message.code === "UNRESOLVED_IMPORT" && message.source === "cors") {
      throw new Error(`Could not resolved "cors" module`);
    } else if (
      message.code === "UNRESOLVED_IMPORT" &&
      message.source === "mastercard-places"
    ) {
      throw new Error(`Could not resolved "mastercard-places" module`);
    } else if (
      message.code === "UNRESOLVED_IMPORT" &&
      message.source === "mastercard-locations"
    ) {
      throw new Error(`Could not resolved "mastercard-locations" module`);
    } else {
      throw new Error(JSON.stringify(message));
    }
  },
  inlineDynamicImports: true
};
console.log("PLUGINS PASSED");
const watcher = watch(watchable);
console.log("WATCHER INITIALIZED");
watcher.on("event", (event) => {
  if (event.code === "BUNDLE_START") {
  } else if (event.code === "START") {
  } else if (event.code === "END") {
    watcher.close();
  } else if (event.code === "ERROR") {
  } else if (event.code === "BUNDLE_END") {
  }
  if (event.result) {
    const ast = event.result.cache.modules[0].ast; //.body
    console.log(ast, " is Abstract Syntax Tree of dependencies");
    event.result.close();
  }
});

rollup(manifest)
  .then(async (bundle) => {
    console.log(Object.keys(bundle), " is bundle");
    pages.forEach(async (output) => await bundle.write(output));
   // return hydrate(bundle)
  })
  .catch((err) => console.log("rollup.rollup error", err.message));

/*
//import json from '@rollup/plugin-json';
//import commonjs from "@rollup/plugin-commonjs";
const output = {
  banner:"const app = () => ",
  footer:"export default app",
  strict: false,
  file: "src/built.js",
  format: "iife", //"umd",//cannot call a namespace/no default, "Window"//"es",
  sourcemap: false
  //name: "Window",//umd only - no default
  //globals:{"Window":this.storage}
};

const plugins = [
  //nodeResolve({ preferBuiltins: false, jsnext: true }),
  //json(),
  nodePoly(),
  nodeResolve(),
  commonjs({
    //include: 'node_modules/**', // Default: undefined
  })
];
const inputOptions = {
  //external: ['cors', 'mastercard-locations','mastercard-places'],
  input: "src/dependencies/shim.mjs", //[crs,places,locs],
  plugins
};
const watchable = {
  ...inputOptions,
  output: [output],
  watch: {
    buildDelay: 5000,
    chokidar: {},
    clearScreen: true,
    skipWrite: false,
    exclude: ["node_modules/** /*", "notes/** /*", "src/builders/** /*"],
    include: "src/** /*"
  },
  onwarn:()=>{},
  inlineDynamicImports: true
  //external: Object.keys(dependencies),
  manualChunks: {
    'vendor': ['mastercard-locations', 'mastercard-places', 'cors']
  },
};
const watcher = watch(watchable);
console.log("WATCHER INITIALIZED");
watcher.on("event", (event) => { 
  if (event.result) {
    //console.log(event.result.cache.modules[0], " is event.result.cache.modules[0]");
    const ast = event.result.cache.modules[0].ast; //.body
    console.log(ast, " is Abstract Syntax Tree of dependencies");
    //const esm = generate(ast)
    //this.el.storage.put("esm", JSON.stringify(esm))
    event.result.close();
  }
*/
