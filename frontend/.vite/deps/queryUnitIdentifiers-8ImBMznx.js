import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { t as f } from "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { a as o, n as c, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import { n as n$1 } from "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import { i as u, n as f$1, r as s } from "./utils-5irCjX9t.js";
//#region node_modules/@arcgis/core/rest/networks/unitIdentifiers/support/UnitQueryResult.js
var n = class extends n$1 {
	constructor(r) {
		super(r), this.container = null, this.ranges = null;
	}
	readContainer(r, t) {
		return {
			sourceId: t.sourceId,
			globalId: t.globalId
		};
	}
	readRanges(r, t) {
		return [...t.gaps.map((r) => ({
			firstUnit: r.start,
			lastUnit: r.end,
			isGap: !0
		})), ...t.unitIdentifiers.map((r) => ({
			firstUnit: r.firstUnit,
			lastUnit: r.numUnits,
			isGap: !1,
			content: {
				sourceId: r.sourceId,
				globalId: r.globalId
			}
		}))];
	}
};
__decorate([a({ type: Object })], n.prototype, "container", void 0), __decorate([o("container", ["sourceId", "globalId"])], n.prototype, "readContainer", null), __decorate([a({ type: [Object] })], n.prototype, "ranges", void 0), __decorate([o("ranges", ["gaps", "unitIdentifiers"])], n.prototype, "readRanges", null), n = __decorate([c("esri.rest.networks.unitIdentifiers.support.UnitQueryResult")], n);
//#endregion
//#region node_modules/@arcgis/core/rest/networks/unitIdentifiers/queryUnitIdentifiers.js
async function i(i, n$2, p) {
	const u$1 = f$1(i), m = n$2.toJSON();
	n$2.objects && (m.objects = JSON.stringify(m.objects));
	const a = {
		...m,
		f: "json"
	}, f$2 = s(u({
		...u$1.query,
		...a
	}), {
		...p,
		method: "post",
		authMode: "no-prompt"
	}), { data: y } = await f(`${u$1.path}/unitIdentifiers/query`, f$2);
	return y.objects.map((t) => n.fromJSON(t));
}
//#endregion
export { i as queryUnitIdentifiers };

//# sourceMappingURL=queryUnitIdentifiers-8ImBMznx.js.map