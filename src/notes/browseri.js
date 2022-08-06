import * as locs from "mastercard-locations";
import * as places from "mastercard-places";
import * as crs from "cors"; 
/*import locs from "./builders/dist/locs";
import places from "./builders/dist/places";
import crs from "./builders/dist/cors");*/
/*import { rollup, watch } from "rollup";
import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";
import legacy from '@rollup/plugin-legacy';
//import { generate } from 'astring';
import multiInput from 'rollup-plugin-multi-input';
import { dependencies } from '.././package.json';

const presets = [
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
multiInput(),
nodeResolve({
  browser: true
}),
legacy({  'src/browserii.js': 'Window' }),
commonjs({
  include: ["node_modules/**"],
  exclude: ["node_modules/process-es6/**","notes/**","src/builders/**"]
}),
terser()
];
const inputOptions = {
//external: ['cors', 'mastercard-locations','mastercard-places'],
input: [cors,places,locs],//"src/browseri.js",
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

//module.exports = 
export default function Window() {
  //https://itnext.io/source-maps-from-top-to-bottom-597bbc07436
  /*const shimmer = (shims:{}) => {
    // http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders
    Object.keys(replacements).forEach(function(key) {
        var val;
        if (replacements[key] === false) {
            val = path.normalize(__dirname + '/empty.js');
        }
        else {
            val = replacements[key];
            // if target is a relative path, then resolve
            // otherwise we assume target is a module
            if (val[0] === '.') {
                val = path.resolve(cur_path, val);
            }
        }

        if (key[0] === '/' || key[0] === '.') {
            // if begins with / ../ or ./ then we must resolve to a full path
            key = path.resolve(cur_path, key);
        }
        shims[key] = val;
    });
    return shims
}*/
  
    return {
      locs,
      places,
      crs
    }
}
