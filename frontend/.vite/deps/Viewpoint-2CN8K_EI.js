import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c$1, r as m$1, t as a } from "./decorators-DE7S5xmd.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import { t as d } from "./Camera-Uq6fIdHy.js";
import { n as u } from "./jsonUtils-D_oLUjKv.js";
import { o as s } from "./typeUtils-DaICxhuY.js";
//#region node_modules/@arcgis/core/Viewpoint.js
var p;
var l = p = class extends n {
	constructor(e) {
		super(e), this.rotation = 0, this.scale = 0, this.targetGeometry = null, this.camera = null;
	}
	castRotation(e) {
		return (e %= 360) < 0 && (e += 360), e;
	}
	clone() {
		return new p({
			rotation: this.rotation,
			scale: this.scale,
			targetGeometry: null != this.targetGeometry ? this.targetGeometry.clone() : null,
			camera: null != this.camera ? this.camera.clone() : null
		});
	}
};
__decorate([a({
	type: Number,
	json: {
		write: !0,
		origins: {
			"web-map": {
				default: 0,
				write: !0
			},
			"web-scene": { write: { overridePolicy: m } }
		}
	}
})], l.prototype, "rotation", void 0), __decorate([m$1("rotation")], l.prototype, "castRotation", null), __decorate([a({
	type: Number,
	json: {
		write: !0,
		origins: {
			"web-map": {
				default: 0,
				write: !0
			},
			"web-scene": { write: { overridePolicy: m } }
		}
	}
})], l.prototype, "scale", void 0), __decorate([a({
	types: s,
	json: {
		read: u,
		write: !0,
		origins: { "web-scene": {
			read: u,
			write: { overridePolicy: m }
		} }
	}
})], l.prototype, "targetGeometry", void 0), __decorate([a({
	type: d,
	json: {
		write: !0,
		origins: { "web-scene": { write: { isRequired: !0 } } }
	}
})], l.prototype, "camera", void 0), l = p = __decorate([c$1("esri.Viewpoint")], l);
var c = l;
function m() {
	return { enabled: !this.camera };
}
//#endregion
export { c as t };

//# sourceMappingURL=Viewpoint-2CN8K_EI.js.map