import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./promiseUtils-DhYhergm.js";
import { A as m, i as r, n as c$1, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import { n as n$1 } from "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
//#region node_modules/@arcgis/core/rest/networks/unitIdentifiers/support/ResetParameters.js
var c;
var i = c = class extends n$1 {
	static from(o) {
		return m(c, o);
	}
	constructor(o) {
		super(o), this.objects = null, this.gdbVersion = null, this.sessionId = null;
	}
	writeObjects(o, r) {
		const t = /* @__PURE__ */ new Map();
		o.forEach((o) => {
			const { sourceId: r, globalId: e } = o, s = t.get(r);
			s ? s.push(e) : t.set(r, [e]);
		}), r.objects = Array.from(t, ([o, r]) => ({
			sourceId: o,
			globalIds: r
		}));
	}
};
__decorate([a({ json: {
	type: [Object],
	write: !0
} })], i.prototype, "objects", void 0), __decorate([r("objects")], i.prototype, "writeObjects", null), __decorate([a({
	type: String,
	json: { write: !0 }
})], i.prototype, "gdbVersion", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], i.prototype, "sessionId", void 0), i = c = __decorate([c$1("esri.rest.networks.unitIdentifiers.support.ResetParameters")], i);
var n = i;
//#endregion
export { n as default };

//# sourceMappingURL=ResetParameters-COTdN2W6.js.map