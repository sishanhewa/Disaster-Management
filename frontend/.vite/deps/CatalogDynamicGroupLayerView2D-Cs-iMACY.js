import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { C as y, L as e, U as t, o as L } from "./promiseUtils-DhYhergm.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./Evented-GLJbxWO5.js";
import "./SimpleObservable-CNlRjEs1.js";
import { t as q } from "./Collection-BAJSKCip.js";
import "./collectionUtils-DQeMhtWS.js";
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
import "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
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
import { a as o$1, n as T } from "./sql-Cyp7eZa9.js";
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
//#region node_modules/@arcgis/core/views/layers/CatalogDynamicGroupLayerView.js
var u = Symbol();
var m = class extends I {
	constructor() {
		super(...arguments), this.layerViews = new q(), this._debouncedUpdate = L(async () => {
			const { layer: e, parent: r } = this, t = r?.footprintLayerView;
			let i = [];
			const s = this._createQuery();
			if (s && t) {
				const { features: r } = await t.queryFeatures(s);
				this.suspended || (i = r.map((r) => e.acquireLayer(r)));
			}
			this.removeHandles(u), this.addHandles(i, u);
		});
	}
	get creatingLayerViews() {
		return this.view?.layerViewManager.isCreatingLayerViewsForLayer(this.layer) ?? !1;
	}
	isUpdating() {
		return this.creatingLayerViews || this.layer.updating || this.layerViews.some((e) => e.updating);
	}
	enableLayerUpdates() {
		return t([
			this._updatingHandles.addWhen(() => !1 === this.parent?.footprintLayerView?.dataUpdating, () => this.updateLayers()),
			this._updatingHandles.add(() => [
				this.layer.maximumVisibleSublayers,
				this.layer.parent?.orderBy,
				this.parent?.footprintLayerView?.filter,
				this.parent?.footprintLayerView?.timeExtent,
				this.suspended
			], () => this.updateLayers()),
			e(() => this.removeHandles(u))
		]);
	}
	updateLayers() {
		this.suspended ? this.removeHandles(u) : this._updatingHandles.addPromise(y(this._debouncedUpdate()).catch((e) => {
			n.getLogger(this).error(e);
		}));
	}
	_createQuery() {
		const e = this.parent?.footprintLayerView, r = this.layer?.parent;
		if (!e || !r || r.destroyed) return null;
		const { layer: { maximumVisibleSublayers: t }, view: { scale: i } } = this;
		if (!t) return null;
		const { itemTypeField: s, itemSourceField: a, itemNameField: o, minScaleField: l, maxScaleField: p, objectIdField: y, orderBy: u } = r, m = o$1(`${l} IS NULL OR ${i} <= ${l} OR ${l} = 0`, `${p} IS NULL OR ${i} >= ${p}`), h = u?.find((e) => e.field && !e.valueExpression), c = e.createQuery();
		return c.returnGeometry = !1, c.num = t, c.outFields = [
			y,
			a,
			o
		], c.where = o$1(c.where, m), null != this.unsupportedItemTypes && (c.where = o$1(c.where, T(s, this.unsupportedItemTypes))), h?.field && (c.orderByFields = [`${h.field} ${"descending" === h.order ? "DESC" : "ASC"}`], c.outFields.push(h.field)), c;
	}
};
__decorate([a({ readOnly: !0 })], m.prototype, "creatingLayerViews", null), __decorate([a()], m.prototype, "layer", void 0), __decorate([a()], m.prototype, "layerViews", void 0), __decorate([a({ readOnly: !0 })], m.prototype, "unsupportedItemTypes", void 0), __decorate([a()], m.prototype, "parent", void 0), __decorate([a({ readOnly: !0 })], m.prototype, "isUpdating", null), m = __decorate([c("esri.views.layers.CatalogDynamicGroupLayerView")], m);
//#endregion
//#region node_modules/@arcgis/core/views/2d/layers/CatalogDynamicGroupLayerView2D.js
var i = class extends S(m) {
	constructor() {
		super(...arguments), this.unsupportedItemTypes = ["Scene Service"], this.layerViews = new q();
	}
	attach() {
		this.addAttachHandles([this.layerViews.on("after-changes", () => this._updateStageChildren()), this.enableLayerUpdates()]);
	}
	detach() {
		this.container.removeAllChildren();
	}
	update(e) {
		this.updateLayers();
	}
	viewChange() {}
	moveEnd() {
		this.requestUpdate();
	}
	_updateStageChildren() {
		this.container.removeAllChildren(), this.layerViews.forEach((e, t) => this.container.addChildAt(e.container, t));
	}
};
i = __decorate([c("esri.views.2d.layers.CatalogDynamicGroupLayerView2D")], i);
var o = i;
//#endregion
export { o as default };

//# sourceMappingURL=CatalogDynamicGroupLayerView2D-Cs-iMACY.js.map