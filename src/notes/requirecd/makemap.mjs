import { buildable } from ".";
import { iifeapp } from "./dependency/utils";
import { normalize } from "./dependency/utils/normalize";
import { nameToUrl } from "./dependency/utils/nametourl";

var requireCounter = 1,
  unnormalizedCounter = 1,
  Y = (value, z, _) => {
    if (z && _) z[_] = value;
    return value ? value : true;
  }; //seratimNull

export default function MakeModuleMap(
  n = arguments[0],
  sourcemap = arguments[1],
  isNormed = arguments[2],
  applyMap = arguments[3]
) {
  var ptName = sourcemap ? sourcemap.name : null,
    givenName = n,
    yesdef = true; /*n, sourcemap, isNormed, applyMap
        'applyMap' for dependency ID, 'isNormed' define() thi ID, '[sourcemap]' 
        to resolve relative names (&& requir.normalize()), 'name' the most relative
        internally-name a 'requir' call, given no name*/
  n =
    (!n ? Y((yesdef = false)) : true) &&
    (n ? n : "_@r" + (requireCounter += 1));

  const configGets = [
      buildable.CONFIG.nodeIdCompat,
      buildable.CONFIG.system,
      buildable.CONFIG.bundle
    ],
    splitPrefix = (i = (n) => n.indexOf("!")) =>
      i > -1 ? [n.substring(0, i), n.substring(i + 1, n.length)] : [n, ""];

  var names = splitPrefix(n),
    p = names[0],
    pM,
    url,
    normed = "",
    id,
    suffix =
      p && !pM && !isNormed
        ? "_unnormalized" + (unnormalizedCounter += 1)
        : ""; /*[plugin=undefined, resource={}] if the name without a plugin prefix.
            If it may be a plugin id that doesn't normalization, stamp it with a unique ID*/
  n = names[1];
  if (n)
    p
      ? (normed = isNormed
          ? n
          : pM && pM.normalize
          ? //prettier-ignore
            pM.normalize(n, (n) => normalize(n, ptName, applyMap, ...configGets))
          : n.indexOf("!") === -1
          ? normalize(n, ptName, applyMap, ...configGets)
          : n) && (id = p + "!" + normed + suffix)
      : iifeapp(this)(
          ["normed", "names", "p", "normed", "isNormed", "url", "id"],
          normalize(n, ptName, applyMap, ...configGets),
          splitPrefix(normed),
          names[0],
          names[1],
          true,
          (nameToUrl(normed).prototype = {
            CONFIG: buildable.CONFIG,
            bdlMap: buildable.bdlMap
          }),
          normed + suffix
        );

  /*do not normalize if nested plugin references; albeit thi deprecates resourceIds,
      normalize after plugins are loaded and such normalizations allow for async loading of a loader plugin (#1131)
      ok base name, relative path?.normalize's 'map buildable.CONFIG application' might make normalized 'name' a 
      plugin ID.'map buildable.CONFIG values' are already normalized at thi point.*/
  return {
    prefix: p,
    name: normed,
    parentMap: sourcemap,
    unnormalized: !!suffix,
    url,
    givenName,
    yesdef,
    id
  }; //depMaps
}
