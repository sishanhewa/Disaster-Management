import { n as __exportAll } from "./chunk-BoAXSpZd.js";
import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n } from "./Error-CzxduO2m.js";
import { N as w, n as c, o as r, t as a } from "./decorators-DE7S5xmd.js";
import { n as n$1 } from "./JSONSupport-BUaD4jSd.js";
import { n as o } from "./jsonMap-CFSDFmi6.js";
import { t as S } from "./SpatialReference-rIfb2LrD.js";
import { r as g } from "./timeZoneUtils-CBNjS1ZG.js";
import { t as m } from "./TimeExtent-bDAyL7B5.js";
import { n as l } from "./Clonable-D_RHUyXD.js";
import { n as u } from "./jsonUtils-D_oLUjKv.js";
import { o as s } from "./typeUtils-DaICxhuY.js";
import { n as s$1, t as p } from "./StatisticDefinition-DCvGQn-e.js";
import { n as g$1 } from "./queryUtils-CNTJGLMY.js";
import { a as m$1, n as m$3, o as a$1, r as m$2, t as m$4 } from "./FixedIntervalBinParameters-CbmEfZTf.js";
//#region node_modules/@arcgis/core/rest/support/AttributeBinsQuery.js
var AttributeBinsQuery_exports = /* @__PURE__ */ __exportAll({ default: () => R });
var b = new o({
	asc: "ascending",
	desc: "descending"
}), B = {
	base: a$1,
	key: "type",
	typeMap: {
		"auto-interval": m$1,
		date: m$2,
		"fixed-boundaries": m$3,
		"fixed-interval": m$4
	}
};
var R = class extends l(n$1) {
	constructor(e) {
		super(e), this.binParameters = null, this.binOrder = "ascending", this.cacheHint = void 0, this.datumTransformation = null, this.defaultSpatialReference = null, this.distance = void 0, this.geometry = null, this.lowerBoundaryAlias = null, this.outSpatialReference = null, this.outStatistics = null, this.returnDistinctValues = null, this.spatialRelationship = "intersects", this.timeExtent = null, this.upperBoundaryAlias = null, this.units = null, this.where = "1=1";
	}
	set outTimeZone(e) {
		this._set("outTimeZone", e), e && !g(e) && n.getLogger(this).warn("#outTimeZone", `the parsed value '${e}' may not be a valid IANA time zone`);
	}
};
__decorate([a({
	types: B,
	json: {
		name: "bin",
		write: !0
	}
})], R.prototype, "binParameters", void 0), __decorate([r(b)], R.prototype, "binOrder", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], R.prototype, "cacheHint", void 0), __decorate([a({ json: { write: !0 } })], R.prototype, "datumTransformation", void 0), __decorate([a({
	type: S,
	json: {
		name: "defaultSR",
		write: !0
	}
})], R.prototype, "defaultSpatialReference", void 0), __decorate([a({
	type: Number,
	json: { write: { overridePolicy: (e) => ({ enabled: e > 0 }) } }
})], R.prototype, "distance", void 0), __decorate([a({
	types: s,
	json: {
		read: u,
		write: !0
	}
})], R.prototype, "geometry", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], R.prototype, "lowerBoundaryAlias", void 0), __decorate([a({
	type: S,
	json: {
		name: "outSR",
		write: !0
	}
})], R.prototype, "outSpatialReference", void 0), __decorate([a({
	type: [p],
	json: { write: {
		enabled: !0,
		overridePolicy() {
			return { enabled: null != this.outStatistics && this.outStatistics.length > 0 };
		}
	} }
})], R.prototype, "outStatistics", void 0), __decorate([a({
	value: null,
	json: {
		name: "outTimeReference",
		read: { reader: (e) => e.ianaTimeZone },
		write: { writer: (e, t, o) => {
			e && (t[o] = { ianaTimeZone: e });
		} }
	}
})], R.prototype, "outTimeZone", null), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], R.prototype, "returnDistinctValues", void 0), __decorate([r(s$1, { name: "spatialRel" })], R.prototype, "spatialRelationship", void 0), __decorate([a({
	type: m,
	json: { write: !0 }
})], R.prototype, "timeExtent", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], R.prototype, "upperBoundaryAlias", void 0), __decorate([a({
	type: String,
	json: {
		read: g$1.read,
		write: {
			writer: g$1.write,
			overridePolicy(e) {
				return { enabled: null != e && null != this.distance };
			}
		}
	}
})], R.prototype, "units", void 0), __decorate([a({
	type: String,
	json: { write: !0 }
})], R.prototype, "where", void 0), R = __decorate([c("esri.rest.support.AttributeBinsQuery")], R), R.from = w(R);
//#endregion
export { R as n, AttributeBinsQuery_exports as t };

//# sourceMappingURL=AttributeBinsQuery-BIYjAjK6.js.map