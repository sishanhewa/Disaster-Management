import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./promiseUtils-DhYhergm.js";
import { A as m, i as r, n as c, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
import { t as s } from "./CircuitLocation-DO9dNaIi.js";
//#region node_modules/@arcgis/core/rest/networks/circuits/support/QueryCircuitsParameters.js
var p;
var l = p = class extends n {
	static from(t) {
		return m(p, t);
	}
	constructor(t) {
		super(t), this.gdbVersion = null, this.sessionId = null, this.moment = null, this.domainNetworkName = null, this.circuits = null, this.location = null, this.locationType = null, this.returnConsumerCircuits = !1, this.resultTypes = null;
	}
	writeLocation(t, o) {
		null != t && (o.sourceId = t.sourceId, o.globalId = t.globalId, o.firstUnit = t.firstUnit, o.lastUnit = t.lastUnit);
	}
};
__decorate([a({
	type: String,
	json: { write: !0 }
})], l.prototype, "gdbVersion", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], l.prototype, "sessionId", void 0), __decorate([a({
	type: Date,
	json: {
		type: Number,
		write: { writer: (t, o) => {
			o.moment = t ? t.getTime() : null;
		} }
	}
})], l.prototype, "moment", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], l.prototype, "domainNetworkName", void 0), __decorate([a({
	type: [String],
	json: { write: !0 }
})], l.prototype, "circuits", void 0), __decorate([a({
	type: s,
	json: { write: !0 }
})], l.prototype, "location", void 0), __decorate([r("location")], l.prototype, "writeLocation", null), __decorate([a({
	type: String,
	json: { write: !0 }
})], l.prototype, "locationType", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], l.prototype, "returnConsumerCircuits", void 0), __decorate([a({
	type: [String],
	json: { write: !0 }
})], l.prototype, "resultTypes", void 0), l = p = __decorate([c("esri.rest.networks.circuits.support.QueryCircuitsParameters")], l);
var u = l;
//#endregion
export { u as default };

//# sourceMappingURL=QueryCircuitsParameters-CkhTig7P.js.map