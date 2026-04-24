import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { w as a } from "./Error-CzxduO2m.js";
import { a as o, n as c$1, t as a$1 } from "./decorators-DE7S5xmd.js";
import { n as l } from "./Clonable-D_RHUyXD.js";
import { t as j } from "./Graphic-D2G0Ykqt.js";
import { t as g } from "./FeatureSet-Sjrap7hf.js";
//#region node_modules/@arcgis/core/AttributeBinsGraphic.js
var i$1;
var c = class extends j {
	static {
		i$1 = this;
	}
	constructor(t) {
		super(t), this.stackedAttributes = null;
	}
	cloneShallow() {
		return new i$1(Object.assign({ stackedAttributes: this.stackedAttributes }, super.cloneShallow()));
	}
	toJSON() {
		return {
			...super.toJSON(),
			stackedAttributes: a(this.stackedAttributes)
		};
	}
};
__decorate([a$1()], c.prototype, "stackedAttributes", void 0), c = i$1 = __decorate([c$1("esri.AttributeBinsGraphic")], c);
//#endregion
//#region node_modules/@arcgis/core/rest/support/AttributeBinsFeatureSet.js
var i = class extends l(g) {
	constructor(r) {
		super(r), this.features = [];
	}
	readFeatures(r, t) {
		return this.readFeaturesWithClass(r, t, c);
	}
};
__decorate([a$1({
	type: [c],
	json: { write: !0 }
})], i.prototype, "features", void 0), __decorate([o("features")], i.prototype, "readFeatures", null), i = __decorate([c$1("esri.rest.support.AttributeBinsFeatureSet")], i);
//#endregion
export { i as t };

//# sourceMappingURL=AttributeBinsFeatureSet-C9_UVRGK.js.map