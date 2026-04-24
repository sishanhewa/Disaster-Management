//#region node_modules/@arcgis/core/geometry/support/quantizationUtils.js
function s(n) {
	if (!n) return null;
	return {
		originPosition: "upper-left" === n.originPosition ? "upperLeft" : "lower-left" === n.originPosition ? "lowerLeft" : n.originPosition,
		scale: n.tolerance ? [
			n.tolerance,
			n.tolerance,
			1,
			1
		] : [
			1,
			1,
			1,
			1
		],
		translate: null != n.extent ? [
			n.extent.xmin,
			n.extent.ymax,
			n.extent.zmin ?? 0,
			n.extent.mmin ?? 0
		] : [
			0,
			0,
			0,
			0
		]
	};
}
function l(n) {
	return "lowerLeft" === n.originPosition && 4 === n.scale.length && 4 === n.translate.length;
}
function u(n) {
	if (l(n)) return n;
	const { originPosition: t, scale: e, translate: r } = n, o = e[0] ?? 1, s = e[1] ?? 1;
	return {
		originPosition: "lowerLeft",
		scale: [
			o,
			"lowerLeft" === t ? s : -s,
			e[2] ?? 1,
			e[3] ?? 1
		],
		translate: [
			r[0] ?? 0,
			r[1] ?? 0,
			r[2] ?? 0,
			r[3] ?? 0
		]
	};
}
function i({ scale: n, translate: t }, e) {
	return Math.round((e - t[0]) / n[0]);
}
function a({ scale: n, translate: t }, e) {
	return Math.round((e - t[1]) / n[1]);
}
function c({ scale: n, translate: t }, e) {
	return Math.round(((e ?? 0) - t[2]) / n[2]);
}
function h({ scale: n, translate: t }, e) {
	return e ? Math.round((e - t[3]) / n[3]) : 0;
}
function f(n, t) {
	return n && t ? M : n && !t ? g : !n && t ? x : m;
}
var m = (n, t) => {
	const e = [];
	if (!t.length) return null;
	const r = t[0];
	let o = i(n, r[0]), s = a(n, r[1]);
	e.push([o, s]);
	for (let l = 1; l < t.length; l++) {
		const [r, u] = t[l], c = i(n, r), h = a(n, u);
		c === o && h === s || e.push([c - o, h - s]), o = c, s = h;
	}
	return e;
}, g = (n, t) => {
	const e = [];
	if (!t.length) return null;
	const r = t[0];
	let o = i(n, r[0]), s = a(n, r[1]), l = c(n, r[2]);
	e.push([
		o,
		s,
		l
	]);
	for (let u = 1; u < t.length; u++) {
		const [r, h, f] = t[u], m = i(n, r), g = a(n, h), x = c(n, f);
		m === o && g === s && x === l || e.push([
			m - o,
			g - s,
			x
		]), o = m, s = g, l = x;
	}
	return e;
}, x = (n, t) => {
	const e = [];
	if (!t.length) return null;
	const r = t[0];
	let o = i(n, r[0]), s = a(n, r[1]), l = h(n, r[2]);
	e.push([
		o,
		s,
		l
	]);
	for (let u = 1; u < t.length; u++) {
		const [r, c, f] = t[u], m = i(n, r), g = a(n, c), x = h(n, f);
		m === o && g === s && x === l || e.push([
			m - o,
			g - s,
			x
		]), o = m, s = g, l = x;
	}
	return e;
}, M = (n, t) => {
	const e = [];
	if (!t.length) return null;
	const r = t[0];
	let o = i(n, r[0]), s = a(n, r[1]), l = c(n, r[2]), u = h(n, r[3]);
	e.push([
		o,
		s,
		l,
		u
	]);
	for (let f = 1; f < t.length; f++) {
		const [r, m, g, x] = t[f], M = i(n, r), I = a(n, m), p = c(n, g), N = h(n, x);
		M === o && I === s && p === l && N === u || e.push([
			M - o,
			I - s,
			p,
			N
		]), o = M, s = I, l = p, u = N;
	}
	return e;
};
function p(n, t, e, r) {
	const o = [], s = f(e, r);
	for (let l = 0; l < t.length; l++) {
		const e = s(n, t[l]);
		e && e.length >= 3 && o.push(e);
	}
	return o.length ? o : null;
}
function N(n, t, e, r) {
	const o = [], s = f(e, r);
	for (let l = 0; l < t.length; l++) {
		const e = s(n, t[l]);
		e && e.length >= 2 && o.push(e);
	}
	return o.length ? o : null;
}
function Z({ scale: n, translate: t }, e) {
	return e * n[0] + t[0];
}
function y({ scale: n, translate: t }, e) {
	return e * n[1] + t[1];
}
function z({ scale: n, translate: t }, e) {
	return (e ?? 0) * n[2] + t[2];
}
function w({ scale: n, translate: t }, e) {
	return e ? e * n[3] + t[3] : 0;
}
function P(n, t) {
	return n && t ? A : n && !t ? E : !n && t ? L : T;
}
var T = (n, t) => {
	const e = new Array(t.length);
	if (!t.length) return e;
	const r = t[0];
	let o = Z(n, r[0]), s = y(n, r[1]);
	e[0] = [o, s];
	const { scale: l, originPosition: u } = n, i = l[0], a = "lowerLeft" === u ? l[1] : -l[1];
	for (let c = 1; c < t.length; c++) {
		const [n, r] = t[c];
		o += i * n, s += a * r, e[c] = [o, s];
	}
	return e;
}, E = (n, t) => {
	const e = new Array(t.length);
	if (!t.length) return e;
	const r = t[0];
	let o = Z(n, r[0]), s = y(n, r[1]);
	e[0] = [
		o,
		s,
		z(n, r[2])
	];
	const { scale: l, originPosition: u } = n, i = l[0], a = "lowerLeft" === u ? l[1] : -l[1];
	for (let c = 1; c < t.length; c++) {
		const [r, l, u] = t[c];
		o += i * r, s += a * l, e[c] = [
			o,
			s,
			z(n, u)
		];
	}
	return e;
}, L = (n, t) => {
	const e = new Array(t.length);
	if (!t.length) return e;
	const r = t[0];
	let o = Z(n, r[0]), s = y(n, r[1]);
	e[0] = [
		o,
		s,
		w(n, r[2])
	];
	const { scale: l, originPosition: u } = n, i = l[0], a = "lowerLeft" === u ? l[1] : -l[1];
	for (let c = 1; c < t.length; c++) {
		const [r, l, u] = t[c];
		o += i * r, s += a * l, e[c] = [
			o,
			s,
			w(n, u)
		];
	}
	return e;
}, A = (n, t) => {
	const e = new Array(t.length);
	if (!t.length) return e;
	const r = t[0];
	let o = Z(n, r[0]), s = y(n, r[1]);
	e[0] = [
		o,
		s,
		z(n, r[2]),
		w(n, r[3])
	];
	const { scale: l, originPosition: u } = n, i = l[0], a = "lowerLeft" === u ? l[1] : -l[1];
	for (let c = 1; c < t.length; c++) {
		const [r, l, u, h] = t[c];
		o += i * r, s += a * l, e[c] = [
			o,
			s,
			z(n, u),
			w(n, h)
		];
	}
	return e;
};
function b(n, t, e) {
	const r = new Array(e.length);
	for (let o = 0; o < e.length; o++) r[o] = t(n, e[o]);
	return r;
}
function j(n, t, e) {
	const r = u(n);
	return t.x = i(r, e.x), t.y = a(r, e.y), null != e.z && (t.z = c(r, e.z)), null != e.m && (t.m = h(r, e.m)), t;
}
function U(n, t, e) {
	const r = p(u(n), e.rings, e.hasZ, e.hasM);
	return r ? (t.rings = r, t.hasZ = e.hasZ ?? !1, t.hasM = e.hasM ?? !1, t) : null;
}
function k(n, t, e) {
	const r = N(u(n), e.paths, e.hasZ, e.hasM);
	return r ? (t.paths = r, t.hasZ = e.hasZ ?? !1, t.hasM = e.hasM ?? !1, t) : null;
}
function B(n, t, e, r = e?.hasZ ?? !1, o = e?.hasM ?? !1) {
	if (null != e) {
		const s = u(n);
		t.points = P(r, o)(s, e.points), t.hasZ = r, t.hasM = o;
	}
	return t;
}
function C(n, t, e, r = null != e?.z, o = null != e?.m) {
	if (null == e) return t;
	const s = u(n);
	return t.x = Z(s, e.x), t.y = y(s, e.y), r && (t.z = z(s, e.z)), o && (t.m = w(s, e.m)), t;
}
function D(n, t, e, r = e?.hasZ ?? !1, o = e?.hasM ?? !1) {
	if (null != e) t.rings = b(u(n), P(r, o), e.rings), t.hasZ = r, t.hasM = o;
	return t;
}
function H(n, t, e, r = e?.hasZ ?? !1, o = e?.hasM ?? !1) {
	if (null != e) t.paths = b(u(n), P(r, o), e.paths), t.hasZ = r, t.hasM = o;
	return t;
}
//#endregion
export { U as a, j as c, u as d, H as i, k as l, C as n, a as o, D as r, i as s, B as t, s as u };

//# sourceMappingURL=quantizationUtils-C-TMvCYs.js.map