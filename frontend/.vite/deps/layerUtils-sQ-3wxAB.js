import { D as s$1, t as f$1 } from "./request-CuG5cxow.js";
import { t as q$1 } from "./Collection-BAJSKCip.js";
import { n as o$1 } from "./catalogUtils-lRNSLCIB.js";
//#region node_modules/@arcgis/core/support/userTypeGuards/isBasemap.js
var n = Symbol("BasemapInstance");
function t(t) {
	return null != t && "object" == typeof t && n in t;
}
//#endregion
//#region node_modules/@arcgis/core/layers/support/layerUtils.js
function u(e) {
	return d(e) || y(e);
}
function o(e) {
	return null != e && "object" == typeof e && "type" in e && "feature" === e.type;
}
function s(e) {
	return null != e && "object" == typeof e && "type" in e && "graphics" === e.type;
}
function c(e) {
	return null != e && "object" == typeof e && "type" in e && "map-image" === e.type;
}
function l(e) {
	return null != e && "object" == typeof e && "type" in e && "knowledge-graph" === e.type && "layers" in e;
}
function f(e) {
	return null != e && "object" == typeof e && "type" in e && "knowledge-graph-sublayer" === e.type;
}
function p(e) {
	return null != e && "object" == typeof e && "type" in e && "link-chart" === e.type && "layers" in e;
}
function y(e) {
	return null != e && "object" == typeof e && "type" in e && "scene" === e.type;
}
function g(e) {
	return null != e && "object" == typeof e && "type" in e && "subtype-group" === e.type && "sublayers" in e;
}
function b(e) {
	return "subtype-sublayer" === e?.type;
}
function d(e) {
	const t = e?.type;
	return "imagery-tile" === t || "tile" === t || "open-street-map" === t || "vector-tile" === t || "web-tile" === t || "wmts" === t;
}
function m(e) {
	const t = e?.type;
	return "base-tile" === t || "tile" === t || "elevation" === t || "imagery-tile" === t || "base-elevation" === t || "open-street-map" === t || "wcs" === t || "web-tile" === t || "wmts" === t || "vector-tile" === t;
}
var j = {
	Point: "SceneLayer",
	"3DObject": "SceneLayer",
	IntegratedMesh: "IntegratedMeshLayer",
	PointCloud: "PointCloudLayer",
	Building: "BuildingSceneLayer"
};
function v(e) {
	const t = e?.type;
	return "building-scene" === t || "integrated-mesh" === t || "point-cloud" === t || "scene" === t;
}
function w(e) {
	return "integrated-mesh" === e.type || "integrated-mesh-3dtiles" === e.type;
}
function L(e) {
	return "integrated-mesh-3dtiles" === e.type;
}
function T(e) {
	return "feature" === e?.type && !e.url && "memory" === e.source?.type;
}
function U(e) {
	const t = e?.type;
	return ("feature" === t || "subtype-group" === t || "oriented-imagery" === t) && "feature-layer" === e?.source?.type;
}
function M(e) {
	return "feature" === e?.type && "feature-layer" === e.source?.type;
}
function O(e) {
	return o(e) && M(e);
}
function P(e) {
	const t = e?.type;
	return "binning" === t || "cluster" === t;
}
function B(e, t) {
	if (!O(e)) return;
	const n = t?.graphic, r = e.featureReduction;
	if (n) {
		if (n.isAggregate) {
			const e = n.origin;
			return e && "featureReductionProvider" in e && r ? P(r) ? r : null : void 0;
		}
		return e;
	}
	return t?.checkFeatureReduction && r ? P(r) ? r : null : e;
}
function q(e) {
	if (e.activeLayer) {
		const t = e.activeLayer.tileMatrixSet;
		if (t) return t;
		const n = e.activeLayer.tileMatrixSets;
		if (n) return n;
	}
	return null;
}
async function F(n, r) {
	const i = s$1?.findServerInfo(n);
	if (null != i?.currentVersion) return i.owningSystemUrl || null;
	const u = n.toLowerCase().indexOf("/rest/services");
	if (-1 === u) return null;
	const { data: c } = await f$1(`${n.slice(0, u)}/rest/info`, {
		query: { f: "json" },
		responseType: "json",
		signal: null != r ? r.signal : null
	});
	return c?.owningSystemUrl || null;
}
function J(e) {
	if (!("capabilities" in e)) return !1;
	switch (e.type) {
		case "catalog":
		case "catalog-footprint":
		case "csv":
		case "feature":
		case "geojson":
		case "imagery":
		case "knowledge-graph-sublayer":
		case "ogc-feature":
		case "oriented-imagery":
		case "scene":
		case "sublayer":
		case "subtype-group":
		case "subtype-sublayer":
		case "wfs": return !0;
		default: return !1;
	}
}
function A(e) {
	return J(e) ? "effectiveCapabilities" in e ? e.effectiveCapabilities : e.capabilities : null;
}
function D(e) {
	if (!("editingEnabled" in e)) return !1;
	switch (e.type) {
		case "csv":
		case "feature":
		case "geojson":
		case "oriented-imagery":
		case "scene":
		case "subtype-group":
		case "subtype-sublayer":
		case "knowledge-graph-sublayer": return !0;
		default: return !1;
	}
}
function G(e) {
	return !!D(e) && ("effectiveEditingEnabled" in e ? e.effectiveEditingEnabled : e.editingEnabled);
}
function z(e) {
	const t = new q$1();
	for (const n of e.allLayers.concat(e.allTables)) "csv" === n.type || o$1(n) || ("charts" in n && t.push(n), "subtype-group" === n.type && t.push(...n.sublayers));
	return t;
}
function H(e, t) {
	return null;
}
function K(e) {
	return null;
}
function Q(e) {
	return !e || "Feature Service" === e.type && !e.sourceUrl;
}
function W(e, t) {
	if (!t || !Q(e)) return;
	const n = H(e.url);
	n && (e.url = n);
}
//#endregion
export { n as A, p as C, v as D, u as E, w as O, o as S, s as T, f as _, H as a, l as b, L as c, T as d, U as f, d as g, c as h, G as i, t as j, z as k, O as l, b as m, B as n, J as o, W as p, F as r, K as s, A as t, Q as u, g as v, q as w, m as x, j as y };

//# sourceMappingURL=layerUtils-sQ-3wxAB.js.map