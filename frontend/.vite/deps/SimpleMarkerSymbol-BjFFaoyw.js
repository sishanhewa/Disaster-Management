import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { w as a } from "./Error-CzxduO2m.js";
import { O as a$2, a as o, i as r$1, n as c$2, o as r, t as a$1 } from "./decorators-DE7S5xmd.js";
import { n as n$2 } from "./JSONSupport-BUaD4jSd.js";
import { n as o$1 } from "./jsonMap-CFSDFmi6.js";
import { t as g } from "./Color-C99QAF80.js";
import { l as o$2 } from "./screenUtils-BR-xd7ya.js";
//#region node_modules/@arcgis/core/symbols/Symbol.js
var p$3 = new o$1({
	esriSMS: "simple-marker",
	esriPMS: "picture-marker",
	esriSLS: "simple-line",
	esriSFS: "simple-fill",
	esriPFS: "picture-fill",
	esriTS: "text",
	esriSHD: "shield-label-symbol",
	PointSymbol3D: "point-3d",
	LineSymbol3D: "line-3d",
	PolygonSymbol3D: "polygon-3d",
	WebStyleSymbol: "web-style",
	MeshSymbol3D: "mesh-3d",
	LabelSymbol3D: "label-3d",
	CIMSymbolReference: "cim"
});
var m$2 = 0, n$1 = class extends n$2 {
	constructor(e) {
		super(e), this.id = "sym" + m$2++, this.type = null, this.color = new g([
			0,
			0,
			0,
			1
		]);
	}
	readColor(e) {
		return null != e?.[0] ? [
			e[0],
			e[1],
			e[2],
			e[3] / 255
		] : e;
	}
	async collectRequiredFields(e, o) {}
	hash() {
		return JSON.stringify(this.toJSON());
	}
	clone() {}
};
__decorate([a$1({
	type: p$3.apiValues,
	readOnly: !0,
	json: {
		read: !1,
		write: {
			ignoreOrigin: !0,
			writer: p$3.write,
			isRequired: !0
		}
	}
})], n$1.prototype, "type", void 0), __decorate([a$1({
	type: g,
	json: { write: { allowNull: !0 } }
})], n$1.prototype, "color", void 0), __decorate([o("color")], n$1.prototype, "readColor", null), n$1 = __decorate([c$2("esri.symbols.Symbol")], n$1);
//#endregion
//#region node_modules/@arcgis/core/symbols/support/lineMarkers.js
var e = [
	"begin",
	"end",
	"begin-end"
], n = [
	"arrow",
	"circle",
	"square",
	"diamond",
	"cross",
	"x"
];
//#endregion
//#region node_modules/@arcgis/core/symbols/LineSymbol.js
var p$2 = class extends n$1 {
	constructor(t) {
		super(t), this.type = "simple-line";
	}
	get width() {
		return this._get("width") ?? .75;
	}
	set width(t) {
		this._set("width", t);
	}
	hash() {
		return `${this.type}.${this.width}`;
	}
};
__decorate([r({ esriSLS: "simple-line" }, { readOnly: !0 })], p$2.prototype, "type", void 0), __decorate([a$1({
	type: Number,
	cast: o$2,
	json: { write: !0 }
})], p$2.prototype, "width", null), p$2 = __decorate([c$2("esri.symbols.LineSymbol")], p$2);
//#endregion
//#region node_modules/@arcgis/core/symbols/LineSymbolMarker.js
var c$1;
var m$1 = c$1 = class extends n$2 {
	constructor(r) {
		super(r), this.placement = "begin-end", this.type = "line-marker", this.style = "arrow";
	}
	writeStyle(r, o, e, t) {
		o[e] = "web-map" === t?.origin ? "arrow" : r;
	}
	set color(r) {
		this._set("color", r);
	}
	readColor(r) {
		return null != r?.[0] ? [
			r[0],
			r[1],
			r[2],
			r[3] / 255
		] : r;
	}
	writeColor(r, o, e, t) {
		"web-map" === t?.origin || (o[e] = r);
	}
	clone() {
		return new c$1({
			color: a(this.color),
			placement: this.placement,
			style: this.style
		});
	}
	hash() {
		return `${this.placement}.${this.color?.hash()}.${this.style}`;
	}
};
__decorate([a$1({
	type: [
		"begin",
		"end",
		"begin-end"
	],
	json: { write: !0 }
})], m$1.prototype, "placement", void 0), __decorate([r({ "line-marker": "line-marker" }, { readOnly: !0 }), a$1({ json: { origins: { "web-map": { write: !1 } } } })], m$1.prototype, "type", void 0), __decorate([a$1({ type: n })], m$1.prototype, "style", void 0), __decorate([r$1("style")], m$1.prototype, "writeStyle", null), __decorate([a$1({
	type: g,
	value: null,
	json: { write: { allowNull: !0 } }
})], m$1.prototype, "color", null), __decorate([o("color")], m$1.prototype, "readColor", null), __decorate([r$1("color")], m$1.prototype, "writeColor", null), m$1 = c$1 = __decorate([c$2("esri.symbols.LineSymbolMarker")], m$1);
var y = m$1;
//#endregion
//#region node_modules/@arcgis/core/symbols/SimpleLineSymbol.js
var h;
var p$1 = new o$1({
	esriSLSSolid: "solid",
	esriSLSDash: "dash",
	esriSLSDot: "dot",
	esriSLSDashDot: "dash-dot",
	esriSLSDashDotDot: "long-dash-dot-dot",
	esriSLSNull: "none",
	esriSLSShortDash: "short-dash",
	esriSLSShortDot: "short-dot",
	esriSLSShortDashDot: "short-dash-dot",
	esriSLSShortDashDotDot: "short-dash-dot-dot",
	esriSLSLongDash: "long-dash",
	esriSLSLongDashDot: "long-dash-dot"
});
var d = h = class extends p$2 {
	constructor(...o) {
		super(...o), this.type = "simple-line", this.style = "solid", this.cap = "round", this.join = "round", this.marker = null, this.miterLimit = 2;
	}
	normalizeCtorArgs(o, r, t, i, s, l) {
		if (o && "string" != typeof o) return o;
		const n = {};
		return null != o && (n.style = o), null != r && (n.color = r), null != t && (n.width = o$2(t)), null != i && (n.cap = i), null != s && (n.join = s), null != l && (n.miterLimit = o$2(l)), n;
	}
	clone() {
		return new h({
			color: a(this.color),
			style: this.style,
			width: this.width,
			cap: this.cap,
			join: this.join,
			miterLimit: this.miterLimit,
			marker: this.marker?.clone()
		});
	}
	hash() {
		return `${super.hash()}.${this.color?.hash()}.${this.style}.${this.cap}.${this.join}.${this.miterLimit}.${this.marker?.hash()}`;
	}
};
__decorate([r({ esriSLS: "simple-line" }, { readOnly: !0 })], d.prototype, "type", void 0), __decorate([a$1({
	type: p$1.apiValues,
	json: {
		read: p$1.read,
		write: p$1.write
	}
})], d.prototype, "style", void 0), __decorate([a$1({
	type: [
		"butt",
		"round",
		"square"
	],
	json: { write: { overridePolicy: (o, r, t) => ({ enabled: "round" !== o && null == t?.origin }) } }
})], d.prototype, "cap", void 0), __decorate([a$1({
	type: [
		"miter",
		"round",
		"bevel"
	],
	json: { write: { overridePolicy: (o, r, t) => ({ enabled: "round" !== o && null == t?.origin }) } }
})], d.prototype, "join", void 0), __decorate([a$1({
	types: {
		key: "type",
		base: null,
		defaultKeyValue: "line-marker",
		typeMap: { "line-marker": y }
	},
	json: {
		write: !0,
		origins: { "web-scene": { write: !1 } }
	}
})], d.prototype, "marker", void 0), __decorate([a$1({
	type: Number,
	json: {
		read: !1,
		write: !1
	}
})], d.prototype, "miterLimit", void 0), d = h = __decorate([c$2("esri.symbols.SimpleLineSymbol")], d);
//#endregion
//#region node_modules/@arcgis/core/symbols/MarkerSymbol.js
var p = class extends n$1 {
	constructor(t) {
		super(t), this.angle = 0, this.type = null;
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
	get size() {
		return this._get("size") ?? 9;
	}
	set size(t) {
		this._set("size", t);
	}
	hash() {
		return `${this.type}.${this.angle}.${this.size}.${this.xoffset}.${this.yoffset}`;
	}
};
__decorate([a$1({
	type: Number,
	json: {
		read: (t) => t && -1 * t,
		write: (t, e) => e.angle = t && -1 * t
	}
})], p.prototype, "angle", void 0), __decorate([a$1({
	type: ["simple-marker", "picture-marker"],
	readOnly: !0
})], p.prototype, "type", void 0), __decorate([a$1({
	type: Number,
	cast: o$2,
	json: { write: !0 }
})], p.prototype, "xoffset", null), __decorate([a$1({
	type: Number,
	cast: o$2,
	json: { write: !0 }
})], p.prototype, "yoffset", null), __decorate([a$1({
	cast: (t) => "auto" === t ? t : a$2(o$2(t)),
	json: { write: !0 }
})], p.prototype, "size", null), p = __decorate([c$2("esri.symbols.MarkerSymbol")], p);
//#endregion
//#region node_modules/@arcgis/core/symbols/SimpleMarkerSymbol.js
var c;
var m = new o$1({
	esriSMSCircle: "circle",
	esriSMSSquare: "square",
	esriSMSCross: "cross",
	esriSMSX: "x",
	esriSMSDiamond: "diamond",
	esriSMSTriangle: "triangle",
	esriSMSPath: "path"
});
var u = c = class extends p {
	constructor(...e) {
		super(...e), this.color = new g([
			255,
			255,
			255,
			.25
		]), this.type = "simple-marker", this.style = "circle", this.outline = new d();
	}
	normalizeCtorArgs(e, t, r, o) {
		if (e && "string" != typeof e) return e;
		const i = {};
		return e && (i.style = e), null != t && (i.size = o$2(t)), r && (i.outline = r), o && (i.color = o), i;
	}
	writeColor(e, t) {
		e && "x" !== this.style && "cross" !== this.style && (t.color = e.toJSON()), null === e && (t.color = null);
	}
	get size() {
		return this._get("size") ?? 12;
	}
	set size(e) {
		this._set("size", e);
	}
	set path(e) {
		this.style = "path", this._set("path", e);
	}
	clone() {
		return new c({
			angle: this.angle,
			color: a(this.color),
			outline: this.outline && this.outline.clone(),
			path: this.path,
			size: this.size,
			style: this.style,
			xoffset: this.xoffset,
			yoffset: this.yoffset
		});
	}
	hash() {
		return `${super.hash()}.${this.color && this.color.hash()}.${this.path}.${this.style}.${this.outline?.hash()}`;
	}
};
__decorate([a$1({ type: g })], u.prototype, "color", void 0), __decorate([r$1("color")], u.prototype, "writeColor", null), __decorate([r({ esriSMS: "simple-marker" }, { readOnly: !0 })], u.prototype, "type", void 0), __decorate([a$1()], u.prototype, "size", null), __decorate([a$1({
	type: m.apiValues,
	json: {
		read: m.read,
		write: m.write
	}
})], u.prototype, "style", void 0), __decorate([a$1({
	type: String,
	json: { write: !0 }
})], u.prototype, "path", null), __decorate([a$1({
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
})], u.prototype, "outline", void 0), u = c = __decorate([c$2("esri.symbols.SimpleMarkerSymbol")], u);
//#endregion
export { n as a, e as i, p as n, n$1 as o, d as r, u as t };

//# sourceMappingURL=SimpleMarkerSymbol-BjFFaoyw.js.map