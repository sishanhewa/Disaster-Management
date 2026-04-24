import { n, t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { b as s, f as d } from "./promiseUtils-DhYhergm.js";
import { v as t } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./Evented-GLJbxWO5.js";
import "./SimpleObservable-CNlRjEs1.js";
import "./Collection-BAJSKCip.js";
import "./JSONSupport-BUaD4jSd.js";
import { o as w } from "./asyncUtils-D83Q647Q.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import { l as T$1 } from "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import "./messages-BSXJ_xjI.js";
import "./basemapDefinitions-CGK-Ctsz.js";
import "./reactiveUtils-DRpp6Nmg.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./colorUtils-BC0_8aMM.js";
import { y as r$1 } from "./mathUtils-hEBUcrMa.js";
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
import "./basemapUtils-C5xoGB-C.js";
import "./Cyclical-BTNbmw1N.js";
import "./jsonUtils-D_oLUjKv.js";
import "./typeUtils-DaICxhuY.js";
import "./utils-5irCjX9t.js";
import "./utils-Ch7GqCap.js";
import "./fieldType-D7SwLPxF.js";
import { r as n$1 } from "./guards-06ZwtKv3.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import "./aaBoundingBox-CzeY9F8R.js";
import "./Field-jzopk-Sr.js";
import "./NormalizationBinParametersMixin-BMz0fNea.js";
import "./MemCache-DQgW8nin.js";
import "./LRUCache-C0A4Jg0w.js";
import { t as _ } from "./FieldsIndex-FII40DPp.js";
import "./enum-D9ePJlKL.js";
import "./TimeOnly-DiAMH6GI.js";
import "./vec4-DVix-cmy.js";
import "./vec4f64-SXri5KT8.js";
import "./heatmapUtils-CKd_Sdiu.js";
import "./signal-DCDIpEz3.js";
import "./normalizeUtilsCommon-gtN1A7xM.js";
import "./normalizeUtils-BbPgVXXO.js";
import "./debugFlags-CzS8-qb6.js";
import "./Scheduler-PPZHCbsQ.js";
import "./memoryEstimations-BBFGLDPz.js";
import "./OptimizedGeometry-CNYohxaW.js";
import { a as H, s as J } from "./featureConversionUtils-BQ5ifpAj.js";
import "./WhereClause-CROVW3Le.js";
import "./closestPointOnCurve-DOaJ7IXx.js";
import "./WhereClauseCache-CbTZRh0W.js";
import "./PooledRBush-DcZxtmBy.js";
import "./generateRendererUtils-C-FDEpEz.js";
import "./utils-3D591xuo.js";
import "./BoundsStore-jvukvWYN.js";
import "./timeSupport-B81HKeWW.js";
import "./optimizedFeatureQueryEngineAdapter-Pxwx0I21.js";
import { t as f } from "./FeatureStore-CrZqyFKq.js";
import { t as W } from "./QueryEngine-Ccc05g61.js";
import { n as f$1, r as g } from "./projectionSupport-qG0SGMeB.js";
import "./utils-Dgqqelok.js";
import "./utils-nvlqepdT.js";
import "./queryUtils-CNTJGLMY.js";
import "./FixedIntervalBinParameters-CbmEfZTf.js";
import "./date-Dr7Yyuw6.js";
import { n as O, t as M } from "./geojson-DtGUaoDu.js";
import { r as d$1 } from "./sourceUtils-IJgEL_Ke.js";
import { a as ee, n as K, o as oe } from "./wfsUtils-BS6hrqt_.js";
//#region node_modules/@arcgis/core/layers/graphics/sources/WFSSourceWorker.js
var F = "esri.layers.WFSLayer";
var S = class {
	constructor() {
		this._customParameters = null, this._queryEngine = null, this._supportsPagination = !0;
	}
	destroy() {
		this._queryEngine?.destroy(), this._queryEngine = null;
	}
	async load(e, r$2 = {}) {
		const { getFeatureUrl: a, getFeatureOutputFormat: o, fields: n, geometryType: i, featureType: u, maxRecordCount: l, maxTotalRecordCount: m, maxPageCount: d, objectIdField: g, customParameters: f$2 } = e, { spatialReference: _$1, getFeatureSpatialReference: x } = oe(a, u, e.spatialReference);
		try {
			await f$1(x, _$1);
		} catch {
			throw new r("unsupported-projection", "Projection not supported", {
				inSpatialReference: x,
				outSpatialReference: _$1
			});
		}
		s(r$2), this._customParameters = f$2, this._featureType = u, this._fieldsIndex = _.fromLayerJSON({
			fields: n,
			dateFieldsTimeReference: n.some((e) => "esriFieldTypeDate" === e.type) ? { timeZoneIANA: "UTC" } : null
		}), this._geometryType = i, this._getFeatureUrl = a, this._getFeatureOutputFormat = o, this._getFeatureSpatialReference = x, this._maxRecordCount = l, this._maxTotalRecordCount = m, this._maxPageCount = d, this._objectIdField = g, this._spatialReference = _$1;
		let w = await this._snapshotFeatures(r$2);
		if (w.errors.length > 0 && (this._supportsPagination = !1, w = await this._snapshotFeatures(r$2), w.errors.length > 0)) throw w.errors[0];
		const F = {
			type: "object-id",
			fieldName: g
		};
		return this._queryEngine = new W({
			fieldsIndex: this._fieldsIndex,
			geometryType: i,
			hasM: !1,
			hasZ: !1,
			featureIdInfo: F,
			spatialReference: _$1,
			timeInfo: null,
			featureStore: new f({
				geometryType: i,
				hasM: !1,
				hasZ: !1
			})
		}), this._queryEngine.featureStore.addMany(w.features), {
			warnings: E(w),
			extent: (await this._queryEngine.fetchRecomputedExtents()).fullExtent
		};
	}
	async applyEdits() {
		throw new r("wfs-source:editing-not-supported", "applyEdits() is not supported on WFSLayer");
	}
	async queryFeatures(e = {}, t = {}) {
		return await this._waitSnapshotComplete(), this._queryEngine.executeQuery(e, t.signal);
	}
	async queryFeatureCount(e = {}, t = {}) {
		return await this._waitSnapshotComplete(), this._queryEngine.executeQueryForCount(e, t.signal);
	}
	async queryObjectIds(e = {}, t = {}) {
		await this._waitSnapshotComplete();
		return (await this._queryEngine.executeQueryForIds(e, t.signal)).filter(n$1);
	}
	async queryExtent(e = {}, t = {}) {
		return await this._waitSnapshotComplete(), this._queryEngine.executeQueryForExtent(e, t.signal);
	}
	async querySnapping(e, t = {}) {
		return await this._waitSnapshotComplete(), await this._queryEngine.executeQueryForSnapping(e, t.signal);
	}
	async queryAttributeBins(e, t = {}) {
		return await this._waitSnapshotComplete(), this._queryEngine.executeAttributeBinsQuery(e, t.signal);
	}
	async refresh(t$2) {
		return this._customParameters = t$2.customParameters, this._maxRecordCount = t$2.maxRecordCount, this._maxTotalRecordCount = t$2.maxTotalRecordCount, this._maxPageCount = t$2.maxPageCount, this._snapshotTask?.abort(), this._snapshotTask = w((e) => this._snapshotFeatures({ signal: e })), this._snapshotTask.promise.then((e) => {
			this._queryEngine.featureStore.clear(), this._queryEngine.featureStore.addMany(e.features);
			for (const t$1 of E(e)) n.getLogger(F).warn(new t("wfs-layer:refresh-warning", t$1.message, t$1.details));
			e.errors?.length && n.getLogger(F).warn(new t("wfs-layer:refresh-error", "Refresh completed with errors", { errors: e.errors }));
		}, () => {
			this._queryEngine.featureStore.clear();
		}), await this._waitSnapshotComplete(), { extent: (await this._queryEngine.fetchRecomputedExtents()).fullExtent };
	}
	async _waitSnapshotComplete() {
		if (this._snapshotTask && !this._snapshotTask.finished) {
			try {
				await this._snapshotTask.promise;
			} catch {}
			return this._waitSnapshotComplete();
		}
	}
	async _snapshotFeatures(e) {
		const t = e?.signal, r = this._maxTotalRecordCount, n = this._maxPageCount, i = this._supportsPagination && n > 1 ? await ee(this._getFeatureUrl, this._featureType.typeName, {
			customParameters: this._customParameters,
			signal: t
		}) : void 0;
		let u = [];
		const l = [];
		if (null == i) try {
			u = await this._singleQuery(t);
		} catch (c) {
			d(c) || l.push(c);
		}
		else {
			const s = T(this, r$1(Math.ceil(Math.min(i, r) / this._maxRecordCount), 1, n), t);
			await Promise.allSettled(Array.from({ length: 10 }).map(() => j(s, u, l)));
		}
		return s(t), {
			features: u,
			totalRecordCount: i,
			maxTotalRecordCount: r,
			maxPageCount: n,
			errors: l
		};
	}
	async _singleQuery(e) {
		const t = Number.isFinite(this._maxRecordCount) && this._maxRecordCount > 0 ? this._maxRecordCount : void 0, r = await K(this._getFeatureUrl, this._featureType.typeName, this._getFeatureSpatialReference, this._getFeatureOutputFormat, {
			customParameters: this._customParameters,
			count: t,
			signal: e
		});
		return this._processGeoJSON(r, { signal: e });
	}
	async _pageQuery(e, t) {
		const r = e * this._maxRecordCount, a = await K(this._getFeatureUrl, this._featureType.typeName, this._getFeatureSpatialReference, this._getFeatureOutputFormat, {
			customParameters: this._customParameters,
			startIndex: r,
			count: this._maxRecordCount,
			signal: t
		});
		return this._processGeoJSON(a, {
			startIndex: r,
			signal: t
		});
	}
	_processGeoJSON(e, t) {
		M(e, this._getFeatureSpatialReference.wkid);
		const { startIndex: r, signal: a } = t;
		s(a);
		const o = O(e, {
			geometryType: this._geometryType,
			hasZ: !1,
			objectIdField: this._objectIdField
		});
		if (!T$1(this._spatialReference, this._getFeatureSpatialReference)) for (const s of o) null != s.geometry && (s.geometry = H(g(J(s.geometry, this._geometryType, !1, !1), this._getFeatureSpatialReference, this._spatialReference)));
		let n = r ?? 1;
		for (const s of o) {
			const e = {};
			d$1(this._fieldsIndex, e, s.attributes, !0), s.attributes = e, e[this._objectIdField] ?? (s.objectId = e[this._objectIdField] = n++);
		}
		return o;
	}
};
function* T(e, t, r) {
	for (let a = 0; a < t; a++) yield e._pageQuery(a, r);
}
async function j(e, t, r) {
	let a = e.next();
	for (; !a.done;) {
		try {
			const e = await a.value;
			t.push(...e);
		} catch (s) {
			d(s) || r.push(s);
		}
		a = e.next();
	}
}
function E(e) {
	const t = [];
	return null != e.totalRecordCount && (e.features.length < e.totalRecordCount && t.push({
		name: "wfs-layer:maxRecordCount-too-low",
		message: `Could only fetch ${e.features.length} of ${e.totalRecordCount} in ${e.maxPageCount} queries. Try increasing the value of WFSLayer.maxRecordCount.`,
		details: {
			recordCount: e.features.length,
			totalRecordCount: e.totalRecordCount
		}
	}), e.totalRecordCount > e.maxTotalRecordCount && t.push({
		name: "wfs-layer:large-dataset",
		message: `The number of ${e.totalRecordCount} features exceeds the maximum allowed of ${e.maxTotalRecordCount}.`,
		details: {
			recordCount: e.features.length,
			totalRecordCount: e.totalRecordCount,
			maxTotalRecordCount: e.maxTotalRecordCount
		}
	})), t;
}
//#endregion
export { S as default };

//# sourceMappingURL=WFSSourceWorker-aWaka84Y.js.map