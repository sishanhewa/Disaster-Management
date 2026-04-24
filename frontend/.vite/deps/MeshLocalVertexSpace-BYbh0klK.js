import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c$1, o as r, t as a } from "./decorators-DE7S5xmd.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import { n as l } from "./Clonable-D_RHUyXD.js";
import { s as n$1 } from "./vec3f64-CwISzc_v.js";
//#region node_modules/@arcgis/core/geometry/support/MeshGeoreferencedVertexSpace.js
var i$1;
var c = class extends l(n) {
	static {
		i$1 = this;
	}
	constructor(e) {
		super(e), this.type = "georeferenced", this.origin = null;
	}
	static {
		this.absolute = new i$1();
	}
};
__decorate([r({ georeferenced: "georeferenced" }, { readOnly: !0 })], c.prototype, "type", void 0), __decorate([a({
	type: [Number],
	nonNullable: !1,
	json: { write: !0 }
})], c.prototype, "origin", void 0), c = i$1 = __decorate([c$1("esri.geometry.support.MeshGeoreferencedVertexSpace")], c);
//#endregion
//#region node_modules/@arcgis/core/geometry/support/MeshLocalVertexSpace.js
var i = class extends l(n) {
	constructor(o) {
		super(o), this.type = "local", this.origin = n$1();
	}
};
__decorate([r({ local: "local" }, { readOnly: !0 })], i.prototype, "type", void 0), __decorate([a({
	type: [Number],
	nonNullable: !0,
	json: { write: !0 }
})], i.prototype, "origin", void 0), i = __decorate([c$1("esri.geometry.support.MeshLocalVertexSpace")], i);
//#endregion
export { c as n, i as t };

//# sourceMappingURL=MeshLocalVertexSpace-BYbh0klK.js.map