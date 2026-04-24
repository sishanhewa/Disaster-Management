import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { A as m, i as r, n as c$1, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import { t as S } from "./SpatialReference-rIfb2LrD.js";
import "./Clonable-D_RHUyXD.js";
import { t as p } from "./UNTraceConfiguration-KHJMMVBN.js";
import { t as a$1 } from "./typeUtils-CFnTDMtU.js";
import { t as n$1 } from "./TraceLocation-DqkqiD8w.js";
//#region node_modules/@arcgis/core/rest/networks/support/TraceParameters.js
var u;
var c = u = class extends n {
	static from(t) {
		return m(u, t);
	}
	constructor(t) {
		super(t), this.namedTraceConfigurationGlobalId = null, this.gdbVersion = null, this.traceLocations = [], this.moment = null, this.outSpatialReference = null, this.traceConfiguration = null, this.resultTypes = null, this.traceType = null;
	}
	writeOutSR(t, o, e) {
		if (null != t) {
			const { wkid: r, latestWkid: i, wkt: s, wkt2: p } = t;
			o[e] = JSON.stringify({
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
	json: {
		read: { source: "traceConfigurationGlobalId" },
		write: { target: "traceConfigurationGlobalId" }
	}
})], c.prototype, "namedTraceConfigurationGlobalId", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], c.prototype, "gdbVersion", void 0), __decorate([a({
	type: [n$1],
	json: { write: !0 }
})], c.prototype, "traceLocations", void 0), __decorate([a({
	type: Date,
	json: {
		type: Number,
		write: { writer: (t, o) => {
			o.moment = t ? t.getTime() : null;
		} }
	}
})], c.prototype, "moment", void 0), __decorate([a({
	type: S,
	json: { write: {
		allowNull: !0,
		target: "outSR"
	} }
})], c.prototype, "outSpatialReference", void 0), __decorate([r("outSpatialReference")], c.prototype, "writeOutSR", null), __decorate([a({
	type: p,
	json: { write: !0 }
})], c.prototype, "traceConfiguration", void 0), __decorate([a({
	type: [Object],
	json: { write: !0 }
})], c.prototype, "resultTypes", void 0), __decorate([a({
	type: a$1.apiValues,
	json: {
		type: a$1.jsonValues,
		read: a$1.read,
		write: a$1.write
	}
})], c.prototype, "traceType", void 0), c = u = __decorate([c$1("esri.rest.networks.support.TraceParameters")], c);
var d = c;
//#endregion
export { d as default };

//# sourceMappingURL=TraceParameters-nI259Y6B.js.map