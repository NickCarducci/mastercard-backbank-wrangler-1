import { wasm } from '@rollup/plugin-wasm';

export default {
  input: ".",
  output: {
    //name: "default",
    exports: 'named',
    //strict: false,
    file: "src/exec.mjs",
    format: "es"
  },
  plugins: [
    wasm()
  ]
};

