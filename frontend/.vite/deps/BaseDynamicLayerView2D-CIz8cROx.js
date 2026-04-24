import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { f as d$1 } from "./promiseUtils-DhYhergm.js";
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
import "./TileInfo-Dm0DlKvz.js";
import "./TileKey-DNAwECdW.js";
import "./UpdatingHandles-BpejPsAZ.js";
import "./ReactiveMap-B1BORGbU.js";
import "./HighlightDefaults-DfD2NwU0.js";
import "./util-xsku_21L.js";
import "./attributionUtils-CJyTR4iW.js";
import "./vec2f64-BKe4utUH.js";
import "./vec2f32-D_bzcz_y.js";
import "./TileKey-CWP4O_FK.js";
import "./TileInfoView-BxjD5r_v.js";
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
import "./WGLContainer-DIzgO6Ut.js";
import "./BufferObject-Bl5cyT6T.js";
import "./Program-CnLBrA2V.js";
import "./ShaderBuilder-C0sRkEfT.js";
import "./bitmapUtils-UmG5mSrd.js";
import "./Bitmap-dQ06olwE.js";
import { t as s } from "./BitmapContainer--WvSIqlj.js";
import "./templateUtils-CEt6V42d.js";
import "./VertexArrayObject-CDnnpFXv.js";
import "./VertexBuffer-DseGkba_.js";
import { t as S } from "./LayerView2D-CjEvsXMB.js";
import { t as M } from "./ExportStrategy-TmuXBQDz.js";
import { t as I } from "./LayerView-BX1wZnFy.js";
import { t as i } from "./RefreshableLayerView-36iUmJ9V.js";
//#region node_modules/@arcgis/core/views/2d/layers/BaseDynamicLayerView2D.js
var m = class extends i(S(I)) {
	update(t) {
		this._strategy.update(t).catch((t) => {
			d$1(t) || n.getLogger(this).error(t);
		}), this.notifyChange("updating");
	}
	attach() {
		this._bitmapContainer = new s(), this.container.addChild(this._bitmapContainer), this._strategy = new M({
			container: this._bitmapContainer,
			fetchSource: this.fetchBitmapData.bind(this),
			requestUpdate: this.requestUpdate.bind(this)
		});
	}
	detach() {
		this._strategy.destroy(), this._strategy = null, this.container.removeChild(this._bitmapContainer), this._bitmapContainer.removeAllChildren();
	}
	viewChange() {}
	moveEnd() {
		this.requestUpdate();
	}
	fetchBitmapData(t, e, r) {
		return this.layer.fetchImageBitmap(t, e, r);
	}
	async doRefresh() {
		this.requestUpdate();
	}
	isUpdating() {
		return this._strategy.updating || this.updateRequested;
	}
};
__decorate([a()], m.prototype, "_strategy", void 0), m = __decorate([c("esri.views.2d.layers.BaseDynamicLayerView2D")], m);
var d = m;
//#endregion
export { d as default };

//# sourceMappingURL=BaseDynamicLayerView2D-CIz8cROx.js.map