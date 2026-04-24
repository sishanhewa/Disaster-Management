import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import { n as n$1 } from "./JSONSupport-BUaD4jSd.js";
import { n as l } from "./Clonable-D_RHUyXD.js";
import { n as c$1 } from "./typeUtils-CFnTDMtU.js";
//#region node_modules/@arcgis/core/rest/networks/support/TraceLocation.js
var s = class extends l(n$1) {
	constructor(t) {
		super(t), this.globalId = null, this.isFilterBarrier = !1, this.percentAlong = null, this.terminalId = null, this.type = null, this.firstUnit = null, this.lastUnit = null, this.networkSourceId = null;
	}
};
__decorate([a({
	type: String,
	json: { write: !0 }
})], s.prototype, "globalId", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], s.prototype, "isFilterBarrier", void 0), __decorate([a({
	type: Number,
	json: { write: !0 }
})], s.prototype, "percentAlong", void 0), __decorate([a({
	type: Number,
	json: { write: !0 }
})], s.prototype, "terminalId", void 0), __decorate([a({
	type: c$1.apiValues,
	json: {
		type: c$1.jsonValues,
		read: {
			reader: c$1.read,
			source: "traceLocationType"
		},
		write: {
			writer: c$1.write,
			target: "traceLocationType"
		}
	}
})], s.prototype, "type", void 0), __decorate([a({
	type: Number,
	json: { write: !0 }
})], s.prototype, "firstUnit", void 0), __decorate([a({
	type: Number,
	json: { write: !0 }
})], s.prototype, "lastUnit", void 0), __decorate([a({ type: Number })], s.prototype, "networkSourceId", void 0), s = __decorate([c("esri.rest.networks.support.TraceLocation")], s);
var n = s;
//#endregion
export { n as t };

//# sourceMappingURL=TraceLocation-DqkqiD8w.js.map