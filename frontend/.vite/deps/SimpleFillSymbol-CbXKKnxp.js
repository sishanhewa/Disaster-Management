import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { w as a } from "./Error-CzxduO2m.js";
import { n as c$1, o as r, t as a$1 } from "./decorators-DE7S5xmd.js";
import { n as o } from "./jsonMap-CFSDFmi6.js";
import { t as g } from "./Color-C99QAF80.js";
import { o as n, r as d } from "./SimpleMarkerSymbol-BjFFaoyw.js";
//#region node_modules/@arcgis/core/symbols/FillSymbol.js
var i = class extends n {
	constructor(e) {
		super(e), this.outline = null, this.type = null;
	}
	hash() {
		return `${this.type}.${this.outline?.hash()}`;
	}
};
__decorate([a$1({
	types: {
		key: "type",
		base: null,
		defaultKeyValue: "simple-line",
		typeMap: { "simple-line": d }
	},
	json: {
		default: null,
		write: !0
	}
})], i.prototype, "outline", void 0), __decorate([a$1({
	type: ["simple-fill", "picture-fill"],
	readOnly: !0
})], i.prototype, "type", void 0), i = __decorate([c$1("esri.symbols.FillSymbol")], i);
//#endregion
//#region node_modules/@arcgis/core/symbols/SimpleFillSymbol.js
var p;
var c = new o({
	esriSFSSolid: "solid",
	esriSFSNull: "none",
	esriSFSHorizontal: "horizontal",
	esriSFSVertical: "vertical",
	esriSFSForwardDiagonal: "forward-diagonal",
	esriSFSBackwardDiagonal: "backward-diagonal",
	esriSFSCross: "cross",
	esriSFSDiagonalCross: "diagonal-cross"
});
var m = p = class extends i {
	constructor(...o) {
		super(...o), this.color = new g([
			0,
			0,
			0,
			.25
		]), this.outline = new d(), this.type = "simple-fill", this.style = "solid";
	}
	normalizeCtorArgs(o, r, e) {
		if (o && "string" != typeof o) return o;
		const s = {};
		return o && (s.style = o), r && (s.outline = r), e && (s.color = e), s;
	}
	clone() {
		return new p({
			color: a(this.color),
			outline: this.outline && this.outline.clone(),
			style: this.style
		});
	}
	hash() {
		return `${super.hash()}${this.style}.${this.color && this.color.hash()}`;
	}
};
__decorate([a$1({ type: g })], m.prototype, "color", void 0), __decorate([a$1()], m.prototype, "outline", void 0), __decorate([r({ esriSFS: "simple-fill" }, { readOnly: !0 })], m.prototype, "type", void 0), __decorate([a$1({
	type: c.apiValues,
	json: {
		read: c.read,
		write: c.write
	}
})], m.prototype, "style", void 0), m = p = __decorate([c$1("esri.symbols.SimpleFillSymbol")], m);
//#endregion
export { i as n, m as t };

//# sourceMappingURL=SimpleFillSymbol-CbXKKnxp.js.map