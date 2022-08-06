//import Window from '.'
export { Window } from "./index.mjs";

export default {
  async fetch(request, env/*, ctx*/) {
    //Response class must be a promise
    try {
      const module = { exports: {} };//const is shallow?
      ((module, exports) => {
        exports = Window; //exports != module.exports && export an empty default object (const, page)
        module.exports = Window; //export app != default object (const, page)
      })(module, module.exports);
      return module.exports;
    } catch (e) {
      return new Response(e.message);
    }
  }
};
/*import * as locs from "mastercard-locations";
import * as places from "mastercard-places";
import * as crs from "cors";*/
//https://github.com/nodejs/node/blob/08be585712774904bccbf4a43e481895a641464f/doc/api/modules.md#exports-shortcut
//https://stackoverflow.com/a/52351150/11711280
