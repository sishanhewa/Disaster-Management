import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
import "./assets-BZbzeyNa.js";
import { n as P, s as r, t as F } from "./pe-BLztJ5xc.js";
import "./Clonable-D_RHUyXD.js";
import { n as p$1, t as a$1 } from "./GeographicTransformation-D90zE-j2.js";
//#region node_modules/@arcgis/core/geometry/operators/support/geographicTransformationUtils.js
var i, s, c, a;
function p() {
	return !!i && r();
}
async function u() {
	if (!p()) {
		const [e, o, r, p] = await Promise.all([
			import("./Envelope2D-DJ4EmFgu.js").then((n) => n.t),
			import("./ProjectionTransformation-9Sclht7V.js").then(({ queryTransformationList: n }) => n),
			import("./SpatialReference-CPSvOeFQ.js").then((n) => n.M).then((n) => n.aP).then(({ injectPe: n }) => n),
			import("./apiConverter-BiH9EVj2.js").then((n) => n.s),
			P()
		]);
		c = e.Envelope2D.construct, a = e.Envelope2D.constructEmpty(), i = o, r(F), s = p.fromSpatialReference;
	}
}
function m(n, t, e = null) {
	const o = e ? l(e) : a, r = i(0, s(n), s(t), o, 1, !0);
	return r.length > 0 ? h(r[0]) : null;
}
function f(n, t, e = null) {
	const o = e ? l(e) : a;
	return i(0, s(n), s(t), o, 0, !0).map((n) => h(n));
}
function l(n) {
	return c(n.xmin, n.ymin, n.xmax, n.ymax);
}
function h(n) {
	const t = new a$1();
	for (let e = 0; e < n.count(); e++) {
		const o = n.getStep(e);
		t.steps.push(new p$1({
			wkid: o.getID(),
			isInverse: o.isInverted()
		}));
	}
	return t;
}
//#endregion
export { m as getTransformation, f as getTransformations, p as isLoaded, u as load };

//# sourceMappingURL=geographicTransformationUtils-CVopmH58.js.map