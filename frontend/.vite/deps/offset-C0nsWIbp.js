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
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./mathUtils-hEBUcrMa.js";
import "./Polygon-CCBjbbXT.js";
import "./curveUtils-CfkOAT4m.js";
import "./coordsUtils-DXLB9bAf.js";
import "./aaBoundingRect-CgUWvAgv.js";
import "./common-BxLRDsKd.js";
import "./vec2-BPF6SpMH.js";
import "./curveExtent--ue9-x0m.js";
import "./mat3-CPqND9LM.js";
import "./mat3f64-DZZP34-L.js";
import "./Polyline-Cv0nwof6.js";
import "./Multipoint-B5Liskmz.js";
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import "./aaBoundingBox-CzeY9F8R.js";
import "./enum-D9ePJlKL.js";
import "./memoryEstimations-BBFGLDPz.js";
import "./OptimizedGeometry-CNYohxaW.js";
import { a as w, n as h } from "./unitConversion-CSpfQSlF.js";
import "./Point2D-ClM_Ex8K.js";
import "./Envelope2D-DJ4EmFgu.js";
import "./MultiPathImpl-Cj23glYA.js";
import "./Transformation2D-B4vBHALJ.js";
import "./SpatialReference-CPSvOeFQ.js";
import { i as Qe, o as Ye } from "./jsonConverter-C7YfydKv.js";
import "./FlatGeometry-LfXCi8BW.js";
import "./FlatGeometry-D0n_NdSI.js";
import { n as E, r as M, t as C, u as w$1 } from "./apiConverter-BiH9EVj2.js";
import { n as w$2 } from "./operatorOffset-BWN-mpyq.js";
//#region node_modules/@arcgis/core/arcade/geometry/offset.js
var p = {
	round: 0,
	bevel: 1,
	miter: 2,
	square: 3
};
function u(t, m, f, p, u, a) {
	m = h(w(f), t.spatialReference, m);
	const l = M(t), y = C(t);
	return E(c(l, w$1(y), m, p, u, a), y);
}
function a(t, o, n, s, i, p) {
	o = h(w(n), t.spatialReference, o);
	const u = Ye(t), a = u.getGeometry(), l = u.getSpatialReference();
	return Qe(c(a, l, o, s, i, p), l);
}
function c(e, r, o, n, s, i) {
	const m = w$2(e, r, o, p[n], s, i);
	if (!m.isEmpty()) return m;
	{
		const m = e.clone();
		m.reverseAllPaths();
		const f = w$2(m, r, -o, p[n], s, i);
		if (!f.isEmpty()) return f.reverseAllPaths(), f;
	}
	const f = Math.abs(o) / 10, u = f / 10;
	let a = i;
	if ("round" === n && (a += u), "bevel" === n || "square" === n) {
		const m = w$2(e, r, o, p[n = "miter"], s, i);
		if (!m.isEmpty()) return m;
	}
	if ("miter" === n) {
		const m = w$2(e, r, o, p[n = "round"], s, i);
		if (!m.isEmpty()) return m;
	}
	if ("round" === n) for (; a <= f; a += u) {
		const i = w$2(e, r, o, p[n], s, a);
		if (!i.isEmpty()) return i;
	}
	return null;
}
//#endregion
export { u as executeOffset, a as executeOffsetJson };

//# sourceMappingURL=offset-C0nsWIbp.js.map