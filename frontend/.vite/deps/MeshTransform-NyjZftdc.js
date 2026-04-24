import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import { n as l } from "./Clonable-D_RHUyXD.js";
import { d as t, f as u, l as r, s as n$1 } from "./vec3f64-CwISzc_v.js";
import { b as h, l as P, n as B } from "./mat4-CCf33Vjt.js";
import { t as e } from "./mat4f64-BA1Qbgtv.js";
import { t as e$1 } from "./quatf64-3OZfmMeM.js";
import { l as y } from "./quat-Bz1zxyz4.js";
import { a as q, i as k, l as z, s as w, t as B$1 } from "./axisAngleDegrees-C6HVfxeG.js";
//#region node_modules/@arcgis/core/geometry/support/MeshTransform.js
var A = class extends l(n) {
	constructor(t) {
		super(t), this.translation = n$1(), this.rotationAxis = u(B$1), this.rotationAngle = 0, this.scale = r(1, 1, 1);
	}
	get rotation() {
		return q(this.rotationAxis, this.rotationAngle);
	}
	set rotation(t$1) {
		this.rotationAxis = t(k(t$1)), this.rotationAngle = w(t$1);
	}
	get localMatrix() {
		const t = e();
		return y(N, k(this.rotation), z(this.rotation)), P(t, N, this.translation, this.scale), t;
	}
	get localMatrixInverse() {
		return h(e(), this.localMatrix);
	}
	equals(t) {
		return this === t || null != t && B(this.localMatrix, t.localMatrix);
	}
};
__decorate([a({
	type: [Number],
	nonNullable: !0,
	json: { write: !0 }
})], A.prototype, "translation", void 0), __decorate([a({
	type: [Number],
	nonNullable: !0,
	json: { write: !0 }
})], A.prototype, "rotationAxis", void 0), __decorate([a({
	type: Number,
	nonNullable: !0,
	json: { write: !0 }
})], A.prototype, "rotationAngle", void 0), __decorate([a({
	type: [Number],
	nonNullable: !0,
	json: { write: !0 }
})], A.prototype, "scale", void 0), __decorate([a()], A.prototype, "rotation", null), __decorate([a()], A.prototype, "localMatrix", null), __decorate([a()], A.prototype, "localMatrixInverse", null), A = __decorate([c("esri.geometry.support.MeshTransform")], A);
var N = e$1();
//#endregion
export { A as t };

//# sourceMappingURL=MeshTransform-NyjZftdc.js.map