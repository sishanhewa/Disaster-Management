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
import { a as i, c as u$1, o as l$1, r as c$1, t as E } from "./portalItemUtils-CDCH3kjA.js";
import "./jsonContext-r8n8WiRi.js";
import "./saveUtils-C8XCaiJv.js";
import { n as P, t as $ } from "./utils-DVzbewNR.js";
//#region node_modules/@arcgis/core/layers/save/mapImageLayerUtils.js
var o = "Map Service", l = "map-image-layer-save", m = "map-image-layer-save-as";
function c(e) {
	return {
		isValid: "map-image" === e.type && !e.sourceJSON?.tileInfo,
		errorMessage: "Layer.type should be 'map-image' and reference a dynamic (non-cached) map service"
	};
}
function p(e) {
	const t = e.layerJSON;
	return Promise.resolve(t && Object.keys(t).length ? t : null);
}
function u(e, t) {
	return f(e, t), Promise.resolve();
}
async function y(e, t) {
	const { parsedUrl: s, title: i, fullExtent: o } = e;
	t.url = s.path, t.title ||= i, t.extent = o ? await l$1(o) : null, c$1(t, E.METADATA), f(e, t);
}
function f(e, t) {
	i(t, E.DYNAMIC);
	const r = e.sublayers?.length ?? 0;
	u$1(t, E.MULTI_LAYER, r > 1), u$1(t, E.SINGLE_LAYER, 1 === r);
}
async function v(e, r) {
	return P({
		layer: e,
		itemType: o,
		validateLayer: c,
		createItemData: p,
		errorNamePrefix: l,
		setItemProperties: u
	}, r);
}
async function I(t, r, a) {
	return $({
		layer: t,
		itemType: o,
		validateLayer: c,
		createItemData: p,
		errorNamePrefix: m,
		newItem: r,
		setItemProperties: y
	}, a);
}
//#endregion
export { v as save, I as saveAs };

//# sourceMappingURL=mapImageLayerUtils-BcMqYx_5.js.map