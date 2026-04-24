import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import { P as h } from "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { O as o } from "./promiseUtils-DhYhergm.js";
import { n as c$2, t as a } from "./decorators-DE7S5xmd.js";
import { t as b } from "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./Evented-GLJbxWO5.js";
import "./SimpleObservable-CNlRjEs1.js";
import { t as q } from "./Collection-BAJSKCip.js";
import { n, t as e } from "./collectionUtils-DQeMhtWS.js";
import { t as a$1 } from "./JSONSupport-BUaD4jSd.js";
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
import "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import { c as w, s as l } from "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import { t as b$1 } from "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./mathUtils-hEBUcrMa.js";
import "./opacityUtils-DgEZ8x-q.js";
import { n as l$1, t as f } from "./Clonable-D_RHUyXD.js";
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
import { o as Q } from "./projectionUtils-CmEsVWfk.js";
import "./mat4-CCf33Vjt.js";
import { t as e$1 } from "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import { A as u$2, S as h$1, T as l$2 } from "./aaBoundingBox-CzeY9F8R.js";
import "./layerContainerType-ZF61P2__.js";
import { t as x$1 } from "./ElevationInfo-Bsg5AqQw.js";
import "./lengthUtils-DrG-JkjU.js";
import "./unitConversionUtils-dsyJpUwL.js";
import "./commonProperties-DQjThAJZ.js";
import "./vec4-DVix-cmy.js";
import "./vec4f64-SXri5KT8.js";
import { t as g } from "./OperationalLayer-CaAaD2Zf.js";
import "./vec2f64-BKe4utUH.js";
import "./vec3-BfQf1_cT.js";
import "./quatf64-3OZfmMeM.js";
import "./vectorStacks-DmZ-Tu4f.js";
import { g as s } from "./elevationInfoUtils-BTAkLxlB.js";
import { t as l$3 } from "./Analysis-C7U-Do_D.js";
import "./ray-B_6ooVQr.js";
import "./HUDIntersectorResult-Dxe2HxVE.js";
import "./Intersector-CUkOrUw6.js";
import { n as d$1, t as c$3 } from "./featureReferenceUtils-UwcVydOY.js";
//#region node_modules/@arcgis/core/analysis/LineOfSightAnalysisObserver.js
var c$1 = class extends a$1(l$1(b)) {
	constructor(o) {
		super(o), this.position = null, this.elevationInfo = null, this.feature = null;
	}
	equals(o$2) {
		return o(this.position, o$2.position) && o(this.elevationInfo, o$2.elevationInfo) && c$3(this.feature, o$2.feature);
	}
};
__decorate([a({
	type: _,
	json: { write: { isRequired: !0 } }
})], c$1.prototype, "position", void 0), __decorate([a({ type: x$1 }), j()], c$1.prototype, "elevationInfo", void 0), __decorate([a(d$1)], c$1.prototype, "feature", void 0), c$1 = __decorate([c$2("esri.analysis.LineOfSightAnalysisObserver")], c$1);
var u$1 = c$1;
//#endregion
//#region node_modules/@arcgis/core/analysis/LineOfSightAnalysisTarget.js
var m$1 = class extends a$1(f) {
	constructor(o) {
		super(o), this.position = null, this.elevationInfo = null, this.feature = null;
	}
	equals(o$1) {
		return o(this.position, o$1.position) && o(this.elevationInfo, o$1.elevationInfo) && c$3(this.feature, o$1.feature);
	}
};
__decorate([a({
	type: _,
	json: {
		write: !0,
		origins: { "web-scene": { write: { isRequired: !0 } } }
	}
}), j()], m$1.prototype, "position", void 0), __decorate([a({ type: x$1 }), j()], m$1.prototype, "elevationInfo", void 0), __decorate([a(d$1)], m$1.prototype, "feature", void 0), m$1 = __decorate([c$2("esri.analysis.LineOfSightAnalysisTarget")], m$1);
//#endregion
//#region node_modules/@arcgis/core/analysis/LineOfSightAnalysis.js
var d = q.ofType(m$1);
var x = class extends l$3 {
	constructor(t) {
		super(t), this.type = "line-of-sight", this.observer = null, this.extent = null;
	}
	initialize() {
		this.addHandles(l(() => this._computeExtent(), (t) => {
			t?.pending ?? this._set("extent", null != t ? t.extent : null);
		}, w));
	}
	get targets() {
		return this._get("targets") || new d();
	}
	set targets(t) {
		this._set("targets", n(t, this.targets, d));
	}
	get spatialReference() {
		return null != this.observer?.position ? this.observer.position.spatialReference : null;
	}
	get valid() {
		return null != this.observer?.position;
	}
	async waitComputeExtent() {
		const t = this._computeExtent();
		return null != t ? t.pending : Promise.resolve();
	}
	_computeExtent() {
		const t = this.spatialReference;
		if (null == this.observer?.position || null == t) return null;
		const e = (t) => "absolute-height" === s(t.position, t.elevationInfo), r = this.observer.position, o = u$2(r.x, r.y, r.z, r.x, r.y, r.z);
		for (const i of this.targets) if (null != i.position) {
			const e = Q(i.position, t);
			if (null != e.pending) return {
				pending: e.pending,
				extent: null
			};
			if (null != e.geometry) {
				const { x: t, y: r, z: s } = e.geometry;
				l$2(o, [
					t,
					r,
					s
				]);
			}
		}
		const s$1 = h$1(o, t);
		return e(this.observer) && this.targets.every(e) || (s$1.zmin = void 0, s$1.zmax = void 0), {
			pending: null,
			extent: s$1
		};
	}
	clear() {
		this.observer = null, this.targets.removeAll();
	}
	equals(t) {
		return this === t || super.equals(t) && o(this.observer, t.observer) && h(this.targets.toArray(), t.targets.toArray(), (t, e) => t.equals(e));
	}
};
__decorate([a({ type: ["line-of-sight"] })], x.prototype, "type", void 0), __decorate([a({
	type: u$1,
	json: {
		read: !0,
		write: !0
	}
})], x.prototype, "observer", void 0), __decorate([a({
	cast: e,
	type: d,
	nonNullable: !0,
	json: {
		read: !0,
		write: !0
	}
})], x.prototype, "targets", null), __decorate([a({
	value: null,
	readOnly: !0
})], x.prototype, "extent", void 0), __decorate([a()], x.prototype, "spatialReference", null), __decorate([a({ readOnly: !0 })], x.prototype, "valid", null), x = __decorate([c$2("esri.analysis.LineOfSightAnalysis")], x);
//#endregion
//#region node_modules/@arcgis/core/layers/LineOfSightLayer.js
var u = q.ofType(m$1);
var m = class extends g(e$1(b$1)) {
	constructor(e) {
		super(e), this.type = "line-of-sight", this.operationalLayerType = "LineOfSightLayer", this.analysis = new x(), this.opacity = 1;
	}
	initialize() {
		this.addHandles(l(() => this.analysis, (e, t) => {
			null != t && t.parent === this && (t.parent = null), null != e && (e.parent = this);
		}, w));
	}
	async load() {
		return null != this.analysis && this.addResolvingPromise(this.analysis.waitComputeExtent()), this;
	}
	get observer() {
		return this.analysis?.observer;
	}
	set observer(e) {
		const { analysis: t } = this;
		t && (t.observer = e);
	}
	get targets() {
		return null != this.analysis ? this.analysis.targets : new q();
	}
	set targets(e) {
		n(e, this.analysis?.targets);
	}
	get fullExtent() {
		return null != this.analysis ? this.analysis.extent : null;
	}
	get spatialReference() {
		return null != this.analysis ? this.analysis.spatialReference : null;
	}
	releaseAnalysis(e) {
		this.analysis === e && (this.analysis = new x());
	}
};
__decorate([a({
	json: { read: !1 },
	readOnly: !0
})], m.prototype, "type", void 0), __decorate([a({ type: ["LineOfSightLayer"] })], m.prototype, "operationalLayerType", void 0), __decorate([a({
	type: u$1,
	json: {
		read: !0,
		write: {
			isRequired: !0,
			ignoreOrigin: !0
		}
	}
})], m.prototype, "observer", null), __decorate([a({
	type: u,
	json: {
		read: !0,
		write: {
			ignoreOrigin: !0,
			isRequired: !0
		}
	}
})], m.prototype, "targets", null), __decorate([a({
	type: x,
	nonNullable: !0,
	json: {
		read: !1,
		write: !1
	}
})], m.prototype, "analysis", void 0), __decorate([a({ readOnly: !0 })], m.prototype, "fullExtent", null), __decorate([a({ readOnly: !0 })], m.prototype, "spatialReference", null), __decorate([a({
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
})], m.prototype, "opacity", void 0), __decorate([a({ type: ["show", "hide"] })], m.prototype, "listMode", void 0), m = __decorate([c$2("esri.layers.LineOfSightLayer")], m);
var c = m;
//#endregion
export { c as default };

//# sourceMappingURL=LineOfSightLayer-CkwDkBPF.js.map