//import { watcher, manifest, pages } from "./rolluphelpers.mjs";
//import { rollup } from "rollup";

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

const hydrate = modules =>{
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
}
/*
var product = null
watcher.on("event", (event) => {
  if (event.code === "BUNDLE_START") {
  } else if (event.code === "START") {
  } else if (event.code === "END") {
    watcher.close();
  } else if (event.code === "ERROR") {
  } else if (event.code === "BUNDLE_END") {
  }
  if (event.result) {
    const ast = event.result.cache.modules[0].ast; //.body
    product = hydrate(ast);
    console.log(ast, " is Abstract Syntax Tree of dependencies");
    event.result.close();
  }
});
export default {
  product
}

rollup(manifest)
.then((bundle) => {
  console.log(
    Object.keys(bundle),
    " is bundle; using the watcher-listener's first ast-event-result-cache-module"
  );
  pages.forEach(async (page) => await bundle.write(page));
  return console.log(
    Object.keys(bundle),
    " is bundle, with written pages"
  );
})
.catch((err) => console.log("rollup.rollup error", err.message));

console.log("FINISHED :)");

*/
