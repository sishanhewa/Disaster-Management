import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
//#region node_modules/@arcgis/core/rest/networks/support/ValidateNetworkTopologyResult.js
var s = class extends n {
	constructor(e) {
		super(e), this.moment = null, this.fullUpdate = !1, this.validateErrorsCreated = !1, this.exceededTransferLimit = null, this.serviceEdits = null, this.discoveredSubnetworks = null;
	}
};
__decorate([a({
	type: Date,
	json: {
		type: Number,
		write: { writer: (e, t) => {
			t.moment = e ? e.getTime() : null;
		} }
	}
})], s.prototype, "moment", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], s.prototype, "fullUpdate", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], s.prototype, "validateErrorsCreated", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], s.prototype, "exceededTransferLimit", void 0), __decorate([a({
	type: [Object],
	json: { write: !0 }
})], s.prototype, "serviceEdits", void 0), __decorate([a({
	type: [Object],
	json: { write: !0 }
})], s.prototype, "discoveredSubnetworks", void 0), s = __decorate([c("esri.rest.networks.support.ValidateNetworkTopologyResult")], s);
var i = s;
//#endregion
export { i as t };

//# sourceMappingURL=ValidateNetworkTopologyResult-zrzK2gHd.js.map