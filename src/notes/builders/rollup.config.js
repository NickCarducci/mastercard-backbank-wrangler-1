/*import * as locs from "mastercard-locations";
import * as places from "mastercard-places";
import * as crs from "cors";*/
import { rollup, watch } from "rollup";
import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";
import legacy from '@rollup/plugin-legacy';
import internal from 'rollup-plugin-internal';
import autoExternal from 'rollup-plugin-auto-external';
//import { generate } from 'astring';
//import multiInput from 'rollup-plugin-multi-input';
//const locs = require("mastercard-locations");
//const places = require("mastercard-places");
//const crs = require("cors");
/*const { rollup, watch } = require("rollup");
const path = require("path");
const commonjs = require("@rollup/plugin-commonjs");
const { terser } = require("rollup-plugin-terser");
const nodeResolve = require("@rollup/plugin-node-resolve");
const legacy = require('@rollup/plugin-legacy');
//import { generate } from 'astring';
const multiInput = require('rollup-plugin-multi-input');*/

/*const presets = [
[
  "@babel/preset-env",
  {
    targets: 'defaults',
    //"esmodules": true,
    //modules: "auto"
  }
],
//"@babel/preset-react"
];*/
const plugins = [
//multiInput(),
nodeResolve({
  //browser: true
      jsnext: true
}),
legacy({  '.././browserii.js': 'Window' }),
commonjs({
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
}),
  autoExternal(),
internal(['cors', 'mastercard-locations', 'mastercard-places']),
terser()
];
/*const inputOptions = {
//external: ['cors', 'mastercard-locations','mastercard-places'],
input: "src/browseri.js",//[cors,places,locs],
plugins
};*/
const output = {
//banner,footer,
name: "Window",//no default
strict: false,
file: ".././browserii.js",
format: "iife",//"umd",//cannot call a namespace/no default, "Window"//"es",
sourcemap: false,
//globals:{"Window":this.storage}
};

export default {
  inlineDynamicImports:true,
    //external: Object.keys(dependencies),
  /*manualChunks: {
    'vendor': ['mastercard-locations', 'mastercard-places', 'cors']
  },*/
  output,
  input: ".././browseri.js",//[crs,places,locs],
  plugins
};

/*
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
//const ast = event.result.cache.modules.ast//.body

//const esm = generate(ast)
//this.el.storage.put("esm", JSON.stringify(esm)) 

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
.catch((err) => console.log("rollup.rollup error", err.message));*/
