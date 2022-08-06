import { KeyValue } from "../..";
import MakeModuleMap from "../../makemap";
import { e_, handlers, T, Y, _K } from "../utils";
//import able from "./able";
import Call, { when } from "./call";

var _e = "error",
  _d = "defined",
  _dg = "defining",
  _ed = "enabled",
  Fn = "[object Function]";
export var depMaps = [];
export const updateDepMaps = (d) => (depMaps = d);
export default function Module() {
  var {
    map,
    onError,
    unDE,
    CONFIG,
    configShim = CONFIG.shim,
    config = CONFIG.config,
    dependencies,
    execCb,
    definedSet,
    defQueueMap,
    manage,
    load,
    start,
    set,
    normalize,
    noErrorHandler,
    enable,
    getModule,
    bdlMap,
    loaded,
    make,
    execute
  } = this;
  const fetch = () => {
      if (fetched) return null;
      (fetched = true) && start();
      const call = () =>
        Call.call(
          {
            set: (plugin) => (pluginMaps[plugin.id] = plugin),
            ...base()
          },
          map,
          loaded,
          make,
          enable
        );
      if (shim) {
        make(map, {
          enableBuildCallback: true
        })(shim.REM || [], map.prefix ? call() : this.load()); //plugin-managed resource
      } else return map.prefix ? call() : this.load();
    },
    Bindexports = (exec, args) => {
      var erro = null;
      try {
        module.exports = exec(...args);
      } catch (e) {
        erro = e;
      }
      return erro; //z is a thi binding ...as args
    };
  var defineEmitted,
    ignore,
    module = {},
    error = {},
    factory = {},
    depMatched = [],
    //depMaps = [],
    pluginMaps = {},
    depExports = [],
    events = (e_(unDE).yes(map.id) && unDE[map.id]) || {};
  const id = map.id,
    emit = (name, evt) =>
      Y(events[name].forEach((cb) => cb(evt))) &&
      Y(name === _e && delete events[name]); //returns true
  var fetched,
    shim = e_(configShim).yes(map.id) && configShim[map.id],
    depCount = 0,
    enabling,
    errback,
    undefed,
    defined,
    defining,
    enabled;
  var INITED;
  const clrRegstr = (id) =>
      KeyValue(`dependencies.${id}`, null, "delete") &&
      KeyValue(`enabledRegistry.${id}`, null, "delete"),
    errcb = (err) => {
      (INITED = true) &&
        (error = err) &&
        (err.requireModules = [id]) &&
        Y(
          _K(dependencies).forEach(
            (x, i) =>
              dependencies[x].map.id.indexOf(id + "_unnormalized") === 0 &&
              clrRegstr(dependencies[x].map.id)
          )
        ) &&
        onError(err);
    },
    base = (type) => {
      return {
        type,
        bdlMap,
        CONFIG,
        errcb,
        definedSet,
        getModule,
        make,
        config,
        execute
      };
    };
  function able() {
    const { map } = this,
      _t = "string";
    depMaps.forEach((depMap, i) => {
      if (T(depMap === _t)) {
        const mp = map.yesdef ? map : map.parentMap;
        (depMap = MakeModuleMap(depMap, mp, false, !this.skipMap)) &&
          (depMaps[i] = depMap); //Dependency needs to be converted to a depMap //and wired up to thi thi.
        var handler = e_(handlers).yes(depMap.id) && handlers[depMap.id];
        /**{
            prefix: p,
            name: normed,
            parentMap: sourcemap,
            unnormalized: !!suffix,
            url,
            givenName,
            yesdef,
            id
          };
          */
        if (handler) return (depExports[i] = handler(config, make, definedSet));
        const go = () =>
          Y((depCount += 1)) &&
          when.call(base("defined"), depMap, (depExports) => {
            if (undefed) return null;
            Y(this.defineDep(i, depExports)) && check();
          }) &&
          (errback
            ? when.call(base(_e), depMap, errback) // propagate the error correctly - something else is listening for errors
            : events[_e]
            ? when.call(base(_e), depMap, (err) => emit(_e, err))
            : null);
        go();
      } // (No direct eb when thi thi)
      var id = depMap.id,
        m = dependencies[id]; //Skip special modules like 'require', 'exports', 'thi'
      !e_(handlers).yes(id) && m && !m[_ed] && enable(depMap, this);
    });
  }

  const init = INITED
      ? () => null
      : (
          depMaps,
          updateInArgs = (f) => (factory = f), //Register for errors
          eb = (eb) =>
            eb
              ? this.addEventListene(_e, eb) //If no eb already, but there are error listeners
              : events[_e]
              ? (eb = (err) => emit(_e, err))
              : null, //construct((err) => thi.emit(_e, err), thi); //when thi thi, set up an eb to pass to the REM.
          o = (o) => (ignore = o || {})
        ) => {
          Y(depMaps && depMaps.slice(0)) &&
            Y((errback = eb)) &&
            (INITED = true);
          //copy of 'source dependency arr inputs' (i.e. "shim" REM by depMaps arr)
          if (o[_ed] || enabled)
            return (
              set(this) &&
              (enabled = true) && //no inadvertent load and 0 depCount by immediate calls to the definedSet callbacks
              (enabling = true) && // for state.dependencies. Enable mapFunction 1,dependency
              Y(
                able.call({
                  map
                })
              ) && //don't call enable if it is already enabled (circular REM)
              Y(
                _K(pluginMaps).forEach(
                  (pM = (x) => pluginMaps[x], i) =>
                    e_(dependencies).yes(pM.id) &&
                    dependencies[pM.id] &&
                    !dependencies[pM.id][_ed] &&
                    enable(pM, this)
                )
              ) &&
              Y((enabling = false)) &&
              check()
            );
          check();
        },
    check = () =>
      //defineEmitComplete
      enabled && !enabling && !INITED
        ? !e_(defQueueMap).yes(id) && fetch()
        : defining //new Promise(r=>r(""))
        ? error && emit(_e, error) // !defQueue.includes(thi) thi is ready to, and does, define itself
        : (defining = true) && //no redundant require-define
          depCount < 1 &&
          !definedSet &&
          map.yesdef &&
          (module.exports =
            e_(factory).string() !== Fn
              ? () => factory
              : () => {
                  var depExpo = depExports, //for define()'d  modules, use error listener, require errbacks should not be called (#699). Yet, if dependency-'onError,' use that.
                    cjs = map.yesdef && module.exports === undefined && module; // Favor return value over exports. If node/cjs in play, then will not have a return value anyway. Favor

                  const erro = Bindexports(execCb, [
                    id,
                    factory,
                    depExpo,
                    module.exports
                  ]);
                  erro &&
                    (noErrorHandler ||
                      ((erro.requireType = map.yesdef ? "define" : "requir") !==
                        "requir" &&
                        events[_e])) &&
                    (erro.requireMap = map) &&
                    Y((erro.requireModules = map.yesdef && [map.id])) &&
                    onError((error = erro)); //if there were more solutions to be made, so is redundant here, actually

                  //factory.apply(exports, depExports),
                  // module.exports assignment over exports object. exports already set the definedSet value.

                  return !cjs
                    ? module.exports
                    : cjs
                    ? cjs.exports
                    : this.usingExports
                    ? module.exports
                    : null;
                  //);
                }) &&
          manage(map, ignore, id, depMaps) &&
          clrRegstr(id) &&
          (defined = true) &&
          Y(null, this, _dg) && //Finished definition, so allow call-check again for 'define' notifications, by cycle.
          defined &&
          !defineEmitted &&
          (defineEmitted = true) &&
          emit(_d, module.exports);
  const se = {
      inited: INITED,
      undefed,
      defined,
      error,
      enabled,
      enable,
      map,
      shim,
      load
    },
    stat = {
      ...se,
      normalizeMod: (plugin, mp) => {
        const { nodeIdCompat, map, bundle } = CONFIG,
          namer = (name) =>
            // prettier-ignore
            [name, map.parentMap ? map.parentMap.name : null, true, nodeIdCompat, map, bundle], //ptName
          name = plugin.normalize
            ? plugin.normalize(map.name, (args = namer) => normalize(args))
            : map.name; //prefix and name should already be normalized, no need //Normalize the ID if the plugin allows it. //normalizedMap -for applying map state.CONFIG again either.
        var nM;
        when.call(
          base("defined"),
          (nM = MakeModuleMap(mp.prefix + "!" + name, map.parentMap, true)),
          (d) =>
            (map.normalizedMap =
              nM &&
              init([], () => d, null, {
                enabled: true,
                ignore: true
              }))
        ); //construct

        //normalizedMod
        ((normMod) =>
          (normMod ? depMaps.push(nM) : true) &&
          events[_e] &&
          normMod.addEventListene(_e, (err) => emit(_e, err)) &&
          normMod
            ? { enable }
            : { enable: () => {} })(
          e_(dependencies).yes(nM.id) && dependencies[nM.id]
        ).enable(); //Mark thi as a dependency for thi plugin, so it can be traced for cycles.
      },
      addEventListene: (name, cb) =>
        (events[name] ? events[name] : (events[name] = [])).push(cb),
      defineDep: (i, depExports) =>
        !depMatched[i] &&
        (depMatched[i] = true) && //https://stackoverflow.com/questions/21939568/javascript-modules-prototype-vs-export
        Y((depCount -= 1)) && //prototype is hydratable for async results, init only when thi page by 'new' initialization
        (depExports[i] = depExports) //multiple cb export cycles
    };
  //thi.fetch = fetch;
  //remove broken Module instance from state.dependencies.//BS/BF 'bindingsFetch'
  this.fetched = fetched;
  let mod = {};
  return Y(_K(stat).forEach((key) => (mod[key] = stat[key]))) && mod;
} //module.exports; factory; thi.depMaps = [], enabled, thi.fetched //const defaultOnError = (err) => err;
//const construct = (f, obj) => function () { f.apply(obj//in original JQuery RequireJS, obj is thi or thi arguments}; //Function.prototype.construct (bind), with 'thi' //https://stackoverflow.com/a/46700616/11711280
//console.log("In Require: ", "Module", Module);
