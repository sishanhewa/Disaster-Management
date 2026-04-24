import { n as __exportAll } from "./chunk-BoAXSpZd.js";
import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import { t as g } from "./Color-C99QAF80.js";
import { n as l } from "./Clonable-D_RHUyXD.js";
import { a as r, t as a$1 } from "./meshCloneUtils-Dh0QdG3w.js";
import { n as g$1 } from "./MeshTexture-D7k6Z_hO.js";
//#region node_modules/@arcgis/core/geometry/support/MeshTextureTransform.js
var p = class extends l(n) {
	constructor(o) {
		super(o), this.offset = [0, 0], this.rotation = 0, this.scale = [1, 1];
	}
};
__decorate([a({
	type: [Number],
	nonNullable: !0,
	json: { write: !0 }
})], p.prototype, "offset", void 0), __decorate([a({
	type: Number,
	nonNullable: !0,
	json: { write: !0 }
})], p.prototype, "rotation", void 0), __decorate([a({
	type: [Number],
	nonNullable: !0,
	json: { write: !0 }
})], p.prototype, "scale", void 0), p = __decorate([c("esri.geometry.support.MeshTextureTransform")], p);
//#endregion
//#region node_modules/@arcgis/core/geometry/support/MeshMaterial.js
var MeshMaterial_exports = /* @__PURE__ */ __exportAll({ default: () => m });
var m = class extends l(n) {
	constructor(e) {
		super(e), this.color = null, this.colorTextureTransform = null, this.normalTextureTransform = void 0, this.alphaMode = "auto", this.alphaCutoff = .5, this.doubleSided = !0;
	}
	get colorTexture() {
		return this._get("colorTexture");
	}
	set colorTexture(e) {
		this._set("colorTexture", null == e ? null : g$1.from(e));
	}
	get normalTexture() {
		return this._get("normalTexture");
	}
	set normalTexture(e) {
		this._set("normalTexture", null == e ? null : g$1.from(e));
	}
	clone(e) {
		const r$1 = r(e), o = r$1?.materialMap?.get(this);
		if (o) return o;
		const t = super.clone(a$1(e));
		return r$1?.materialMap?.set(this, t), t;
	}
	get memoryUsage() {
		return this.getMemoryUsage();
	}
	getMemoryUsage() {
		let e = 0;
		return e += null != this.color ? 16 : 0, null != this.colorTexture && (e += this.colorTexture.memoryUsage), e += null != this.colorTextureTransform ? 20 : 0, null != this.normalTexture && (e += this.normalTexture.memoryUsage), e += null != this.normalTextureTransform ? 20 : 0, e;
	}
};
__decorate([a({
	type: g,
	json: { write: !0 }
})], m.prototype, "color", void 0), __decorate([a({
	type: g$1,
	json: { write: !0 },
	value: null
})], m.prototype, "colorTexture", null), __decorate([a({
	type: p,
	json: { write: !0 }
})], m.prototype, "colorTextureTransform", void 0), __decorate([a({
	type: g$1,
	json: { write: !0 },
	value: null
})], m.prototype, "normalTexture", null), __decorate([a({
	type: p,
	json: { write: !0 }
})], m.prototype, "normalTextureTransform", void 0), __decorate([a({
	nonNullable: !0,
	json: { write: !0 }
})], m.prototype, "alphaMode", void 0), __decorate([a({
	nonNullable: !0,
	json: { write: !0 }
})], m.prototype, "alphaCutoff", void 0), __decorate([a({
	nonNullable: !0,
	json: { write: !0 }
})], m.prototype, "doubleSided", void 0), m = __decorate([c("esri.geometry.support.MeshMaterial")], m);
//#endregion
export { m as n, p as r, MeshMaterial_exports as t };

//# sourceMappingURL=MeshMaterial-iAVkcjxh.js.map