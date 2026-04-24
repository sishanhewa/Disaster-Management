import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c, t as a$1 } from "./decorators-DE7S5xmd.js";
import { t as a$2 } from "./layerContainerType-ZF61P2__.js";
import { r as n, t as a$3 } from "./jsonUtils-DOqHqQ2U.js";
//#region node_modules/@arcgis/core/layers/mixins/BlendLayer.js
var s = {
	type: [
		"average",
		"color-burn",
		"color-dodge",
		"color",
		"darken",
		"destination-atop",
		"destination-in",
		"destination-out",
		"destination-over",
		"difference",
		"exclusion",
		"hard-light",
		"hue",
		"invert",
		"lighten",
		"lighter",
		"luminosity",
		"minus",
		"multiply",
		"normal",
		"overlay",
		"plus",
		"reflect",
		"saturation",
		"screen",
		"soft-light",
		"source-atop",
		"source-in",
		"source-out",
		"vivid-light",
		"xor"
	],
	nonNullable: !0,
	json: {
		read: !1,
		write: !1,
		origins: {
			"web-map": {
				read: !0,
				write: { layerContainerTypes: a$2 }
			},
			"portal-item": {
				read: !0,
				write: { layerContainerTypes: a$2 }
			}
		}
	}
}, a = {
	read: { reader: n },
	write: {
		allowNull: !0,
		writer: a$3,
		layerContainerTypes: a$2
	}
}, l = { json: {
	read: !1,
	write: !1,
	origins: {
		"web-map": a,
		"portal-item": a
	}
} }, p = (t) => {
	const i = t;
	let n = class extends i {
		constructor() {
			super(...arguments), this.blendMode = "normal", this.effect = null;
		}
	};
	return __decorate([a$1(s)], n.prototype, "blendMode", void 0), __decorate([a$1(l)], n.prototype, "effect", void 0), n = __decorate([c("esri.layers.mixins.BlendLayer")], n), n;
};
//#endregion
export { p as n, s as r, l as t };

//# sourceMappingURL=BlendLayer-D1uDzFu8.js.map