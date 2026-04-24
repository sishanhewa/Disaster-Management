import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { h as r$2, n as n$3, t as r$1 } from "./Error-CzxduO2m.js";
import { T as N } from "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { C as y$2, b as s$1, f as d } from "./promiseUtils-DhYhergm.js";
import { n as c$2, t as a$2 } from "./decorators-DE7S5xmd.js";
import { t as b$1 } from "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./Evented-GLJbxWO5.js";
import "./SimpleObservable-CNlRjEs1.js";
import { t as q } from "./Collection-BAJSKCip.js";
import "./collectionUtils-DQeMhtWS.js";
import "./JSONSupport-BUaD4jSd.js";
import { t as m$1 } from "./Promise-Dhhz7kXA.js";
import { n as p$2, r as u$1, t as m$2 } from "./Loadable-CQsALnOO.js";
import "./asyncUtils-D83Q647Q.js";
import "./loadAll-BbdxAVDP.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import { t as n$4 } from "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import { l as T, n as C, s as P } from "./spatialReferenceUtils-b3vCEkpS.js";
import { K as w$2, z as H$1 } from "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import { t as M } from "./Portal-DYysvbhZ.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import "./PortalItem-BaGmB6Wg.js";
import "./messages-BSXJ_xjI.js";
import "./basemapDefinitions-CGK-Ctsz.js";
import { n as F } from "./Basemap-u-nyEwoW.js";
import { E as u$2, c as L, g as d$1, w as q$1, x as m$3 } from "./layerUtils-sQ-3wxAB.js";
import { a as h$2, i as f$3, o as j$1, r as a$3, s as l } from "./reactiveUtils-DRpp6Nmg.js";
import { t as o } from "./Identifiable-D2tBaz7a.js";
import "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./catalogUtils-lRNSLCIB.js";
import "./writeUtils-BXROtS1d.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import "./Clonable-D_RHUyXD.js";
import "./uuid-CI605U6Y.js";
import "./Polygon-CCBjbbXT.js";
import "./curveUtils-CfkOAT4m.js";
import "./coordsUtils-DXLB9bAf.js";
import { S as u$3, u as c$3 } from "./aaBoundingRect-CgUWvAgv.js";
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
import { g as tn, n as F$1, s as V } from "./projectionUtils-CmEsVWfk.js";
import "./utils-3ndlmaCD.js";
import "./mat4-CCf33Vjt.js";
import { c as u$4, i as k, o as p$3, s as s$2, t as b$2 } from "./basemapUtils-C5xoGB-C.js";
import { r as p$4 } from "./basemapEnsureType-Dr1Yhv3d.js";
import "./number-DwLpDjta.js";
import "./intl-1FbLkipu.js";
import "./sanitizerUtils-D4_LRYnp.js";
import "./TileInfo-Dm0DlKvz.js";
import "./TileKey-DNAwECdW.js";
import { n as c$4, t as O } from "./Widget-D7J6FR9J.js";
import { c as x, i as l$1, s as v } from "./widget-BsQfm1ik.js";
import { t as e$1 } from "./globalCss-Dvrz6ByO.js";
import "./projector-76ZJJlBX.js";
import "./runtime-C8rHe43j.js";
import { t as e$2 } from "./utils-br6xDzeb.js";
import { n as f$4, r as x$1 } from "./TerrainConst-DkJAX4Om.js";
import { t as i$2 } from "./Heading-CRYmNhex.js";
//#region node_modules/@arcgis/core/views/ViewingMode.js
function n$2(l) {
	return 1 === l ? "global" : "local";
}
//#endregion
//#region node_modules/@arcgis/core/views/3d/support/supportedSpatialReference.js
function i$1(e) {
	return n$1(e) || H$1(e) || w$2(e);
}
function n$1(r) {
	return P(r) || C(r);
}
//#endregion
//#region node_modules/@arcgis/core/chunks/terrainUtilsPlanar.js
function s(t, o, l, s) {
	if (null == t) return x$1();
	const a = t.spatialReference;
	if (a.isGeographic && !n$1(a)) return new r$1("tilingscheme:local-unsupported-spatial-reference", "The tiling scheme spatial reference is not supported in local scenes");
	const u = f$4.checkUnsupported(t);
	if (null != u) return u;
	if (null == l) return new r$1("tilingscheme:extent-not-exist", "The layer does not provide a layer extent.");
	return c$1(t, l) || (null == o || a.equals(o) || o.isWGS84 && a.isWebMercator ? null : new r$1("tilingscheme:spatial-reference-mismatch", "The tiling scheme does not match the spatial reference of the local scene"));
}
function c$1(r, n) {
	const s = r.lods, c = s[0].resolution * 2 ** s[0].level, a = [c * r.size[0], c * r.size[1]], u = [r.origin.x, r.origin.y], p = c$3(n), f = u$3();
	f$4.computeRowColExtent(p, a, u, f);
	const m = (f[2] - f[0]) * (f[3] - f[1]);
	if (m > 64) {
		const t = s[0].scale * 2 ** s[0].level;
		let o = Math.max((p[3] - p[1]) / r.size[1], (p[2] - p[0]) / r.size[0]) * t / c;
		const n = Math.floor(Math.log(o) / Math.log(10));
		return o = Math.ceil(o / 10 ** n) * 10 ** n, new r$1("tilingscheme:too-many-root-tiles", "Scale of level 0 of the tiling scheme (1:" + Math.floor(t).toLocaleString() + ") is too large for the layer's extent. Suggested scale: 1:" + o.toLocaleString() + ".", {
			level0Scale: t,
			suggestedLevel0Scale: o,
			requiredNumRootTiles: m,
			allowedNumRootTiles: 64
		});
	}
	return null;
}
var a$1 = Object.freeze(Object.defineProperty({
	__proto__: null,
	checkIfTileInfoSupportedForViewSR: s
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
//#region node_modules/@arcgis/core/chunks/terrainUtilsSpherical.js
function n(n, r, c, o) {
	if (null == n) return x$1();
	const s = n?.lods.length - 1, a = n.spatialReference;
	if (a.isWebMercator) {
		if (!f$4.makeWebMercatorAuxiliarySphere(s).compatibleWith(n, o)) return new r$1("tilingscheme:incompatible-global-web-mercator", "The tiling scheme is not compatible with the ArcGIS Online Web Mercator tiling scheme");
	} else {
		if (!i$1(a)) return new r$1("tilingscheme:global-unsupported-spatial-reference", "The tiling scheme spatial reference is not supported in global scenes");
		if (!f$4.makeGCSWithTileSize(n.spatialReference, n.size[0], s).compatibleWith(n, o)) return n.spatialReference.isWGS84 ? new r$1("tilingscheme:incompatible-global-wgs84", "The tiling scheme is not compatible with the ArcGIS Online WGS84 tiling scheme") : new r$1("tilingscheme:incompatible-global", "The tiling scheme is not compatible with the ArcGIS Online tiling scheme");
	}
	return null == r || n.spatialReference.equals(r) ? null : new r$1("tilingscheme:spatial-reference-mismatch", "The tiling scheme does not match the spatial reference of the global scene");
}
var r = Object.freeze(Object.defineProperty({
	__proto__: null,
	checkIfTileInfoSupportedForViewSR: n
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
//#region node_modules/@arcgis/core/views/3d/terrain/terrainUtils.js
var a = {
	1: r,
	2: a$1
};
function D(n, t, e, r, o) {
	return a[r].checkIfTileInfoSupportedForViewSR(n, e, t, o);
}
function H(t, e, o) {
	const i = q$1(t);
	if (null != i) {
		if (!q.isCollection(i)) return {
			tileInfo: i.tileInfo,
			fullExtent: i.fullExtent
		};
		{
			const n = i.find((n) => null == D(n.tileInfo, n.fullExtent, e, o));
			if (n) return {
				tileInfo: n.tileInfo,
				fullExtent: n.fullExtent
			};
		}
	}
	return {
		tileInfo: null,
		fullExtent: null
	};
}
//#endregion
//#region node_modules/@arcgis/core/views/support/spatialReferenceSupport.js
function i(i, r) {
	return null != i && (null == r || (2 === r ? !i.isGeographic || i.isWGS84 || 4490 === i.wkid : i.isWebMercator || i.isWGS84 || 4490 === i.wkid || 104971 === i.wkid || 104905 === i.wkid || 104903 === i.wkid));
}
//#endregion
//#region node_modules/@arcgis/core/widgets/BasemapGallery/support/basemapCompatibilityUtils.js
async function f$2(e, t = {}) {
	const { basemap: i, view: r } = e;
	await i.load(t), w$1(i), await h$1(i, r, t), s$1(t);
}
async function u(t, r = {}) {
	const { basemap: n, view: s } = t;
	s$1(r);
	const l = n.baseLayers.find((e) => "unknown" === e.type)?.loadError;
	if (null != l) throw l;
	if (!s || "spatialReferenceLocked" in s && !s.spatialReferenceLocked) return;
	if (await n.load(r), s$1(r), 0 === n.baseLayers.length) return;
	const o = n.baseLayers.at(0);
	if (!m$3(o)) return;
	if (n.spatialReference) {
		if (s.spatialReference.equals(n.spatialReference)) return;
		y$1();
	}
	await o.load(r), s$1(r);
	const p = (("supportedSpatialReferences" in o ? o.supportedSpatialReferences : null) || ["tileInfo" in o ? o.tileInfo?.spatialReference : null]).filter(N);
	0 !== p.length && p.every((e) => !s.spatialReference.equals(e)) && y$1();
}
function y$1() {
	throw new r$1("basemap-compatibility:incompatible-spatial-reference", "Basemap spatial reference is not compatible with the view");
}
function w$1(e) {
	if (0 === e.baseLayers.length && 0 === e.groundLayers.length && 0 === e.referenceLayers.length) return;
	const t = e.baseLayers.concat(e.referenceLayers).toArray().filter((e) => !u$2(e)).map((e) => b(e));
	if (t.length) throw t[0];
	if (e.groundLayers) {
		if (e.groundLayers.filter((e) => !L(e)).map((e) => b(e)).length) throw t[0];
	}
}
function b(e) {
	return new r$1("basemap-compatibility:unsupported-basemap-layer-type", "Unsupported basemap layer type ${operationalLayerType}", {
		layer: e,
		operationalLayerType: e.operationalLayerType || "unknown"
	});
}
async function h$1(e, a, i) {
	let r = e.baseLayers.at(0);
	if (e.groundLayers?.length > 0) r = e.groundLayers.at(0);
	else {
		if (!(e.baseLayers.length > 0)) return;
		r = e.baseLayers.at(0);
	}
	if (d$1(r)) {
		try {
			await r.load(i);
		} catch (n) {
			const e = "basemap-compatibility:unknown-error", a = "Unknown basemap compatibility error", { name: i = e, message: r = a, details: s } = n;
			throw new r$1(i, r, s);
		}
		g(r, a);
	}
}
function g(e, a) {
	const i$3 = a.state.viewingMode;
	if (!i$3) return;
	let r, n;
	if ("wmts" === e?.type) {
		const s = H(e, a.spatialReference, i$3);
		if (null == s.tileInfo) throw new r$1("basemapgalleryitem:tiling-scheme-incompatible", "Basemap tiling scheme is incompatible with the view");
		r = s.tileInfo, n = s.fullExtent;
	} else r = e.tileInfo, n = e.fullExtent;
	if (null == r) return;
	if (!i(r.spatialReference, i$3)) throw new r$1(`basemapgalleryitem:spatial-reference-unsupported-${n$2(i$3)}`, `Basemap spatial reference is unsupported in ${n$2(i$3)} mode`);
	const s = "vector-tile" === e?.type ? r.getCompatibleForVTL(256) : null;
	if (1 === i$3) {
		let a = D(r, n, null, i$3);
		if (a && "vector-tile" === e?.type && null != n && s && !D(s, n, null, i$3) && (a = null), a) throw new r$1(`basemapgalleryitem:tiling-scheme-unsupported-${r.spatialReference.isWebMercator ? "web-mercator" : "wgs84"}-global`, "Basemap tiling scheme is unsupported in global mode", { error: a });
	} else if (f$4.checkUnsupported(r)) throw new r$1("basemapgalleryitem:tiling-scheme-unsupported-local", "Basemap tiling scheme is unsupported in local mode");
	const f = a.basemapTerrain?.tilingScheme;
	if (f && !f.compatibleWith(r) && ("vector-tile" !== e?.type || !s || !f.compatibleWith(s))) throw new r$1("basemapgalleryitem:tiling-scheme-incompatible", "Basemap tiling scheme is incompatible with the view");
}
//#endregion
//#region node_modules/@arcgis/core/widgets/BasemapGallery/support/BasemapGalleryItem.js
var p$1 = class extends o(b$1) {
	constructor(e) {
		super(e), this.compatibilityFunction = null, this.error = null, this.state = "loading", this.view = null;
	}
	initialize() {
		const e = () => this.refresh();
		this.addHandles([
			l(() => this.basemap?.loadStatus, e),
			l(() => this.compatibilityFunction, e),
			l(() => this.view && "basemapTerrain" in this.view && this.view.basemapTerrain?.tilingScheme, e),
			l(() => this.view?.ready, e),
			l(() => this.view?.spatialReference, e)
		]), this.refresh();
	}
	destroy() {
		this._cancelRefresh(), this.basemap = null, this.compatibilityFunction = null, this.view = null;
	}
	get _spatialReferenceTask() {
		return b$2(this.view, this.basemap);
	}
	set basemap(e) {
		e && e.load().catch(() => {}), this._set("basemap", e);
	}
	get spatialReference() {
		return this._spatialReferenceTask.spatialReference;
	}
	refresh() {
		this._cancelRefresh(), this._set("state", "loading");
		const e = this.basemap?.loadStatus;
		if ("loaded" !== e && "failed" !== e) return;
		if (!this.compatibilityFunction) return void ("loaded" === e ? (this._set("state", "ready"), this._set("error", null)) : (this._set("state", "error"), this._set("error", this.basemap.loadError)));
		const t = new AbortController(), { signal: s } = t;
		this.compatibilityFunction(this, { signal: s }).then(() => j$1(() => !this._spatialReferenceTask.updating, s)).then(() => {
			this._set("state", "ready"), this._set("error", null);
		}).catch((e) => {
			d(e) || (this._set("state", "error"), this._set("error", e));
		}), this._refreshController = t;
	}
	_cancelRefresh() {
		this._refreshController && (this._refreshController.abort(), this._refreshController = null);
	}
};
__decorate([a$2({ readOnly: !0 })], p$1.prototype, "_spatialReferenceTask", null), __decorate([a$2()], p$1.prototype, "basemap", null), __decorate([a$2()], p$1.prototype, "compatibilityFunction", void 0), __decorate([a$2({ readOnly: !0 })], p$1.prototype, "error", void 0), __decorate([a$2({ readOnly: !0 })], p$1.prototype, "spatialReference", null), __decorate([a$2({ readOnly: !0 })], p$1.prototype, "state", void 0), __decorate([a$2()], p$1.prototype, "view", void 0), p$1 = __decorate([c$2("esri.widgets.BasemapGallery.support.BasemapGalleryItem")], p$1);
var h = p$1;
//#endregion
//#region node_modules/@arcgis/core/widgets/BasemapGallery/support/LocalBasemapsSource.js
var p = q.ofType(F);
var c = class extends b$1 {
	constructor(e) {
		super(e), this.basemaps = new p();
	}
	destroy() {
		this.basemaps.forEach((e) => e.destroy());
	}
	get state() {
		return "ready";
	}
	refresh() {}
};
__decorate([a$2({ type: p })], c.prototype, "basemaps", void 0), __decorate([a$2({ readOnly: !0 })], c.prototype, "state", null), c = __decorate([c$2("esri.widgets.BasemapGallery.support.LocalBasemapsSource")], c);
var m = c;
//#endregion
//#region node_modules/@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource.js
var y = q.ofType(F);
var f$1 = class extends p$2(m$1(m)) {
	constructor(t) {
		super(t), this._lastPortalBasemapFetchController = null, this.basemaps = new y(), this.filterFunction = null, this.portal = M.getDefault(), this.query = null, this.updateBasemapsCallback = null, this.viewType = null;
	}
	initialize() {
		this.addHandles(l(() => [
			this.filterFunction,
			this.loadStatus,
			this.portal?.basemapGalleryGroupQuery,
			this.portal?.basemapGalleryGroupQuery3D,
			this.portal?.user,
			this.query,
			this.updateBasemapsCallback
		], () => y$2(this.refresh()), h$2));
	}
	destroy() {
		this.filterFunction = null, this.portal = null, this.basemaps.forEach((t) => t.destroy());
	}
	get state() {
		return "not-loaded" === this.loadStatus ? "not-loaded" : "loading" === this.loadStatus || this._lastPortalBasemapFetchController ? "loading" : "ready";
	}
	load(t) {
		return this.addResolvingPromise(this.portal.load(t)), Promise.resolve(this);
	}
	async refresh() {
		if ("loaded" !== this.loadStatus) return;
		this._lastPortalBasemapFetchController && (this._lastPortalBasemapFetchController.abort(), this._lastPortalBasemapFetchController = null);
		const t = this.portal, a = new AbortController();
		this._lastPortalBasemapFetchController = a, this.notifyChange("state");
		try {
			const e = await t.fetchBasemaps(this._toQueryString(this.query), {
				signal: a.signal,
				include3d: "3d" === this.viewType || void 0
			});
			await this._updateBasemaps(e);
		} catch (e) {
			if (d(e)) throw e;
			n$3.getLogger(this).warn(new r$1("basemap-source:fetch-basemaps-error", "Could not fetch basemaps from portal.", { error: e })), await this._updateBasemaps();
		}
		this._lastPortalBasemapFetchController = null, this.notifyChange("state");
	}
	_toQueryString(t) {
		return t && "string" != typeof t ? Object.keys(t).map((a) => `${a}:${t[a]}`).join(" AND ") : t;
	}
	async _updateBasemaps(t = []) {
		let a = await this._filterBasemaps(t);
		a = this.updateBasemapsCallback ? await this.updateBasemapsCallback(a) : a, this.basemaps.removeAll(), this.basemaps.addMany(a);
	}
	async _filterBasemaps(t) {
		if (!this.filterFunction) return t;
		const a = t.map(this.filterFunction), e = await Promise.all(a);
		return t.filter((t, a) => e[a]);
	}
};
__decorate([a$2({
	readOnly: !0,
	type: y
})], f$1.prototype, "basemaps", void 0), __decorate([a$2()], f$1.prototype, "filterFunction", void 0), __decorate([a$2({ type: M })], f$1.prototype, "portal", void 0), __decorate([a$2()], f$1.prototype, "query", void 0), __decorate([a$2({ readOnly: !0 })], f$1.prototype, "state", null), __decorate([a$2()], f$1.prototype, "updateBasemapsCallback", void 0), __decorate([a$2()], f$1.prototype, "viewType", void 0), f$1 = __decorate([c$2("esri.widgets.BasemapGallery.support.PortalBasemapsSource")], f$1);
var B$1 = f$1;
//#endregion
//#region node_modules/@arcgis/core/widgets/BasemapGallery/BasemapGalleryViewModel.js
var _ = q.ofType(h);
function B(e) {
	return e && "esri.portal.Portal" === e.declaredClass;
}
function j(e) {
	return e && !(e instanceof B$1) && (!!e.portal || !!e.query);
}
function I(e) {
	return e && "basemaps" in e && "state" in e && "refresh" in e;
}
var R = class extends u$1 {
	constructor(e) {
		super(e), this._loadingProjectionEngine = !1, this.items = new _(), this.view = null, this.source = new B$1();
	}
	initialize() {
		const e = () => this._recreateItems();
		this.addHandles([
			l(() => "ready" === this.state ? this.compatibilityFunction : null, () => this._updateItems()),
			a$3(() => this.source?.basemaps, "change", e, { onListenerAdd: e }),
			f$3(() => this.view, () => {
				this.source instanceof B$1 && (this.source.viewType = this.view?.type);
			}, { once: !0 })
		]);
	}
	destroy() {
		const e = this.source.basemaps.find((e) => e === this.activeBasemap);
		e && this.source.basemaps.remove(e), this.source?.destroy();
	}
	get activeBasemap() {
		return this.view?.map?.basemap ?? null;
	}
	set activeBasemap(e) {
		const t = this.view;
		if (!t?.map) return;
		if (!(e = p$4(e)) || !t.ready) return t.map.basemap = e, void this._clearOverride("activeBasemap");
		const i = e.spatialReference || this.items?.find((t) => this.basemapEquals(e, t.basemap))?.spatialReference;
		if (i && "spatialReferenceLocked" in t && !t.spatialReferenceLocked) {
			const s = t.spatialReference;
			if (null != i && !T(s, i) && !tn(t.spatialReference, i) && !V()) return this._override("activeBasemap", e), this._loadingProjectionEngine = !0, void F$1().then(() => {
				this._get("activeBasemap") === e && (t.map.basemap = e, t.spatialReference = i, this._clearOverride("activeBasemap"));
			}, () => {}).then(() => {
				this._loadingProjectionEngine = !1;
			});
			t.map.basemap = e, this._clearOverride("activeBasemap"), null == i || T(t.spatialReference, i) || (t.spatialReference = i);
		} else t.map.basemap = e, this._clearOverride("activeBasemap");
	}
	get activeBasemapIndex() {
		const { state: e, activeBasemap: t } = this;
		return "ready" !== e ? -1 : this._findBasemapIndex(t);
	}
	get compatibilityFunction() {
		return "3d" === this.view?.type ? f$2 : u;
	}
	set compatibilityFunction(e) {
		this._overrideIfSome("compatibilityFunction", e);
	}
	get source() {
		return this._get("source");
	}
	set source(e) {
		(Array.isArray(e) || q.isCollection(e)) && (e = new m({ basemaps: Array.isArray(e) ? new q(e) : e })), B(e) && (e = new B$1({ portal: e })), j(e) && (e = new B$1(e)), I(e) || (e = null), this._set("source", e);
	}
	get state() {
		return this.view?.ready && this.source ? e$2(this.view) && !this.view.inGeographicLayout ? "unsupported" : this._loadingProjectionEngine ? "loading" : "ready" : "disabled";
	}
	basemapEquals(e, t) {
		return p$3(e, t);
	}
	refresh() {
		this._recreateItems();
	}
	load() {
		return this.loadSource();
	}
	loadSource(e) {
		return this.addResolvingPromise(m$2(this.source) ? this.source.load(e) : null), Promise.resolve(this);
	}
	_findBasemapIndex(e) {
		const { items: t } = this, i = t.findIndex((t) => t.basemap === e);
		return -1 === i ? t.findIndex((t) => this.basemapEquals(t.basemap, e)) : i;
	}
	_recreateItems() {
		const e = this.source?.basemaps ?? [], { view: t, compatibilityFunction: i } = this, s = new Map(this.items.map((e) => [e.basemap, e])), a = e.map((e) => {
			const a = s.get(e);
			return a ? (s.delete(e), a) : new h({
				basemap: e,
				compatibilityFunction: i,
				view: t
			});
		});
		this.items.removeAll(), this.items.addMany(a), s.forEach((e) => e.destroy());
	}
	_updateItems() {
		for (const e of this.items) e.compatibilityFunction = this.compatibilityFunction, e.view = this.view;
	}
};
__decorate([a$2()], R.prototype, "_loadingProjectionEngine", void 0), __decorate([a$2()], R.prototype, "activeBasemap", null), __decorate([a$2({ readOnly: !0 })], R.prototype, "activeBasemapIndex", null), __decorate([a$2()], R.prototype, "compatibilityFunction", null), __decorate([a$2({
	readOnly: !0,
	type: _
})], R.prototype, "items", void 0), __decorate([a$2()], R.prototype, "source", null), __decorate([a$2({ readOnly: !0 })], R.prototype, "state", null), __decorate([a$2()], R.prototype, "view", void 0), R = __decorate([c$2("esri.widgets.BasemapGallery.BasemapGalleryViewModel")], R);
var E = R;
//#endregion
//#region node_modules/@arcgis/core/widgets/BasemapGallery/css.js
var e = "esri-basemap-gallery", t = {
	base: e,
	sourceLoading: `${e}--source-loading`,
	loader: `${e}__loader`,
	item: `${e}__item`,
	itemContainer: `${e}__item-container`,
	itemContent: `${e}__item-content`,
	itemTitle: `${e}__item-title`,
	itemTagsContainer: `${e}__item-tags-container`,
	itemThumbnail: `${e}__item-thumbnail`,
	selectedItem: `${e}__item--selected`,
	itemError: `${e}__item--error`
};
//#endregion
//#region node_modules/@arcgis/core/widgets/BasemapGallery.js
var w = class extends O {
	constructor(e, t) {
		super(e, t), this.disabled = !1, this.headingLevel = 2, this.messages = null, this.viewModel = new E(), this._focusBasemapItemEnabled = !1, r$2(n$3.getLogger(this), "Basemap Gallery", "arcgis-basemap-gallery", { version: "4.32" });
	}
	initialize() {
		this.addHandles(f$3(() => this.source, () => this.viewModel.loadSource(), {
			sync: !0,
			initial: !0
		}));
	}
	loadDependencies() {
		return c$4({
			scrim: () => import("./calcite-scrim-B428rR7z.js").then((n) => n.t),
			chip: () => import("./calcite-chip-_pKlSgQA.js")
		});
	}
	get activeBasemap() {
		return this.viewModel.activeBasemap;
	}
	set activeBasemap(e) {
		this.viewModel.activeBasemap = e;
	}
	get icon() {
		return "basemap";
	}
	set icon(e) {
		this._overrideIfSome("icon", e);
	}
	get label() {
		return this.messages?.widgetLabel ?? "";
	}
	set label(e) {
		this._overrideIfSome("label", e);
	}
	get source() {
		return this.viewModel.source;
	}
	set source(e) {
		this.viewModel.source = e;
	}
	get view() {
		return this.viewModel.view;
	}
	set view(e) {
		this.viewModel.view = e;
	}
	render() {
		const e = "loading" === this.source.state, t$1 = this.disabled || "disabled" === this.viewModel.state, s = {
			[t.sourceLoading]: e,
			[e$1.disabled]: t$1
		};
		return x("div", {
			class: this.classes(t.base, e$1.widget, e$1.panel, s),
			key: "container"
		}, this._getContext());
	}
	_getContext() {
		if ("unsupported" === this.viewModel.state) return x("div", {
			class: e$1.empty,
			key: "empty-message"
		}, x(i$2, { level: this.headingLevel }, this.messages.unsupported));
		if ("loading" === this.source.state) return x("div", {
			class: t.loader,
			key: "loader"
		});
		const e = this.viewModel.items;
		return e.length > 0 ? x("ul", {
			"aria-disabled": this.disabled,
			"aria-label": this.label,
			bind: this,
			class: t.itemContainer,
			key: "item-container",
			onkeydown: this._handleKeyDown,
			role: "radiogroup"
		}, e.map((e, t) => this._renderBasemapGalleryItem(e, t)).toArray()) : x("div", {
			class: e$1.empty,
			key: "empty-message"
		}, x(i$2, { level: this.headingLevel }, this.messages.noBasemaps));
	}
	_getRoundRobinIndex(e, t) {
		return (e + t) % t;
	}
	_handleKeyDown(e) {
		const { key: t } = e;
		if (![
			"ArrowUp",
			"ArrowDown",
			"ArrowRight",
			"ArrowLeft"
		].includes(t)) return;
		e.preventDefault();
		const { items: s, activeBasemapIndex: a } = this.viewModel, i = "ArrowUp" === t || "ArrowLeft" === t ? this._getRoundRobinIndex(Math.max(a - 1, -1), s.length) : this._getRoundRobinIndex(a + 1, s.length), r = s.at(i);
		"ready" === r?.state && (this.viewModel.activeBasemap = r.basemap), this._focusBasemapItemEnabled = !0;
	}
	_focusBasemapItem(e) {
		this._focusBasemapItemEnabled && 0 === e.tabIndex && (e.focus(), this._focusBasemapItemEnabled = !1);
	}
	_handleClick(e) {
		const t = e.currentTarget["data-item"];
		"ready" === t.state && (this.viewModel.activeBasemap = t.basemap);
	}
	_renderBasemapGalleryItem(e, s) {
		const a = k(e.basemap) || n$4("esri/themes/base/images/basemap-toggle-64.svg"), i = e.basemap.title, r = e.basemap.portalItem?.snippet, o = e.error?.message || r || i, { viewModel: { state: d, activeBasemapIndex: m } } = this, p = this.disabled || "disabled" === d, h = m === s, u = h || -1 === m && 0 === s ? 0 : -1, v = "loading" === d, b = {
			[t.selectedItem]: h,
			[t.itemError]: "error" === e.state
		}, w = `basemapgallery-item-${e.uid}`;
		return x("li", {
			afterUpdate: this._focusBasemapItem,
			"aria-checked": h.toString(),
			"aria-disabled": p.toString(),
			"aria-labelledby": w,
			bind: this,
			class: this.classes(t.item, b),
			"data-item": e,
			key: e.uid,
			onclick: this._handleClick,
			onkeydown: this._handleClick,
			role: "radio",
			tabIndex: u,
			title: o
		}, x("img", {
			alt: "",
			class: t.itemThumbnail,
			src: a
		}), x("div", {
			class: t.itemContent,
			key: "content"
		}, x("div", {
			class: t.itemTitle,
			key: "title"
		}, x("span", { id: w }, i)), s$2(e.basemap) ? this._renderTags(e.basemap) : null), "loading" === e.state || h && v ? x("calcite-scrim", null, x("span", {
			"aria-hidden": "true",
			class: e$1.loaderAnimation,
			key: "loader",
			role: "presentation"
		})) : null);
	}
	_renderTags(e) {
		return x("div", {
			class: t.itemTagsContainer,
			key: "tag"
		}, this._render3DTag(), u$4(e) ? this._renderBetaTag() : null);
	}
	_render3DTag() {
		const { messages: e } = this;
		return x("calcite-chip", {
			key: "tag-3d",
			label: e.tag3D,
			scale: "s"
		}, this.messages.tag3D);
	}
	_renderBetaTag() {
		const { messages: e } = this;
		return x("calcite-chip", {
			appearance: "outline-fill",
			key: "tag-beta",
			label: e.tagBeta,
			scale: "s"
		}, this.messages.tagBeta);
	}
};
__decorate([a$2()], w.prototype, "activeBasemap", null), __decorate([a$2()], w.prototype, "disabled", void 0), __decorate([a$2()], w.prototype, "headingLevel", void 0), __decorate([a$2()], w.prototype, "icon", null), __decorate([a$2()], w.prototype, "label", null), __decorate([a$2(), v("esri/widgets/BasemapGallery/t9n/BasemapGallery")], w.prototype, "messages", void 0), __decorate([a$2()], w.prototype, "source", null), __decorate([a$2()], w.prototype, "view", null), __decorate([a$2({ type: E })], w.prototype, "viewModel", void 0), __decorate([a$2()], w.prototype, "_focusBasemapItemEnabled", void 0), __decorate([l$1()], w.prototype, "_handleClick", null), w = __decorate([c$2("esri.widgets.BasemapGallery")], w);
var f = w;
//#endregion
export { f as default };

//# sourceMappingURL=@arcgis_core_widgets_BasemapGallery.js.map