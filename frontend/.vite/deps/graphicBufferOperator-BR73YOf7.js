import "./Error-CzxduO2m.js";
import { T as N } from "./typedArrayUtil-BAuNmygZ.js";
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
import { n as F } from "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./mathUtils-hEBUcrMa.js";
import "./curveUtils-CfkOAT4m.js";
import "./aaBoundingRect-CgUWvAgv.js";
import "./common-BxLRDsKd.js";
import "./vec2-BPF6SpMH.js";
import "./curveExtent--ue9-x0m.js";
import "./mat3-CPqND9LM.js";
import "./mat3f64-DZZP34-L.js";
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import "./aaBoundingBox-CzeY9F8R.js";
import "./memoryEstimations-BBFGLDPz.js";
import "./OptimizedGeometry-CNYohxaW.js";
import { mn as j } from "./Point2D-ClM_Ex8K.js";
import { n } from "./Envelope2D-DJ4EmFgu.js";
import "./MultiPathImpl-Cj23glYA.js";
import "./Transformation2D-B4vBHALJ.js";
import { t as s$1 } from "./GeometryCursor-4NZ0ZlkG.js";
import { Z as al } from "./SpatialReference-CPSvOeFQ.js";
import { t } from "./SimpleGeometryCursor-tjS0ieqv.js";
import { a as Xe, i as Qe, t as Ge } from "./jsonConverter-C7YfydKv.js";
import "./FlatGeometry-LfXCi8BW.js";
import "./FlatGeometry-D0n_NdSI.js";
import "./OperatorSimplifyOGC-DWjscXfK.js";
import "./GeometryCleaner-BEJM7I4l-rTnb1en2.js";
import "./OperatorGeneralize-0VxKLHic.js";
import { t as U } from "./Bufferer-Dw9Qi4T1-0E_5_AdN.js";
//#region node_modules/@arcgis/core/geometry/operators/gx/operatorGraphicBuffer.js
var m$1 = class {
	getOperatorType() {
		return 10111;
	}
	supportsCurves() {
		return !0;
	}
	accelerateGeometry(e, t, r) {
		return !1;
	}
	canAccelerateGeometry(e) {
		return !1;
	}
	executeMany(e, t, r, i, n, m, o, c, h, a, _) {
		if (h) {
			const h = new u(e, t, r, i, n, m, o, c, _);
			return new al().executeMany(h, t, _, 2);
		}
		return new u(e, t, r, i, n, m, o, c, _);
	}
};
var u = class extends s$1 {
	constructor(e, t, r, s, m, u, o, c, h) {
		super(), this.m_currentUnionEnvelope2D = new n(), this.m_index = -1, this.m_dindex = -1, this.m_progressTracker = h, this.m_bufferer = new U(h), this.m_inputGeoms = e, this.m_spatialReference = t, this.m_distances = r, this.m_maxDeviation = o, this.m_maxVerticesInFullCircle = c, this.m_joins = s, this.m_caps = m, this.m_miterLimit = u;
	}
	tock() {
		return !0;
	}
	getRank() {
		return 1;
	}
	next() {
		{
			let e;
			for (; e = this.m_inputGeoms.next();) return j(e), this.m_index = this.m_inputGeoms.getGeometryID(), this.m_dindex + 1 < this.m_distances.length && this.m_dindex++, this.buffer(e, this.m_distances[this.m_dindex]);
			return null;
		}
	}
	getGeometryID() {
		return this.m_index;
	}
	buffer(e, t) {
		return this.m_bufferer.buffer(e, t, this.m_spatialReference, this.m_joins, this.m_caps, this.m_miterLimit, this.m_maxDeviation, this.m_maxVerticesInFullCircle);
	}
};
var o = new m$1();
function c(t$1, r, s, i, n, m, u, c, h) {
	const a = o.executeMany(new t(t$1), r, s, i, n, m, u, c, h, 0, null);
	return Array.from(a);
}
//#endregion
//#region node_modules/@arcgis/core/geometry/operators/json/graphicBufferOperator.js
var m = {
	round: 0,
	miter: 1,
	bevel: 2
}, s = {
	round: 0,
	butt: 1,
	square: 2
};
function a(a, u, p, c$1, f = {}) {
	let { miterLimit: l = 10, maxDeviation: j = NaN, maxVerticesInFullCircle: x = 96, union: v = !1, unit: b } = f;
	const [d, y] = Xe(a);
	if (b) {
		const r = Ge(a);
		r && (u = u.map((o) => F(o, b, r)), j && (j = F(j, b, r)));
	}
	return c(d, y, u, m[p], s[c$1], l, j, x, v).map((r) => Qe(r, y)).filter(N);
}
//#endregion
export { a as executeMany };

//# sourceMappingURL=graphicBufferOperator-BR73YOf7.js.map