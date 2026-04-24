import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n, t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { t as f } from "./request-CuG5cxow.js";
import { p as f$1 } from "./promiseUtils-DhYhergm.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
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
import "./mathUtils-hEBUcrMa.js";
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
import { t as e } from "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import "./portalItemUtils-CDCH3kjA.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./layerContainerType-ZF61P2__.js";
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
import { o as R, p as j, y as w } from "./elevationInfoUtils-BTAkLxlB.js";
import { i as y$1, n as d, r as x, t as b$1 } from "./tiles3DUtils-BOhpuVXh.js";
//#region node_modules/@arcgis/core/layers/GaussianSplatLayer.js
var T = class extends l(g(_(l$1(e(s$1(s(b))))))) {
	constructor(e) {
		super(e), this.operationalLayerType = "GaussianSplatLayer", this.type = "gaussian-splat", this.opacity = 1, this.minScale = 0, this.maxScale = 0, this.url = null, this.rootTilesetJSON = null, this.fullExtent = d, this.spatialReference = x, this.esriCrsSpatialReference = null, this.esriCrsFullExtent = null;
	}
	get supportedSpatialReferences() {
		return this.initialized && this.esriCrsSpatialReference ? [x, this.esriCrsSpatialReference] : [x];
	}
	get fullExtents() {
		return this.initialized && this.esriCrsFullExtent ? [d, this.esriCrsFullExtent] : [d];
	}
	set elevationInfo(e) {
		null != e && "absolute-height" !== e.mode || this._set("elevationInfo", e), this._validateElevationInfo(e);
	}
	async load(e) {
		return this.addResolvingPromise(this._doLoad(e)), this;
	}
	async _doLoad(e) {
		const r$1 = null != e ? e.signal : null;
		try {
			await this.loadFromPortal({
				supportedTypes: ["3DTiles Service"],
				validateItem: (e) => {
					if (e.typeKeywords?.includes("GaussianSplat")) return !0;
					throw new r("portal:invalid-layer-item-type", "Invalid layer item, expected '${expectedType}' ", { expectedType: "3DTiles Service" });
				}
			}, e);
		} catch (s) {
			f$1(s);
		}
		if (this.url) await f(this.url, {
			query: {
				...this.customParameters,
				token: this.apiKey
			},
			responseType: "json",
			signal: r$1
		}).then((e) => {
			this.rootTilesetJSON = e.data, this.fullExtent = y$1(this.rootTilesetJSON, !1);
			b$1(this.rootTilesetJSON) && (this.esriCrsFullExtent = y$1(this.rootTilesetJSON, !0), this.esriCrsSpatialReference = this.esriCrsFullExtent.spatialReference, this.spatialReference = this.esriCrsSpatialReference);
		}, (e) => {
			f$1(e);
		});
	}
	_validateElevationInfo(e) {
		const t = "Gaussian Splat layers";
		j(n.getLogger(this), w(t, "absolute-height", e)), j(n.getLogger(this), R(t, e));
	}
};
__decorate([a({ type: ["GaussianSplatLayer"] })], T.prototype, "operationalLayerType", void 0), __decorate([a({ readOnly: !0 })], T.prototype, "type", void 0), __decorate([a({
	readOnly: !0,
	json: {
		read: !1,
		write: !1,
		origins: {
			service: {
				read: !1,
				write: !1
			},
			"portal-item": {
				read: !1,
				write: !1
			},
			"web-document": {
				read: !1,
				write: !1
			}
		}
	}
})], T.prototype, "opacity", void 0), __decorate([a({
	type: Number,
	json: {
		name: "layerDefinition.minScale",
		write: !0,
		origins: { service: {
			read: !1,
			write: !1
		} }
	}
})], T.prototype, "minScale", void 0), __decorate([a({
	type: Number,
	json: {
		name: "layerDefinition.maxScale",
		write: !0,
		origins: { service: {
			read: !1,
			write: !1
		} }
	}
})], T.prototype, "maxScale", void 0), __decorate([a(y)], T.prototype, "url", void 0), __decorate([a({ type: z })], T.prototype, "fullExtent", void 0), __decorate([a({ type: S })], T.prototype, "spatialReference", void 0), __decorate([a({ readOnly: !0 })], T.prototype, "supportedSpatialReferences", null), __decorate([a({ type: [z] })], T.prototype, "fullExtents", null), __decorate([a({ type: ["show", "hide"] })], T.prototype, "listMode", void 0), __decorate([a(m)], T.prototype, "elevationInfo", null), T = __decorate([c("esri.layers.GaussianSplatLayer")], T);
var C = T;
//#endregion
export { C as default };

//# sourceMappingURL=GaussianSplatLayer-B2B0lD0P.js.map