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
import "./spatialReferenceUtils-b3vCEkpS.js";
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
import { t as g } from "./FeatureSet-Sjrap7hf.js";
import "./QuantizationParameters-BoZFfmfD.js";
import "./StatisticDefinition-DCvGQn-e.js";
import "./normalizeUtilsCommon-gtN1A7xM.js";
import { r as P } from "./normalizeUtils-BbPgVXXO.js";
import { t } from "./urlUtils-D1wXw-DR.js";
import { t as n$1 } from "./queryUtils-imz_pa9S.js";
import { n as v } from "./PivotQuery-BByobCpc.js";
//#region node_modules/@arcgis/core/rest/query/operations/queryPivot.js
function n(t) {
	const o = n$1(t), r = o.outPivots;
	if (r?.length) {
		for (const t of r) "Pivot" === t.pivotType && t.pivotParameters.outStatistic ? t.pivotParameters.outStatistic = JSON.stringify(t.pivotParameters.outStatistic) : "Unpivot" === t.pivotType && (t.unPivotParameters.sourceFields = t.unPivotParameters.sourceFields.join(","));
		o.outPivots = JSON.stringify(r);
	}
	return o;
}
async function u(t, o, r) {
	return await a(t, o, r);
}
async function a(s, u, a = {}) {
	const m = "string" == typeof s ? I(s) : s, c = (await P(u.geometry ? [u.geometry] : [], null, { signal: a.signal }))?.[0];
	null != c && ((u = u.clone()).geometry = c);
	const y = t({
		...m.query,
		f: "json",
		...n(u)
	});
	return f(V(m.path, "queryPivot"), {
		...a,
		query: {
			...y,
			...a.query
		}
	});
}
//#endregion
//#region node_modules/@arcgis/core/rest/query/executePivotQuery.js
async function i(i, s, m) {
	const p = f$1(i), u$1 = { ...m }, { data: a } = await u(p, v.from(s), u$1);
	return g.fromJSON(a);
}
//#endregion
export { i as executePivotQuery };

//# sourceMappingURL=executePivotQuery-CJQQlrB4.js.map