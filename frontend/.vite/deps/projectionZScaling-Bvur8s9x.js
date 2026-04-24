import { t as r } from "./Error-CzxduO2m.js";
import { n as P, s as r$1, t as F } from "./pe-BLztJ5xc.js";
import { l as u$1, r as l } from "./jsonTypeUtils-D92XTAwe.js";
import { n as r$2 } from "./zscale-Cit8BV12.js";
import { t } from "./SimpleGeometryCursor-tjS0ieqv.js";
//#region node_modules/@arcgis/core/geometry/operators/gx/operatorProject.js
var o;
function u() {
	return !!o && r$1();
}
async function c() {
	if (!u()) {
		const [n, t] = await Promise.all([
			import("./OperatorProject-D_DUqi72.js"),
			import("./SpatialReference-CPSvOeFQ.js").then((n) => n.M).then((n) => n.aP).then(({ injectPe: n }) => n),
			P()
		]);
		o = new n.OperatorProject(), t(F);
	}
}
function a(n, e) {
	return o.execute(n, e, null);
}
function s$1(e, r) {
	const t$1 = o.executeMany(new t(e), r, null);
	return Array.from(t$1);
}
function m() {
	return o.supportsCurves();
}
//#endregion
//#region node_modules/@arcgis/core/geometry/operators/support/projectionZScaling.js
function s(t, s, n) {
	let p;
	for (const c of t) if (c && l(c) && !("vertexAttributes" in c)) {
		if (!p) {
			null == s.vcsWkid && null == n.vcsWkid || i(s, n);
			if (p = r$2("type" in c ? c.type : u$1(c), s, n), !p) return;
		}
		p(c);
	}
}
var n = class extends r {
	constructor() {
		super("projection:z-unsupported", "projection of z values is unsupported between different vertical coordinate systems");
	}
};
function i({ vcsWkid: t }, { vcsWkid: o }) {
	if ((t ?? null) !== (o ?? null)) throw new n();
}
//#endregion
export { s$1 as a, m as i, a as n, u as o, c as r, s as t };

//# sourceMappingURL=projectionZScaling-Bvur8s9x.js.map