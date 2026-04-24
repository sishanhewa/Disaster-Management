import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { v as e } from "./Error-CzxduO2m.js";
import { i as r, n as c, t as a } from "./decorators-DE7S5xmd.js";
import { n as n$1 } from "./JSONSupport-BUaD4jSd.js";
import { n as l } from "./Clonable-D_RHUyXD.js";
import { n as p } from "./TimeInfo-DCZqAfjD.js";
import { t as q } from "./PopupTemplate-8SH37QID.js";
import { t as n$2 } from "./getPopupProvider-CZza_7Ci.js";
import { t as s$1 } from "./GraphicOrigin-Cql_LpUb.js";
import { c as l$1, u as p$1 } from "./commonProperties-DQjThAJZ.js";
import { o as p$2, s as u } from "./defaults-BIYIh1Ct.js";
import { t as n$3 } from "./SimpleRenderer-mi99w4q9.js";
import { s as a$1 } from "./FeatureReductionLayer-BfhNe5jI.js";
import { r as A } from "./labelingInfo-BvxiOw9s.js";
import { t as m } from "./typeUtils-YqCqXWJ1.js";
//#region node_modules/@arcgis/core/graphic/TrackGraphicOrigin.js
var o = class extends s$1 {
	constructor(r) {
		super(), this.type = "track", this.trackInfoProvider = r;
	}
	get id() {
		return this.trackInfoProvider.id;
	}
	get [n$2]() {
		return this.trackInfoProvider.trackInfo;
	}
};
//#endregion
//#region node_modules/@arcgis/core/layers/support/TrackPartInfo.js
var n = class extends l(n$1) {
	constructor(o) {
		super(o), this.labelingInfo = null, this.labelsVisible = !0, this.renderer = null, this.visible = !0;
	}
};
__decorate([a({
	type: [A],
	json: { write: !0 }
})], n.prototype, "labelingInfo", void 0), __decorate([a(p$1)], n.prototype, "labelsVisible", void 0), __decorate([a({
	types: m,
	json: { write: !0 }
})], n.prototype, "renderer", void 0), __decorate([a({
	type: Boolean,
	json: { write: !0 }
})], n.prototype, "visible", void 0), n = __decorate([c("esri.layers.support.TrackPartInfo")], n);
//#endregion
//#region node_modules/@arcgis/core/layers/support/TrackInfo.js
var f = class extends l(n$1) {
	constructor(e) {
		super(e), this.enabled = !0, this.fields = [], this.latestObservations = new n({ renderer: new n$3({ symbol: p$2.clone() }) }), this.maxDisplayDuration = null, this.maxDisplayObservationsPerTrack = 0, this.popupEnabled = !0, this.popupTemplate = null, this.previousObservations = new n({ renderer: new n$3({ symbol: p$2.clone() }) }), this.trackLines = new n({ renderer: new n$3({ symbol: u.clone() }) }), this.timeField = "startTimeField";
	}
	writeFields(e$1, o, t) {
		e(t, e$1.filter((e) => "avg_angle" !== e.statisticType).map((e) => e.toJSON()), o);
	}
};
__decorate([a({
	type: Boolean,
	json: { write: !0 }
})], f.prototype, "enabled", void 0), __decorate([a({
	type: [a$1],
	json: { write: !0 }
})], f.prototype, "fields", void 0), __decorate([r("fields")], f.prototype, "writeFields", null), __decorate([a({
	type: n,
	json: { write: !0 }
})], f.prototype, "latestObservations", void 0), __decorate([a({
	type: p,
	json: { write: !0 }
})], f.prototype, "maxDisplayDuration", void 0), __decorate([a({
	type: Number,
	json: { write: !0 }
})], f.prototype, "maxDisplayObservationsPerTrack", void 0), __decorate([a(l$1)], f.prototype, "popupEnabled", void 0), __decorate([a({
	type: q,
	json: {
		name: "popupInfo",
		write: !0
	}
})], f.prototype, "popupTemplate", void 0), __decorate([a({
	type: n,
	json: { write: !0 }
})], f.prototype, "previousObservations", void 0), __decorate([a({
	type: n,
	json: { write: !0 }
})], f.prototype, "trackLines", void 0), __decorate([a({
	type: [
		"timeReceived",
		"startTimeField",
		"endTimeField"
	],
	json: {
		read: !0,
		write: !0
	}
})], f.prototype, "timeField", void 0), f = __decorate([c("esri.layers.support.TrackInfo")], f);
//#endregion
//#region node_modules/@arcgis/core/layers/mixins/TrackableLayer.js
var s = (s) => {
	const a$2 = s;
	let e = class extends a$2 {
		constructor() {
			super(...arguments), this.trackGraphicOrigin = new o(this), this.trackInfo = null;
		}
	};
	return __decorate([a({
		readOnly: !0,
		clonable: !1
	})], e.prototype, "trackGraphicOrigin", void 0), __decorate([a({ type: f })], e.prototype, "trackInfo", void 0), e = __decorate([c("esri.layers.mixins.TrackableLayer")], e), e;
};
//#endregion
export { s as t };

//# sourceMappingURL=TrackableLayer-DRJJPsVQ.js.map