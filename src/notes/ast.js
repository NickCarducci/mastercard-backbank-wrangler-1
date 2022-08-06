/*const ast = require("abstract-syntax-tree");
module.exports = {
  ast
}
commonUMDable.js
*/ 
import ast from "abstract-syntax-tree";
//const ast = require("abstract-syntax-tree");

export class Window {
  constructor(el, env) {
    /*console.log(el.textContent, "- From the example module");
    this.el = el;
    this.env = env;
    this.el.blockConcurrencyWhile(async () => {
      let stored = await this.el.storage.get("esm");
      // After initialization, future reads do not need to access storage.
      this.value = stored || 0;
      console.log(Object.keys(this.value));
      
      Window &&
      this.el.storage.put("esm", Window.hash);
      
    });*/
    this.parse = ast.parse
    this.generate = ast.generate
  }
  
  /*const {parse, generate} = ast
  return {parse, generate}*/
}
