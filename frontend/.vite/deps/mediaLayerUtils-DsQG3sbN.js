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
import "./uuid-CI605U6Y.js";
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
import { o as l$1, r as c$1, t as E } from "./portalItemUtils-CDCH3kjA.js";
import { n as o } from "./jsonContext-r8n8WiRi.js";
import "./resourceUtils-CBs8pUFo.js";
import { n as p$1 } from "./resourceUtils-BbY7Q9V8.js";
import "./saveUtils-C8XCaiJv.js";
import { n as P, t as $ } from "./utils-DVzbewNR.js";
//#region node_modules/@arcgis/core/layers/save/mediaLayerUtils.js
var i = "Media Layer", u = "media-layer-save", p = "media-layer-save-as", l = ["media-layer:unsupported-source"];
function m(e) {
	return {
		isValid: "media" === e.type,
		errorMessage: "Layer.type should be 'media'"
	};
}
function c(e) {
	return o(e, "portal-item", !0);
}
function y(e) {
	return Promise.resolve(e.layerJSON);
}
async function f(e, r) {
	r.extent = e.fullExtent ? await l$1(e.fullExtent) : null;
}
async function d(e, r) {
	r.title ||= e.title, await f(e, r), c$1(r, E.METADATA);
}
async function v(e, t) {
	return P({
		layer: e,
		itemType: i,
		validateLayer: m,
		createJSONContext: (e) => c(e),
		createItemData: y,
		errorNamePrefix: u,
		supplementalUnsupportedErrors: l,
		setItemProperties: f,
		saveResources: (r, t) => p$1(e.resourceReferences, t)
	}, t);
}
async function x(r, t, a) {
	return $({
		layer: r,
		itemType: i,
		validateLayer: m,
		createJSONContext: (e) => c(e),
		createItemData: y,
		errorNamePrefix: p,
		supplementalUnsupportedErrors: l,
		newItem: t,
		setItemProperties: d,
		saveResources: (e, t) => p$1(r.resourceReferences, t)
	}, a);
}
//#endregion
export { v as save, x as saveAs };

//# sourceMappingURL=mediaLayerUtils-DsQG3sbN.js.map