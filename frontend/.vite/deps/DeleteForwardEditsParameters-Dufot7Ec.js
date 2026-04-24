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
import { n } from "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
//#region node_modules/@arcgis/core/rest/versionManagement/gdbVersion/support/DeleteForwardEditsParameters.js
var i;
var p = i = class extends n {
	static from(e) {
		return m$1(i, e);
	}
	constructor(e) {
		super(e), this.sessionId = void 0, this.moment = null;
	}
};
__decorate([a({
	type: String,
	json: { write: !0 }
})], p.prototype, "sessionId", void 0), __decorate([a({
	type: Date,
	json: {
		type: Number,
		write: { writer: (e, r) => {
			r.moment = e ? e.getTime() : null;
		} }
	}
})], p.prototype, "moment", void 0), p = i = __decorate([c("esri.rest.versionManagement.gdbVersion.support.DeleteForwardEditsParameters")], p);
var m = p;
//#endregion
export { m as default };

//# sourceMappingURL=DeleteForwardEditsParameters-Dufot7Ec.js.map