import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n, t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { b as s, f as d, j as u } from "./promiseUtils-DhYhergm.js";
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
import { t as z } from "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import { s as l } from "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
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
import "./Version-CjTddL5F.js";
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import "./aaBoundingBox-CzeY9F8R.js";
import "./parser-DVDIh5bD.js";
import "./utils-FTUHjE_7.js";
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
import { t as o } from "./ExportWMSImageParameters-BdCq1A-E.js";
import "./libtess-DgzzZQ3y.js";
import "./EffectView-R15HeTXu.js";
import "./SimpleMesh-DcVi7r5f.js";
import "./WGLContainer-DIzgO6Ut.js";
import "./BufferObject-Bl5cyT6T.js";
import "./Program-CnLBrA2V.js";
import "./ShaderBuilder-C0sRkEfT.js";
import "./bitmapUtils-UmG5mSrd.js";
import "./Bitmap-dQ06olwE.js";
import { t as s$1 } from "./BitmapContainer--WvSIqlj.js";
import "./templateUtils-CEt6V42d.js";
import "./VertexArrayObject-CDnnpFXv.js";
import "./VertexBuffer-DseGkba_.js";
import { t as S } from "./LayerView2D-CjEvsXMB.js";
import { t as M } from "./ExportStrategy-TmuXBQDz.js";
import { t as I } from "./LayerView-BX1wZnFy.js";
import { t as i } from "./RefreshableLayerView-36iUmJ9V.js";
import { t as i$1 } from "./timeSupport-COlvgLeh.js";
//#region node_modules/@arcgis/core/views/layers/WMSLayerView.js
var m = (m) => {
	const n = m;
	let h = class extends n {
		initialize() {
			this.exportImageParameters = new o({ layer: this.layer });
		}
		destroy() {
			this.exportImageParameters = u(this.exportImageParameters);
		}
		get exportImageVersion() {
			return this.exportImageParameters?.commitProperty("version"), this.commitProperty("timeExtent"), (this._get("exportImageVersion") || 0) + 1;
		}
		get timeExtent() {
			return i$1(this.layer, this.view?.timeExtent, this._get("timeExtent"));
		}
		async fetchPopupFeaturesAtLocation(e, r$1) {
			const { layer: s$2 } = this;
			if (!e) throw new r("wmslayerview:fetchPopupFeatures", "Nothing to fetch without area", { layer: s$2 });
			const { popupEnabled: i } = s$2;
			if (!i) throw new r("wmslayerview:fetchPopupFeatures", "popupEnabled should be true", { popupEnabled: i });
			const a = this.createFetchPopupFeaturesQuery(e);
			if (!a) return [];
			const { extent: p, width: m, height: n, x: h, y: u } = a;
			if (!(p && m && n)) throw new r("wmslayerview:fetchPopupFeatures", "WMSLayer does not support fetching features.", {
				extent: p,
				width: m,
				height: n
			});
			const c = await s$2.fetchFeatureInfo(p, m, n, h, u);
			return s(r$1), c;
		}
	};
	return __decorate([a()], h.prototype, "exportImageParameters", void 0), __decorate([a({ readOnly: !0 })], h.prototype, "exportImageVersion", null), __decorate([a()], h.prototype, "layer", void 0), __decorate([a({ readOnly: !0 })], h.prototype, "timeExtent", null), h = __decorate([c("esri.views.layers.WMSLayerView")], h), h;
};
//#endregion
//#region node_modules/@arcgis/core/views/2d/layers/WMSLayerView2D.js
var g = class extends m(i(S(I))) {
	constructor() {
		super(...arguments), this.bitmapContainer = new s$1();
	}
	supportsSpatialReference(e) {
		return this.layer.serviceSupportsSpatialReference(e);
	}
	update(e) {
		this.strategy.update(e).catch((e) => {
			d(e) || n.getLogger(this).error(e);
		});
	}
	attach() {
		const { layer: e } = this, { imageMaxHeight: t, imageMaxWidth: r } = e;
		this.bitmapContainer = new s$1(), this.container.addChild(this.bitmapContainer), this.strategy = new M({
			container: this.bitmapContainer,
			fetchSource: this.fetchImage.bind(this),
			requestUpdate: this.requestUpdate.bind(this),
			imageMaxHeight: t,
			imageMaxWidth: r,
			imageRotationSupported: !1,
			imageNormalizationSupported: !1,
			hidpi: !1
		}), this.addAttachHandles(l(() => this.exportImageVersion, () => this.requestUpdate()));
	}
	detach() {
		this.strategy = u(this.strategy), this.container.removeAllChildren();
	}
	viewChange() {}
	moveEnd() {
		this.requestUpdate();
	}
	createFetchPopupFeaturesQuery(e) {
		const { view: t, bitmapContainer: r } = this, { x: i, y: a } = e, { spatialReference: s } = t;
		let o, m = 0, h = 0;
		if (r.children.some((e) => {
			const { width: t, height: r, resolution: p, x: c, y: d } = e, u = c + p * t, g = d - p * r;
			return i >= c && i <= u && a <= d && a >= g && (o = new z({
				xmin: c,
				ymin: g,
				xmax: u,
				ymax: d,
				spatialReference: s
			}), m = t, h = r, !0);
		}), !o) return null;
		const p = o.width / m, c = Math.round((i - o.xmin) / p), d = Math.round((o.ymax - a) / p);
		return {
			extent: o,
			width: m,
			height: h,
			x: c,
			y: d
		};
	}
	async doRefresh() {
		this.requestUpdate();
	}
	isUpdating() {
		return this.strategy.updating || this.updateRequested;
	}
	fetchImage(e, t, r, i) {
		return this.layer.fetchImageBitmap(e, t, r, {
			timeExtent: this.timeExtent,
			...i
		});
	}
};
__decorate([a()], g.prototype, "strategy", void 0), g = __decorate([c("esri.views.2d.layers.WMSLayerView2D")], g);
var y = g;
//#endregion
export { y as default };

//# sourceMappingURL=WMSLayerView2D-BANjXYxT.js.map