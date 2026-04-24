import { t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./reactiveUtils-DRpp6Nmg.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import { t as g } from "./Color-C99QAF80.js";
import "./Polygon-CCBjbbXT.js";
import { d as t } from "./curveUtils-CfkOAT4m.js";
import "./coordsUtils-DXLB9bAf.js";
import "./aaBoundingRect-CgUWvAgv.js";
import "./common-BxLRDsKd.js";
import "./vec2-BPF6SpMH.js";
import "./curveExtent--ue9-x0m.js";
import "./mat3-CPqND9LM.js";
import "./mat3f64-DZZP34-L.js";
import "./Polyline-Cv0nwof6.js";
import "./Multipoint-B5Liskmz.js";
import { f as u } from "./screenUtils-BR-xd7ya.js";
import "./jsonUtils-D_oLUjKv.js";
import "./textUtils-B4iTDAON.js";
import "./MemCache-DQgW8nin.js";
import "./LRUCache-C0A4Jg0w.js";
import "./defaultCIMValues-DmZscRIy.js";
import "./utils-CwgvNNZ_.js";
import "./vec4-DVix-cmy.js";
import "./vec4f64-SXri5KT8.js";
import "./sanitizerUtils-D4_LRYnp.js";
import "./widget-BsQfm1ik.js";
import "./projector-76ZJJlBX.js";
import "./mat2d-BuUJVbP4.js";
import "./mat2df32-D4Q05fSu.js";
import { a as U$1, l as k$1 } from "./quantizationUtils-C-TMvCYs.js";
import { a as I } from "./colorUtils-RKWmAehh.js";
import "./cimSymbolUtils-Cj8o8DGt.js";
import { i as u$1, n as f, o as y$1, r as g$1 } from "./gfxUtils-CbnVrPVV.js";
import "./densifyCurvedGeometry-LJustJq_.js";
import { t as c } from "./fontUtils-CPPDvNws.js";
import "./densificationConstants-Bt2UDmIu.js";
import { t as n } from "./densifyForPreview-ChNlTKfc.js";
import { n as l } from "./renderUtils-5lWsid4p.js";
import { d as t$1, i as h } from "./previewUtils-BoKcN8F-.js";
//#region node_modules/@arcgis/core/symbols/support/previewSymbol2D.js
var y = "picture-fill", w = "picture-marker", x = "simple-fill", b = "simple-line", v = "simple-marker", M = "text", k = "Aa", z = 22, L = 120, S = 80, j = 50, C = 225, B = document.createElement("canvas");
function P(t$2, e, o) {
	const { extent: i } = t$2;
	if (!i) return "";
	const n$1 = i.width || 1, h = i.height || 1;
	if ("polygon" === t$2.type) {
		const l = t$2.clone();
		t(l) && (l.rings = n(l, e, o, i).rings), U$1({
			originPosition: "upperLeft",
			scale: [n$1 / e, h / o],
			translate: [i.xmin, i.ymax]
		}, l, l);
		let c = "";
		for (let t = 0; t < l.rings.length; t++) {
			const e = l.rings[t];
			for (let t = 0; t < e.length; t++) {
				const o = e[t][0], i = e[t][1], n = 0 === t ? "M" : "l", a = t === e.length - 1 ? " Z" : "";
				c += `${"" !== c ? " " : ""}${n}${o.toString()} ${i.toString()}${a}`;
			}
		}
		return c;
	}
	if ("polyline" === t$2.type) {
		const a = t$2.clone();
		t(a) && (a.paths = n(a, e, o, i).paths), k$1({
			originPosition: "upperLeft",
			scale: [n$1 / e, h / o],
			translate: [i.xmin, i.ymax]
		}, a, a);
		let c = "";
		for (let t = 0; t < a.paths.length; t++) {
			const e = a.paths[t];
			for (let t = 0; t < e.length; t++) {
				const o = e[t][0], i = e[t][1];
				c += `${"" !== c ? " " : ""}${0 === t ? "M" : "l"}${o.toString()} ${i.toString()}`;
			}
		}
		return c;
	}
	return "";
}
function $(t, e) {
	const o = B.getContext("2d"), i = [];
	e && (e.weight && i.push(e.weight), e.size && i.push(e.size + "px"), e.family && i.push(e.family)), o.font = i.join(" ");
	const { width: n, actualBoundingBoxLeft: a, actualBoundingBoxRight: l, actualBoundingBoxAscent: s, actualBoundingBoxDescent: r } = o.measureText(t);
	return {
		width: Math.ceil(Math.max(n, a + l)),
		height: Math.ceil(s + r),
		x: Math.floor(a),
		y: Math.floor((s - r) / 2)
	};
}
function E(t) {
	const e = t?.size;
	return {
		width: null != e && "object" == typeof e && "width" in e ? u(e.width) : null,
		height: null != e && "object" == typeof e && "height" in e ? u(e.height) : null
	};
}
async function U(t, e) {
	const o = e.fill, i = t.color;
	if ("pattern" === o?.type && i && t.type !== y) o.src = await f(o.src, i.toCss(!0)), e.fill = o;
}
async function F(t, e, o, n) {
	if (!("font" in t) || !t.font || "text" !== e.shape.type) return;
	try {
		await c(t.font);
	} catch {}
	const { width: a, height: l } = E(n);
	if (!/[\uE600-\uE6FF]/.test(e.shape.text)) {
		const { width: i, height: s, x: r, y: h } = $(e.shape.text, {
			weight: e.font?.weight,
			size: e.font?.size,
			family: e.font?.family
		});
		o[0] = a ?? i, o[1] = l ?? s, e.shape.x = r, e.shape.y = h;
		let c = "angle" in t ? t.angle : null;
		if (null != n?.rotation && (c = (c ?? 0) + n.rotation), c) {
			const t = c * (Math.PI / 180), e = Math.abs(Math.sin(t)), i = Math.abs(Math.cos(t));
			o[1] = o[0] * e + o[1] * i;
		}
	}
}
function A(t, e, o, i, a) {
	if (null != t.haloColor && null != t.haloSize) {
		a.masking ??= o.map(() => []);
		const l = u(t.haloSize);
		i[0] += l, i[1] += l, o.unshift([{
			...e,
			fill: null,
			stroke: {
				color: t.haloColor,
				width: 2 * l,
				join: "round",
				cap: "round"
			}
		}]), a.masking.unshift([{
			shape: {
				type: "rect",
				x: 0,
				y: 0,
				width: i[0] + 16,
				height: i[1] + 16
			},
			fill: [
				255,
				255,
				255
			],
			stroke: null
		}, {
			...e,
			fill: [
				0,
				0,
				0,
				0
			],
			stroke: null
		}]);
	}
	null == t.backgroundColor && null == t.borderLineColor || (i[0] += 16, i[1] += 16, o.unshift([{
		shape: {
			type: "rect",
			x: 0,
			y: 0,
			width: i[0],
			height: i[1]
		},
		fill: t.backgroundColor,
		stroke: {
			color: t.borderLineColor,
			width: u(t.borderLineSize)
		}
	}]), a.masking?.unshift([]));
}
function Z(t, e) {
	return t > e ? "dark" : "light";
}
function D(t, e) {
	const o = "number" == typeof e?.size ? e?.size : null, i = null != o ? u(o) : null, a = null != e?.maxSize ? u(e.maxSize) : null;
	let l = "angle" in t ? t.angle : null;
	null != e?.rotation && (l = (l ?? 0) + e.rotation);
	const s = u$1(t);
	let r = y$1(t);
	"dark" !== T(t, 245) || e?.ignoreWhiteSymbols || (r = {
		width: .75,
		...r,
		color: "#bdc3c7"
	});
	let p = null;
	const d = {
		shape: null,
		fill: s,
		stroke: r,
		offset: [0, 0]
	};
	r?.width && (r.width = Math.min(r.width, S));
	const f = r?.width || 0;
	let g = null != e?.size && (null == e?.scale || e?.scale), C = 0, B = 0, U = !1;
	switch (t.type) {
		case v: {
			const o = t.style, { width: s, height: r } = E(e);
			let h = s === r && null != s ? s : null != i ? i : Math.min(u(t.size), a || L);
			if (!0 === e?.useMarkerSymbolSize && null !== s && null !== r) {
				const e = Math.min(u(t.size), a || L);
				h = e > s && e > r ? Math.min(s, r) : e;
			}
			switch (C = h, B = h, o) {
				case "circle":
					d.shape = {
						type: "circle",
						cx: 0,
						cy: 0,
						r: .5 * h
					}, g || (C += f, B += f);
					break;
				case "cross":
					d.shape = {
						type: "path",
						path: [
							{
								command: "M",
								values: [0, .5 * B]
							},
							{
								command: "L",
								values: [C, .5 * B]
							},
							{
								command: "M",
								values: [.5 * C, 0]
							},
							{
								command: "L",
								values: [.5 * C, B]
							}
						]
					};
					break;
				case "diamond":
					d.shape = {
						type: "path",
						path: [
							{
								command: "M",
								values: [0, .5 * B]
							},
							{
								command: "L",
								values: [.5 * C, 0]
							},
							{
								command: "L",
								values: [C, .5 * B]
							},
							{
								command: "L",
								values: [.5 * C, B]
							},
							{
								command: "Z",
								values: []
							}
						]
					}, g || (C += f, B += f);
					break;
				case "square":
					d.shape = {
						type: "path",
						path: [
							{
								command: "M",
								values: [0, 0]
							},
							{
								command: "L",
								values: [C, 0]
							},
							{
								command: "L",
								values: [C, B]
							},
							{
								command: "L",
								values: [0, B]
							},
							{
								command: "Z",
								values: []
							}
						]
					}, g || (C += f, B += f), l && (U = !0);
					break;
				case "triangle":
					d.shape = {
						type: "path",
						path: [
							{
								command: "M",
								values: [.5 * C, 0]
							},
							{
								command: "L",
								values: [C, B]
							},
							{
								command: "L",
								values: [0, B]
							},
							{
								command: "Z",
								values: []
							}
						]
					}, g || (C += f, B += f), l && (U = !0);
					break;
				case "x":
					d.shape = {
						type: "path",
						path: [
							{
								command: "M",
								values: [0, 0]
							},
							{
								command: "L",
								values: [C, B]
							},
							{
								command: "M",
								values: [C, 0]
							},
							{
								command: "L",
								values: [0, B]
							}
						]
					}, l && (U = !0);
					break;
				case "path": d.shape = {
					type: "path",
					path: t.path || ""
				}, g || (C += f, B += f), l && (U = !0), g = !0;
			}
			break;
		}
		case b: {
			const { width: t, height: o } = E(e), n = g$1(r).reduce((t, e) => t + e, 0), a = n && Math.ceil(j / n), l = o ?? i ?? f, s = t ?? (n * a || j);
			if (g = !0, "polyline" === e?.geometry?.type && e?.geometry?.extent) {
				C = s, B = o ?? C;
				const t = 1e3, i = .15 * t;
				p = [C, B], B = p[0] > p[1] ? t * p[1] / p[0] : t, C = p[0] > p[1] ? t : t * p[0] / p[1], r?.width && (r.width = r.width * t / (p[1] > p[0] ? p[1] : p[0]), r.width > i && (r.width = i)), d.shape = {
					type: "path",
					path: P(e.geometry, C, B)
				};
			} else C = null != e?.maxSize ? Math.min(s, e.maxSize) : s, B = l, r && (r.width = l), d.shape = {
				type: "path",
				path: [{
					command: "M",
					values: [l / 2, B / 2]
				}, {
					command: "L",
					values: [C - l / 2, B / 2]
				}]
			};
			break;
		}
		case y:
		case x: {
			const t = "object" == typeof e?.symbolConfig && !!e?.symbolConfig?.isSquareFill, { width: o, height: n } = E(e);
			C = !t && o !== n || null == o ? null != i ? i : z : o, B = !t && o !== n || null == n ? C : n, g || (C += f, B += f), g = !0, e?.geometry?.extent && "polygon" === e?.geometry?.type ? (p = [C, B], B = p[0] > p[1] ? 1e3 * p[1] / p[0] : 1e3, C = p[0] > p[1] ? 1e3 : 1e3 * p[0] / p[1], d.shape = {
				type: "path",
				path: P(e.geometry, C, B)
			}) : d.shape = t ? {
				type: "path",
				path: [
					{
						command: "M",
						values: [0, 0]
					},
					{
						command: "L",
						values: [C, 0]
					},
					{
						command: "L",
						values: [C, B]
					},
					{
						command: "L",
						values: [0, B]
					},
					{
						command: "L",
						values: [0, 0]
					},
					{
						command: "Z",
						values: []
					}
				]
			} : t$1.fill[0];
			break;
		}
		case w: {
			const o = Math.min(u(t.width), a || L), s = Math.min(u(t.height), a || L), { width: r, height: h } = E(e), c = r === h && null != r ? r : null != i ? i : Math.max(o, s), m = t.width / t.height;
			C = m <= 1 ? Math.ceil(c * m) : c, B = m <= 1 ? c : Math.ceil(c / m), d.shape = {
				type: "image",
				x: -Math.round(C / 2),
				y: -Math.round(B / 2),
				width: C,
				height: B,
				src: t.url || ""
			}, l && (U = !0);
			break;
		}
		case M: {
			const o = t, l = e?.overrideText || o.text || k, s = o.font, { width: r, height: h } = E(e), c = null != h ? h : null != i ? i : Math.min(u(s.size), a || L), { width: m, height: p } = $(l, {
				weight: s.weight,
				size: c,
				family: s.family
			}), u$2 = /[\uE600-\uE6FF]/.test(l);
			C = r ?? (u$2 ? c : m), B = u$2 ? c : p;
			let f = .5 * (u$2 ? c : p);
			u$2 && (f += 5), d.shape = {
				type: "text",
				text: l,
				x: o.xoffset || 0,
				y: o.yoffset || f,
				align: "middle",
				alignBaseline: o.verticalAlignment,
				decoration: s && s.decoration,
				rotated: o.rotated,
				kerning: o.kerning
			}, d.font = s && {
				size: c,
				style: s.style,
				decoration: s.decoration,
				weight: s.weight,
				family: s.family
			};
			break;
		}
	}
	return {
		shapeDescriptor: d,
		size: [C, B],
		outputSize: p,
		renderOptions: {
			node: e?.node,
			scale: g,
			opacity: e?.opacity,
			rotations: [l],
			useRotationSize: U,
			cssEffectFilter: e?.cssEffectFilter,
			ariaLabel: e?.ariaLabel,
			clipBloomEffect: e?.clipBloomEffect
		}
	};
}
async function q(t, e) {
	const { shapeDescriptor: i, size: n, renderOptions: a, outputSize: l$1 } = D(t, e);
	if (!i.shape) throw new r("symbolPreview: renderPreviewHTML2D", "symbol not supported.");
	await U(t, i), await F(t, i, n, e);
	const s = [[i]];
	if ("object" == typeof e?.symbolConfig && e?.symbolConfig?.applyColorModulation) {
		const t = .6 * n[0];
		s.unshift([{
			...i,
			offset: [-t, 0],
			fill: h(i.fill, -.3)
		}]), s.push([{
			...i,
			offset: [t, 0],
			fill: h(i.fill, .3)
		}]), n[0] += 2 * t, a.scale = !1;
	}
	"text" === t.type && A(t, i, s, n, a);
	const r$1 = l(s, n, a);
	if (l$1 && r$1) {
		const t = "img" === r$1.nodeName.toLowerCase() ? r$1 : r$1.firstChild;
		"svg" === t.nodeName.toLowerCase() && t.setAttribute("viewBox", `0 0 ${n[0].toString()} ${n[1].toString()}`), t.setAttribute("width", l$1[0].toString()), t.setAttribute("height", l$1[1].toString()), l$1.length > 2 && (t.style.setProperty("padding-left", l$1[2]?.toString() + "px"), t.style.setProperty("padding-right", l$1[2]?.toString() + "px"), t.style.setProperty("padding-top", l$1[3]?.toString() + "px"), t.style.setProperty("padding-bottom", l$1[3]?.toString() + "px"), t.style.setProperty("box-sizing", "border-box"));
	}
	return r$1;
}
function T(o, i = C) {
	const n = u$1(o), a = y$1(o), l = !n || "type" in n ? null : new g(n), s = a?.color ? new g(a?.color) : null, r = l ? Z(I(l), i) : null, m = s ? Z(I(s), i) : null;
	return m ? r ? r === m ? r : i >= C ? "light" : "dark" : m : r;
}
//#endregion
export { q as previewSymbol2D };

//# sourceMappingURL=previewSymbol2D-Cuh299Vw.js.map