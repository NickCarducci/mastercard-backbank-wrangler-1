/*import * as locs from "mastercard-locations";
import * as places from "mastercard-places";
import * as crs from "cors";*/
import { rollup, watch } from "rollup";
import path from "path";
import builtins from 'rollup-plugin-node-builtins';
//import commonjs from "@rollup/plugin-commonjs";
//import { terser } from "rollup-plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";
//import legacy from '@rollup/plugin-legacy';
//import internal from 'rollup-plugin-internal';//no node_modules/
import autoExternal from 'rollup-plugin-auto-external';
//const locs = require("mastercard-locations");
//const places = require("mastercard-places");
//const crs = require("cors");

const plugins = [
      builtins(),
nodeResolve({preferBuiltins: false,
      jsnext: true
}),
//legacy({  './browserii.js': 'Window' }),
/*commonjs({
  // non-CommonJS modules will be ignored, but you can also
  // specifically include/exclude files
  include: ["node_modules/**"],
  exclude: ["node_modules/process-es6/**","notes/**","src/builders/**"],
  dynamicRequireTargets: [
    // include using a glob pattern (either a string or an array of strings)
    'node_modules/rollup/dist/shared/*.js',

    // exclude files that are known to not be required dynamically, this allows for better optimizations
    '!node_modules/logform/index.js',
    '!node_modules/logform/format.js',
    '!node_modules/logform/levels.js',
    '!node_modules/logform/browser.js'
  ],//https://stackoverflow.com/a/62113284/11711280

  // if true then uses of `global` won't be dealt with by this plugin
  ignoreGlobal: false, // Default: false

  // if false then skip sourceMap generation for CommonJS modules
  sourceMap: false // Default: true
}),*/
  //autoExternal(),
//internal(['cors', 'mastercard-locations', 'mastercard-places']),
//terser()
];

const output = {
//banner,footer,
name: "Window",//no default
strict: false,
file: "./browserii.js",
format: "iife",//"umd",//cannot call a namespace/no default, "Window"//"es",
sourcemap: false,
//globals:{"Window":this.storage}
};

const inputOptions = {
  //external: ['cors', 'mastercard-locations','mastercard-places'],
  input: "src/browseri.js",//[crs,places,locs],
  plugins
};
const watchOptions = {
  ...inputOptions,
  output: [output],
  watch: {
    buildDelay: 5000,
    chokidar: {},
    clearScreen: true,
    skipWrite: false,
    exclude: ["node_modules/**/*","notes/**/*","src/builders/**/*"],
    include: "src/**/*"
  },
      onwarn: (message) =>{
    if (message.code === 'UNRESOLVED_IMPORT' && message.source === 'cors') {
      throw new Error(`Could not resolved "cors" module`)
    }else 
    if (message.code === 'UNRESOLVED_IMPORT' && message.source === 'mastercard-places') {
      throw new Error(`Could not resolved "mastercard-places" module`)
    }else 
    if (message.code === 'UNRESOLVED_IMPORT' && message.source === 'mastercard-locations') {
      throw new Error(`Could not resolved "mastercard-locations" module`)
    }else {
      throw new Error(JSON.stringify(message))
    }
  },
  inlineDynamicImports:true,
    //external: Object.keys(dependencies),
  /*manualChunks: {
    'vendor': ['mastercard-locations', 'mastercard-places', 'cors']
  },*/
};
console.log("PLUGINS PASSED");
const watcher = watch(watchOptions);
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
        const ast = event.result.cache.modules.ast//.body
        console.log(ast, " is Abstract Syntax Tree")
      //const esm = generate(ast)
      //this.el.storage.put("esm", JSON.stringify(esm)) 
    event.result.close();
  }
});

rollup(inputOptions)
  .then(async (bundle) => {
      console.log(bundle, " is bundle")
    await bundle.write(output);
  })
  .catch((err) => console.log("rollup.rollup error", err.message));
