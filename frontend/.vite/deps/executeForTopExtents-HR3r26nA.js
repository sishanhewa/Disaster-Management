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
import { t as z } from "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
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
import "./Cyclical-BTNbmw1N.js";
import "./jsonUtils-D_oLUjKv.js";
import "./typeUtils-DaICxhuY.js";
import { n as f } from "./utils-5irCjX9t.js";
import "./utils-Ch7GqCap.js";
import "./zscale-Cit8BV12.js";
import "./queryZScale-BhSMSSYh.js";
import "./normalizeUtilsCommon-gtN1A7xM.js";
import "./normalizeUtils-BbPgVXXO.js";
import "./queryUtils-imz_pa9S.js";
import { n as c } from "./queryTopFeatures-Cwi7LA_W.js";
import j from "./TopFeaturesQuery-vLy-x0hL.js";
//#region node_modules/@arcgis/core/rest/query/executeForTopExtents.js
async function e(e, n, m) {
	const i = await c(f(e), j.from(n), { ...m }), u = i.data.extent;
	return !u || isNaN(u.xmin) || isNaN(u.ymin) || isNaN(u.xmax) || isNaN(u.ymax) ? {
		count: i.data.count,
		extent: null
	} : {
		count: i.data.count,
		extent: z.fromJSON(u)
	};
}
//#endregion
export { e as executeForTopExtents };

//# sourceMappingURL=executeForTopExtents-HR3r26nA.js.map