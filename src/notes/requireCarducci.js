/**UNLICENSED BUT FOR PARTS OF OTHERS */

/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.3.6.carducci Copyright jQuery Foundation and other contributors.
 * Released under MIT license, https://github.com/REQUIREJS/REQUIREJS/blob/master/LICENSE
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with REQUIREJS.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*dependency window, navigator, document, importScripts, setTimeout, opera */

var isBrowser = !!(
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  window.document
);
var isWebWorker = !isBrowser && typeof importScripts !== "undefined";
//'loading', 'loaded', execution, 'complete'
var readyRegExp =
  isBrowser && navigator.platform === "PLAYSTATION 3"
    ? /^complete$/
    : /^(complete|loaded)$/;
var defContextName = "_";
//Oh the tragedy, detecting opera. See the usage of isOpera for reason.
var isOpera =
  typeof opera !== "undefined" && opera.toString() === "[object Opera]";
var contexts = {};

var REQUIREJS, define, require;
var timeout = typeof setTimeout === "undefined" ? undefined : setTimeout;

var op = Object.prototype,
  ostring = op.toString,
  hasOwn = op.hasOwnProperty;

/*- isFunction = (it) => ostring.call(it) === "[object Function]";
  - isArray = (it) => ostring.call(it) === "[object Array]";
  - each =
  - eachReverse = 
  - hasProp = (obj, prop) => hasOwn.call(obj, prop);
  - getOwn = (obj, prop) => hasProp(obj, prop) && obj[prop];
  - eachProp = 
  - mixin = 
  - bind =
  - scripts = () => document.getElementsByTagName("script");
  - makeError = 
  - defaultOnError = (err) => makeError(err.message);
  
  require = ((dependency, setTimeout) => {
   
    - getGlobal = 
    define = (name, deps, callback) => 
    define.amd = 
    - trimDots = 
    - convertName = 
    - removeScript = 
    - hasPathFallback =
    - splitPrefix = 
    - normalize = 
    - Module = 
    - req = (REQUIREJS = (deps, callback, errback, optional) => 
    req.CONFIG = (confi) => req(confi); // globally agreed names for other potential AMD loaders
    req.nextTick =
    if (!require) require = req; //Exportable require
    req.version = version;
    req.isBrowser = isBrowser;
    - newContext = (contextName) => 
      - CONTEXT = {
        CONFIG: {
          waitSeconds: 7,
          baseUrl: "./",
          paths: {},
          bundles: {},
          pkgs: {},
          shim: {},
          config: {}
        }
      };
      - makeModuleMap = 
      - getModule =
      - on =
      - onError = 
      - takeGlobalQueue = 
      - handlers = {
        require: 
        exports:
        module: 
      };
      - cleanRegistry =
      - breakCycle = 
      - checkLoaded = 
      - init = 
      - fetcher = 
      - bindExports =
      
      - defineModule =
      
      - normalizeMod = 
      
      - loadFinish =
        - localRequire = 
        - localreq =
      
      - callPlugin = 
      - enable = 
      
      Module.prototype = {
        init,
        defineDep:
        fetch: fetcher,
        load:
        check: 
        callPlugin,
        enable,
        on: 
        emit:
      };
      - callGetModule = 
      - getScriptData =
      - makeRequire =
          - intakeDefines = 
      - configure = 
  
      CONTEXT = {
        CONFIG,
        contextName,
        registry,
        defined,
        urlFetched,
        defQueue,
        defQueueMap: {},
        Module,
        makeModuleMap,
        nextTick: req.nextTick,
        onError,
        configure,
        makeShimExports: 
        makeRequire,
        enable: 
        completeLoad:
        nameToUrl:
  
        load: 
        execCb: 
        onScriptError: 
        
      };
      CONTEXT.require = CONTEXT.makeRequire();
      return CONTEXT;
    };
    - s = (req.s = 
    req.onError =
    req.createNode =
    req.load = 
    - getInteractiveScript = 
    req.exec = 
  )(require, timeout);
  
  - Required = () => {
    return { require, define };
  };
  export { Required as default };*/

const isFunction = (it) => ostring.call(it) === "[object Function]";
const isArray = (it) => ostring.call(it) === "[object Array]";
const each = (array, func) => {
  if (array) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i] && func(array[i], i, array)) break; // If truthy, stop
    }
  }
};
const eachReverse = (array, func) => {
  if (array) {
    for (let i = array.length - 1; i > -1; i -= 1) {
      if (array[i] && func(array[i], i, array)) break; // If truthy, stop
    }
  }
};
const hasProp = (obj, prop) => hasOwn.call(obj, prop);
const getOwn = (obj, prop) => hasProp(obj, prop) && obj[prop];
const eachProp = (obj, func) => {
  for (let prop in obj) {
    if (hasProp(obj, prop) && func(obj[prop], prop)) break; // If truthy, stop
  }
};
const mixin = (target, source, force, deepStringMixin) => {
  if (source)
    eachProp(source, (value, prop) => {
      if (force || !hasProp(target, prop)) {
        if (
          deepStringMixin &&
          typeof value === "object" &&
          value &&
          !isArray(value) &&
          !isFunction(value) &&
          !(value instanceof RegExp)
        ) {
          if (!target[prop]) target[prop] = {};
          mixin(target[prop], value, force, deepStringMixin);
        } else target[prop] = value;
      }
    });
  return target; // If non-redundant, stop
};
const bind = (obj, fn) =>
  function () {
    fn.apply(obj, arguments);
  }; //Function.prototype.bind, with 'this'
const scripts = () => document.getElementsByTagName("script");
const makeError = (id, msg, err, requireModules) => {
  var e = new Error(msg + "\nhttps://REQUIREJS.org/docs/errors.html#" + id);
  e.requireType = id;
  e.requireModules = requireModules;
  if (err) {
    e.originalError = err;
  }
  return e;
};

const defaultOnError = (err) => err;
require = ((dependency, setTimeout) => {
  var globalDefQueue = [];
  var currentlyAddingScript,
    version = "2.3.6.carducci",
    configuration = {},
    useInteractive = false;

  const getGlobal = (value) => {
    if (!value) return value; //dont-notation dependency
    var g = dependency;
    each(value.split("."), (part) => {
      g = g[part];
    });
    return g;
  };
  if (typeof define !== "undefined") return; //Do not overwrite an existing REQUIREJS instance/ amd loader.
  define = (name, deps, callback) => {
    var node, ctx; // package-names, callback, returns a value to define the module of argument index[0]
    if (typeof name !== "string") {
      callback = deps; //Adjust args appropriately
      deps = name; //Allow for anonymous modules
      name = null;
    }
    if (!isArray(deps)) {
      callback = deps; //If no name, and callback is a function, then figure out if it a
      deps = null; //CommonJS thing with dependencies.
    }
    if (!deps && isFunction(callback)) {
      deps = []; //Remove comments from callback, and if function args, pull require calls into the dependencies
      if (callback.length) {
        const commentReplace = (match, singlePrefix) => singlePrefix || ""; //Could match something like ')//comment', so, do not lose the prefix to comment.
        callback
          .toString()
          .replace(/\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/gm, commentReplace)
          .replace(
            /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
            (match, dep) => deps.push(dep)
          );
        deps = (callback.length === 1
          ? ["require"]
          : ["require", "exports", "module"]
        ).concat(deps); //Potential-CommonJS use-case of exports and module, without 'require.'
      }
    }
    if (useInteractive) {
      node = currentlyAddingScript || getInteractiveScript(); //IE 6-8 anonymous define() call, requires interactive scripts
      if (node) {
        if (!name) name = node.getAttribute("data-requiremodule");
        ctx = contexts[node.getAttribute("data-requirecontext")];
      }
    }
    if (ctx) {
      ctx.defQueue.push([name, deps, callback]); //module named by onload event, for anonymous modules or without context
      ctx.defQueueMap[name] = true;
    } else globalDefQueue.push([name, deps, callback]);
  };
  define.amd = {
    jQuery: true
  };

  if (typeof REQUIREJS !== "undefined") {
    if (isFunction(REQUIREJS)) return null;
    configuration = REQUIREJS;
    REQUIREJS = undefined;
  }
  if (typeof require !== "undefined" && !isFunction(require)) {
    configuration = require; //require is a CONFIG object.
    require = undefined;
  }
  const trimDots = (array) => {
    var part;
    for (let i = 0; i < array.length; i++) {
      part = array[i];
      if (part === ".") {
        array.splice(i, 1);
        i -= 1;
      } else if (part === "..") {
        if (
          i === 0 ||
          (i === 1 && array[2] === "..") ||
          array[i - 1] === ".."
        ) {
          continue;
        } else if (i > 0) {
          array.splice(i - 1, 2);
          i -= 2;
        }
      }
    }
  }; //just enabled, but unactivated, modules
  const convertName = (name, map, applyMap, paths) => {
    var starMap = map && map["*"]; //Apply map CONFIG if available.
    if (applyMap && map && (paths || starMap)) {
      var foundMap, foundI, foundStarMap, starI;
      var names = name.split("/"); //continue search
      outerLoop: for (let i = names.length; i > 0; i -= 1) {
        var nameSegment = names.slice(0, i).join("/"); //unless shorter matching CONFIG, favor a "star map"
        if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
          foundStarMap = getOwn(starMap, nameSegment);
          starI = i;
        }
        if (paths) {
          for (let j = paths.length; j > 0; j -= 1) {
            var mapValue = getOwn(map, paths.slice(0, j).join("/")); //join biggest-to-smallest lengths paths to find
            if (mapValue) {
              mapValue = getOwn(mapValue, nameSegment); //the-longest 'baseName segment match' in the CONFIG
              if (mapValue) {
                foundMap = mapValue; //baseName segment has CONFIG, what about for this name?
                foundI = i;
                break outerLoop; //Match, update name to the new value.
              }
            }
          }
        }
      }
      if (foundMap) {
        names.splice(0, foundI, foundMap);
        name = names.join("/");
      } else if (foundStarMap) {
        foundMap = foundStarMap;
        foundI = starI;
      }
    }
    return name;
  };
  const removeScript = (name, contextName) =>
    isBrowser &&
    each(scripts(), (scriptNode) => {
      if (
        scriptNode.getAttribute("data-requiremodule") === name &&
        scriptNode.getAttribute("data-requirecontext") === contextName
      ) {
        scriptNode.parentNode.removeChild(scriptNode);
        return true;
      }
    });
  const hasPathFallback = (id, configPaths, ctx) => {
    var pathConfig = getOwn(configPaths, id);
    if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
      pathConfig.shift(); //next try
      ctx.require.undef(id);
      ctx.makeRequire(null, {
        skipMap: true
      })([id]); //no map translation, ID, absolutely-, already mapped/resolved.
      return true;
    }
  };
  const splitPrefix = (name) => {
    var prefix; //(plugin!resource) => [plugin, resource] or [undefined,{}] if the name without a plugin prefix.
    var index = name ? name.indexOf("!") : -1;
    if (index > -1) {
      prefix = name.substring(0, index);
      name = name.substring(index + 1, name.length);
    }
    return [prefix, name];
  };
  const normalize = (
    name,
    baseName,
    applyMap,
    configNodeIdCompat,
    configMap,
    configPkgs
  ) => {
    var paths = baseName && baseName.split("/");
    if (name) {
      name = name.split("/"); //Adjust any relative paths.
      var lastIndex = name.length - 1; //node allows either .js or non .js, yet not in nameToUrl
      if (configNodeIdCompat && /\.js$/.test(name[lastIndex]))
        name[lastIndex] = name[lastIndex].replace(/\.js$/, "");
      if (name[0].charAt(0) === "." && paths) {
        var normalizedBaseParts = paths.slice(0, paths.length - 1);
        name = normalizedBaseParts.concat(name); // Starts with a '.' so need the baseName
      }
      trimDots(name);
      name = name.join("/");
    }
    var map = configMap; //'applyMap' for dependency ID, 'baseName' relative to 'name,' the most relative
    name = convertName(name, map, applyMap, paths);
    var pkgMain = getOwn(configPkgs, name); // If package-name, package 'main'
    return pkgMain ? pkgMain : name;
  };
  var Module = (map, undefEvents, configShim) => {
    this.events = getOwn(undefEvents, map.id) || {};
    this.map = map;
    this.shim = getOwn(configShim, map.id);
    this.depExports = [];
    this.depMaps = [];
    this.depMatched = [];
    this.pluginMaps = {};
    this.depCount = 0;
  }; //this.exports; this.factory; this.depMaps = [], this.enabled, this.fetched
  var req = (REQUIREJS = (deps, callback, errback, optional) => {
    var ctx; //Caja compliant req for minified-scope
    var confi; //name of dependency, callback for array completion
    var contextName = defContextName; //Find the right CONTEXT, use default
    if (!isArray(deps) && typeof deps !== "string") {
      confi = deps;
      if (isArray(callback)) {
        deps = callback; // Determine if have CONFIG object in the call.
        callback = errback; // deps is a CONFIG object
        errback = optional; // Adjust args if there are dependencies
      } else deps = [];
    }
    if (confi && confi.context) contextName = confi.context;
    ctx = getOwn(contexts, contextName);
    if (!ctx) ctx = contexts[contextName] = req.s.newContext(contextName);
    if (confi) ctx.configure(confi);
    return ctx.require(deps, callback, errback);
  });
  req.CONFIG = (confi) => req(confi); // globally agreed names for other potential AMD loaders
  req.nextTick =
    typeof setTimeout !== "undefined"
      ? (fn) => setTimeout(fn, 4)
      : (fn) => fn();
  if (!require) require = req; //Exportable require
  req.version = version;
  req.isBrowser = isBrowser;
  var interactiveScript, dataMain, baseElement, mainScript, subPath, src, head;
  const newContext = (contextName) => {
    var CONTEXT = {
      CONFIG: {
        waitSeconds: 7,
        baseUrl: "./",
        paths: {},
        bundles: {},
        pkgs: {},
        shim: {},
        config: {}
      }
    };
    var { CONFIG } = CONTEXT;
    var inCheckLoaded,
      checkLoadedTimeoutId,
      registry = {},
      enabledRegistry = {},
      undefEvents = {},
      defQueue = [],
      defined = {},
      urlFetched = {},
      bundlesMap = {},
      requireCounter = 1,
      unnormalizedCounter = 1; //normalize() will run faster if there is no default
    const makeModuleMap = (name, parentModuleMap, isNormalized, applyMap) => {
      var parentName = parentModuleMap ? parentModuleMap.name : null; //'applyMap' for dependency ID, 'isNormalized' define() module ID,
      var originalName = name; //'[parentModuleMap]' to resolve relative names (&& require.normalize()), 'name' the most relative
      var isDefine = true;
      var normalizedName = "";
      if (!name) {
        isDefine = false; //internally-name a 'require' call, given no name
        name = "_@r" + (requireCounter += 1);
      }
      const configGets = [CONFIG.nodeIdCompat, CONFIG.map, CONFIG.pkgs];
      var names = splitPrefix(name);
      var prefix = names[0];
      name = names[1];
      var pluginModule, url;
      if (prefix) {
        prefix = normalize(prefix, parentName, applyMap, ...configGets);
        pluginModule = getOwn(defined, prefix);
      }
      if (name) {
        normalizedName = !prefix
          ? normalize(name, parentName, applyMap, ...configGets)
          : isNormalized
          ? name
          : pluginModule && pluginModule.normalize
          ? pluginModule.normalize(name, (name) =>
              normalize(name, parentName, applyMap, ...configGets)
            ) //do not normalize if nested plugin references; albeit this deprecates resourceIds,
          : name.indexOf("!") === -1
          ? normalize(name, parentName, applyMap, ...configGets)
          : name; //normalize after plugins are loaded and such normalizations allow for async loading of a loader plugin (#1131)
        if (!prefix) {
          names = splitPrefix(normalizedName); //ok base name, relative path?.
          prefix = names[0]; //normalize's 'map CONFIG application' might make normalized 'name' a plugin ID.
          normalizedName = names[1]; //'map CONFIG values' are already normalized at this point.
          isNormalized = true;
          url = CONTEXT.nameToUrl(normalizedName);
        }
      }
      var suffix =
        prefix && !pluginModule && !isNormalized
          ? "_unnormalized" + (unnormalizedCounter += 1)
          : ""; //If it may be a plugin id that doesn't normalization, stamp it with a unique ID
      return {
        prefix,
        name: normalizedName,
        parentMap: parentModuleMap,
        unnormalized: !!suffix,
        url,
        originalName,
        isDefine,
        id: (prefix ? prefix + "!" + normalizedName : normalizedName) + suffix
      }; //module mapping includes plugin prefix, module name, and path
    };
    const getModule = (depMap) => {
      var mod = getOwn(registry, depMap.id);
      if (!mod)
        mod = registry[depMap.id] = new CONTEXT.Module(
          depMap,
          undefEvents,
          CONFIG.shim
        );
      return mod;
    };
    const on = (depMap, name, fn) => {
      var mod = getOwn(registry, depMap.id);
      if (hasProp(defined, depMap.id) && (!mod || mod.defineEmitComplete)) {
        if (name === "defined") fn(defined[depMap.id]);
      } else {
        mod = getModule(depMap);
        if (mod.error && name === "error") return fn(mod.error);
        mod.on(name, fn);
      }
    };
    const onError = (err, errback) => {
      var ids = err.requireModules,
        notified = false;
      if (errback) return errback(err);
      each(ids, (id) => {
        var mod = getOwn(registry, id);
        if (mod) {
          mod.error = err; //Set error on module, so it skips timeout checks.
          if (mod.events.error) {
            notified = true;
            mod.emit("error", err);
          }
        }
      });
      if (!notified) req.onError(err);
    };
    const takeGlobalQueue = () => {
      if (globalDefQueue.length)
        each(globalDefQueue, (queueItem) => {
          var id = queueItem[0]; //globalQueue by internal method to this defQueue
          if (typeof id === "string") CONTEXT.defQueueMap[id] = true;
          defQueue.push(queueItem); //Push all the globalDefQueue items into the CONTEXT's defQueue
        });
      globalDefQueue = [];
    };
    var handlers = {
      require: (mod) => {
        if (!mod.require) return (mod.require = CONTEXT.makeRequire(mod.map));
        return mod.require;
      },
      exports: (mod) => {
        mod.usingExports = true;
        if (!mod.map.isDefine) return null;
        if (!mod.exports) return (mod.exports = defined[mod.map.id] = {});
        return (defined[mod.map.id] = mod.exports);
      },
      module: (mod) => {
        if (!mod.module)
          return (mod.module = {
            id: mod.map.id,
            uri: mod.map.url,
            config: () => getOwn(CONFIG.config, mod.map.id) || {},
            exports: mod.exports || (mod.exports = {})
          });
        return mod.module;
      }
    };
    const cleanRegistry = (id) => {
      delete registry[id];
      delete enabledRegistry[id];
    };
    const breakCycle = (mod, traced, processed) => {
      var id = mod.map.id;
      if (mod.error) return mod.emit("error", mod.error);
      traced[id] = true;
      each(mod.depMaps, (depMap, i) => {
        var depId = depMap.id; //Only force undefined (nor matched in module)
        var dep = getOwn(registry, depId); // but still-registered, things
        if (dep && !mod.depMatched[i] && !processed[depId]) {
          if (getOwn(traced, depId)) {
            mod.defineDep(i, defined[depId]);
            mod.check(); //pass false?
          } else breakCycle(dep, traced, processed);
        }
      });
      processed[id] = true;
    };
    const checkLoaded = () => {
      var err,
        usingPathFallback,
        waitInterval = CONFIG.waitSeconds * 1000,
        //It is possible to disable the wait interval by using waitSeconds of 0.
        expired =
          waitInterval &&
          CONTEXT.startTime + waitInterval < new Date().getTime(),
        noLoads = [],
        reqCalls = [],
        stillLoading = false,
        needCycleCheck = true;
      if (inCheckLoaded) return null; //Do not bother if this call was a result of a cycle break.
      inCheckLoaded = true;
      eachProp(enabledRegistry, (mod) => {
        var map = mod.map; //Figure out the state of all the modules.
        var modId = map.id; //disabled or in error
        if (!mod.enabled) return null;
        if (!map.isDefine) reqCalls.push(mod);
        if (!mod.error && !mod.inited) {
          if (expired) {
            if (hasPathFallback(modId, CONFIG.paths)) {
              usingPathFallback = true;
              stillLoading = true;
            } else {
              noLoads.push(modId);
              removeScript(modId, CONTEXT.contextName);
            }
          } else if (mod.fetched && map.isDefine) {
            stillLoading = true;
            if (!map.prefix) needCycleCheck = false; //non-plugin-resource
          }
        }
      }); //If wait time expired, throw error of unloaded modules.
      if (expired && noLoads.length) {
        err = makeError(
          "timeout",
          "Load timeout for modules: " + noLoads,
          null,
          noLoads
        ); //id, msg, err, requireModules
        err.contextName = CONTEXT.contextName;
        return onError(err);
      } else {
        if (needCycleCheck) each(reqCalls, (mod) => breakCycle(mod, {}, {}));
        if ((!expired || usingPathFallback) && stillLoading) {
          if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId)
            checkLoadedTimeoutId = setTimeout(() => {
              checkLoadedTimeoutId = 0; //plugin-resource
              checkLoaded();
            }, 50);
        }
        inCheckLoaded = false;
      }
    };
    const init = (depMaps, factory, errback, options) => {
      options = options || {}; //if multiple define calls for the same module
      if (this.inited) return null;
      this.factory = factory; //Register for errors on this module.
      if (errback) {
        this.on("error", errback); //If no errback already, but there are error listeners
      } else if (this.events.error)
        errback = bind(this, (err) => this.emit("error", err)); //on this module, set up an errback to pass to the deps.
      this.depMaps = depMaps && depMaps.slice(0);
      this.errback = errback; //copy of 'source dependency array inputs' (i.e. "shim" deps by depMaps array)
      this.inited = true;
      this.ignore = options.ignore;
      if (options.enabled || this.enabled) return this.enable();
      this.check(); //init as, or previously, -enabled, yet dependencies unknown until init
    };
    const fetcher = () => {
      if (this.fetched) return null;
      this.fetched = true;
      CONTEXT.startTime = new Date().getTime();
      var map = this.map;
      if (this.shim) {
        CONTEXT.makeRequire(this.map, {
          enableBuildCallback: true
        })(
          this.shim.deps || [],
          bind(this, () => (map.prefix ? this.callPlugin() : this.load()))
        ); //plugin-managed resource
      } else return map.prefix ? this.callPlugin() : this.load(); //Regular dependency.
    };
    const bindExports = (id, factory) => {
      var err; //for define()'d  modules, use error listener,
      var cjsModule; //require errbacks should not be called (#699).
      var depExports = this.depExports; //Yet, if dependency-'onError,' use that.
      if (
        (this.events.error && this.map.isDefine) ||
        req.onError !== defaultOnError
      ) {
        try {
          exports = CONTEXT.execCb(id, factory, depExports, exports); //factory.apply(exports, depExports),
        } catch (e) {
          err = e;
        }
      } else exports = CONTEXT.execCb(id, factory, depExports, exports); // Favor return value over exports. If node/cjs in play,
      if (this.map.isDefine && exports === undefined) {
        cjsModule = this.module; // then will not have a return value anyway. Favor
        if (cjsModule) {
          exports = cjsModule.exports; // module.exports assignment over exports object.
        } else if (this.usingExports) exports = this.exports; //exports already set the defined value.
      }
      if (err) {
        err.requireMap = this.map;
        err.requireModules = this.map.isDefine ? [this.map.id] : null;
        err.requireType = this.map.isDefine ? "define" : "require";
        return onError((this.error = err));
      }
    };
    const defineModule = (id) => {
      var exports = this.exports; //in case factory redundant require call to module to
      var factory = this.factory; //define itself again
      this.defining = true;
      if (this.depCount < 1 && !this.defined) {
        if (isFunction(factory)) {
          bindExports(id, factory);
        } else exports = factory; //Just a literal value
        this.exports = exports;
        if (this.map.isDefine && !this.ignore) {
          defined[id] = exports;
          if (req.onResourceLoad) {
            var resLoadMaps = [];
            each(this.depMaps, (depMap) =>
              resLoadMaps.push(depMap.normalizedMap || depMap)
            );
            req.onResourceLoad(CONTEXT, this.map, resLoadMaps);
          }
        }
        cleanRegistry(id);
        this.defined = true;
      }
      this.defining = false; //Finished definition, so allow call-check again for 'define' notifications, by cycle.
      if (this.defined && !this.defineEmitted) {
        this.defineEmitted = true;
        this.emit("defined", this.exports);
        this.defineEmitComplete = true;
      }
    };
    const normalizeMod = (plugin, map) => {
      var name = this.map.name; //Normalize the ID if the plugin allows it.
      if (plugin.normalize)
        name =
          plugin.normalize(name, (name) =>
            normalize(
              name,
              this.map.parentMap ? this.map.parentMap.name : null, //parentName
              true,
              CONFIG.nodeIdCompat,
              CONFIG.map,
              CONFIG.pkgs
            )
          ) || ""; //prefix and name should already be normalized, no need
      var normalizedMap = makeModuleMap(
        map.prefix + "!" + name,
        this.map.parentMap,
        true
      ); //for applying map CONFIG again either.
      on(
        normalizedMap,
        "defined",
        bind(this, (value) => {
          this.map.normalizedMap = normalizedMap;
          this.init([], () => value, null, {
            enabled: true,
            ignore: true
          });
        })
      );
      var normalizedMod = getOwn(registry, normalizedMap.id);
      if (normalizedMod) {
        this.depMaps.push(normalizedMap); //Mark this as a dependency for this plugin, so it
        if (this.events.error)
          normalizedMod.on(
            "error",
            bind(this, (err) => this.emit("error", err))
          ); //can be traced for cycles.

        normalizedMod.enable();
      }
    };
    const loadFinish = (id, map, plugin) => {
      const load = bind(this, (factory) =>
        this.init([], () => factory, null, {
          enabled: true
        })
      ); //depMaps, factory, errback, options
      load.error = bind(this, (err) => {
        this.inited = true; //Remove temp unnormalized modules for this module,
        this.error = err; //since they will never be resolved otherwise now.
        err.requireModules = [id];
        eachProp(
          registry,
          (mod) =>
            mod.map.id.indexOf(id + "_unnormalized") === 0 &&
            cleanRegistry(mod.map.id)
        );
        onError(err);
      }); //Allow plugins to load other code without having to know the
      const localRequire = CONTEXT.makeRequire(map.parentMap, {
        enableBuildCallback: true
      }); //CONTEXT or how to 'complete' the load.
      const localreq = (text, textAlt) => {
        /*jslint evil: true */
        var moduleName = map.name;
        var moduleMap = makeModuleMap(moduleName); //2.1.0 onwards, pass text to reinforce fromText 1call/resource.
        var hasInteractive = useInteractive; //pass moduleName, ok, but discard moduleName for internal ref.
        if (textAlt) text = textAlt; //Turn off interactive script matching for IE for any define
        if (hasInteractive) useInteractive = false; //calls in the text, then turn it back on at the end.
        getModule(moduleMap); //Prime the system by creating a module instance for
        if (hasProp(CONFIG.config, id))
          CONFIG.config[moduleName] = CONFIG.config[id]; //Transfer any CONFIG to this other module.
        try {
          req.exec(text);
        } catch (e) {
          return onError(
            makeError(
              "fromtexteval",
              "fromText eval for " + id + " failed: " + e,
              e,
              [id]
            ) //id, msg, err, requireModules
          );
        }
        if (hasInteractive) useInteractive = true; //Mark this as a dependency for the plugin resource
        this.depMaps.push(moduleMap);
        CONTEXT.completeLoad(moduleName); //Support anonymous modules.
        localRequire([moduleName], load); //Bind the value of that module to the value for this resource ID.
      };
      load.fromText = bind(this, localreq);
      //Use parentName here since the plugin's name is not reliable,
      //could be some weird string with no path that actually wants to
      //reference the parentName's path.
      plugin.load(map.name, localRequire, load, CONFIG);
    };
    const callPlugin = () => {
      var map = this.map; //Map already normalized the prefix.
      var id = map.id; //Mark this as a dependency for this plugin, so it
      var pluginMap = makeModuleMap(map.prefix); //can be traced for cycles.
      this.depMaps.push(pluginMap);
      on(
        pluginMap,
        "defined",
        bind(this, (plugin) => {
          if (this.map.unnormalized) return normalizeMod(plugin, map); //If current map is not normalized, wait for that
          var bundleId = getOwn(bundlesMap, this.map.id); //normalized name to load instead of continuing.
          if (bundleId) {
            this.map.url = CONTEXT.nameToUrl(bundleId); //If a paths CONFIG, then just load that file instead to
            this.load(); //resolve the plugin, as it is built into that paths layer.
            return null;
          }
          loadFinish(id, map, plugin);
        })
      );
      CONTEXT.enable(pluginMap, this);
      this.pluginMaps[pluginMap.id] = pluginMap;
    };
    const enable = () => {
      enabledRegistry[this.map.id] = this; //no inadvertent load and 0 depCount by
      this.enabled = true; //immediate calls to the defined callbacks for dependencies
      this.enabling = true; //Enable each dependency
      each(
        this.depMaps,
        bind(this, (depMap, i) => {
          if (typeof depMap === "string") {
            depMap = makeModuleMap(
              depMap,
              this.map.isDefine ? this.map : this.map.parentMap,
              false,
              !this.skipMap
            ); //Dependency needs to be converted to a depMap
            this.depMaps[i] = depMap; //and wired up to this module.
            var handler = getOwn(handlers, depMap.id);
            if (handler) {
              this.depExports[i] = handler(this);
              return null;
            }
            this.depCount += 1;
            on(
              depMap,
              "defined",
              bind(this, (depExports) => {
                if (this.undefed) return null;
                this.defineDep(i, depExports);
                this.check();
              })
            );
            if (this.errback) {
              on(depMap, "error", bind(this, this.errback)); // propagate the error correctly - something else is listening for errors
            } else if (this.events.error)
              on(
                depMap,
                "error",
                bind(this, (err) => this.emit("error", err))
              ); // (No direct errback on this module)
          }
          var id = depMap.id; //Skip special modules like 'require', 'exports', 'module'
          var mod = registry[id];
          if (!hasProp(handlers, id) && mod && !mod.enabled)
            CONTEXT.enable(depMap, this); //don't call enable if it is already enabled (circular deps)
        })
      ); //dependency plugins, enabled
      eachProp(
        this.pluginMaps,
        bind(this, (pluginMap) => {
          var mod = getOwn(registry, pluginMap.id);
          if (mod && !mod.enabled) CONTEXT.enable(pluginMap, this);
        })
      );
      this.enabling = false;
      this.check();
    };

    Module.prototype = {
      init,
      defineDep: (i, depExports) => {
        if (!this.depMatched[i]) {
          this.depMatched[i] = true; //https://stackoverflow.com/questions/21939568/javascript-modules-prototype-vs-export
          this.depCount -= 1; //prototype is hydratable for async results, init only on this page by 'new' initialization
          this.depExports[i] = depExports; //multiple callback export cycles
        }
      },
      fetch: fetcher,
      load: () => {
        if (!urlFetched[this.map.url]) {
          urlFetched[this.map.url] = true; //Regular dependency.
          CONTEXT.load(this.map.id, this.map.url);
        }
      },
      check: () => {
        if (!this.enabled || this.enabling) return null;
        var id = this.map.id; // module is ready to, and does, define itself
        if (!this.inited) {
          if (!hasProp(CONTEXT.defQueueMap, id)) this.fetch(); // !defQueue.includes(this)
        } else if (this.error) {
          this.emit("error", this.error);
        } else if (!this.defining) defineModule(id);
      },
      callPlugin,
      enable,
      on: (name, cb) => {
        var cbs = this.events[name];
        if (!cbs) {
          cbs = this.events[name] = [];
        }
        cbs.push(cb);
      },
      emit: (name, evt) => {
        each(this.events[name], (cb) => {
          cb(evt);
        });
        if (name === "error")
          //remove broken Module instance from registry.
          delete this.events[name];
      }
    };
    const callGetModule = (args) =>
      !hasProp(defined, args[0]) &&
      getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]); //Skip modules already defined.
    const getScriptData = (evt) => {
      const removeListener = (node, func, name, ieName) => {
        if (node.detachEvent && !isOpera) {
          if (ieName) node.detachEvent(ieName, func);
        } else node.removeEventListener(name, func, false);
      };
      var node = evt.currentTarget || evt.srcElement; //REQUIREJS event info, remove listener from node //target
      removeListener(node, CONTEXT.onScriptLoad, "load", "onreadystatechange");
      removeListener(node, CONTEXT.onScriptError, "error");
      return {
        node: node,
        id: node && node.getAttribute("data-requiremodule")
      };
    };
    const makeRequire = (relMap, options) => {
      options = options || {};
      const localRequire = (deps, callback, errback) => {
        var id, map, requireMod;
        if (options.enableBuildCallback && callback && isFunction(callback))
          callback.__requireJsBuild = true;
        if (typeof deps === "string") {
          if (isFunction(callback))
            return onError(
              makeError("requireargs", "Invalid require call"), //Invalid call; id, msg, err, requireModules
              errback
            );
          if (relMap && hasProp(handlers, deps))
            return handlers[deps](registry[relMap.id]); //when require|exports|module are requested && while module is being defined
          if (req.get) return req.get(CONTEXT, deps, relMap, localRequire);
          map = makeModuleMap(deps, relMap, false, true);
          id = map.id; //Normalize module name from . or ..
          if (!hasProp(defined, id))
            return onError(
              makeError(
                "notloaded",
                'Module name "' +
                  id +
                  '" has not been loaded yet for CONTEXT: ' +
                  contextName +
                  (relMap ? "" : ". Use require([])")
              ) //id, msg, err, requireModules
            );
          return defined[id];
        }
        const intakeDefines = () => {
          var args;
          takeGlobalQueue(); //"intake modules"
          while (defQueue.length) {
            args = defQueue.shift();
            if (args[0] === null)
              return onError(
                makeError(
                  "mismatch",
                  "Mismatched anonymous define() module: " +
                    args[args.length - 1]
                ) //id, msg, err, requireModules
              );
            callGetModule(args); //...id, deps, factory; "normalized by define()"
          }
          CONTEXT.defQueueMap = {};
        };
        intakeDefines(); //Grab defines waiting in the dependency queue.
        CONTEXT.nextTick(() => {
          intakeDefines(); //Mark all the dependencies as needing to be loaded.
          requireMod = getModule(makeModuleMap(null, relMap)); //collect defines that could have been added since the 'require call'
          requireMod.skipMap = options.skipMap; //store if 'map CONFIG' applied to this 'require call' for dependencies
          requireMod.init(deps, callback, errback, {
            enabled: true
          });
          checkLoaded();
        });
        return localRequire;
      };
      mixin(localRequire, {
        isBrowser: isBrowser,
        toUrl: (moduleNamePlusExt) => {
          var ext; //URL path = module name + .extension; requires 'module name,' not 'plain URLs' like nameToUrl
          var index = moduleNamePlusExt.lastIndexOf(".");
          var segment = moduleNamePlusExt.split("/")[0];
          var isRelative = segment === "." || segment === "..";
          if (index !== -1 && (!isRelative || index > 1)) {
            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length); //file extension alias, not 'relative path dots'
            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
          }
          return CONTEXT.nameToUrl(
            normalize(
              moduleNamePlusExt,
              relMap && relMap.id,
              true,
              CONFIG.nodeIdCompat,
              CONFIG.map,
              CONFIG.pkgs
            ),
            ext,
            true
          );
        },
        defined: (id) =>
          hasProp(defined, makeModuleMap(id, relMap, false, true).id),
        specified: (id) => {
          id = makeModuleMap(id, relMap, false, true).id;
          return hasProp(defined, id) || hasProp(registry, id);
        }
      });
      if (!relMap)
        localRequire.undef = (id) => {
          takeGlobalQueue(); //Only allow undef on top level require calls
          var map = makeModuleMap(id, relMap, true); //Bind define() calls (fixes #408) to 'this' CONTEXT
          var mod = getOwn(registry, id);
          mod.undefed = true;
          removeScript(id, CONTEXT.contextName);
          delete defined[id];
          delete urlFetched[map.url];
          delete undefEvents[id];
          eachReverse(
            defQueue,
            (args, i) => args[0] === id && defQueue.splice(i, 1)
          ); //Clean queued defines, backwards, so splices don't destroy the iteration
          delete CONTEXT.defQueueMap[id];
          if (mod) {
            if (mod.events.defined) undefEvents[id] = mod.events; //if different CONFIG, same listeners
            cleanRegistry(id);
          }
        };
      return localRequire;
    };
    const configure = (configuration) => {
      if (
        configuration.baseUrl &&
        configuration.baseUrl.charAt(configuration.baseUrl.length - 1) !== "/"
      )
        configuration.baseUrl += "/"; //Make sure the baseUrl ends in a slash.
      if (typeof configuration.urlArgs === "string")
        configuration.urlArgs = (id, url) =>
          (url.indexOf("?") === -1 ? "?" : "&") + configuration.urlArgs; // Convert old style urlArgs string to a function.
      var shim = CONFIG.shim; //save paths for special "additive processing"
      var objs = {
        paths: true,
        bundles: true,
        CONFIG: true,
        map: true
      };
      eachProp(configuration, (value, prop) => {
        if (!objs[prop]) return (CONFIG[prop] = value);
        if (!CONFIG[prop]) CONFIG[prop] = {};
        mixin(CONFIG[prop], value, true, true);
      });
      if (configuration.bundles)
        eachProp(configuration.bundles, (value, prop) => {
          each(value, (v) => {
            if (v !== prop) bundlesMap[v] = prop; //Reverse map the bundles
          });
        });
      if (configuration.shim) {
        eachProp(configuration.shim, (value, id) => {
          if (isArray(value))
            value = {
              deps: value
            }; //Merge shim, Normalize the structure
          if ((value.exports || value.init) && !value.exportsFn)
            value.exportsFn = CONTEXT.makeShimExports(value);
          shim[id] = value;
        });
        CONFIG.shim = shim;
      }
      if (configuration.packages)
        each(configuration.packages, (pkgObj) => {
          var location, name; //Adjust packages if necessary.
          pkgObj = typeof pkgObj === "string" ? { name: pkgObj } : pkgObj;
          name = pkgObj.name;
          location = pkgObj.location;
          if (location) CONFIG.paths[name] = pkgObj.location;
          CONFIG.pkgs[name] =
            pkgObj.name +
            "/" +
            (pkgObj.main || "main").replace(/^\.\//, "").replace(/\.js$/, ""); //normalize pkg name main module ID pointer paths
        }); //Update maps for "waiting to execute" modules in the registry.
      eachProp(registry, (mod, id) => {
        if (!mod.inited && !mod.map.unnormalized)
          mod.map = makeModuleMap(id, null, true); //Info, like URLs to load, may have changed.
      }); //if inited and transient, unnormalized modules.
      if (configuration.deps || configuration.callback)
        CONTEXT.require(configuration.deps || [], configuration.callback); //When require is defined as a CONFIG object before require.js is loaded,
    }; //call require with those args, if a deps array or a CONFIG callback is specified

    CONTEXT = {
      CONFIG,
      contextName,
      registry,
      defined,
      urlFetched,
      defQueue,
      defQueueMap: {},
      Module,
      makeModuleMap,
      nextTick: req.nextTick,
      onError,
      configure,
      makeShimExports: (value) => {
        function fn() {
          var ret; //Shadowing of global property 'arguments'. (no-shadow-restricted-names)eslint
          if (value.init) ret = value.init.apply(dependency, arguments);
          return ret || (value.exports && getGlobal(value.exports));
        }
        return fn;
      },
      makeRequire,
      enable: (depMap) => {
        var mod = getOwn(registry, depMap.id); //if module is in registry, parent's CONTEXT when
        if (mod) getModule(depMap).enable(); // overridden in "optimizer" (Not shown).
      },
      completeLoad: (moduleName) => {
        var found, args; //method used "internally" by environment adapters script-load or a synchronous load call.
        takeGlobalQueue();
        while (defQueue.length) {
          args = defQueue.shift();
          if (args[0] === null) {
            args[0] = moduleName;
            if (found) break; //anonymous module bound to name already
            found = true; //this is another anon module waiting for its completeLoad to fire.
          } else if (args[0] === moduleName) found = true; //matched a define call in this script
          callGetModule(args);
        }
        CONTEXT.defQueueMap = {};
        var mod = getOwn(registry, moduleName); // in case-/init-calls change the registry
        if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
          var shim = getOwn(CONFIG.shim, moduleName) || {};
          if (
            CONFIG.enforceDefine &&
            (!shim.exports || !getGlobal(shim.exports))
          )
            return hasPathFallback(moduleName, CONFIG.paths)
              ? null
              : onError(
                  makeError(
                    "nodefine",
                    "No define call for " + moduleName,
                    null,
                    [moduleName]
                  ) //id, msg, err, requireModules
                );
          callGetModule([moduleName, shim.deps || [], shim.exportsFn]); //does not call define(), but simulated
        }
        checkLoaded();
      },
      nameToUrl: (moduleName, ext, skipExt) => {
        var pkgMain = getOwn(CONFIG.pkgs, moduleName); //already-normalized-moduleName as URL. Use toUrl for the public API.
        if (pkgMain) moduleName = pkgMain; //If slash or colon-protocol fileURLs contains "?" or even ends with ".js",
        var bundleId = getOwn(bundlesMap, moduleName); //assume use of an url, not a module id.
        if (bundleId) CONTEXT.nameToUrl(bundleId, ext, skipExt); //filter out dependencies that are already paths.
        const geturl = (url = "") => {
          //Just a plain path, not module name lookup, so just return it.
          if (/^[/:?.]|(.js)$/.test(moduleName)) {
            url = moduleName + (ext || ""); //Add extension if it is included. This is a bit wonky, only non-.js things pass
          } else {
            var paths = CONFIG.paths; //an extension, this method probably needs to be reworked.
            var syms = moduleName.split("/"); //A module that needs to be converted to a path.

            for (let i = syms.length; i > 0; i -= 1) {
              var parentModule = syms.slice(0, i).join("/"); //per module name segment if path registered, start name, and work up
              var parentPath = getOwn(paths, parentModule);
              if (parentPath) {
                if (isArray(parentPath)) parentPath = parentPath[0];
                syms.splice(0, i, parentPath); //array means a few choices
                break;
              }
            }
            url = syms.join("/"); //Join the path parts together, then figure out if baseUrl is needed.
            url +=
              ext || (/^data:|^blob:|\?/.test(url) || skipExt ? "" : ".js"); ///^data\:|^blob\:|\?/
            url =
              (url.charAt(0) === "/" || url.match(/^[\w+.-]+:/) ///^[\w\+\.\-]+:/
                ? ""
                : CONFIG.baseUrl) + url;
          }
          return url;
        };
        const url = geturl(); //Delegates to req.load. Broken out as a separate function to
        return CONFIG.urlArgs && !/^blob:/.test(url) //!/^blob\:/
          ? url + CONFIG.urlArgs(moduleName, url)
          : url; //allow overriding in the optimizer.
      },

      load: (id, url) => req.load(CONTEXT, id, url),
      //allow the build system to sequence the files in the built layer, correctly
      execCb: (name, callback, args, exports) => callback.apply(exports, args),
      onScriptLoad: (evt) => {
        if (
          evt.type === "load" ||
          readyRegExp.test((evt.currentTarget || evt.srcElement).readyState)
        ) {
          interactiveScript = null; //browser event for script loaded status
          var data = getScriptData(evt);
          CONTEXT.completeLoad(data.id);
        }
      },
      onScriptError: (evt) => {
        var data = getScriptData(evt);
        if (!hasPathFallback(data.id, CONFIG.paths)) {
          var parents = [];
          eachProp(
            registry,
            (value, key) =>
              key.indexOf("_@r") !== 0 &&
              each(value.depMaps, (depMap) => {
                if (depMap.id === data.id) {
                  parents.push(key);
                  return true;
                }
              })
          );
          return onError(
            makeError(
              "scripterror",
              'Script error for "' +
                data.id +
                (parents.length ? '", needed by: ' + parents.join(", ") : '"'),
              evt,
              [data.id]
            ) //id, msg, err, requireModules
          );
        }
      }
    };
    CONTEXT.require = CONTEXT.makeRequire();
    return CONTEXT;
  };
  var s = (req.s = {
    contexts,
    newContext
  }); //Create default CONTEXT.
  req({}); //'dependency require' CONTEXT-sensitive exported methods
  each(
    ["toUrl", "undef", "defined", "specified"],
    (prop) =>
      (req[prop] = function () {
        var ctx = contexts[defContextName]; //not the 'early binding to default CONTEXT,' but contexts during builds
        return ctx.require[prop].apply(ctx, arguments); //for the latest instance of the 'default CONTEXT CONFIG'
      })
  );
  if (isBrowser) {
    head = s.head = document.getElementsByTagName("head")[0]; //(IE6) BASE appendChild (http://dev.jquery.com/ticket/2709)
    baseElement = document.getElementsByTagName("base")[0];
    if (baseElement) head = s.head = baseElement.parentNode;
  }
  req.onError = defaultOnError;
  req.createNode = (CONFIG, moduleName, url) => {
    var node = CONFIG.xhtml
      ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script")
      : document.createElement("script"); // node for the load command in browser env
    node.type = CONFIG.scriptType || "text/javascript";
    node.charset = "utf-8";
    node.async = true;
    return node;
  };
  req.load = (CONTEXT, moduleName, url) => {
    var CONFIG = (CONTEXT && CONTEXT.CONFIG) || {},
      node; //handle load request (in browser env); 'CONTEXT' for state, 'moduleName' for name, 'url' for point
    if (isBrowser) {
      node = req.createNode(CONFIG, moduleName, url); //browser script tag //testing for "[native code" https://github.com/REQUIREJS/REQUIREJS/issues/273
      node.setAttribute("data-requirecontext", CONTEXT.contextName); //artificial native-browser support? https://github.com/REQUIREJS/REQUIREJS/issues/187
      node.setAttribute("data-requiremodule", moduleName); //![native code]. IE8, !node.attachEvent.toString()
      if (
        node.attachEvent &&
        !(
          node.attachEvent.toString &&
          node.attachEvent.toString().indexOf("[native code") < 0
        ) &&
        !isOpera
      ) {
        useInteractive = true; //IE (6-8) doesn't script-'onload,' right after executing the script, cannot "tie" anonymous define call to a name,
        node.attachEvent("onreadystatechange", CONTEXT.onScriptLoad); //yet for 'interactive'-script, 'readyState' triggers by 'define' call
        //IE9 "addEventListener and script onload firings" issues should actually 'onload' event script, right after the script execution
        //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
        //Opera.attachEvent does not follow the execution mode.
        //IE9+ 404s, and 'onreadystatechange' fires before the 'error' handlerunless 'addEventListener,'
      } else {
        node.addEventListener("load", CONTEXT.onScriptLoad, false); //yet that pathway not doing the 'execute, fire load event listener before next script'
        node.addEventListener("error", CONTEXT.onScriptError, false); //node.attachEvent('onerror', CONTEXT.onScriptError);
      }
      node.src = url; //Calling onNodeCreated after all properties on the node have been
      if (CONFIG.onNodeCreated)
        CONFIG.onNodeCreated(node, CONFIG, moduleName, url); //set, but before it is placed in the DOM.
      //IE 6-8 cache, script executes before the end
      currentlyAddingScript = node; //of the appendChild execution, so to tie an anonymous define
      if (baseElement) {
        head.insertBefore(node, baseElement); //call to the module name (which is stored on the node), hold on
      } else head.appendChild(node); //to a reference to this node, but clear after the DOM insertion.
      currentlyAddingScript = null;
      return node; // bug in WebKit where the worker gets garbage-collected after calling
    } else if (isWebWorker) {
      try {
        setTimeout(() => {}, 0); // importScripts(): https://webkit.org/b/153317, so, Post a task to the event loop
        importScripts(url);
        CONTEXT.completeLoad(moduleName); //Account for anonymous modules
      } catch (e) {
        CONTEXT.onError(
          makeError(
            "importscripts",
            "importScripts failed for " + moduleName + " at " + url,
            e,
            [moduleName]
          ) //id, msg, err, requireModules
        );
      }
    }
  };
  const getInteractiveScript = () => {
    if (interactiveScript && interactiveScript.readyState === "interactive")
      return interactiveScript;
    eachReverse(
      scripts(),
      (script) =>
        script.readyState === "interactive" && (interactiveScript = script)
    );
    return interactiveScript; //Look for a data-main script attribute, which could also adjust the baseUrl.
  }; //baseUrl from script tag with require.js in it.
  if (isBrowser && !configuration.skipDataMain)
    eachReverse(scripts(), (script) => {
      if (!head) head = script.parentNode; //Set 'head' and append children to script's parent
      dataMain = script.getAttribute("data-main"); //attribute 'data-main' script to load baseUrl, if it is not already set.
      if (dataMain) {
        mainScript = dataMain; //Preserve dataMain in case it is a path (i.e. contains '?')
        if (!configuration.baseUrl && mainScript.indexOf("!") === -1) {
          src = mainScript.split("/"); //baseUrl if data-main value is not a loader plugin module ID.
          mainScript = src.pop(); //data-main-directory as baseUrl
          subPath = src.length ? src.join("/") + "/" : "./";
          configuration.baseUrl = subPath; //Strip off trailing .js mainScript, as is now a module name.
        }
        mainScript = mainScript.replace(/\.js$/, ""); //If mainScript is still a mere path, fall back to dataMain
        if (/^[/:?.]|(.js)$/.test(mainScript)) mainScript = dataMain; //filter out dependencies that are already paths.//^\/|:|\?|\.js$
        configuration.deps = configuration.deps
          ? configuration.deps.concat(mainScript)
          : [mainScript]; //Put the data-main script in the files to load.
        return true;
      }
    });

  /*jslint evil: true */
  req.exec = (text) =>
    new Promise(
      (resolve, reject) =>
        new Function("resolve", `"use strict";return (${text})`)(resolve, text) //eval(text);
    );

  //Set up with CONFIG info.
  req(configuration);
})(require, timeout);

const Required = () => {
  return { require, define };
};
export { Required as default };
