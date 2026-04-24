import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { f as d } from "./promiseUtils-DhYhergm.js";
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
import { l as T } from "./spatialReferenceUtils-b3vCEkpS.js";
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
import "./Queue-CM8W5OTt.js";
import "./parser-DVDIh5bD.js";
import "./UpdatingHandles-BpejPsAZ.js";
import "./signal-DCDIpEz3.js";
import "./ReactiveMap-B1BORGbU.js";
import "./HighlightDefaults-DfD2NwU0.js";
import "./util-xsku_21L.js";
import "./attributionUtils-CJyTR4iW.js";
import "./vec2f64-BKe4utUH.js";
import "./mat2d-BuUJVbP4.js";
import "./mat2df32-D4Q05fSu.js";
import "./vec2f32-D_bzcz_y.js";
import "./debugFlags-CzS8-qb6.js";
import { r as p } from "./Scheduler-PPZHCbsQ.js";
import "./vec3-BfQf1_cT.js";
import { t as e } from "./TileKey-CWP4O_FK.js";
import { t as h } from "./TileInfoView-BxjD5r_v.js";
import "./ScheduledQueueProcessor-CgHEIqY6.js";
import { n as a$1, t as r } from "./TileStrategy-2ufKPmL7.js";
import "./definitions-BxssUXCo.js";
import "./Texture-BT3QsBTF.js";
import "./enums-DUaXkkTm.js";
import "./memoryEstimations-BBFGLDPz.js";
import "./OptimizedGeometry-CNYohxaW.js";
import "./featureConversionUtils-BQ5ifpAj.js";
import "./layerViewUtils-OGP0XFvp.js";
import "./projectionSupport-qG0SGMeB.js";
import "./utils-DtAoCWzC.js";
import "./BoundingBox-wqZcYwRQ.js";
import "./libtess-DgzzZQ3y.js";
import "./EffectView-R15HeTXu.js";
import "./SimpleMesh-DcVi7r5f.js";
import "./WGLContainer-DIzgO6Ut.js";
import "./BufferObject-Bl5cyT6T.js";
import "./Program-CnLBrA2V.js";
import "./ShaderBuilder-C0sRkEfT.js";
import "./bitmapUtils-UmG5mSrd.js";
import "./Bitmap-dQ06olwE.js";
import "./templateUtils-CEt6V42d.js";
import "./VertexArrayObject-CDnnpFXv.js";
import "./VertexBuffer-DseGkba_.js";
import { t as S } from "./LayerView2D-CjEvsXMB.js";
import { t as I } from "./LayerView-BX1wZnFy.js";
import { t as i } from "./RefreshableLayerView-36iUmJ9V.js";
import "./TileInfoPrograms-DBJ0RhGd.js";
import "./TileContainer-CdJy5pum.js";
import "./ProgramTemplate-CITOdnzo.js";
import "./vec3f32-Dwn0TfP2.js";
import "./dataViewUtils-D2k9_zlf.js";
import { r as r$1, t as n$1 } from "./imageUtils-CIcmQZ-Z.js";
//#region node_modules/@arcgis/core/views/2d/layers/WMTSLayerView2D.js
var y = [0, 0];
var _ = class extends i(r$1(S(I))) {
	constructor() {
		super(...arguments), this._tileStrategy = null, this._fetchQueue = null, this.layer = null;
	}
	get tileMatrixSet() {
		const { activeLayer: e } = this.layer, { tileMatrixSet: t } = e;
		if (t && T(t.tileInfo?.spatialReference, this.view.spatialReference)) return t;
		const i = this._getTileMatrixSetBySpatialReference(e);
		return i && i.id !== e.tileMatrixSetId ? (e.tileMatrixSetId = i.id, i) : null;
	}
	update(e) {
		this._fetchQueue.pause(), this._fetchQueue.state = e.state, this._tileStrategy.update(e), this._fetchQueue.resume();
	}
	attach() {
		const e = this.tileMatrixSet?.tileInfo;
		e && (this._tileInfoView = new h(e), this._fetchQueue = new a$1({
			tileInfoView: this._tileInfoView,
			concurrency: 16,
			process: (e, t) => this.fetchTile(e, t),
			scheduler: this.scheduler,
			priority: p.MAPVIEW_FETCH_QUEUE
		}), this._tileStrategy = new r({
			cachePolicy: "keep",
			resampling: !0,
			acquireTile: (e) => this.acquireTile(e),
			releaseTile: (e) => this.releaseTile(e),
			tileInfoView: this._tileInfoView
		}), this.addAttachHandles(this._updatingHandles.add(() => [this.layer?.activeLayer?.styleId, this.tileMatrixSet], () => this.doRefresh())), super.attach());
	}
	detach() {
		super.detach(), this._tileStrategy?.destroy(), this._fetchQueue?.destroy(), this._fetchQueue = this._tileStrategy = this._tileInfoView = null;
	}
	viewChange() {
		this.requestUpdate();
	}
	moveEnd() {
		this.requestUpdate();
	}
	supportsSpatialReference(e) {
		return this.layer.activeLayer.tileMatrixSets?.some((t) => T(t.tileInfo?.spatialReference, e)) ?? !1;
	}
	async doRefresh() {
		if (this.attached) {
			if (this.suspended) return this._tileStrategy.clear(), void this.requestUpdate();
			this._fetchQueue.reset(), this._tileStrategy.refresh((e) => this._updatingHandles.addPromise(this._enqueueTileFetch(e)));
		}
	}
	acquireTile(e) {
		const t = this._bitmapView.createTile(e), i = t.bitmap;
		return [i.x, i.y] = this._tileInfoView.getTileCoords(y, t.key), i.resolution = this._tileInfoView.getTileResolution(t.key), [i.width, i.height] = this._tileInfoView.size, this._updatingHandles.addPromise(this._enqueueTileFetch(t)), this._bitmapView.addChild(t), this.requestUpdate(), t;
	}
	releaseTile(e) {
		this._fetchQueue.abort(e.key.id), this._bitmapView.removeChild(e), e.once("detach", () => e.destroy()), this.requestUpdate();
	}
	async fetchTile(e$1, t = {}) {
		const s = "tilemapCache" in this.layer ? this.layer.tilemapCache : null, { signal: r, resamplingLevel: a = 0 } = t;
		if (!s) return this._fetchImage(e$1, r);
		const l = new e(0, 0, 0, 0);
		let h;
		try {
			await s.fetchAvailabilityUpsample(e$1.level, e$1.row, e$1.col, l, { signal: r }), h = await this._fetchImage(l, r);
		} catch (n) {
			if (d(n)) throw n;
			if (a < 3) {
				const i = this._tileInfoView.getTileParentId(e$1.id);
				if (i) {
					const s = new e(i), r = await this.fetchTile(s, {
						...t,
						resamplingLevel: a + 1
					});
					return n$1(this._tileInfoView, r, s, e$1);
				}
			}
			throw n;
		}
		return n$1(this._tileInfoView, h, l, e$1);
	}
	canResume() {
		const e = super.canResume();
		return e ? null !== this.tileMatrixSet : e;
	}
	async _enqueueTileFetch(e) {
		if (!this._fetchQueue.has(e.key.id)) {
			try {
				const t = await this._fetchQueue.push(e.key);
				e.bitmap.source = t, e.bitmap.width = this._tileInfoView.size[0], e.bitmap.height = this._tileInfoView.size[1], e.once("attach", () => this.requestUpdate());
			} catch (s) {
				d(s) || n.getLogger(this).error(s);
			}
			this.requestUpdate();
		}
	}
	async _fetchImage(e, t) {
		return this.layer.fetchImageBitmapTile(e.level, e.row, e.col, { signal: t });
	}
	_getTileMatrixSetBySpatialReference(e) {
		return e.tileMatrixSets?.find((e) => T(e.tileInfo?.spatialReference, this.view.spatialReference));
	}
};
__decorate([a({ readOnly: !0 })], _.prototype, "tileMatrixSet", null), _ = __decorate([c("esri.views.2d.layers.WMTSLayerView2D")], _);
var w = _;
//#endregion
export { w as default };

//# sourceMappingURL=WMTSLayerView2D-CPfyKCZu.js.map