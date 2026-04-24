import { s as n$1 } from "./vec3f64-CwISzc_v.js";
import { i as f, s as i } from "./screenUtils-BR-xd7ya.js";
import { n as t } from "./dehydratedPoint-DGK3_h0V.js";
import { t as t$1 } from "./SnappingCandidate-Dnu_WD-h.js";
import { t as s$1 } from "./LineSnappingHint-DqpwvriX.js";
import { t as r$1 } from "./RightAngleSnappingHint-CXYZwWD3.js";
import { t as i$1 } from "./viewUtils-pvBy4uZZ.js";
//#region node_modules/@arcgis/core/views/interactive/snapping/candidates/RightAngleSnappingCandidate.js
var r = class extends t$1 {
	constructor({ targetPoint: t, constraint: e, previousVertex: i, otherVertex: r, otherVertexType: s, isDraped: n, selfSnappingType: o, objectId: h, domain: p }) {
		super(t, e, n, p ?? 2), this.previousVertex = i, this.otherVertex = r, this.otherVertexType = s, this.selfSnappingType = o ?? 0, this.objectId = h ?? null;
	}
	get hints() {
		const t = this.previousVertex, r = 1 === this.otherVertexType ? this.otherVertex : this.targetPoint, s = 1 === this.otherVertexType ? this.targetPoint : this.otherVertex;
		return [
			new s$1(0, r, s, this.isDraped, this.domain),
			new s$1(1, t, r, this.isDraped, this.domain),
			new r$1(this.previousVertex, r, s, this.isDraped, this.domain)
		];
	}
};
//#endregion
//#region node_modules/@arcgis/core/views/interactive/support/viewUtils.js
function s(r, t, o, s) {
	return "2d" === s.type ? (c.x = r[0], c.y = r[1], c.spatialReference = t, s.toScreen(c)) : (i$1(r, t, o, s, a), s.state.camera.projectToScreen(a, n), i(n[0], n[1]));
}
var c = t(0, 0, 0, null), a = n$1(), n = f();
//#endregion
export { r as n, s as t };

//# sourceMappingURL=viewUtils-DX1XhXOg.js.map