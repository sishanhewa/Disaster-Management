import { u as dt } from "./constraints-CM2adGn6.js";
import { t } from "./SnappingCandidate-Dnu_WD-h.js";
import { t as n$1 } from "./IntersectionSnappingHint-DGVNu2kY.js";
//#region node_modules/@arcgis/core/views/interactive/snapping/candidates/IntersectionSnappingCandidate.js
var n = class extends t {
	constructor(i, s, n, r) {
		super(i, new dt(i), r, 3), this.first = s, this.second = n;
	}
	get hints() {
		return this.first.targetPoint = this.targetPoint, this.second.targetPoint = this.targetPoint, [
			...this.first.hints,
			...this.second.hints,
			new n$1(this.targetPoint, this.isDraped, this.domain)
		];
	}
};
//#endregion
export { n as t };

//# sourceMappingURL=IntersectionSnappingCandidate-ASyQv_ao.js.map