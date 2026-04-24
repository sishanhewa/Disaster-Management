import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n, t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { b as p } from "./request-CuG5cxow.js";
import { p as f } from "./promiseUtils-DhYhergm.js";
import { a as o, n as c, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./Evented-GLJbxWO5.js";
import "./SimpleObservable-CNlRjEs1.js";
import "./Collection-BAJSKCip.js";
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
import "./PortalItem-BaGmB6Wg.js";
import "./messages-BSXJ_xjI.js";
import "./layerUtils-sQ-3wxAB.js";
import { n as U$1, r as a$1 } from "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import { t as b } from "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./catalogUtils-lRNSLCIB.js";
import "./mathUtils-hEBUcrMa.js";
import "./opacityUtils-DgEZ8x-q.js";
import { n as l } from "./Clonable-D_RHUyXD.js";
import "./uuid-CI605U6Y.js";
import "./MD5-CvSXL3W6.js";
import "./resourceExtension-G73S3iT3.js";
import { t as j } from "./persistable-D3uxCw6O.js";
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
import { t as e } from "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import "./portalItemUtils-CDCH3kjA.js";
import "./jsonContext-r8n8WiRi.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./layerContainerType-ZF61P2__.js";
import "./Queue-CM8W5OTt.js";
import "./workers-BjS-6PTj.js";
import "./number-DwLpDjta.js";
import "./intl-1FbLkipu.js";
import "./workers-Nrqav2LG.js";
import { t as s } from "./APIKeyMixin-CpWoJvp9.js";
import { t as l$1 } from "./ArcGISService-BFbH4hVT.js";
import { t as s$1 } from "./CustomParametersMixin-CvFUyY3s.js";
import "./HeightModelInfo-CaK_zgTy.js";
import "./ElevationInfo-Bsg5AqQw.js";
import "./lengthUtils-DrG-JkjU.js";
import "./unitConversionUtils-dsyJpUwL.js";
import { l as m } from "./commonProperties-DQjThAJZ.js";
import "./multiLayerServiceUtils-DCT7dTXz.js";
import { t as g } from "./OperationalLayer-CaAaD2Zf.js";
import { t as _ } from "./PortalLayer-B3x-_Tp7.js";
import { t as l$2 } from "./ScaleRangeLayer-CIL5S5vZ.js";
import "./projectPointToVector-ChBhT6rD.js";
import { n as _$1 } from "./SceneService-wPVsGs7B.js";
import { i as y, n as m$1, r as p$1, t as a$2 } from "./I3SLayerDefinitions-D6Ym3Mro.js";
import "./projectVectorToVector-Du7qhzbU.js";
import "./resourceUtils-CBs8pUFo.js";
import "./resourceUtils-BbY7Q9V8.js";
import "./saveUtils-C8XCaiJv.js";
import { o as R, p as j$1, y as w } from "./elevationInfoUtils-BTAkLxlB.js";
import "./WorkerHandle-9hUSbPch.js";
import "./Lyr3DWorker-9XUANr8_.js";
import "./SceneLayerWorkerHandle-HkfPaEul.js";
import { t as p$2 } from "./SceneModifications-CQus78h5.js";
//#region node_modules/@arcgis/core/layers/IntegratedMeshLayer.js
var P = class extends _$1(l$1(g(_(l$2(e(s$1(s(l(b))))))))) {
	constructor(...e) {
		super(...e), this.geometryType = "mesh", this.operationalLayerType = "IntegratedMeshLayer", this.type = "integrated-mesh", this.nodePages = null, this.materialDefinitions = null, this.textureSetDefinitions = null, this.geometryDefinitions = null, this.serviceUpdateTimeStamp = null, this.profile = "mesh-pyramids", this.modifications = null, this.path = null, this.definitionExpression = null;
	}
	initialize() {
		this.addHandles(a$1(() => this.modifications, "after-changes", () => this.modifications = this.modifications, U$1));
	}
	normalizeCtorArgs(e, t) {
		return "string" == typeof e ? {
			url: e,
			...t
		} : e;
	}
	readModifications(e, t, o) {
		this._modificationsSource = {
			url: p(e, o),
			context: o
		};
	}
	set elevationInfo(e) {
		null != e && "absolute-height" !== e.mode || this._set("elevationInfo", e), this._validateElevationInfo(e);
	}
	async load(e) {
		return this.addResolvingPromise(this._doLoad(e)), this;
	}
	async _doLoad(e) {
		const t = e?.signal;
		try {
			await this.loadFromPortal({ supportedTypes: ["Scene Service"] }, e);
		} catch (o) {
			f(o);
		}
		if (await this._fetchService(t), null != this._modificationsSource) {
			const t = await p$2.fromUrl(this._modificationsSource.url, this.spatialReference, e);
			this.setAtOrigin("modifications", t, this._modificationsSource.context.origin), this._modificationsSource = null;
		}
		await this._fetchIndexAndUpdateExtent(this.nodePages, t);
	}
	beforeSave() {
		if (null != this._modificationsSource) return this.load().then(() => {}, () => {});
	}
	async saveAs(e, t) {
		return this._debouncedSaveOperations(1, {
			...t,
			getTypeKeywords: () => this._getTypeKeywords(),
			portalItemLayerType: "integrated-mesh"
		}, e);
	}
	async save() {
		return this._debouncedSaveOperations(0, {
			getTypeKeywords: () => this._getTypeKeywords(),
			portalItemLayerType: "integrated-mesh"
		});
	}
	validateLayer(e) {
		if (e.layerType && "IntegratedMesh" !== e.layerType) throw new r("integrated-mesh-layer:layer-type-not-supported", "IntegratedMeshLayer does not support this layer type", { layerType: e.layerType });
		if (isNaN(this.version.major) || isNaN(this.version.minor)) throw new r("layer:service-version-not-supported", "Service version is not supported.", {
			serviceVersion: this.version.versionString,
			supportedVersions: "1.x"
		});
		if (this.version.major > 1) throw new r("layer:service-version-too-new", "Service version is too new.", {
			serviceVersion: this.version.versionString,
			supportedVersions: "1.x"
		});
	}
	_getTypeKeywords() {
		return ["IntegratedMeshLayer"];
	}
	_validateElevationInfo(e) {
		const t = "Integrated mesh layers";
		j$1(n.getLogger(this), w(t, "absolute-height", e)), j$1(n.getLogger(this), R(t, e));
	}
};
__decorate([a({
	type: String,
	readOnly: !0
})], P.prototype, "geometryType", void 0), __decorate([a({ type: ["show", "hide"] })], P.prototype, "listMode", void 0), __decorate([a({ type: ["IntegratedMeshLayer"] })], P.prototype, "operationalLayerType", void 0), __decorate([a({
	json: { read: !1 },
	readOnly: !0
})], P.prototype, "type", void 0), __decorate([a({
	type: p$1,
	readOnly: !0,
	clonable: !1
})], P.prototype, "nodePages", void 0), __decorate([a({
	type: [a$2],
	readOnly: !0,
	clonable: !1
})], P.prototype, "materialDefinitions", void 0), __decorate([a({
	type: [y],
	readOnly: !0,
	clonable: !1
})], P.prototype, "textureSetDefinitions", void 0), __decorate([a({
	type: [m$1],
	readOnly: !0,
	clonable: !1
})], P.prototype, "geometryDefinitions", void 0), __decorate([a({ readOnly: !0 })], P.prototype, "serviceUpdateTimeStamp", void 0), __decorate([a({
	type: p$2,
	clonable: (e) => e?.clone() ?? e
}), j({
	origins: ["web-scene", "portal-item"],
	type: "resource",
	prefix: "modifications"
})], P.prototype, "modifications", void 0), __decorate([o(["web-scene", "portal-item"], "modifications")], P.prototype, "readModifications", null), __decorate([a(m)], P.prototype, "elevationInfo", null), __decorate([a({
	type: String,
	json: {
		origins: {
			"web-scene": {
				read: !0,
				write: !0
			},
			"portal-item": {
				read: !0,
				write: !0
			}
		},
		read: !1
	}
})], P.prototype, "path", void 0), P = __decorate([c("esri.layers.IntegratedMeshLayer")], P);
var U = P;
//#endregion
export { U as default };

//# sourceMappingURL=IntegratedMeshLayer-pX-QozOa.js.map