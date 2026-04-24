import { u as O } from "./units-Dg-cK1vO.js";
import { mn as j } from "./Point2D-ClM_Ex8K.js";
import { r as M, t as C } from "./apiConverter-BiH9EVj2.js";
import { n as b } from "./Distance2DCalculator-CXhBP-8I-CrzDQed3.js";
//#region node_modules/@arcgis/core/chunks/distanceOperator.js
var s = class {
	getOperatorType() {
		return 10100;
	}
	supportsCurves() {
		return !0;
	}
	accelerateGeometry(e, r, t) {
		return !1;
	}
	canAccelerateGeometry(e) {
		return !1;
	}
	execute(e, r, t) {
		return this.executeEx(e, r, t, null, null, NaN);
	}
	executeEx(t, u, o, s, n, c) {
		if (t.isEmpty() || u.isEmpty()) return NaN;
		j(t), j(u);
		const a = t, m = u;
		Number.isNaN(c) && (c = Number.POSITIVE_INFINITY);
		const p = new b(c, o).calculate(a, m, s, n);
		return Number.isFinite(p) ? p : NaN;
	}
};
var n = new s();
function c(e, r, s = {}) {
	const { unit: c } = s;
	let a = n.execute(M(e), M(r), null);
	if (a && c) {
		const r = C(e);
		a = O(a, r, c);
	}
	return a;
}
var a = n.supportsCurves(), m = Object.freeze(Object.defineProperty({
	__proto__: null,
	execute: c,
	supportsCurves: a
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
export { c as n, m as r, a as t };

//# sourceMappingURL=distanceOperator-Bi4Ncvf4.js.map