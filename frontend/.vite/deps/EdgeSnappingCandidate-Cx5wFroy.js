import { r as e$1 } from "./curveUtils-CfkOAT4m.js";
import { f as gt, h as xe, p as mt } from "./constraints-CM2adGn6.js";
import { t } from "./SnappingCandidate-Dnu_WD-h.js";
import { t as s } from "./LineSnappingHint-DqpwvriX.js";
import { t as i } from "./CurveSnappingHint-BbGo5Abf.js";
//#region node_modules/@arcgis/core/views/interactive/snapping/candidates/FeatureSnappingCandidate.js
var e = class extends t {
	constructor({ targetPoint: t, objectId: e, constraint: r, isDraped: s, layer: a }) {
		super(t, r, s, 1), this.objectId = e, this.layer = a;
	}
};
//#endregion
//#region node_modules/@arcgis/core/views/interactive/snapping/candidates/EdgeSnappingCandidate.js
var a = class extends e {
	constructor(s) {
		const i = !s.curve || e$1(s.curve) ? new mt(s.edgeStart, s.edgeEnd) : new gt(s.edgeStart, s.curve);
		super({
			...s,
			constraint: i
		});
	}
	get hints() {
		return xe(this.constraint) ? [new i(this.constraint.start, this.constraint.curve, this.domain)] : [new s(1, this.constraint.start, this.constraint.end, this.isDraped, this.domain)];
	}
};
//#endregion
export { e as n, a as t };

//# sourceMappingURL=EdgeSnappingCandidate-Cx5wFroy.js.map