import { U as t } from "./promiseUtils-DhYhergm.js";
import { t as i } from "./ParallelSnappingHint-a7tHnrIG.js";
import { t as s } from "./LineSnappingHint-DqpwvriX.js";
import { t as i$1 } from "./CurveSnappingHint-BbGo5Abf.js";
import { t as n } from "./IntersectionSnappingHint-DGVNu2kY.js";
import { t as r } from "./RightAngleSnappingHint-CXYZwWD3.js";
import { t as o } from "./PointSnappingHint-nUf3LF77.js";
//#region node_modules/@arcgis/core/views/interactive/snapping/SnappingVisualizer.js
var a = class {
	draw(a, h) {
		const u = p(a), f = this.sortUniqueHints(u), l = [];
		for (const i$2 of f) i$2 instanceof n && l.push(this.visualizeIntersectionPoint(i$2, h)), i$2 instanceof s && l.push(this.visualizeLine(i$2, h)), i$2 instanceof i$1 && l.push(this.visualizeCurve(i$2, h)), i$2 instanceof i && l.push(this.visualizeParallelSign(i$2, h)), i$2 instanceof r && l.push(this.visualizeRightAngleQuad(i$2, h)), i$2 instanceof o && l.push(this.visualizePoint(i$2, h));
		return t(l);
	}
	sortUniqueHints(i) {
		return i;
	}
};
function p(i) {
	const n = [];
	for (const t of i) {
		let i = !0;
		for (const s of n) if (t.equals(s)) {
			i = !1;
			break;
		}
		i && n.push(t);
	}
	return n;
}
//#endregion
export { a as t };

//# sourceMappingURL=SnappingVisualizer-BMQ0OYfT.js.map