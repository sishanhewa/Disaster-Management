import { A as has, t as r } from "./Error-CzxduO2m.js";
import { D as s$1, t as f$1 } from "./request-CuG5cxow.js";
import { D as n$1 } from "./promiseUtils-DhYhergm.js";
import { t as g$2 } from "./Color-C99QAF80.js";
import { f as u$1, l as o$1 } from "./screenUtils-BR-xd7ya.js";
import { c as x$1 } from "./widget-BsQfm1ik.js";
import { t as i$1 } from "./projector-76ZJJlBX.js";
import { i as e, l as s$2, n as a, r as c$2, s as i$2 } from "./mat2d-BuUJVbP4.js";
import { n as n$2 } from "./mat2df32-D4Q05fSu.js";
import { d as U$1, n as C$1 } from "./colorUtils-RKWmAehh.js";
import { r as g$3 } from "./gfxUtils-CbnVrPVV.js";
//#region node_modules/@arcgis/core/symbols/support/svgGlobalState.js
var n = 0;
function t() {
	return n++;
}
var o = 0;
function c$1() {
	return o++;
}
var f = 0;
function i() {
	return f++;
}
//#endregion
//#region node_modules/@arcgis/core/symbols/support/svgUtils.js
var p = "http://www.w3.org/2000/svg", g$1 = has("android"), m$1 = has("chrome") || g$1 && g$1 >= 4 ? "auto" : "optimizeLegibility", x = {
	m: 2,
	l: 2,
	h: 1,
	v: 1,
	c: 6,
	s: 4,
	q: 4,
	t: 2,
	a: 7,
	z: 0
}, w = /([A-DF-Za-df-z])|([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/g;
var k = {}, b = {};
var j = Math.PI;
function M(t, e) {
	const i = t * (j / 180);
	return Math.abs(e * Math.sin(i)) + Math.abs(e * Math.cos(i));
}
function v(t) {
	return t.map((t) => `${t.command} ${t.values.join(" ")}`).join(" ").trim();
}
function S(t, i, r, n, o) {
	if (t) {
		if ("circle" === t.type) return x$1("circle", {
			cx: t.cx,
			cy: t.cy,
			fill: i,
			"fill-rule": "evenodd",
			r: t.r,
			stroke: r.color,
			"stroke-dasharray": r.dashArray,
			"stroke-dashoffset": r.dashOffset,
			"stroke-linecap": r.cap,
			"stroke-linejoin": r.join,
			"stroke-miterlimit": "4",
			"stroke-width": r.width
		});
		if ("ellipse" === t.type) return x$1("ellipse", {
			cx: t.cx,
			cy: t.cy,
			fill: i,
			"fill-rule": "evenodd",
			rx: t.rx,
			ry: t.ry,
			stroke: r.color,
			"stroke-dasharray": r.dashArray,
			"stroke-linecap": r.cap,
			"stroke-linejoin": r.join,
			"stroke-miterlimit": "4",
			"stroke-width": r.width
		});
		if ("rect" === t.type) return x$1("rect", {
			fill: i,
			"fill-rule": "evenodd",
			height: t.height,
			stroke: r.color,
			"stroke-dasharray": r.dashArray,
			"stroke-linecap": r.cap,
			"stroke-linejoin": r.join,
			"stroke-miterlimit": "4",
			"stroke-width": r.width,
			width: t.width,
			x: t.x,
			y: t.y
		});
		if ("image" === t.type) return x$1("image", {
			alt: o || "image",
			height: t.height,
			href: t.src,
			preserveAspectRatio: "none",
			width: t.width,
			x: t.x,
			y: t.y
		});
		if ("path" === t.type) return x$1("path", {
			d: "string" != typeof t.path ? v(t.path) : t.path,
			fill: i,
			"fill-rule": "evenodd",
			stroke: r.color,
			"stroke-dasharray": r.dashArray,
			"stroke-linecap": r.cap,
			"stroke-linejoin": r.join,
			"stroke-miterlimit": "4",
			"stroke-width": r.width
		});
		if ("text" === t.type) return n$1(n), x$1("text", {
			"dominant-baseline": n.dominantBaseline,
			fill: i,
			"fill-rule": "evenodd",
			"font-family": n.font.family,
			"font-size": n.font.size,
			"font-style": n.font.style,
			"font-variant": n.font.variant,
			"font-weight": n.font.weight,
			kerning: n.kerning,
			rotate: n.rotate,
			stroke: r.color,
			"stroke-dasharray": r.dashArray,
			"stroke-linecap": r.cap,
			"stroke-linejoin": r.join,
			"stroke-miterlimit": "4",
			"stroke-width": r.width,
			"text-anchor": n.align,
			"text-decoration": n.decoration,
			"text-rendering": m$1,
			x: t.x,
			y: t.y
		}, t.text);
	}
	return null;
}
function $(e) {
	if (!e) return {
		fill: "none",
		pattern: null,
		linearGradient: null
	};
	if (!("type" in e)) return {
		fill: new g$2(e).toString(),
		pattern: null,
		linearGradient: null
	};
	if ("pattern" === e.type) {
		const t$1 = `patternId-${t()}`;
		return {
			fill: `url(#${t$1})`,
			pattern: {
				id: t$1,
				x: e.x,
				y: e.y,
				width: e.width,
				height: e.height,
				image: {
					x: 0,
					y: 0,
					width: e.width,
					height: e.height,
					href: e.src
				}
			},
			linearGradient: null
		};
	}
	const i = `linearGradientId-${c$1()}`;
	return {
		fill: `url(#${i})`,
		pattern: null,
		linearGradient: {
			id: i,
			x1: e.x1,
			y1: e.y1,
			x2: e.x2,
			y2: e.y2,
			stops: e.colors.map((e) => ({
				offset: e.offset,
				color: e.color && new g$2(e.color).toString()
			}))
		}
	};
}
function A(e) {
	const i = {
		color: "none",
		width: 1,
		cap: "butt",
		join: "4",
		dashArray: "none",
		dashOffset: "0"
	};
	return e && (null != e.width && (i.width = e.width), e.cap && (i.cap = e.cap), e.join && (i.join = e.join.toString()), e.color && (i.color = new g$2(e.color).toString()), e.dashArray && (i.dashArray = e.dashArray), e.dashoffset && (i.dashOffset = e.dashoffset), e.style && !e.dashArray && (i.dashArray = g$3(e).join(",") || "none")), i;
}
function G(t, i) {
	const r = {
		align: null,
		decoration: null,
		kerning: null,
		rotate: null,
		font: {
			style: null,
			variant: null,
			weight: null,
			size: null,
			family: null
		}
	};
	if (t) {
		const n = t.alignBaseline, o = "baseline" === n ? "auto" : "top" === n ? "text-top" : "bottom" === n ? "hanging" : n;
		r.align = t.align, r.dominantBaseline = o, r.decoration = t.decoration, r.kerning = t.kerning ? "auto" : "0", r.rotate = t.rotated ? "90" : "0", n$1(i), r.font.style = i.style || "normal", r.font.variant = i.variant || "normal", r.font.weight = i.weight || "normal", r.font.size = i.size && i.size.toString() || "10pt", r.font.family = i.family || "serif";
	}
	return r;
}
function N(t) {
	const { pattern: e, linearGradient: i } = t;
	if (e) return x$1("pattern", {
		height: e.height,
		id: e.id,
		patternUnits: "userSpaceOnUse",
		width: e.width,
		x: e.x,
		y: e.y
	}, x$1("image", {
		height: e.image.height,
		href: e.image.href,
		width: e.image.width,
		x: e.image.x,
		y: e.image.y
	}));
	if (i) {
		const t = i.stops.map((t, e) => x$1("stop", {
			key: `${e}-stop`,
			offset: t.offset,
			"stop-color": t.color
		}));
		return x$1("linearGradient", {
			gradientUnits: "userSpaceOnUse",
			id: i.id,
			x1: i.x1,
			x2: i.x2,
			y1: i.y1,
			y2: i.y2
		}, t);
	}
	return null;
}
function z(t, e) {
	if (!t || 0 === t.length) return null;
	const i = [];
	for (const r of t) {
		const { shape: t, fill: e, stroke: n, font: o } = r, s = $(e), a = A(n), l = "text" === t.type ? G(t, o) : null, h = S(t, s.fill, a, l);
		h && i.push(h);
	}
	return x$1("mask", {
		id: e,
		maskUnits: "userSpaceOnUse"
	}, x$1("g", null, i));
}
function B(t, e, i) {
	return i$2(t, a(t), [e, i]);
}
function I(t, e, i, r, n) {
	return c$2(t, a(t), [e, i]), t[4] = t[4] * e - r * e + r, t[5] = t[5] * i - n * i + n, t;
}
function U(t, e, i, r) {
	const n = e % 360 * Math.PI / 180;
	s$2(t, a(t), n);
	const o = Math.cos(n), s = Math.sin(n), l = t[4], f = t[5];
	return t[4] = l * o - f * s + r * s - i * o + i, t[5] = f * o + l * s - i * s - r * o + r, t;
}
function F(t, e) {
	k && "left" in k ? (null != k.left && k.left > t && (k.left = t), (null == k.right || k.right < t) && (k.right = t), (null == k.top || k.top > e) && (k.top = e), (null == k.bottom || k.bottom < e) && (k.bottom = e)) : k = {
		left: t,
		bottom: e,
		right: t,
		top: e
	};
}
function E(t) {
	const e = t.args, i = e.length;
	let r;
	switch (t.action) {
		case "M":
		case "L":
		case "C":
		case "S":
		case "Q":
		case "T":
			for (r = 0; r < i; r += 2) F(e[r], e[r + 1]);
			b.x = e[i - 2], b.y = e[i - 1];
			break;
		case "H":
			for (r = 0; r < i; ++r) F(e[r], b.y);
			b.x = e[i - 1];
			break;
		case "V":
			for (r = 0; r < i; ++r) F(b.x, e[r]);
			b.y = e[i - 1];
			break;
		case "m": {
			let t = 0;
			"x" in b || (F(b.x = e[0], b.y = e[1]), t = 2);
			for (r = t; r < i; r += 2) F(b.x += e[r], b.y += e[r + 1]);
			break;
		}
		case "l":
		case "t":
			for (r = 0; r < i; r += 2) F(b.x += e[r], b.y += e[r + 1]);
			break;
		case "h":
			for (r = 0; r < i; ++r) F(b.x += e[r], b.y);
			break;
		case "v":
			for (r = 0; r < i; ++r) F(b.x, b.y += e[r]);
			break;
		case "c":
			for (r = 0; r < i; r += 6) F(b.x + e[r], b.y + e[r + 1]), F(b.x + e[r + 2], b.y + e[r + 3]), F(b.x += e[r + 4], b.y += e[r + 5]);
			break;
		case "s":
		case "q":
			for (r = 0; r < i; r += 4) F(b.x + e[r], b.y + e[r + 1]), F(b.x += e[r + 2], b.y += e[r + 3]);
			break;
		case "A":
			for (r = 0; r < i; r += 7) F(e[r + 5], e[r + 6]);
			b.x = e[i - 2], b.y = e[i - 1];
			break;
		case "a": for (r = 0; r < i; r += 7) F(b.x += e[r + 5], b.y += e[r + 6]);
	}
}
function O(t, e, i) {
	const r = x[t.toLowerCase()];
	let n;
	"number" == typeof r && (r ? e.length >= r && (n = {
		action: t,
		args: e.slice(0, e.length - e.length % r)
	}, i.push(n), E(n)) : (n = {
		action: t,
		args: []
	}, i.push(n), E(n)));
}
function T(t) {
	const e = ("string" != typeof t.path ? v(t.path) : t.path).match(w), i = [];
	if (k = {}, b = {}, !e) return null;
	let r = "", n = [];
	const o = e.length;
	for (let a = 0; a < o; ++a) {
		const t = e[a], o = parseFloat(t);
		isNaN(o) ? (r && O(r, n, i), n = [], r = t) : n.push(o);
	}
	O(r, n, i);
	const s = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	return k && "left" in k && (s.x = k.left, s.y = k.top, s.width = k.right - k.left, s.height = k.bottom - k.top), s;
}
function L(t) {
	const e = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	if ("circle" === t.type) e.x = t.cx - t.r, e.y = t.cy - t.r, e.width = 2 * t.r, e.height = 2 * t.r;
	else if ("ellipse" === t.type) e.x = t.cx - t.rx, e.y = t.cy - t.ry, e.width = 2 * t.rx, e.height = 2 * t.ry;
	else if ("image" === t.type || "rect" === t.type) e.x = t.x, e.y = t.y, e.width = t.width, e.height = t.height;
	else if ("path" === t.type) {
		const i = T(t);
		e.x = i.x, e.y = i.y, e.width = i.width, e.height = i.height;
	}
	return e;
}
function R(t) {
	const e = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	let i = null, r = Number.NEGATIVE_INFINITY, n = Number.NEGATIVE_INFINITY;
	for (const o of t) i ? (i.x = Math.min(i.x, o.x), i.y = Math.min(i.y, o.y), r = Math.max(r, o.x + o.width), n = Math.max(n, o.y + o.height)) : (i = e, i.x = o.x, i.y = o.y, r = o.x + o.width, n = o.y + o.height);
	return i && (i.width = r - i.x, i.height = n - i.y), i;
}
function C(t, e$1, i, r, s, a, l, h, f) {
	let c = (l && a ? M(a, e$1) : e$1) / 2, u = (l && a ? M(a, i) : i) / 2;
	if (f) {
		const t = f[0], e = f[1];
		c = (l && a ? M(a, t) : t) / 2, u = (l && a ? M(a, e) : e) / 2;
	}
	const d = t.width + r, y = t.height + r, p = n$2(), g = n$2();
	let m = !1;
	if (s && 0 !== d && 0 !== y) {
		const t = e$1 !== i ? e$1 / i : d / y, r = e$1 > i ? e$1 : i;
		let n = 1, s = 1;
		isNaN(r) || (t > 1 ? (n = r / d, s = r / t / y) : (s = r / y, n = r * t / d)), e(g, g, I(p, n, s, c, u)), m = !0;
	}
	const x = t.x + (d - r) / 2, w = t.y + (y - r) / 2;
	if (e(g, g, B(p, c - x, u - w)), !m && (d > e$1 || y > i)) {
		const t = d / e$1 > y / i, r = (t ? e$1 : i) / (t ? d : y);
		e(g, g, I(p, r, r, x, w));
	}
	return h && e(g, g, B(p, h[0], h[1])), a && e(g, g, U(p, a, x, w)), `matrix(${g[0]},${g[1]},${g[2]},${g[3]},${g[4]},${g[5]})`;
}
function D(t) {
	const e = t?.match(/bloom\(\s*([^\s]+)\s+([^\s]+)\s+([^\s]+)\s*\)/i);
	if (!e) return null;
	const [, n, o, s] = e;
	return {
		strength: Number(n),
		radius: u$1(o$1(o)),
		threshold: Number(s)
	};
}
function V(t, e, i) {
	const r = D(t);
	if (!r) return null;
	const { strength: n, radius: o } = r, s = n > 0 ? o : 0, a = (n + s) * e, l = 4 * n + 1;
	return x$1("filter", {
		filterUnits: "userSpaceOnUse",
		height: "300%",
		id: `bloom${i}`,
		width: "300%",
		x: "-100%",
		y: "-100%"
	}, x$1("feMorphology", {
		in: "SourceGraphic",
		operator: "dilate",
		radius: (n + .5 * s) * (5 ** (e / 100) * (.4 + e / 100)),
		result: "dilate"
	}), x$1("feGaussianBlur", {
		in: "dilate",
		result: "blur",
		stdDeviation: a / 25
	}), x$1("feGaussianBlur", {
		in: "blur",
		result: "intensityBlur",
		stdDeviation: a / 50
	}), x$1("feComponentTransfer", {
		in: "SourceGraphic",
		result: "intensityBrightness"
	}, x$1("feFuncR", {
		slope: l,
		type: "linear"
	}), x$1("feFuncG", {
		slope: l,
		type: "linear"
	}), x$1("feFuncB", {
		slope: l,
		type: "linear"
	})), x$1("feMerge", null, x$1("feMergeNode", { in: "intensityBlur" }), x$1("feMergeNode", { in: "intensityBrightness" }), x$1("feGaussianBlur", { stdDeviation: n / 10 })));
}
function q(t, i$3, r, n = {}) {
	const o = [], s = [], a = i(), l = V(n.cssEffectFilter, i$3, a);
	let h = null;
	if (l) {
		const t = D(n.cssEffectFilter), e = n.clipBloomEffect || !t?.strength ? 0 : (t.strength + t.radius / 2) / 3, o = i$3 + i$3 * e, s = r + r * e;
		h = [Math.max(o, 10), Math.max(s, 10)];
	}
	let f = i$3, u = r;
	if (n.useRotationSize) for (let e = 0; e < t.length; e++) {
		const t = n.rotations?.[e] ?? 0;
		f = Math.max(M(t, i$3), f), u = Math.max(M(t, r), u);
	}
	for (let e = 0; e < t.length; e++) {
		const a = t[e], l = [], c = [];
		let d = 0, p = 0, g = 0;
		for (const t of a) {
			const { shape: e, fill: i, stroke: r, font: s, offset: a } = t;
			n.ignoreStrokeWidth || "text" === e.type || (d += r?.width || 0);
			const h = $(i), f = A(r), u = "text" === e.type ? G(e, s) : null;
			o.push(N(h)), l.push(S(e, h.fill, f, u, n.ariaLabel)), c.push(L(e)), a && (p += a[0], g += a[1]);
		}
		const m = n.rotations?.[e] ?? 0;
		n.useRotationSize && (p += (f - M(m, i$3)) / 2, g += (u - M(m, r)) / 2);
		const x = C(R(c), i$3, r, d, n.scale ?? !1, m, n.useRotationSize ?? !1, [p, g], h);
		let w = null;
		if (n.masking) {
			const t = `mask-${e}`, i = n.masking[e];
			o.push(z(i, t)), w = `url(#${t})`;
		}
		s.push(w ? x$1("g", { mask: w }, x$1("g", { transform: x }, l)) : x$1("g", { transform: x }, l));
	}
	l && (n$1(h), f = h[0], u = h[1]);
	const d = "display: block;";
	return x$1("svg", {
		"aria-label": n.ariaLabel,
		focusable: !1,
		height: u,
		role: "img",
		style: d,
		width: f,
		xmlns: p
	}, l, x$1("defs", null, o), l ? x$1("g", { filter: `url(#bloom${a})` }, s) : s);
}
//#endregion
//#region node_modules/@arcgis/core/symbols/support/renderUtils.js
var c = i$1();
function s(t, e) {
	c.append(t, e), c.detach(e);
}
function l(t, e, i) {
	const r = Math.ceil(e[0]), n = Math.ceil(e[1]);
	if (!t.some((t) => !!t.length)) return null;
	const o = i?.node || document.createElement("div");
	null != i.opacity && (o.style.opacity = i.opacity.toString()), null != i.cssEffectFilter && (o.style.filter = i.cssEffectFilter);
	return s(o, () => q(t, r, n, i)), o;
}
function h(t, e) {
	t = Math.ceil(t), e = Math.ceil(e);
	const i = document.createElement("canvas");
	i.width = t, i.height = e, i.style.width = t + "px", i.style.height = e + "px";
	const r = i.getContext("2d");
	return r.clearRect(0, 0, t, e), r;
}
function m(t, i, r$1) {
	return t ? f$1(t, { responseType: "image" }).then((t) => {
		const e = t.data, n = e.width, o = e.height, a = n / o;
		let c = i;
		if (r$1) c = Math.min(c, Math.max(n, o));
		return {
			image: e,
			width: a <= 1 ? Math.ceil(c * a) : c,
			height: a <= 1 ? c : Math.ceil(c / a)
		};
	}) : Promise.reject(new r("renderUtils: imageDataSize", "href not provided."));
}
function g(t, e) {
	return !(!t || "ignore" === e) && ("multiply" !== e || 255 !== t.r || 255 !== t.g || 255 !== t.b || 1 !== t.a);
}
function u(t, e, n, o, a) {
	switch (a) {
		case "multiply":
			t[e] *= n[0], t[e + 1] *= n[1], t[e + 2] *= n[2], t[e + 3] *= n[3];
			break;
		default: {
			const a = U$1({
				r: t[e],
				g: t[e + 1],
				b: t[e + 2]
			});
			a.h = o.h, a.s = o.s, a.v = a.v / 100 * o.v;
			const c = C$1(a);
			t[e] = c.r, t[e + 1] = c.g, t[e + 2] = c.b, t[e + 3] *= n[3];
			break;
		}
	}
}
function d(e, r, n, o, a) {
	return m(e, r, a).then((a) => {
		const c = a.width ?? r, s = a.height ?? r;
		if (a.image && g(n, o)) {
			let t = a.image.width, r = a.image.height;
			has("edge") && /\.svg$/i.test(e) && (t -= 1, r -= 1);
			const l = h(c, s);
			l.drawImage(a.image, 0, 0, t, r, 0, 0, c, s);
			const m = l.getImageData(0, 0, c, s), g = [
				n.r / 255,
				n.g / 255,
				n.b / 255,
				n.a
			], d = U$1(n);
			for (let e = 0; e < m.data.length; e += 4) u(m.data, e, g, d, o);
			l.putImageData(m, 0, 0), e = l.canvas.toDataURL("image/png");
		} else {
			const i = s$1?.findCredential(e);
			if (i?.token) {
				const t = e.includes("?") ? "&" : "?";
				e = `${e}${t}token=${i.token}`;
			}
		}
		return {
			url: e,
			width: c,
			height: s
		};
	}).catch(() => ({
		url: e,
		width: r,
		height: r
	}));
}
//#endregion
export { C as a, R as c, A as i, S as l, l as n, L as o, $ as r, N as s, d as t, q as u };

//# sourceMappingURL=renderUtils-5lWsid4p.js.map