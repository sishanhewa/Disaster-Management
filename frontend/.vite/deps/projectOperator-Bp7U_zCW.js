import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import "./curveUtils-CfkOAT4m.js";
import { o as r } from "./jsonTypeUtils-D92XTAwe.js";
import "./zscale-Cit8BV12.js";
import { a as s$1, n as a$1, o as u$1, r as c$1, t as s } from "./projectionZScaling-Bvur8s9x.js";
//#region node_modules/@arcgis/core/geometry/operators/json/projectOperator.js
var a, i, p, c, f, m;
function l() {
	return !!a && u$1();
}
async function u() {
	if (!l()) {
		const [e, o] = await Promise.all([
			import("./jsonConverter-C7YfydKv.js").then((n) => n.s),
			import("./projectionTransformation-CJX8aG53.js"),
			c$1()
		]);
		a = e.fromGeometries, i = e.fromGeometry, p = e.fromSpatialReference, c = e.toGeometry, f = e.getSpatialReference, m = o.createProjectionTransformation;
	}
}
function j(o, t, r$1) {
	const a = i(o), f = p(t), l = m(a.getSpatialReference(), f, r$1), u = c(a$1(a.getGeometry(), l), f);
	return !r$1?.zConversionDisabled && u && !r(u) && o.spatialReference && s([u], o.spatialReference, t), u;
}
function y(e, t, r) {
	const [s$2, i] = a(e), l = p(t), j = s$1(s$2, m(i, l, r)).map((e) => c(e, l));
	if (!r?.zConversionDisabled && j) {
		const o = f(e);
		o && s(j, o, t);
	}
	return j;
}
//#endregion
export { j as execute, y as executeMany, l as isLoaded, u as load };

//# sourceMappingURL=projectOperator-Bp7U_zCW.js.map