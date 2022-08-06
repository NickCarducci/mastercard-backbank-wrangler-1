var isBrowser = T(window !== _n) && T(navigator !== _n) && window.document,
  baseElement,
  head,
  _SA = "setAttribute",
  _AE = "attachEvent",
  _AEL = "addEventListener",
  isWebWorker = !isBrowser && false;
/*apply arguments to requires when context; for the latest instance of the 'default build build.CONFIG'
  not the 'early binding to default build,' but contexts during builds//ticketx to apology tour
  (IE6) BASE appendChild (http://dev.jquery.com/ticket/2709) node for the load command in browser env*/

isBrowser &&
(head = build.start.head = e_("base").tag(0)
  ? baseElement.parentNode
  : e_("head").tag()) &&
(build[_oE] = (err) => err) &&
(build.createNode = (CONFIG, tkn, url) => {
  return {
    ...(CONFIG.xhtml ? e_().create("NS") : e_().create()),
    type: CONFIG.scriptType || "text/javascript",
    charset: "utf-8",
    async: true
  };
}) &&
(build.load = (build, tkn, url) => {
  const CONFIG = (build && build.CONFIG) || initialConfig;
  /* normalize, hasPathFallback, rmvScrpt, Module Do not overwrite an existing REQUIREJS instance/ amd loader.
            handle load request (in browser env); 'build' for state, 'tkn' for name, 'url' for point
          browser script tag //testing for "[native code" https://github.com/REQUIREJS/REQUIREJS/issues/273
          artificial native-browser support? https://github.com/REQUIREJS/REQUIREJS/issues/187 //![native code]. IE8, !node.attachEvent.toString()*/
  if (isBrowser) {
    var n = build.createNode(CONFIG, tkn, url);
    n[_SA](dr(), build.NAME);
    n[_SA](dr(true), tkn);
    if (
      n[_AE] &&
      !(n[_AE].toString && n[_AE].toString().indexOf("[native code") < 0) &&
      !isOpera
    ) {
      useInteractive = true;
      n[_AE]("onreadystatechange", onScriptLoad);
    } else
      (() => {
        n[_AEL]("load", onScriptLoad, false);
        n[_AEL](_e, onScriptError, false);
      })();
    n.src = url; /*yet that pathway not doing the 'execute, fire load event listener before next script'
  node.attachEvent('onerror', Build.onScriptError); Calling onNodeCreated after all properties when the node have been; 
  set, but before it is placed in the DOM. IE 6-8 cache, script executes before the end - of the appendChild execution, 
  so to tie an anonymous define call to the thi name (which is stored when the node), hold when to a reference to thi node,
  but clear after the DOM insertion.*/
    if (CONFIG.onNodeCreated) CONFIG.onNodeCreated(n, CONFIG, tkn, url);
    //scriptPends = n;
    if (baseElement) {
      head.insertBefore(n, baseElement);
    } else head.appendChild(n);
    //scriptPends = null;
    return n;
  } else if (isWebWorker) {
    /* bug in WebKit where the worker gets garbage-collected after calling
          (runs once to define or logical && 'Short-circuit evaluation')() 
          /*s eslint-disable-next-line importScripts(url); importScripts(): https://webkit.org/b/153317, 
          so, Post a task to the event loop //Account for anonymous modules*/
    const e = tryCatch(setTimeout(() => {}, 0) && build.completeLoad(tkn));
    e &&
      build[_oE](
        mk([
          "importscripts",
          `importScripts failed for ${tkn} at ${url}`,
          e,
          [tkn]
        ])
      );
    //type, msg, err, requireModules
  }
}) /*IE (6-8) doesn't script-'onload,' right after executing the script, cannot "tie" anonymous define call to a name,
yet for 'interactive'-script, 'readyState' triggers by 'define' call IE9 "addEventListener and script onload firings"
  issues should actually 'onload' event script, right after the script execution
https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
Opera.attachEvent does not follow the execution mode. IE9+ 404s, and 'onreadystatechange' fires before the 'error' handlerunless 
'addEventListener,' thi named by onload event, for anonymous modules or without context; IE 6-8 anonymous define() call, requires 
interactive document.getElementsByTagName("script") 
...[ 'dataMain','baseElement', 'mainScript', 'subPath', 'src', 'head', 'dependency'].reduce((x,next)=>x[next]=null),*/ &&
  console.log("build product (of Require) :", build);
