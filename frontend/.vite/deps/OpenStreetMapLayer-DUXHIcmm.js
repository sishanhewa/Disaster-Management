import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c$1, t as a } from "./decorators-DE7S5xmd.js";
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
import { t as _ } from "./Point-B7zMqEx6.js";
import { t as z } from "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import "./Portal-DYysvbhZ.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import { n as k } from "./PortalItem-BaGmB6Wg.js";
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
import "./colorUtils-BC0_8aMM.js";
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
import "./utils-3ndlmaCD.js";
import "./mat4-CCf33Vjt.js";
import "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import "./portalItemUtils-CDCH3kjA.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./layerContainerType-ZF61P2__.js";
import "./parser-DVDIh5bD.js";
import "./jsonUtils-DOqHqQ2U.js";
import "./BlendLayer-D1uDzFu8.js";
import "./ElevationInfo-Bsg5AqQw.js";
import "./lengthUtils-DrG-JkjU.js";
import "./unitConversionUtils-dsyJpUwL.js";
import "./commonProperties-DQjThAJZ.js";
import "./OperationalLayer-CaAaD2Zf.js";
import "./PortalLayer-B3x-_Tp7.js";
import "./RefreshableLayer-CsLgef5j.js";
import "./ScaleRangeLayer-CIL5S5vZ.js";
import { n as l, t as z$1 } from "./TileInfo-Dm0DlKvz.js";
import "./TileKey-DNAwECdW.js";
import "./imageBitmapUtils-pRa72TRX.js";
import U from "./WebTileLayer-DG7Pea39.js";
//#region node_modules/@arcgis/core/layers/OpenStreetMapLayer.js
var c = class extends U {
	constructor(...e) {
		super(...e), this.portalItem = null, this.isReference = null, this.tileInfo = new z$1({
			size: [256, 256],
			dpi: 96,
			format: "png8",
			compressionQuality: 0,
			origin: new _({
				x: -20037508.342787,
				y: 20037508.342787,
				spatialReference: S.WebMercator
			}),
			spatialReference: S.WebMercator,
			lods: [
				new l({
					level: 0,
					scale: 591657527.591555,
					resolution: 156543.033928
				}),
				new l({
					level: 1,
					scale: 295828763.795777,
					resolution: 78271.5169639999
				}),
				new l({
					level: 2,
					scale: 147914381.897889,
					resolution: 39135.7584820001
				}),
				new l({
					level: 3,
					scale: 73957190.948944,
					resolution: 19567.8792409999
				}),
				new l({
					level: 4,
					scale: 36978595.474472,
					resolution: 9783.93962049996
				}),
				new l({
					level: 5,
					scale: 18489297.737236,
					resolution: 4891.96981024998
				}),
				new l({
					level: 6,
					scale: 9244648.868618,
					resolution: 2445.98490512499
				}),
				new l({
					level: 7,
					scale: 4622324.434309,
					resolution: 1222.99245256249
				}),
				new l({
					level: 8,
					scale: 2311162.217155,
					resolution: 611.49622628138
				}),
				new l({
					level: 9,
					scale: 1155581.108577,
					resolution: 305.748113140558
				}),
				new l({
					level: 10,
					scale: 577790.554289,
					resolution: 152.874056570411
				}),
				new l({
					level: 11,
					scale: 288895.277144,
					resolution: 76.4370282850732
				}),
				new l({
					level: 12,
					scale: 144447.638572,
					resolution: 38.2185141425366
				}),
				new l({
					level: 13,
					scale: 72223.819286,
					resolution: 19.1092570712683
				}),
				new l({
					level: 14,
					scale: 36111.909643,
					resolution: 9.55462853563415
				}),
				new l({
					level: 15,
					scale: 18055.954822,
					resolution: 4.77731426794937
				}),
				new l({
					level: 16,
					scale: 9027.977411,
					resolution: 2.38865713397468
				}),
				new l({
					level: 17,
					scale: 4513.988705,
					resolution: 1.19432856685505
				}),
				new l({
					level: 18,
					scale: 2256.994353,
					resolution: .597164283559817
				}),
				new l({
					level: 19,
					scale: 1128.497176,
					resolution: .298582141647617
				})
			]
		}), this.subDomains = [
			"a",
			"b",
			"c"
		], this.urlTemplate = "https://{subDomain}.tile.openstreetmap.org/{level}/{col}/{row}.png", this.operationalLayerType = "OpenStreetMap", this.type = "open-street-map", this.fullExtent = new z(-20037508.342787, -20037508.34278, 20037508.34278, 20037508.342787, S.WebMercator), this.copyright = "Map data &copy; OpenStreetMap contributors, CC-BY-SA";
	}
	get refreshInterval() {
		return 0;
	}
};
__decorate([a({
	type: k,
	json: {
		read: !1,
		write: !1,
		origins: { "web-document": {
			read: !1,
			write: !1
		} }
	}
})], c.prototype, "portalItem", void 0), __decorate([a({
	type: Boolean,
	json: {
		read: !1,
		write: !1
	}
})], c.prototype, "isReference", void 0), __decorate([a({
	type: Number,
	readOnly: !0,
	json: {
		read: !1,
		write: !1,
		origins: { "web-document": {
			read: !1,
			write: !1
		} }
	}
})], c.prototype, "refreshInterval", null), __decorate([a({
	type: z$1,
	json: { write: !1 }
})], c.prototype, "tileInfo", void 0), __decorate([a({ type: ["show", "hide"] })], c.prototype, "listMode", void 0), __decorate([a({
	readOnly: !0,
	json: {
		read: !1,
		write: !1
	}
})], c.prototype, "subDomains", void 0), __decorate([a({
	readOnly: !0,
	json: {
		read: !1,
		write: !1
	}
})], c.prototype, "urlTemplate", void 0), __decorate([a({ type: ["OpenStreetMap"] })], c.prototype, "operationalLayerType", void 0), __decorate([a({ json: { read: !1 } })], c.prototype, "type", void 0), __decorate([a({
	readOnly: !0,
	json: {
		read: !1,
		write: !1
	},
	nonNullable: !0
})], c.prototype, "fullExtent", void 0), __decorate([a({ json: {
	read: !1,
	write: !1
} })], c.prototype, "copyright", void 0), __decorate([a({ json: {
	read: !1,
	write: !1
} })], c.prototype, "wmtsInfo", void 0), c = __decorate([c$1("esri.layers.OpenStreetMapLayer")], c);
var u = c;
//#endregion
export { u as default };

//# sourceMappingURL=OpenStreetMapLayer-DUXHIcmm.js.map