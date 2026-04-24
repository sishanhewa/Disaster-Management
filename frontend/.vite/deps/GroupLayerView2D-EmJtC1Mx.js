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
import { t as q } from "./Collection-BAJSKCip.js";
import { n, t as e } from "./collectionUtils-DQeMhtWS.js";
import "./JSONSupport-BUaD4jSd.js";
import "./Promise-Dhhz7kXA.js";
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
import { n as U, s as l } from "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import "./Color-C99QAF80.js";
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
import "./jsonUtils-D_oLUjKv.js";
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import "./aaBoundingBox-CzeY9F8R.js";
import "./parser-DVDIh5bD.js";
import "./UpdatingHandles-BpejPsAZ.js";
import "./ReactiveMap-B1BORGbU.js";
import "./HighlightDefaults-DfD2NwU0.js";
import "./util-xsku_21L.js";
import "./attributionUtils-CJyTR4iW.js";
import "./vec2f64-BKe4utUH.js";
import "./definitions-BxssUXCo.js";
import "./Texture-BT3QsBTF.js";
import "./enums-DUaXkkTm.js";
import "./memoryEstimations-BBFGLDPz.js";
import "./OptimizedGeometry-CNYohxaW.js";
import "./featureConversionUtils-BQ5ifpAj.js";
import "./layerViewUtils-OGP0XFvp.js";
import "./projectionSupport-qG0SGMeB.js";
import "./libtess-DgzzZQ3y.js";
import "./EffectView-R15HeTXu.js";
import "./SimpleMesh-DcVi7r5f.js";
import "./BufferObject-Bl5cyT6T.js";
import "./Program-CnLBrA2V.js";
import "./templateUtils-CEt6V42d.js";
import "./VertexArrayObject-CDnnpFXv.js";
import "./VertexBuffer-DseGkba_.js";
import { t as S } from "./LayerView2D-CjEvsXMB.js";
import { t as I } from "./LayerView-BX1wZnFy.js";
//#region node_modules/@arcgis/core/views/layers/GroupLayerView.js
var h = class extends I {
	constructor(i) {
		super(i), this.type = "group", this.layerViews = new q();
	}
	destroy() {
		this.layerViews.removeAll();
	}
	_allLayerViewVisibility(i) {
		this.layerViews.forEach((e) => {
			e.visible = i;
		});
	}
	initialize() {
		this.addHandles([
			this.layerViews.on("change", (i) => this._layerViewsChangeHandler(i)),
			l(() => this.layer?.visibilityMode, () => {
				this.layer && this._applyVisibility(() => this._allLayerViewVisibility(this.visible), () => this._applyExclusiveVisibility(null));
			}, U),
			l(() => this.visible, (i) => {
				this._applyVisibility(() => this._allLayerViewVisibility(i), () => {});
			}, U)
		], "grouplayerview"), this._layerViewsChangeHandler({
			target: null,
			added: this.layerViews.toArray(),
			removed: [],
			moved: []
		});
	}
	get creatingLayerViews() {
		return this.view?.layerViewManager?.isCreatingLayerViewsForLayer(this.layer) ?? !1;
	}
	set layerViews(i) {
		this._set("layerViews", n(i, this._get("layerViews")));
	}
	get updatingProgress() {
		return 0 === this.layerViews.length ? 1 : this.layerViews.reduce((i, e) => i + e.updatingProgress, 0) / this.layerViews.length;
	}
	isUpdating() {
		return this.creatingLayerViews || this.layerViews.some((i) => i.updating);
	}
	_hasLayerViewVisibleOverrides() {
		return this.layerViews.some((i) => i._isOverridden("visible"));
	}
	_findLayerViewForLayer(i) {
		return i && this.layerViews.find((e) => e.layer === i);
	}
	_firstVisibleOnLayerOrder() {
		const i = this.layer.layers.find((i) => {
			return !!this._findLayerViewForLayer(i)?.visible;
		});
		return i && this._findLayerViewForLayer(i);
	}
	_applyExclusiveVisibility(i) {
		null == i && null == (i = this._firstVisibleOnLayerOrder()) && this.layerViews.length > 0 && (i = this._findLayerViewForLayer(this.layer.layers.at(0))), this.layerViews.forEach((e) => {
			e.visible = e === i;
		});
	}
	_layerViewsChangeHandler(i) {
		this.removeHandles("grouplayerview:visible"), this.addHandles(this.layerViews.map((i) => l(() => i.visible, (e) => this._applyVisibility(() => {
			e !== this.visible && (i.visible = this.visible);
		}, () => this._applyExclusiveVisibility(e ? i : null)), U)).toArray(), "grouplayerview:visible");
		const e = i.added[i.added.length - 1];
		this._applyVisibility(() => this._allLayerViewVisibility(this.visible), () => this._applyExclusiveVisibility(e?.visible ? e : null));
	}
	_applyVisibility(i, e) {
		this._hasLayerViewVisibleOverrides() && ("inherited" === this.layer?.visibilityMode ? i() : "exclusive" === this.layer?.visibilityMode && e());
	}
};
__decorate([a({ readOnly: !0 })], h.prototype, "creatingLayerViews", null), __decorate([a({ cast: e })], h.prototype, "layerViews", null), __decorate([a({ readOnly: !0 })], h.prototype, "updatingProgress", null), __decorate([a()], h.prototype, "view", void 0), h = __decorate([c("esri.views.layers.GroupLayerView")], h);
//#endregion
//#region node_modules/@arcgis/core/views/2d/layers/GroupLayerView2D.js
var i = class extends S(h) {
	attach() {
		this._updateStageChildren(), this.addAttachHandles(this.layerViews.on("after-changes", () => this._updateStageChildren()));
	}
	detach() {
		this.container.removeAllChildren();
	}
	update(e) {}
	viewChange() {}
	moveEnd() {}
	_updateStageChildren() {
		this.container.removeAllChildren(), this.layerViews.forEach((e, t) => this.container.addChildAt(e.container, t));
	}
};
i = __decorate([c("esri.views.2d.layers.GroupLayerView2D")], i);
var s = i;
//#endregion
export { s as default };

//# sourceMappingURL=GroupLayerView2D-EmJtC1Mx.js.map