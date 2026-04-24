import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { D as n } from "./promiseUtils-DhYhergm.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
//#region node_modules/@arcgis/core/widgets/support/goToUtils.js
function o(o, t, n) {
	return o.goTo(t, n);
}
//#endregion
//#region node_modules/@arcgis/core/widgets/support/GoTo.js
var i = (i) => {
	const p = i;
	let c$1 = class extends p {
		constructor(...o) {
			super(...o), this.goToOverride = null, this.view = null;
		}
		callGoTo(o$1) {
			const { view: t } = this;
			return n(t), this.goToOverride ? this.goToOverride(t, o$1) : o(t, o$1.target, o$1.options);
		}
	};
	return __decorate([a()], c$1.prototype, "goToOverride", void 0), __decorate([a()], c$1.prototype, "view", void 0), c$1 = __decorate([c("esri.widgets.support.GoTo")], c$1), c$1;
};
//#endregion
export { i as t };

//# sourceMappingURL=GoTo-oQyhRLws.js.map