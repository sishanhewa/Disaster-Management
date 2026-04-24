import { _ as s$1 } from "./Error-CzxduO2m.js";
//#region node_modules/@arcgis/core/core/fontUtils.js
var t = "arial-unicode-ms", n = "woff2", r = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
var s = class {
	constructor(e, t) {
		this.fontFace = e, this.promise = t;
	}
};
async function c(t) {
	const c = l(t), a = f(t), i = r.get(c);
	if (i) return i.promise;
	const u = new FontFace(t.family, `url('${s$1.fontsUrl}/woff2/${a}.${n}') format('${n}')`, {
		style: t.style,
		weight: t.weight
	}), d = document.fonts;
	if (d.has(u) && "loading" === u.status) return u.loaded;
	const h = u.load().then(() => (d.add(u), u));
	return r.set(c, new s(u, h)), o.add(u), h;
}
function i(e) {
	return o.has(e);
}
function u(e) {
	if (!e) return t;
	const n = e.toLowerCase().split(" ").join("-");
	switch (n) {
		case "serif": return "noto-serif";
		case "sans-serif": return "arial-unicode-ms";
		case "monospace": return "ubuntu-mono";
		case "fantasy": return "cabin-sketch";
		case "cursive": return "redressed";
		default: return n;
	}
}
function f(e) {
	const t = d(e) + h(e);
	return u(e.family) + (t.length > 0 ? t : "-regular");
}
function l(e) {
	const n = d(e) + h(e);
	return (e.family || "arial-unicode-ms") + (n.length > 0 ? n : "-regular");
}
function d(e) {
	if (!e.weight) return "";
	switch (e.weight.toLowerCase()) {
		case "bold":
		case "bolder": return "-bold";
	}
	return "";
}
function h(e) {
	if (!e.style) return "";
	switch (e.style.toLowerCase()) {
		case "italic":
		case "oblique": return "-italic";
	}
	return "";
}
//#endregion
export { u as a, t as i, f as n, i as r, c as t };

//# sourceMappingURL=fontUtils-CPPDvNws.js.map