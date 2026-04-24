import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { w as a } from "./Error-CzxduO2m.js";
import { n as c, t as a$1 } from "./decorators-DE7S5xmd.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import { t as g } from "./Color-C99QAF80.js";
//#region node_modules/@arcgis/core/webmap/background/ColorBackground.js
var p;
var l = p = class extends n {
	constructor(o) {
		super(o), this.color = new g([
			0,
			0,
			0,
			1
		]);
	}
	clone() {
		return new p(a({ color: this.color }));
	}
};
__decorate([a$1({
	type: g,
	json: { write: !0 }
})], l.prototype, "color", void 0), l = p = __decorate([c("esri.webmap.background.ColorBackground")], l);
var i = l;
//#endregion
export { i as t };

//# sourceMappingURL=ColorBackground-4nOPp4ei.js.map