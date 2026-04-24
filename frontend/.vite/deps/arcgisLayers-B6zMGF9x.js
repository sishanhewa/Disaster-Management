import { t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { V as I$1, f as m$1, u as h$1, ut as qt } from "./request-CuG5cxow.js";
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
import { a as H, y as j } from "./layerUtils-sQ-3wxAB.js";
import "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./catalogUtils-lRNSLCIB.js";
import { t as s } from "./associatedFeatureServiceUtils-Cl9xn0aS.js";
import { t as r$1 } from "./serviceJSON-yqpsTxFv.js";
import { t as a } from "./lazyLayerLoader-Cn1Ti5Ij.js";
import { n as u, t as n } from "./fetchService-kwjoRTYJ.js";
//#region node_modules/@arcgis/core/layers/support/arcgisLayers.js
var f = {
	FeatureLayer: !0,
	SceneLayer: !0,
	VideoLayer: !0
};
async function p(e) {
	const { properties: r, url: a } = e, t = {
		...r,
		url: a
	}, s = await w(a, r?.customParameters), { Constructor: l, layerId: o, sourceJSON: n, parsedUrl: c, layers: i, tables: u } = s;
	if (i.length + u.length === 0) return null != o && (t.layerId = o), null != n && (t.sourceJSON = n), new l(t);
	const y = new (await (import("./GroupLayer-DaeYTjb7.js"))).default({ title: c.title });
	return await v(y, s, t), y;
}
function m(e, r) {
	return e ? e.find(({ id: e }) => e === r) : null;
}
function d(e, r, a, t, s) {
	const l = {
		...s,
		layerId: r
	};
	return null != e && (l.url = e), null != a && (l.sourceJSON = a), "sublayerTitleMode" in t.prototype && (l.sublayerTitleMode = "service-name"), new t(l);
}
async function v(e, r, a) {
	const t = r.sublayerConstructorProvider;
	for (const { id: s, serverUrl: l } of r.layers) {
		const o = m(r.sublayerInfos, s), n = d(l, s, o, (o && t?.(o)) ?? r.Constructor, a);
		e.add(n);
	}
	if (r.tables.length) {
		const t = await L("FeatureLayer");
		r.tables.forEach(({ id: s, serverUrl: l }) => {
			const o = d(l, s, m(r.tableInfos, s), t, a);
			e.tables.add(o);
		});
	}
}
async function w(r$2, a) {
	let s = m$1(r$2);
	if (s ??= await S(r$2, a), null == s) throw new r("arcgis-layers:url-mismatch", "The url '${url}' is not a valid arcgis resource", { url: r$2 });
	const { serverType: l, sublayer: n } = s;
	let u$1;
	const p = {
		FeatureServer: "FeatureLayer",
		KnowledgeGraphServer: "KnowledgeGraphLayer",
		StreamServer: "StreamLayer",
		VectorTileServer: "VectorTileLayer",
		VideoServer: "VideoLayer"
	}, m = "FeatureServer" === l, d = "SceneServer" === l, v = {
		parsedUrl: s,
		Constructor: null,
		layerId: m || d ? n ?? void 0 : void 0,
		layers: [],
		tables: []
	};
	switch (l) {
		case "MapServer":
			if (null != n) {
				const { type: t } = await r$1(r$2, { customParameters: a });
				switch (u$1 = "FeatureLayer", t) {
					case "Catalog Layer":
						u$1 = "CatalogLayer";
						break;
					case "Catalog Dynamic Group Layer": throw new r("arcgis-layers:unsupported", `fromUrl() not supported for "${t}" layers`);
				}
			} else u$1 = await g(r$2, a) ? "TileLayer" : "MapImageLayer";
			break;
		case "ImageServer": {
			const { tileInfo: t, cacheType: s } = await r$1(r$2, { customParameters: a });
			u$1 = t ? "LERC" !== t?.format?.toUpperCase() || s && "elevation" !== s.toLowerCase() ? "ImageryTileLayer" : "ElevationLayer" : "ImageryLayer";
			break;
		}
		case "SceneServer": {
			const e = await r$1(s.url.path, { customParameters: a });
			if (u$1 = "SceneLayer", e) {
				const r = e?.layers;
				if ("Voxel" === e?.layerType) u$1 = "VoxelLayer";
				else if (r?.length) {
					const e = r[0]?.layerType;
					null != e && null != j[e] && (u$1 = j[e]);
				}
			}
			break;
		}
		case "3DTilesServer": throw new r("arcgis-layers:unsupported", "fromUrl() not supported for 3DTiles layers");
		case "FeatureServer":
			if (u$1 = "FeatureLayer", null != n) {
				const e = await r$1(r$2, { customParameters: a });
				v.sourceJSON = e, v.preferredUrl = H(), u$1 = u(e.type);
			}
			break;
		default: u$1 = p[l];
	}
	if (f[u$1] && null == n) {
		const e = await h(r$2, l, a);
		m && (v.preferredUrl = e.preferredUrl, v.sublayerInfos = e.layerInfos, v.tableInfos = e.tableInfos);
		if (1 !== e.layers.length + e.tables.length) v.layers = e.layers, v.tables = e.tables, m && e.layerInfos?.length && (v.sublayerConstructorProvider = await P(e.layerInfos));
		else if (m || d) {
			const r = e.layerInfos?.[0] ?? e.tableInfos?.[0];
			if (v.layerId = e.layers[0]?.id ?? e.tables[0]?.id, v.sourceJSON = r, m) {
				const e = r?.type;
				u$1 = u(e);
			}
		}
	}
	return v.Constructor = await L(u$1), v;
}
async function S(e, t) {
	const l = await r$1(e, { customParameters: t });
	let o = null, n = null;
	const c = l.type;
	if ("Feature Layer" === c || "Table" === c ? (o = "FeatureServer", n = l.id ?? null) : "indexedVector" === c ? o = "VectorTileServer" : l.hasOwnProperty("mapName") ? o = "MapServer" : l.hasOwnProperty("bandCount") && l.hasOwnProperty("pixelSizeX") ? o = "ImageServer" : l.hasOwnProperty("maxRecordCount") && l.hasOwnProperty("allowGeometryUpdates") ? o = "FeatureServer" : l.hasOwnProperty("streamUrls") ? o = "StreamServer" : b(l) ? (o = "SceneServer", n = l.id) : l.hasOwnProperty("layers") && b(l.layers?.[0]) && (o = "SceneServer"), !o) return null;
	const i = null != n ? h$1(e) : null;
	return {
		title: null != i && l.name || qt(e),
		serverType: o,
		sublayer: n,
		url: { path: null != i ? i.serviceUrl : I$1(e).path }
	};
}
function b(e) {
	return null != e && e.hasOwnProperty("store") && e.hasOwnProperty("id") && "number" == typeof e.id;
}
async function h(e, r, a) {
	let t, s, l, o = !1;
	switch (r) {
		case "FeatureServer": {
			const r = await n(e, { customParameters: a });
			l = H(e, { preferredHost: r.preferredHost }), o = !!r.layersJSON, t = r.layersJSON || r.serviceJSON;
			break;
		}
		case "SceneServer": {
			const r = await I(e, a);
			t = r.serviceInfo, s = r.tableServerUrl;
			break;
		}
		default: t = await r$1(e, { customParameters: a });
	}
	const i = t?.layers, u = t?.tables;
	return {
		preferredUrl: l,
		layers: i?.map((e) => ({ id: e.id })).reverse() || [],
		tables: u?.map((e) => ({
			serverUrl: s,
			id: e.id
		})).reverse() || [],
		layerInfos: o ? i : [],
		tableInfos: o ? u : []
	};
}
async function I(e, r) {
	const a = await r$1(e, { customParameters: r });
	if (!a.layers?.[0]) return { serviceInfo: a };
	try {
		const { serverUrl: t } = await s(e), s$1 = await r$1(t, { customParameters: r }).catch(() => null);
		return s$1 && (a.tables = s$1.tables), {
			serviceInfo: a,
			tableServerUrl: t
		};
	} catch {
		return { serviceInfo: a };
	}
}
async function L(e) {
	return (0, a[e])();
}
async function g(e, r) {
	return (await r$1(e, { customParameters: r })).tileInfo;
}
async function P(e) {
	if (!e.length) return;
	const r = /* @__PURE__ */ new Set(), a = [];
	for (const { type: l } of e) r.has(l) || (r.add(l), a.push(L(u(l))));
	const t = await Promise.all(a), s = /* @__PURE__ */ new Map();
	return Array.from(r).forEach((e, r) => {
		s.set(e, t[r]);
	}), (e) => s.get(e.type);
}
//#endregion
export { p as fromUrl };

//# sourceMappingURL=arcgisLayers-B6zMGF9x.js.map