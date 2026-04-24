import { n as __exportAll } from "./chunk-BoAXSpZd.js";
import { n, t as r } from "./Error-CzxduO2m.js";
import { t as n$1 } from "./assets-BZbzeyNa.js";
import { f as u } from "./screenUtils-BR-xd7ya.js";
import { d as U$1, n as C$1 } from "./colorUtils-RKWmAehh.js";
import { a as w, n as f, t as b } from "./gfxUtils-CbnVrPVV.js";
import { o as d, s as h } from "./utils-C2bZ_DGG.js";
import { n as l, t as d$1 } from "./renderUtils-5lWsid4p.js";
import { a as l$1, c as o, d as t, f as u$1, l as p, n as c, o as m, r as e, s as n$2, t as L, u as s } from "./previewUtils-BoKcN8F-.js";
import "./primitives-BqLm4jAn.js";
import { n as h$1 } from "./webStyleSymbolUtils-CsI6eHIi.js";
//#region node_modules/@arcgis/core/symbols/support/previewSymbol3D.js
var previewSymbol3D_exports = /* @__PURE__ */ __exportAll({
	getPatternDescriptor: () => H,
	getSizeFromOptions: () => G,
	getSymbolLayerFill: () => Z,
	previewSymbol3D: () => W
});
var S = 22, P = 120, U = 80, C = 50, D = 20;
function O(e) {
	const t = e.outline, l = null != e.material ? e.material.color : null, a = null != l ? l.toHex() : null;
	if (null == t || "pattern" in t && null != t.pattern && "style" === t.pattern.type && "none" === t.pattern.style) return "fill" === e.type && "#ffffff" === a ? {
		color: "#bdc3c7",
		width: .75
	} : null;
	const s = u(t.size) || 0;
	return {
		color: "rgba(" + (null != t.color ? t.color.toRgba() : "255,255,255,1") + ")",
		width: Math.min(s, U),
		style: "pattern" in t && null != t.pattern && "style" === t.pattern.type ? w(t.pattern.style) : null,
		join: "butt",
		cap: "patternCap" in t ? t.patternCap : "butt"
	};
}
async function E(t, l) {
	if (t.thumbnail?.url) return t.thumbnail.url;
	if ("icon" === l.type) {
		if (l?.resource?.href) return d(l);
	}
	const a = n$1("esri/images/Legend/legend3dsymboldefault.png");
	if (t.styleOrigin && (t.styleOrigin.styleName || t.styleOrigin.styleUrl)) {
		const e = await h$1(t.styleOrigin, { portal: t.styleOrigin.portal }).catch(() => null);
		if (e && "thumbnail" in e && e.thumbnail?.url) return e.thumbnail.url;
	}
	return a;
}
function q(e, a = 1) {
	const s = e.a, n = U$1(e), r = n.h, { r: c, g: p, b: u } = C$1({
		h: r,
		s: n.s / a,
		v: 100 - (100 - n.v) / a
	});
	return [
		c,
		p,
		u,
		s
	];
}
function R(e) {
	return "water" === e.type ? null == e.color ? null : e.color : null == e.material?.color ? null : e.material.color;
}
function Z(e, t = 0) {
	const l = R(e);
	if (!l) {
		if ("fill" === e.type) return null;
		const l = b.r, a = u$1(l, t);
		return [
			a,
			a,
			a,
			100
		];
	}
	const a = l.toRgba();
	for (let s = 0; s < 3; s++) a[s] = u$1(a[s], t);
	return a;
}
async function H(t, l) {
	const a = t.style;
	if ("none" === a) return null;
	return {
		type: "pattern",
		x: 0,
		y: 0,
		src: await f(n$1(`esri/symbols/patterns/${a}.png`), l.toCss(!0)),
		width: 5,
		height: 5
	};
}
function I(e) {
	return e.outline ? O(e) : {
		color: "rgba(0, 0, 0, 1)",
		width: 1.5
	};
}
function N(e, t) {
	const l = R(e);
	if (!l) return null;
	let a = "rgba(";
	return a += u$1(l.r, t) + ",", a += u$1(l.g, t) + ",", a += u$1(l.b, t) + ",", a + l.a + ");";
}
function T(e, t) {
	const l = e.edges;
	if (!l || !l.color || !l.size) return null;
	return {
		color: l.color.toCss(!0),
		width: Math.min(u(l.size), t, U),
		join: "round"
	};
}
function F(e, t) {
	const l = N(e, t);
	if (!l) return null;
	if ("pattern" in e && null != e.pattern && "style" === e.pattern.type && "none" === e.pattern.style) return null;
	const a = {
		color: l,
		width: Math.min(e.size ? u(e.size) : .75, U)
	};
	return "pattern" in e && "style" === e.pattern?.type && (a.style = w(e.pattern.style)), "cap" in e && e.cap && (a.cap = e.cap), "join" in e && e.join && (a.join = "miter" === e.join ? u(2) : e.join), a;
}
function $(e, t, l) {
	const a = null != l ? .75 * l : 0;
	return {
		type: "linear",
		x1: a ? .25 * a : 0,
		y1: a ? .5 * a : 0,
		x2: a || 4,
		y2: a ? .5 * a : 4,
		colors: [{
			color: e,
			offset: 0
		}, {
			color: t,
			offset: 1
		}]
	};
}
function A(e) {
	const t = e.depth, l = e.height, a = e.width;
	return 0 !== a && 0 !== t && 0 !== l && a === t && null != a && null != l && a < l;
}
function B(e, t, l) {
	const a = [];
	if (!e) return a;
	switch (e.type) {
		case "icon": {
			const l = 0, s = 0, n = t, r = t;
			switch (e.resource?.primitive ?? "circle") {
				case "circle":
					a.push({
						shape: {
							type: "circle",
							cx: 0,
							cy: 0,
							r: .5 * t
						},
						fill: Z(e, 0),
						stroke: O(e)
					});
					break;
				case "square":
					a.push({
						shape: {
							type: "path",
							path: [
								{
									command: "M",
									values: [l, r]
								},
								{
									command: "L",
									values: [l, s]
								},
								{
									command: "L",
									values: [n, s]
								},
								{
									command: "L",
									values: [n, r]
								},
								{
									command: "Z",
									values: []
								}
							]
						},
						fill: Z(e, 0),
						stroke: O(e)
					});
					break;
				case "triangle":
					a.push({
						shape: {
							type: "path",
							path: [
								{
									command: "M",
									values: [l, r]
								},
								{
									command: "L",
									values: [.5 * n, s]
								},
								{
									command: "L",
									values: [n, r]
								},
								{
									command: "Z",
									values: []
								}
							]
						},
						fill: Z(e, 0),
						stroke: O(e)
					});
					break;
				case "cross":
					a.push({
						shape: {
							type: "path",
							path: [
								{
									command: "M",
									values: [.5 * n, s]
								},
								{
									command: "L",
									values: [.5 * n, r]
								},
								{
									command: "M",
									values: [l, .5 * r]
								},
								{
									command: "L",
									values: [n, .5 * r]
								}
							]
						},
						stroke: I(e)
					});
					break;
				case "x":
					a.push({
						shape: {
							type: "path",
							path: [
								{
									command: "M",
									values: [l, s]
								},
								{
									command: "L",
									values: [n, r]
								},
								{
									command: "M",
									values: [n, s]
								},
								{
									command: "L",
									values: [l, r]
								}
							]
						},
						stroke: I(e)
					});
					break;
				case "kite": a.push({
					shape: {
						type: "path",
						path: [
							{
								command: "M",
								values: [l, .5 * r]
							},
							{
								command: "L",
								values: [.5 * n, s]
							},
							{
								command: "L",
								values: [n, .5 * r]
							},
							{
								command: "L",
								values: [.5 * n, r]
							},
							{
								command: "Z",
								values: []
							}
						]
					},
					fill: Z(e, 0),
					stroke: O(e)
				});
			}
			break;
		}
		case "object":
			switch (e.resource?.primitive ?? "sphere") {
				case "cone": {
					const s = $(Z(e, 0), Z(e, -.6), l ? D : t), n = n$2(t, l);
					a.push({
						shape: n[0],
						fill: s
					}, {
						shape: n[1],
						fill: s
					});
					break;
				}
				case "inverted-cone": {
					const l = Z(e, 0), s = $(l, Z(e, -.6), t), n = o(t);
					a.push({
						shape: n[0],
						fill: s
					}, {
						shape: n[1],
						fill: l
					});
					break;
				}
				case "cube": {
					const s = p(t, l);
					a.push({
						shape: s[0],
						fill: Z(e, 0)
					}, {
						shape: s[1],
						fill: Z(e, -.3)
					}, {
						shape: s[2],
						fill: Z(e, -.5)
					});
					break;
				}
				case "cylinder": {
					const s = $(Z(e, 0), Z(e, -.6), l ? D : t), n = L(t, l);
					a.push({
						shape: n[0],
						fill: s
					}, {
						shape: n[1],
						fill: s
					}, {
						shape: n[2],
						fill: Z(e, 0)
					});
					break;
				}
				case "diamond": {
					const l = l$1(t);
					a.push({
						shape: l[0],
						fill: Z(e, -.3)
					}, {
						shape: l[1],
						fill: Z(e, 0)
					}, {
						shape: l[2],
						fill: Z(e, -.3)
					}, {
						shape: l[3],
						fill: Z(e, -.7)
					});
					break;
				}
				case "sphere": {
					const l = $(Z(e, 0), Z(e, -.6));
					l.x1 = 0, l.y1 = 0, l.x2 = .25 * t, l.y2 = .25 * t, a.push({
						shape: {
							type: "circle",
							cx: 0,
							cy: 0,
							r: .5 * t
						},
						fill: l
					});
					break;
				}
				case "tetrahedron": {
					const l = s(t);
					a.push({
						shape: l[0],
						fill: Z(e, -.3)
					}, {
						shape: l[1],
						fill: Z(e, 0)
					}, {
						shape: l[2],
						fill: Z(e, -.6)
					});
					break;
				}
			}
			break;
	}
	return a;
}
function G(e) {
	const t = "number" == typeof e?.size ? e?.size : null;
	return t ? u(t) : null;
}
function J(e) {
	return "icon" === e.type ? "multiply" : "tint";
}
async function K(e, t) {
	const l$2 = G(t), a = t?.maxSize ? u(t.maxSize) : null, r = t?.disableUpsampling ?? !1, o = e.symbolLayers, i = [], c = [];
	let p = !1, u$2 = 0, h = 0, m = 0;
	o.forEach((s) => {
		if ("icon" !== s.type && "object" !== s.type) return;
		s && "icon" === s.type && (m = Math.max(s.size && u(s.size), m));
		const o = "icon" === s.type ? s.size && u(s.size) : 0, f = l$2 || o ? Math.ceil(Math.min(l$2 || o, a || P)) : S;
		let y = "icon" === s.type ? s.angle : null;
		if (null != t?.rotation && (y = (y ?? 0) + t.rotation), c.push(y), s?.resource?.href) {
			const t = E(e, s).then((e) => {
				const t = s?.material?.color;
				return d$1(e, f, t, J(s), r);
			}).then((e) => {
				const t = e.width, l = e.height;
				return u$2 = Math.max(u$2, t), h = Math.max(h, l), y && (p = !0), [{
					shape: {
						type: "image",
						x: 0,
						y: 0,
						width: t,
						height: l,
						src: e.url
					},
					fill: null,
					stroke: null
				}];
			});
			i.push(t);
		} else {
			let e = f;
			"icon" === s.type && l$2 && (e = f * (o / m));
			const a = "tall" === t?.symbolConfig || t?.symbolConfig?.isTall || "object" === s.type && A(s);
			u$2 = Math.max(u$2, a ? D : e), h = Math.max(h, e), y && s.resource?.primitive && [
				"square",
				"triangle",
				"x"
			].includes(s.resource?.primitive) && (p = !0), i.push(Promise.resolve(B(s, e, a)));
		}
	});
	const f = await Promise.allSettled(i), y = [];
	return f.forEach((e) => {
		"fulfilled" === e.status ? y.push(e.value) : e.reason && n.getLogger("esri.symbols.support.previewSymbol3D").warn("error while building swatchInfo!", e.reason);
	}), l(y, [u$2, h], {
		node: t?.node,
		scale: !1,
		opacity: t?.opacity,
		ariaLabel: t?.ariaLabel,
		rotations: c,
		useRotationSize: p
	});
}
function Q(e$3, t$3) {
	const l$3 = e$3.symbolLayers, a = [], s = h(e$3), r = G(t$3), o = (t$3?.maxSize ? u(t$3.maxSize) : null) || U;
	let i, c = 0, u$3 = 0;
	return l$3.forEach((e$2, t$2) => {
		if (!e$2) return;
		if ("line" !== e$2.type && "path" !== e$2.type) return;
		const l = [];
		switch (e$2.type) {
			case "line": {
				const a = F(e$2, 0);
				if (null == a) break;
				const s = a?.width || 0;
				0 === t$2 && (i = s);
				const n = Math.min(r || s, o), p = 0 === t$2 ? n : r ? n * (s / i) : n, h = p > C / 2 ? 2 * p : C;
				u$3 = Math.max(u$3, p), c = Math.max(c, h), a.width = p, l.push({
					shape: {
						type: "path",
						path: [{
							command: "M",
							values: [0, .5 * u$3]
						}, {
							command: "L",
							values: [c, .5 * u$3]
						}]
					},
					stroke: a
				});
				break;
			}
			case "path": {
				const t$1 = Math.min(r || S, o), a = Z(e$2, 0), s = Z(e$2, -.2), n = N(e$2, -.4), i = n ? {
					color: n,
					width: 1
				} : {};
				if ("quad" === e$2.profile) {
					const t = e$2.width, n = e$2.height, r = e(t && n ? t / n : 1, 0 === n, 0 === t), o = {
						...i,
						join: "bevel"
					};
					l.push({
						shape: r[0],
						fill: s,
						stroke: o
					}, {
						shape: r[1],
						fill: s,
						stroke: o
					}, {
						shape: r[2],
						fill: a,
						stroke: o
					});
				} else l.push({
					shape: t.pathSymbol3DLayer[0],
					fill: s,
					stroke: i
				}, {
					shape: t.pathSymbol3DLayer[1],
					fill: a,
					stroke: i
				});
				u$3 = Math.max(u$3, t$1), c = u$3;
			}
		}
		a.push(l);
	}), Promise.resolve(l(a, [c, u$3], {
		node: t$3?.node,
		scale: s,
		opacity: t$3?.opacity,
		ariaLabel: t$3?.ariaLabel
	}));
}
async function V(e, t$5) {
	const l$4 = "mesh-3d" === e.type, a = e.symbolLayers, s = G(t$5), r = t$5?.maxSize ? u(t$5.maxSize) : null, o = s || S, i = [];
	let c$2 = 0, u$4 = 0, h = !1;
	for (let n = 0; n < a.length; n++) {
		const e = a.at(n), t$4 = [];
		if (!l$4 || "fill" === e.type) {
			switch (e.type) {
				case "fill": {
					const a = Math.min(o, r || P);
					if (c$2 = Math.max(c$2, a), u$4 = Math.max(u$4, a), h = !0, l$4) {
						const l = t.meshSymbol3DFill, s = N(e, -.4), n = T(e, .05 * a) ?? (s ? {
							join: "round",
							color: s,
							width: 1
						} : null);
						t$4.push({
							shape: l[0],
							fill: Z(e, 0),
							stroke: n
						}, {
							shape: l[1],
							fill: Z(e, -.2),
							stroke: n
						}, {
							shape: l[2],
							fill: Z(e, -.6),
							stroke: n
						});
					} else {
						let l = Z(e, 0);
						const a = "pattern" in e ? e.pattern : null, s = O(e), n = R(e);
						null != a && "style" === a.type && "solid" !== a.style && n && (l = await H(a, n)), t$4.push({
							shape: t.fill[0],
							fill: l,
							stroke: s
						});
					}
					break;
				}
				case "extrude": {
					const l = Z(e, 0), a = Z(e, -.2), s = Math.min(o, r || P), n = m(s), i = S, p = .7 * S + .5 * s, h = T(e, .1 * Math.min(i, p)) ?? {
						join: "round",
						...F(e, -.4),
						width: 1
					};
					t$4.push({
						shape: n[0],
						fill: a,
						stroke: h
					}, {
						shape: n[1],
						fill: a,
						stroke: h
					}, {
						shape: n[2],
						fill: l,
						stroke: h
					}), c$2 = Math.max(c$2, i), u$4 = Math.max(u$4, p);
					break;
				}
				case "water": {
					const l = R(e), a = q(l), s = q(l, 2), n = q(l, 3), i = c();
					h = !0, t$4.push({
						shape: i[0],
						fill: a
					}, {
						shape: i[1],
						fill: s
					}, {
						shape: i[2],
						fill: n
					});
					const p = Math.min(o, r || P);
					c$2 = Math.max(c$2, p), u$4 = Math.max(u$4, p);
					break;
				}
			}
			i.push(t$4);
		}
	}
	return l(i, [c$2, u$4], {
		node: t$5?.node,
		scale: h,
		opacity: t$5?.opacity,
		ariaLabel: t$5?.ariaLabel
	});
}
function W(e, t) {
	if (0 === e.symbolLayers.length) return Promise.reject(new r("symbolPreview: renderPreviewHTML3D", "No symbolLayers in the symbol."));
	switch (e.type) {
		case "point-3d": return K(e, t);
		case "line-3d": return Q(e, t);
		case "polygon-3d":
		case "mesh-3d": return V(e, t);
	}
	return Promise.reject(new r("symbolPreview: swatchInfo3D", "symbol not supported."));
}
//#endregion
export { previewSymbol3D_exports as n, Z as t };

//# sourceMappingURL=previewSymbol3D-_rhEsBTX.js.map