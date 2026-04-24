import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./Evented-GLJbxWO5.js";
import "./SimpleObservable-CNlRjEs1.js";
import "./Collection-BAJSKCip.js";
import "./collectionUtils-DQeMhtWS.js";
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
import "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import { t as b } from "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
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
import "./utils-3ndlmaCD.js";
import "./mat4-CCf33Vjt.js";
import "./jsonUtils-D_oLUjKv.js";
import "./typeUtils-DaICxhuY.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./PopupTemplate-8SH37QID.js";
import "./fieldFormatUtils-R1ptUFq7.js";
import "./ActionToggle-JH4srUd2.js";
import "./Graphic-D2G0Ykqt.js";
import "./SimpleMarkerSymbol-BjFFaoyw.js";
import "./typeUtils-DZkmoi8p.js";
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import "./aaBoundingBox-CzeY9F8R.js";
import "./symbolLayerUtils3D-BQRyZskR.js";
import "./textUtils-B4iTDAON.js";
import "./TextSymbol-CsSnkPMD.js";
import "./SimpleFillSymbol-CbXKKnxp.js";
import "./PictureMarkerSymbol-Crs5VdSs.js";
import "./layerContainerType-ZF61P2__.js";
import "./parser-DVDIh5bD.js";
import "./jsonUtils-DOqHqQ2U.js";
import { n as p } from "./BlendLayer-D1uDzFu8.js";
import { t as x } from "./ElevationInfo-Bsg5AqQw.js";
import "./lengthUtils-DrG-JkjU.js";
import "./unitConversionUtils-dsyJpUwL.js";
import { t as l } from "./ScaleRangeLayer-CIL5S5vZ.js";
import { n as l$1, t as i } from "./GraphicsCollection-BkbKNUGI.js";
//#region node_modules/@arcgis/core/layers/GraphicsLayer.js
var h = class extends p(l(b)) {
	constructor(e) {
		super(e), this.elevationInfo = null, this.graphics = new i(), this.screenSizePerspectiveEnabled = !0, this.type = "graphics", this.internal = !1;
	}
	destroy() {
		this.removeAll(), this.graphics.destroy();
	}
	get loaded() {
		return super.loaded;
	}
	add(e) {
		return this.graphics.add(e), this;
	}
	addMany(e) {
		return this.graphics.addMany(e), this;
	}
	removeAll() {
		return this.graphics.removeAll(), this;
	}
	remove(e) {
		this.graphics.remove(e);
	}
	removeMany(e) {
		this.graphics.removeMany(e);
	}
	graphicChanged(e) {
		this.emit("graphic-update", e);
	}
};
__decorate([a({ type: x })], h.prototype, "elevationInfo", void 0), __decorate([a(l$1(i, "graphics"))], h.prototype, "graphics", void 0), __decorate([a({ type: ["show", "hide"] })], h.prototype, "listMode", void 0), __decorate([a()], h.prototype, "screenSizePerspectiveEnabled", void 0), __decorate([a({ readOnly: !0 })], h.prototype, "type", void 0), __decorate([a({ constructOnly: !0 })], h.prototype, "internal", void 0), h = __decorate([c("esri.layers.GraphicsLayer")], h);
//#endregion
export { h as default };

//# sourceMappingURL=@arcgis_core_layers_GraphicsLayer.js.map