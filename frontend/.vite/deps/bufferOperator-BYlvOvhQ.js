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
import "./Point2D-ClM_Ex8K.js";
import "./Envelope2D-DJ4EmFgu.js";
import "./MultiPathImpl-Cj23glYA.js";
import "./Transformation2D-B4vBHALJ.js";
import "./SpatialReference-CPSvOeFQ.js";
import { a as Xe, i as Qe, o as Ye, t as Ge } from "./jsonConverter-C7YfydKv.js";
import "./FlatGeometry-LfXCi8BW.js";
import "./FlatGeometry-D0n_NdSI.js";
import "./OperatorSimplifyOGC-DWjscXfK.js";
import "./GeometryCleaner-BEJM7I4l-rTnb1en2.js";
import "./OperatorGeneralize-0VxKLHic.js";
import "./Bufferer-Dw9Qi4T1-0E_5_AdN.js";
import { n as l, t as f } from "./operatorBuffer-CnXWzHoz.js";
//#region node_modules/@arcgis/core/geometry/operators/json/bufferOperator.js
function a(t, o, m = {}) {
	const { unit: a } = m, c = Ge(t);
	a && c && (o = F(o, a, c));
	const u = Ye(t), p = u.getSpatialReference();
	return Qe(f(u.getGeometry(), p, o), p);
}
function c(e, i, a = {}) {
	let { maxDeviation: c = NaN, maxVerticesInFullCircle: u = 96, union: p = !1, unit: f } = a;
	const l$1 = Ge(e);
	f && l$1 && (i = i.map((t) => F(t, f, l$1)), c && (c = F(c, f, l$1)));
	const [j, x] = Xe(e);
	return l(j, x, i, c, u, p).map((t) => Qe(t, x)).filter(N);
}
//#endregion
export { a as execute, c as executeMany };

//# sourceMappingURL=bufferOperator-BYlvOvhQ.js.map