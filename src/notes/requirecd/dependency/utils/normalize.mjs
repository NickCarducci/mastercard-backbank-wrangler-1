import { e_, Y } from ".";
const _f = "*";

export const normalize = (nm, bn, applyMap, conId, system, configPkgs) => {
  const tool = () => {
      return {
        parseName: (...args) => {
          var name = args[0],
            roots = args[1],
            suffjs = args[2];

          if (!name) return null;
          if (name[0].charAt(0) === "." && roots)
            name = roots.slice(0, roots.length - 1).concat(name);

          /\.js$/.test(name[name.length - 1]) &&
            suffjs &&
            name[name.length - 1].replace(/\.js$/, "");

          /*Adjust any relative paths. node allows either .js or non .js, 
        yet not in nameToUrl;baseName.push(nm), but new instead of length report*/
          for (let i = 0; i < name.length; i++) {
            const solid = name[i] === "." && name.splice(i, 1);
            if (solid) continue;
            i = solid ? i - 1 : i;
            const more =
              i === 0 || (i === 1 && name[2] === "..") || name[i - 1] === "..";
            if (!more && i > 0 && name.splice(i - 1, 2)) i -= 2;
          }
          return name.join("/");
        },
        convertName: (nm, mp, applyMap, ph) => {
          if (!applyMap || !mp || (!ph && !mp[_f])) return nm;
          var n,
            i,
            nms = nm.split("/"),
            folder; /*just enabled, but unactivated, modules
          continue search ___ map BUILD.CONFIG, bigloop: 
          favor a "star map" unless shorter matching BUILD.CONFIG*/

          for (let g = nms.length; g > 0; g -= 1) {
            const name = nms.slice(0, g).join("/"),
              mV = (fP = (f) => ph.slice(0, f).join("/")) =>
                e_(mp).yes(fP) && mp[fP],
              loop = (sum = 0) => {
                let add = (sum = ph.length);
                var maybe = mV && e_(mV).yes(name) && mV[name],
                  set = () => (i = g),
                  more = mV && e_(mV).yes(name) && mV[name],
                  loo = (add, sum) => (sum = add);
                /*for (f = z.ph.length; f > 0; f--) {
                var bre = null;
                if (s) bre = true;
                if (z.mV && e_(z.mV).yes(name) && z.mV[name]) set();
                if (bre) break;
              }*/

                return maybe && set() && (more ? loo(add--, sum) : null);
              };

            var configMap = mp && mp[_f];
            Y(
              mp &&
                mp[_f] &&
                e_(mp[_f]).yes(name) &&
                (folder = configMap[name]) &&
                ph &&
                loop() &&
                !folder &&
                configMap &&
                e_(configMap).yes(name) &&
                (folder = configMap[name]) &&
                (n = g)
            ) &&
              ph &&
              loop();
          } /* bigloop; ;Match, update name to the new value.*/

          if (system) return (nm = nms.splice(0, i, system).join("/"));
          if (folder) {
            system = folder;
            i = n;
          }
          return nm;
        }
      };
    },
    rs = bn && bn.split("/");
  nm =
    tool().parseName(nm, rs, conId) &&
    tool().convertName(nm, system, applyMap, rs);
  return e_(configPkgs).yes(nm) ? configPkgs[nm] : nm;
}; //obj.prototype["hasOwnProperty"][name]; const method =string?"toString":"hasOwnProperty"

