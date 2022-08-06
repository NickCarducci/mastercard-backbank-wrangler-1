import Module from "./module";
import { KeyValue, onError } from "../..";
import { e_, mk, reduce, tryCatch } from "../utils";
import { normalize } from "../utils/normalize";

export default function Help(
  dependency = arguments[0],
  BUILD = arguments[1],
  moduleProto = arguments[2]
) {
  const {
      CONFIG: config = (CONFIG) => CONFIG.config,
      urlFchd,
      load
    } = dependency,
    depMap = (dm) => {
      return {
        dm,
        m:
          e_(dependency.dependencies).yes(dm.id) &&
          dependency.dependencies[dm.id]
      };
    };
  return {
    getModule: ({ m, dm } = depMap) => {
      const manage = (map, ignore, id, depMaps) =>
          map.yesdef && !ignore
            ? new Promise((resolve) =>
                KeyValue(`defined.${id}`, module.exports && resolve(""))
              ).then(
                () =>
                  BUILD.onResourceLoad &&
                  BUILD.onResourceLoad(
                    dependency,
                    map,
                    depMaps.map((depMap) => depMap.normalizedMap || depMap)
                  )
              )
            : true,
        loadd = () =>
          !urlFchd[dm.url]
            ? KeyValue(`urlFchd.${dm.url}`, true) && load(dm.id, dm.url)
            : console.log(
                `redundant dependency.load(${dm.id}, ${dm.url}) call (?), dependency.urlFchd[${dm.url}] === true`
              ),
        trans = [
          "unDE",
          "CONFIG",
          "dependencies",
          "execCb",
          "defined",
          "defQueueMap"
        ];
      const Dependency = this;
      return m
        ? m
        : KeyValue(
            `dependencies.${dm.id}`,
            //Bind (no call) || (new && prototype) || (return Call with prototype)
            Module.bind({
              map: dm,
              onError,
              ...reduce(/*.call(this,*/ trans, "dependency", dependency),
              manage,
              load: loadd,
              start: KeyValue(`startTime`, new Date().getTime()),
              set: KeyValue(`enabledRegistry.${dm.id}`, Dependency),
              normalize,
              noErrorHandler: BUILD.onError !== ((err) => err),
              enable: dependency.enable,
              getModule: Help.call(Dependency, dependency, BUILD, moduleProto)
                .getModule,
              //depMap,
              bdlMap: dependency.bdlMap,
              loaded: dependency.loaded,
              make: dependency.make,

              execute: (text, id) => {
                const erro = tryCatch(BUILD.exec, [text]);
                if (erro)
                  return onError(
                    mk([
                      "fromtexteval",
                      `fromText eval for ${id} failed: ${erro}`,
                      erro,
                      [id]
                    ])
                  );
              }
            })
          );
    }
  };
}

/**{
         * 
      bdlMap: {},
      NAME: arguments[0],
      defQueue,
      defQueueMap: os("defQueueMap"),
      nextTick: BUILD.nextTick,
      execCb: (name, cb, args, exports) => cb.apply(exports, args),
      onError: oe,
      unDE: os("unDE"),
      enabledRegistry: os("enabledRegistry"),
      defined: os("defined"),
      dependencies: os("dependencies"),

      //configure,
      makeShimExports: (value) =>
        function () {
          return (
            (value[_i] && value[_i].apply(config, arguments)) ||
            (value.exports && getGlobal(value.exports))
          );
        },
      enable: (depMap) =>
        e_(dependen.dependencies).yes(depMap.id) &&
        dependen.dependencies[depMap.id] &&
        getModule(depMap).enable()
    };*/
