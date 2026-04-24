import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { b as s, y as p } from "./promiseUtils-DhYhergm.js";
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
import "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import { a as h, r as a$1, s as l } from "./reactiveUtils-DRpp6Nmg.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
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
import "./geodesicConstants-C0TscDSm.js";
import "./mat4-CCf33Vjt.js";
import "./jsonUtils-D_oLUjKv.js";
import "./typeUtils-DaICxhuY.js";
import "./Version-CjTddL5F.js";
import "./fieldType-D7SwLPxF.js";
import { a as o } from "./sql-Cyp7eZa9.js";
import "./mat4f64-BA1Qbgtv.js";
import "./Field-jzopk-Sr.js";
import "./Queue-CM8W5OTt.js";
import "./DynamicDataLayer-Nl0N-nbb.js";
import "./Query-aOayEcb1.js";
import "./QuantizationParameters-BoZFfmfD.js";
import "./StatisticDefinition-DCvGQn-e.js";
import "./lengthUtils-DrG-JkjU.js";
import "./unitConversionUtils-dsyJpUwL.js";
import "./MemCache-DQgW8nin.js";
import "./LRUCache-C0A4Jg0w.js";
import "./vec4-DVix-cmy.js";
import "./vec4f64-SXri5KT8.js";
import "./utils-FTUHjE_7.js";
import "./InputManager-BkGXYhfV.js";
import "./signal-DCDIpEz3.js";
import "./PropertiesPool-0qj03Krs.js";
import "./keybindings-D58YhZPZ.js";
import "./vec2f64-BKe4utUH.js";
import "./vec3-BfQf1_cT.js";
import "./closestPointOnCurve-DOaJ7IXx.js";
import "./quatf64-3OZfmMeM.js";
import "./plane-3RNaG9XX.js";
import "./vectorStacks-DmZ-Tu4f.js";
import "./mathUtils-BlzSoZZn.js";
import { t } from "./memoize-DLOtk-R8.js";
import { a as P } from "./elevationInfoUtils-BTAkLxlB.js";
import "./ray-B_6ooVQr.js";
import "./normalizedPoint-BO8sGqAY.js";
import { i as h$1 } from "./snappingUtils-CnCuZcux.js";
import "./geodesicUtils-C7KxNiIf.js";
import "./vec3-ByKKGMhe.js";
import "./sphere-C0hnJWBV.js";
import "./geometry2dUtils-DhdtAgRB.js";
import "./constraints-CM2adGn6.js";
import "./EdgeSnappingCandidate-Cx5wFroy.js";
import "./LineSnappingHint-DqpwvriX.js";
import "./DrapedEdgeSnappingCandidate-DfvPGzMI.js";
import "./CurveSnappingHint-BbGo5Abf.js";
import "./PointSnappingHint-nUf3LF77.js";
import "./VertexSnappingCandidate-BYL6n2-J.js";
import { n as s$1, t as p$1 } from "./queryEngineUtils-B4cGc08d.js";
import { n as r$1, r, t as o$1 } from "./symbologySnappingCandidates-CJiWCl9T.js";
//#region node_modules/@arcgis/core/views/interactive/snapping/featureSources/FeatureCollectionSnappingSource.js
var f = class extends b {
	get availability() {
		return 1;
	}
	get _snappingElevationAligner() {
		const { view: e } = this, { layer: t } = this.layerSource, i = null != e && "3d" === e.type;
		if (!i || "subtype-group" === t.type) return r();
		const n = async (i, n) => (await p(e.whenLayerView(t), n)).elevationAlignPointsInFeatures(i, n);
		return r(i, {
			elevationInfo: t.elevationInfo,
			alignPointsInFeatures: n
		});
	}
	get _snappingElevationFilter() {
		const { view: e } = this;
		return r$1(null != e && "3d" === e.type && "subtype-group" !== this.layerSource.layer.type);
	}
	get _symbologySnappingFetcher() {
		const { view: e } = this, { layer: t } = this.layerSource;
		return null != e && "3d" === e.type && "subtype-group" !== t.type ? o$1(this._symbologySnappingSupported, async (i, r) => {
			const o = await e.whenLayerView(t);
			return s(r), o.queryForSymbologySnapping({
				candidates: i,
				spatialReference: e.spatialReference
			}, r);
		}) : o$1();
	}
	get _layerView() {
		const { view: e } = this;
		if (null == e) return null;
		const { layer: t } = this.layerSource;
		return e.allLayerViews.find((e) => e.layer === t);
	}
	get _layerView3D() {
		const { view: e } = this;
		return null == e || "2d" === e.type ? null : this._layerView;
	}
	get _symbologySnappingSupported() {
		return null != this._layerView3D && this._layerView3D.symbologySnappingSupported;
	}
	initialize() {
		const { view: e } = this, { layer: t } = this.layerSource;
		null != e && "3d" === e.type && "subtype-group" !== t.type && this.addHandles([
			e.elevationProvider.on("elevation-change", ({ context: e }) => {
				const { elevationInfo: i } = t;
				P(e, i) && this._snappingElevationAligner.notifyElevationSourceChange();
			}),
			l(() => t.elevationInfo, () => this._snappingElevationAligner.notifyElevationSourceChange(), h),
			l(() => null != this._layerView3D ? this._layerView3D.layer?.renderer : null, () => this._symbologySnappingFetcher.notifySymbologyChange(), h),
			a$1(() => this._layerView3D?.layer, ["edits", "apply-edits"], () => this._symbologySnappingFetcher.notifySymbologyChange())
		]);
	}
	constructor(e) {
		super(e), this.view = null, this.updating = !1, this._memoizedMakeGetGroundElevation = t(p$1);
	}
	refresh() {}
	async fetchCandidates(e, t) {
		const { layer: i } = this.layerSource, { source: r } = i;
		if (!r?.querySnapping) return [];
		const o$2 = i.createQuery();
		this._layerView && "effectiveDisplayFilter" in this._layerView && (o$2.where = o(o$2.where, this._layerView.effectiveDisplayFilter?.where));
		const l = h$1({
			parameters: e,
			returnZ: !("returnZ" in i && !1 === i.returnZ),
			filter: o$2
		}), p = await r.querySnapping(l, { signal: t });
		s(t);
		const y = e.coordinateHelper.spatialReference, u = await this._snappingElevationAligner.alignCandidates(p.candidates, y, t);
		s(t);
		const g = await this._symbologySnappingFetcher.fetch(u, t);
		s(t);
		const m = 0 === g.length ? u : [...u, ...g], d = this._snappingElevationFilter.filter(l, m), v = this._memoizedMakeGetGroundElevation(this.view, y);
		return d.map((t) => s$1(t, e.mode, v));
	}
};
__decorate([a({ constructOnly: !0 })], f.prototype, "layerSource", void 0), __decorate([a({ constructOnly: !0 })], f.prototype, "view", void 0), __decorate([a()], f.prototype, "_snappingElevationAligner", null), __decorate([a()], f.prototype, "_snappingElevationFilter", null), __decorate([a()], f.prototype, "_symbologySnappingFetcher", null), __decorate([a()], f.prototype, "_layerView", null), __decorate([a()], f.prototype, "_layerView3D", null), __decorate([a()], f.prototype, "_symbologySnappingSupported", null), f = __decorate([c("esri.views.interactive.snapping.featureSources.FeatureCollectionSnappingSource")], f);
//#endregion
export { f as FeatureCollectionSnappingSource };

//# sourceMappingURL=FeatureCollectionSnappingSource-CRbM36Bs.js.map