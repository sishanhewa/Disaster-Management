import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import { P as h } from "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { O as o } from "./promiseUtils-DhYhergm.js";
import { E as D, O as a$1, i as r, n as c, r as m$1, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./Evented-GLJbxWO5.js";
import "./SimpleObservable-CNlRjEs1.js";
import { t as q } from "./Collection-BAJSKCip.js";
import { n, t as e } from "./collectionUtils-DQeMhtWS.js";
import { t as a$2 } from "./JSONSupport-BUaD4jSd.js";
import "./Promise-Dhhz7kXA.js";
import "./Loadable-CQsALnOO.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import { t as _ } from "./Point-B7zMqEx6.js";
import { t as z } from "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import { c as w, s as l } from "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import { t as b } from "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import { t as g } from "./Color-C99QAF80.js";
import "./opacityUtils-DgEZ8x-q.js";
import { t as f$1 } from "./Clonable-D_RHUyXD.js";
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
import { t as $ } from "./projectionUtils-CmEsVWfk.js";
import { l as o$1, r as e$1 } from "./screenUtils-BR-xd7ya.js";
import { t as a$3 } from "./Cyclical-BTNbmw1N.js";
import { t as e$2 } from "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./layerContainerType-ZF61P2__.js";
import "./ElevationInfo-Bsg5AqQw.js";
import "./lengthUtils-DrG-JkjU.js";
import "./unitConversionUtils-dsyJpUwL.js";
import "./commonProperties-DQjThAJZ.js";
import { t as g$1 } from "./OperationalLayer-CaAaD2Zf.js";
import { t as l$1 } from "./Analysis-C7U-Do_D.js";
//#region node_modules/@arcgis/core/analysis/DimensionSimpleStyle.js
var u$1 = class extends a$2(f$1) {
	constructor(e) {
		super(e), this.type = "simple", this.color = new g("black"), this.textColor = new g("black"), this.textBackgroundColor = new g([
			255,
			255,
			255,
			.6
		]);
	}
	get lineSize() {
		return this._get("lineSize") ?? 2;
	}
	set lineSize(e) {
		this._set("lineSize", e);
	}
	get fontSize() {
		return this._get("fontSize") ?? 10;
	}
	set fontSize(e) {
		this._set("fontSize", e);
	}
	equals(e) {
		return this === e || this.color.equals(e.color) && this.lineSize === e.lineSize && this.fontSize === e.fontSize && this.textColor.equals(e.textColor) && this.textBackgroundColor.equals(e.textBackgroundColor);
	}
};
__decorate([a({
	type: ["simple"],
	readOnly: !0,
	json: { write: { isRequired: !0 } }
})], u$1.prototype, "type", void 0), __decorate([a({
	type: g,
	nonNullable: !0,
	json: {
		type: [D],
		write: { isRequired: !0 }
	}
})], u$1.prototype, "color", void 0), __decorate([a({
	type: Number,
	cast: o$1,
	nonNullable: !0,
	range: { min: e$1(1) },
	json: { write: { isRequired: !0 } }
})], u$1.prototype, "lineSize", null), __decorate([a({
	type: Number,
	cast: o$1,
	nonNullable: !0,
	json: { write: { isRequired: !0 } }
})], u$1.prototype, "fontSize", null), __decorate([a({
	type: g,
	nonNullable: !0,
	json: {
		type: [D],
		write: { isRequired: !0 }
	}
})], u$1.prototype, "textColor", void 0), __decorate([a({
	type: g,
	nonNullable: !0,
	json: {
		type: [D],
		write: { isRequired: !0 }
	}
})], u$1.prototype, "textBackgroundColor", void 0), u$1 = __decorate([c("esri.analysis.DimensionSimpleStyle")], u$1);
//#endregion
//#region node_modules/@arcgis/core/analysis/dimensionUtils.js
var t = [
	"horizontal",
	"vertical",
	"direct"
];
//#endregion
//#region node_modules/@arcgis/core/analysis/LengthDimension.js
var m = class extends a$2(f$1) {
	constructor(t) {
		super(t), this.type = "length", this.startPoint = null, this.endPoint = null, this.measureType = "direct", this.offset = 0, this.orientation = 0;
	}
	get valid() {
		return null != this.startPoint && null != this.endPoint;
	}
	equals(t) {
		return this === t || o(this.startPoint, t.startPoint) && o(this.endPoint, t.endPoint) && this.measureType === t.measureType && this.offset === t.offset && this.orientation === t.orientation;
	}
};
__decorate([a({
	type: ["length"],
	json: { write: { isRequired: !0 } }
})], m.prototype, "type", void 0), __decorate([a({
	type: _,
	json: { write: { isRequired: !0 } }
})], m.prototype, "startPoint", void 0), __decorate([a({
	type: _,
	json: { write: { isRequired: !0 } }
})], m.prototype, "endPoint", void 0), __decorate([a({
	type: t,
	nonNullable: !0,
	json: { write: { isRequired: !0 } }
})], m.prototype, "measureType", void 0), __decorate([a({
	type: Number,
	nonNullable: !0,
	json: { write: { isRequired: !0 } }
})], m.prototype, "offset", void 0), __decorate([a({
	type: Number,
	nonNullable: !0,
	json: { write: { isRequired: !0 } }
}), m$1((t) => a$3.normalize(a$1(t), 0, !0))], m.prototype, "orientation", void 0), __decorate([a({ readOnly: !0 })], m.prototype, "valid", null), m = __decorate([c("esri.analysis.LengthDimension")], m);
//#endregion
//#region node_modules/@arcgis/core/analysis/DimensionAnalysis.js
var y = q.ofType(m);
var f = class extends l$1 {
	constructor(e) {
		super(e), this.type = "dimension", this.style = new u$1(), this.extent = null;
	}
	initialize() {
		this.addHandles(l(() => this._computeExtent(), (e) => {
			e?.pending ?? this._set("extent", null != e ? e.extent : null);
		}, w));
	}
	get dimensions() {
		return this._get("dimensions") || new y();
	}
	set dimensions(e) {
		this._set("dimensions", n(e, this.dimensions, y));
	}
	get spatialReference() {
		for (const e of this.dimensions) {
			if (null != e.startPoint) return e.startPoint.spatialReference;
			if (null != e.endPoint) return e.endPoint.spatialReference;
		}
		return null;
	}
	get valid() {
		return this.dimensions.every((e) => e.valid);
	}
	async waitComputeExtent() {
		const e = this._computeExtent();
		return null != e ? e.pending : Promise.resolve();
	}
	_computeExtent() {
		const e = this.spatialReference;
		if (null == e) return {
			pending: null,
			extent: null
		};
		const t = [];
		for (const s of this.dimensions) null != s.startPoint && t.push(s.startPoint), null != s.endPoint && t.push(s.endPoint);
		const n = $(t, e);
		if (null != n.pending) return {
			pending: n.pending,
			extent: null
		};
		let i = null;
		return null != n.geometries && (i = n.geometries.reduce((e, t) => null == e ? null != t ? z.fromPoint(t) : null : null != t ? e.union(z.fromPoint(t)) : e, null)), {
			pending: null,
			extent: i
		};
	}
	clear() {
		this.dimensions.removeAll();
	}
	equals(e) {
		return this === e || super.equals(e) && this.style.equals(e.style) && h(this.dimensions.toArray(), e.dimensions.toArray(), (e, t) => e.equals(t));
	}
};
__decorate([a({ type: ["dimension"] })], f.prototype, "type", void 0), __decorate([a({
	cast: e,
	type: y,
	nonNullable: !0
})], f.prototype, "dimensions", null), __decorate([a({ readOnly: !0 })], f.prototype, "spatialReference", null), __decorate([a({
	types: {
		key: "type",
		base: null,
		typeMap: { simple: u$1 }
	},
	nonNullable: !0
})], f.prototype, "style", void 0), __decorate([a({
	value: null,
	readOnly: !0
})], f.prototype, "extent", void 0), __decorate([a({ readOnly: !0 })], f.prototype, "valid", null), f = __decorate([c("esri.analysis.DimensionAnalysis")], f);
//#endregion
//#region node_modules/@arcgis/core/layers/DimensionLayer.js
var u = class extends g$1(e$2(b)) {
	constructor(e) {
		if (super(e), this.type = "dimension", this.operationalLayerType = "ArcGISDimensionLayer", this.source = new f(), this.opacity = 1, e) {
			const { source: t, style: s } = e;
			t && s && (t.style = s);
		}
	}
	initialize() {
		this.addHandles([l(() => this.source, (e, t) => {
			null != t && t.parent === this && (t.parent = null), null != e && (e.parent = this);
		}, w)]);
	}
	async load() {
		return this.addResolvingPromise(this.source.waitComputeExtent()), this;
	}
	get spatialReference() {
		return this.source.spatialReference;
	}
	get style() {
		return this.source.style;
	}
	set style(e) {
		this.source.style = e;
	}
	get fullExtent() {
		return this.source.extent;
	}
	releaseAnalysis(e) {
		this.source === e && (this.source = new f());
	}
	get analysis() {
		return this.source;
	}
	set analysis(e) {
		this.source = e;
	}
	get dimensions() {
		return this.source.dimensions;
	}
	set dimensions(e) {
		this.source.dimensions = e;
	}
	writeDimensions(e, t, s, i) {
		t.dimensions = e.filter(({ startPoint: e, endPoint: t }) => null != e && null != t).toJSON(i);
	}
};
__decorate([a({
	json: { read: !1 },
	readOnly: !0
})], u.prototype, "type", void 0), __decorate([a({ type: ["ArcGISDimensionLayer"] })], u.prototype, "operationalLayerType", void 0), __decorate([a({ nonNullable: !0 })], u.prototype, "source", void 0), __decorate([a({ readOnly: !0 })], u.prototype, "spatialReference", null), __decorate([a({
	types: {
		key: "type",
		base: null,
		typeMap: { simple: u$1 }
	},
	json: { write: { ignoreOrigin: !0 } }
})], u.prototype, "style", null), __decorate([a({ readOnly: !0 })], u.prototype, "fullExtent", null), __decorate([a({
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
})], u.prototype, "opacity", void 0), __decorate([a({ type: ["show", "hide"] })], u.prototype, "listMode", void 0), __decorate([a({
	type: q.ofType(m),
	json: {
		write: { ignoreOrigin: !0 },
		origins: { "web-scene": { write: { ignoreOrigin: !0 } } }
	}
})], u.prototype, "dimensions", null), __decorate([r("web-scene", "dimensions")], u.prototype, "writeDimensions", null), u = __decorate([c("esri.layers.DimensionLayer")], u);
var d = u;
//#endregion
export { d as default };

//# sourceMappingURL=DimensionLayer-C2dJNz7F.js.map