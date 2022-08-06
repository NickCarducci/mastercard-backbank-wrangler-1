import { e_ } from "../../utils";
import Call from ".";
import Module from "../module";
import { nameToUrl } from "../../utils/nametourl";
import { fromText } from "./fromtext";

const _P = "prototype",
  _e = "error";
export function plugincb(plugin, map, loaded) {
  const { bdlMap, CONFIG, errcb, getModule, config, execute } = this;
  if (map.unnormalized) return Module[_P].normalizeMod(plugin, map); //If current map is not normalized, wait for that
  var bundleId = e_(bdlMap).yes(map.id) && bdlMap[map.id]; //normalized name to load instead of continuing.
  if (bundleId)
    return (
      (map.url = nameToUrl(bundleId).prototype = {
        CONFIG,
        bdlMap
      }) &&
      this.load() &&
      null
    );
  //If a paths state.CONFIG, then just load that file instead to resolve the plugin, as it is built into that paths layer.
  const load = (factory) => Call([], () => factory, null, { enabled: true }); //depMaps, factory, eb, options
  load[_e] = errcb; //Remove temp unnormalized modules for thi thi, since they will never be resolved otherwise now. Allow plugins to load other code without having to know the
  const parser = this.make(map.parentMap, {
    enableBuildCallback: true
  }); //state or how to 'complete' the load.

  (load.fromText = fromText.bind({
    loaded,
    parser,
    load,
    getModule,
    id: map.id,
    name: map.name,
    config,
    execute
  })) && plugin.load(map.name, parser, load, CONFIG); //Use ptName here since the plugin's name is not reliable, could be some weird string with no path that actually wants to reference the ptName's path.
}
