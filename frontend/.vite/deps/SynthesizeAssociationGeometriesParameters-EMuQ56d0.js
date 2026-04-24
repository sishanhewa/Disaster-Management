import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { A as m$1, i as r, n as c$1, t as a } from "./decorators-DE7S5xmd.js";
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
import "./Point-B7zMqEx6.js";
import { t as z } from "./Extent-CquIzaXp.js";
//#region node_modules/@arcgis/core/rest/networks/support/SynthesizeAssociationGeometriesParameters.js
var p;
var c = p = class extends n {
	static from(t) {
		return m$1(p, t);
	}
	constructor(t) {
		super(t), this.returnAttachmentAssociations = !1, this.returnConnectivityAssociations = !1, this.returnContainmentAssociations = !1, this.extent = null, this.maxGeometryCount = null, this.outSpatialReference = null, this.gdbVersion = null, this.moment = null;
	}
	writeOutSR(t, o, e) {
		if (null != t) {
			const { wkid: r, latestWkid: i, wkt: s, wkt2: n } = t;
			o[e] = JSON.stringify({
				wkid: r ?? void 0,
				latestWkid: i ?? void 0,
				wkt: s ?? void 0,
				wkt2: n ?? void 0
			});
		}
	}
};
__decorate([a({
	type: Boolean,
	json: {
		read: { source: "attachmentAssociations" },
		write: { target: "attachmentAssociations" }
	}
})], c.prototype, "returnAttachmentAssociations", void 0), __decorate([a({
	type: Boolean,
	json: {
		read: { source: "connectivityAssociations" },
		write: { target: "connectivityAssociations" }
	}
})], c.prototype, "returnConnectivityAssociations", void 0), __decorate([a({
	type: Boolean,
	json: {
		read: { source: "containmentAssociations" },
		write: { target: "containmentAssociations" }
	}
})], c.prototype, "returnContainmentAssociations", void 0), __decorate([a({
	type: z,
	json: { write: !0 }
})], c.prototype, "extent", void 0), __decorate([a({
	type: Number,
	json: { write: !0 }
})], c.prototype, "maxGeometryCount", void 0), __decorate([a({
	type: S,
	json: { write: { target: "outSR" } }
})], c.prototype, "outSpatialReference", void 0), __decorate([r("outSpatialReference")], c.prototype, "writeOutSR", null), __decorate([a({
	type: String,
	json: { write: !0 }
})], c.prototype, "gdbVersion", void 0), __decorate([a({
	type: Date,
	json: {
		type: Number,
		write: { writer: (t, o) => {
			o.moment = t?.getTime();
		} }
	}
})], c.prototype, "moment", void 0), c = p = __decorate([c$1("esri.rest.networks.support.SynthesizeAssociationGeometriesParameters")], c);
var m = c;
//#endregion
export { m as default };

//# sourceMappingURL=SynthesizeAssociationGeometriesParameters-EMuQ56d0.js.map