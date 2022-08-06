//traverseCommons.js
//https://github.com/craigtaub/our-own-webpack/blob/master/compiler/index.mjs
//import { Window } from "./index.mjs";//"abstract-syntax-tree";
/*const ast = require("abstract-syntax-tree");
const path = require("path");
const fs = require("fs");
const entry = "./index.mjs";*/
import * as ast from "abstract-syntax-tree";
import path from "path";
import fs from "fs";
import entry from "./index.mjs";
//export { DurableObjectExample } from "./index.mjs";
/*import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);*/

const modules = [];

const traverse = (file) => {
  //`${file}/src/index.js`);
  var fullPath = path.resolve(
    file.includes(".") ? "./src/" : "./node_modules/",
    file
  );
  //file.substring(file.length - 3, file.length) === ".js"
  //console.log("processing: ", fullPath);
  if (!file.includes(".") && fs.statSync(fullPath).isDirectory())
    return fs.readdir(fullPath, (err, files) => {
      //console.log(files);
    });

  if (!!modules.find((item) => item.name === fullPath)) return;

  // store path + parsed source as module
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const source = ast.parse(fileContents);

  //modules
  modules.push({
    name: fullPath,
    source
  });

  // process deps
  source.body.forEach((current) => {
    if (current.type === "ImportDeclaration") {
      // process module for each dep.
      traverse(current.source.value);
    }
  });

  return modules;
};

const getImport = (item, allDeps) => {
  // get variable
  const spec = item.specifiers[0];
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
              // get files full path and find index in deps array.
              value: allDeps.findIndex(
                (item) =>
                  item.name === path.resolve("./src/", item.source.value)
              )
            }
          ]
        },
        id: {
          type: "Identifier",
          name: spec[spec.local ? "local" : "imported"].name
        }
      }
    ]
  };
};

const getExport = (item) => {
  // get functions
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

const transform = (modules) => {
  /*const updatedModules = modules.reduce((acc, dependency, index) => {
    dependency.source.body = dependency.source.body.map((item) => {
      if (item.type === "ImportDeclaration") {
        // replace module imports with ours
        item = getImport(item, modules);
        // Replacing ESM import with our function. `const someImport = _ourRequire("{ID}");`
      }
      if (item.type === "ExportNamedDeclaration") {
        // replaces function name with real exported function
        item = getExport(item); //Replacing ESM export with our function. `module.exports = someFunction;`
      }
      return item;
    });
    const updatedSource = ast.generate(dependency.source);//String
    // template.source(bind)
    const updatedTemplate = buildModuleTemplateString(updatedSource, index);
    //Template to be used for each module. module: load exports onto _ourRequire: import system
    acc.push(updatedTemplate);
    return acc;
  }, []);*/
  // Add all modules to bundle - buildRuntimeTemplateString()
  // Our main template containing the bundles runtime.

  return `
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
   ${modules
     .map((dependency, index) => {
       dependency.source.body = dependency.source.body.map((item) => {
         if (item.type === "ImportDeclaration") {
           // replace module imports with ours
           // Replacing ESM import with our function. `const someImport = _ourRequire("{ID}");`
           item = getImport(item, modules);
         }
         if (item.type === "ExportNamedDeclaration") {
           // replaces function name with real exported function
           //Replacing ESM export with our function. `module.exports = someFunction;`
           item = getExport(item);
         }
         return item;
       });
       // template.source(bind)
       //module Template: _ourRequire: import exports
       //buildModuleTemplateString()
       return `
        /* index/id ${index} */
        (function(module, _ourRequire) {
          "use strict";
          ${ast.generate(dependency.source)}//updatedSource
        })
        `;
     })
     .join(",")}
  ]); 
  `;
};

// Traverse deps graph// move to config or cli
const da = traverse(entry);
const vendorString = transform(da); // Take modules and return bundle string
const sum = crypto.createHash("md5"); // create hash
sum.update(vendorString);
const hash = sum.digest("hex");
console.log("hash of dependencies ",hash);
export default {
  hash
};
