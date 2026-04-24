import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { a as o, i as r, n as c, t as a$1 } from "./decorators-DE7S5xmd.js";
import { n as n$2 } from "./JSONSupport-BUaD4jSd.js";
import { t as j } from "./Polygon-CCBjbbXT.js";
import { t as y } from "./Polyline-Cv0nwof6.js";
import { t as m } from "./Multipoint-B5Liskmz.js";
import { t as p } from "./NetworkElement-Bc_17I9h.js";
import { t as s$1 } from "./TelecomNetworkElement-CK1MxXNb.js";
import { n as y$1, t as S } from "./Circuit-B-XJxsTt.js";
//#region node_modules/@arcgis/core/rest/networks/circuits/support/CircuitTraceResult.js
var u = class extends n$2 {
	constructor(t) {
		super(t), this.circuit = null, this.geometry = null, this.path = null;
	}
	readCircuit(t, r) {
		return S.fromJSON(r);
	}
};
__decorate([a$1({ json: {
	type: S,
	write: !0,
	read: { source: [
		"name",
		"globalId",
		"isSectioned",
		"sectionOrder",
		"startLocation",
		"stopLocation",
		"sections",
		"subcircuits",
		"lastVerifiedTime",
		"lastExportedTime",
		"circuitType",
		"status"
	] }
} })], u.prototype, "circuit", void 0), __decorate([o("circuit")], u.prototype, "readCircuit", null), __decorate([a$1({
	type: y,
	json: { write: !0 }
})], u.prototype, "geometry", void 0), __decorate([a$1({
	type: y$1,
	json: { write: !0 }
})], u.prototype, "path", void 0), u = __decorate([c("esri.rest.networks.circuits.support.CircuitTraceResult")], u);
var a = u;
//#endregion
//#region node_modules/@arcgis/core/rest/networks/support/AggregatedGeometry.js
var n$1 = class extends n$2 {
	constructor(o) {
		super(o), this.line = null, this.multipoint = null, this.polygon = null;
	}
};
__decorate([a$1({
	type: y,
	json: { write: !0 },
	readOnly: !0
})], n$1.prototype, "line", void 0), __decorate([a$1({
	type: m,
	json: {
		read: { source: "point" },
		write: { target: "point" }
	},
	readOnly: !0
})], n$1.prototype, "multipoint", void 0), __decorate([a$1({
	type: j,
	json: { write: !0 },
	readOnly: !0
})], n$1.prototype, "polygon", void 0), n$1 = __decorate([c("esri.rest.networks.support.AggregatedGeometry")], n$1);
var l = n$1;
//#endregion
//#region node_modules/@arcgis/core/rest/networks/support/FunctionResult.js
var s = class extends n$2 {
	constructor(t) {
		super(t), this.functionType = null, this.networkAttributeName = null, this.result = null;
	}
};
__decorate([a$1({
	type: [
		"add",
		"subtract",
		"average",
		"count",
		"min",
		"max"
	],
	json: { write: !0 },
	readOnly: !0
})], s.prototype, "functionType", void 0), __decorate([a$1({
	type: String,
	json: { write: !0 },
	readOnly: !0
})], s.prototype, "networkAttributeName", void 0), __decorate([a$1({
	type: Number,
	json: { write: !0 },
	readOnly: !0
})], s.prototype, "result", void 0), s = __decorate([c("esri.rest.networks.support.FunctionResult")], s);
var n = s;
//#endregion
//#region node_modules/@arcgis/core/rest/networks/support/TraceResult.js
var d = class extends n$2 {
	constructor(e) {
		super(e), this.aggregatedGeometry = null, this.circuits = null, this.elements = null, this.globalFunctionResults = null, this.kFeaturesForKNNFound = !1, this.paths = null, this.startingPointsIgnored = !1, this.warnings = null;
	}
	readNetworkElements(e, t) {
		return null != t.elements && Array.isArray(t.elements) ? t.elements.map((e) => "firstUnit" in e && "lastUnit" in e ? new s$1({ ...e }) : new p({ ...e })) : [];
	}
	writeNetworkElements(e, t) {
		t.elements = e.map((e) => e.toJSON());
	}
};
__decorate([a$1({
	type: l,
	json: { write: !0 },
	readOnly: !0
})], d.prototype, "aggregatedGeometry", void 0), __decorate([a$1({
	type: [a],
	json: { write: !0 },
	readOnly: !0
})], d.prototype, "circuits", void 0), __decorate([a$1({
	type: [p],
	json: { write: !0 },
	readOnly: !0
})], d.prototype, "elements", void 0), __decorate([o("elements")], d.prototype, "readNetworkElements", null), __decorate([r("elements")], d.prototype, "writeNetworkElements", null), __decorate([a$1({
	type: [n],
	json: { write: !0 },
	readOnly: !0
})], d.prototype, "globalFunctionResults", void 0), __decorate([a$1({
	type: Boolean,
	json: { write: !0 },
	readOnly: !0
})], d.prototype, "kFeaturesForKNNFound", void 0), __decorate([a$1({
	type: [y$1],
	json: { write: !0 },
	readOnly: !0
})], d.prototype, "paths", void 0), __decorate([a$1({
	type: Boolean,
	json: { write: !0 },
	readOnly: !0
})], d.prototype, "startingPointsIgnored", void 0), __decorate([a$1({
	type: [String],
	json: { write: !0 },
	readOnly: !0
})], d.prototype, "warnings", void 0), d = __decorate([c("esri.rest.networks.support.TraceResult")], d);
//#endregion
export { d as t };

//# sourceMappingURL=TraceResult-DRxRVEMl.js.map