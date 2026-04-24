import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c$1, t as a } from "./decorators-DE7S5xmd.js";
import { t as p$1 } from "./FeatureEffect-CWwUJtCe.js";
//#region node_modules/@arcgis/core/layers/mixins/FeatureEffectLayer.js
var s = { write: { allowNull: !0 } }, p = {
	type: p$1,
	json: { origins: {
		"web-map": s,
		"portal-item": s
	} }
}, c = (o) => {
	const s = o;
	let c = class extends s {
		constructor() {
			super(...arguments), this.featureEffect = null;
		}
	};
	return __decorate([a(p)], c.prototype, "featureEffect", void 0), c = __decorate([c$1("esri.layers.mixins.FeatureEffectLayer")], c), c;
};
//#endregion
export { p as n, c as t };

//# sourceMappingURL=FeatureEffectLayer-BmFDjIrd.js.map