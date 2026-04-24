import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { w as a$1 } from "./Error-CzxduO2m.js";
import { i as r$1, n as c, o as r, r as m, t as a$2 } from "./decorators-DE7S5xmd.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import { t as g } from "./Color-C99QAF80.js";
import { l as o } from "./screenUtils-BR-xd7ya.js";
import { o as n$1 } from "./SimpleMarkerSymbol-BjFFaoyw.js";
import { a as r$2, i as p, n as m$1, o as t, r as n$2, t as l } from "./textUtils-B4iTDAON.js";
//#region node_modules/@arcgis/core/symbols/Font.js
var a;
var y$1 = a = class extends n {
	constructor(t) {
		super(t), this.decoration = "none", this.family = "sans-serif", this.style = "normal", this.weight = "normal";
	}
	get size() {
		return this._get("size") ?? 9;
	}
	set size(t) {
		this._set("size", t);
	}
	castSize(t) {
		return o(t);
	}
	clone() {
		return new a({
			decoration: this.decoration,
			family: this.family,
			size: this.size,
			style: this.style,
			weight: this.weight
		});
	}
	hash() {
		return `${this.decoration}.${this.family}.${this.size}.${this.style}.${this.weight}`;
	}
};
__decorate([a$2({
	type: l,
	json: {
		default: "none",
		write: !0
	}
})], y$1.prototype, "decoration", void 0), __decorate([a$2({
	type: String,
	json: { write: !0 }
})], y$1.prototype, "family", void 0), __decorate([a$2({
	type: Number,
	json: { write: { overridePolicy: (t, e, o) => ({ enabled: !o || !o.textSymbol3D }) } }
})], y$1.prototype, "size", null), __decorate([m("size")], y$1.prototype, "castSize", null), __decorate([a$2({
	type: t,
	json: {
		default: "normal",
		write: !0
	}
})], y$1.prototype, "style", void 0), __decorate([a$2({
	type: r$2,
	json: {
		default: "normal",
		write: !0
	}
})], y$1.prototype, "weight", void 0), y$1 = a = __decorate([c("esri.symbols.Font")], y$1);
//#endregion
//#region node_modules/@arcgis/core/symbols/TextSymbol.js
var y;
var u = y = class extends n$1 {
	constructor(...t) {
		super(...t), this.backgroundColor = null, this.borderLineColor = null, this.borderLineSize = null, this.font = new y$1(), this.horizontalAlignment = "center", this.kerning = !0, this.haloColor = null, this.rightToLeft = null, this.rotated = !1, this.text = "", this.type = "text", this.verticalAlignment = "baseline", this.angle = 0, this.width = null, this.lineHeight = 1;
	}
	normalizeCtorArgs(t, e, o) {
		if (t && "string" != typeof t) return t;
		const i = {};
		return t && (i.text = t), e && (i.font = e), o && (i.color = o), i;
	}
	get haloSize() {
		return this._get("haloSize") ?? null;
	}
	set haloSize(t) {
		this._set("haloSize", t);
	}
	get xoffset() {
		return this._get("xoffset") ?? 0;
	}
	set xoffset(t) {
		this._set("xoffset", t);
	}
	get yoffset() {
		return this._get("yoffset") ?? 0;
	}
	set yoffset(t) {
		this._set("yoffset", t);
	}
	get lineWidth() {
		return this._get("lineWidth") ?? 192;
	}
	set lineWidth(t) {
		this._set("lineWidth", t);
	}
	writeLineWidth(t, e, o, i) {
		i && "string" != typeof i ? i.origin : e[o] = t;
	}
	castLineWidth(t) {
		return o(t);
	}
	writeLineHeight(t, e, o, i) {
		i && "string" != typeof i ? i.origin : e[o] = t;
	}
	clone() {
		return new y({
			angle: this.angle,
			backgroundColor: a$1(this.backgroundColor),
			borderLineColor: a$1(this.borderLineColor),
			borderLineSize: this.borderLineSize,
			color: a$1(this.color),
			font: this.font && this.font.clone(),
			haloColor: a$1(this.haloColor),
			haloSize: this.haloSize,
			horizontalAlignment: this.horizontalAlignment,
			kerning: this.kerning,
			lineHeight: this.lineHeight,
			lineWidth: this.lineWidth,
			rightToLeft: this.rightToLeft,
			rotated: this.rotated,
			text: this.text,
			verticalAlignment: this.verticalAlignment,
			width: this.width,
			xoffset: this.xoffset,
			yoffset: this.yoffset
		});
	}
	hash() {
		return `${this.backgroundColor?.hash()}.${this.borderLineColor}.${this.borderLineSize}.${this.color?.hash()}.${this.font && this.font.hash()}.${this.haloColor?.hash()}.${this.haloSize}.${this.horizontalAlignment}.${this.kerning}.${this.rightToLeft}.${this.rotated}.${this.text}.${this.verticalAlignment}.${this.width}.${this.xoffset}.${this.yoffset}.${this.lineHeight}.${this.lineWidth}.${this.angle}`;
	}
};
__decorate([a$2({
	type: g,
	json: { write: !0 }
})], u.prototype, "backgroundColor", void 0), __decorate([a$2({
	type: g,
	json: { write: !0 }
})], u.prototype, "borderLineColor", void 0), __decorate([a$2({
	type: Number,
	json: { write: !0 },
	cast: o
})], u.prototype, "borderLineSize", void 0), __decorate([a$2({
	type: y$1,
	json: { write: !0 }
})], u.prototype, "font", void 0), __decorate([a$2({
	...m$1,
	json: { write: !0 }
})], u.prototype, "horizontalAlignment", void 0), __decorate([a$2({
	type: Boolean,
	json: { write: !0 }
})], u.prototype, "kerning", void 0), __decorate([a$2({
	type: g,
	json: { write: !0 }
})], u.prototype, "haloColor", void 0), __decorate([a$2({
	type: Number,
	cast: o,
	json: { write: !0 }
})], u.prototype, "haloSize", null), __decorate([a$2({
	type: Boolean,
	json: { write: !0 }
})], u.prototype, "rightToLeft", void 0), __decorate([a$2({
	type: Boolean,
	json: { write: !0 }
})], u.prototype, "rotated", void 0), __decorate([a$2({
	type: String,
	json: { write: !0 }
})], u.prototype, "text", void 0), __decorate([r({ esriTS: "text" }, { readOnly: !0 })], u.prototype, "type", void 0), __decorate([a$2({
	...p,
	json: { write: !0 }
})], u.prototype, "verticalAlignment", void 0), __decorate([a$2({
	type: Number,
	cast: o,
	json: { write: !0 }
})], u.prototype, "xoffset", null), __decorate([a$2({
	type: Number,
	cast: o,
	json: { write: !0 }
})], u.prototype, "yoffset", null), __decorate([a$2({
	type: Number,
	json: {
		read: (t) => t && -1 * t,
		write: (t, e) => e.angle = t && -1 * t
	}
})], u.prototype, "angle", void 0), __decorate([a$2({
	type: Number,
	json: { write: !0 }
})], u.prototype, "width", void 0), __decorate([a$2({ type: Number })], u.prototype, "lineWidth", null), __decorate([r$1("lineWidth")], u.prototype, "writeLineWidth", null), __decorate([m("lineWidth")], u.prototype, "castLineWidth", null), __decorate([a$2(n$2)], u.prototype, "lineHeight", void 0), __decorate([r$1("lineHeight")], u.prototype, "writeLineHeight", null), u = y = __decorate([c("esri.symbols.TextSymbol")], u);
//#endregion
export { y$1 as n, u as t };

//# sourceMappingURL=TextSymbol-CsSnkPMD.js.map