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
import "./OperatorGeneralize-0VxKLHic.js";
import { n as t, t as o } from "./operatorGeneralize-CE8jpF-i.js";
//#region node_modules/@arcgis/core/geometry/operators/json/generalizeOperator.js
function u(r, a, u = {}) {
	const { removeDegenerateParts: c = !1, unit: i } = u, m = Ge(r);
	i && m && (a = F(a, i, m));
	const p = Ye(r), f = t(p.getGeometry(), a, c);
	return null == f ? null : Qe(f, p.getSpatialReference());
}
function c(t, o$1, u = {}) {
	const { removeDegenerateParts: c = !1, unit: i } = u, m = Ge(t);
	i && m && (o$1 = F(o$1, i, m));
	const [p, f] = Xe(t);
	return o(p, o$1, c).map((e) => Qe(e, f));
}
//#endregion
export { u as execute, c as executeMany };

//# sourceMappingURL=generalizeOperator-hz_8E18T.js.map