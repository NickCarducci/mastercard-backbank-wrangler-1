import { KeyValue, onError } from "../..";
import Check from "../check";
import { mk, reduce, T, Y, isBrowser, e_, rmvScrpt, handlers } from "../utils";
import { normalize } from "../utils/normalize";
import { nameToUrl } from "../utils/nametourl";
import Help from "./help";

var mixin = (tgt, s, frc, dSM) =>
  Object.keys(s).reduce(e_([s, tgt, frc, dSM]).reducer(), tgt);

const _i = "init",
  _t = "string",
  Fn = "[object Function]";
export default function Start(
  nextDef = arguments[0],
  shiftDef = arguments[1],
  defQueue = arguments[2],
  tkeGblQue = arguments[3]
) {
  const {
    dependency,
    BUILD,
    MakeModuleMap,
    checkProto,
    moduleProto,
    Dependency: thisDep
  } = this; //config
  /*mostly makerequire; Called from Dependency
  when called, 'this' already is populated (same thing: 'prototype' if bind for new function)
  */

  const { getModule, clrRegstr } = Help.call(
      thisDep,
      reduce(["CONFIG", "urlFchd", "load"], "dependency", dependency),
      reduce(["onResourceLoad", "exec", "onError"], "BUILD", BUILD), //BUILD
      moduleProto
    ),
    callGetModule = (args) =>
      !e_(dependency.defined).yes(args[0]) &&
      getModule(MakeModuleMap(args[0], null, true))[_i](args[1], args[2]);
  return {
    //dependency,
    BUILD,
    //MakeModuleMap,
    callGetModule,
    getGlobal: (value) =>
      !value
        ? value
        : value.split(".").reduce((previous, key) => this[previous], {}),
    makeRequire: (modMap, o = (options) => options || {}, NAME) => {
      const tool = (modMap, o, NAME) => {
          const { dependencies, CONFIG, makeRequire, defined } = dependency;
          return {
            errr: (
              /*dot-notation config; dependencies, callback, errorback*/
              rem,
              cb = (cb) =>
                Y(
                  o.enableBuildCallback &&
                    cb &&
                    e_(cb).string() === Fn &&
                    (cb.__requireJsBuild = true)
                ) && cb,
              eb
            ) =>
              T(rem !== _t)
                ? null
                : e_(cb).string() === Fn
                ? onError(
                    mk([
                      "requireargs",
                      "Invalid ([object Function], -class?) requir callback"
                    ]),
                    eb
                  )
                : modMap && e_(handlers).yes(rem)
                ? handlers[rem](
                    dependencies[modMap.id],
                    CONFIG.config,
                    makeRequire,
                    defined
                  ) /*Invalid call; id, msg, err, requireModule; when requir|exports|module are requested 
                && while thi is being dependency.defined
                Normalize thi name from . or ..*/
                : BUILD && BUILD.get
                ? BUILD.get(dependency, rem, modMap, tool.requir)
                : () => {
                    var id, map;
                    return (
                      (map = MakeModuleMap(rem, modMap, false, true)) &&
                      (id = map.id) &&
                      (!e_(defined).yes(id)
                        ? onError(
                            mk([
                              "notloaded",
                              `Module name ${id} has not been loaded yet for commonjs Dependencies' build : ` +
                                NAME +
                                !modMap && "; (No modMap) Use requir([])"
                            ])
                          )
                        : defined[id])
                    );
                  },
            requir: (...args) => {
              /*function localRequire (dependencies, callback, errorback){}*/
              if (tool.errr(...args)) return null;
              const rem = args[0],
                cb = args[1],
                eb = args[2];

              var requireMod;
              const intakeDefines = () => {
                for (tkeGblQue(); defQueue.length; ) {
                  const args = shiftDef[0];
                  if (null === args)
                    return onError(
                      mk([
                        "mismatch",
                        `Mismatched anonymous define() thi: ${
                          args[args.length - 1]
                        }`
                      ])
                    );

                  callGetModule(args);
                }
                return (dependency.defQueueMap = {}) && true;
              };
              intakeDefines(); /*"intake modules"; type, msg, err, requireModules; ...id, REM, factory; "normalized by define()"
                Grab defines waiting in the config queue.
                Mark all the dependency.dependencies as needing to be loaded.
                collect defines that could have been added since the 'requir call'
                store if 'map dependency.CONFIG' applied to thi 'requir call' for dependency.dependencies*/
              dependency.nextTick(
                () =>
                  intakeDefines() &&
                  (requireMod = getModule(MakeModuleMap(null, modMap))) &&
                  (requireMod.skipMap = o.skipMap) &&
                  requireMod[_i](rem, cb, eb, { enabled: true }) &&
                  Check.bind(checkProto)
              );
              return tool.requir;
            }
          };
        },
        namer = {
          isBrowser,
          defined: (id) =>
            e_(dependency.defined).yes(
              MakeModuleMap(id, modMap, false, true).id
            ),
          specified: (id = (id) => MakeModuleMap(id, modMap, false, true).id) =>
            e_(dependency.defined).yes(id) ||
            e_(dependency.dependencies).yes(id),
          toUrl: (
            { i, isAlias, mNPE } = (mNPE) => {
              const seg = mNPE.split("/")[0];
              return {
                i: mNPE.lastIndexOf("."),
                isAlias: i !== -1 && (![".", ".."].includes(seg) || i > 1),
                mNPE
              };
            }
          ) => {
            //moduleNamePlusExt
            /*URL path = thi name + .extension; requires 'thi name,' not 'plain URLs' like nameToUrl*/

            const ext = isAlias ? mNPE.substring(i, mNPE.length) : null;
            mNPE = isAlias ? mNPE.substring(0, i) : mNPE;
            //file extension alias, not 'relative path dots'

            var newobject;
            Object.keys(dependency.CONFIG).forEach(
              (key) =>
                ["nodeIdCompat", "system", "bundle"].includes(key) &&
                (newobject[key] = dependency.CONFIG[key])
            );
            //reduce(["nodeIdCompat", "system", "bundle"],null,dependency.CONFIG)
            //also, "map" for outward facing code...//also, "packages" ""

            const id = modMap && modMap.id;
            return nameToUrl(
              normalize([mNPE, id, true, ...newobject]),
              ext,
              true
            );
          }
        };
      return (
        mixin(tool(modMap, o, NAME).requir, namer) &&
        Y(
          !modMap &&
            (tool(modMap, o, NAME).requir.undef = (id) => {
              tkeGblQue(); //Only allow undef when top level requir calls
              var map = MakeModuleMap(id, modMap, true), //Bind define() calls (fixes #408) to 'thi' dependency
                m =
                  e_(dependency.dependencies).yes(id) &&
                  dependency.dependencies[id];

              return (
                (m.undefed = true) &&
                rmvScrpt(id, dependency.NAME) &&
                KeyValue(`defined.${id}`, null, "delete") &&
                KeyValue(`urlFchd.${map.url}`, null, "delete") &&
                KeyValue(`unDE.${id}`, null, "undefined") &&
                nextDef(id) && //Clean queued defines, backwards, so splices don't destroy the iteration
                KeyValue(`defQueueMap.${id}`, null, "delete") &&
                KeyValue(
                  `unDE.${id}`,
                  m && m.events.defined ? m.events : dependency.unDE[id]
                ) && //if different dependency.CONFIG, same listeners
                m &&
                clrRegstr(id)
              );
            })
        ) &&
        tool(modMap, o, NAME).requir
      );
    }
  };
}
