import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { V as I, Y as V, t as f } from "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./Evented-GLJbxWO5.js";
import "./SimpleObservable-CNlRjEs1.js";
import "./Collection-BAJSKCip.js";
import "./collectionUtils-DQeMhtWS.js";
import "./JSONSupport-BUaD4jSd.js";
import "./Promise-Dhhz7kXA.js";
import "./Loadable-CQsALnOO.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import { f as d, l as T } from "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import "./Portal-DYysvbhZ.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import "./Color-C99QAF80.js";
import "./opacityUtils-DgEZ8x-q.js";
import "./Clonable-D_RHUyXD.js";
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
import "./vec3f64-CwISzc_v.js";
import "./Multipoint-B5Liskmz.js";
import "./spatialReferenceEllipsoidUtils-qNeWENaq.js";
import "./GeographicTransformation-D90zE-j2.js";
import "./geodesicConstants-C0TscDSm.js";
import "./projectBuffer-CV6RkXdH.js";
import "./projectionUtils-CmEsVWfk.js";
import { l as u } from "./jsonTypeUtils-D92XTAwe.js";
import "./Cyclical-BTNbmw1N.js";
import "./jsonUtils-D_oLUjKv.js";
import "./typeUtils-DaICxhuY.js";
import { n as f$1 } from "./utils-5irCjX9t.js";
import "./utils-Ch7GqCap.js";
import "./fieldType-D7SwLPxF.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./PopupTemplate-8SH37QID.js";
import "./fieldFormatUtils-R1ptUFq7.js";
import "./ActionToggle-JH4srUd2.js";
import "./Graphic-D2G0Ykqt.js";
import "./SimpleMarkerSymbol-BjFFaoyw.js";
import "./typeUtils-DZkmoi8p.js";
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import "./aaBoundingBox-CzeY9F8R.js";
import "./symbolLayerUtils3D-BQRyZskR.js";
import "./textUtils-B4iTDAON.js";
import "./TextSymbol-CsSnkPMD.js";
import "./SimpleFillSymbol-CbXKKnxp.js";
import "./PictureMarkerSymbol-Crs5VdSs.js";
import "./Field-jzopk-Sr.js";
import "./FeatureSet-Sjrap7hf.js";
import "./StatisticDefinition-DCvGQn-e.js";
import "./NormalizationBinParametersMixin-BMz0fNea.js";
import "./normalizeUtilsCommon-gtN1A7xM.js";
import { r as P } from "./normalizeUtils-BbPgVXXO.js";
import { t } from "./urlUtils-D1wXw-DR.js";
import "./projectionSupport-qG0SGMeB.js";
import "./queryUtils-CNTJGLMY.js";
import "./FixedIntervalBinParameters-CbmEfZTf.js";
import { t as i$1 } from "./AttributeBinsFeatureSet-C9_UVRGK.js";
import { n as R } from "./AttributeBinsQuery-BIYjAjK6.js";
//#region node_modules/@arcgis/core/rest/query/operations/queryAttributeBins.js
function l(t) {
	const e = t.geometry, i = t.toJSON(), r = i;
	let u$1, l, a;
	if (null != e && (l = e.spatialReference, a = d(l), r.geometryType = u(e), r.geometry = JSON.stringify(e), r.inSR = a), i.outSR ? (r.outSR = d(i.outSR), u$1 = t.outSpatialReference) : e && (r.outSR = r.inSR, u$1 = l), r.bin &&= JSON.stringify(r.bin), r.quantizationParameters &&= JSON.stringify(r.quantizationParameters), r.outStatistics &&= JSON.stringify(r.outStatistics), r.outTimeReference &&= JSON.stringify(r.outTimeReference), i.timeExtent) {
		const { start: e, end: n } = i.timeExtent;
		null == e && null == n || (r.time = e === n ? e : `${e ?? "null"},${n ?? "null"}`), delete i.timeExtent;
	}
	return t.defaultSpatialReference && T(l, u$1) && (r.defaultSR = r.inSR, delete r.inSR, delete r.outSR), r;
}
async function a(t, e, i) {
	return null != e.timeExtent && e.timeExtent.isEmpty ? { data: { features: [] } } : await m(t, e, i);
}
async function m(n, o, s = {}) {
	const a = "string" == typeof n ? I(n) : n, y = (await P(o.geometry ? [o.geometry] : [], null, { signal: s.signal }))?.[0];
	null != y && ((o = o.clone()).geometry = y);
	const p = t({
		...a.query,
		f: "json",
		...l(o)
	});
	return f(V(a.path, "queryBins"), {
		...s,
		query: {
			...p,
			...s.query
		}
	});
}
//#endregion
//#region node_modules/@arcgis/core/rest/query/executeAttributeBinsQuery.js
async function i(i, s, u) {
	const { data: m } = await a(f$1(i), R.from(s), u);
	return i$1.fromJSON(m);
}
//#endregion
export { i as executeAttributeBinsQuery };

//# sourceMappingURL=executeAttributeBinsQuery-BKYG_gsX.js.map