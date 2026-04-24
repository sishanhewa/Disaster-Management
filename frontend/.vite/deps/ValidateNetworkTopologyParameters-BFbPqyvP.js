import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { A as m, i as r, n as c, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import { n as n$1 } from "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import { t as S } from "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import { t as z } from "./Extent-CquIzaXp.js";
import { u as u$1 } from "./typeUtils-CFnTDMtU.js";
//#region node_modules/@arcgis/core/rest/networks/support/ValidateNetworkTopologyParameters.js
var n;
var d = n = class extends n$1 {
	static from(t) {
		return m(n, t);
	}
	constructor(t) {
		super(t), this.gdbVersion = null, this.sessionID = null, this.validationType = null, this.validateArea = null, this.validationSet = null, this.outSpatialReference = null;
	}
	writeOutSR(t, e, o) {
		if (null != t) {
			const { wkid: r, latestWkid: i, wkt: s, wkt2: p } = t;
			e[o] = JSON.stringify({
				wkid: r ?? void 0,
				latestWkid: i ?? void 0,
				wkt: s ?? void 0,
				wkt2: p ?? void 0
			});
		}
	}
};
__decorate([a({
	type: String,
	json: { write: !0 }
})], d.prototype, "gdbVersion", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], d.prototype, "sessionID", void 0), __decorate([a({
	type: u$1.apiValues,
	json: {
		type: u$1.jsonValues,
		read: u$1.read,
		write: u$1.write
	}
})], d.prototype, "validationType", void 0), __decorate([a({
	type: z,
	json: { write: !0 }
})], d.prototype, "validateArea", void 0), __decorate([a({
	type: [Object],
	json: { write: !0 }
})], d.prototype, "validationSet", void 0), __decorate([a({
	type: S,
	json: { write: {
		allowNull: !0,
		target: "outSR"
	} }
})], d.prototype, "outSpatialReference", void 0), __decorate([r("outSpatialReference")], d.prototype, "writeOutSR", null), d = n = __decorate([c("esri.rest.networks.support.ValidateNetworkTopologyParameters")], d);
var u = d;
//#endregion
export { u as default };

//# sourceMappingURL=ValidateNetworkTopologyParameters-BFbPqyvP.js.map