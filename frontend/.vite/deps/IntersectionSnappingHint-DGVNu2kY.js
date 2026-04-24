import { n as C } from "./vec3-BfQf1_cT.js";
import { n as s } from "./LineSnappingHint-DqpwvriX.js";
//#region node_modules/@arcgis/core/views/interactive/snapping/hints/IntersectionSnappingHint.js
var n = class n extends s {
	constructor(t, i, n = 3) {
		super(i, n), this.intersectionPoint = t;
	}
	equals(i) {
		return i instanceof n && C(this.intersectionPoint, i.intersectionPoint);
	}
};
//#endregion
export { n as t };

//# sourceMappingURL=IntersectionSnappingHint-DGVNu2kY.js.map