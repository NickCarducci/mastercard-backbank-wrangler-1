//import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';
//imports work in build actions until publishing to cloudflare worker

export default {
  input: "babelphp.js",
  output: {
    //name: "default",
    exports: 'default',//(auto, default, named, none)
    //strict: false,
    //banner: "const app = () => ",
    file: "babelphp.mjs",
    //footer: "export default app",
    format: "es",//iife, umd, amd(define)
    //sourcemap: true
  },
  plugins: [
    nodePolyfills(),
    commonjs({
      /*
      depreciated, done automatically, not the problem!
      namedExports: {
        'node_modules/picomatch/index.js': ['pm']
      },*/
     //exclude: ["node_modules/**/*", "notes/**/*", "src/notes/**/*"],
     //include: "src/**/*",
    }),
    nodeResolve({browser:true})
    //terser()
  ]
};
