//rollupCommonToUMD.js
import { rollup, watch } from "rollup";
//import json from '@rollup/plugin-json';
//import commonjs from "@rollup/plugin-commonjs";
//import nodeResolve from "@rollup/plugin-node-resolve";
import nodePoly from 'rollup-plugin-polyfill-node';

const output = {
  //banner:"const app = () => ",
  //footer:"export default app",
  name: "Window",//no default
  strict: false,
  file: "dist/index.js",
  format: "umd", //"iife",//cannot call a namespace/no default, "Window"//"es",
  sourcemap: false
  //globals:{"Window":this.storage}
};

const plugins = [
  //nodeResolve({ preferBuiltins: false, jsnext: true }),
  //json(),
  nodePoly(),
  //nodeResolve(),
  /*commonjs({
    //include: 'node_modules/**', // Default: undefined
  }),*/
];

const inputOptions = {
  //external: ['cors', 'mastercard-locations','mastercard-places'],
  input: "src", //[crs,places,locs],
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
    exclude: ["node_modules/**/*", "notes/**/*", "src/builders/**/*"],
    include: "src/**/*"
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
    //console.log(event.result.cache.modules[0], " is event.result.cache.modules[0]");
    const ast = event.result.cache.modules[0].ast; //.body
    console.log(ast, " is Abstract Syntax Tree");
    //const esm = generate(ast)
    //this.el.storage.put("esm", JSON.stringify(esm))
    event.result.close();
  }
});

rollup(inputOptions)
  .then(async (bundle) => {
    console.log(Object.keys(bundle), " is bundle");
    await bundle.write(output);
  })
  .catch((err) => console.log("rollup.rollup error", err.message));
