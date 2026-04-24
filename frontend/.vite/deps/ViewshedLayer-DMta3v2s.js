import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import { P as h$1 } from "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { O as o } from "./promiseUtils-DhYhergm.js";
import { O as a$1, i as r, n as c, r as m$1, t as a } from "./decorators-DE7S5xmd.js";
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
import { c as w$1, s as l } from "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import { t as b } from "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import { b as s, y as r$1 } from "./mathUtils-hEBUcrMa.js";
import "./opacityUtils-DgEZ8x-q.js";
import { t as f } from "./Clonable-D_RHUyXD.js";
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
import "./mat4-CCf33Vjt.js";
import { t as a$3 } from "./Cyclical-BTNbmw1N.js";
import { t as e$1 } from "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import "./aaBoundingBox-CzeY9F8R.js";
import "./layerContainerType-ZF61P2__.js";
import "./ElevationInfo-Bsg5AqQw.js";
import "./lengthUtils-DrG-JkjU.js";
import "./unitConversionUtils-dsyJpUwL.js";
import "./commonProperties-DQjThAJZ.js";
import "./vec4-DVix-cmy.js";
import "./vec4f64-SXri5KT8.js";
import { t as g$1 } from "./OperationalLayer-CaAaD2Zf.js";
import "./vec2f64-BKe4utUH.js";
import "./vec3-BfQf1_cT.js";
import "./quatf64-3OZfmMeM.js";
import "./vectorStacks-DmZ-Tu4f.js";
import { t as l$1 } from "./Analysis-C7U-Do_D.js";
import "./ray-B_6ooVQr.js";
import "./HUDIntersectorResult-Dxe2HxVE.js";
import "./Intersector-CUkOrUw6.js";
import { n as d, t as c$1 } from "./featureReferenceUtils-UwcVydOY.js";
//#region node_modules/@arcgis/core/analysis/Viewshed.js
var m = class extends a$2(f) {
	constructor(e) {
		super(e), this.observer = null, this.farDistance = 1e3, this.heading = 0, this.tilt = 90, this.horizontalFieldOfView = 45, this.verticalFieldOfView = 45, this.feature = null;
	}
	get valid() {
		return null != this.observer && this.farDistance > 0;
	}
	equals(e) {
		return o(this.observer, e.observer) && this.farDistance === e.farDistance && this.heading === e.heading && this.tilt === e.tilt && this.horizontalFieldOfView === e.horizontalFieldOfView && this.verticalFieldOfView === e.verticalFieldOfView && c$1(this.feature, e.feature);
	}
};
__decorate([a({
	type: _,
	json: { write: { isRequired: !0 } }
})], m.prototype, "observer", void 0), __decorate([a({
	type: Number,
	nonNullable: !0,
	range: { min: 0 },
	json: { write: { isRequired: !0 } }
})], m.prototype, "farDistance", void 0), __decorate([a({
	type: Number,
	nonNullable: !0,
	json: { write: { isRequired: !0 } }
}), m$1((e) => a$3.normalize(a$1(e), void 0, !0))], m.prototype, "heading", void 0), __decorate([a({
	type: Number,
	nonNullable: !0,
	range: {
		min: 0,
		max: 180
	},
	json: { write: { isRequired: !0 } }
})], m.prototype, "tilt", void 0), __decorate([a({
	type: Number,
	nonNullable: !0,
	range: {
		min: 0,
		max: 360
	},
	json: { write: { isRequired: !0 } }
})], m.prototype, "horizontalFieldOfView", void 0), __decorate([a({
	type: Number,
	nonNullable: !0,
	range: {
		min: 0,
		max: 180
	},
	json: { write: { isRequired: !0 } }
})], m.prototype, "verticalFieldOfView", void 0), __decorate([a(d)], m.prototype, "feature", void 0), __decorate([a({
	readOnly: !0,
	json: { read: !1 }
})], m.prototype, "valid", null), m = __decorate([c("esri.analysis.Viewshed")], m);
//#endregion
//#region node_modules/@arcgis/core/analysis/ViewshedAnalysis.js
var v = q.ofType(m);
var y$1 = class extends l$1 {
	constructor(e) {
		super(e), this.type = "viewshed", this._extent = null;
	}
	initialize() {
		this.addHandles(l(() => this._computeExtent(), (e) => {
			e.pending ?? (this._extent = e.extent);
		}, w$1));
	}
	get viewsheds() {
		return this._get("viewsheds") || new v();
	}
	set viewsheds(e) {
		this._set("viewsheds", n(e, this.viewsheds, v));
	}
	get spatialReference() {
		for (const e of this.viewsheds) if (null != e.observer) return e.observer.spatialReference;
		return null;
	}
	get extent() {
		return this._extent;
	}
	get valid() {
		return this.viewsheds.every((e) => e.valid);
	}
	async waitComputeExtent() {
		const e = this._computeExtent();
		null != e.pending && await e.pending;
	}
	_computeExtent() {
		const { spatialReference: e } = this;
		if (null == e) return {
			pending: null,
			extent: null
		};
		const t = this.viewsheds.filter((e) => null != e.observer), r = $(t.map((e) => e.observer).toArray(), e);
		if (null != r.pending) return {
			pending: r.pending,
			extent: null
		};
		return {
			pending: null,
			extent: r.geometries.map((e, n) => {
				const r = t.at(n);
				return null != e && null != r ? this._computeViewshedExtent(this.viewsheds.at(n), e) : null;
			}).filter((e) => null != e).reduce((e, t) => x(e, t), null)
		};
	}
	_computeViewshedExtent(e, t) {
		const { farDistance: n, heading: r, tilt: i, horizontalFieldOfView: s$1, verticalFieldOfView: o } = e, { spatialReference: p } = t, c = s$1 / 2, m = o / 2, h = n / p.metersPerUnit, f = [
			a$3.normalize(r - c),
			r,
			a$3.normalize(r + c)
		], v = z.fromPoint(t), y = (e) => {
			const t = f.map((t) => a$3.normalize(t - e));
			if (t[0] > t[2] || 360 === s$1) return h;
			const n = t.map((e) => Math.abs(e > 180 ? 360 - e : e)).reduce((e, t) => e > t ? t : e);
			return n > 90 ? 0 : h * Math.cos(s(n));
		};
		v.xmax += y(90), v.xmin -= y(-90), v.ymax += y(0), v.ymin -= y(180);
		const x = t.z;
		if (null != x) {
			let e = x, t = x;
			const r = i - 90, s = r$1(r + m, -90, 90), o = r$1(r - m, -90, 90), l = p?.isGeographic ? n : h;
			e += l * g(s), t += l * g(o);
			const a = w(m) * l, d = g(r) * a * (1 - w(c));
			i < 90 && (e -= d), i > 90 && (t -= d), v.zmax = Math.max(e, x), v.zmin = Math.min(t, x);
		}
		return v;
	}
	equals(e) {
		return this === e || super.equals(e) && h$1(this.viewsheds.toArray(), e.viewsheds.toArray(), (e, t) => e.equals(t));
	}
	clear() {
		this.viewsheds.removeAll();
	}
};
function x(e, t) {
	return null == e ? t : null == t ? e : e.union(t);
}
function w(e) {
	return Math.cos(s(e));
}
function g(e) {
	return Math.sin(s(e));
}
__decorate([a({ type: ["viewshed"] })], y$1.prototype, "type", void 0), __decorate([a({
	cast: e,
	type: v,
	nonNullable: !0
})], y$1.prototype, "viewsheds", null), __decorate([a({ readOnly: !0 })], y$1.prototype, "spatialReference", null), __decorate([a()], y$1.prototype, "_extent", void 0), __decorate([a()], y$1.prototype, "extent", null), __decorate([a({ readOnly: !0 })], y$1.prototype, "valid", null), y$1 = __decorate([c("esri.analysis.ViewshedAnalysis")], y$1);
//#endregion
//#region node_modules/@arcgis/core/layers/ViewshedLayer.js
var y = class extends g$1(e$1(b)) {
	constructor(e) {
		super(e), this.type = "viewshed", this.operationalLayerType = "ViewshedLayer", this.source = new y$1(), this.opacity = 1;
	}
	initialize() {
		this.addHandles(l(() => this.source, (e, r) => {
			null != r && r.parent === this && (r.parent = null), null != e && (e.parent = this);
		}, w$1));
	}
	async load() {
		return this.addResolvingPromise(this.source.waitComputeExtent()), this;
	}
	get spatialReference() {
		return this.source.spatialReference;
	}
	get fullExtent() {
		return this.source.extent;
	}
	releaseAnalysis(e) {
		this.source === e && (this.source = new y$1());
	}
	get analysis() {
		return this.source;
	}
	set analysis(e) {
		this.source = e;
	}
	get viewsheds() {
		return this.source.viewsheds;
	}
	set viewsheds(e) {
		this.source.viewsheds = e;
	}
	writeViewsheds(e, r, t, s) {
		r.viewsheds = e.filter((e) => e.valid).toJSON(s);
	}
};
__decorate([a({
	json: { read: !1 },
	readOnly: !0
})], y.prototype, "type", void 0), __decorate([a({ type: ["ViewshedLayer"] })], y.prototype, "operationalLayerType", void 0), __decorate([a({
	type: y$1,
	nonNullable: !0
})], y.prototype, "source", void 0), __decorate([a({ readOnly: !0 })], y.prototype, "spatialReference", null), __decorate([a({ readOnly: !0 })], y.prototype, "fullExtent", null), __decorate([a({
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
})], y.prototype, "opacity", void 0), __decorate([a({ type: ["show", "hide"] })], y.prototype, "listMode", void 0), __decorate([a({
	type: q.ofType(m),
	json: {
		write: { ignoreOrigin: !0 },
		origins: { "web-scene": { write: { ignoreOrigin: !0 } } }
	}
})], y.prototype, "viewsheds", null), __decorate([r("web-scene", "viewsheds")], y.prototype, "writeViewsheds", null), y = __decorate([c("esri.layers.ViewshedLayer")], y);
var h = y;
//#endregion
export { h as default };

//# sourceMappingURL=ViewshedLayer-DMta3v2s.js.map