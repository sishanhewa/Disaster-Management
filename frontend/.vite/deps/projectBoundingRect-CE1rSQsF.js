import { l as T } from "./spatialReferenceUtils-b3vCEkpS.js";
import { d as e } from "./aaBoundingRect-CgUWvAgv.js";
import { s as n } from "./vec3f64-CwISzc_v.js";
import { t as o } from "./projectBuffer-CV6RkXdH.js";
//#region node_modules/@arcgis/core/geometry/projection/projectBoundingRect.js
function i(r, i, s, f) {
	return null != r && (T(i, f) ? (e(s, r), !0) : (p[0] = r[0], p[1] = r[1], p[2] = 0, !!o(p, i, 0, p, f, 0) && (s[0] = p[0], s[1] = p[1], p[0] = r[2], p[1] = r[3], p[2] = 0, !!o(p, i, 0, p, f, 0) && (s[2] = p[0], s[3] = p[1], !0))));
}
var p = n();
//#endregion
export { i as t };

//# sourceMappingURL=projectBoundingRect-CE1rSQsF.js.map