import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { l } from "./decorators-DE7S5xmd.js";
//#region node_modules/@arcgis/core/core/Identifiable.js
var r = 0, o = (o) => {
	const s = o;
	let c = class extends s {
		constructor(...t) {
			super(...t), Object.defineProperty(this, "uid", {
				writable: !1,
				configurable: !1,
				value: Date.now().toString(16) + "-object-" + r++
			});
		}
	};
	return c = __decorate([l("esri.core.Identifiable")], c), c;
};
o(class {});
//#endregion
export { o as t };

//# sourceMappingURL=Identifiable-D2tBaz7a.js.map