import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import "./decorators-DE7S5xmd.js";
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
import "./Loadable-CQsALnOO.js";
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
import "./locale-BdrQIP_a.js";
import "./Portal-DYysvbhZ.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import "./messages-BSXJ_xjI.js";
import "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import "./Color-C99QAF80.js";
import "./opacityUtils-DgEZ8x-q.js";
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
import { i as l } from "./Polyline-Cv0nwof6.js";
import "./vec3f64-CwISzc_v.js";
import "./Multipoint-B5Liskmz.js";
import "./jsonUtils-D_oLUjKv.js";
import "./typeUtils-DaICxhuY.js";
import "./fieldType-D7SwLPxF.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./PopupTemplate-8SH37QID.js";
import "./fieldFormatUtils-R1ptUFq7.js";
import "./ActionToggle-JH4srUd2.js";
import "./Graphic-D2G0Ykqt.js";
import "./SimpleMarkerSymbol-BjFFaoyw.js";
import "./typeUtils-DZkmoi8p.js";
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import "./aaBoundingBox-CzeY9F8R.js";
import "./symbolLayerUtils3D-BQRyZskR.js";
import "./textUtils-B4iTDAON.js";
import "./TextSymbol-CsSnkPMD.js";
import "./SimpleFillSymbol-CbXKKnxp.js";
import "./PictureMarkerSymbol-Crs5VdSs.js";
import "./Field-jzopk-Sr.js";
import "./Queue-CM8W5OTt.js";
import "./workers-BjS-6PTj.js";
import "./number-DwLpDjta.js";
import "./intl-1FbLkipu.js";
import "./FieldsIndex-FII40DPp.js";
import { o as n } from "./enum-D9ePJlKL.js";
import { n as n$1 } from "./TimeOnly-DiAMH6GI.js";
import { n as t } from "./arcadeEnvironment-LORej3OB.js";
import { A as U, W as ge, Y as oe, _ as Je, o as B } from "./deepClone-Cw0Dfuaj.js";
import "./shared-BrEWD0Qh.js";
import "./number-D09FUQhc.js";
import "./Dictionary-D2UlVih4.js";
import "./Feature-738WIX4c.js";
import "./memoryEstimations-BBFGLDPz.js";
import "./OptimizedGeometry-CNYohxaW.js";
import "./featureConversionUtils-BQ5ifpAj.js";
import "./WhereClause-CROVW3Le.js";
import { t as a } from "./operatorsWorkerConnection-C89jKvFg.js";
import { C as s, S as r, i as w } from "./FeatureSet-D7cizSOF.js";
import { t as a$1 } from "./Empty-Cn99qu4Z.js";
//#region node_modules/@arcgis/core/arcade/featureset/actions/SpatialFilter.js
var o = class extends w {
	constructor(t) {
		super(), this.declaredClass = "esri.arcade.featureset.actions.SpatialFilter", this._maxProcessing = 40, this._parent = t.parentfeatureset, this._relation = t.relation, this._relationString = t.relationString ?? "", this._relationGeom = t.relationGeom;
	}
	get _spatialFilter() {
		return {
			relation: "esriSpatialRelRelation" !== this._relation ? this._relation : `esriSpatialRelRelation:${this._relationString}`,
			geometry: this._relationGeom
		};
	}
	async _queryAll() {
		return (await this.query({ abortSignal: t })).features;
	}
	async query(t) {
		await this._ensureLoaded();
		const e = await this._parent.query({
			...t,
			spatialFilter: this._spatialFilter
		});
		return s(t.abortSignal), {
			...e,
			spatialFilterApplied: null == t.spatialFilter,
			features: e.spatialFilterApplied ? e.features : this._applySpatialFilter(e.features, t.abortSignal)
		};
	}
	async *_applySpatialFilter(t, e) {
		for await (const a of t) {
			s(e);
			const t = [];
			for (const e of a) await this._executeSpatialRelationTest(e) && t.push(e);
			t.length > 0 && (yield t);
		}
	}
	async queryStat(t) {
		if (null != t.spatialFilter) return { calculated: !1 };
		const e = await this._parent.queryStat({
			...t,
			spatialFilter: this._spatialFilter
		});
		return e.calculated ? e : null == t.where && null == t.spatialFilter ? this._manualStat(t.stat, t.field, t.limit ?? 1e3, t.abortSignal) : { calculated: !1 };
	}
	async canQueryAggregate(t) {
		return null == t.spatialFilter && this._parent.canQueryAggregate({
			...t,
			spatialFilter: this._spatialFilter
		});
	}
	async queryAggregate(t) {
		if (null != t.spatialFilter) throw new r("NeverReach");
		return this._parent.queryAggregate({
			...t,
			spatialFilter: this._spatialFilter
		});
	}
	async _executeSpatialRelationTest(t) {
		if (null == t.geometry) return !1;
		switch (this._relation) {
			case "esriSpatialRelEnvelopeIntersects": {
				const r = n$1(this._relationGeom), a$3 = l(t.geometry);
				return null != r && null != a$3 && a("intersects", [r.toJSON(), a$3]);
			}
			case "esriSpatialRelIntersects": return a("intersects", [this._relationGeom.toJSON(), t.geometry]);
			case "esriSpatialRelContains": return a("contains", [this._relationGeom.toJSON(), t.geometry]);
			case "esriSpatialRelOverlaps": return a("overlaps", [this._relationGeom.toJSON(), t.geometry]);
			case "esriSpatialRelWithin": return a("within", [this._relationGeom.toJSON(), t.geometry]);
			case "esriSpatialRelTouches": return a("touches", [this._relationGeom.toJSON(), t.geometry]);
			case "esriSpatialRelCrosses": return a("crosses", [this._relationGeom.toJSON(), t.geometry]);
			case "esriSpatialRelRelation": return a("relate", [
				this._relationGeom.toJSON(),
				t.geometry,
				this._relationString
			]);
			default: return this._relation, !1;
		}
	}
	getFieldsIndex() {
		return this._parent.getFieldsIndex();
	}
};
//#endregion
//#region node_modules/@arcgis/core/arcade/functions/featuresetgeom.js
function c(a$2) {
	return async (c, f, p) => {
		if (oe(p, 2, 2, c, f), null === (p = Je(p))[0] && null === p[1]) return !1;
		if (B(p[0])) {
			if (U(p[1])) return new o({
				parentfeatureset: p[0],
				relation: a$2,
				relationGeom: p[1]
			});
			if (null === p[1]) return new a$1({ parentfeatureset: p[0] });
			throw new n(c, "InvalidParameter", f);
		}
		if (U(p[0])) {
			if (U(p[1])) {
				switch (a$2) {
					case "esriSpatialRelEnvelopeIntersects": {
						const e = n$1(p[0]), n = n$1(p[1]);
						return null != e && null != n && a("intersects", [e.toJSON(), n.toJSON()]);
					}
					case "esriSpatialRelIntersects": return a("intersects", [p[0].toJSON(), p[1].toJSON()]);
					case "esriSpatialRelContains": return a("contains", [p[0].toJSON(), p[1].toJSON()]);
					case "esriSpatialRelOverlaps": return a("overlaps", [p[0].toJSON(), p[1].toJSON()]);
					case "esriSpatialRelWithin": return a("within", [p[0].toJSON(), p[1].toJSON()]);
					case "esriSpatialRelTouches": return a("touches", [p[0].toJSON(), p[1].toJSON()]);
					case "esriSpatialRelCrosses": return a("crosses", [p[0].toJSON(), p[1].toJSON()]);
				}
				throw new n(c, "InvalidParameter", f);
			}
			if (B(p[1])) return new o({
				parentfeatureset: p[1],
				relation: a$2,
				relationGeom: p[0]
			});
			if (null === p[1]) return !1;
			throw new n(c, "InvalidParameter", f);
		}
		if (null === p[0]) {
			if (B(p[1])) return new a$1({ parentfeatureset: p[1] });
			if (U(p[1]) || null === p[1]) return !1;
		}
		throw new n(c, "InvalidParameter", f);
	};
}
function f(t) {
	"async" === t.mode && (t.functions.intersects = function(e, n) {
		return t.standardFunctionAsync(e, n, c("esriSpatialRelIntersects"));
	}, t.functions.envelopeintersects = function(e, n) {
		return t.standardFunctionAsync(e, n, c("esriSpatialRelEnvelopeIntersects"));
	}, t.signatures.push({
		name: "envelopeintersects",
		min: 2,
		max: 2
	}), t.functions.contains = function(e, n) {
		return t.standardFunctionAsync(e, n, c("esriSpatialRelContains"));
	}, t.functions.overlaps = function(e, n) {
		return t.standardFunctionAsync(e, n, c("esriSpatialRelOverlaps"));
	}, t.functions.within = function(e, n) {
		return t.standardFunctionAsync(e, n, c("esriSpatialRelWithin"));
	}, t.functions.touches = function(e, n) {
		return t.standardFunctionAsync(e, n, c("esriSpatialRelTouches"));
	}, t.functions.crosses = function(e, n) {
		return t.standardFunctionAsync(e, n, c("esriSpatialRelCrosses"));
	}, t.functions.relate = function(c, f) {
		return t.standardFunctionAsync(c, f, async (t, p, S) => {
			if (S = Je(S), oe(S, 3, 3, c, f), U(S[0]) && U(S[1])) return a("relate", [
				S[0].toJSON(),
				S[1].toJSON(),
				ge(S[2])
			]);
			if (U(S[0]) && null === S[1]) return !1;
			if (U(S[1]) && null === S[0]) return !1;
			if (B(S[0]) && null === S[1]) return new a$1({ parentfeatureset: S[0] });
			if (B(S[1]) && null === S[0]) return new a$1({ parentfeatureset: S[1] });
			if (B(S[0]) && U(S[1])) return new o({
				parentfeatureset: S[0],
				relation: "esriSpatialRelRelation",
				relationGeom: S[1],
				relationString: ge(S[2])
			});
			if (B(S[1]) && U(S[0])) return new o({
				parentfeatureset: S[1],
				relation: "esriSpatialRelRelation",
				relationGeom: S[0],
				relationString: ge(S[2])
			});
			if (null === S[0] && null === S[1]) return !1;
			throw new n(c, "InvalidParameter", f);
		});
	});
}
//#endregion
export { f as registerFunctions };

//# sourceMappingURL=featuresetgeom-BY_1-6JB.js.map