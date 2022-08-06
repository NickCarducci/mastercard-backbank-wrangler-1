import { rollup, watch } from "rollup";
import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import { babel } from "@rollup/plugin-babel";
import legacy from '@rollup/plugin-legacy';
import replace from '@rollup/plugin-replace';

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
    replace({ 
      include: './src/browseri.js',
      values: {//https://stackoverflow.com/questions/40568580/rollup-js-how-import-a-js-file-not-es6-module-without-any-change-myvarextras
        'module.exports =': 'export default'
      }//like banner, footer
    }),
  nodeResolve({
    browser: true,
    only: [/^\.{0,2}\//],
    extensions: [".js"],
    mainFields: ["module", "main"]
  }),
  legacy({  'browserii.js': 'Window' }),
  commonjs({
    include: ["node_modules/**"],
    exclude: ["node_modules/process-es6/**/*","notes/**/*","src/builders/**/*"]
  }),
  babel({
    babelHelpers: "bundled",
    presets,
    exclude: "node_modules/**" // only transpile our source code
  }),
  json(),
  terser()
];
const inputOptions = {
  external: ['cors', 'mastercard-locations','mastercard-places'],
  input: "src/browseri.js",
  plugins
};
const output = {
  //banner,footer,
  name: "Window",
  strict: false,
  file: "src/browserii.js",
  format: "iife",
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
    exclude: ["node_modules/**/*","notes/**/*","src/builders/**/*"],
    include: "src/**/*"
  }
};
console.log("PLUGINS PASSED");
const watcher = watch(watchOptions);
console.log("WATCHER INITIALIZED");
watcher.on("event", (event) => {
  //event.result.cache.modules.ast.sourceType = "module"
  //const ast = event.result.cache.modules.ast//.body
  //import { generate } from 'astring'
  //generate(ast)
  /*
 [
              {
                "type": "VariableDeclaration",
                "start": 0,
                "end": 43,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 4,
                    "end": 42,
                    "id": {
                      "type": "Identifier",
                      "start": 4,
                      "end": 8,
                      "name": "locs"
                    },
                    "init": {
                      "type": "CallExpression",
                      "start": 11,
                      "end": 42,
                      "callee": {
                        "type": "Identifier",
                        "start": 11,
                        "end": 18,
                        "name": "require"
                      },
                      "arguments": [
                        {
                          "type": "Literal",
                          "start": 19,
                          "end": 41,
                          "value": "mastercard-locations",
                          "raw": "\"mastercard-locations\""
                        }
                      ],
                      "optional": false
                    }
                  }
                ],
                "kind": "var"
              },
              {
                "type": "VariableDeclaration",
                "start": 45,
                "end": 87,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 49,
                    "end": 86,
                    "id": {
                      "type": "Identifier",
                      "start": 49,
                      "end": 55,
                      "name": "places"
                    },
                    "init": {
                      "type": "CallExpression",
                      "start": 58,
                      "end": 86,
                      "callee": {
                        "type": "Identifier",
                        "start": 58,
                        "end": 65,
                        "name": "require"
                      },
                      "arguments": [
                        {
                          "type": "Literal",
                          "start": 66,
                          "end": 85,
                          "value": "mastercard-places",
                          "raw": "\"mastercard-places\""
                        }
                      ],
                      "optional": false
                    }
                  }
                ],
                "kind": "var"
              },
              {
                "type": "VariableDeclaration",
                "start": 89,
                "end": 115,
                "declarations": [
                  {
                    "type": "VariableDeclarator",
                    "start": 93,
                    "end": 114,
                    "id": {
                      "type": "Identifier",
                      "start": 93,
                      "end": 96,
                      "name": "crs"
                    },
                    "init": {
                      "type": "CallExpression",
                      "start": 99,
                      "end": 114,
                      "callee": {
                        "type": "Identifier",
                        "start": 99,
                        "end": 106,
                        "name": "require"
                      },
                      "arguments": [
                        {
                          "type": "Literal",
                          "start": 107,
                          "end": 113,
                          "value": "cors",
                          "raw": "\"cors\""
                        }
                      ],
                      "optional": false
                    }
                  }
                ],
                "kind": "var"
              },
              {
                "type": "ExpressionStatement",
                "start": 117,
                "end": 221,
                "expression": {
                  "type": "AssignmentExpression",
                  "start": 117,
                  "end": 220,
                  "operator": "=",
                  "left": {
                    "type": "MemberExpression",
                    "start": 117,
                    "end": 131,
                    "object": {
                      "type": "Identifier",
                      "start": 117,
                      "end": 123,
                      "name": "module"
                    },
                    "property": {
                      "type": "Identifier",
                      "start": 124,
                      "end": 131,
                      "name": "exports"
                    },
                    "computed": false,
                    "optional": false
                  },
                  "right": {
                    "type": "FunctionExpression",
                    "start": 134,
                    "end": 220,
                    "id": {
                      "type": "Identifier",
                      "start": 143,
                      "end": 149,
                      "name": "Window"
                    },
                    "expression": false,
                    "generator": false,
                    "async": false,
                    "params": [],
                    "body": {
                      "type": "BlockStatement",
                      "start": 152,
                      "end": 220,
                      "body": [
                        {
                          "type": "ReturnStatement",
                          "start": 156,
                          "end": 218,
                          "argument": {
                            "type": "ObjectExpression",
                            "start": 163,
                            "end": 217,
                            "properties": [
                              {
                                "type": "Property",
                                "start": 169,
                                "end": 179,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 169,
                                  "end": 173,
                                  "name": "locs"
                                },
                                "value": {
                                  "type": "Identifier",
                                  "start": 175,
                                  "end": 179,
                                  "name": "locs"
                                },
                                "kind": "init"
                              },
                              {
                                "type": "Property",
                                "start": 185,
                                "end": 199,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 185,
                                  "end": 191,
                                  "name": "places"
                                },
                                "value": {
                                  "type": "Identifier",
                                  "start": 193,
                                  "end": 199,
                                  "name": "places"
                                },
                                "kind": "init"
                              },
                              {
                                "type": "Property",
                                "start": 205,
                                "end": 213,
                                "method": false,
                                "shorthand": false,
                                "computed": false,
                                "key": {
                                  "type": "Identifier",
                                  "start": 205,
                                  "end": 208,
                                  "name": "crs"
                                },
                                "value": {
                                  "type": "Identifier",
                                  "start": 210,
                                  "end": 213,
                                  "name": "crs"
                                },
                                "kind": "init"
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                }
              }
            ],
            "sourceType": "module"
          },*/
  console.log("G-FORCE:rollup: ", JSON.stringify(event));
  if (event.code === "BUNDLE_START") {
    //   BUNDLE_START — building an individual bundle
    //                  * event.input will be the input options object if present
    //                  * event.output contains an array of the "file" or
    //                    "dir" option values of the generated outputs
  } else if (event.code === "START") {
    //   START        — the watcher is (re)starting
  } else if (event.code === "END") {
    //   END          — finished building all bundles
    // stop watching
    watcher.close();
  } else if (event.code === "ERROR") {
    //   ERROR        — encountered an error while bundling
    //                  * event.error contains the error that was thrown
    //                  * event.result is null for build errors and contains the
    //                    bundle object for output generation errors. As with
    //                    "BUNDLE_END", you should call "event.result.close()" if
    //                    present once you are done.
  } else if (event.code === "BUNDLE_END") {
    //   BUNDLE_END   — finished building a bundle
    //                  * event.input will be the input options object if present
    //                  * event.output contains an array of the "file" or
    //                    "dir" option values of the generated outputs
    //                  * event.duration is the build duration in milliseconds
    //                  * event.result contains the bundle object that can be
    //                    used to generate additional outputs by calling
    //                    bundle.generate or bundle.write. This is especially
    //                    important when the watch.skipWrite option is used.
    //                  You should call "event.result.close()" once you are done
    //                  generating outputs, or if you do not generate outputs.
    //                  This will allow plugins to clean up resources via the
    //                  "closeBundle" hook.
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
