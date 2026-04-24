import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { _ as s } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { t as f, ut as qt } from "./request-CuG5cxow.js";
import { p as f$1 } from "./promiseUtils-DhYhergm.js";
import { a as o, n as c, t as a } from "./decorators-DE7S5xmd.js";
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
import "./asyncUtils-D83Q647Q.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import { s as P } from "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import { t as z } from "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import "./Portal-DYysvbhZ.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import "./PortalItem-BaGmB6Wg.js";
import "./layerUtils-sQ-3wxAB.js";
import "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import { t as b } from "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./catalogUtils-lRNSLCIB.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import "./Color-C99QAF80.js";
import "./opacityUtils-DgEZ8x-q.js";
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
import "./utils-3ndlmaCD.js";
import "./mat4-CCf33Vjt.js";
import { t as e } from "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import "./portalItemUtils-CDCH3kjA.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import { o as n, r as d, t as u } from "./SimpleMarkerSymbol-BjFFaoyw.js";
import { t as m } from "./SimpleFillSymbol-CbXKKnxp.js";
import { t as c$1 } from "./PictureMarkerSymbol-Crs5VdSs.js";
import "./layerContainerType-ZF61P2__.js";
import "./parser-DVDIh5bD.js";
import "./jsonUtils-DOqHqQ2U.js";
import { n as p } from "./BlendLayer-D1uDzFu8.js";
import "./ElevationInfo-Bsg5AqQw.js";
import "./lengthUtils-DrG-JkjU.js";
import "./unitConversionUtils-dsyJpUwL.js";
import { a as d$1, f as u$1, h as y } from "./commonProperties-DQjThAJZ.js";
import { t as g } from "./OperationalLayer-CaAaD2Zf.js";
import { t as _$1 } from "./PortalLayer-B3x-_Tp7.js";
import { t as l } from "./RefreshableLayer-CsLgef5j.js";
import { t as l$1 } from "./ScaleRangeLayer-CIL5S5vZ.js";
//#region node_modules/@arcgis/core/layers/GeoRSSLayer.js
var G = ["atom", "xml"], L = {
	base: n,
	key: "type",
	typeMap: { "simple-line": d },
	errorContext: "symbol"
}, R = {
	base: n,
	key: "type",
	typeMap: {
		"picture-marker": c$1,
		"simple-marker": u
	},
	errorContext: "symbol"
}, k = {
	base: n,
	key: "type",
	typeMap: { "simple-fill": m },
	errorContext: "symbol"
};
var _ = class extends p(l(g(_$1(l$1(e(b)))))) {
	constructor(...e) {
		super(...e), this.description = null, this.fullExtent = null, this.legendEnabled = !0, this.lineSymbol = null, this.pointSymbol = null, this.polygonSymbol = null, this.operationalLayerType = "GeoRSS", this.url = null, this.type = "geo-rss";
	}
	normalizeCtorArgs(e, t) {
		return "string" == typeof e ? {
			url: e,
			...t
		} : e;
	}
	readFeatureCollections(e, t) {
		return t.featureCollection.layers.forEach((e) => {
			const t = e.layerDefinition.drawingInfo.renderer.symbol;
			t && "esriSFS" === t.type && t.outline?.style.includes("esriSFS") && (t.outline.style = "esriSLSSolid");
		}), t.featureCollection.layers;
	}
	get hasPoints() {
		return this._hasGeometry("esriGeometryPoint");
	}
	get hasPolylines() {
		return this._hasGeometry("esriGeometryPolyline");
	}
	get hasPolygons() {
		return this._hasGeometry("esriGeometryPolygon");
	}
	get title() {
		const e = this._get("title");
		return e && "defaults" !== this.originOf("title") ? e : this.url ? qt(this.url, G) || "GeoRSS" : e;
	}
	set title(e) {
		this._set("title", e);
	}
	load(e) {
		const t = null != e ? e.signal : null;
		return this.addResolvingPromise(this.loadFromPortal({ supportedTypes: [
			"Map Service",
			"Feature Service",
			"Feature Collection",
			"Scene Service"
		] }, e).catch(f$1).then(() => this._fetchService(t)).then((e) => {
			this.read(e, { origin: "service" });
		})), Promise.resolve(this);
	}
	async hasDataChanged() {
		const e = await this._fetchService();
		return this.read(e, {
			origin: "service",
			ignoreDefaults: !0
		}), !0;
	}
	async _fetchService(e) {
		const r = this.spatialReference, { data: i } = await f(s.geoRSSServiceUrl, {
			query: {
				url: this.url,
				refresh: !!this.loaded || void 0,
				outSR: P(r) ? void 0 : r.wkid ?? JSON.stringify(r)
			},
			signal: e
		});
		return i;
	}
	_hasGeometry(e) {
		return this.featureCollections?.some((t) => t.featureSet?.geometryType === e && t.featureSet.features?.length > 0) ?? !1;
	}
};
__decorate([a()], _.prototype, "description", void 0), __decorate([a()], _.prototype, "featureCollections", void 0), __decorate([o("service", "featureCollections", ["featureCollection.layers"])], _.prototype, "readFeatureCollections", null), __decorate([a({
	type: z,
	json: { name: "lookAtExtent" }
})], _.prototype, "fullExtent", void 0), __decorate([a(u$1)], _.prototype, "id", void 0), __decorate([a(d$1)], _.prototype, "legendEnabled", void 0), __decorate([a({
	types: L,
	json: { write: !0 }
})], _.prototype, "lineSymbol", void 0), __decorate([a({ type: ["show", "hide"] })], _.prototype, "listMode", void 0), __decorate([a({
	types: R,
	json: { write: !0 }
})], _.prototype, "pointSymbol", void 0), __decorate([a({
	types: k,
	json: { write: !0 }
})], _.prototype, "polygonSymbol", void 0), __decorate([a({ type: ["GeoRSS"] })], _.prototype, "operationalLayerType", void 0), __decorate([a(y)], _.prototype, "url", void 0), __decorate([a({ json: { origins: { service: { read: {
	source: "name",
	reader: (e) => e || void 0
} } } } })], _.prototype, "title", null), __decorate([a({
	readOnly: !0,
	json: { read: !1 },
	value: "geo-rss"
})], _.prototype, "type", void 0), _ = __decorate([c("esri.layers.GeoRSSLayer")], _);
var w = _;
//#endregion
export { w as default };

//# sourceMappingURL=GeoRSSLayer-Dg2DIS-T.js.map