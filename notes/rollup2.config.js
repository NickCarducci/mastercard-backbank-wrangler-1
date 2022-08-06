import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser'
import commonjs from "@rollup/plugin-commonjs";
//import autoExternal from "rollup-plugin-auto-external";//https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
import nodeResolve from "@rollup/plugin-node-resolve";
import nodePolyfills from 'rollup-plugin-polyfill-node';
//import globals from 'rollup-plugin-node-globals';
//import builtins from 'rollup-plugin-node-builtins';
//import webworkify from 'rollup-plugin-webworkify'
//import replace from '@rollup/plugin-replace';
export default {
  inlineDynamicImports:true,
  input: "src/shim.mjs",
  output: {
    exports: 'named',
    //name: "app",
    strict: false,
    file: "dist/shim.mjs",
    format: "es",
    sourcemap: true
  },
  plugins: [
     //webworkify(),
    nodePolyfills( "fs"/* options */ ),
    //autoExternal(),
    nodeResolve({
      preferBuiltins: false,
      browser: true,
      //only: [/^\.{0,2}\//],
      //extensions: [".js", ".ts"],
      //mainFields: ["module", "main"]
    }),
    commonjs({
      //include: ["node_modules/**"],
      //exclude: ["notes/**/*","node_modules/process-es6/**"]
    }),
    /*babel({
      exclude: 'node_modules/**',
    }),*/
    /*replace({
      exclude: 'src/browserii.js',
      //ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),*/
    json(),
    terser(),
    //globals(),
    //builtins()
  ]
};
