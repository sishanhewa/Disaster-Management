import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { w as a } from "./Error-CzxduO2m.js";
import { n as c$1, t as a$1 } from "./decorators-DE7S5xmd.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import { n as o } from "./jsonMap-CFSDFmi6.js";
import { t as m$1 } from "./TimeExtent-bDAyL7B5.js";
import { o as s } from "./typeUtils-DaICxhuY.js";
import { t as R } from "./Query-aOayEcb1.js";
//#region node_modules/@arcgis/core/layers/support/FeatureFilter.js
var p;
var c = new o({
	esriSpatialRelIntersects: "intersects",
	esriSpatialRelContains: "contains",
	esriSpatialRelCrosses: "crosses",
	esriSpatialRelDisjoint: "disjoint",
	esriSpatialRelEnvelopeIntersects: "envelope-intersects",
	esriSpatialRelIndexIntersects: "index-intersects",
	esriSpatialRelOverlaps: "overlaps",
	esriSpatialRelTouches: "touches",
	esriSpatialRelWithin: "within",
	esriSpatialRelRelation: "relation"
}), u = new o({
	esriSRUnit_Meter: "meters",
	esriSRUnit_Kilometer: "kilometers",
	esriSRUnit_Foot: "feet",
	esriSRUnit_StatuteMile: "miles",
	esriSRUnit_NauticalMile: "nautical-miles",
	esriSRUnit_USNauticalMile: "us-nautical-miles"
});
var m = p = class extends n {
	constructor(e) {
		super(e), this.where = null, this.geometry = null, this.spatialRelationship = "intersects", this.distance = void 0, this.objectIds = null, this.units = null, this.timeExtent = null;
	}
	createQuery(e = {}) {
		const { where: t, geometry: i, spatialRelationship: s, timeExtent: o, objectIds: n, units: a$2, distance: p } = this;
		return new R({
			geometry: a(i),
			objectIds: a(n),
			spatialRelationship: s,
			timeExtent: a(o),
			where: t,
			units: a$2,
			distance: p,
			...e
		});
	}
	clone() {
		const { where: e, geometry: t, spatialRelationship: i, timeExtent: s, objectIds: o, units: n, distance: l } = this;
		return new p({
			geometry: a(t),
			objectIds: a(o),
			spatialRelationship: i,
			timeExtent: a(s),
			where: e,
			units: n,
			distance: l
		});
	}
};
__decorate([a$1({
	type: String,
	json: { write: !0 }
})], m.prototype, "where", void 0), __decorate([a$1({
	types: s,
	json: { write: !0 }
})], m.prototype, "geometry", void 0), __decorate([a$1({
	type: c.apiValues,
	json: {
		name: "spatialRel",
		read: { reader: c.read },
		write: {
			allowNull: !1,
			writer: c.write,
			overridePolicy() {
				return { enabled: null != this.geometry };
			}
		}
	}
})], m.prototype, "spatialRelationship", void 0), __decorate([a$1({
	type: Number,
	json: { write: { overridePolicy(e) {
		return { enabled: null != e && null != this.geometry };
	} } }
})], m.prototype, "distance", void 0), __decorate([a$1({
	type: [Number],
	json: { write: !0 }
})], m.prototype, "objectIds", void 0), __decorate([a$1({
	type: u.apiValues,
	json: {
		read: u.read,
		write: {
			writer: u.write,
			overridePolicy(e) {
				return { enabled: null != e && null != this.geometry };
			}
		}
	}
})], m.prototype, "units", void 0), __decorate([a$1({
	type: m$1,
	json: { write: !0 }
})], m.prototype, "timeExtent", void 0), m = p = __decorate([c$1("esri.layers.support.FeatureFilter")], m);
var d = m;
//#endregion
export { d as t };

//# sourceMappingURL=FeatureFilter-Bd2SB4Jt.js.map