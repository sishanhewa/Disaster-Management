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
import "./Point2D-ClM_Ex8K.js";
import "./Envelope2D-DJ4EmFgu.js";
import "./MultiPathImpl-Cj23glYA.js";
import "./Transformation2D-B4vBHALJ.js";
import "./SpatialReference-CPSvOeFQ.js";
import { a as Xe, i as Qe, o as Ye, r as Ke } from "./jsonConverter-C7YfydKv.js";
import "./FlatGeometry-LfXCi8BW.js";
import "./FlatGeometry-D0n_NdSI.js";
import { i as w, n as _, t as D } from "./operatorConvexHull-B5UkkWO_.js";
//#region node_modules/@arcgis/core/geometry/operators/json/convexHullOperator.js
function a(t) {
	const r = Ye(t);
	return Qe(w(r.getGeometry()), r.getSpatialReference());
}
function c(e, r = {}) {
	const { merge: o = !1 } = r, [u, a] = Xe(e);
	return _(u, o).map((e) => Qe(e, a));
}
function p(e) {
	return D(Ke(e));
}
//#endregion
export { a as execute, c as executeMany, p as isConvex };

//# sourceMappingURL=convexHullOperator-DrdD1lQE.js.map