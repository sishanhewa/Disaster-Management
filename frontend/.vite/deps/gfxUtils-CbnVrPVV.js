import { t as f$1 } from "./request-CuG5cxow.js";
import { t as n } from "./assets-BZbzeyNa.js";
import { t as g$1 } from "./Color-C99QAF80.js";
import { f as u$1 } from "./screenUtils-BR-xd7ya.js";
import { t as e } from "./LRUCache-C0A4Jg0w.js";
import { i as u$2 } from "./cimSymbolUtils-Cj8o8DGt.js";
//#region node_modules/@arcgis/core/symbols/support/gfxUtils.js
var i = "picture-fill", l = "simple-fill", a = "simple-line", c = "simple-marker", h = "text", d = "cim", m = new Map([
	["dash", [4, 3]],
	["dashdot", [
		4,
		3,
		1,
		3
	]],
	["dot", [1, 3]],
	["longdash", [8, 3]],
	["longdashdot", [
		8,
		3,
		1,
		3
	]],
	["longdashdotdot", [
		8,
		3,
		1,
		3,
		1,
		3
	]],
	["shortdash", [4, 1]],
	["shortdashdot", [
		4,
		1,
		1,
		1
	]],
	["shortdashdotdot", [
		4,
		1,
		1,
		1,
		1,
		1
	]],
	["shortdot", [1, 1]],
	["solid", []]
]), p = new e(1e3);
function u(e) {
	const o = e.style;
	let s = null;
	if (e) switch (e.type) {
		case c:
			"cross" !== o && "x" !== o && (s = e.color);
			break;
		case l:
			o && "solid" !== o ? "none" !== o && (s = {
				type: "pattern",
				x: 0,
				y: 0,
				src: n(`esri/symbols/patterns/${o}.png`),
				width: 5,
				height: 5
			}) : s = e.color;
			break;
		case i:
			s = {
				type: "pattern",
				src: e.url,
				width: u$1(e.width) * e.xscale,
				height: u$1(e.height) * e.yscale,
				x: u$1(e.xoffset),
				y: u$1(e.yoffset)
			};
			break;
		case h:
			s = e.color;
			break;
		case d: s = u$2(e);
	}
	return s;
}
function f(t, e) {
	const s = t + "-" + e, r = p.get(s);
	return null != r ? Promise.resolve(r) : f$1(t, { responseType: "image" }).then((t) => {
		const o = t.data, r = o.naturalWidth, n = o.naturalHeight, i = document.createElement("canvas");
		i.width = r, i.height = n;
		const l = i.getContext("2d");
		l.fillStyle = e, l.fillRect(0, 0, r, n), l.globalCompositeOperation = "destination-in", l.drawImage(o, 0, 0);
		const a = i.toDataURL();
		return p.put(s, a), a;
	});
}
function y(t) {
	if (!t) return null;
	let e = null;
	switch (t.type) {
		case l:
		case i:
		case c:
			e = y(t.outline);
			break;
		case a: {
			const o = u$1(t.width);
			null != t.style && "none" !== t.style && 0 !== o && (e = {
				color: t.color,
				style: w(t.style),
				width: o,
				cap: t.cap,
				join: "miter" === t.join ? u$1(t.miterLimit) : t.join
			}, e.dashArray = g(e).join(",") || "none");
			break;
		}
		default: e = null;
	}
	return e;
}
function g(t) {
	if (!t?.style) return [];
	const { dashArray: e, style: o, width: s } = t;
	if ("string" == typeof e && "none" !== e) return e.split(",").map((t) => Number(t));
	const r = s ?? 0, n = m.has(o) ? m.get(o).map((t) => t * r) : [];
	if ("butt" !== t.cap) for (const [i, l] of n.entries()) n[i] = i % 2 == 1 ? l + r : Math.max(l - r, 1);
	return n;
}
var w = (() => {
	const t = {};
	return (e) => {
		if (t[e]) return t[e];
		const o = e.replaceAll("-", "");
		return t[e] = o, o;
	};
})(), b = new g$1([
	128,
	128,
	128
]);
//#endregion
export { w as a, u as i, f as n, y as o, g as r, b as t };

//# sourceMappingURL=gfxUtils-CbnVrPVV.js.map