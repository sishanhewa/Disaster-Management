import { i as G, t as A } from "./layerUtils-sQ-3wxAB.js";
import { n as o } from "./catalogUtils-lRNSLCIB.js";
//#region node_modules/@arcgis/core/layers/support/editableLayers.js
function n(t) {
	return "object" == typeof t && null != t && "loaded" in t && !0 === t.loaded && "type" in t;
}
function e(e) {
	return !(!n(e) || !A(e)?.operations?.supportsEditing || "editingEnabled" in e && !G(e) || o(e));
}
//#endregion
export { e as t };

//# sourceMappingURL=editableLayers-CbwLaa1q.js.map