import { T as N } from "./typedArrayUtil-BAuNmygZ.js";
import { n as E, r as M, t as C, u as w } from "./apiConverter-BiH9EVj2.js";
import { a as u$1, i as t, r as s, t as o } from "./operatorIntersection-BYDOMqyC.js";
//#region node_modules/@arcgis/core/chunks/intersectionOperator.js
function u(e) {
	const t$1 = C(e);
	return t(M(e), w(t$1));
}
function i(e, r) {
	const o$1 = C(e);
	return E(o(M(e), M(r), w(o$1)), o$1);
}
function m(r, t) {
	const s = r.map(M), u = C(r);
	return u$1(s, M(t), w(u), 7).map((e) => E(e, u)).filter(N);
}
var f = s(), l = Object.freeze(Object.defineProperty({
	__proto__: null,
	accelerateGeometry: u,
	execute: i,
	executeMany: m,
	supportsCurves: f
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
export { u as a, m as i, i as n, l as r, f as t };

//# sourceMappingURL=intersectionOperator-DHxtcKHD.js.map