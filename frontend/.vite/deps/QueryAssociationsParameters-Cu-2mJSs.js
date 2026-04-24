import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./promiseUtils-DhYhergm.js";
import { A as m$1, n as c, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import { n as n$1 } from "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
import { c as s } from "./typeUtils-CFnTDMtU.js";
import { t as p } from "./NetworkElement-Bc_17I9h.js";
//#region node_modules/@arcgis/core/rest/networks/support/QueryAssociationsParameters.js
var n;
var m = n = class extends n$1 {
	static from(e) {
		return m$1(n, e);
	}
	constructor(e) {
		super(e), this.returnDeletes = !1, this.elements = [], this.types = [], this.gdbVersion = null, this.moment = null;
	}
};
__decorate([a({
	type: Boolean,
	json: { write: !0 }
})], m.prototype, "returnDeletes", void 0), __decorate([a({
	type: [p],
	json: { write: !0 }
})], m.prototype, "elements", void 0), __decorate([a({
	type: [s.apiValues],
	json: {
		type: s.jsonValues,
		read: s.read,
		write: s.write
	}
})], m.prototype, "types", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], m.prototype, "gdbVersion", void 0), __decorate([a({
	type: Date,
	json: {
		type: Number,
		write: { writer: (e, t) => {
			t.moment = e?.getTime();
		} }
	}
})], m.prototype, "moment", void 0), m = n = __decorate([c("esri.rest.networks.support.QueryAssociationsParameters")], m);
//#endregion
export { m as default };

//# sourceMappingURL=QueryAssociationsParameters-Cu-2mJSs.js.map