import { _ as s, t as r } from "./Error-CzxduO2m.js";
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
import { t as M } from "./Portal-DYysvbhZ.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
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
import "./jsonUtils-D_oLUjKv.js";
import "./utils-5irCjX9t.js";
import "./utils-Ch7GqCap.js";
import { n as n$2, t as n$1 } from "./project-jhGP-KV5.js";
//#region node_modules/@arcgis/core/portal/support/geometryServiceUtils.js
async function n(t = null, i) {
	if (s.geometryServiceUrl) return s.geometryServiceUrl;
	if (!t) throw new r("internal:geometry-service-url-not-configured", "No geometryServiceUrl in configuration");
	let n;
	n = "portal" in t ? t.portal || M.getDefault() : t, await n.load({ signal: i });
	const a = n.helperServices?.geometry?.url;
	if (!a) throw new r("internal:geometry-service-url-not-configured", "No geometryServiceUrl in configuration");
	return a;
}
async function a(e, o, a = null, c) {
	const s = await n$1(await n(a, c), new n$2({
		geometries: [e],
		outSpatialReference: o
	}), { signal: c });
	if (s && Array.isArray(s) && 1 === s.length) return s[0];
	throw new r("internal:geometry-service-projection-failed", "Geometry projection failed on service");
}
//#endregion
export { n as getGeometryServiceURL, a as projectGeometry };

//# sourceMappingURL=geometryServiceUtils-DHVgMotV.js.map