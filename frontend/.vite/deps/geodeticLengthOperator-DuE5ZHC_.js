import { n as P, s as r$1, t as F } from "./pe-BLztJ5xc.js";
import { l as N } from "./units-Dg-cK1vO.js";
import { t as e } from "./geodeticCurveType-CAiC8BEg.js";
//#region node_modules/@arcgis/core/geometry/operators/gx/operatorGeodeticLength.js
var r;
function o() {
	return !!r && r$1();
}
async function i$1() {
	if (!o()) {
		const [n, o] = await Promise.all([
			import("./OperatorGeodeticLength-Bs63Qm8x.js"),
			import("./SpatialReference-CPSvOeFQ.js").then((n) => n.M).then((e) => e.aP).then(({ injectPe: e }) => e),
			P()
		]);
		r = new n.OperatorGeodeticLength(), o(F);
	}
}
function s(e, t, n) {
	return r.execute(e, t, n, null);
}
function c$1() {
	return r.supportsCurves();
}
//#endregion
//#region node_modules/@arcgis/core/chunks/geodeticLengthOperator.js
var p, i, n, u;
function c() {
	return !!p && o();
}
async function m() {
	if (!c()) {
		const [e] = await Promise.all([import("./apiConverter-BiH9EVj2.js").then((n) => n.s), i$1()]);
		p = e.fromGeometry, i = e.fromSpatialReference, n = e.getSpatialReference, u = c$1();
	}
}
function l(r, t = {}) {
	const { curveType: s$1 = "geodesic", unit: u } = t, c = n(r);
	let m = s(p(r), i(c), e[s$1]);
	return m && u && (m = N(m, "meters", u)), m;
}
var f = Object.freeze(Object.defineProperty({
	__proto__: null,
	execute: l,
	isLoaded: c,
	load: m,
	get supportsCurves() {
		return u;
	}
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
export { u as a, m as i, f as n, l as r, c as t };

//# sourceMappingURL=geodeticLengthOperator-DuE5ZHC_.js.map