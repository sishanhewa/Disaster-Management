import { H as K, et as _, ht as x$1 } from "./request-CuG5cxow.js";
import { T as f$1 } from "./promiseUtils-DhYhergm.js";
import { t as q$1 } from "./Collection-BAJSKCip.js";
import { t as a } from "./basemapDefinitions-CGK-Ctsz.js";
import { r } from "./utils-3ndlmaCD.js";
//#region node_modules/@arcgis/core/support/basemapUtils.js
function s(e) {
	return "Web Scene" === e.portalItem?.type || e.referenceLayers.some((e) => "scene" === e.type);
}
function u(e) {
	return !!e?.portalItem?.tags?.some((e) => "beta" === e.toLowerCase()) || !!e?.portalItem?.categories?.includes("/Categories/Status/Beta");
}
function c(e, r) {
	return e.allLayerViews.find((e) => e.uid === r)?.layer.parent === e.map?.basemap;
}
var o;
function f(e) {
	if (o) return o(e);
	let r = null;
	const t = v(e), a$1 = !t?.baseLayers.length;
	for (const n in a) {
		const e = w(t, R(a[n]), { mustMatchReferences: a$1 });
		if ("equal" === e) {
			r = n;
			break;
		}
		"base-layers-equal" === e && (r = n);
	}
	return r;
}
function p(e, r) {
	if (e === r) return !0;
	if (null != e?.portalItem?.id && e.portalItem.id === r?.portalItem?.id) return !0;
	return "equal" === w(v(e), v(r), { mustMatchReferences: !0 });
}
function m(e) {
	return !!e?.baseLayers.concat(e.referenceLayers).some(d);
}
function d(e) {
	if (S(e.url)) return !0;
	if ("vector-tile" === e.type) for (const r in e.sourceNameToSource) {
		const t = e.sourceNameToSource[r];
		if (S(t?.sourceUrl)) return !0;
	}
	return !1;
}
function b(e, r) {
	if (null == r || null == e) return {
		spatialReference: null,
		updating: !1
	};
	if ("not-loaded" === r.loadStatus) return r.load(), {
		spatialReference: null,
		updating: !0
	};
	if (r.spatialReference) return {
		spatialReference: r.spatialReference,
		updating: !1
	};
	if (0 === r.baseLayers.length) return {
		spatialReference: null,
		updating: !1
	};
	const t = r.baseLayers.at(0);
	switch (t.loadStatus) {
		case "not-loaded": t.load();
		case "loading": return {
			spatialReference: null,
			updating: !0
		};
		case "failed": return {
			spatialReference: null,
			updating: !1
		};
	}
	const a = (("supportedSpatialReferences" in t ? t.supportedSpatialReferences : null) || ["tileInfo" in t ? t.tileInfo?.spatialReference : t.spatialReference]).filter(Boolean), n = e.spatialReference;
	return n ? {
		spatialReference: a.find((e) => n.equals(e)) ?? a[0] ?? null,
		updating: !1
	} : {
		spatialReference: a[0],
		updating: !1
	};
}
var L = /^(basemaps|ibasemaps).*-api\.arcgis\.com$/i;
function S(e) {
	if (!e) return !1;
	const r = new x$1(_(e));
	return !!r.authority && L.test(r.authority);
}
function v(e) {
	return e ? !e.loaded && e.resourceInfo ? R(e.resourceInfo.data) : {
		baseLayers: g(e.baseLayers),
		referenceLayers: g(e.referenceLayers),
		groundLayers: g(e.groundLayers)
	} : null;
}
function g(r) {
	return (q$1.isCollection(r) ? r.toArray() : r).map(I);
}
function I(e) {
	return {
		type: e.type,
		effect: "effect" in e ? e.effect : void 0,
		url: M("urlTemplate" in e && e.urlTemplate || e.url || "styleUrl" in e && e.styleUrl || ""),
		minScale: "minScale" in e && null != e.minScale ? e.minScale : 0,
		maxScale: "maxScale" in e && null != e.maxScale ? e.maxScale : 0,
		opacity: null != e.opacity ? e.opacity : 1,
		visible: null == e.visible || !!e.visible,
		sublayers: "map-image" !== e.type && "wms" !== e.type || null == e.sublayers ? void 0 : e.sublayers?.map((e) => ({
			id: e.id,
			visible: e.visible
		})),
		activeLayerId: "wmts" === e.type ? e.activeLayer?.id : void 0
	};
}
function h(e) {
	return e.isReference || "ArcGISSceneServiceLayer" === e.layerType;
}
function R(e) {
	return e ? {
		baseLayers: T((e.baseMapLayers ?? []).filter((e) => !h(e))),
		referenceLayers: T((e.baseMapLayers ?? []).filter((e) => h(e))),
		groundLayers: T(e.groundLayers ?? [])
	} : null;
}
function T(e) {
	return e.map((e) => q(e));
}
function q(e) {
	let r;
	switch (e.layerType) {
		case "VectorTileLayer":
			r = "vector-tile";
			break;
		case "ArcGISTiledMapServiceLayer":
			r = "tile";
			break;
		case "ArcGISSceneServiceLayer":
			r = "scene";
			break;
		case "IntegratedMesh3DTilesLayer":
			r = "IntegratedMesh3DTilesLayer";
			break;
		default: r = "unknown";
	}
	return {
		type: r,
		effect: e.effect,
		url: M(e.templateUrl || e.urlTemplate || e.styleUrl || e.url),
		minScale: e.minScale ?? 0,
		maxScale: e.maxScale ?? 0,
		opacity: e.opacity ?? 1,
		visible: null == e.visibility || !!e.visibility,
		sublayers: void 0,
		activeLayerId: void 0
	};
}
function w(e, r, t) {
	if (null != e != (null != r)) return "not-equal";
	if (!e || !r) return "equal";
	if (!x(e.baseLayers, r.baseLayers)) return "not-equal";
	return x(e.referenceLayers, r.referenceLayers) ? "equal" : t.mustMatchReferences ? "not-equal" : "base-layers-equal";
}
function x(e, r) {
	if (e.length !== r.length) return !1;
	for (let t = 0; t < e.length; t++) if (!U(e[t], r[t])) return !1;
	return !0;
}
function U(e, r$1) {
	if (e.type !== r$1.type || e.url !== r$1.url || e.minScale !== r$1.minScale || e.maxScale !== r$1.maxScale || e.visible !== r$1.visible || e.opacity !== r$1.opacity) return !1;
	if (!r(e.effect, r$1.effect)) return !1;
	if (null != e.activeLayerId || null != r$1.activeLayerId) return e.activeLayerId === r$1.activeLayerId;
	if (null != e.sublayers || null != r$1.sublayers) {
		if (null == e.sublayers || null == r$1.sublayers || e.sublayers.length !== r$1.sublayers.length) return !1;
		for (let t = 0; t < e.sublayers.length; t++) {
			const a = e.sublayers.at(t), n = r$1.sublayers.at(t);
			if (a?.id !== n?.id || a?.visible !== n?.visible) return !1;
		}
	}
	return !0;
}
function M(e) {
	return e ? K(e).replace(/^\s*https?:/i, "").toLowerCase() : "";
}
function k(e) {
	if (!e) return null;
	const { thumbnailUrl: t } = e;
	if (t) return t;
	const a$2 = f(e);
	return a$2 ? a[a$2].thumbnailUrl : f$1(e.baseLayers, j);
}
function j(e) {
	return "portalItem" in e ? e.portalItem?.thumbnailUrl : void 0;
}
//#endregion
export { m as a, u as c, k as i, c as n, p as o, d as r, s, b as t };

//# sourceMappingURL=basemapUtils-C5xoGB-C.js.map