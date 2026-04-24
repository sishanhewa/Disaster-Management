import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as n$1 } from "./Error-CzxduO2m.js";
import { T as N } from "./typedArrayUtil-BAuNmygZ.js";
import { a as o$1, i as r, n as c$1, t as a$1 } from "./decorators-DE7S5xmd.js";
import { r as n$2 } from "./Evented-GLJbxWO5.js";
import { n as n$3 } from "./JSONSupport-BUaD4jSd.js";
import { a as h, r as a$2, s as l } from "./reactiveUtils-DRpp6Nmg.js";
import { t as y$1 } from "./Polyline-Cv0nwof6.js";
import { a as l$1, r as g } from "./EditBusLayer-BrMVPiuf.js";
import { a as i, i as e$1, l as t$1, o as o$2 } from "./typeUtils-CFnTDMtU.js";
import { t as s$1 } from "./TelecomNetworkElement-CK1MxXNb.js";
import { t as n$4 } from "./TraceLocation-DqkqiD8w.js";
import { t as s$2 } from "./CircuitLocation-DO9dNaIi.js";
//#region node_modules/@arcgis/core/networks/support/CircuitPathConnectivityElement.js
var c = class extends n$3 {
	constructor(e) {
		super(e), this.edgeElement = null, this.junctionElement = null;
	}
	readEdgeElement(e, t) {
		return new s$1({
			networkSourceId: t.edgeNetworkSourceId,
			globalId: t.edgeGlobalId,
			objectId: t.edgeObjectId,
			positionFrom: t.edgePositionFrom,
			positionTo: t.edgePositionTo,
			firstUnit: t.edgeFirstUnit,
			lastUnit: t.edgeLastUnit
		});
	}
	writeEdgeElement(e, t) {
		t.edgeNetworkSourceId = e.networkSourceId, t.edgeGlobalId = e.globalId, t.edgeObjectId = e.objectId, t.edgePositionFrom = e.positionFrom, t.edgePositionTo = e.positionTo, t.edgeFirstUnit = e.firstUnit, t.edgeLastUnit = e.lastUnit;
	}
	readJunctionElement(e, t) {
		return new s$1({
			networkSourceId: t.junctionNetworkSourceId,
			globalId: t.junctionGlobalId,
			objectId: t.junctionObjectId,
			firstUnit: t.junctionFirstUnit,
			lastUnit: t.junctionLastUnit
		});
	}
	writeJunctionElement(e, t) {
		t.junctionNetworkSourceId = e.networkSourceId, t.junctionGlobalId = e.globalId, t.junctionObjectId = e.objectId, t.junctionFirstUnit = e.firstUnit, t.junctionLastUnit = e.lastUnit;
	}
};
__decorate([a$1({
	type: s$1,
	json: {
		read: { source: [
			"edgeNetworkSourceId",
			"edgeGlobalId",
			"edgeObjectId",
			"edgePositionFrom",
			"edgePositionTo",
			"edgeFirstUnit",
			"edgeLastUnit"
		] },
		write: !0
	}
})], c.prototype, "edgeElement", void 0), __decorate([o$1("edgeElement")], c.prototype, "readEdgeElement", null), __decorate([r("edgeElement")], c.prototype, "writeEdgeElement", null), __decorate([a$1({
	type: s$1,
	json: {
		read: { source: [
			"junctionNetworkSourceId",
			"junctionGlobalId",
			"junctionObjectId",
			"junctionFirstUnit",
			"junctionLastUnit"
		] },
		write: !0
	}
})], c.prototype, "junctionElement", void 0), __decorate([o$1("junctionElement")], c.prototype, "readJunctionElement", null), __decorate([r("junctionElement")], c.prototype, "writeJunctionElement", null), c = __decorate([c$1("esri.networks.support.CircuitPathConnectivityElement")], c);
var s = c;
//#endregion
//#region node_modules/@arcgis/core/networks/support/CircuitPath.js
var n = class extends n$3 {
	constructor(t) {
		super(t), this.pathId = null, this.order = null, this.startingPoint = null, this.stoppingPoint = null, this.pathConnectivity = [], this.geometry = null;
	}
};
__decorate([a$1({
	type: Number,
	json: { write: !0 }
})], n.prototype, "pathId", void 0), __decorate([a$1({
	type: Number,
	json: { write: !0 }
})], n.prototype, "order", void 0), __decorate([a$1({
	type: n$4,
	json: { write: !0 }
})], n.prototype, "startingPoint", void 0), __decorate([a$1({
	type: n$4,
	json: { write: !0 }
})], n.prototype, "stoppingPoint", void 0), __decorate([a$1({
	type: [s],
	json: { write: !0 }
})], n.prototype, "pathConnectivity", void 0), __decorate([a$1({
	type: y$1,
	json: { write: !0 }
})], n.prototype, "geometry", void 0), n = __decorate([c$1("esri.networks.support.CircuitPath")], n);
var y = n;
//#endregion
//#region node_modules/@arcgis/core/networks/support/Subcircuit.js
var p = class extends n$2(n$3) {
	constructor(t) {
		super(t), this.name = null, this.globalId = null, this.providerId = null, this.consumerId = null, this.state = "available", this.attributes = null, this._updateHandler = (t) => {
			const { subcircuitGlobalId: e, name: r, subcircuit: i } = t;
			(e && this.globalId === e || this.name === r) && this.read(i);
		};
	}
	initialize() {
		this.addHandles([a$2(() => this, "update", this._updateHandler)]);
	}
	getAttribute(t) {
		return this.attributes?.[t];
	}
	setAttribute(t, e) {
		this.attributes ? this.attributes[t] = e : this.attributes = { [t]: e };
	}
};
__decorate([a$1({
	type: String,
	json: { write: !0 }
})], p.prototype, "name", void 0), __decorate([a$1({
	type: String,
	json: { write: !0 }
})], p.prototype, "globalId", void 0), __decorate([a$1({ type: String })], p.prototype, "providerId", void 0), __decorate([a$1({ type: String })], p.prototype, "consumerId", void 0), __decorate([a$1({
	type: o$2.apiValues,
	json: {
		type: o$2.jsonValues,
		read: {
			reader: o$2.read,
			source: "state"
		},
		write: {
			writer: o$2.write,
			target: "state"
		}
	}
})], p.prototype, "state", void 0), __decorate([a$1({ json: { write: {
	allowNull: !0,
	writer: (t, e) => e.attributes = t ?? {}
} } })], p.prototype, "attributes", void 0), p = __decorate([c$1("esri.networks.support.Subcircuit")], p);
//#endregion
//#region node_modules/@arcgis/core/networks/support/CircuitSection.js
var d = class extends n$2(n$3) {
	constructor(t) {
		super(t), this.attributes = null, this.globalId = null, this.sectionId = null, this.role = "start-and-end", this.sectionType = "physical", this.startLocation = null, this.stopLocation = null, this.subcircuit = null, this.path = null, this._updateHandler = (t) => {
			const { sectionId: i, section: o } = t;
			this.sectionId === i && this.read(o);
		};
	}
	initialize() {
		this.addHandles([a$2(() => this, "update", this._updateHandler)]);
	}
	normalizeCtorArgs(t) {
		if (void 0 === t) return t;
		const { sectionId: i, startLocation: o, stopLocation: s, subcircuit: r } = t;
		return (o || s) && r ? (delete t.startLocation, delete t.stopLocation, n$1.getLogger(this).warn("Cannot instantiate CircuitSection with both start/stop locations and subcircuit.", `CircuitSection with ID '${i}' was defaulted to having a subcircuit only.`)) : (o && !s || !o && s) && !r && n$1.getLogger(this).warn(`CircuitSection with ID '${i}' must have both start and stop locations.`, "Create/alter operations involving this section will fail unless both are populated."), t;
	}
	setStartStopLocations(t, i) {
		this.startLocation = t, this.stopLocation = i, this.subcircuit = null;
	}
	setSubcircuit(t) {
		this.subcircuit = t, this.startLocation = null, this.stopLocation = null;
	}
	getAttribute(t) {
		return this.attributes?.[t];
	}
	setAttribute(t, i) {
		this.attributes ? this.attributes[t] = i : this.attributes = { [t]: i };
	}
};
__decorate([a$1({ json: { write: {
	allowNull: !0,
	writer: (t, i) => i.attributes = t ?? {}
} } })], d.prototype, "attributes", void 0), __decorate([a$1({
	type: String,
	json: { write: !0 }
})], d.prototype, "globalId", void 0), __decorate([a$1({
	type: Number,
	json: { write: !0 }
})], d.prototype, "sectionId", void 0), __decorate([a$1({
	type: e$1.apiValues,
	json: {
		type: e$1.jsonValues,
		read: e$1.read
	},
	readOnly: !0
})], d.prototype, "role", void 0), __decorate([a$1({
	type: i.apiValues,
	json: {
		type: i.jsonValues,
		read: i.read,
		write: i.write
	}
})], d.prototype, "sectionType", void 0), __decorate([a$1({
	type: s$2,
	json: { write: !0 }
})], d.prototype, "startLocation", void 0), __decorate([a$1({
	type: s$2,
	json: { write: !0 }
})], d.prototype, "stopLocation", void 0), __decorate([a$1({
	type: p,
	json: { write: !0 }
})], d.prototype, "subcircuit", void 0), __decorate([a$1({
	type: y,
	readOnly: !0
})], d.prototype, "path", void 0), d = __decorate([c$1("esri.networks.support.CircuitSection")], d);
//#endregion
//#region node_modules/@arcgis/core/networks/support/jsonHelpers.js
var t = new Set([
	"objectid",
	"circuitid",
	"sectionid",
	"startlocationsourceid",
	"startlocationid",
	"startlocationfirstunit",
	"startlocationlastunit",
	"stoplocationsourceid",
	"stoplocationid",
	"stoplocationfirstunit",
	"stoplocationlastunit",
	"role",
	"sectiontype",
	"globalid",
	"created_user",
	"created_date",
	"last_edited_user",
	"last_edited_date"
]), e = new Set([
	"objectid",
	"name",
	"providerid",
	"consumerid",
	"globalid",
	"created_user",
	"created_date",
	"last_edited_user",
	"last_edited_date"
]);
function o(e, o) {
	const a = e.fieldsIndex, n = {}, s = o.attributes[a.get("sectionId").name];
	null != s && (n.sectionId = s);
	const i = o.attributes[a.get("startLocationSourceId").name], r = o.attributes[a.get("startLocationId").name], l = o.attributes[a.get("startLocationFirstUnit").name], c = o.attributes[a.get("startLocationLastUnit").name];
	null != i && null != r && (n.startLocation = {
		sourceId: i,
		globalId: r,
		firstUnit: l,
		lastUnit: c
	});
	const d = o.attributes[a.get("stopLocationSourceId").name], u = o.attributes[a.get("stopLocationId").name], b = o.attributes[a.get("stopLocationFirstUnit").name], m = o.attributes[a.get("stopLocationLastUnit").name];
	null != d && null != u && (n.stopLocation = {
		sourceId: d,
		globalId: u,
		firstUnit: b,
		lastUnit: m
	});
	const g = a.get("role"), I = o.attributes[g.name];
	if (null != I) n.role = g.domain.getName(I);
	const p = a.get("sectionType"), L = o.attributes[p.name];
	if (null != L) n.sectionType = p.domain.getName(L);
	const f = o.attributes[a.get("globalId").name];
	null != f && (n.globalId = f);
	const _ = {};
	for (const [U, v] of Object.entries(o.attributes)) t.has(U.toLocaleLowerCase()) || (_[U] = v);
	return n.attributes = _, n;
}
function a(t, o) {
	const a = t.fieldsIndex, n = {}, s = o.attributes[a.get("globalId").name];
	null != s && (n.globalId = s);
	const i = o.attributes[a.get("name").name];
	null != i && (n.name = i);
	const r = o.attributes[a.get("providerId").name];
	null != r && (n.providerId = r);
	const l = o.attributes[a.get("consumerId").name];
	null != l && (n.consumerId = l), n.state = l ? r === l ? "Reserved" : "Consumed" : "Available";
	const c = {};
	for (const [d, u] of Object.entries(o.attributes)) e.has(d.toLocaleLowerCase()) || (c[d] = u);
	return n.attributes = c, n;
}
//#endregion
//#region node_modules/@arcgis/core/networks/support/Circuit.js
var L = new Set([
	"objectid",
	"name",
	"sectionorder",
	"status",
	"isdeleted",
	"lastverified",
	"lastexported",
	"startlocationsourceid",
	"startlocationid",
	"startlocationfirstunit",
	"startlocationlastunit",
	"stoplocationsourceid",
	"stoplocationid",
	"stoplocationfirstunit",
	"stoplocationlastunit",
	"issectioned",
	"circuittype",
	"conflictcontainerstate",
	"globalid",
	"created_user",
	"created_date",
	"last_edited_user",
	"last_edited_date"
]);
var S = class extends n$2(n$3) {
	constructor(t) {
		super(t), this._sectionIdLookup = /* @__PURE__ */ new Map(), this._status = "dirty", this._lastVerifiedTime = null, this._lastExportedTime = null, this._isDeleted = !1, this.attributes = null, this.circuitManager = null, this.circuitType = "physical", this.globalId = null, this.name = null, this.sections = null, this.startLocation = null, this.stopLocation = null, this.subcircuits = [], this._applyEditsHandler = (t) => {
			const { serviceUrl: i, gdbVersion: e, result: s } = t;
			if (this.circuitManager) {
				const t = this.circuitManager.featureServiceUrl, s = this.circuitManager.gdbVersion;
				if (i !== t || !g(i, e, s)) return;
			}
			s.then((s) => {
				if (!this.circuitManager) return;
				const r = this.circuitManager.featureServiceUrl, o = this.circuitManager.gdbVersion;
				if (i !== r || !g(i, e, o)) return;
				const a = this.circuitManager.circuitTable, c = this.circuitManager.circuitSectionTable, n = this.circuitManager.subcircuitTable;
				if (!a.loaded || !c.loaded || !n.loaded) return void console.warn(`Circuit tables not loaded yet, skipping edit handling for circuit ${this.name}.`);
				const u = a?.layerId, d = c?.layerId, p = n?.layerId, h = s.editedFeatures?.find(({ layerId: t }) => t === u), b = s.editedFeatures?.find(({ layerId: t }) => t === d), g$1 = s.editedFeatures?.find(({ layerId: t }) => t === p);
				if (!h && !b && !g$1) return;
				const f = {
					serviceUrl: t.serviceUrl,
					layerId: u,
					gdbVersion: t.gdbVersion,
					globalId: this.globalId,
					circuitEdit: null,
					sectionAdds: [],
					sectionUpdates: [],
					sectionDeletes: [],
					sectionSubcircuits: [],
					subcircuitAdds: [],
					subcircuitUpdates: [],
					subcircuitDeletes: []
				};
				if (h) {
					const { adds: t, updates: i } = h.editedFeatures, e = a.globalIdField, s = t.find(({ attributes: t }) => t[e] === this.globalId), r = i.find(({ current: t }) => t.attributes[e] === this.globalId);
					f.circuitEdit = s ?? r?.current;
				}
				if (b) {
					const { adds: t, updates: i, deletes: e } = b.editedFeatures, s = c.fieldsIndex.get("circuitId").name, r = t.filter(({ attributes: t }) => t[s] === this.globalId), o = i.filter(({ original: t }) => t.attributes[s] === this.globalId), a = e.filter(({ attributes: t }) => t[s] === this.globalId);
					f.sectionAdds = r, f.sectionUpdates = o, f.sectionDeletes = a;
				}
				if (g$1) {
					const { adds: t, updates: i, deletes: e } = g$1.editedFeatures, s = n.fieldsIndex.get("providerId").name, r = n.fieldsIndex.get("consumerId").name, o = [], a = [], c = [];
					t.forEach((t) => {
						t.attributes[s] === this.globalId ? o.push(t) : t.attributes[r] === this.globalId && c.push(t);
					}), i.forEach((t) => {
						t.original.attributes[s] === this.globalId ? a.push(t) : t.current.attributes[r] === this.globalId && c.push(t.current);
					});
					const u = e.filter(({ attributes: t }) => t[s] === this.globalId);
					f.subcircuitAdds = o, f.subcircuitUpdates = a, f.subcircuitDeletes = u, f.sectionSubcircuits = c;
				}
				this.emit("edits", f);
			}).catch((t) => {
				console.error("Error processing apply edits result for circuit edits.", t);
			});
		}, this._editsHandler = (t) => {
			const { serviceUrl: i, layerId: e, gdbVersion: s, globalId: r, circuitEdit: o } = t;
			if (!this.circuitManager) return;
			const a = this.circuitManager.circuitTable, c = a.layerId, n = this.circuitManager.featureServiceUrl, u = this.circuitManager.gdbVersion;
			if (i !== n || !g(i, s, u) || e !== c || r !== this.globalId) return;
			this._handleCircuitEdits(o);
			const d = a.fieldsIndex.get("sectionOrder").name, p = o?.attributes[d], h = p ? JSON.parse(p) : null;
			this._handleSectionEdits(t, h), this._handleSubcircuitEdits(t);
		};
	}
	initialize() {
		this.addHandles([
			l(() => this.sections, (t) => {
				this._sectionIdLookup.clear(), null != t && Array.from(t.keys()).forEach((t) => this._sectionIdLookup.set(t.sectionId, t));
			}, h),
			l$1(this._applyEditsHandler),
			a$2(() => this, "edits", this._editsHandler)
		]);
	}
	normalizeCtorArgs(t) {
		if (void 0 === t) return t;
		const { name: i, startLocation: e, stopLocation: s, sections: o } = t;
		return (e || s) && o ? (delete t.startLocation, delete t.stopLocation, n$1.getLogger(this).warn("Cannot instantiate Circuit with both start/stop locations and sections.", `Circuit '${i}' was defaulted to having sections only.`)) : (e && !s || !e && s) && !o && n$1.getLogger(this).warn(`Non-sectioned circuit '${i}' must have both start and stop locations.`, "Create/alter operations involving this circuit will fail unless both are populated."), t;
	}
	get isDeleted() {
		return this._isDeleted;
	}
	readIsDeleted(t, i) {
		return this._isDeleted = i.isDeleted ?? !1, this._isDeleted;
	}
	get isSectioned() {
		return null == this.startLocation && null == this.stopLocation && null != this.sections;
	}
	get lastExportedTime() {
		return this._lastExportedTime;
	}
	readLastExportedTime(t, i) {
		const e = i.lastExportedTime;
		return this._lastExportedTime = "number" == typeof e ? new Date(e) : null, this._lastExportedTime;
	}
	get lastVerifiedTime() {
		return this._lastVerifiedTime;
	}
	readLastVerifiedTime(t, i) {
		const e = i.lastVerifiedTime;
		return this._lastVerifiedTime = "number" == typeof e ? new Date(e) : null, this._lastVerifiedTime;
	}
	readSections(t, i) {
		const { sectionOrder: e, sections: s } = i;
		return null == s ? null : (this._sectionIdLookup.clear(), s.forEach((t) => this._sectionIdLookup.set(t.sectionId, d.fromJSON(t))), this._createSectionMap(e));
	}
	writeSections(t, i) {
		const e = {}, s = [];
		t?.forEach((t, i) => {
			const r = i.sectionId.toString();
			e[r] = t.map((t) => t.sectionId), s.push(i.toJSON());
		}), i.sectionOrder = e, i.sections = s;
	}
	get status() {
		return this._status;
	}
	readStatus(t, i) {
		const e = i.status;
		return this._status = e ? t$1.fromJSON(e) : "dirty", this._status;
	}
	_createSectionMap(t, e = /* @__PURE__ */ new Map()) {
		if (e.clear(), null == t) {
			for (const t of this._sectionIdLookup.values()) e.set(t, []);
			return e;
		}
		for (const [s, r] of Object.entries(t)) {
			const t = Number(s), o = this._sectionIdLookup.get(t);
			if (null == o) continue;
			const a = r.map((t) => this._sectionIdLookup.get(t)).filter(N);
			e.set(o, a);
		}
		return e;
	}
	_handleCircuitEdits(t) {
		t && (this._handleSystemPropertyEdits(t), this._handleUserDefinedAttributeEdits(t));
	}
	_handleSystemPropertyEdits(t) {
		if (!this.circuitManager) return;
		const i$1 = this.circuitManager.circuitTable.fieldsIndex, e = this._getCircuitAttribute(t, "lastExported");
		void 0 !== e && (this._lastExportedTime = e ? new Date(e) : null);
		const s = this._getCircuitAttribute(t, "lastVerified");
		void 0 !== s && (this._lastVerifiedTime = s ? new Date(s) : null);
		const r = this._getCircuitAttribute(t, "isDeleted");
		void 0 !== r && (this._isDeleted = 0 !== r);
		if (0 === this._getCircuitAttribute(t, "isSectioned")) {
			const i = this._getCircuitAttribute(t, "startLocationSourceId"), e = this._getCircuitAttribute(t, "startLocationId"), s = this._getCircuitAttribute(t, "startLocationFirstUnit"), r = this._getCircuitAttribute(t, "startLocationLastUnit"), o = this._getCircuitAttribute(t, "stopLocationSourceId"), a = this._getCircuitAttribute(t, "stopLocationId"), c = this._getCircuitAttribute(t, "stopLocationFirstUnit"), n = this._getCircuitAttribute(t, "stopLocationLastUnit");
			this.setStartStopLocations(new s$2({
				sourceId: i,
				globalId: e,
				firstUnit: s,
				lastUnit: r
			}), new s$2({
				sourceId: o,
				globalId: a,
				firstUnit: c,
				lastUnit: n
			}));
		}
		const o = i$1.get("circuitType"), a = this._getCircuitAttribute(t, "circuitType");
		if (null != a) {
			const t = o.domain.getName(a);
			this.circuitType = i.read(t);
		}
		const c = i$1.get("status"), n = this._getCircuitAttribute(t, "status");
		if (null != n) {
			const t = c.domain.getName(n);
			this._status = t$1.fromJSON(t);
		}
		const u = i$1.get("name").name, l = t.attributes[u];
		void 0 !== l && (this.name = l);
	}
	_handleUserDefinedAttributeEdits(t) {
		const i = {};
		for (const [e, s] of Object.entries(t.attributes)) L.has(e.toLocaleLowerCase()) || (i[e] = s);
		this.attributes = i;
	}
	_applySectionEdits(t, i, e) {
		if (!this.circuitManager) return;
		const { sectionSubcircuits: s } = t, r = this.circuitManager.subcircuitTable, o = this.circuitManager.telecomDomainNetwork.circuitSources?.find((t) => "esriUNFCUTSubcircuit" === t.utilityNetworkFeatureClassUsageType)?.sourceId;
		if (e.startLocation?.sourceId === o && !e.stopLocation) {
			const t = r.globalIdField, i = s?.find((i) => i.attributes[t] === e.startLocation.globalId);
			if (i) e.subcircuit = a(r, i), e.startLocation = void 0;
		}
		const a$3 = this._sectionIdLookup.get(i);
		if (a$3) {
			const s = this.circuitManager.circuitSectionTable.layerId;
			a$3.emit("update", {
				serviceUrl: t.serviceUrl,
				layerId: s,
				gdbVersion: t.gdbVersion,
				circuitGlobalId: this.globalId,
				sectionId: i,
				section: e
			});
		} else {
			const t = d.fromJSON(e);
			this._sectionIdLookup.set(t.sectionId, t);
		}
	}
	_handleSectionEdits(t, i) {
		if (!this.circuitManager) return;
		const { sectionAdds: e, sectionUpdates: s, sectionDeletes: r } = t, o$3 = this.circuitManager.circuitSectionTable, a = o$3.fieldsIndex, c = a.get("globalId").name, n = a.get("sectionId").name;
		r.forEach((t) => {
			const i = t.attributes[n];
			if (void 0 !== i) return void this._sectionIdLookup.delete(i);
			const e = t.attributes[c], s = Array.from(this._sectionIdLookup.values()).find((t) => t.globalId === e);
			s && this._sectionIdLookup.delete(s.sectionId);
		}), s.forEach((i) => {
			const e = i.original, s = i.current, r = o(o$3, s);
			this._applySectionEdits(t, e.attributes[n], r);
		}), e.forEach((i) => {
			const e = o(o$3, i);
			this._applySectionEdits(t, i.attributes[n], e);
		}), this.sections = this._createSectionMap(i, this.sections ?? void 0);
	}
	_handleSubcircuitEdits(t) {
		if (!this.circuitManager) return;
		const { subcircuitAdds: i, subcircuitUpdates: e, subcircuitDeletes: s } = t, r = this.circuitManager.subcircuitTable, o = r.layerId, a$5 = r.fieldsIndex, c = r.globalIdField, n = a$5.get("name").name;
		s.forEach((t) => {
			const i = t.attributes[c], e = this.subcircuits?.findIndex((t) => t.globalId === i);
			-1 !== e && this.subcircuits?.splice(e, 1);
		}), e.forEach((i) => {
			const e = i.original, s = i.current, a$4 = e.attributes[c], u = e.attributes[n], l = a(r, s), d = this.subcircuits.find((t) => t.globalId === a$4 || t.name.toLocaleLowerCase() === u.toLocaleLowerCase()) ?? this.subcircuits.find((t) => t.name.toLocaleLowerCase() === l.name.toLocaleLowerCase());
			if (d) d.emit("update", {
				serviceUrl: t.serviceUrl,
				layerId: o,
				gdbVersion: t.gdbVersion,
				circuitGlobalId: this.globalId,
				subcircuitGlobalId: a$4,
				name: l.name,
				subcircuit: l
			});
			else {
				const t = p.fromJSON(l);
				this.subcircuits.push(t);
			}
		}), i.forEach((i) => {
			const e = a(r, i), s = i.attributes[n], a$6 = i.attributes[c], u = this.subcircuits.find((t) => t.name.toLocaleLowerCase() === s.toLocaleLowerCase());
			if (u) u.emit("update", {
				serviceUrl: t.serviceUrl,
				layerId: o,
				gdbVersion: t.gdbVersion,
				circuitGlobalId: this.globalId,
				subcircuitGlobalId: a$6,
				name: e.name,
				subcircuit: e
			});
			else {
				const t = p.fromJSON(e);
				this.subcircuits.push(t);
			}
		});
	}
	_getCircuitAttribute(t, i) {
		const e = this.circuitManager?.circuitTable?.fieldsIndex.get(i)?.name;
		return t.attributes[e ?? ""];
	}
	getSectionById(t) {
		return this._sectionIdLookup.get(t) ?? null;
	}
	setStartStopLocations(t, i) {
		this.startLocation = t, this.stopLocation = i, this.sections = null;
	}
	setSections(t) {
		this.sections = t, this.startLocation = null, this.stopLocation = null;
	}
	getAttribute(t) {
		return this.attributes?.[t];
	}
	setAttribute(t, i) {
		this.attributes ? this.attributes[t] = i : this.attributes = { [t]: i };
	}
};
__decorate([a$1({ json: { write: {
	allowNull: !0,
	writer: (t, i) => i.attributes = t ?? {}
} } })], S.prototype, "attributes", void 0), __decorate([a$1()], S.prototype, "circuitManager", void 0), __decorate([a$1({
	type: i.apiValues,
	json: {
		type: i.jsonValues,
		read: i.read,
		write: i.write
	}
})], S.prototype, "circuitType", void 0), __decorate([a$1({
	type: String,
	json: { write: !0 }
})], S.prototype, "globalId", void 0), __decorate([a$1({
	type: Boolean,
	readOnly: !0
})], S.prototype, "isDeleted", null), __decorate([o$1("isDeleted")], S.prototype, "readIsDeleted", null), __decorate([a$1({
	type: Boolean,
	json: { write: !0 },
	readOnly: !0
})], S.prototype, "isSectioned", null), __decorate([a$1({
	type: Date,
	readOnly: !0
})], S.prototype, "lastExportedTime", null), __decorate([o$1("lastExportedTime")], S.prototype, "readLastExportedTime", null), __decorate([a$1({
	type: Date,
	readOnly: !0
})], S.prototype, "lastVerifiedTime", null), __decorate([o$1("lastVerifiedTime")], S.prototype, "readLastVerifiedTime", null), __decorate([a$1({
	type: String,
	json: { write: !0 }
})], S.prototype, "name", void 0), __decorate([a$1({ json: {
	read: { source: ["sectionOrder", "sections"] },
	write: !0
} })], S.prototype, "sections", void 0), __decorate([o$1("sections")], S.prototype, "readSections", null), __decorate([r("sections")], S.prototype, "writeSections", null), __decorate([a$1({
	type: s$2,
	json: { write: !0 }
})], S.prototype, "startLocation", void 0), __decorate([a$1({
	type: t$1.apiValues,
	json: {
		type: t$1.jsonValues,
		read: t$1.read
	}
})], S.prototype, "status", null), __decorate([o$1("status")], S.prototype, "readStatus", null), __decorate([a$1({
	type: s$2,
	json: { write: !0 }
})], S.prototype, "stopLocation", void 0), __decorate([a$1({
	type: [p],
	json: { write: !0 }
})], S.prototype, "subcircuits", void 0), S = __decorate([c$1("esri.networks.support.Circuit")], S);
//#endregion
export { y as n, S as t };

//# sourceMappingURL=Circuit-B-XJxsTt.js.map