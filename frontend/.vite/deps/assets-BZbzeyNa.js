import { _ as s, n as n$1, t as r } from "./Error-CzxduO2m.js";
import { Y as V } from "./request-CuG5cxow.js";
//#region node_modules/@arcgis/core/assets.js
function n(t) {
	if (!s.assetsPath) throw n$1.getLogger("esri.assets").errorOnce("The API assets location needs to be set using config.assetsPath. More information: https://arcg.is/1OzLe50"), new r("assets:path-not-set", "config.assetsPath is not set");
	return V(s.assetsPath, t);
}
//#endregion
export { n as t };

//# sourceMappingURL=assets-BZbzeyNa.js.map