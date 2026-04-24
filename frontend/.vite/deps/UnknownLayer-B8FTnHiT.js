import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c, t as a$1 } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import { t as F } from "./scheduling-DiUcWka1.js";
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
import { t as b } from "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./catalogUtils-lRNSLCIB.js";
import "./mathUtils-hEBUcrMa.js";
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
import { t as _ } from "./PortalLayer-B3x-_Tp7.js";
//#region node_modules/@arcgis/core/layers/UnknownLayer.js
var l = class extends _(e(b)) {
	constructor(r) {
		super(r), this.resourceInfo = null, this.type = "unknown";
	}
	initialize() {
		this.addResolvingPromise(new Promise((r$2, o) => {
			F(() => {
				const r$1 = this.resourceInfo && (this.resourceInfo.layerType || this.resourceInfo.type);
				let t = "Unknown layer type";
				r$1 && (t += " " + r$1), o(new r("layer:unknown-layer-type", t, { layerType: r$1 }));
			});
		}));
	}
	read(r, e) {
		super.read({ resourceInfo: r }, e);
	}
	write(r, e) {
		return null;
	}
};
__decorate([a$1({ readOnly: !0 })], l.prototype, "resourceInfo", void 0), __decorate([a$1({ type: ["show", "hide"] })], l.prototype, "listMode", void 0), __decorate([a$1({
	json: { read: !1 },
	readOnly: !0,
	value: "unknown"
})], l.prototype, "type", void 0), l = __decorate([c("esri.layers.UnknownLayer")], l);
var a = l;
//#endregion
export { a as default };

//# sourceMappingURL=UnknownLayer-B8FTnHiT.js.map