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
import { a as h, s as l } from "./reactiveUtils-DRpp6Nmg.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./mathUtils-hEBUcrMa.js";
import "./Clonable-D_RHUyXD.js";
import "./Polygon-CCBjbbXT.js";
import { s as m$1 } from "./curveUtils-CfkOAT4m.js";
import "./coordsUtils-DXLB9bAf.js";
import "./aaBoundingRect-CgUWvAgv.js";
import "./common-BxLRDsKd.js";
import "./vec2-BPF6SpMH.js";
import "./curveExtent--ue9-x0m.js";
import "./mat3-CPqND9LM.js";
import "./mat3f64-DZZP34-L.js";
import { t as y$1 } from "./Polyline-Cv0nwof6.js";
import "./vec3f64-CwISzc_v.js";
import "./Multipoint-B5Liskmz.js";
import "./spatialReferenceEllipsoidUtils-qNeWENaq.js";
import "./GeographicTransformation-D90zE-j2.js";
import "./geodesicConstants-C0TscDSm.js";
import "./projectBuffer-CV6RkXdH.js";
import "./projectionUtils-CmEsVWfk.js";
import "./Cyclical-BTNbmw1N.js";
import "./jsonUtils-D_oLUjKv.js";
import { i as f$1 } from "./typeUtils-DaICxhuY.js";
import "./Version-CjTddL5F.js";
import "./fieldType-D7SwLPxF.js";
import "./sql-Cyp7eZa9.js";
import "./Field-jzopk-Sr.js";
import "./Queue-CM8W5OTt.js";
import "./DynamicDataLayer-Nl0N-nbb.js";
import "./Query-aOayEcb1.js";
import "./QuantizationParameters-BoZFfmfD.js";
import "./StatisticDefinition-DCvGQn-e.js";
import "./lengthUtils-DrG-JkjU.js";
import "./unitConversionUtils-dsyJpUwL.js";
import "./utils-FTUHjE_7.js";
import "./UpdatingHandles-BpejPsAZ.js";
import "./InputManager-BkGXYhfV.js";
import "./signal-DCDIpEz3.js";
import "./PropertiesPool-0qj03Krs.js";
import "./keybindings-D58YhZPZ.js";
import "./vec2f64-BKe4utUH.js";
import "./vec3-BfQf1_cT.js";
import "./projectPointToVector-ChBhT6rD.js";
import "./projectVectorToVector-Du7qhzbU.js";
import "./elevationInfoUtils-BTAkLxlB.js";
import "./quantity-B4e5bEqI.js";
import "./normalizedPoint-BO8sGqAY.js";
import { n as f$2 } from "./snappingUtils-CnCuZcux.js";
import "./geodesicUtils-C7KxNiIf.js";
import "./angularMeasurementUtils-CdOKAwMf.js";
import { t as e } from "./types-Z-iStUHo.js";
import "./PluginBase-aHv44JPd.js";
import { PolylinePlugin as g$1 } from "./PolylinePlugin-CSUWIBtJ.js";
//#region node_modules/@arcgis/core/views/draw/plugins/PolygonPlugin.js
var u = 5, c = Symbol("polygon-snap-to-close-constraint"), m = Symbol("polygon-area-measurement"), g = Symbol("polygon-area-field");
var y = class extends g$1 {
	constructor() {
		super(...arguments), this._autoCloseLineVisualId = Symbol("polygon-auto-close-on-commit"), this._defaultClosingLineVisualId = Symbol("polygon-default-close-on-cancel"), this.clickToCloseEnabled = !0;
	}
	get _totalPreviewGeometry() {
		const { _session: t } = this;
		if (!t) return null;
		const e = t.lastPointAddedBySession?.partIndex, o = this._downstreamEditSession?.lastPointAddedBySession?.partIndex, n = e ?? o;
		if (!t || null == n) return null;
		const i = t?.getInformationAboutPoint(0, n), s = t?.getInformationAboutPoint(-1, n);
		return t?.generatePreviewGeometry({
			includeAutomaticConnection: !1,
			geometryType: "polygon",
			firstIncludedPoint: i,
			lastIncludedPoint: s
		});
	}
	get helpMessageKey() {
		const t = this._session?.lastPointAddedBySession;
		return t ? null != t.pointIndex && t.pointIndex > 0 ? "polygonTwoVertices" : "polygonOneVertex" : "polygonZeroVertices";
	}
	get test() {
		const { _autoCloseLineVisualId: t, _defaultClosingLineVisualId: e } = this;
		return {
			_autoCloseLineVisualId: t,
			_defaultClosingLineVisualId: e
		};
	}
	start(t) {
		super.start(t), t.createConstraint(c, (t, e) => this._snapToClosingVertex(t, e)), t.addOrUpdateVisual(this._autoCloseLineVisualId, {
			role: "outline",
			state: "active"
		}), t.addOrUpdateVisual(this._defaultClosingLineVisualId, {
			role: "outline",
			state: "idle"
		}), this.addHandles([l(() => this._downstreamEditSession?.lastPointAddedBySession, (t) => {
			if (!t || null == t.pointIndex) return this._context?.addOrUpdateVisual(this._autoCloseLineVisualId, { geometry: null }), void this._context?.addOrUpdateVisual(this._defaultClosingLineVisualId, { geometry: null });
			const e = this._session?.getInformationAboutPoint(t.pointIndex - 1, t.partIndex), o = this._session?.getInformationAboutPoint(0, t.partIndex);
			if (t.point && o?.point) {
				const e = [t.point.x, t.point.y], n = [o.point.x, o.point.y], i = new y$1({
					spatialReference: t.point.spatialReference,
					paths: [[e, n]]
				});
				this._context?.addOrUpdateVisual(this._autoCloseLineVisualId, { geometry: i });
			} else this._context?.addOrUpdateVisual(this._autoCloseLineVisualId, { geometry: null });
			if (e?.point && o?.point) {
				const t = [e.point.x, e.point.y], n = [o.point.x, o.point.y], i = new y$1({
					spatialReference: o.point.spatialReference,
					paths: [[t, n]]
				});
				this._context?.addOrUpdateVisual(this._defaultClosingLineVisualId, { geometry: i });
			} else this._context?.addOrUpdateVisual(this._defaultClosingLineVisualId, { geometry: null });
		}, h)], this._ownHandlesKey);
	}
	detachPlugin(t, e) {
		const { _session: o } = this, n = o?.lastPointAddedBySession;
		if (!n || null == n.pointIndex) return;
		"complete" === e && this._context?.setGlobalState("drawAtFixedElevation", !0);
		const i = o.getInformationAboutPoint(0, n.partIndex), s = o.getInformationAboutPoint(n.pointIndex - 1, n.partIndex), r = "2d" !== this._context?.getViewInformation()?.type;
		if ("complete" === e && this.clickToCloseEnabled && (n.pointIndex > 2 || 2 === n.pointIndex && n.curveInfo) && (f(i?.point, n.point, r) || f(s?.point, n.point, r))) !n.curveInfo && o?.eraseLastOperation(), this._context?.requestComplete();
		else "complete" === e && this._context?.requestBeginDownstreamPlugin(t.configuration, { cancelExisting: !1 });
	}
	afterUndoRedo() {
		const t = this._session?.lastPointAddedBySession;
		this._context?.setGlobalState("drawAtFixedElevation", !!t || void 0);
	}
	_getCommittedGeometry() {
		return this._session?.generatePreviewGeometry({
			includeAutomaticConnection: !1,
			geometryType: "polygon"
		});
	}
	_setupGeometrySpecificTooltip() {
		this._context && (this._areaField ??= this._context.createMeasuredField({
			id: g,
			preset: "area",
			getMeasurementInput: () => this._totalPreviewGeometry,
			measure: async (t, e) => {
				if (!t || !f$1(t)) return null;
				const o = m$1(t)?.at(-1);
				if (!o || o.length < 2 || !t.curveRings && o.length < 3) return null;
				const n = e.inputUnitInfos.area.unit;
				return this._context?.measureArea(t, m, "tooltip", n);
			},
			fieldProperties: {
				readOnly: !0,
				displayOrder: e.ShapeMeasurements
			}
		}));
	}
	_snapToClosingVertex(t, e) {
		const { _session: o } = this;
		if ("primary" !== e.handle.role || !o) return t;
		if (e.handle.dragging && "capture-when-engaged" === e.handle.captureMode) return t;
		if (!o?.sessionIsOperatingOnSameGeometry(e.editSession)) return t;
		const n = e.editSession?.lastPointAddedBySession;
		if (!n || null == n.pointIndex || n.pointIndex < 2) return t;
		const i = o.getInformationAboutPoint(0, n.partIndex);
		if (!t || !i?.point) return t;
		const s = e.toScreen(t);
		if (!s) return t;
		const r = e.toScreen(i.point);
		if (!r) return t;
		if (f$2(s, r) <= u) return i.point;
		const l = o.getInformationAboutPoint(n.pointIndex - 1, n.partIndex);
		if (!l?.point) return t;
		const a = e.toScreen(l.point);
		return a && f$2(s, a) <= u ? l.point : t;
	}
};
function f(t, e, o) {
	return t === e || null != t && null != e && t.x === e.x && t.y === e.y && (!o || t.z === e.z);
}
__decorate([a()], y.prototype, "_areaField", void 0), __decorate([a()], y.prototype, "_totalPreviewGeometry", null), __decorate([a()], y.prototype, "clickToCloseEnabled", void 0), __decorate([a()], y.prototype, "helpMessageKey", null), y = __decorate([c$1("esri.views.draw.plugins.PolygonPlugin")], y);
//#endregion
export { y as PolygonPlugin };

//# sourceMappingURL=PolygonPlugin-BC2hKCnw.js.map