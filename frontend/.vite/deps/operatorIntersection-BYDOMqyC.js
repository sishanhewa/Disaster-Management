import { n as __exportAll } from "./chunk-BoAXSpZd.js";
import { wt as wh } from "./SpatialReference-CPSvOeFQ.js";
import { t as t$1 } from "./SimpleGeometryCursor-tjS0ieqv.js";
//#region node_modules/@arcgis/core/geometry/operators/gx/operatorIntersection.js
var operatorIntersection_exports = /* @__PURE__ */ __exportAll({
	accelerateGeometry: () => t,
	execute: () => o,
	executeMany: () => u,
	supportsCurves: () => s
});
var n = new wh();
function t(e, r) {
	return n.accelerateGeometry(e, r, 1);
}
function o(e, r, t) {
	return n.execute(e, r, t, null);
}
function u(r, t, o, u) {
	const s = n.executeMany(new t$1(r), new t$1([t]), o, null, u);
	return Array.from(s);
}
function s() {
	return n.supportsCurves();
}
//#endregion
export { u as a, t as i, operatorIntersection_exports as n, s as r, o as t };

//# sourceMappingURL=operatorIntersection-BYDOMqyC.js.map