import { n as C } from "./vec3-BfQf1_cT.js";
import { n as s } from "./LineSnappingHint-DqpwvriX.js";
//#region node_modules/@arcgis/core/views/interactive/snapping/hints/RightAngleSnappingHint.js
var r = class r extends s {
	constructor(e, t, r, s, i = 3) {
		super(s, i), this.previousVertex = e, this.centerVertex = t, this.nextVertex = r;
	}
	equals(t) {
		return t instanceof r && C(this.previousVertex, t.previousVertex) && C(this.centerVertex, t.centerVertex) && C(this.nextVertex, t.nextVertex);
	}
};
//#endregion
export { r as t };

//# sourceMappingURL=RightAngleSnappingHint-CXYZwWD3.js.map