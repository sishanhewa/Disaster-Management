import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import { l as N } from "./units-Dg-cK1vO.js";
import { a as u$1, i as s, n as c$1 } from "./operatorGeodesicBuffer-DYRIJzsl.js";
import { t as e } from "./geodeticCurveType-CAiC8BEg.js";
//#region node_modules/@arcgis/core/geometry/operators/json/geodesicBufferOperator.js
var a, m, c;
function u() {
	return !!a && s();
}
async function p() {
	if (!u()) {
		const [e] = await Promise.all([import("./jsonConverter-C7YfydKv.js").then((n) => n.s), u$1()]);
		a = e.fromGeometries, m = e.fromGeometry, c = e.toGeometry;
	}
}
function f(e$1, r, i = {}) {
	let { curveType: s = "geodesic", maxDeviation: a = NaN, unit: u } = i;
	u && (r = N(r, u, "meters"), a && (a = N(a, u, "meters")));
	const p = m(e$1), f = p.getSpatialReference();
	return c(c$1(p.getGeometry(), f, e[s], r, a), f);
}
//#endregion
export { f as execute, p as load };

//# sourceMappingURL=geodesicBufferOperator-C0hNeRIP.js.map