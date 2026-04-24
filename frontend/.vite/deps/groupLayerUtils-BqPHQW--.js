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
import { a as i, r as c$1, s, t as E } from "./portalItemUtils-CDCH3kjA.js";
import { n as o } from "./jsonContext-r8n8WiRi.js";
import "./resourceUtils-CBs8pUFo.js";
import { n as p$1 } from "./resourceUtils-BbY7Q9V8.js";
import "./saveUtils-C8XCaiJv.js";
import { n as P, t as $ } from "./utils-DVzbewNR.js";
//#region node_modules/@arcgis/core/layers/save/groupLayerUtils.js
var u = "Group Layer", c = "group-layer-save", l = "group-layer-save-as", p = E.GROUP_LAYER_MAP;
function m(e) {
	return {
		isValid: "group" === e.type,
		errorMessage: "Layer.type should be 'group'"
	};
}
function y(e) {
	return {
		isValid: s(e, p),
		errorMessage: `Layer.portalItem.typeKeywords should have '${p}'`
	};
}
function f(e, r) {
	return {
		...o(e, "web-map", !0),
		initiator: r
	};
}
function v(e) {
	const r = e.layerJSON;
	return Promise.resolve(r && Object.keys(r).length ? r : null);
}
async function d(e, r) {
	r.title ||= e.title, c$1(r, E.METADATA), i(r, p);
}
async function I(e, t) {
	return P({
		layer: e,
		itemType: u,
		validateLayer: m,
		validateItem: y,
		createJSONContext: (r) => f(r, e),
		createItemData: v,
		errorNamePrefix: c,
		saveResources: async (r, t) => (e.sourceIsPortalItem || await r.removeAllResources().catch(() => {}), p$1(e.resourceReferences, t))
	}, t);
}
async function g(r, t, o) {
	return $({
		layer: r,
		itemType: u,
		validateLayer: m,
		createJSONContext: (e) => f(e, r),
		createItemData: v,
		errorNamePrefix: l,
		newItem: t,
		setItemProperties: d,
		saveResources: (e, t) => p$1(r.resourceReferences, t)
	}, o);
}
//#endregion
export { I as save, g as saveAs };

//# sourceMappingURL=groupLayerUtils-BqPHQW--.js.map