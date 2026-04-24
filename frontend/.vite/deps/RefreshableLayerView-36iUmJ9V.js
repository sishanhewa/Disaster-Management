import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n } from "./Error-CzxduO2m.js";
import { f as d } from "./promiseUtils-DhYhergm.js";
import { n as c } from "./decorators-DE7S5xmd.js";
import { r as a } from "./reactiveUtils-DRpp6Nmg.js";
//#region node_modules/@arcgis/core/views/layers/RefreshableLayerView.js
var i = (i) => {
	const a$1 = i;
	let c$1 = class extends a$1 {
		initialize() {
			this.addHandles(a(() => this.layer, "refresh", (e) => {
				this.doRefresh(e.dataChanged).catch((e) => {
					d(e) || n.getLogger(this).error(e);
				});
			}), "RefreshableLayerView");
		}
	};
	return c$1 = __decorate([c("esri.views.layers.RefreshableLayerView")], c$1), c$1;
};
//#endregion
export { i as t };

//# sourceMappingURL=RefreshableLayerView-36iUmJ9V.js.map