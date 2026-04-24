import { d as z, r as M, t as C } from "./apiConverter-BiH9EVj2.js";
import { t as a } from "./Centroid-DZi-eb9F-B4lipcQd.js";
//#region node_modules/@arcgis/core/chunks/centroidOperator.js
var s = class {
	getOperatorType() {
		return 10205;
	}
	accelerateGeometry(e, r, t) {
		return !1;
	}
	canAccelerateGeometry(e) {
		return !1;
	}
	supportsCurves() {
		return !0;
	}
	execute(r, t) {
		return a(r);
	}
};
var u = new s();
function n(e) {
	return z(u.execute(M(e), null), C(e));
}
var c = u.supportsCurves(), p = Object.freeze(Object.defineProperty({
	__proto__: null,
	execute: n,
	supportsCurves: c
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
export { n, p as r, c as t };

//# sourceMappingURL=centroidOperator-Dw0YwX-P.js.map