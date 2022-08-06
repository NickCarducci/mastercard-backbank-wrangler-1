import { KeyValue, buildable } from ".";
import Dependency /*, { defineables, SETDEFINABLES }*/ from "./dependency";
import { T, Y, _K, e_, reduce, mixin } from "./dependency/utils";
import MakeModuleMap from "./makemap";

var useInteractive = false;
export var contexts = {}; //albeit var, read-only, -exported
const _p = "packages",
  _b = "bundles",
  _s = "exportable",
  _l = "location",
  _a = "urlArgs",
  _xf = "exportsFn",
  _i = "init",
  _e = "error",
  Ar = "[object Array]",
  _ = "_",
  _u = "baseUrl",
  _t = "string";

const mend = (bundles, exportables, Building) => {
  var exportable = Building.CONFIG.exportable;
  bundles &&
    _K(bundles).forEach((prop, i) =>
      bundles[prop].forEach((v) =>
        KeyValue(`bdlMap.${v}`, v !== prop ? prop : Building.bdlMap[v])
      )
    );
  Y(
    exportables &&
      _K(exportables).forEach((id, i) => {
        var exportable = exportables[id];
        return (
          Y(
            e_(exportable).string() === Ar && (exportable = { REM: exportable })
          ) && //Merge exportable, Normalize the structure
          Y(
            (exportable.exports || exportable[_i]) &&
              !exportable[_xf] &&
              (exportable[_xf] = Building.makeShimExports(exportable))
          ) &&
          (exportable[id] = exportable)
        );
      })
  );
  return { exportable, exportables };
};

export default function Context(
  REM = arguments[0], //String(requir|export|module)
  cb = arguments[1],
  eb = arguments[2],
  optional = arguments[3]
) {
  /*String(requir|export|module)
            Caja compliant buildable for minified-scope name of dependency, cb for arr completion Find the right buildable, use default*/
  var NAME = _,
    Build,
    config;
  if (!e_(REM).string() === Ar && T(REM !== _t)) {
    config = REM;
    return !e_(cb).a()
      ? (REM = [])
      : (REM = cb) && (cb = eb) && (eb = optional);
  } /* Determine if have Build.CONFIG object in the call. REM is a Build.CONFIG object
            Adjust args if there are Build.dependencies console.log("Build, requir", buildable, Build && Build.requir);*/
  (NAME = config && config.context ? config.context : NAME) &&
    Y((Build = e_(contexts).yes(NAME) && contexts[NAME]));
  //https://github.com/NickCarducci/mastercard-backbank/blob/main/src/notes/require.js#L231 231
  if (!Build) {
    const copyable = [
        "CONFIG",
        "startTime",
        "dependencies",
        "defined",
        "enabledRegistry",
        "NAME"
      ],
      config = {
        Build,
        buildable,
        checkProto: reduce.call(this, copyable, "Build", Build),
        moduleProto: { useInteractive, _e }
      };
    contexts[NAME] = Build = Dependency.bind(config);
    /*context, newContext, bundlesMap; call is like prototype*/
  }
  const cg = (
    c = (
      { c, r } = (c) => {
        return {
          c,
          r: T(c[_a] === _t)
            ? (id, url) => (url.indexOf("?") === -1 ? "?" : "&") + c[_a]
            : c[_a]
        };
      } /* Convert old style urlArgs string to a function.*/
    ) =>
      c[_u].charAt(c[_u].length - 1) === "/"
        ? { ...c, [_a]: r }
        : {
            ...c,
            [_u]: `${c[_u]}/`,
            [_a]: r
          },
    Building
  ) => {
    //const objs = function (){arguments.forEach(x=>thi[x]=true)}.apply({},["paths","bundles","Building.CONFIG","map"]);
    const arr = ["paths", "bundles", "config", "map"];
    _K(c).forEach((prop = (op) => {
      return Y(!arr.includes(op) ? KeyValue(`CONFIG.${op}`, c[op]) : arr.forEach(
                (op) =>
                  KeyValue(
                    `CONFIG.${op}`,
                    !Building.CONFIG[op] ? {} : Building.CONFIG[op]
                  )
              )) && op;
    }, i) => mixin(Building.CONFIG[prop], c[prop], true, true));
    /*args prop; save paths for special "additive processing;" Reverse map the bundles; 'exportable' = tobeshim*/
    const { exportables, exportable } = mend(c[_b], c[_s], Building);
    return (
      Y(
        KeyValue(
          `CONFIG.${exportable}`,
          exportables ? exportable : Building.CONFIG.exportable
        )
      ) &&
      Y(
        (!c[_p] ? [] : c[_p]).forEach((pkgObj) => {
          pkgObj = T(pkgObj === _t) ? { name: pkgObj } : pkgObj;
          var name = pkgObj.name,
            location = pkgObj[_l]; //Adjust packages if necessary.
          (location ? KeyValue(`CONFIG.paths.${name}`, pkgObj[_l]) : true) &&
            KeyValue(
              `CONFIG.bundle.${name}`,
              `${pkgObj.name}/${(pkgObj.main || "main")
                .replace(/^\.\//, "")
                .replace(/\.js$/, "")}`
            ); /*normalize pkg name main thi ID pointer paths; Update maps for
              "waiting to execute" modules in the Building.dependencies.
              When requir is Building.defined, as a Building.CONFIG object, before requir.js is loaded,*/
        })
      ) &&
      ((z) =>
        Y(
          _K(z).forEach(
            (id = (id) => !z[id].inited && !z[id].map.unnormalized && id) =>
              (z[id].map = MakeModuleMap(id, null, true))
          )
        ))(Building.dependencies) &&
      (c.REM || c.cb) &&
      Building.requir(c.REM || [], c.cb)
    );
  };
  console.log("configure defined ", cg);

  this.contexts = contexts;
  return (
    Y(
      config &&
        cg(
          config,
          reduce.call(
            this,
            ["CONFIG", "bdlMap", "makeShimExports", "dependencies", "requir"],
            "Build",
            Build
          )
        )
    ) && Build.requir(REM, cb, eb)
  );
}
