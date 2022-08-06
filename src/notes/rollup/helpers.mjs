import { rollup, watch } from "rollup";
import { nodeResolve } from '@rollup/plugin-node-resolve'
import nodePoly from "rollup-plugin-polyfill-node";
import { hydrate } from ".././dependencies/shim.mjs";

const pages = [
  {
    //name:"app",
    format: "amd",
    sourcemap: false,
    strict: false,
    //banner: "const app = () => ",
    file: "dist/built.js",
    //footer: "export default app"
  }
];
const manifest = {
  input: "src/dependencies/index.mjs",//"src/dependencies/shim.mjs",
  plugins: [nodePoly(), nodeResolve({browser:true})]
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
//const watcher = watch(watchable);

const watcher = watch(watchable);
console.log("WATCHER INITIALIZED");
export default {
  watcher,
  manifest
}
/**
watcher:()=>{
  const watcher = watch(watchable);
  console.log("WATCHER INITIALIZED");
  return watcher
},
*/
