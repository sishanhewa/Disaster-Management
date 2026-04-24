import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c } from "./decorators-DE7S5xmd.js";
import { i as p } from "./util-xsku_21L.js";
import { t as s } from "./AGraphicContainer-DMaCFMbh.js";
//#region node_modules/@arcgis/core/views/2d/layers/graphics/HighlightGraphicContainer.js
var i = class extends s {
	get hasHighlight() {
		return this.children.some((r) => r.hasData);
	}
	renderChildren(r) {
		this.attributeView.update(), 16 === r.drawPhase && this.children.some((r) => r.hasData) && (super.renderChildren(r), r.context.setColorMask(!0, !0, !0, !0), p(r, !1, (r) => {
			this._renderChildren(r, 1);
		}));
	}
};
i = __decorate([c("esri.views.2d.layers.graphics.HighlightGraphicContainer")], i);
//#endregion
export { i as t };

//# sourceMappingURL=HighlightGraphicContainer-C1moIWu7.js.map