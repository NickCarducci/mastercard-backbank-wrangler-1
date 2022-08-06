
import { rollup, watch } from "rollup";
import path from "path";
import { wasm } from '@rollup/plugin-wasm';//import { babel } from "@rollup/plugin-babel";

const inputOptions = {
  //external: ['cors', 'mastercard-locations','mastercard-places'],
  input: "a.out.wasm",
  plugins:[
    wasm()
    /*babel({
      babelHelpers: "bundled",
      presets:[["@babel/preset-env",{ targets: 'defaults', modules: "auto",}]],
        //{"esmodules": true};"@babel/preset-react"
      exclude: "node_modules/**" // only transpile our source code
    })*/
  ]
};
const output = {
  name: "Window",//banner,footer,
  //strict: false,
  file: "src/backbank.mjs",
  format: "es",
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
    exclude: ["node_modules/**/*","notes/**/*","src/builders/**/*","src/notes/**/*"],
    include: "**/**"
  }
};
console.log("PLUGINS PASSED");
const watcher = watch(watchOptions);
console.log("WATCHER INITIALIZED");
watcher.on("event", (event) => {
  //console.log("G-FORCE:rollup: ", JSON.stringify(event));
  if (event.code === "BUNDLE_START") {
  } else if (event.code === "START") {
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
