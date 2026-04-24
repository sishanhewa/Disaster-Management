import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { a as o, n as c, t as a$1 } from "./decorators-DE7S5xmd.js";
import { t as m } from "./TimeExtent-bDAyL7B5.js";
import { t as e } from "./timeUnitKebabDictionary-DmXAmWsU.js";
import { n as p, t as u } from "./TimeInfo-DCZqAfjD.js";
import { c as F } from "./fieldUtils-CC2YSmV6.js";
import { t as a$2 } from "./layerContainerType-ZF61P2__.js";
//#region node_modules/@arcgis/core/layers/mixins/TemporalLayer.js
var a = {
	type: Boolean,
	json: {
		read: { source: "timeAnimation" },
		write: {
			target: "timeAnimation",
			layerContainerTypes: a$2
		}
	}
}, l = (r) => {
	const l = r;
	let u$1 = class extends l {
		constructor() {
			super(...arguments), this.timeExtent = null, this.timeOffset = null, this.useViewTime = !0;
		}
		readOffset(t, e$1) {
			const o = e$1.timeInfo.exportOptions;
			if (!o) return null;
			const r = o.timeOffset, i = e.fromJSON(o.timeOffsetUnits);
			return r && i ? new p({
				value: r,
				unit: i
			}) : null;
		}
		get timeInfo() {
			return this._get("timeInfo");
		}
		set timeInfo(t) {
			F(t, this.fieldsIndex), this._set("timeInfo", t);
		}
	};
	return __decorate([a$1({
		type: m,
		json: { write: !1 }
	})], u$1.prototype, "timeExtent", void 0), __decorate([a$1({ type: p })], u$1.prototype, "timeOffset", void 0), __decorate([o("service", "timeOffset", ["timeInfo.exportOptions"])], u$1.prototype, "readOffset", null), __decorate([a$1({
		value: null,
		type: u,
		json: {
			write: !0,
			origins: {
				"web-document": {
					read: !1,
					write: !1
				},
				"portal-item": {
					read: !1,
					write: !1
				}
			}
		}
	})], u$1.prototype, "timeInfo", null), __decorate([a$1(a)], u$1.prototype, "useViewTime", void 0), u$1 = __decorate([c("esri.layers.mixins.TemporalLayer")], u$1), u$1;
};
//#endregion
export { l as n, a as t };

//# sourceMappingURL=TemporalLayer-CoD-2i-t.js.map