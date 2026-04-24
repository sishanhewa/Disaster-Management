import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { A as has, n, t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { b as p, t as f } from "./request-CuG5cxow.js";
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
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import { t as S } from "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import { t as z } from "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import { t as M } from "./Portal-DYysvbhZ.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import "./PortalItem-BaGmB6Wg.js";
import "./messages-BSXJ_xjI.js";
import { j as t } from "./layerUtils-sQ-3wxAB.js";
import { n as U, r as a$1 } from "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import { t as b } from "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./catalogUtils-lRNSLCIB.js";
import "./mathUtils-hEBUcrMa.js";
import "./opacityUtils-DgEZ8x-q.js";
import "./Clonable-D_RHUyXD.js";
import "./uuid-CI605U6Y.js";
import "./MD5-CvSXL3W6.js";
import "./resourceExtension-G73S3iT3.js";
import { t as j } from "./persistable-D3uxCw6O.js";
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
import { t as e } from "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import "./portalItemUtils-CDCH3kjA.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./layerContainerType-ZF61P2__.js";
import "./Queue-CM8W5OTt.js";
import "./workers-BjS-6PTj.js";
import "./number-DwLpDjta.js";
import "./intl-1FbLkipu.js";
import "./workers-Nrqav2LG.js";
import { t as s } from "./APIKeyMixin-CpWoJvp9.js";
import { t as l } from "./ArcGISService-BFbH4hVT.js";
import { t as s$1 } from "./CustomParametersMixin-CvFUyY3s.js";
import "./HeightModelInfo-CaK_zgTy.js";
import "./ElevationInfo-Bsg5AqQw.js";
import "./lengthUtils-DrG-JkjU.js";
import "./unitConversionUtils-dsyJpUwL.js";
import { h as y, l as m } from "./commonProperties-DQjThAJZ.js";
import { t as g } from "./OperationalLayer-CaAaD2Zf.js";
import { t as _ } from "./PortalLayer-B3x-_Tp7.js";
import { t as l$1 } from "./ScaleRangeLayer-CIL5S5vZ.js";
import "./vec3-BfQf1_cT.js";
import "./projectPointToVector-ChBhT6rD.js";
import "./projectVectorToVector-Du7qhzbU.js";
import { o as R, p as j$1, y as w } from "./elevationInfoUtils-BTAkLxlB.js";
import "./WorkerHandle-9hUSbPch.js";
import { i as y$1, n as d, r as x } from "./tiles3DUtils-BOhpuVXh.js";
import { i as r$1, r as l$2 } from "./Lyr3DWorker-9XUANr8_.js";
import { a as u, n as f$2 } from "./SceneLayerWorkerHandle-HkfPaEul.js";
import { t as p$1 } from "./SceneModifications-CQus78h5.js";
//#region node_modules/@arcgis/core/layers/IntegratedMesh3DTilesLayer.js
var A = class extends l(g(_(l$1(e(s$1(s(b))))))) {
	readModifications(e, t, o) {
		this._modificationsSource = {
			url: p(e, o),
			context: o
		};
	}
	initialize() {
		this.addHandles(a$1(() => this.modifications, "after-changes", () => this.modifications = this.modifications, U));
	}
	constructor(e) {
		super(e), this.operationalLayerType = "IntegratedMesh3DTilesLayer", this.modifications = null, this._modificationsSource = null, this.spatialReference = x, this.fullExtent = d, this.url = null, this.type = "integrated-mesh-3dtiles", this.path = null, this.minScale = 0, this.maxScale = 0, this._rootTilesetJSON = null, this._rootTileset = null, this._key = null, this._session = null, this._rootRequestPromise = null, this.queryElevationCallback = null;
	}
	set elevationInfo(e) {
		null != e && "absolute-height" !== e.mode || this._set("elevationInfo", e), this._validateElevationInfo(e);
	}
	async load(e) {
		return this.addResolvingPromise(this._doLoad(e)), this;
	}
	get rootTilesetJSON() {
		return this._rootTilesetJSON;
	}
	get rootTileset() {
		return this._rootTileset;
	}
	get key() {
		return this._key;
	}
	get session() {
		return this._session;
	}
	_findSessionParameter(e) {
		const t = [e];
		for (; t?.length > 0;) {
			const e = t.pop();
			if (!e) return;
			for (const [r, i] of Object.entries(e)) {
				if ("uri" === r) try {
					const e = new URL("https://tmp" + i).searchParams.get("session");
					if (e) return e;
				} catch (o) {}
				"object" == typeof i && null !== i && t.push(i);
			}
		}
		return null;
	}
	async requestRootAndSession(e) {
		const i = (e, t) => new r("3dtiles-init:" + e, t);
		return this._rootRequestPromise || (this._rootRequestPromise = new Promise((o, a) => {
			this.url || a(i("url-missing", "Layer url missing")), this._key = this.customParameters ? this.customParameters.key : null;
			new Promise((e, o) => {
				if (this.replacesTerrain && !this._key) {
					const r = this.portalItem?.portal || this.parent?.portalItem?.portal || M.getDefault();
					r.signIn().then(() => {
						r.g3dTilesEnabled ? f(r.restUrl + "/portals/self/modules/g3dtiles", {
							responseType: "json",
							query: { f: "json" }
						}).then((t) => {
							this._key = t.data.keyString, e();
						}, () => o(i("g3dtiles-key-error", "Error fetching Google 3D Tiles key from portal"))) : o(i("g3dTilesEnabled-false", "Google 3D Tiles are not enabled on Portal " + r.url));
					}, () => o(i("sign-in-failed", "Error signing in to Portal")));
				} else e();
			}).then(() => {
				f(this.url, {
					query: this._key ? {
						key: this._key,
						token: this.apiKey
					} : { token: this.apiKey },
					responseType: "array-buffer",
					signal: e
				}).then((e) => {
					try {
						this._rootTilesetJSON = JSON.parse(new TextDecoder().decode(e.data));
					} catch (t) {
						a(i("root-parse-failed", "Error parsing root tile, details: " + t));
						return;
					}
					this._rootTilesetJSON ? (this._session = this._findSessionParameter(this._rootTilesetJSON), this._rootTileset = e.data, this.fullExtent = y$1(this._rootTilesetJSON), o(), this._rootRequestPromise = null) : a(i("root-is-null", "Root tile is null."));
				}, (e) => {
					f$1(e), a(i("root-load-failed", "Error loading root tile")), this._rootRequestPromise = null, n.getLogger("IntegratedMesh3DTilesLayer").error("Layer loading failed", e);
				});
			}, (e) => a(e));
		})), this._rootRequestPromise;
	}
	async _doLoad(e) {
		const t = null != e ? e.signal : null;
		if (this.isUsedAsGroundLayer && !has("enable-feature:basemap-groundlayers")) throw new r("3dtiles-init:not-supported-in-groundlayers", "Layer is not supported in basemap.");
		try {
			await this.loadFromPortal({
				supportedTypes: ["3DTiles Service"],
				validateItem: (e) => {
					if (e.typeKeywords?.includes("IntegratedMesh")) return !0;
					throw new r("portal:invalid-layer-item-type", "Invalid layer item, expected '${expectedType}' ", { expectedType: "3DTiles Service containing IntegratedMesh" });
				}
			}, e);
		} catch (i) {
			f$1(i);
		}
		if (null != this._modificationsSource) {
			const t = await p$1.fromUrl(this._modificationsSource.url, this.spatialReference, e);
			if (t && t.length > 0) {
				await l$2();
				try {
					const o = r$1({
						modifications: u(null, t.toArray(), this.spatialReference),
						inVCS: 115700
					});
					o.success && o.modifications && f$2(o.modifications, t);
				} catch (a) {
					n.getLogger(this).error("convert-mesh-modification-z-error", "Error when converting:", a);
				}
				null != this._modificationsSource && this.setAtOrigin("modifications", t, this._modificationsSource.context.origin), this._modificationsSource = null;
			}
		}
		await this.requestRootAndSession(t);
	}
	async beforeSave() {
		if (null == this._modificationsSource) {
			const { modifications: e } = this;
			e && e.length > 0 && await l$2();
			return;
		}
		await this.load().then(() => {}, () => {});
	}
	get hasAttributionData() {
		return !1;
	}
	_validateElevationInfo(e) {
		const t = "Integrated mesh 3d tiles layers";
		j$1(n.getLogger(this), w(t, "absolute-height", e)), j$1(n.getLogger(this), R(t, e));
	}
	get replacesTerrain() {
		return !!has("enable-feature:basemap-groundlayers") && this.hasGoogleUrl && this.isUsedAsGroundLayer;
	}
	get isUsedAsGroundLayer() {
		return t(this.parent);
	}
	get hasGoogleUrl() {
		return !!this.url?.match(/.+\.googleapis.com/);
	}
};
__decorate([a({ type: ["IntegratedMesh3DTilesLayer"] })], A.prototype, "operationalLayerType", void 0), __decorate([a({
	type: p$1,
	clonable: (e) => e.clone()
}), j({
	origins: ["web-scene", "portal-item"],
	type: "resource",
	prefix: "modifications"
})], A.prototype, "modifications", void 0), __decorate([o(["web-scene", "portal-item"], "modifications")], A.prototype, "readModifications", null), __decorate([a({ type: S })], A.prototype, "spatialReference", void 0), __decorate([a({ type: z })], A.prototype, "fullExtent", void 0), __decorate([a(m)], A.prototype, "elevationInfo", null), __decorate([a({ type: ["show", "hide"] })], A.prototype, "listMode", void 0), __decorate([a(y)], A.prototype, "url", void 0), __decorate([a({ readOnly: !0 })], A.prototype, "type", void 0), __decorate([a({
	type: String,
	json: {
		origins: {
			"web-scene": {
				read: !0,
				write: !0
			},
			"portal-item": {
				read: !0,
				write: !0
			}
		},
		read: !1
	}
})], A.prototype, "path", void 0), __decorate([a({
	type: Number,
	json: {
		name: "layerDefinition.minScale",
		write: !0,
		origins: { service: {
			read: !1,
			write: !1
		} }
	}
})], A.prototype, "minScale", void 0), __decorate([a({
	type: Number,
	json: {
		name: "layerDefinition.maxScale",
		write: !0,
		origins: { service: {
			read: !1,
			write: !1
		} }
	}
})], A.prototype, "maxScale", void 0), __decorate([a({ readOnly: !0 })], A.prototype, "hasAttributionData", null), __decorate([a()], A.prototype, "replacesTerrain", null), __decorate([a()], A.prototype, "isUsedAsGroundLayer", null), __decorate([a()], A.prototype, "hasGoogleUrl", null), A = __decorate([c("esri.layers.IntegratedMesh3DTilesLayer")], A);
var G = A;
//#endregion
export { G as default };

//# sourceMappingURL=IntegratedMesh3DTilesLayer--TKMBuij.js.map