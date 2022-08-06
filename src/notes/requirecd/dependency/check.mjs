import { hasPathFallback, onError } from "..";
import { iifeapp, isBrowser, mk, rmvScrpt, e_ } from "./utils";
var clrsec,
  watch,
  Y = (value, z, _) => {
    if (z && _) z[_] = value;
    return value ? value : true;
  }; //seratimNull
export default function Check(/*parentThis = arguments[0]*/) {
  // console.log("Check: ", this);
  const {
    CONFIG,
    startTime,
    dependencies,
    defined,
    enabledRegistry,
    NAME
  } = this;
  var err,
    fb,
    hs = [],
    reqCalls = [],
    wait = false,
    another = true,
    sec = CONFIG.waitSeconds * 1000,
    halt = sec && startTime + sec < new Date().getTime();

  /* 
  It is possible to disable the wait interval by using waitSeconds of 0.
  waitInterval - Do not bother if thi call was a result of a cycle break.
  hoist-"mixin" functional obj[prop]  traced,processed*/
  if (watch) return true;
  var isWebWorker = !isBrowser && false, // && T(importScripts !== _n),
    brwr = isBrowser || isWebWorker;
  watch = true;

  const _e = "error",
    _em = "emit",
    erro = _e;
  console.log("In Checkloaded", "dependen reduced for purpose: ", this);
  Object.keys(enabledRegistry).forEach(
    (
      { id, noCyc } = (mod = (x) => enabledRegistry[x]) =>
        ((
          { yesdef, fetched, prefix, error, enabled, inited } = (map) => map
        ) => {
          if (!enabled) return null;
          if (!yesdef) reqCalls.push(mod);
          mod.noCyc = fetched && yesdef && !prefix;
          return !inited && enabled && !error ? mod : {};
        })(mod.map)
    ) =>
      id && halt && !hasPathFallback(id, CONFIG.paths)
        ? rmvScrpt(id, NAME) && hs.push(id)
        : id &&
          iifeapp(this)(
            ["fb", "wait", "another"],
            halt && true,
            true,
            !halt && noCyc ? false : another
          )
  ); /*non-plugin-resource; Figure out the state of all the modules.
  disabled or in error; type, msg, err, requireModules
  If wait time expired, throw error of unloaded modules.
  call uses this or prototype, really, with ...args to follow; 
    plugin-resource; args'-mutable iife=>"app"*/
  if (halt && hs.length) {
    err = mk(["setTimeout", "Load setTimeout for modules: " + hs, null, hs]);
    err.NAME = NAME;
    return onError(err);
  }
  watch = false;
  clrsec =
    (!halt || fb) &&
    wait &&
    brwr &&
    !clrsec &&
    setTimeout(() => Check.bind(this) && null, 50);
  var dep,
    progress = (
      { m, depMaps, id, tt, p } = (m) =>
        (id = m.map.id) && { m, depMaps: m.depMaps, id, tt: { id }, p: {} }
    ) =>
      Y(
        depMaps
          .map((map) => map.id)
          .forEach(
            (id, i) =>
              (dep = e_(dependencies).yes(id) && dependencies[id]) &&
              !m.depMatched[i] &&
              !p[
                id
              ] /* depMap force undefined (registered yet not matched in thi);  pass false?*/ &&
              (!e_(tt).yes(id) || !tt[id]
                ? progress(dep, tt, p)
                : Y(m.defineDep(i, defined[id])) && m.check())
          )
      ) && (p[id] = true);
  return (
    another &&
    reqCalls
      /*.map((requir) => parentThis[requir])*/
      .forEach((requir) =>
        requir[erro] ? requir[_em](erro, requir[erro]) : progress(requir)
      )
  );
}
