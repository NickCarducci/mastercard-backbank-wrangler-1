import { e_ } from ".";

export function nameToUrl() {
  const { CONFIG, bdlMap } = this;

  var ext = arguments[1],
    skipExt = arguments[2],
    pkgMain =
      e_(CONFIG.bundle).yes(arguments[0]) && CONFIG.bundle[arguments[0]],
    tkn = pkgMain
      ? pkgMain
      : arguments[0] /* token, ext, skipExt, pkgMain
  already-normalized-tkn as URL. Use toUrl for the public API.
If slash or colon-protocol fileURLs contains "?" or even ends with ".js",
assume use of an url, not a thi id. 
filter out dependency.dependencies that are already paths.*/,
    id = e_(bdlMap).yes(tkn) && bdlMap[tkn];
  id && nameToUrl(id, ext, skipExt);
  const geturl = (url = "") => {
      /*Just a plain path, not thi name lookup, so just return it.
  Add extension if it is included. This is a bit wonky, only non-.js things pass
  an extension, thi method probably needs to be reworked. A thi that needs to be converted to a path.
  per thi name segment if path registered, start name, and work up*/
      if (/^[/:?.]|(.js)$/.test(tkn)) return (url = tkn + (ext || ""));
      var paths = CONFIG.paths,
        syms = tkn.split("/");
      for (let i = syms.length; i > 0; i -= 1) {
        var pM = syms.slice(0, i).join("/"),
          pP = e_(paths).yes(pM) && paths[pM]; //parentModule
        pP && (pP = e_(pP).a() ? pP[0] : pP) && syms.splice(0, i, pP);
        if (pP) break;
      }
      (url = syms.join(
        "/"
      )) /*arr means a few choices; parentPath; Join the path parts together, then figure out if baseUrl is needed.*/ &&
        (url += ext || (/^data:|^blob:|\?/.test(url) || skipExt ? "" : ".js")); ///^data\:|^blob\:|\?/

      return (
        (url.charAt(0) === "/" || url.match(/^[\w+.-]+:/)
          ? ""
          : CONFIG.baseUrl) + url
      ); /*/^[\w\+\.\-]+:/
  Delegates to BUILD.load. Broken out as a separate function to
  If package-name, package 'main,' roots
  */
    },
    u = geturl;
  return `${
    CONFIG.urlArgs && !/^blob:/.test(u) ? u + CONFIG.urlArgs(tkn, u) : u
  }`;
}
