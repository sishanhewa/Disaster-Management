import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { a as o, i as r, n as c, t as a } from "./decorators-DE7S5xmd.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import { t as y } from "./Polyline-Cv0nwof6.js";
import { c as s } from "./typeUtils-CFnTDMtU.js";
import { t as p$1 } from "./NetworkElement-Bc_17I9h.js";
import { t as s$1 } from "./TelecomNetworkElement-CK1MxXNb.js";
//#region node_modules/@arcgis/core/rest/networks/support/Association.js
var p = class extends n {
	constructor(t) {
		super(t), this.globalId = null, this.associationType = null, this.fromNetworkElement = null, this.toNetworkElement = null, this.geometry = null, this.errorMessage = null, this.percentAlong = null, this.errorCode = null, this.isContentVisible = null, this.status = null;
	}
	readFromNetworkElement(t, o) {
		return o.fromFirstUnit || o.fromLastUnit ? new s$1({
			globalId: o.fromGlobalId,
			networkSourceId: o.fromNetworkSourceId,
			firstUnit: o.fromFirstUnit,
			lastUnit: o.fromLastUnit
		}) : new p$1({
			globalId: o.fromGlobalId,
			networkSourceId: o.fromNetworkSourceId,
			terminalId: o.fromTerminalId
		});
	}
	writeFromNetworkElement(t, o) {
		if (t && (o.fromGlobalId = t.globalId, o.fromNetworkSourceId = t.networkSourceId, o.fromTerminalId = t.terminalId, "telecomNetworkElement" === t.type)) {
			const e = t;
			o.fromFirstUnit = e.firstUnit, o.fromLastUnit = e.lastUnit;
		}
	}
	readToNetworkElement(t, o) {
		return o.toFirstUnit || o.toLastUnit ? new s$1({
			globalId: o.toGlobalId,
			networkSourceId: o.toNetworkSourceId,
			firstUnit: o.toFirstUnit,
			lastUnit: o.toLastUnit
		}) : new p$1({
			globalId: o.toGlobalId,
			networkSourceId: o.toNetworkSourceId,
			terminalId: o.toTerminalId
		});
	}
	writeToNetworkElement(t, o) {
		if (t && (o.toGlobalId = t.globalId, o.toNetworkSourceId = t.networkSourceId, o.toTerminalId = t.terminalId, "telecomNetworkElement" === t.type)) {
			const e = t;
			o.toFirstUnit = e.firstUnit, o.toLastUnit = e.lastUnit;
		}
	}
	equals(t) {
		if (this.globalId === "{00000000-0000-0000-0000-000000000000}" && t.globalId === "{00000000-0000-0000-0000-000000000000}") {
			function o(t, o) {
				return t.networkSourceId === o.networkSourceId && t.globalId === o.globalId && t.terminalId === o.terminalId && t.firstUnit === o.firstUnit && t.lastUnit === o.lastUnit;
			}
			const e = this.fromNetworkElement, r = this.toNetworkElement, l = t.fromNetworkElement, n = t.toNetworkElement, s = o(e, l), m = o(r, n);
			return s && m && this.associationType === t.associationType;
		}
		return null != this.globalId && null != t.globalId && this.globalId === t.globalId;
	}
};
__decorate([a({
	type: String,
	json: { write: !0 }
})], p.prototype, "globalId", void 0), __decorate([a({
	type: s.apiValues,
	json: {
		type: s.jsonValues,
		read: s.read,
		write: s.write
	}
})], p.prototype, "associationType", void 0), __decorate([a({
	type: p$1,
	json: {
		write: { target: {
			fromGlobalId: { type: String },
			fromNetworkSourceId: { type: Number },
			fromTerminalId: { type: Number },
			fromFirstUnit: { type: Number },
			fromLastUnit: { type: Number }
		} },
		read: { source: [
			"fromGlobalId",
			"fromNetworkSourceId",
			"fromTerminalId",
			"fromFirstUnit",
			"fromLastUnit"
		] }
	}
})], p.prototype, "fromNetworkElement", void 0), __decorate([o("fromNetworkElement")], p.prototype, "readFromNetworkElement", null), __decorate([r("fromNetworkElement")], p.prototype, "writeFromNetworkElement", null), __decorate([a({
	type: p$1,
	json: {
		write: { target: {
			toGlobalId: { type: String },
			toNetworkSourceId: { type: Number },
			toTerminalId: { type: Number },
			toFirstUnit: { type: Number },
			toLastUnit: { type: Number }
		} },
		read: { source: [
			"toGlobalId",
			"toNetworkSourceId",
			"toTerminalId",
			"toFirstUnit",
			"toLastUnit"
		] }
	}
})], p.prototype, "toNetworkElement", void 0), __decorate([o("toNetworkElement")], p.prototype, "readToNetworkElement", null), __decorate([r("toNetworkElement")], p.prototype, "writeToNetworkElement", null), __decorate([a({
	type: y,
	json: { write: !0 }
})], p.prototype, "geometry", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], p.prototype, "errorMessage", void 0), __decorate([a({
	type: Number,
	json: { write: !0 }
})], p.prototype, "percentAlong", void 0), __decorate([a({
	type: Number,
	json: { write: !0 }
})], p.prototype, "errorCode", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], p.prototype, "isContentVisible", void 0), __decorate([a({
	type: Number,
	json: { write: !0 }
})], p.prototype, "status", void 0), p = __decorate([c("esri.rest.networks.support.Association")], p);
var u = p;
//#endregion
export { u as t };

//# sourceMappingURL=Association-CbQaWt5x.js.map