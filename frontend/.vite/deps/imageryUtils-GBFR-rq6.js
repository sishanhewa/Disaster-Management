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
import "./Evented-GLJbxWO5.js";
import "./SimpleObservable-CNlRjEs1.js";
import "./Collection-BAJSKCip.js";
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
import "./PortalItem-BaGmB6Wg.js";
import "./layerUtils-sQ-3wxAB.js";
import "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./catalogUtils-lRNSLCIB.js";
import "./mathUtils-hEBUcrMa.js";
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
import { c as u$1, o as l$1, r as c$1, t as E } from "./portalItemUtils-CDCH3kjA.js";
import "./jsonContext-r8n8WiRi.js";
import "./saveUtils-C8XCaiJv.js";
import { n as r } from "./datasetUtils-DFOaibKW.js";
import { n as P, t as $ } from "./utils-DVzbewNR.js";
//#region node_modules/@arcgis/core/layers/save/imageryUtils.js
var l = "Image Service", m = "imagery-layer-save", o = "imagery-layer-save-as", n = "imagery-tile-layer-save", c = "imagery-tile-layer-save-as", p = "WCS", u = "wcs-layer-save", g = "wcs-layer-save-as";
function v(t) {
	if ("imagery" === t.type || "wcs" === t.type) return { isValid: !0 };
	const { raster: a } = t, r$1 = r(a)[0];
	return {
		isValid: "RasterTileServer" === r$1?.datasetFormat && ("Raster" === r$1.tileType || "Map" === r$1.tileType),
		errorMessage: "imagery tile layer should be created from a tiled image service."
	};
}
function f(e) {
	const t = e.layerJSON;
	return Promise.resolve(t && Object.keys(t).length ? t : null);
}
async function d(e, t) {
	const { parsedUrl: a, title: l, fullExtent: m } = e;
	t.url = a.path, t.title ||= l;
	try {
		t.extent = await l$1(m);
	} catch {
		t.extent = void 0;
	}
	c$1(t, E.METADATA), u$1(t, E.TILED_IMAGERY, "imagery-tile" === e.type);
}
async function I(e, t) {
	const r = "imagery" === e.type ? m : "imagery-tile" === e.type ? n : u;
	return P({
		layer: e,
		itemType: "wcs" === e.type ? p : l,
		validateLayer: v,
		createItemData: f,
		errorNamePrefix: r
	}, t);
}
async function T(e, a, r) {
	const s = "imagery" === e.type ? o : "imagery-tile" === e.type ? c : g;
	return $({
		layer: e,
		itemType: "wcs" === e.type ? p : l,
		validateLayer: v,
		createItemData: f,
		errorNamePrefix: s,
		newItem: a,
		setItemProperties: d
	}, r);
}
//#endregion
export { I as save, T as saveAs };

//# sourceMappingURL=imageryUtils-GBFR-rq6.js.map