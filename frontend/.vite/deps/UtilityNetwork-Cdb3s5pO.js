import { n as __exportAll } from "./chunk-BoAXSpZd.js";
import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as n$1, t as r } from "./Error-CzxduO2m.js";
import { j as c$2 } from "./typedArrayUtil-BAuNmygZ.js";
import { V as I$1, f as m$2, t as f$2 } from "./request-CuG5cxow.js";
import { f as d$2, x as u$1 } from "./promiseUtils-DhYhergm.js";
import { t as e } from "./MapUtils-CBkGGs30.js";
import { n as c$3, o as r$1, t as a$1 } from "./decorators-DE7S5xmd.js";
import { t as b } from "./Accessor-kDoDKy4v.js";
import { n as n$2, t as a$2 } from "./JSONSupport-BUaD4jSd.js";
import { r as u$2 } from "./Loadable-CQsALnOO.js";
import { n as o, t as i$2 } from "./jsonMap-CFSDFmi6.js";
import { t as S$2 } from "./SpatialReference-rIfb2LrD.js";
import { t as z } from "./Extent-CquIzaXp.js";
import { n as k$1 } from "./PortalItem-BaGmB6Wg.js";
import { S as o$1, m as b$1 } from "./layerUtils-sQ-3wxAB.js";
import { s as l$2 } from "./reactiveUtils-DRpp6Nmg.js";
import { n as n$3 } from "./uuid-CI605U6Y.js";
import { n as u$3 } from "./jsonUtils-D_oLUjKv.js";
import { t as e$1 } from "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import { a as o$2, i as d$3, o as p$1 } from "./sql-Cyp7eZa9.js";
import { t as j } from "./Graphic-D2G0Ykqt.js";
import { n as t } from "./graphicInstanceUtils-BPC5HWFt.js";
import { t as Ye } from "./FeatureLayer-D8WKTQ9s.js";
import { a as t$1, n as i$3, t as c$4 } from "./versionManagementUtils-DdkGBUES.js";
import { a as l$3, i as h, n as c$5, r as g } from "./EditBusLayer-BrMVPiuf.js";
import { t as R } from "./Query-aOayEcb1.js";
import { t as r$2 } from "./featureQueryAll-BuWv8PcT.js";
import { t as i$4 } from "./ValidateNetworkTopologyResult-zrzK2gHd.js";
import { c as s$2, r as d$4 } from "./typeUtils-CFnTDMtU.js";
import { t as c$6 } from "./NamedTraceConfiguration-CnGSAvYn.js";
import { n as t$2 } from "./networkFieldUtils-CvN2K9lH.js";
import { t as s$3 } from "./TelecomNetworkElement-CK1MxXNb.js";
import { t as d$5 } from "./TraceResult-DRxRVEMl.js";
//#region node_modules/@arcgis/core/networks/support/TopologyValidationJobInfo.js
var l$1 = i$2()({
	Pending: "job-waiting",
	InProgress: "job-executing",
	Completed: "job-succeeded"
});
var d$1 = class extends i$4 {
	constructor(t) {
		super(t), this.statusUrl = null, this.status = null, this.submissionTime = null, this.lastUpdatedTime = null, this._timer = void 0;
	}
	destroy() {
		clearInterval(this._timer);
	}
	async checkJobStatus(t) {
		const s = {
			...t,
			query: { f: "json" }
		}, { data: r } = await f$2(this.statusUrl, s);
		return this.read(r), this.editsResolver && this.editsResolver.resolve({
			edits: null,
			addedFeatures: [],
			updatedFeatures: [],
			deletedFeatures: [],
			addedAttachments: [],
			updatedAttachments: [],
			deletedAttachments: [],
			exceededTransferLimit: !0,
			historicMoment: null
		}), this;
	}
	async waitForJobCompletion(t = {}) {
		const { interval: e = 1e3, statusCallback: s } = t;
		return new Promise((t, o) => {
			this._clearTimer();
			this._timer = setInterval(() => {
				this._timer || o(u$1()), this.checkJobStatus().then((e) => {
					const { status: r } = e;
					switch (this.status = r, r) {
						case "job-succeeded":
							this._clearTimer(), t(this);
							break;
						case "job-waiting":
						case "job-executing": s && s(this);
					}
				}, (t) => {
					this._clearTimer(), o(t);
				});
			}, e);
		});
	}
	_clearTimer() {
		clearInterval(this._timer), this._timer = void 0;
	}
};
__decorate([a$1()], d$1.prototype, "editsResolver", void 0), __decorate([a$1({
	type: String,
	json: { write: !0 }
})], d$1.prototype, "statusUrl", void 0), __decorate([r$1(l$1)], d$1.prototype, "status", void 0), __decorate([a$1({
	type: Date,
	json: {
		type: Number,
		write: { writer: (t, e) => {
			e.submissionTime = t ? t.getTime() : null;
		} }
	}
})], d$1.prototype, "submissionTime", void 0), __decorate([a$1({
	type: Date,
	json: {
		type: Number,
		write: { writer: (t, e) => {
			e.lastUpdatedTime = t ? t.getTime() : null;
		} }
	}
})], d$1.prototype, "lastUpdatedTime", void 0), d$1 = __decorate([c$3("esri.networks.support.TopologyValidationJobInfo")], d$1);
var c$1 = d$1;
//#endregion
//#region node_modules/@arcgis/core/networks/support/utils.js
function u(e, t, r = "from") {
	const { fromRuleElement: n, viaRuleElement: o, toRuleElement: a } = y(e), s = [];
	switch (e.ruleType) {
		case 2:
		case 3:
			"from" === r && m$1(t, n, !1) ? s.push(a) : "to" === r && m$1(t, a, !1) && s.push(n);
			break;
		case 4:
		case 1:
			m$1(t, n, !0) ? s.push(a) : m$1(t, a, !0) && s.push(n);
			break;
		case 5:
			o && (m$1(t, o, !0) ? (s.push(n), s.push(a)) : (m$1(t, n, !0) || m$1(t, a, !0)) && s.push(o));
			break;
		default: return [];
	}
	return s;
}
function i$1(e, t, r) {
	const { fromRuleElement: n, viaRuleElement: o, toRuleElement: a } = y(e);
	switch (e.ruleType) {
		case 2:
		case 3: return p(t, r, n, a, !1, !1);
		case 4:
		case 1: return p(t, r, n, a, !0, !0);
		case 5: return p(t, r, n, o, !0, !0) || p(t, r, a, o, !0, !0);
		default: return !1;
	}
}
function p(e, t, r, n, o, a) {
	if (!r || !n) return !1;
	const s = m$1(e, r, a), l = m$1(t, n, a);
	if (o) {
		const o = m$1(e, n, a), u = m$1(t, r, a);
		return s && l || o && u;
	}
	return s && l;
}
function c(e, t) {
	const r = e.terminal?.terminalId, n = t.terminalId;
	return null == r && null == n || (1 === r ? null == n || 1 === n : r === n);
}
function m$1(e, t, r) {
	const { assetGroupCode: n, assetTypeCode: o } = e;
	return ("layerId" in e ? e.layerId === t.networkSource?.layerId : e.networkSourceId === t.networkSource?.sourceId) && (null == n || n === t.assetGroup?.assetGroupCode) && (null == o || o === t.assetType?.assetTypeCode) && (!r || !("terminalId" in e) || c(t, e));
}
function y(e) {
	return {
		fromRuleElement: {
			networkSource: e.fromNetworkSource,
			assetGroup: e.fromAssetGroup,
			assetType: e.fromAssetType,
			terminal: e.fromTerminal
		},
		viaRuleElement: e.viaNetworkSource ? {
			networkSource: e.viaNetworkSource,
			assetGroup: e.viaAssetGroup,
			assetType: e.viaAssetType,
			terminal: e.viaTerminal
		} : void 0,
		toRuleElement: {
			networkSource: e.toNetworkSource,
			assetGroup: e.toAssetGroup,
			assetType: e.toAssetType,
			terminal: e.toTerminal
		}
	};
}
function f$1(e) {
	let t$3 = null, r = null, o = null;
	if (t(e)) t$3 = d(e), [r, o] = w(e);
	else if (b$1(e)) {
		t$3 = e.parent?.layerId ?? null;
		const [n] = I(e);
		n === e.subtypeField && (r = e.subtypeCode);
	} else t$3 = e.layerId ?? null;
	return {
		layerId: t$3,
		assetGroupCode: r,
		assetTypeCode: o
	};
}
function d(e) {
	const { sourceLayer: t } = e;
	let r;
	return o$1(t) ? r = t.layerId : b$1(t) && (r = t.parent?.layerId), r ?? null;
}
function w(e) {
	const [t, r] = I(e.sourceLayer);
	return [t ? e.attributes[t] : null, r ? e.attributes[r] : null];
}
function I(e) {
	if (!e || !("fieldsIndex" in e)) return [null, null];
	return [e.fieldsIndex.normalizeFieldName("assetGroup") ?? null, e.fieldsIndex.normalizeFieldName("assetType") ?? null];
}
async function S$1(e, t) {
	if ("Utility Network Layer" === e) {
		const { default: e } = await Promise.resolve().then(() => UtilityNetwork_exports);
		return new e({ layerUrl: t });
	}
	return null;
}
async function T(r$5) {
	let n = "portalItem" in r$5 ? r$5 : { portalItem: r$5 };
	!n.portalItem || n.portalItem instanceof k$1 || (n = {
		...n,
		portalItem: new k$1(n.portalItem)
	});
	const o = n.portalItem;
	if (await o.load(), "Feature Service" !== o.type) throw new r("portal:unknown-item-type", "Unknown item type '${type}'", { type: o.type });
	const s = o.url, l = await f$2(s, {
		responseType: "json",
		query: { f: "json" }
	}), u = "Network Layer";
	if (l.data.type?.includes(u)) return S$1(l.data.type, s);
	if (l.data.layers) {
		const e = l.data.layers.find((e) => e.type.includes(u));
		if (e) {
			const t = `${s}/${e.id}`;
			return S$1(e.type, t);
		}
	}
	return null;
}
//#endregion
//#region node_modules/@arcgis/core/networks/Network.js
var k = class extends e$1(u$2) {
	static fromPortalItem(e) {
		return T(e);
	}
	constructor(e) {
		super(e), this.id = n$3(), this.title = null, this.layerUrl = null, this.dataElement = null, this.fullExtent = null, this.spatialReference = null, this.type = null, this.sourceJSON = null, this._historicMoment = null, this._gdbVersion = null, this._sourceIdByLayerId = /* @__PURE__ */ new Map(), this._layerIdBySourceId = /* @__PURE__ */ new Map(), this._applyEditsHandler = (e) => {
			const { serviceUrl: t, gdbVersion: r, result: o } = e, s = t === this.featureServiceUrl, i = g(t, r, this.gdbVersion);
			s && i && o.then((e) => {
				c$4(t, r) && (this.historicMoment = e.historicMoment);
			});
		}, this._updateMomentHandler = (e) => {
			const { serviceUrl: t, gdbVersion: r, moment: o } = e, s = t === this.featureServiceUrl, i = g(t, r, this.gdbVersion);
			s && i && (this.historicMoment = o);
		}, this.when().then(() => {
			this.addHandles([l$3(this._applyEditsHandler), h(this._updateMomentHandler)]);
		}, () => {});
	}
	initialize() {
		this.when().catch((e) => {
			d$2(e) || n$1.getLogger(this).error("#load()", `Failed to load layer (title: '${this.title ?? "no title"}', id: '${this.id ?? "no id"}')`, { error: e });
		});
	}
	get loaded() {
		return super.loaded;
	}
	get datasetName() {
		return this.dataElement?.name ?? null;
	}
	get owner() {
		return this.dataElement?.userIdentity ?? null;
	}
	get schemaGeneration() {
		return this.dataElement?.schemaGeneration ?? null;
	}
	get parsedUrl() {
		return I$1(this.layerUrl);
	}
	get featureServiceUrl() {
		return m$2(this.parsedUrl.path).url.path;
	}
	get networkServiceUrl() {
		return this.featureServiceUrl.replace(/\/FeatureServer/i, "/UtilityNetworkServer");
	}
	get layerId() {
		return m$2(this.parsedUrl.path).sublayer;
	}
	get networkSystemLayers() {
		return null;
	}
	get gdbVersion() {
		return this._gdbVersion;
	}
	set gdbVersion(e) {
		this._gdbVersion = e;
	}
	get historicMoment() {
		return this._historicMoment;
	}
	set historicMoment(e) {
		this._historicMoment = e;
	}
	async load(e) {
		return this.addResolvingPromise(this._load(e)), this;
	}
	async _load(e) {
		await Promise.all([this._fetchDataElement(this.featureServiceUrl, this.layerId.toString(), e), this._fetchLayerMetaData(this.layerUrl, e)]);
	}
	getLayerIdBySourceId(e) {
		if (!this.dataElement) return null;
		const t = this._layerIdBySourceId.get(e);
		if (null != t) return t;
		const r = this.dataElement.domainNetworks, o = this._traverseNetworkSources(r, this._layerIdBySourceId, "sourceId", "layerId", e);
		return o >= 0 ? o : null;
	}
	getSourceIdByLayerId(e) {
		if (!this.dataElement) return null;
		const t = this._sourceIdByLayerId.get(e);
		if (null != t) return t;
		const r = this.dataElement.domainNetworks, o = this._traverseNetworkSources(r, this._sourceIdByLayerId, "layerId", "sourceId", e);
		return o >= 0 ? o : null;
	}
	getObjectIdsFromElements(e) {
		const t = [], r = /* @__PURE__ */ new Map();
		for (const s of e) {
			const e = this.getLayerIdBySourceId(s.networkSourceId);
			if (null == e) continue;
			let t = r.get(e);
			void 0 === t && (t = []), t.push(s.objectId), r.set(e, t);
		}
		const o = this.featureServiceUrl;
		return r.forEach((e, r) => t.push({
			layerUrl: `${o}/${r}`,
			objectIds: e
		})), t;
	}
	async queryNamedTraceConfigurations(e, t) {
		const [{ queryNamedTraceConfigurations: r }, { default: o }] = await Promise.all([import("./queryNamedTraceConfigurations-9_Ozd_ZI.js"), import("./QueryNamedTraceConfigurationsParameters-Cs7s_XNQ.js")]), s = this.networkServiceUrl;
		return (await r(s, o.from(e), { ...t }))?.namedTraceConfigurations;
	}
	async validateTopology(e, t) {
		if (!e.validateArea) throw new r("network:undefined-validateArea", "the network must have validateArea defined in the validate network topology parameters.");
		const [{ validateNetworkTopology: r$4 }, { default: s }] = await Promise.all([import("./validateNetworkTopology-DiNA4IWj.js"), import("./ValidateNetworkTopologyParameters-BFbPqyvP.js")]), i = s.from(e);
		c$4(this.featureServiceUrl, this.gdbVersion || null) ? (i.sessionID = t$1, await i$3(this.featureServiceUrl, this.gdbVersion, !0)) : i.sessionID = null, i.gdbVersion = this.gdbVersion;
		const a = this.networkServiceUrl, n = this.featureServiceUrl, l = c$5(n, null, this.gdbVersion, !0), d = await r$4(a, i, { ...t });
		if (d?.serviceEdits) {
			const e = [];
			for (const t of d.serviceEdits) {
				const { editedFeatures: r } = t, o = r?.spatialReference ? new S$2(r.spatialReference) : null;
				e.push({
					layerId: t.layerId,
					editedFeatures: {
						adds: r?.adds?.map((e) => N$1(e, o)) || [],
						updates: r?.updates?.map((e) => ({
							original: N$1(e[0], o),
							current: N$1(e[1], o)
						})) || [],
						deletes: r?.deletes?.map((e) => N$1(e, o)) || [],
						spatialReference: o
					}
				});
			}
			l.resolve({
				edits: null,
				addedFeatures: [],
				updatedFeatures: [],
				deletedFeatures: [],
				addedAttachments: [],
				updatedAttachments: [],
				deletedAttachments: [],
				editedFeatures: e,
				exceededTransferLimit: !1,
				historicMoment: d.moment
			});
		}
		return d;
	}
	async submitTopologyValidationJob(e, t) {
		let s = null;
		if (!e.validateArea) throw new r("network:undefined-validateArea", "the network must have validateArea defined in the validate network topology parameters.");
		if (!this.gdbVersion) s = (await f$2(this.layerUrl.replace(/\/FeatureServer/i, "/VersionManagementServer").replace(/\/\d*$/, ""), {
			responseType: "json",
			query: { f: "json" }
		})).data.defaultVersionName;
		const [{ submitValidateNetworkTopologyJob: i }, { default: a }] = await Promise.all([import("./validateNetworkTopology-DiNA4IWj.js"), import("./ValidateNetworkTopologyParameters-BFbPqyvP.js")]), n = a.from(e);
		c$4(this.featureServiceUrl, this.gdbVersion || null) ? (n.sessionID = t$1, await i$3(this.featureServiceUrl, this.gdbVersion, !0)) : n.sessionID = null, n.gdbVersion = this.gdbVersion || s;
		const l = this.networkServiceUrl, d = this.featureServiceUrl ? c$5(this.featureServiceUrl, null, this.gdbVersion, !0) : void 0;
		return new c$1({
			statusUrl: await i(l, n, { ...t }),
			editsResolver: d
		});
	}
	getSourceTypeById(e) {
		if (!this.dataElement) return null;
		for (const t of this.dataElement.domainNetworks) for (const r of [t.edgeSources ?? [], t.junctionSources ?? []]) for (const o of r) if (o.sourceId === e) return r === t.edgeSources ? "edge" : "junction";
		return null;
	}
	_traverseNetworkSources(e, t, r, o, s) {
		for (const i of e) for (const e of [i.edgeSources ?? [], i.junctionSources ?? []]) for (const i of e) if (i[r] === s) return t.set(s, i[o]), i[o];
		return -1;
	}
	async _fetchLayerMetaData(e, t) {
		const o = await f$2(e, {
			responseType: "json",
			query: { f: "json" },
			...t
		});
		this.sourceJSON = o.data, this.read(o.data, { origin: "service" });
	}
	async _fetchDataElement(e, t, o) {
		if (this.dataElement) return;
		const s = await f$2(`${e}/queryDataElements`, {
			responseType: "json",
			query: {
				layers: JSON.stringify([t]),
				f: "json"
			},
			...o
		}).then((e) => e.data.layerDataElements?.[0]);
		s && this.read(s, { origin: "service" });
	}
};
function N$1(e, r) {
	return new j({
		attributes: e.attributes,
		geometry: u$3({
			...e.geometry,
			spatialReference: r
		})
	});
}
__decorate([a$1({
	type: String,
	nonNullable: !0,
	json: {
		origins: { "web-map": {
			read: !0,
			write: { isRequired: !0 }
		} },
		read: !1
	}
})], k.prototype, "id", void 0), __decorate([a$1({
	type: String,
	nonNullable: !0,
	json: {
		origins: {
			"web-map": {
				read: !0,
				write: { isRequired: !0 }
			},
			service: { read: { source: "name" } }
		},
		read: !1
	}
})], k.prototype, "title", void 0), __decorate([a$1({
	type: String,
	nonNullable: !0,
	json: {
		origins: { "web-map": {
			read: { source: "url" },
			write: {
				target: "url",
				isRequired: !0
			}
		} },
		read: !1
	}
})], k.prototype, "layerUrl", void 0), __decorate([a$1({
	type: Object,
	json: {
		origins: { service: { read: !0 } },
		read: !1
	}
})], k.prototype, "dataElement", void 0), __decorate([a$1({
	type: z,
	json: {
		origins: { service: { read: { source: "extent" } } },
		read: !1
	}
})], k.prototype, "fullExtent", void 0), __decorate([a$1({
	type: S$2,
	json: {
		origins: { service: { read: { source: "extent.spatialReference" } } },
		read: !1
	}
})], k.prototype, "spatialReference", void 0), __decorate([a$1({
	type: ["utility", "trace"],
	readOnly: !0,
	json: {
		read: !1,
		write: !1
	}
})], k.prototype, "type", void 0), __decorate([a$1({ readOnly: !0 })], k.prototype, "datasetName", null), __decorate([a$1({ readOnly: !0 })], k.prototype, "owner", null), __decorate([a$1({ readOnly: !0 })], k.prototype, "schemaGeneration", null), __decorate([a$1({ readOnly: !0 })], k.prototype, "parsedUrl", null), __decorate([a$1({ readOnly: !0 })], k.prototype, "featureServiceUrl", null), __decorate([a$1({ readOnly: !0 })], k.prototype, "networkServiceUrl", null), __decorate([a$1({ readOnly: !0 })], k.prototype, "layerId", null), __decorate([a$1()], k.prototype, "sourceJSON", void 0), __decorate([a$1({ readOnly: !0 })], k.prototype, "networkSystemLayers", null), __decorate([a$1({ type: String })], k.prototype, "gdbVersion", null), __decorate([a$1({ type: Date })], k.prototype, "historicMoment", null), __decorate([a$1()], k.prototype, "_historicMoment", void 0), __decorate([a$1()], k.prototype, "_gdbVersion", void 0), k = __decorate([c$3("esri.networks.Network")], k);
var V = k;
//#endregion
//#region node_modules/@arcgis/core/networks/RulesTable.js
var f = class extends a$2(u$2) {
	constructor(e) {
		super(e), this.rulesCategorized = {
			attachment: [],
			containment: [],
			connectivity: []
		}, this.request = f$2;
	}
	initialize() {}
	async load(e) {
		const t = this.rulesLayer.load(e).then(() => this._initializeRulesTable());
		return this.addResolvingPromise(t), this;
	}
	getFeaturesCanAssociateWithClause(e, t, s) {
		const r = /* @__PURE__ */ new Map(), [i, a] = I(e.sourceLayer);
		if (!i || !a) return "";
		const c = f$1(e), y = f$1(t);
		s.forEach((e) => {
			const { type: t, direction: s } = e;
			this._getRulesForAssociationType(t).forEach((e) => {
				u(e, c, s).filter((e) => e.networkSource?.layerId === y.layerId).forEach((e) => {
					const t = e.assetGroup?.assetGroupCode, s = e.assetType?.assetTypeCode;
					if (null != t && null != s) {
						const e = r.get(t) ?? /* @__PURE__ */ new Set();
						e.add(s), r.set(t, e);
					}
				});
			});
		});
		let d = [];
		return this._mergeAssetCodes(r).forEach((e, t) => {
			const s = `${i} IN (${t})`, r = p$1(a, [...e]);
			s && r && d.push(o$2(s, r));
		}), d.length > 1 && (d = d.map((e) => `(${e})`)), d.join(" OR ");
	}
	getFeaturesCanAssociateWith(e, t, s) {
		return null == d(e) ? [] : t.filter((t) => this.canAssociateFeatures(e, t, s));
	}
	canAssociateFeatures(e, t, s) {
		if (!this._canSupportAssociations([e, t])) return !1;
		const r = f$1(e), o = f$1(t);
		return s.some((e) => {
			const { type: t, direction: s } = e;
			return this._getRulesForAssociationType(t).some((e) => "to" === s ? i$1(e, o, r) : i$1(e, r, o));
		});
	}
	getLayersCanAssociateWith(e, t, s) {
		return null == d(e) ? [] : t.filter((t) => this.canAssociateFeatureToLayer(e, t, s));
	}
	canAssociateFeatureToLayer(e, t, s) {
		if (!this._canSupportAssociations([e, t])) return !1;
		const r = f$1(e), o = f$1(t);
		return s.some((e) => {
			const { type: t, direction: s } = e;
			return this._getRulesForAssociationType(t).some((e) => "to" === s ? i$1(e, o, r) : i$1(e, r, o));
		});
	}
	getFeatureSQL(e, t) {
		const s = e.layerId.toString(), r = e.fieldsIndex?.normalizeFieldName("assetGroup"), o = e.fieldsIndex?.normalizeFieldName("assetType"), n = r ? t.attributes[r] : null, i = o ? t.attributes[o] : null, a = this.rulesHash[s];
		if (a) {
			const e = a.assetGroupHash[n];
			if (e) return e.assetTypeHash[i] || null;
		}
		return null;
	}
	_initializeRulesTable() {
		const e = {}, t = [
			{
				networkSourceId: "fromNetworkSource",
				assetGroupId: "fromAssetGroup",
				assetTypeId: "fromAssetType"
			},
			{
				networkSourceId: "toNetworkSource",
				assetGroupId: "toAssetGroup",
				assetTypeId: "toAssetType"
			},
			{
				networkSourceId: "viaNetworkSource",
				assetGroupId: "viaAssetGroup",
				assetTypeId: "viaAssetType"
			}
		];
		this.rulesCategorized = {
			attachment: [],
			containment: [],
			connectivity: []
		};
		for (const s of this.rules) {
			if (3 === s.ruleType) {
				this.rulesCategorized.attachment.push(s);
				continue;
			}
			if (2 === s.ruleType) {
				this.rulesCategorized.containment.push(s);
				continue;
			}
			if (1 === s.ruleType) {
				this.rulesCategorized.connectivity.push(s);
				continue;
			}
			this.rulesCategorized.connectivity.push(s);
			let r = [[0, 1], [1, 0]];
			5 === s.ruleType && (r = [
				[0, 2],
				[2, 0],
				[1, 2],
				[2, 1]
			]);
			for (const o of r) {
				const r = o.shift(), a = o.shift();
				let c = !1;
				switch (s.ruleType) {
					case 5:
						c = 0 === r || 1 === r;
						break;
					case 4: c = 1 === r;
				}
				const u = t[r], l = s[u.networkSourceId]?.layerId.toString() ?? "", p = s[u.assetGroupId]?.assetGroupCode?.toString(), d = s[u.assetTypeId]?.assetTypeCode?.toString(), h = t[a], f = s[h.networkSourceId]?.layerId.toString() ?? "", m = s[h.assetGroupId]?.assetGroupCode?.toString(), g = s[h.assetTypeId], T = g?.assetTypeCode?.toString(), S = e[l] ?? { assetGroupHash: {} };
				if (!(p && d && m && T)) continue;
				const I = S.assetGroupHash[p] ?? { assetTypeHash: {} }, v = I.assetTypeHash[d] ?? {};
				if (v[f] = v[f] ?? {}, c) {
					v[l] = v[l] ?? {};
					const e = o$2(`assetgroup = ${p}`, `assettype = ${d}`);
					"esriNECPEndVertex" === g?.connectivityPolicy ? v[l].endVertex = v[l]?.endVertex ? `${v[l].endVertex}` : `(${e})` : v[l].anyVertex = v[l].anyVertex ? `${v[l].anyVertex}` : `(${e})`;
				}
				const A = o$2(`assetgroup = ${m}`, `assettype = ${T}`);
				"esriNECPEndVertex" === g?.connectivityPolicy ? v[f].endVertex = v[f]?.endVertex ? d$3(v[f].endVertex, A) : `(${A})` : v[f].anyVertex = v[f]?.anyVertex ? d$3(v[f].anyVertex, A) : `(${A})`, I.assetTypeHash[d] = v, S.assetGroupHash[p] = I, e[l] = S;
			}
		}
		this._set("rulesHash", e);
	}
	_getRulesForAssociationType(e) {
		const { rulesCategorized: t } = this;
		switch (e) {
			case "attachment": return t.attachment;
			case "containment": return t.containment;
			case "connectivity":
			case "junction-junction-connectivity": return t.connectivity.filter((e) => 1 === e.ruleType);
			case "junction-edge-from-connectivity":
			case "junction-edge-midspan-connectivity":
			case "junction-edge-to-connectivity": return t.connectivity.filter((e) => 4 === e.ruleType || 5 === e.ruleType);
			default: return [];
		}
	}
	_areSetsEqual(e, t) {
		if (e.size !== t.size) return !1;
		for (const s of e) if (!t.has(s)) return !1;
		return !0;
	}
	_mergeAssetCodes(e) {
		const t = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
		for (const [r, o] of e) {
			const n = new Set([r]);
			for (const [t, a] of e) r !== t && !s.has(t) && this._areSetsEqual(o, a) && (n.add(t), s.add(t));
			const i = Array.from(n).sort().join(",");
			t.set(i, o);
		}
		return t;
	}
	_canSupportAssociations(e) {
		return e.every((e) => {
			const [s, r] = I(t(e) ? e.sourceLayer : e);
			return null != s && null != r;
		});
	}
};
__decorate([a$1({ constructOnly: !0 })], f.prototype, "rulesLayer", void 0), __decorate([a$1({ constructOnly: !0 })], f.prototype, "rules", void 0), __decorate([a$1({ readOnly: !0 })], f.prototype, "rulesHash", void 0), __decorate([a$1()], f.prototype, "rulesCategorized", void 0), __decorate([a$1({ constructOnly: !0 })], f.prototype, "request", void 0), f = __decorate([c$3("esri.networks.RulesTable")], f);
//#endregion
//#region node_modules/@arcgis/core/networks/support/NetworkSystemLayers.js
var l = class extends b {
	constructor(s) {
		super(s), this.rulesTableId = null, this.rulesTableUrl = null, this.subnetworksTable = null, this.subnetworksTableId = null, this.subnetworksTableUrl = null, this.dirtyAreasLayerId = null, this.dirtyAreasLayerUrl = null, this.associationsTable = null, this.associationsTableId = null, this.associationsTableUrl = null;
	}
	destroy() {
		this.associationsTable?.destroy();
	}
	async loadAssociationsTable(s) {
		if (!this.associationsTable) {
			const { associationsTableUrl: s } = this;
			if (!s) throw new r("utility-network-system-layers:missing-associations-table-url", "Unable to load the associations table, as the `associationsTableUrl` is not set.");
			this.associationsTable = new Ye({ url: s });
		}
		return await this.associationsTable.load(s), this.associationsTable;
	}
	async loadSubnetworksTable(s) {
		if (!this.subnetworksTable) {
			const { subnetworksTableUrl: s } = this;
			if (!s) throw new r("utility-network-system-layers:missing-subnetworks-table-url", "Unable to load the subnetworks table, as the `subnetworksTableUrl` is not set.");
			this.subnetworksTable = new Ye({ url: s });
		}
		return await this.subnetworksTable.load(s), this.subnetworksTable;
	}
};
__decorate([a$1({ constructOnly: !0 })], l.prototype, "rulesTableId", void 0), __decorate([a$1({ constructOnly: !0 })], l.prototype, "rulesTableUrl", void 0), __decorate([a$1()], l.prototype, "subnetworksTable", void 0), __decorate([a$1({ constructOnly: !0 })], l.prototype, "subnetworksTableId", void 0), __decorate([a$1({ constructOnly: !0 })], l.prototype, "subnetworksTableUrl", void 0), __decorate([a$1({ constructOnly: !0 })], l.prototype, "dirtyAreasLayerId", void 0), __decorate([a$1({ constructOnly: !0 })], l.prototype, "dirtyAreasLayerUrl", void 0), __decorate([a$1()], l.prototype, "associationsTable", void 0), __decorate([a$1({ constructOnly: !0 })], l.prototype, "associationsTableId", void 0), __decorate([a$1({ constructOnly: !0 })], l.prototype, "associationsTableUrl", void 0), l = __decorate([c$3("esri.networks.support.NetworkSystemLayers")], l);
//#endregion
//#region node_modules/@arcgis/core/networks/support/Terminal.js
var s$1 = class extends n$2 {
	constructor(r) {
		super(r), this.id = null, this.name = null;
	}
};
__decorate([a$1({
	type: Number,
	json: {
		read: { source: "terminalId" },
		write: { target: "terminalId" }
	}
})], s$1.prototype, "id", void 0), __decorate([a$1({
	type: String,
	json: {
		read: { source: "terminalName" },
		write: { target: "terminalName" }
	}
})], s$1.prototype, "name", void 0), __decorate([a$1({
	type: Boolean,
	json: { write: !0 }
})], s$1.prototype, "isUpstreamTerminal", void 0), s$1 = __decorate([c$3("esri.networks.support.Terminal")], s$1);
var i = s$1;
//#endregion
//#region node_modules/@arcgis/core/networks/support/TerminalConfiguration.js
var a = new o({
	esriUNTMBidirectional: "bidirectional",
	esriUNTMDirectional: "directional"
});
var s = class extends n$2 {
	constructor(t) {
		super(t), this.defaultConfiguration = null, this.id = null, this.name = null, this.terminals = [], this.traversabilityModel = null;
	}
};
__decorate([a$1({
	type: String,
	json: { write: !0 }
})], s.prototype, "defaultConfiguration", void 0), __decorate([a$1({
	type: Number,
	json: {
		read: { source: "terminalConfigurationId" },
		write: { target: "terminalConfigurationId" }
	}
})], s.prototype, "id", void 0), __decorate([a$1({
	type: String,
	json: {
		read: { source: "terminalConfigurationName" },
		write: { target: "terminalConfigurationName" }
	}
})], s.prototype, "name", void 0), __decorate([a$1({
	type: [i],
	json: { write: !0 }
})], s.prototype, "terminals", void 0), __decorate([a$1({
	type: a.apiValues,
	json: {
		type: a.jsonValues,
		read: a.read,
		write: a.write
	}
})], s.prototype, "traversabilityModel", void 0), s = __decorate([c$3("esri.networks.support.TerminalConfiguration")], s);
//#endregion
//#region node_modules/@arcgis/core/networks/support/TraceJobInfo.js
var n = i$2()({
	Pending: "job-waiting",
	InProgress: "job-executing",
	Completed: "job-succeeded"
});
var m = class extends d$5 {
	constructor(t) {
		super(t), this.statusUrl = null, this.status = null, this.submissionTime = null, this.lastUpdatedTime = null, this._timer = void 0;
	}
	destroy() {
		clearInterval(this._timer);
	}
	async checkJobStatus(t) {
		const s = {
			...t,
			query: { f: "json" }
		}, { data: r } = await f$2(this.statusUrl, s), i = r.traceResults ? {
			...r.traceResults,
			...r
		} : r;
		return this.read(i), this;
	}
	async waitForJobCompletion(t = {}) {
		const { interval: e = 1e3, statusCallback: s } = t;
		return new Promise((t, i) => {
			this._clearTimer();
			this._timer = setInterval(() => {
				this._timer || i(u$1()), this.checkJobStatus().then((e) => {
					const { status: r } = e;
					switch (this.status = r, r) {
						case "job-succeeded":
							this._clearTimer(), t(this);
							break;
						case "job-waiting":
						case "job-executing": s && s(this);
					}
				}, (t) => {
					this._clearTimer(), i(t);
				});
			}, e);
		});
	}
	_clearTimer() {
		clearInterval(this._timer), this._timer = void 0;
	}
};
__decorate([a$1({
	type: String,
	json: { write: !0 }
})], m.prototype, "statusUrl", void 0), __decorate([r$1(n)], m.prototype, "status", void 0), __decorate([a$1({
	type: Date,
	json: {
		type: Number,
		write: { writer: (t, e) => {
			e.submissionTime = t ? t.getTime() : null;
		} }
	}
})], m.prototype, "submissionTime", void 0), __decorate([a$1({
	type: Date,
	json: {
		type: Number,
		write: { writer: (t, e) => {
			e.lastUpdatedTime = t ? t.getTime() : null;
		} }
	}
})], m.prototype, "lastUpdatedTime", void 0), m = __decorate([c$3("esri.networks.support.TraceJobInfo")], m);
//#endregion
//#region node_modules/@arcgis/core/networks/UtilityNetwork.js
var UtilityNetwork_exports = /* @__PURE__ */ __exportAll({ default: () => N });
var S = class extends V {
	constructor(e) {
		super(e), this.sharedNamedTraceConfigurations = [], this.type = "utility", this._circuitManagerMap = /* @__PURE__ */ new Map(), this._terminalById = /* @__PURE__ */ new Map(), this._unitIdentifierManager = null;
	}
	initialize() {
		this.addHandles(l$2(() => [this.gdbVersion, this.historicMoment], () => {
			this.networkSystemLayers.associationsTable && (this.networkSystemLayers.associationsTable.gdbVersion !== this.gdbVersion && (this.networkSystemLayers.associationsTable.gdbVersion = this.gdbVersion), this.networkSystemLayers.associationsTable.historicMoment !== this.historicMoment && (this.networkSystemLayers.associationsTable.historicMoment = this.historicMoment));
		}));
	}
	get _rulesLayer() {
		const { gdbVersion: e, historicMoment: t } = this, r = this.networkSystemLayers.rulesTableUrl;
		return new Ye({
			url: r,
			gdbVersion: e,
			historicMoment: t
		});
	}
	get _utilityLayerList() {
		const e = /* @__PURE__ */ new Set();
		return this.dataElement?.domainNetworks?.map((t) => {
			t?.edgeSources?.map(({ layerId: t, sourceId: r }) => {
				this._layerIdBySourceId.set(r, t), this._sourceIdByLayerId.set(t, r), e.add(t);
			}), t?.junctionSources?.map(({ layerId: t, sourceId: r }) => {
				this._layerIdBySourceId.set(r, t), this._sourceIdByLayerId.set(t, r), e.add(t);
			});
		}), e;
	}
	get serviceTerritoryFeatureLayerId() {
		return this.dataElement?.serviceTerritoryFeatureLayerId ?? null;
	}
	get networkSystemLayers() {
		return new l({
			rulesTableId: this.sourceJSON?.systemLayers.rulesTableId,
			rulesTableUrl: this.sourceJSON ? `${this.featureServiceUrl}/${this.sourceJSON?.systemLayers.rulesTableId}` : null,
			subnetworksTableId: this.sourceJSON?.systemLayers.subnetworksTableId,
			subnetworksTableUrl: this.sourceJSON ? `${this.featureServiceUrl}/${this.sourceJSON?.systemLayers.subnetworksTableId}` : null,
			dirtyAreasLayerId: this.sourceJSON?.systemLayers.dirtyAreasLayerId,
			dirtyAreasLayerUrl: this.sourceJSON ? `${this.featureServiceUrl}/${this.sourceJSON?.systemLayers.dirtyAreasLayerId}` : null,
			associationsTableId: this.sourceJSON?.systemLayers.associationsTableId,
			associationsTableUrl: this.sourceJSON ? `${this.featureServiceUrl}/${this.sourceJSON?.systemLayers.associationsTableId}` : null
		});
	}
	get terminalConfigurations() {
		return this.dataElement?.terminalConfigurations.map((e) => s.fromJSON(e)) || [];
	}
	get domainNetworkNames() {
		return this.dataElement?.domainNetworks.map((e) => e.domainNetworkName) || [];
	}
	get hasTelecomNetwork() {
		return this.dataElement?.domainNetworks.some((e) => e.isTelecomNetwork) ?? !1;
	}
	get associationsTable() {
		return this.networkSystemLayers.associationsTable;
	}
	async load(e) {
		return this.addResolvingPromise(this._load(e)), this;
	}
	async _load(e) {
		await super._load(e), await Promise.all([this._loadNamedTraceConfigurationsFromNetwork(e), this.networkSystemLayers.loadAssociationsTable(e)]);
	}
	getTerminalConfiguration(e) {
		let t = null, r = null;
		const s$4 = e.sourceLayer ?? e.origin ?? e.layer ?? null;
		let o = null;
		if ("feature" === s$4?.type) {
			if (o = s$4.layerId, null === o) return null;
		} else {
			if ("subtype-sublayer" !== s$4?.type) return null;
			if (o = s$4?.parent?.layerId ?? null, null === o) return null;
		}
		const i = e.attributes;
		if (null == i) return null;
		for (const l of Object.keys(i)) "ASSETGROUP" === l.toUpperCase() && (t = e.getAttribute(l)), "ASSETTYPE" === l.toUpperCase() && (r = e.getAttribute(l));
		if (!this.dataElement) return null;
		let a = null;
		const n = this.dataElement.domainNetworks;
		for (const l of n) {
			const e = l.junctionSources?.find((e) => e.layerId === o);
			if (e) {
				const s = e.assetGroups?.find((e) => e.assetGroupCode === t);
				if (s) {
					const e = s.assetTypes?.find((e) => e.assetTypeCode === r);
					if (e?.isTerminalConfigurationSupported) {
						a = e.terminalConfigurationId;
						break;
					}
				}
			}
		}
		if (null != a) {
			const t = this.dataElement.terminalConfigurations?.find((e) => e.terminalConfigurationId === a);
			return t ? s.fromJSON(t) : null;
		}
		return null;
	}
	getTierNames(e) {
		return (this.dataElement?.domainNetworks.find((t) => t.domainNetworkName === e))?.tiers?.map((e) => e.name) || [];
	}
	async getRulesTable() {
		const e = this._rulesLayer;
		e.loaded || await e.load();
		const t = this.dataElement?.domainNetworks;
		if (!t) return null;
		const r = t.flatMap((e) => [...e.edgeSources || [], ...e.junctionSources || []]);
		return new f({
			rulesLayer: e,
			rules: (await this._queryRulesTable(e)).map((t) => this._hydrateRuleInfo(e, r, t))
		});
	}
	async getCircuitManager(e$2) {
		if (!this.hasTelecomNetwork) return null;
		const t = this.dataElement?.domainNetworks.find((t) => t.domainNetworkName === e$2 && t.isTelecomNetwork);
		if (!t) return null;
		const { default: r } = await import("./CircuitManager-XPAb-Ev2.js");
		return e(this._circuitManagerMap, e$2, () => new r({
			utilityNetwork: this,
			telecomDomainNetwork: t
		}));
	}
	async getUnitIdentifierManager() {
		if (!this.hasTelecomNetwork) return null;
		if (this._unitIdentifierManager) return this._unitIdentifierManager;
		const { default: e } = await import("./UnitIdentifierManager-Cbq7zDtk.js");
		return this._unitIdentifierManager = new e({ utilityNetwork: this }), this._unitIdentifierManager;
	}
	getTerminalById(e) {
		if (!this.dataElement || null == e) return null;
		const t = this._terminalById.get(e);
		return null != t ? t : (this.terminalConfigurations.forEach((e) => {
			e.terminals.forEach((e) => {
				this._terminalById.set(e.id, e);
			});
		}), this._terminalById.get(e));
	}
	isUtilityLayer(e) {
		return "layerId" in e ? null != e.layerId && this._utilityLayerList.has(e.layerId) && (e.url?.startsWith(this.featureServiceUrl) ?? !1) : !("subtype-sublayer" !== e.type || !e.parent) && this._utilityLayerList.has(e.parent.layerId) && (e.parent.url?.startsWith(this.featureServiceUrl) ?? !1);
	}
	async queryAssociations(e, t) {
		const [{ queryAssociations: r }, { default: s }] = await Promise.all([import("./queryAssociations-joPv6fep.js"), import("./QueryAssociationsParameters-Cu-2mJSs.js")]), o = s.from(e);
		o.gdbVersion = this.gdbVersion, o.moment = this.historicMoment;
		return (await r(this.networkServiceUrl, o, t)).associations;
	}
	async synthesizeAssociationGeometries(e) {
		const [{ synthesizeAssociationGeometries: t }, { default: r }] = await Promise.all([import("./synthesizeAssociationGeometries-ChmB8jX3.js"), import("./SynthesizeAssociationGeometriesParameters-EMuQ56d0.js")]), s = r.from(e);
		return s.gdbVersion = this.gdbVersion, s.moment = this.historicMoment, t(this.networkServiceUrl, s);
	}
	async trace(e) {
		const [{ trace: t }, { default: r }] = await Promise.all([import("./trace-bIpMRS_r.js"), import("./TraceParameters-nI259Y6B.js")]), s = r.from(e);
		return s.gdbVersion = this.gdbVersion, s.moment = this.historicMoment, t(this.networkServiceUrl, s);
	}
	async submitTraceJob(e) {
		const [{ submitTraceJob: t }, { default: r }] = await Promise.all([import("./trace-bIpMRS_r.js"), import("./TraceParameters-nI259Y6B.js")]), s = r.from(e);
		s.gdbVersion = this.gdbVersion, s.moment = this.historicMoment;
		return new m({ statusUrl: await t(this.networkServiceUrl, s) });
	}
	async canAddAssociation(e) {
		const t = await this.getRulesTable();
		if (!t) return !1;
		const { fromNetworkElement: r, toNetworkElement: s } = e;
		if (!r || !s) return !1;
		await t.load();
		let o = null;
		switch (e.associationType) {
			case "containment":
				o = t.rulesCategorized.containment;
				break;
			case "attachment":
				o = t.rulesCategorized.attachment;
				break;
			default: o = t.rulesCategorized.connectivity;
		}
		return o.some((e) => i$1(e, r, s));
	}
	generateAddAssociations(e) {
		const { associationsTable: r } = this.networkSystemLayers, { fromNetworkSourceId: s, fromGlobalId: o, fromTerminalId: i, fromFirstUnit: a, fromLastUnit: n, toNetworkSourceId: l, toGlobalId: u, toTerminalId: d, toFirstUnit: m, toLastUnit: c, associationType: h, isContentVisible: p, percentAlong: f, globalId: I } = t$2(r);
		return {
			addFeatures: e.map((e) => {
				const r = new j({ attributes: {
					[s]: e.fromNetworkElement?.networkSourceId,
					[o]: e.fromNetworkElement?.globalId,
					[i]: e.fromNetworkElement?.terminalId,
					[l]: e.toNetworkElement?.networkSourceId,
					[u]: e.toNetworkElement?.globalId,
					[d]: e.toNetworkElement?.terminalId,
					[h]: d$4[e.associationType],
					[p]: null == e.isContentVisible ? void 0 : e.isContentVisible ? 1 : 0,
					[f]: e.percentAlong,
					[I]: e.globalId
				} }), y = e.associationType.includes("connectivity");
				return e.fromNetworkElement instanceof s$3 && (r.attributes[a] = e.fromNetworkElement?.firstUnit, r.attributes[n] = e.fromNetworkElement?.lastUnit, y && (r.attributes[i] = 1)), e.toNetworkElement instanceof s$3 && (r.attributes[m] = e.toNetworkElement?.firstUnit, r.attributes[c] = e.toNetworkElement?.lastUnit, y && (r.attributes[d] = 1)), r;
			}),
			id: this.networkSystemLayers.associationsTableId,
			identifierFields: {
				globalIdField: r?.globalIdField ?? "globalid",
				objectIdField: r?.objectIdField ?? "objectid"
			}
		};
	}
	generateDeleteAssociations(e) {
		const { associationsTable: t, associationsTableId: r } = this.networkSystemLayers, s = {
			id: r,
			identifierFields: {
				globalIdField: t?.globalIdField ?? "globalid",
				objectIdField: t?.objectIdField ?? "objectid"
			}
		};
		if (-8 === this.dataElement?.schemaGeneration) {
			const t = this._generateDeleteTelecomAssociationPayload(e);
			return {
				...s,
				deleteAssociations: t
			};
		}
		const o = e.map((e) => ({ globalId: e.globalId }));
		return {
			...s,
			deleteFeatures: o
		};
	}
	generateCombineNetworkElements(e) {
		return {
			id: this._ensureSingleSourceIdAsValidLayerId(e),
			combineGroupedObjects: [{ globalIds: e.map((e) => e.globalId) }]
		};
	}
	generateDivideNetworkElements(e, t) {
		return {
			id: this._ensureSingleSourceIdAsValidLayerId([e]),
			divideGroupedObjects: [{
				globalId: e.globalId,
				numUnits: t
			}]
		};
	}
	async loadAssociationsTable() {
		return this.networkSystemLayers.loadAssociationsTable();
	}
	async loadSubnetworksTable() {
		return this.networkSystemLayers.loadSubnetworksTable();
	}
	async _loadNamedTraceConfigurationsFromNetwork(e) {
		if (0 === this.sharedNamedTraceConfigurations?.length) return;
		const t = this.sharedNamedTraceConfigurations.map((e) => e.globalId), r = await this.queryNamedTraceConfigurations({ globalIds: t }, e);
		for (const s of this.sharedNamedTraceConfigurations) {
			const e = r?.find((e) => e.globalId === s.globalId);
			if (e) {
				const t = e.write({}, { origin: "service" });
				s.read(t, { origin: "service" });
			}
		}
	}
	_hydrateRuleInfo(e, t, r) {
		const s = e.fieldsIndex, o = s.get("RULETYPE"), i = s.get("CREATIONDATE"), a = s.get("FROMNETWORKSOURCEID"), n = s.get("FROMASSETGROUP"), l = s.get("FROMASSETTYPE"), u = s.get("FROMTERMINALID"), d = s.get("TONETWORKSOURCEID"), m = s.get("TOASSETGROUP"), c = s.get("TOASSETTYPE"), y = s.get("TOTERMINALID"), h = s.get("VIANETWORKSOURCEID"), p = s.get("VIAASSETGROUP"), f = s.get("VIAASSETTYPE"), w = s.get("VIATERMINALID"), I = r.attributes[o.name], b = new Date(r.attributes[i.name]), g = [
			{
				networkSourceId: r.attributes[a.name],
				assetGroupId: r.attributes[n.name],
				assetTypeId: r.attributes[l.name],
				terminalId: r.attributes[u.name]
			},
			{
				networkSourceId: r.attributes[d.name],
				assetGroupId: r.attributes[m.name],
				assetTypeId: r.attributes[c.name],
				terminalId: r.attributes[y.name]
			},
			{
				networkSourceId: r.attributes[h.name],
				assetGroupId: r.attributes[p.name],
				assetTypeId: r.attributes[f.name],
				terminalId: r.attributes[w.name]
			}
		], T = {
			ruleType: I,
			creationDate: b
		};
		for (const k of [
			0,
			1,
			2
		]) {
			if (5 !== I && 2 === k) continue;
			const e = g[k], r = t.find((t) => t.sourceId === e.networkSourceId), s = r?.assetGroups.find((t) => t.assetGroupCode === e.assetGroupId), o = s?.assetTypes.find((t) => t.assetTypeCode === e.assetTypeId), i = this._getTerminal(o, e);
			let a = "";
			switch (k) {
				case 0:
					a = "from";
					break;
				case 1:
					a = "to";
					break;
				case 2: a = "via";
			}
			T[`${a}NetworkSource`] = r, T[`${a}AssetGroup`] = s, T[`${a}AssetType`] = o, T[`${a}Terminal`] = i?.toJSON();
		}
		return T;
	}
	_getTerminal(e, t) {
		const r = e?.terminalConfigurationId;
		return (this.terminalConfigurations?.find((e) => e.id === r))?.terminals?.find((e) => e.id === t.terminalId) ?? null;
	}
	async _queryRulesTable(e) {
		const { gdbVersion: t, historicMoment: r } = this;
		return (await r$2(e, new R({
			where: "1=1",
			outFields: ["*"],
			gdbVersion: t,
			historicMoment: r
		}))).features;
	}
	_generateDeleteTelecomAssociationPayload(e) {
		return e.map((e) => ({
			globalId: e.globalId ?? "{00000000-0000-0000-0000-000000000000}",
			associationType: s$2.toJSON(e.associationType),
			fromSourceId: e.fromNetworkElement.networkSourceId,
			fromGlobalId: e.fromNetworkElement.globalId,
			fromTerminalId: e.fromNetworkElement.terminalId,
			toSourceId: e.toNetworkElement.networkSourceId,
			toGlobalId: e.toNetworkElement.globalId,
			toTerminalId: e.toNetworkElement.terminalId
		}));
	}
	_ensureSingleSourceIdAsValidLayerId(e) {
		const t = c$2(e.map((e) => e.networkSourceId));
		if (t.length > 1) throw new r("utility-network:invalid-source-id", "'networkSourceId' is not valid. Ensure that all network elements have the same 'networkSourceId' and that it corresponds to a valid layer in the utility network.");
		const o = t[0], i = this.getLayerIdBySourceId(o);
		if (null == i) throw new r("utility-network:invalid-source-id", "'networkSourceId' is not valid. Ensure that all network elements have the same 'networkSourceId' and that it corresponds to a valid layer in the utility network.");
		return i;
	}
};
__decorate([a$1({ readOnly: !0 })], S.prototype, "_rulesLayer", null), __decorate([a$1({
	type: [c$6],
	json: {
		origins: {
			"web-map": {
				read: { source: "traceConfigurations" },
				write: { target: "traceConfigurations" }
			},
			service: { read: { source: "traceConfigurations" } }
		},
		read: !1
	}
})], S.prototype, "sharedNamedTraceConfigurations", void 0), __decorate([a$1({
	type: ["utility"],
	readOnly: !0,
	json: {
		read: !1,
		write: !1
	}
})], S.prototype, "type", void 0), __decorate([a$1({ readOnly: !0 })], S.prototype, "serviceTerritoryFeatureLayerId", null), __decorate([a$1({ readOnly: !0 })], S.prototype, "networkSystemLayers", null), __decorate([a$1({ readOnly: !0 })], S.prototype, "terminalConfigurations", null), __decorate([a$1({ readOnly: !0 })], S.prototype, "domainNetworkNames", null), __decorate([a$1({ readOnly: !0 })], S.prototype, "hasTelecomNetwork", null), __decorate([a$1({
	readOnly: !0,
	json: { read: !1 }
})], S.prototype, "associationsTable", null), S = __decorate([c$3("esri.networks.UtilityNetwork")], S);
var N = S;
//#endregion
export { UtilityNetwork_exports as n, N as t };

//# sourceMappingURL=UtilityNetwork-Cdb3s5pO.js.map