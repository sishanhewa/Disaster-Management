import { i as d } from "./normalizedPoint-BO8sGqAY.js";
import { u as dt } from "./constraints-CM2adGn6.js";
import { n as e } from "./EdgeSnappingCandidate-Cx5wFroy.js";
import { t as o$1 } from "./PointSnappingHint-nUf3LF77.js";
//#region node_modules/@arcgis/core/views/interactive/snapping/candidates/VertexSnappingCandidate.js
var o = class extends e {
	constructor(n) {
		super({
			...n,
			constraint: new dt(n.targetPoint)
		}), this.originalTargetPoint = n.originalTargetPoint ?? d(n.targetPoint);
	}
	get hints() {
		return [new o$1(this.targetPoint, this.isDraped, this.domain)];
	}
};
//#endregion
export { o as t };

//# sourceMappingURL=VertexSnappingCandidate-BYL6n2-J.js.map