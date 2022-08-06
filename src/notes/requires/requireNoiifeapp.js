/**UNLICENSED BUT FOR PARTS OF OTHERS */

/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.3.6.carducci Copyright jQuery Foundation and other contributors.
 * Released under MIT license, https://github.com/REQUIREJS/REQUIREJS/blob/master/LICENSE
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with REQUIREJS.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*dependency window, navigator, document, importScripts, setTimeout, opera */
var Ar = "[object Array]",
  Fn = "[object Function]",
  _K = Object.keys,
  _S = Object.prototype.toString,
  _H = "hasOwnProperty",
  _P = "prototype",
  _SA = "setAttribute",
  _AE = "attachEvent",
  _AEL = "addEventListener",
  ctxReqProps = ["toUrl", "undef", "defined", "specified"],
  isBrowser = !!(
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    window.document
  ),
  isWebWorker = !isBrowser && typeof importScripts !== "undefined",
  //'loading', 'loaded', execution, 'complete'
  readyRegExp =
    isBrowser && navigator.platform === "PLAYSTATION 3"
      ? /^complete$/
      : /^(complete|loaded)$/,
  us = "_",
  //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
  isOpera =
    typeof opera !== "undefined" && opera.toString() === "[object Opera]",
  ctxs = {},
  createElement = (ns) =>
    document[`createElementNS${ns ? "NS" : ""}`](
      ns ? ("http://www.w3.org/1999/xhtml", "html:script") : "script"
    ),
  REQUIREJS,
  define,
  require,
  timeout = typeof setTimeout === "undefined" ? undefined : setTimeout;
/*
e_
mixin
BINDABLES.mk
concat

require=(dep,to)=>{
  define
  configuration(config?!require,req)
  convertName
  rmvScript
  hasPathFallback
  parseName
  normalize
  module
  Module
  req
  obj

  require=req
  newContext = {
    CONTEXT:{CG}
    dependencies
    makeModuleMap
    getModule
    on
    onError
    handlers
    clrRegstr
    checkLoaded
    init
    normalizeMod
    Module[_P]={init,defineDep,fetch,load,check,callPlugin,enable,on,emit}
    callGetModule
    getScriptData
    tkeGblQue
    evt
    CONTEXT:{…initial:{CG}}
    CONTEXT.require = CONTEXT.makeRequire()
    return CONTEXT
  }
  
  s = req.s
  req({})
  ctxReqProps
  head
  onError,createNode,load
  exec 
  req()
}
*/

const e_ = (obj /*,string*/) => {
  const n = (NS) => NS.constructor === "String" && NS.toUpperCase() === "NS";
  //prettier-ignore
  const yes = (name)=>obj[_P][_H](name), string=()=>_S(obj), tag= (ind) => document.getElementsByTagName(obj ? obj : "script")[ind];
  return {
    yes,
    reducer: (prop, nextProp) =>
      !obj[0]
        ? obj[1]
        : (obj[2] || !e_(obj[1]).yes(prop)) &&
          ((
            v,
            //prettier-ignore
            go = obj[3] && typeof v === "object" && v && !e_(v).a() && !e_(v).string() === Fn &&  !(v instanceof RegExp)
          ) => {
            obj[1][prop] = !go ? v : obj[1][prop] ? obj[1][prop] : {};
            BINDABLES.mixin(obj[1][prop], v, obj[2], obj[3]);
            return obj[1];
          })(obj[0][prop]), //s,tgt,frc,dSM
    create: (ns = n) => createElement(ns),
    string,
    a: (x) => x.string() === Ar,
    tag,
    interA: (x) => x.readyState === "interactive"
  };
}; //obj.prototype["hasOwnProperty"][name]; const method =string?"toString":"hasOwnProperty"

var interscrpt,
  scriptPends,
  defineables = [],
  version = "2.3.6.carducci",
  configuration = {},
  useInteractive = false,
  ctx,
  ga = "getAttribute",
  module = {}; //"this";

const _p = "packages",
  _b = "bundles",
  _s = "shim",
  _l = "location",
  _u = "baseUrl",
  _a = "urlArgs",
  _t = "string",
  _xf = "exportsFn",
  _x = "exports",
  _m = "module",
  _o = "onError",
  _dd = "defined",
  _dg = "defining",
  _ed = "enabled",
  _e = "error",
  _em = "emit",
  _ev = "events",
  _i = "init",
  _n = "undefined",
  _r = "require";
const BINDABLES = {
  mixin: (tgt, s, frc, dSM) =>
    _K(s).reduce(e_([s, tgt, frc, dSM]).reducer(), tgt),
  mk: (err) =>
    err.constructor === Object
      ? err
      : {
          //prettier-ignore
          ...new Error(`${err[1]}\nhttps://REQUIREJS.org/docs/errors.html#${err[0]}`),
          requireType: err[0],
          ids: err[3],
          originalError: err[2]
        }, //t, m, e, ids
  concat: (
    { ds, cb } = (ds, cb) => {
      return {
        cb: cb
          .toString()
          .replace(
            /\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/gm /*comment */,
            (match, singlePrefix) => singlePrefix || ""
          )
          .replace(
            /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g /*requires */,
            (match, dep) => ds.push(dep)
          ),
        ds
      };
    } /*like ')//comment'; keep prefix*/
  ) => (cb.length === 1 ? [_r] : [_r, _x, _m]).concat(ds), //Potential-CommonJS use-case of exports and module, without 'require.';
  convertName: (nm, mp, applyMap, ph) => {
    if (!applyMap || !mp || (!ph && !mp["*"])) return nm;
    var n,
      i,
      map,
      starMap,
      nms = nm.split("/"),
      mpcf = mp && mp["*"]; //continue search ___ map CG, bigloop:
    for (let g = nms.length; g > 0; g -= 1) {
      var name = nms.slice(0, g).join("/"); //favor a "star map" unless shorter matching CG
      // prettier-ignore
      !starMap && mpcf && e_(mpcf).yes(name)&& (() => {starMap = mpcf[name];n = g;})();
      ph &&
        (() => {
          for (let f = ph.length; f > 0; f--) {
            const fP = ph.slice(0, f).join("/"),
              mV = e_(mp).yes(fP) && mp[fP];
            if (!mV) continue;
            const s = e_(mV).yes(name) && mV[name];
            i = s ? g : i;
            if (s) break;
          }
        })();
    } // bigloop; //Match, update name to the new value.
    if (map) return (nm = nms.splice(0, i, map).join("/"));
    if (starMap) {
      map = starMap;
      i = n;
    }
    return nm;
  },
  dr: (m) => `data-require${m ? _m : "context"}`,
  rmvScrpt: (name, ctn) => {
    const ga = "getAttribute",
      e = (m) => (m ? name : ctn); //scriptNode
    return (
      isBrowser &&
      e_()
        .tag()
        .forEach(
          (sN) =>
            sN[ga](BINDABLES.dr(true)) === e(true) &&
            sN[ga](BINDABLES.dr()) === e() &&
            sN.parentNode.removeChild(sN)
        )
    );
  },
  hasPathFallback: (id, cP, ctx) => {
    var pC = e_(cP).yes(id) && cP[id]; //pathConfig,configPaths
    if (pC && e_(pC).string() === Ar && pC.length > 1) {
      pC.shift(); //config is live? but 'id' is variable as args.. [for the?] next try
      ctx.require.undef(id);
      ctx.makeRequire(null, { skipMap: true })([id]);
      return true;
    }
  },
  //'applyMap' for dependency ID, 'baseName' relative to 'name,' the most relative
  parseName: (nm, roots, conId) =>
    nm &&
    (() => {
      nm = nm.split("/");
      const l = nm.length - 1,
        isjs = /\.js$/,
        suffjs = conId && isjs.test(nm[l]);
      if (suffjs) nm[l] = nm[l].replace(isjs, "");
      if (nm[0].charAt(0) === "." && roots)
        nm = roots.slice(0, roots.length - 1).concat(nm); //Adjust any relative paths. node allows either .js or non .js, yet not in nameToUrl;baseName.push(nm), but new instead of length report
      for (let i = 0; i < nm.length; i++) {
        const solid = nm[i] === "." && nm.splice(i, 1); //:part === "..":null
        i = solid ? i - 1 : i;
        if (solid) continue;
        const more =
          i === 0 || (i === 1 && nm[2] === "..") || nm[i - 1] === "..";
        if (!more && i > 0 && nm.splice(i - 1, 2)) i -= 2;
      }
      return nm.join("/");
    })(), //just enabled, but unactivated, modules

  normalize: (nm, bn, applyMap, conId, map, configPkgs) => {
    const rs = bn && bn.split("/");
    nm = BINDABLES.parseName(nm, rs, conId);
    nm = BINDABLES.convertName(nm, map, applyMap, rs);
    return e_(configPkgs).yes(nm) ? configPkgs[nm] : nm;
  }, // If package-name, package 'main,' roots

  Module: (map, unDE, configShim) => {
    const obj = {
      events: (e_(unDE).yes(map.id) && unDE[map.id]) || {},
      map: map,
      shim: e_(configShim).yes(map.id) && configShim[map.id],
      depExports: [],
      depMaps: [],
      depMatched: [],
      pluginMaps: {},
      depCount: 0
    };
    _K(obj).forEach((key) => (module[key] = obj[key]));
  } //module.exports; module.factory; module.depMaps = [], module[_ed], module.fetched
};
/*const construct = (f, obj) =>
  function () {
    //in original JQuery RequireJS, obj is this or module
    f.apply(obj, arguments);
  }; //Function.prototype.construct (bind), with 'module' //https://stackoverflow.com/a/46700616/11711280*/
//const defaultOnError = (err) => err;

const d = (nm, ds, c) => {
  const copy = { nm, ds, c }; //Allow for anonymous modules
  if (typeof nm !== _t) {
    nm = null;
    ds = copy.nm;
    c = copy.ds;
  } else if (e_(ds).string() !== Ar) {
    ds = null;
    c = copy.ds;
  }
  if (!ds && e_(c).string() === Fn && c.length) ds = BINDABLES.concat(ds, c); // no deps nor name + cb is func => then CommonJS
  if (useInteractive) {
    const n =
      scriptPends ||
      (() => {
        if (interscrpt && e_(interscrpt).interA()) return interscrpt;
        // prettier-ignore
        e_().tag().sort((a, b) => b - a)
          .map((script) => e_(script).interA() && (interscrpt = script));
        return interscrpt;
      })();
    if (!nm) nm = n[ga](BINDABLES.dr(true));
    ctx = ctxs[n[ga](BINDABLES.dr())];
  }
  //getInteractiveScript Look for a data-main script attribute, which could also adjust the baseUrl. baseUrl from script tag with require.js in it.

  if (!ctx) return defineables.push([nm, ds, c]);
  ctx.defQueue.push([nm, ds, c]);
  ctx.defQueueMap[nm] = true;
};
define = (() => {
  //module named by onload event, for anonymous modules or without context; IE 6-8 anonymous define() call, requires interactive document.getElementsByTagName("script")
  d.amd = { jQuery: true };
  return d;
})();
require = ((dependency, setTimeout) => {
  //prettier-ignore
  const { dr,normalize,hasPathFallback,rmvScrpt,Module } = BINDABLES;

  //Do not overwrite an existing REQUIREJS instance/ amd loader.
  if (typeof define !== _n) return; // package-names, cb, returns a value to define the module of argument index[0]

  if (typeof REQUIREJS !== _u) {
    if (e_(REQUIREJS).string() === Fn) return null;
    configuration = REQUIREJS;
    REQUIREJS = undefined;
  }
  if (typeof require !== _n && !e_(require).string() === Fn) {
    configuration = require; //require is a CG object.
    require = undefined;
  }

  //(name,baseName,applyMap,configNodeIdCompat,configMap,configPkgs)

  var req = (REQUIREJS = (ds, cb, eb, optional) => {
    var ctx,
      cfg,
      ctn = us; //Caja compliant req for minified-scope name of dependency, cb for arr completion Find the right CONTEXT, use default
    if (!e_(ds).string() === Ar && typeof ds !== _t)
      //prettier-ignore
      (() => {
        cfg = ds;
        return !e_(cb).a() ? (ds = []) : (() => { ds = cb; cb = eb; eb = optional; })();
      })(); // Determine if have CG object in the call. ds is a CG object Adjust args if there are dependencies
    if (cfg && cfg.context) ctn = cfg.context;
    ctx = e_(ctxs).yes(ctn) && ctxs[ctn];
    if (!ctx) ctx = ctxs[ctn] = req.s.newContext(ctn);
    if (cfg) ctx.configure(cfg);
    return ctx.require(ds, cb, eb);
  });
  const obj = {
    CG: (cfg) => req(cfg),
    nextTick: (fn) => (typeof setTimeout !== _n ? setTimeout(fn, 4) : fn())
  }; // globally agreed names for other potential AMD loaders
  _K(obj).forEach((key) => (req[key] = obj[key]));
  if (!require) require = req; //Exportable require
  ["version", "isBrowser"].forEach(
    (key) => (req.key = { version, isBrowser }[key])
  );
  var dataMain, baseElement, mainScript, subPath, src, head;
  const newContext = (ctn) => {
    //prettier-ignore
    var CONTEXT = {CG: {waitSeconds: 7,baseUrl: "./",paths: {},bundles: {},pkgs: {},shim: {},config: {}}};
    var { CG } = CONTEXT;
    const iifeapp = (keys) =>
      ((z, keys) =>
        function () {
          keys.forEach((x, i) => (z[x] = arguments[i]));
        })(this, keys); //this should relate to wherever function runs (fat has no 'this', iife can to append this[key])
    //prettier-ignore
    var dependencies={},enRgtry={},unDE={},defQueue=[],defined={},urlFchd={},bdlMap={},rqrCnt=1,abnCnt=1; //abnormalCount - normalize() will run faster if there is no default //BR "bindingsRequire"
    const BR = {
      makeModuleMap: function () {
        //n, sourcemap, isNormed, applyMap
        var n = arguments[0],
          sourcemap = arguments[1],
          isNormed = arguments[2],
          applyMap = arguments[3];
        //prettier-ignore
        var ptName = sourcemap ? sourcemap.name : null,gvnName = n,yesdef = true; //'applyMap' for dependency ID, 'isNormed' define() module ID, '[sourcemap]' to resolve relative names (&& require.normalize()), 'name' the most relative
        if (!n) yesdef = false;
        n = n ? n : "_@r" + (rqrCnt += 1); //internally-name a 'require' call, given no name

        const splitPrefix = (i = (n) => n.indexOf("!")) =>
          i > -1 ? [n.substring(0, i), n.substring(i + 1, n.length)] : [n, ""];
        //[plugin=undefined, resource={}] if the name without a plugin prefix.
        var names = splitPrefix(n),
          p = names[0],
          pM,
          url; //pluginModule
        const configGets = [CG.nodeIdCompat, CG.map, CG.pkgs];
        var normed = "",
          id,
          suffix = p && !pM && !isNormed ? "_unnormalized" + (abnCnt += 1) : ""; //If it may be a plugin id that doesn't normalization, stamp it with a unique ID

        n = names[1];
        if (n)
          p
            ? iifeapp(
                ["normed", "id"],
                isNormed
                  ? n
                  : pM && pM.normalize
                  ? //prettier-ignore
                    pM.normalize(n, (n) => normalize(n, ptName, applyMap, ...configGets))
                  : n.indexOf("!") === -1
                  ? normalize(n, ptName, applyMap, ...configGets)
                  : n,
                p + "!" + normed + suffix
              )
            : iifeapp(
                ["normed", "names", "p", "normed", "isNormed", "url", "id"],
                normalize(n, ptName, applyMap, ...configGets),
                splitPrefix(normed),
                names[0],
                names[1],
                true,
                CONTEXT.nameToUrl(normed),
                normed + suffix
              );

        //do not normalize if nested plugin references; albeit module deprecates resourceIds,
        //normalize after plugins are loaded and such normalizations allow for async loading of a loader plugin (#1131)
        //ok base name, relative path?.normalize's 'map CG application' might make normalized 'name' a plugin ID.'map CG values' are already normalized at module point.
        var //prettier-ignore
          fin = {prefix:p,name: normed,parentMap: sourcemap,unnormalized: !!suffix,url,gvnName,yesdef,id};
        return fin;
      }, //module mapping includes plugin prefix, module name, and path
      dp: function () {
        return {
          depMap: arguments[0],
          m:
            e_(dependencies).yes(arguments[0].id) &&
            dependencies[arguments[0].id]
        };
      },
      getModule: ({ m, depMap } = BR.dp) =>
        //prettier-ignore
        m ? m : (dependencies[depMap.id] = new CONTEXT.Module(depMap,unDE,CG.shim)),
      on: ({ m, depMap } = BR.dp, name, f) => {
        if (!e_(defined).yes(depMap.id) || (m && !m.defineEmitComplete))
          return name === _dd && f(defined[depMap.id]);
        m = BINDABLES.getModule(depMap);
        if (m[_e] && name === _e) return f(m[_e]);
        m["on"](name, f);
      },
      onError: (err = BINDABLES.mk, eb) => {
        var moderr = false;
        if (eb) return eb(err);
        err.ids.forEach(
          (
            md = (
              errormodules = (err) =>
                e_(dependencies).yes(err) && dependencies[err]
            ) => {
              return {
                ...errormodules,
                error: err
              };
            }
          ) => (moderr = md[_ev] && md[_ev][_e] && md[_em](_e, err) && true)
        );
        if (!moderr) req[_o](err);
      }
    };
    var handlers = {
      require: (m) =>
        !m.require ? (m.require = CONTEXT.makeRequire(m.map)) : m.require,
      exports: (m) => {
        //prettier-ignore
        m.usingExports=true;
        if (!m.map.yesdef) return null;
        if (!m[_x]) return (m[_x] = defined[m.map.id] = {});
        return (defined[m.map.id] = m[_x]);
      },
      module:
        //prettier-ignore
        (m) =>(m[_m] = !m[_m]? {id: m.map.id,uri: m.map.url,config:()=>e_(CG.config).yes(m.map.id)
                  ? CG.config[m.map.id]:{},exports: m[_x] || (m[_x] = {})}: m[_m])
    };
    //prettier-ignore
    const clrRegstr = (id) => {delete dependencies[id];delete enRgtry[id];};
    var clrsec, watch;
    const { mixin } = BINDABLES;
    const { makeModuleMap, on, onError, getModule } = BR;

    const BM = {
      checkLoaded: () => {
        var err,
          fb,
          hs = [],
          reqCalls = [],
          wait = false,
          another = true,
          sec = CG.waitSeconds * 1000,
          halt = sec && CONTEXT.startTime + sec < new Date().getTime(); //It is possible to disable the wait interval by using waitSeconds of 0.
        // waitInterval - Do not bother if module call was a result of a cycle break.  hoist-"mixin" functional obj[prop]  traced,processed
        if (watch) return null;
        const mx = (m) => ({ m, s: m.depMaps, i: m.map.id });
        const progress = ({ m, s, i } = mx, t = {}, p = {}) => {
          t[i] = true;
          s.forEach((i = (d) => d.id, ix) => {
            var dep = e_(dependencies).yes(i) && dependencies[i]; // depMap force undefined (registered yet not matched in module)
            const c = dep && !m.depMatched[ix] && !p[i];
            // prettier-ignore
            if (c && (!e_(t).yes(i) || !t[i])) return progress(dep, t, p);
            // prettier-ignore
            c && m.defineDep(ix, defined[i]);
            c && m.check(); //pass false?
          });
          p[i] = true;
        };
        const brwr = isBrowser || isWebWorker;
        watch = true;
        const er = _e,
          mxx = (mod = (x) => enRgtry[x]) => {
            const { yesdef, fetched, prefix, error, enabled, inited } = mod.map;
            if (enabled && !yesdef) reqCalls.push(mod);
            mod.noCyc = fetched && yesdef && !prefix;
            return !inited && enabled && !error ? mod : {};
          };
        _K(enRgtry).forEach(({ id, noCyc } = mxx, i) =>
          id && halt && !hasPathFallback(id, CG.paths)
            ? rmvScrpt(id, CONTEXT.ctn) && hs.push(id)
            : id &&
              (() => {
                fb = halt && true;
                wait = true;
                another = !halt && noCyc ? false : another;
              })()
        ); //non-plugin-resource; Figure out the state of all the modules.//disabled or in error
        if (halt && hs.length) {
          // prettier-ignore
          err = BINDABLES.mk(["timeout", "Load timeout for modules: " + hs, null, hs]); //type, msg, err, requireModules
          err.ctn = CONTEXT.ctn;
          return onError(err); //If wait time expired, throw error of unloaded modules.
        } else
          (() => {
            another &&
              reqCalls.forEach((m) =>
                m[er] ? m[_em](er, m[er]) : progress(m)
              ); //breakCycle
            (() => {
              watch = false;
              clrsec =
                (!halt || fb) &&
                wait &&
                brwr &&
                !clrsec &&
                setTimeout(() => BM.checkLoaded() && null, 50);
            })(); /*plugin-resource*/
          })();
      },
      //[], () => d, null,{enabled: true,ignore: true} if multiple define calls for the same module
      init: (depMaps, factory, eb, o = (o) => o || {}) => {
        // prettier-ignore
        if (module["inited"]) return null;
        module["factory"] = factory; //Register for errors on module module.
        if (eb) {
          module.on(_e, eb); //If no eb already, but there are error listeners
          // prettier-ignore
        } else if (module.events[_e]) eb = (err) => module.emit(_e, err); //construct((err) => module.emit(_e, err), module); //on module module, set up an eb to pass to the ds.
        // prettier-ignore
        const obj = {depMaps: depMaps && depMaps.slice(0),eb,inited: true,ignore: o.ignore}; //copy of 'source dependency arr inputs' (i.e. "shim" ds by depMaps arr)
        _K(obj).forEach((key) => (module[key] = obj[key]));
        if (o[_ed] || module[_ed]) return module.enable();
        module.check();
      }, //init as, or previously, -enabled, yet dependencies unknown until init

      normalizeMod: (plugin, mp) => {
        var { name, parentMap: pM } = module.map; //Normalize the ID if the plugin allows it.
        const { nodeIdCompat, map, pkgs } = CG;
        // prettier-ignore
        const namer = (name) => [name,pM ? pM.name : null,true,nodeIdCompat,map,pkgs]; //ptName
        if (plugin.normalize)
          name =
            plugin.normalize(name, (args = namer) => normalize(args)) || ""; //prefix and name should already be normalized, no need
        var nM = makeModuleMap(mp.prefix + "!" + name, pM, true); //normalizedMap -for applying map CG again either.
        on(nM, _dd, (d) => {
          module.map.normalizedMap = nM;
          module[_i]([], () => d, null, { enabled: true, ignore: true });
        }); //construct
        var normMod = e_(dependencies).yes(nM.id) && dependencies[nM.id]; //normalizedMod
        if (normMod) {
          module["depMaps"].push(nM);
          if (module.events[_e]) normMod.on(_e, (err) => module.emit(_e, err)); //Mark module as a dependency for module plugin, so it can be traced for cycles.
          normMod.enable();
        }
      }
    };
    Module[_P] = {
      init: BM[_i],
      defineDep: (i, depExports) => {
        if (!module.depMatched[i]) {
          module.depMatched[i] = true; //https://stackoverflow.com/questions/21939568/javascript-modules-prototype-vs-export
          module.depCount -= 1; //prototype is hydratable for async results, init only on module page by 'new' initialization
          module.depExports[i] = depExports; //multiple cb export cycles
        }
      },
      fetch: () => {
        if (module.fetched) return null;
        module.fetched = true;
        CONTEXT.startTime = new Date().getTime();
        var map = module.map;
        if (module.shim) {
          CONTEXT.makeRequire(module.map, { enableBuildCallback: true })(
            module.shim.ds || [],
            map.prefix ? module.callPlugin() : module.load()
          ); //plugin-managed resource
        } else return map.prefix ? module.callPlugin() : module.load();
      }, //Regular dependency.
      load: () => {
        if (!urlFchd[module.map.url]) {
          urlFchd[module.map.url] = true;
          CONTEXT.load(module.map.id, module.map.url);
        }
      }, //Regular dependency.
      check: () => {
        if (!module[_ed] || module.enabling) return null;
        var id = module.map.id;
        if (!module["inited"])
          return !e_(CONTEXT.defQueueMap).yes(id) && module.fetch();
        if (module[_dg]) return module[_e] && module.emit(_e, module[_e]); // !defQueue.includes(module) module is ready to, and does, define itself
        var expts = module[_x],
          factory = module.factory;
        module[_dg] = true; //no redundant require-define
        if (module.depCount < 1 && !module.defined) {
          const isDefine = module.map.yesdef;
          if (e_(factory).string() === Fn) {
            var err,
              cjs,
              depExpo = module.depExports; //for define()'d  modules, use error listener, require errbacks should not be called (#699). Yet, if dependency-'onError,' use that.

            if ((module.events[_e] && isDefine) || req[_o] !== ((err) => err)) {
              // prettier-ignore
              try { expts = CONTEXT.execCb(id, factory, depExpo, expts);} catch (e) { err = e;} //factory.apply(exports, depExports),
            } else expts = CONTEXT.execCb(id, factory, depExpo, expts);
            if (isDefine && expts === undefined) {
              cjs = module[_m]; // Favor return value over exports. If node/cjs in play, then will not have a return value anyway. Favor
              if (cjs) {
                expts = cjs[_x];
              } else if (module.usingExports) expts = module[_x];
            } // module.exports assignment over exports object. exports already set the defined value.

            err &&
              ((
                obj = {
                  requireMap: module.map,
                  requireModules: isDefine ? [module.map.id] : null,
                  requireType: isDefine ? "define" : _r
                }
              ) => {
                _K(obj).forEach((key) => (err[key] = obj[key]));
                return onError((module[_e] = err));
              })();
          } else expts = factory;

          module[_x] = expts;
          if (isDefine && !module.ignore) {
            defined[id] = expts;
            if (req.onResourceLoad)
              // prettier-ignore
              req.onResourceLoad(CONTEXT,module.map,module["depMaps"].map((depMap) => depMap.normalizedMap || depMap));
          }
          clrRegstr(id);
          module[_dd] = true;
        }
        module[_dg] = false; //Finished definition, so allow call-check again for 'define' notifications, by cycle.
        // prettier-ignore
        if(module[_dd]&&!module.defineEmitted){module["defineEmitted"]=true;module.emit(_dd, module[_x]);module["defineEmitComplete"] = true;}
      },
      callPlugin: () => {
        var map = module.map; //Map already normalized the prefix.
        var id = map.id; //Mark module as a dependency for module plugin, so it
        var pluginMap = makeModuleMap(map.prefix); //can be traced for cycles.
        module.depMaps.push(pluginMap);
        on(pluginMap, _dd, (plugin) => {
          if (module.map.unnormalized) return BM.normalizeMod(plugin, map); //If current map is not normalized, wait for that
          var bundleId = e_(bdlMap).yes(module.map.id) && bdlMap[module.map.id]; //normalized name to load instead of continuing.

          // prettier-ignore
          if (bundleId) {module.map.url = CONTEXT.nameToUrl(bundleId);module.load();return null;} //If a paths CG, then just load that file instead to resolve the plugin, as it is built into that paths layer.
          const load = (factory) =>
            module[_i]([], () => factory, null, { enabled: true }); //depMaps, factory, eb, options
          load[_e] = (err) => {
            module["inited"] = true;
            module[_e] = err;
            err.requireModules = [id];
            _K(dependencies).forEach(
              (x, i) =>
                dependencies[x].map.id.indexOf(id + "_unnormalized") === 0 &&
                clrRegstr(dependencies[x].map.id)
            );
            onError(err);
          }; //Remove temp unnormalized modules for module module, since they will never be resolved otherwise now. Allow plugins to load other code without having to know the
          const localRequire = CONTEXT.makeRequire(map.parentMap, {
            enableBuildCallback: true
          }); //CONTEXT or how to 'complete' the load.

          load.fromText = (text, textAlt) => {
            /*jslint evil: true */
            var mN = map.name,
              moduleMap = makeModuleMap(mN),
              hasInteractive = useInteractive; //2.1.0 onwards, pass text to reinforce fromText 1call/resource. pass mN, ok, but discard mN for internal ref.
            if (textAlt) text = textAlt;
            if (hasInteractive) useInteractive = false; //Turn off interactive script matching for IE for any define; calls in the text, then turn it back on at the end.
            getModule(moduleMap); //Prime the system by creating a module instance for
            if (e_(CG.config).yes(id)) CG.config[mN] = CG.config[id]; //Transfer any CG to module other module.
            try {
              req.exec(text);
            } catch (e) {
              return onError(
                BINDABLES.mk([
                  "fromtexteval",
                  `fromText eval for ${id} failed: ${e}`,
                  e,
                  [id]
                ])
              );
            } //type, msg, err, requireModules
            if (hasInteractive) useInteractive = true; //Mark module as a dependency for the plugin resource
            module.depMaps.push(moduleMap);
            CONTEXT.completeLoad(mN);
            localRequire([mN], load); //Support anonymous modules. Bind the value of that module to the value for module resource ID.
          };
          plugin.load(map.name, localRequire, load, CG); //Use ptName here since the plugin's name is not reliable, could be some weird string with no path that actually wants to reference the ptName's path.
        });
        CONTEXT.enable(pluginMap, module);
        module.pluginMaps[pluginMap.id] = pluginMap;
      },
      enable: () => {
        enRgtry[module.map.id] = module;
        module[_ed] = true;
        module.enabling = true; //no inadvertent load and 0 depCount by
        //immediate calls to the defined callbacks for dependencies. Enable mapFunction 1,dependency
        module.depMaps.forEach((depMap, i) => {
          if (typeof depMap === _t) {
            // prettier-ignore
            const mp=module.map.yesdef?module.map:module.map.parentMap;
            depMap = makeModuleMap(depMap, mp, false, !module.skipMap); //Dependency needs to be converted to a depMap
            module.depMaps[i] = depMap; //and wired up to module module.
            var handler = e_(handlers).yes(depMap.id) && handlers[depMap.id];
            if (handler) return (module.depExports[i] = handler(module));
            module["depCount"] += 1;
            // prettier-ignore

            on(depMap, _dd, (depExports) => {
              if(module.undefed)return null;module.defineDep(i, depExports);module.check();});
            if (module.eb) {
              on(depMap, _e, module.eb); // propagate the error correctly - something else is listening for errors
            } else if (module.events[_e])
              on(depMap, _e, (err) => module.emit(_e, err));
          } // (No direct eb on module module)
          var id = depMap.id,
            m = dependencies[id]; //Skip special modules like 'require', 'exports', 'module'
          if (!e_(handlers).yes(id) && m && !m[_ed])
            CONTEXT.enable(depMap, module);
        }); //don't call enable if it is already enabled (circular ds)

        _K(module.pluginMaps).forEach(
          (pM = (x) => module.pluginMaps[x], i) =>
            e_(dependencies).yes(pM.id) &&
            dependencies[pM.id] &&
            !dependencies[pM.id][_ed] &&
            CONTEXT.enable(pM, module)
        );
        module.enabling = false;
        module.check();
      },
      //prettier-ignore
      on:(name,cb)=>{var cbs=module.events[name];if(!cbs)cbs=module.events[name]=[];cbs.push(cb);},
      //prettier-ignore
      emit:(name,evt)=>{module.events[name].forEach((cb) => cb(evt));if (name === _e)delete module.events[name];}
    }; //remove broken Module instance from dependencies.//BS/BF 'bindingsFetch'
    const BF = {
      //prettier-ignore
      callGetModule: (args) => !e_(defined).yes(args[0]) && getModule(makeModuleMap(args[0], null, true))[_i](args[1], args[2]), //Skip modules already defined.
      getScriptData: (
        { r, n } = (evt) => {
          return {
            r: (node, func, name, ieName) =>
              //prettier-ignore
              !node.detachEvent || isOpera ? node.removeEventListener(name, func, false) : ieName && node.detachEvent(ieName, func),
            n: evt.currentTarget || evt.srcElement //REQUIREJS event info, remove listener from node //target
          };
        }
      ) => {
        r(n, CONTEXT.onScriptLoad, "load", "onreadystatechange");
        r(n, CONTEXT.onScriptError, _e);
        return { node: n, id: n && n.getAttribute(dr(true)) };
      },
      //prettier-ignore
      tkeGblQue :() => {if (defineables.length)defineables.forEach((queueItem) => {
          var id = queueItem[0];if (typeof id === _t) CONTEXT.defQueueMap[id] = true;//globalQueue by internal method to module defQueue
          defQueue.push(queueItem);});defineables = [];}, //Push all the defineables items into the CONTEXT's defQueue
      //prettier-ignore
      getGlobal :(value) => {if (!value) return value; //dont-notation dependency
      var g = dependency;value.split(".").forEach((part) => {g = g[part];});return g;},
      // prettier-ignore
      evt : (v=(evt)=>evt.type==="load"||readyRegExp.test((evt.currentTarget||evt.srcElement).readyState))=>{
      interscrpt = v ? null : interscrpt;return v && BF.getScriptData(BF.evt);} //interactiveScript - browser event for script loaded status
    };
    // prettier-ignore
    const initial = {CG,ctn,dependencies,defined,urlFchd,defQueue,defQueueMap:{},Module,makeModuleMap,nextTick: req.nextTick,onError}
    CONTEXT = {
      ...initial,
      configure: (c) => {
        if (c[_u] && c[_u].charAt(c[_u].length - 1) !== "/") c[_u] += "/"; //Make sure the baseUrl ends in a slash.
        if (typeof c[_a] === _t)
          c[_a] = (id, url) => (url.indexOf("?") === -1 ? "?" : "&") + c[_a]; // Convert old style urlArgs string to a function.
        const shim = CG.shim; //save paths for special "additive processing"
        const mx = (op) => {
          const arr = ["paths", "bundles", "CG", "map"];
          !arr.includes(op)
            ? (CG[op] = c[op])
            : arr.forEach((op) => (CG[op] = !CG[op] ? {} : CG[op]));
          return op;
        }; //const objs = function (){arguments.forEach(x=>this[x]=true)}.apply({},["paths","bundles","CG","map"]);
        _K(c).forEach((prop = mx, i) => mixin(CG[prop], c[prop], true, true));
        if (c[_b])
          _K(c[_b]).forEach((prop, i) =>
            // prettier-ignore
            c[_b][prop].forEach((v)=>(bdlMap[v]=v!==prop?prop:bdlMap[v]))
          ); //Reverse map the bundles
        if (c[_s]) {
          // prettier-ignore
          _K(c[_s]).forEach((id, i) => {var v = c[_s][id];
            if (e_(v).string() === Ar) v = {ds: v}; //Merge shim, Normalize the structure
            if ((v[_x] || v[_i]) && !v[_xf])v[_xf] = CONTEXT.makeShimExports(v);shim[id] = v;});
          CG.shim = shim;
        }
        if (c[_p])
          c[_p].forEach((pkgObj) => {
            pkgObj = typeof pkgObj === _t ? { name: pkgObj } : pkgObj;
            var name = pkgObj.name,
              location = pkgObj[_l]; //Adjust packages if necessary.
            if (location) CG.paths[name] = pkgObj[_l];

            // prettier-ignore
            CG.pkgs[name] =`${pkgObj.name}/${(pkgObj.main || "main").replace(/^\.\//, "").replace(/\.js$/, "")}`; //normalize pkg name main module ID pointer paths
          }); //Update maps for "waiting to execute" modules in the dependencies.
        // prettier-ignore
        const mxx = (id) =>(!dependencies[id].inited && !dependencies[id].map.unnormalized) &&id
        // prettier-ignore
        _K(dependencies).forEach((id=mxx)=>dependencies[id].map=makeModuleMap(id, null, true)); //if inited and transient, unnormalized modules.
        if (c.ds || c.cb) CONTEXT.require(c.ds || [], c.cb); //When require is defined as a CG object before require.js is loaded,
      }, //call require with those args, if a ds arr or a CG cb is specified
      makeShimExports: (value) => {
        function fn() {
          var ret; //Shadowing of global property 'arguments'. (no-shadow-restricted-names)eslint
          if (value[_i]) ret = value[_i].apply(dependency, arguments);
          return ret || (value[_x] && BF.getGlobal(value[_x]));
        }
        return fn;
      },
      makeRequire: (relMap, o = (options) => options || {}) => {
        const { tkeGblQue, callGetModule } = BF;
        const localRequire = (ds, cb, eb) => {
          var id, map, requireMod;

          // prettier-ignore
          if (o.enableBuildCallback &&cb &&e_(cb).string() === Fn)cb.__requireJsBuild = true;
          if (typeof ds === _t) {
            // prettier-ignore
            if (e_(cb).string() === Fn)
              return onError(BINDABLES.mk(["requireargs", "Invalid require call"]),eb); //Invalid call; id, msg, err, requireModule
            if (relMap && e_(handlers).yes(ds))
              return handlers[ds](dependencies[relMap.id]); //when require|exports|module are requested && while module is being defined
            if (req.get) return req.get(CONTEXT, ds, relMap, localRequire);
            map = makeModuleMap(ds, relMap, false, true);
            id = map.id; //Normalize module name from . or ..
            // prettier-ignore
            if (!e_(defined).yes(id))
              return onError(BINDABLES.mk(["notloaded",`Module name ${id} has not been loaded yet for CONTEXT: ${ctn+(relMap?"":". Use require([])")}`]));
            return defined[id];
          } //type, msg, err, requireModules
          const intakeDefines = () => {
            var args;
            tkeGblQue();
            while (defQueue.length) {
              args = defQueue.shift();

              // prettier-ignore
              if(args[0]===null)return onError(BINDABLES.mk(["mismatch",`Mismatched anonymous define() module: ${args[args.length - 1]}`]));
              callGetModule(args);
            }
            CONTEXT.defQueueMap = {};
          }; //"intake modules" //type, msg, err, requireModules //...id, ds, factory; "normalized by define()"
          intakeDefines(); //Grab defines waiting in the dependency queue.
          CONTEXT.nextTick(() => {
            intakeDefines(); //Mark all the dependencies as needing to be loaded.
            requireMod = getModule(makeModuleMap(null, relMap)); //collect defines that could have been added since the 'require call'
            requireMod.skipMap = o.skipMap; //store if 'map CG' applied to module 'require call' for dependencies
            requireMod[_i](ds, cb, eb, { enabled: true });
            BM.checkLoaded();
          });
          return localRequire;
        };
        mixin(localRequire, {
          isBrowser,
          toUrl: (mNPE) => {
            //moduleNamePlusExt
            var ext,
              i = mNPE.lastIndexOf("."),
              seg = mNPE.split("/")[0],
              isRelative = seg === "." || seg === ".."; //URL path = module name + .extension; requires 'module name,' not 'plain URLs' like nameToUrl

            // prettier-ignore
            if(i!==-1&&(!isRelative||i > 1)) {ext=mNPE.substring(i, mNPE.length); mNPE = mNPE.substring(0, i);} //file extension alias, not 'relative path dots'

            // prettier-ignore
            const ar = [mNPE,relMap && relMap.id,true,CG.nodeIdCompat,CG.map,CG.pkgs];
            return CONTEXT.nameToUrl(normalize(ar), ext, true);
          },
          defined: (id) =>
            e_(defined).yes(makeModuleMap(id, relMap, false, true).id),
          specified: (id = (id) => makeModuleMap(id, relMap, false, true).id) =>
            e_(defined).yes(id) || e_(dependencies).yes(id)
        });
        if (!relMap)
          localRequire.undef = (id) => {
            tkeGblQue(); //Only allow undef on top level require calls
            var map = makeModuleMap(id, relMap, true); //Bind define() calls (fixes #408) to 'module' CONTEXT
            var m = e_(dependencies).yes(id) && dependencies[id];
            m.undefed = true;
            // prettier-ignore
            (()=>{rmvScrpt(id, CONTEXT.ctn);delete defined[id];delete urlFchd[map.url];delete unDE[id];})()

            // prettier-ignore
            defQueue.sort((a, b) => b - a).map((args, i) => args[0] === id && defQueue.splice(i, 1)); //Clean queued defines, backwards, so splices don't destroy the iteration
            delete CONTEXT.defQueueMap[id];
            if (m) {
              if (m.events.defined) unDE[id] = m.events; //if different CG, same listeners
              clrRegstr(id);
            }
          };
        return localRequire;
      },
      // prettier-ignore
      enable: (depMap) =>e_(dependencies).yes(depMap.id) &&dependencies[depMap.id] && getModule(depMap).enable(),
      //if "m" module is in dependencies, parent's CONTEXT when overridden in "optimizer" (Not shown).

      completeLoad: (mN) => {
        const { tkeGblQue, callGetModule, getGlobal } = BF;
        var found, args; //method used "internally" by environment adapters script-load or a synchronous load call.
        tkeGblQue();
        while (defQueue.length) {
          args = defQueue.shift();
          if (args[0] === null) {
            args[0] = mN;
            if (found) break;
            found = true; //anonymous module bound to name already  module is another anon module waiting for its completeLoad to fire.
          } else if (args[0] === mN) found = true;
          callGetModule(args);
        } //matched a define call in module script
        CONTEXT.defQueueMap = {};
        var m = e_(dependencies).yes(mN) && dependencies[mN]; // in case-/init-calls change the dependencies
        if (!found && !e_(defined).yes(mN) && m && !m.inited) {
          var shim = e_(CG.shim).yes(mN) ? CG.shim[mN] : {};
          if (CG.enforceDefine && (!shim[_x] || !getGlobal(shim[_x])))
            return (
              !hasPathFallback(mN, CG.paths) &&
              onError(
                BINDABLES.mk([
                  "nodefine",
                  "No define call for " + mN,
                  null,
                  [mN]
                ])
              )
            ); //type, msg, err, requireModules
          callGetModule([mN, shim.ds || [], shim.exportsFn]); //does not call define(), but simulated
        }
        BM.checkLoaded(); //mN = moduleName
      },
      nameToUrl: (mN, ext, skipExt) => {
        var pkgMain = e_(CG.pkgs).yes(mN) && CG.pkgs[mN]; //already-normalized-mN as URL. Use toUrl for the public API.
        mN = pkgMain ? pkgMain : mN; //If slash or colon-protocol fileURLs contains "?" or even ends with ".js",
        var id = e_(bdlMap).yes(mN) && bdlMap[mN]; //assume use of an url, not a module id.
        id && CONTEXT.nameToUrl(id, ext, skipExt); //filter out dependencies that are already paths.
        const geturl = (url = "") => {
          //Just a plain path, not module name lookup, so just return it.
          if (/^[/:?.]|(.js)$/.test(mN)) return (url = mN + (ext || "")); //Add extension if it is included. This is a bit wonky, only non-.js things pass
          var paths = CG.paths,
            syms = mN.split("/"); //an extension, module method probably needs to be reworked. A module that needs to be converted to a path.
          for (let i = syms.length; i > 0; i -= 1) {
            var pM = syms.slice(0, i).join("/"); //per module name segment if path registered, start name, and work up
            var pP = e_(paths).yes(pM) && paths[pM]; //parentModule
            // prettier-ignore
            pP && (() => { pP = e_(pP).a() ? pP[0] : pP; syms.splice(0, i, pP); })();
            if (pP) break; //arr means a few choices; parentPath
          }
          url = syms.join("/"); //Join the path parts together, then figure out if baseUrl is needed.
          url += ext || (/^data:|^blob:|\?/.test(url) || skipExt ? "" : ".js"); ///^data\:|^blob\:|\?/
          // prettier-ignore
          return `${(url.charAt(0) === "/" || url.match(/^[\w+.-]+:/) ? "": CG.baseUrl) + url}`; ///^[\w\+\.\-]+:/
        }; //Delegates to req.load. Broken out as a separate function to
        return ((url = geturl) =>
          `${
            CG.urlArgs && !/^blob:/.test(url) ? url + CG.urlArgs(mN, url) : url
          }`)();
      }, //!/^blob\:/ ___ allow overriding in the optimizer.

      load: (id, url) => req.load(CONTEXT, id, url), //allow the build system to sequence the files in the built layer, correctly
      execCb: (name, cb, args, exports) => cb.apply(exports, args),
      onScriptLoad: (data = BF.evt) => CONTEXT.completeLoad(data.id),
      onScriptError: (evt) => {
        var data = BF.getScriptData(evt);
        if (!hasPathFallback(data.id, CG.paths)) {
          const parents = _K(dependencies)
            .map((key, i) =>
              key.indexOf("_@r") !== 0
                ? // prettier-ignore
                  dependencies[key].depMaps.forEach((depMap)=>{if(depMap.id === data.id){return key;}else return "";})
                : ""
            )
            .filter((x) => x !== "");
          // prettier-ignore
          return onError(BINDABLES.mk(["scripterror",`Script error for ${data.id+(parents.length?`" needed by: ${parents.join(", ")}` : '"')}`,
              evt,[data.id]]));
        }
      }
    }; //type, msg, err, requireModules
    CONTEXT.require = CONTEXT.makeRequire();
    return CONTEXT;
  };
  // prettier-ignore
  var s = (req.s = {contexts:ctxs,newContext}); //Create default CONTEXT.
  req({}); //'dependency require' CONTEXT-sensitive exported methods
  ctxReqProps.forEach(
    (prop) =>
      // prettier-ignore
      req[prop]=function(){return ctxs[us].require[prop].apply(ctxs[us],arguments);}
  ); //apply arguments to requires on context
  //for the latest instance of the 'default CONTEXT CG'//not the 'early binding to default CONTEXT,' but ctxs during builds//ticketx to apology tour
  // prettier-ignore
  if (isBrowser) (()=>{head = s.head = e_("head").tag();baseElement = e_("base").tag(0);if (baseElement) head = s.head = baseElement.parentNode;})() //(IE6) BASE appendChild (http://dev.jquery.com/ticket/2709)
  req[_o] = (err) => err; // node for the load command in browser env
  req.createNode = (CG, mN, url) => {
    // prettier-ignore
    return {...(CG.xhtml ? e_().create("NS") : e_().create()),
    type: CG.scriptType || "text/javascript",charset: "utf-8",async: true};
  };

  req.load = (CONTEXT, mN, url) => {
    const CG = (CONTEXT && CONTEXT.CG) || {};
    //handle load request (in browser env); 'CONTEXT' for state, 'mN' for name, 'url' for point
    if (isBrowser) {
      var n = req.createNode(CG, mN, url); //browser script tag //testing for "[native code" https://github.com/REQUIREJS/REQUIREJS/issues/273
      n[_SA](dr(), CONTEXT.ctn);
      n[_SA](dr(true), mN); //artificial native-browser support? https://github.com/REQUIREJS/REQUIREJS/issues/187 //![native code]. IE8, !node.attachEvent.toString()
      // prettier-ignore
      if (n[_AE] &&!(n[_AE].toString && n[_AE].toString().indexOf("[native code") < 0) &&!isOpera) {
        useInteractive = true;n[_AE]("onreadystatechange", CONTEXT.onScriptLoad); //IE (6-8) doesn't script-'onload,' right after executing the script, cannot "tie" anonymous define call to a name,
        //yet for 'interactive'-script, 'readyState' triggers by 'define' call IE9 "addEventListener and script onload firings" issues should actually 'onload' event script, right after the script execution
        //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
        //Opera.attachEvent does not follow the execution mode. IE9+ 404s, and 'onreadystatechange' fires before the 'error' handlerunless 'addEventListener,'
      } else {n[_AEL]("load", CONTEXT.onScriptLoad, false);n[_AEL](_e, CONTEXT.onScriptError, false);} //yet that pathway not doing the 'execute, fire load event listener before next script'//node.attachEvent('onerror', CONTEXT.onScriptError);
      n.src = url; //Calling onNodeCreated after all properties on the node have been
      if (CG.onNodeCreated) CG.onNodeCreated(n, CG, mN, url); //set, but before it is placed in the DOM.
      //IE 6-8 cache, script executes before the end
      scriptPends = n; //of the appendChild execution, so to tie an anonymous define
      if (baseElement) {
        head.insertBefore(n, baseElement);
      } else head.appendChild(n); //call to the module name (which is stored on the node), hold on to a reference to module node, but clear after the DOM insertion.
      scriptPends = null;
      return n; // bug in WebKit where the worker gets garbage-collected after calling
    } else if (isWebWorker) {
      try {
        setTimeout(() => {}, 0);
        importScripts(url);
        CONTEXT.completeLoad(mN); // importScripts(): https://webkit.org/b/153317, so, Post a task to the event loop //Account for anonymous modules
      } catch (e) {
        CONTEXT[_o](
          BINDABLES.mk([
            "importscripts",
            `importScripts failed for ${mN} at ${url}`,
            e,
            [mN]
          ])
        );
      } //type, msg, err, requireModules
    }
  };
  if (isBrowser && !configuration.skipDataMain)
    e_()
      .tag()
      .sort((a, b) => b - a)
      .forEach((script) => {
        // prettier-ignore
        if (!head) (()=>{head = script.parentNode;dataMain = script.getAttribute("data-main");})(); //Set 'head' and append children to script's parent attribute 'data-main' script to load baseUrl, if it is not already set.
        if (dataMain) {
          mainScript = dataMain; //Preserve dataMain in case it is a path (i.e. contains '?')
          if (!configuration.baseUrl && mainScript.indexOf("!") === -1)
            // prettier-ignore
            (()=>{ src = mainScript.split("/");mainScript = src.pop(); subPath = src.length ? src.join("/") + "/" : "./";configuration.baseUrl = subPath;})()
          //baseUrl if data-main value is not a loader plugin module ID. data-main-directory as baseUrl //Strip off trailing .js mainScript, as is now a module name.
          mainScript = mainScript.replace(/\.js$/, ""); //If mainScript is still a mere path, fall back to dataMain
          if (/^[/:?.]|(.js)$/.test(mainScript)) mainScript = dataMain; //filter out dependencies that are already paths.//^\/|:|\?|\.js$
          configuration.ds = configuration.ds
            ? configuration.ds.concat(mainScript)
            : [mainScript]; //Put the data-main script in the files to load.
          return true;
        }
      });

  //prettier-ignore
  /*jslint evil: true */
  req.exec = (text) =>new Promise((resolve, reject) =>new Function("resolve", `"use strict";return (${text})`)(resolve, text)); //eval(text);

  //Set up with CG info.
  req(configuration);
})(require, timeout);

// prettier-ignore
const Required = () => {  return { require, define: define };};

export { Required as default };
