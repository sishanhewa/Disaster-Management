import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c, t as a$1 } from "./decorators-DE7S5xmd.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import { n as o } from "./jsonMap-CFSDFmi6.js";
import { n as l } from "./Clonable-D_RHUyXD.js";
//#region node_modules/@arcgis/core/layers/support/FeatureTemplate.js
var s = new o({
	esriFeatureEditToolAutoCompletePolygon: "auto-complete-polygon",
	esriFeatureEditToolCircle: "circle",
	esriFeatureEditToolEllipse: "ellipse",
	esriFeatureEditToolFreehand: "freehand",
	esriFeatureEditToolLine: "line",
	esriFeatureEditToolNone: "none",
	esriFeatureEditToolPoint: "point",
	esriFeatureEditToolPolygon: "polygon",
	esriFeatureEditToolRectangle: "rectangle",
	esriFeatureEditToolArrow: "arrow",
	esriFeatureEditToolTriangle: "triangle",
	esriFeatureEditToolLeftArrow: "left-arrow",
	esriFeatureEditToolRightArrow: "right-arrow",
	esriFeatureEditToolUpArrow: "up-arrow",
	esriFeatureEditToolDownArrow: "down-arrow"
});
var a = class extends l(n) {
	constructor(o) {
		super(o), this.name = null, this.description = null, this.drawingTool = null, this.prototype = null, this.thumbnail = null;
	}
};
__decorate([a$1({ json: { write: !0 } })], a.prototype, "name", void 0), __decorate([a$1({ json: { write: !0 } })], a.prototype, "description", void 0), __decorate([a$1({ json: {
	read: s.read,
	write: s.write
} })], a.prototype, "drawingTool", void 0), __decorate([a$1({ json: { write: !0 } })], a.prototype, "prototype", void 0), __decorate([a$1({ json: { write: !0 } })], a.prototype, "thumbnail", void 0), a = __decorate([c("esri.layers.support.FeatureTemplate")], a);
//#endregion
export { a as t };

//# sourceMappingURL=FeatureTemplate-C8v81uvW.js.map