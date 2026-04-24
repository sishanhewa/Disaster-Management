import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c$1, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
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
import { c as w, n as U, s as l } from "./reactiveUtils-DRpp6Nmg.js";
import "./mathUtils-hEBUcrMa.js";
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
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import "./aaBoundingBox-CzeY9F8R.js";
import "./vec4-DVix-cmy.js";
import "./UpdatingHandles-BpejPsAZ.js";
import "./mat2d-BuUJVbP4.js";
import "./mat2df64-CT-3vBrt.js";
import "./vec3-BfQf1_cT.js";
import "./memoryEstimations-BBFGLDPz.js";
import "./OptimizedGeometry-CNYohxaW.js";
import "./Point2D-ClM_Ex8K.js";
import "./Envelope2D-DJ4EmFgu.js";
import "./MultiPathImpl-Cj23glYA.js";
import "./Transformation2D-B4vBHALJ.js";
import "./SpatialReference-CPSvOeFQ.js";
import "./jsonConverter-C7YfydKv.js";
import "./FlatGeometry-LfXCi8BW.js";
import "./FlatGeometry-D0n_NdSI.js";
import "./apiConverter-BiH9EVj2.js";
import "./Distance2DCalculator-CXhBP-8I-CrzDQed3.js";
import "./distanceOperator-Bi4Ncvf4.js";
import "./operatorSimplify-BARY2itK.js";
import "./simplifyOperator-us-aevmd.js";
import "./quatf64-3OZfmMeM.js";
import "./quat-Bz1zxyz4.js";
import "./geodesicUtils-C7KxNiIf.js";
import { i as b, o as k, r as U$1, s as v$1 } from "./createUtils-BMFDInm4.js";
import "./surfaceCoordinateSystems-C7dGnTuu.js";
import { t as e } from "./types-Z-iStUHo.js";
import { t as n } from "./PluginBase-aHv44JPd.js";
//#region node_modules/@arcgis/core/views/draw/plugins/ShapePlugin.js
var u = Symbol("own-shape"), c = Symbol("shape-area-measurement"), m = Symbol("shape-size-measurement-x"), f = Symbol("shape-size-measurement-y"), y = Symbol("shape-area-field"), g = Symbol("shape-x-size-field"), _ = Symbol("shape-y-size-field"), S = Symbol("shape-radius-field");
var v = class extends n {
	constructor() {
		super(...arguments), this.shapeType = "rectangle", this.defaultCentered = !1, this.defaultUniform = !1;
	}
	get _globalModifierState() {
		return this._context?.getGlobalState();
	}
	get helpMessageKey() {
		return this._interactiveHandle?.dragging ? "shapeEndHybrid" : "shapeStartHybrid";
	}
	get effectiveUniform() {
		return this.defaultUniform !== !!this._globalModifierState?.preserveAspectRatio;
	}
	get effectiveCentered() {
		return this.defaultCentered !== this._globalModifierState?.centered;
	}
	set shapeResult(e) {
		this._set("shapeResult", e), e ? "center" in e ? (this._radiusField?.show(), this._xSizeField?.hide(), this._ySizeField?.hide(), this._areaField?.show()) : "midpoints" in e && e.midpoints && (this._radiusField?.hide(), this._xSizeField?.show(), this._ySizeField?.show(), this._areaField?.show()) : (this._xSizeField?.hide(), this._ySizeField?.hide(), this._radiusField?.hide(), this._areaField?.hide());
		const t = e?.geometry, i = this._session;
		if (i && t) {
			const s = (t.curveRings ?? t.rings)?.at(0);
			s && i.appendOrReplacePart(u, s);
		}
	}
	start(e$1) {
		super.start(e$1), this._interactiveHandle ??= e$1.createInteractiveHandle({
			defaultCaptureMode: "capture-when-engaged",
			selfSnappingEnabled: !1
		}, { disableDefaultXYFields: !0 }), this.addHandles([l(() => [
			this._interactiveHandle?.outputMapPosition,
			this.effectiveCentered,
			this.effectiveUniform
		], ([e, t, i]) => {
			if (!e || this._isComplete) return;
			const s = this._interactiveHandle?.outputMapPositionOfDragStart ?? e, r = s === e ? null : e;
			this.shapeResult = this._generateShape(s, r, t, i);
		}, w), l(() => this._interactiveHandle?.dragging, (t, i) => {
			t && e$1.setGlobalState("drawAtFixedElevation", !0), !t && i && "grabbable-object" !== this._interactiveHandle?.captureMode && e$1.requestComplete();
		}, U)], this._ownHandlesKey), this._areaField ??= this._context?.createMeasuredField({
			id: y,
			preset: "area",
			getMeasurementInput: () => this.shapeResult?.geometry,
			measure: async (e, t) => {
				if (!e) return null;
				const i = t.inputUnitInfos.area.unit;
				return this._context?.measureArea(e, c, "tooltip", i);
			},
			fieldProperties: { displayOrder: e.ShapeMeasurements }
		});
		const r = Symbol("Size-group");
		this._xSizeField ??= this._context?.createMeasuredField({
			id: g,
			preset: "generic-length",
			getMeasurementInput: () => this.shapeResult,
			measure: async (e, t) => e && "midpoints" in e && e.midpoints ? this._context?.measureDistance([e.midpoints?.left, e.midpoints?.right], m, "tooltip", t.inputUnitInfos.length.unit) : null,
			fieldProperties: {
				displayOrder: e.Middle + 1,
				displayGroup: r,
				title: (e) => e.messages.sketch.size,
				readOnly: !0
			}
		}), this._ySizeField ??= this._context?.createMeasuredField({
			id: _,
			preset: "generic-length",
			getMeasurementInput: () => this.shapeResult,
			measure: async (e, t) => e && "midpoints" in e && e.midpoints ? this._context?.measureDistance([e.midpoints?.bottom, e.midpoints?.top], f, "tooltip", t.inputUnitInfos.length.unit) : null,
			fieldProperties: {
				displayOrder: e.Middle + 2,
				displayGroup: r,
				title: (e) => e.messages.sketch.size,
				readOnly: !0
			}
		}), this._radiusField ??= this._context?.createMeasuredField({
			id: S,
			preset: "radius",
			getMeasurementInput: () => this.shapeResult,
			measure: async (e, t) => {
				if (e && "center" in e && null != e.center) return this._context?.measureDistance([e.center, e.edge], f, "tooltip", t.inputUnitInfos.length.unit);
			},
			fieldProperties: {
				displayOrder: e.Middle + 1,
				readOnly: !0
			}
		});
	}
	_generateShape(e, t, i, s) {
		const { shapeType: r } = this, { resolution: a } = this._context?.getViewInformation() ?? {}, n = this._context?.getViewAlignedSurfaceCoordinateSystem(e);
		if (!n || null == a) return null;
		const h = [e.x, e.y], u = t && [t.x, t.y];
		if (!u) {
			const e = [
				[h, n.makeMapPoint(h[0] + 48 * a, h[1])],
				n,
				!0
			];
			return "rectangle" === r ? b(...e) : v$1(...e, void 0);
		}
		const c = [
			[h, u],
			n,
			i
		];
		return s ? "circle" === r ? v$1(...c, void 0) : b(...c) : "circle" === r ? k(...c) : U$1(...c);
	}
};
__decorate([a()], v.prototype, "_interactiveHandle", void 0), __decorate([a()], v.prototype, "_areaField", void 0), __decorate([a()], v.prototype, "_xSizeField", void 0), __decorate([a()], v.prototype, "_ySizeField", void 0), __decorate([a()], v.prototype, "_radiusField", void 0), __decorate([a()], v.prototype, "_globalModifierState", null), __decorate([a()], v.prototype, "shapeType", void 0), __decorate([a()], v.prototype, "defaultCentered", void 0), __decorate([a()], v.prototype, "defaultUniform", void 0), __decorate([a()], v.prototype, "helpMessageKey", null), __decorate([a()], v.prototype, "effectiveUniform", null), __decorate([a()], v.prototype, "effectiveCentered", null), __decorate([a()], v.prototype, "shapeResult", null), v = __decorate([c$1("esri.views.draw.plugins.ShapePlugin")], v);
//#endregion
export { v as ShapePlugin };

//# sourceMappingURL=ShapePlugin-C-2WU4AK.js.map