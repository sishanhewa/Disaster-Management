import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c, t as a$1 } from "./decorators-DE7S5xmd.js";
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
//#region node_modules/@arcgis/core/views/layers/CatalogLayerView.js
var a = class extends I {
	constructor() {
		super(...arguments), this.layerViews = new q();
	}
	get dynamicGroupLayerView() {
		return this.layerViews.find((r) => r.layer === this.layer?.dynamicGroupLayer);
	}
	get footprintLayerView() {
		return this.layerViews.find((r) => r.layer === this.layer?.footprintLayer);
	}
	isUpdating() {
		return !this.dynamicGroupLayerView || !this.footprintLayerView || this.dynamicGroupLayerView.updating || this.footprintLayerView.updating;
	}
};
__decorate([a$1()], a.prototype, "layer", void 0), __decorate([a$1()], a.prototype, "layerViews", void 0), __decorate([a$1({ readOnly: !0 })], a.prototype, "dynamicGroupLayerView", null), __decorate([a$1({ readOnly: !0 })], a.prototype, "footprintLayerView", null), a = __decorate([c("esri.views.layers.CatalogLayerView")], a);
//#endregion
//#region node_modules/@arcgis/core/views/2d/layers/CatalogLayerView2D.js
var s = class extends S(a) {
	constructor() {
		super(...arguments), this.layerViews = new q();
	}
	update(e) {}
	viewChange() {}
	moveEnd() {}
	attach() {
		this.addAttachHandles([this._updatingHandles.addOnCollectionChange(() => this.layerViews, () => this._updateStageChildren(), { initial: !0 })]);
	}
	detach() {
		this.container.removeAllChildren();
	}
	_updateStageChildren() {
		this.container.removeAllChildren(), this.layerViews.forEach((e, t) => this.container.addChildAt(e.container, t));
	}
};
__decorate([a$1()], s.prototype, "layerViews", void 0), s = __decorate([c("esri.views.2d.layers.CatalogLayerView2D")], s);
var l = s;
//#endregion
export { l as default };

//# sourceMappingURL=CatalogLayerView2D-DsHCxBDz.js.map