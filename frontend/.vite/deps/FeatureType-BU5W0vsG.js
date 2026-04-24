import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { a as o, i as r, n as c, t as a } from "./decorators-DE7S5xmd.js";
import { n as n$1 } from "./JSONSupport-BUaD4jSd.js";
import { n as l } from "./Clonable-D_RHUyXD.js";
import { n as i } from "./Field-jzopk-Sr.js";
import { t as a$1 } from "./FeatureTemplate-C8v81uvW.js";
//#region node_modules/@arcgis/core/layers/support/FeatureType.js
var n = class extends l(n$1) {
	constructor(o) {
		super(o), this.id = null, this.name = null, this.domains = null, this.templates = null;
	}
	readDomains(o) {
		const r = {};
		for (const t of Object.keys(o)) r[t] = i(o[t]);
		return r;
	}
	writeDomains(o, r) {
		const t = {};
		for (const e of Object.keys(o)) o[e] && (t[e] = o[e]?.toJSON());
		r.domains = t;
	}
};
__decorate([a({ json: { write: !0 } })], n.prototype, "id", void 0), __decorate([a({ json: { write: !0 } })], n.prototype, "name", void 0), __decorate([a({ json: { write: !0 } })], n.prototype, "domains", void 0), __decorate([o("domains")], n.prototype, "readDomains", null), __decorate([r("domains")], n.prototype, "writeDomains", null), __decorate([a({
	type: [a$1],
	json: { write: !0 }
})], n.prototype, "templates", void 0), n = __decorate([c("esri.layers.support.FeatureType")], n);
//#endregion
export { n as t };

//# sourceMappingURL=FeatureType-BU5W0vsG.js.map