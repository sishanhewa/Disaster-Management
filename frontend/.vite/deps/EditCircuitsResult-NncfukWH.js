import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { a as o, n as c, t as a } from "./decorators-DE7S5xmd.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import { t } from "./utils-B_ujaZuz.js";
//#region node_modules/@arcgis/core/rest/networks/circuits/support/EditCircuitsResult.js
var p = class extends n {
	constructor(e) {
		super(e), this.moment = null, this.exceededTransferLimit = !1, this.serviceEdits = null;
	}
	readServiceEdits(e, r) {
		return t(e);
	}
};
__decorate([a({ type: Date })], p.prototype, "moment", void 0), __decorate([a({ type: Boolean })], p.prototype, "exceededTransferLimit", void 0), __decorate([a({ type: [Object] })], p.prototype, "serviceEdits", void 0), __decorate([o("serviceEdits")], p.prototype, "readServiceEdits", null), p = __decorate([c("esri.rest.networks.circuits.support.EditCircuitsResult")], p);
//#endregion
export { p as t };

//# sourceMappingURL=EditCircuitsResult-NncfukWH.js.map