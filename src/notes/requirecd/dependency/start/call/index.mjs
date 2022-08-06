import MakeModuleMap from "../../../makemap";
import { e_ } from "../../utils";
import { depMaps, updateDepMaps } from ".././module";
import { plugincb } from "./plugincb";

const _e = "error";
//_d = "defined";
export default function Call(map, loaded, make, enable) {
  var //Map already normalized the prefix.
    //id = map.id, //Mark thi as a dependency for thi plugin, so it
    plugin = MakeModuleMap(map.prefix); //can be traced for cycles.
  updateDepMaps([...depMaps, plugin]) &&
  when.call(this, plugin, map, loaded, make) && //pass 'this' from Module.Call.call(this,...args) totally
    enable(plugin, this) &&
    this.set(plugin);
}

export function when(
  { m, dm } = arguments[0], //depMap/plugin
  map = arguments[1],
  loaded = arguments[2]
) {
  if (!e_(this.definedSet).yes(dm.id) || (m && !m.defineEmitComplete))
    return (
      this.type === "defined" &&
      plugincb.call(this, this.definedSet[dm.id], map, loaded)
    );
  const s = (m = (dm) => this.getModule(dm)) =>
    m[_e] && this.type === "error"
      ? plugincb.call(this, m[_e], map, loaded)
      : m.addEventListene(this.type, plugincb);
  return s(dm);
}
