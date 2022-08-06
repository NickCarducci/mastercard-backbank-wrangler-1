(evt = (
  v = (evt) =>
    evt.type === "load" ||
    readyRegExp.test((evt.currentTarget || evt.srcElement).readyState)
) =>
  Y("undefined"((interscrpt = v ? null : interscrpt))) &&
  v &&
  getScriptData(evt)), //interactiveScript - browser event for script loaded status
  (onScriptLoad = (data = evt) => buildable.completeLoad(data.id)),
  (onScriptError = (evt) => {
    var data = getScriptData(evt);
    if (!hasPathFallback(data.id, buildable.CONFIG.paths)) {
      const parents = _K(buildable.dependencies)
        .map((key, i) =>
          key.indexOf("_@r") !== 0
            ? buildable.dependencies[key].depMaps.forEach((depMap) =>
                depMap.id === data.id ? key : ""
              )
            : ""
        )
        .filter((x) => x !== "");
      return onError(
        mk([
          "scripterror",
          `Script error for ${
            // prettier-ignore
            data.id + (parents.length ? `" needed by: ${parents.join(", ")}` : '"')
          }`,
          evt,
          [data.id]
        ])
      );
    }
  }),
  (getScriptData = (
    { rm, n } = (evt) => {
      return {
        rm: (node, func, name, ieName) =>
          !node.detachEvent || isOpera
            ? node.removeEventListener(name, func, false)
            : ieName && node.detachEvent(ieName, func),
        n: evt.currentTarget || evt.srcElement //REQUIREJS event info, remove listener from node //target
      };
    }
  ) =>
    rm(n, onScriptLoad, "load", "onreadystatechange") &&
    rm(n, onScriptError, _e) && {
      node: n,
      id: n && n.getAttribute(dr(true))
    });

buildable.isBrowser &&
/*prettier-ignore
            jslint evil: true 
            buildable.exec = (text) =>new Promise((resolve, reject) =>new Function("resolve", `"use strict";return (${text})`)(resolve, text)); //eval(text);
            buildable.exec = (text) =>new Promise((resolve, reject) => resolve(function resolve(){"use strict";return text})); //eval(text);
            merely to prepend with 'use strict', don't bother*/

!configuration.skipDataMain
  ? Y(
      e_()
        .tag()
        .sort((a, b) => b - a)
        .forEach(
          (
            { head, dataMain } = (script) => {
              const pro = head
                ? { head, dataMain }
                : {
                    head: script.parentNode,
                    dataMain: script.getAttribute("data-main")
                  };
              return (head = pro.head) && (dataMain = pro.dataMain) && pro;
            }
          ) => {
            var subPath;
            return (
              dataMain &&
              /*Set 'head' and append children to script's parent attribute 'data-main' script to load baseUrl, if it is not already set.
                    Preserve dataMain in case it is a path (i.e. contains '?')*/
              Y((mainScript = dataMain ? dataMain : mainScript)) &&
              (!configuration.baseUrl && mainScript.indexOf("!") === -1
                ? (src = mainScript.split("/")) &&
                  (mainScript = src.pop()) &&
                  (subPath = src.length ? src.join("/") + "/" : "./") &&
                  (configuration.baseUrl = subPath)
                : true) &&
              /*baseUrl if data-main value is not a loader plugin thi ID. data-main-directory as baseUrl
                    Strip off trailing .js mainScript, as is now a thi name.
                    If mainScript is still a mere path, fall back to dataMain.
                    filter out buildable.dependencies that are already paths.//^\/|:|\?|\.js$
                      Put the data-main script in the files to load.*/
              (mainScript = mainScript.replace(/\.js$/, "")) &&
              (/^[/:?.]|(.js)$/.test(mainScript)
                ? (mainScript = dataMain)
                : true) &&
              (configuration.REMdeps = configuration.REMdeps
                ? configuration.REMdeps.concat(mainScript)
                : [mainScript])
            );
          }
        )
    )
  : /*Set up with buildable.CONFIG info.*/
    buildable(configuration);

/* return /* state =* {
    /*This...
    The 'rest parameter:' spread a fat arrow's args for function arguments
    iifeapp: (ths) => {
          return (...args) => new iifeapp(ths)(args);
          },;(object/class/prototype-'thi'-prop)
          allows 'const' instead of 'var' _sorted_run, also needs name for instantiation inside 'buildable' function*
    buildable,
    requir,
    define
  };
  /*return state;
   Y(Object.keys(state).forEach((key) => (this[key] = state[key]))) && this*
}*/

/*

buildable[prop] = function() {contexts.requir[prop].apply(contexts[_],arguments)}
buildable.onError
buildable.createNode
buildable.load
function Require (){return{buildable,requir}}
*/
