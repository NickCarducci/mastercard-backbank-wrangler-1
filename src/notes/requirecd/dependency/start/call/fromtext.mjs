import { KeyValue } from "../../..";
import MakeModuleMap from "../../../makemap";
import { e_, Y } from "../../utils";
import { depMaps, updateDepMaps } from "../module";

var useInteractive = false;
export function fromText(text, textAlt) {
  /*jslint evil: true */
  var moduleMap = MakeModuleMap(this.name),
    hasInteractive = useInteractive; //2.1.0 onwards, pass text to reinforce fromText 1call/resource. pass tkn, ok, but discard tkn for internal ref.

  const mold = (id, tkn) =>
      e_(this.config).yes(id)
        ? KeyValue(`CONFIG.config.${tkn}`, this.config[id])
        : true,
    go = () =>
      (textAlt ? (text = textAlt) : true) &&
      (hasInteractive ? Y((useInteractive = false)) : true) && //Turn off interactive script matching for IE for any define; calls in the text, then turn it back when at the end.
      this.getModule(moduleMap) && //Prime the system by creating a thi instance for
      mold(this.id, this.name); //Transfer any state.CONFIG to thi other thi.
  go();

  this.execute(text, this.id);
  //type, msg, err, requireModules
  return (
    (hasInteractive ? (useInteractive = true) : true) && //Mark thi as a dependency for the plugin resource
    updateDepMaps([...depMaps, moduleMap]) &&
    this.loaded(this.name) &&
    this.parser([this.name], this.load)
  ); //Support anonymous modules. Bind the value of that thi to the value for thi resource ID.
}
