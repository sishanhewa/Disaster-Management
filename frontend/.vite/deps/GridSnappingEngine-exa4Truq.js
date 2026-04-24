import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import { t as b } from "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./SimpleObservable-CNlRjEs1.js";
import "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import { l as N } from "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import "./reactiveUtils-DRpp6Nmg.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import { b as s } from "./mathUtils-hEBUcrMa.js";
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
import { c as Y, r as H } from "./projectionUtils-CmEsVWfk.js";
import "./mat4-CCf33Vjt.js";
import "./Cyclical-BTNbmw1N.js";
import "./jsonUtils-D_oLUjKv.js";
import "./typeUtils-DaICxhuY.js";
import "./Version-CjTddL5F.js";
import "./utils-5irCjX9t.js";
import "./utils-Ch7GqCap.js";
import "./fieldType-D7SwLPxF.js";
import "./sql-Cyp7eZa9.js";
import "./mat4f64-BA1Qbgtv.js";
import "./Field-jzopk-Sr.js";
import "./Queue-CM8W5OTt.js";
import { i as u } from "./scaleUtils-SpG4h9an.js";
import "./DynamicDataLayer-Nl0N-nbb.js";
import "./Query-aOayEcb1.js";
import "./QuantizationParameters-BoZFfmfD.js";
import "./StatisticDefinition-DCvGQn-e.js";
import "./lengthUtils-DrG-JkjU.js";
import "./unitConversionUtils-dsyJpUwL.js";
import "./vec4-DVix-cmy.js";
import "./vec4f64-SXri5KT8.js";
import "./utils-FTUHjE_7.js";
import "./InputManager-BkGXYhfV.js";
import "./signal-DCDIpEz3.js";
import "./PropertiesPool-0qj03Krs.js";
import "./keybindings-D58YhZPZ.js";
import "./vec2f64-BKe4utUH.js";
import "./normalizeUtilsCommon-gtN1A7xM.js";
import { n as L } from "./normalizeUtils-BbPgVXXO.js";
import { h as Y$1 } from "./vec3-BfQf1_cT.js";
import "./closestPointOnCurve-DOaJ7IXx.js";
import "./quatf64-3OZfmMeM.js";
import "./plane-3RNaG9XX.js";
import "./vectorStacks-DmZ-Tu4f.js";
import "./mathUtils-BlzSoZZn.js";
import "./elevationInfoUtils-BTAkLxlB.js";
import "./ray-B_6ooVQr.js";
import { a as f, c as l } from "./normalizedPoint-BO8sGqAY.js";
import { r as g } from "./snappingUtils-CnCuZcux.js";
import "./geodesicUtils-C7KxNiIf.js";
import "./vec3-ByKKGMhe.js";
import "./sphere-C0hnJWBV.js";
import "./geometry2dUtils-DhdtAgRB.js";
import "./constraints-CM2adGn6.js";
import "./LineSnappingHint-DqpwvriX.js";
import "./IntersectionSnappingHint-DGVNu2kY.js";
import { t as n$1 } from "./IntersectionSnappingCandidate-ASyQv_ao.js";
import { t as i } from "./LineSnappingCandidate-BqifJKXA.js";
import { n as u$1, t as l$1 } from "./gridUtils-BlWfGsal.js";
//#region node_modules/@arcgis/core/views/interactive/snapping/GridSnappingEngine.js
var w = class extends b {
	constructor(t) {
		super(t), this.options = null;
	}
	destroy() {
		this._set("options", null);
	}
	get grid() {
		return this.view.grid;
	}
	get effectiveViewRotation() {
		return this.grid?.rotateWithMap ? 0 : s(this.view.rotation ?? 0);
	}
	get gridRotation() {
		return s(this.grid?.rotation ?? 0);
	}
	get gridCenter() {
		const { spatialReference: t, grid: e } = this;
		if (!e || !t || !Y(e.center.spatialReference, t)) return null;
		try {
			const r = H(e.center, t);
			return l(t.isWrappable && null != this.view?.center ? L(r.x, this.view.center.x, t) : r.x, r.y, r.z);
		} catch (i) {
			return n.getLogger(this).errorOnce("Grid Snapping - Failed to project grid center.", i), null;
		}
	}
	get offsetScaleFactor() {
		const { pixelsPerStride: t, grid: e } = this;
		if (!e || !t) return 1;
		const { majorLineInterval: r, dynamicScaling: i } = e;
		return r < 1 ? null : l$1(r, t, i);
	}
	get spatialReference() {
		return this.view.spatialReference;
	}
	get gridMetersPerStride() {
		const { grid: t } = this;
		return t ? N(t.spacing, t.units, "meters") : null;
	}
	get viewMetersPerPixel() {
		const { viewMetersPerSRUnit: t } = this;
		return null == t ? null : t * u(this.view.scale, this.view.spatialReference);
	}
	get viewMetersPerSRUnit() {
		const { spatialReference: t } = this.view;
		return this.gridCenter ? u$1(this.gridCenter[0], this.gridCenter[1], t) : null;
	}
	get pixelsPerStride() {
		const { gridMetersPerStride: t, viewMetersPerPixel: e } = this;
		return e && t ? t / e : null;
	}
	get updating() {
		return null != this.grid && null != this.spatialReference && null == this.viewMetersPerSRUnit;
	}
	async fetchCandidates(t, e, r) {
		const { options: i, view: n } = this;
		if (!i?.effectiveGridEnabled || !n.grid || r.feature?.attributes && g in r.feature.attributes) return [];
		const o = r.coordinateHelper.arrayToPoint(t), s = i.distance * ("touch" === r.pointer ? i.touchSensitivityMultiplier : 1);
		return this.fetchCandidatesSync(o, s);
	}
	fetchCandidatesSync(t, e) {
		const r = [], { grid: i$1, effectiveViewRotation: n, gridRotation: o, gridCenter: s, viewMetersPerPixel: a, viewMetersPerSRUnit: c, offsetScaleFactor: u, spatialReference: g, gridMetersPerStride: f, pixelsPerStride: m } = this;
		if (!(i$1 && a && c && s && g && u && f && m)) return r;
		if (!i$1.dynamicScaling && m < 5) return r;
		if (!Y(t.spatialReference, g)) return r;
		const S = H(t, g), x = P(l(S.x, S.y, S.z), -o, s, -n), C = f / c * u, U = M(x, C, s), { shouldSnapX: b, shouldSnapY: z } = R(U, x, e, a, c);
		if (!b && !z) return [];
		const F = P(l((b ? U : x)[0], (z ? U : x)[1]), o, s, n), L = P(U, o, s, n);
		if (z) {
			const e = P(j(U, x, C, "y"), o, s, n);
			r.push(new i({
				lineStart: L,
				lineEnd: e,
				targetPoint: F,
				isDraped: !1
			}));
		}
		if (b) {
			const e = P(j(U, x, C, "x"), o, s, n);
			r.push(new i({
				lineStart: L,
				lineEnd: e,
				targetPoint: F,
				isDraped: !1
			}));
		}
		return b && z && r.push(new n$1(F, r[0], r[1], !1)), r;
	}
};
__decorate([a({ constructOnly: !0 })], w.prototype, "view", void 0), __decorate([a()], w.prototype, "options", void 0), __decorate([a()], w.prototype, "grid", null), __decorate([a()], w.prototype, "effectiveViewRotation", null), __decorate([a()], w.prototype, "gridRotation", null), __decorate([a()], w.prototype, "gridCenter", null), __decorate([a()], w.prototype, "offsetScaleFactor", null), __decorate([a()], w.prototype, "spatialReference", null), __decorate([a()], w.prototype, "gridMetersPerStride", null), __decorate([a()], w.prototype, "viewMetersPerPixel", null), __decorate([a()], w.prototype, "viewMetersPerSRUnit", null), __decorate([a()], w.prototype, "pixelsPerStride", null), __decorate([a()], w.prototype, "updating", null), w = __decorate([c("esri.views.interactive.snapping.GridSnappingEngine")], w);
var P = (t, e, r, i) => {
	const n = f(t[0], t[1], t[2]);
	return Y$1(n, Y$1(n, n, r, e), r, i);
}, M = (t, e, r) => {
	const i = (t[0] - r[0]) / e, n = (t[1] - r[1]) / e, o = Math.trunc(i), s = Math.trunc(n), a = Math.round(i % 1), l$2 = Math.round(n % 1);
	return l(r[0] + (o + a) * e, r[1] + (s + l$2) * e);
}, R = (t, e, r, i, n) => {
	if (i <= 0) return {
		shouldSnapX: !1,
		shouldSnapY: !1
	};
	const o = (t[0] - e[0]) / i, s = (t[1] - e[1]) / i;
	return {
		shouldSnapX: Math.abs(o * n) < r,
		shouldSnapY: Math.abs(s * n) < r
	};
}, j = (t, e, r, i) => {
	if ("y" === i) {
		const i = e[0] > t[0] ? 1 : -1;
		return l(t[0] + r * i, t[1]);
	}
	const n = e[1] > t[1] ? 1 : -1;
	return l(t[0], t[1] + r * n);
};
//#endregion
export { w as GridSnappingEngine };

//# sourceMappingURL=GridSnappingEngine-exa4Truq.js.map