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
import "./Point2D-ClM_Ex8K.js";
import "./Envelope2D-DJ4EmFgu.js";
import { Lt as se } from "./MultiPathImpl-Cj23glYA.js";
import "./Transformation2D-B4vBHALJ.js";
import "./SpatialReference-CPSvOeFQ.js";
import { t as m } from "./OperatorProximity-CAbIkYWW.js";
import "./jsonConverter-C7YfydKv.js";
import "./FlatGeometry-LfXCi8BW.js";
import "./FlatGeometry-D0n_NdSI.js";
import { d as z, l as v, r as M, t as C } from "./apiConverter-BiH9EVj2.js";
//#region node_modules/@arcgis/core/arcade/geometry/nearestVertex.js
function s(e, t, n) {
	const r = (t.x - e.x) * (n.y - e.y) - (n.x - e.x) * (t.y - e.y);
	return r > 0 ? "left" : r < 0 ? "right" : "straddle";
}
function a(e, t, n) {
	if (e.getPointCount() <= 0) return "left";
	const r = e.querySegmentIteratorAtVertex(n), o = r.hasPreviousSegment() ? r.previousSegment() : r.nextSegment();
	return s(o.getStartXY(), o.getEndXY(), t);
}
var c = new m();
function d(t, s) {
	const d = M(t), m = v(s).getXY(), p = c.getNearestVertex(d, m);
	if (p.isEmpty()) return null;
	switch (t.type) {
		case "point": return {
			coordinate: t,
			distance: p.m_distance,
			sideOfLine: 0 === p.m_distance ? "straddle" : "left"
		};
		case "multipoint": {
			const n = new se();
			return d.getPointByVal(p.m_vertexIndex, n), {
				coordinate: z(n, C(t)),
				distance: p.m_distance,
				sideOfLine: 0 === p.m_distance ? "straddle" : "left"
			};
		}
		case "polyline":
		case "polygon": {
			const n = new se();
			return d.getPointByVal(p.m_vertexIndex, n), {
				coordinate: z(n, C(t)),
				distance: p.m_distance,
				sideOfLine: a(d, m, p.m_vertexIndex)
			};
		}
		default: throw new Error(`Unsupported geometry type: ${t.type}`);
	}
}
//#endregion
export { d as executeNearestVertex };

//# sourceMappingURL=nearestVertex-B6c5IJqi.js.map