import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./promiseUtils-DhYhergm.js";
import { A as m, n as c, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import { n as n$1 } from "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
//#region node_modules/@arcgis/core/rest/networks/circuits/support/VerifyCircuitsParameters.js
var s;
var n = s = class extends n$1 {
	static from(t) {
		return m(s, t);
	}
	constructor(t) {
		super(t), this.allCircuits = !1, this.circuitNames = null, this.continueOnFailure = !1, this.domainNetworkName = null, this.forceVerify = !1, this.gdbVersion = null, this.sessionId = null, this.synthesizeGeometries = !1;
	}
};
__decorate([a({ json: {
	type: Boolean,
	write: !0
} })], n.prototype, "allCircuits", void 0), __decorate([a({ json: {
	type: [String],
	write: { writer: (t, e) => e.circuits = JSON.stringify(t ?? []) },
	read: { source: "circuits" }
} })], n.prototype, "circuitNames", void 0), __decorate([a({ json: {
	type: Boolean,
	write: !0
} })], n.prototype, "continueOnFailure", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], n.prototype, "domainNetworkName", void 0), __decorate([a({ json: {
	type: Boolean,
	write: !0
} })], n.prototype, "forceVerify", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], n.prototype, "gdbVersion", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], n.prototype, "sessionId", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], n.prototype, "synthesizeGeometries", void 0), n = s = __decorate([c("esri.rest.networks.circuits.support.VerifyCircuitsParameters")], n);
var p = n;
//#endregion
export { p as default };

//# sourceMappingURL=VerifyCircuitsParameters-Cf7fjpoX.js.map