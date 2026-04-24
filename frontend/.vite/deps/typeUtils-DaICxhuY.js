import { n as o, t as i } from "./jsonMap-CFSDFmi6.js";
import { m as s$1, t as _ } from "./Point-B7zMqEx6.js";
import { t as z } from "./Extent-CquIzaXp.js";
import { t as j } from "./Polygon-CCBjbbXT.js";
import { t as y$1 } from "./Polyline-Cv0nwof6.js";
import { t as m$1 } from "./Multipoint-B5Liskmz.js";
//#region node_modules/@arcgis/core/geometry/support/typeUtils.js
var y = i()({
	esriGeometryPoint: "point",
	esriGeometryMultipoint: "multipoint",
	esriGeometryPolyline: "polyline",
	esriGeometryPolygon: "polygon"
}), m = i()({
	esriGeometryPoint: "point",
	esriGeometryMultipoint: "multipoint",
	esriGeometryPolyline: "polyline",
	esriGeometryPolygon: "polygon",
	esriGeometryEnvelope: "extent",
	mesh: "mesh"
}), s = {
	base: s$1,
	key: "type",
	typeMap: {
		extent: z,
		multipoint: m$1,
		point: _,
		polyline: y$1,
		polygon: j
	}
}, u = new o({
	esriGeometryBezier3Curve: "cubic-bezier",
	esriGeometryCircularArc: "circular-arc",
	esriGeometryEllipticArc: "elliptic-arc"
}, { ignoreUnknown: !0 });
function c(e) {
	return "point" === e.type;
}
function G(e) {
	return "multipoint" === e.type;
}
function f(e) {
	return "polygon" === e.type;
}
function P(e) {
	return "polyline" === e.type;
}
//#endregion
export { m as a, y as c, f as i, P as n, s as o, c as r, u as s, G as t };

//# sourceMappingURL=typeUtils-DaICxhuY.js.map