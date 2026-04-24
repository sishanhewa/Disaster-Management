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
//#region node_modules/@arcgis/core/rest/networks/unitIdentifiers/support/QueryUnitIdentifiersParameters.js
var p;
var n = p = class extends n$1 {
	static from(t) {
		return m(p, t);
	}
	constructor(t) {
		super(t), this.objects = null, this.moment = null, this.gdbVersion = null, this.sessionId = null;
	}
	writeObjects(t, e) {
		const o = /* @__PURE__ */ new Map();
		t.forEach((t) => {
			const { sourceId: e, globalId: r } = t, s = o.get(e);
			s ? s.push(r) : o.set(e, [r]);
		}), e.objects = Array.from(o, ([t, e]) => ({
			sourceId: t,
			globalIds: e
		}));
	}
};
__decorate([a({ json: {
	type: [Object],
	write: !0
} })], n.prototype, "objects", void 0), __decorate([r("objects")], n.prototype, "writeObjects", null), __decorate([a({
	type: Date,
	json: {
		type: Number,
		write: { writer: (t, e) => {
			e.moment = t ? t.getTime() : null;
		} }
	}
})], n.prototype, "moment", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], n.prototype, "gdbVersion", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], n.prototype, "sessionId", void 0), n = p = __decorate([c$1("esri.rest.networks.unitIdentifiers.support.QueryUnitIdentifiersParameters")], n);
var c = n;
//#endregion
export { c as default };

//# sourceMappingURL=QueryUnitIdentifiersParameters-BeqGbmLa.js.map