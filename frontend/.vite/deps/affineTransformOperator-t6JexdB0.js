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
import "./memoryEstimations-BBFGLDPz.js";
import "./OptimizedGeometry-CNYohxaW.js";
import { mn as j } from "./Point2D-ClM_Ex8K.js";
import "./Envelope2D-DJ4EmFgu.js";
import "./MultiPathImpl-Cj23glYA.js";
import "./Transformation2D-B4vBHALJ.js";
import { t as s$1 } from "./GeometryCursor-4NZ0ZlkG.js";
import "./SpatialReference-CPSvOeFQ.js";
import "./jsonConverter-C7YfydKv.js";
import "./FlatGeometry-LfXCi8BW.js";
import "./FlatGeometry-D0n_NdSI.js";
import { n as E, r as M, t as C } from "./apiConverter-BiH9EVj2.js";
//#region node_modules/@arcgis/core/geometry/operators/gx/operatorAffineTransform.js
var n = class {
	getOperatorType() {
		return 10303;
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
	executeMany(e, r, t) {
		return new o(e, r, t);
	}
	execute(e, r, t) {
		const n = e.clone();
		return n.applyTransformation(r), n;
	}
};
var o = class extends s$1 {
	constructor(e, r, t) {
		super(), this.m_index = -1, this.m_transformation = r.clone(), this.m_inputGeometryCursor = e;
	}
	next() {
		let e;
		if (e = this.m_inputGeometryCursor.next()) {
			j(e), this.m_index = this.m_inputGeometryCursor.getGeometryID();
			const r = e.clone();
			return r.applyTransformation(this.m_transformation), r;
		}
		return null;
	}
	getGeometryID() {
		return this.m_index;
	}
	tock() {
		return !0;
	}
	getRank() {
		return 1;
	}
};
var s = new n();
function u(e, r) {
	return s.execute(e, r, null);
}
function c() {
	return s.supportsCurves();
}
//#endregion
//#region node_modules/@arcgis/core/geometry/operators/affineTransformOperator.js
function p(r, t) {
	const s = C(r);
	return E(u(M(r), t.transform), s);
}
c();
//#endregion
export { p as execute };

//# sourceMappingURL=affineTransformOperator-t6JexdB0.js.map