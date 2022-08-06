//https://github.com/craigtaub/our-own-webpack/blob/master/compiler/index.mjs
import fs from "fs";
import crypto from "crypto";
import path from "path";
import ast from "abstract-syntax-tree";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const depsArray = [];

const depsGraph = (file) => {
  var fullPath = null
  if(file.substring(file.length - 3, file.length) === ".js"){
    fullPath = path.resolve("./src/", file);
    console.log("processing: ", fullPath)
  } else {
    fullPath = path.resolve("./node_modules/", file);//`${file}/src/index.js`);
    console.log("processing: ", fullPath)
    var stats = fs.statSync(fullPath);
    if(stats.isDirectory())
     return fs.readdir(fullPath, (err, files) => {
        console.log(files);
      });
  }

  // return early if exists
  if (!!depsArray.find((item) => item.name === fullPath)) return;

  // store path + parsed source as module
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const source = ast.parse(fileContents);
  const module = {
    name: fullPath,
    source
  };

  // Add module to deps array
  depsArray.push(module);

  // process deps
  source.body.map((current) => {
    if (current.type === "ImportDeclaration") {
      // process module for each dep.
      depsGraph(current.source.value);
    }
  });

  return depsArray;
};
// Traverse deps graph
const entry = "./browseri.js"; // move to config or cli
const da = depsGraph(entry);
const buildModuleTemplateString = (moduleCode, index) => `
/* index/id ${index} */
(function(module, _ourRequire) {
  "use strict";
  ${moduleCode}
})
`;

const buildRuntimeTemplateString = (allModules) => `
(function(modules) {
  // Define runtime.
  const installedModules = {}; // id/index + exports
  function _our_require_(moduleId) {
    // Module in cache?
    if (installedModules[moduleId]) {
        // return function exported in module
       return installedModules[moduleId].exports
    }
    // Build module, store exports against this ref.
    const module = {
       i: moduleId,
       exports: {},
    }
    // Execute module template function. Add exports to ref.
    modules[moduleId](module, _our_require_);
    // cache exports of module
    const exports = module.exports;
    installedModules[moduleId] = exports
    // Return exports of module
    return exports;
  }
  // Load entry module via id + return exports
  return _our_require_(0);
})
/* Dep tree */
([
 ${allModules}
]); 
`;

const getImport = (item, allDeps) => {
  // get variable we import onto
  console.log(item.specifiers[0]);
  const importFunctionName = item.specifiers[0].local?item.specifiers[0].local.name:item.specifiers[0].imported.name;
  // get files full path and find index in deps array.
  const fullFile = path.resolve("./src/", item.source.value);
  const itemId = allDeps.findIndex((item) => item.name === fullFile);

  return {
    type: "VariableDeclaration",
    kind: "const",
    declarations: [
      {
        type: "VariableDeclarator",
        init: {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: "_ourRequire"
          },
          arguments: [
            {
              type: "Literal",
              value: itemId
            }
          ]
        },
        id: {
          type: "Identifier",
          name: importFunctionName
        }
      }
    ]
  };
};

const getExport = (item) => {
  // get export functions name
  const moduleName = item.specifiers[0].exported.name;
  return {
    type: "ExpressionStatement",
    expression: {
      type: "AssignmentExpression",
      left: {
        type: "MemberExpression",
        object: { type: "Identifier", name: "module" },
        computed: false,
        property: { type: "Identifier", name: "exports" }
      },
      operator: "=",
      right: { type: "Identifier", name: moduleName }
    }
  };
};

const transform = (depsArray) => {
  const updatedModules = depsArray.reduce((acc, dependency, index) => {
    const updatedAst = dependency.source.body.map((item) => {
      if (item.type === "ImportDeclaration") {
        // replace module imports with ours
        item = getImport(item, depsArray); // Replacing ESM import with our function. `const someImport = _ourRequire("{ID}");`
      }
      if (item.type === "ExportNamedDeclaration") {
        // replaces function name with real exported function
        item = getExport(item); //Replacing ESM export with our function. `module.exports = someFunction;`
      }
      return item;
    });
    dependency.source.body = updatedAst;
    // Turn AST back into string
    const updatedSource = ast.generate(dependency.source);
    // Bind module source to module template
    const updatedTemplate = buildModuleTemplateString(updatedSource, index);
    //Template to be used for each module. module: load exports onto _ourRequire: import system
    acc.push(updatedTemplate);
    return acc;
  }, []);
  // Add all modules to bundle
  const bundleString = buildRuntimeTemplateString(updatedModules.join(",")); // Our main template containing the bundles runtime.
  return bundleString;
};
const vendorString = transform(da); // Take depsArray and return bundle string
const sum = crypto.createHash("md5"); // create hash
sum.update(vendorString);
const hash = sum.digest("hex");
fs.writeFileSync(`${__dirname}/build/common-${hash}.js`, vendorString, "utf8"); // write contents to bundle
fs.writeFileSync(
  `${__dirname}/build/manifest.json`,
  `{"default": "common-${hash}.js"}`,
  "utf8"
); // write hash to manifest
//import manifest from "./build/manifest.json";
//`${manifest.default}`
console.log("FINISHED :)");
