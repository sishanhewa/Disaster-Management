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
//#region node_modules/@arcgis/core/rest/networks/circuits/support/ExportCircuitsParameters.js
var n;
var l = n = class extends n$1 {
	static from(t) {
		return m(n, t);
	}
	constructor(t) {
		super(t), this.circuitNames = null, this.resultTypes = null, this.exportAcknowledgement = !1, this.moment = null, this.outSpatialReference = null, this.domainNetworkName = null, this.gdbVersion = null, this.sessionId = null;
	}
	writeOutSR(t, e, r) {
		if (null != t) {
			const { wkid: o, latestWkid: i, wkt: s, wkt2: p } = t;
			e[r] = JSON.stringify({
				wkid: o ?? void 0,
				latestWkid: i ?? void 0,
				wkt: s ?? void 0,
				wkt2: p ?? void 0
			});
		}
	}
};
__decorate([a({ json: {
	type: [String],
	write: { writer: (t, e) => e.circuits = JSON.stringify(t ?? []) },
	read: { source: "circuits" }
} })], l.prototype, "circuitNames", void 0), __decorate([a({ json: {
	type: [Object],
	write: { writer: (t, e) => e.resultTypes = JSON.stringify(t ?? []) }
} })], l.prototype, "resultTypes", void 0), __decorate([a({ json: {
	type: Boolean,
	write: !0
} })], l.prototype, "exportAcknowledgement", void 0), __decorate([a({
	type: Date,
	json: {
		type: Number,
		write: { writer: (t, e) => {
			e.moment = t ? t.getTime() : null;
		} }
	}
})], l.prototype, "moment", void 0), __decorate([a({
	type: S,
	json: { write: {
		allowNull: !0,
		target: "outSR"
	} }
})], l.prototype, "outSpatialReference", void 0), __decorate([r("outSpatialReference")], l.prototype, "writeOutSR", null), __decorate([a({
	type: String,
	json: { write: !0 }
})], l.prototype, "domainNetworkName", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], l.prototype, "gdbVersion", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], l.prototype, "sessionId", void 0), l = n = __decorate([c("esri.rest.networks.circuits.support.ExportCircuitsParameters")], l);
var u = l;
//#endregion
export { u as default };

//# sourceMappingURL=ExportCircuitsParameters-BofLiNd2.js.map