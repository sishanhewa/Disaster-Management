import { f as u$2, l as o } from "./screenUtils-BR-xd7ya.js";
import { G as e } from "./fieldUtils-CC2YSmV6.js";
import { o as S$1 } from "./typeUtils-DZkmoi8p.js";
import { c as x$1, l as y, o as p$1 } from "./widget-BsQfm1ik.js";
import { i as u$3, o as y$1 } from "./gfxUtils-CbnVrPVV.js";
import { i as N, n as L$1, r as M } from "./utils-C2bZ_DGG.js";
import { a as C, c as R$1, i as A, l as S$2, n as l$1, o as L$2, r as $, s as N$1 } from "./renderUtils-5lWsid4p.js";
import { t as Z } from "./previewSymbol3D-_rhEsBTX.js";
//#region node_modules/@arcgis/core/widgets/Legend/styles/support/relationshipUtils.js
var b$1 = "esri-relationship-ramp", m = `${b$1}--diamond`, u$1 = `${b$1}--square`, c = "http://www.w3.org/2000/svg", f = {
	diamondContainer: `${m}__container`,
	diamondLeftCol: `${m}__left-column`,
	diamondRightCol: `${m}__right-column`,
	diamondMidCol: `${m}__middle-column`,
	diamondMidColLabel: `${m}__middle-column--label`,
	diamondMidColRamp: `${m}__middle-column--ramp`,
	squareTable: `${u$1}__table`,
	squareTableRow: `${u$1}__table-row`,
	squareTableCell: `${u$1}__table-cell`,
	squareTableLabel: `${u$1}__table-label`,
	squareTableLabelLeftBottom: `${u$1}__table-label--left-bottom`,
	squareTableLabelRightBottom: `${u$1}__table-label--right-bottom`,
	squareTableLabelLeftTop: `${u$1}__table-label--left-top`,
	squareTableLabelRightTop: `${u$1}__table-label--right-top`
};
function k$1(e, a, l = {}) {
	const { focus: r, labels: t } = e, s = !!r, o = p(e, a, l), b = { justifyContent: "center" }, m = y(), u = l.key ?? a;
	return s ? x$1("div", {
		class: f.diamondContainer,
		key: `${u}-container`,
		styles: b
	}, x$1("div", { class: f.diamondLeftCol }, m ? t.right : t.left), x$1("div", { class: f.diamondMidCol }, x$1("div", { class: f.diamondMidColLabel }, t.top), o, x$1("div", { class: f.diamondMidColLabel }, t.bottom)), x$1("div", { class: f.diamondRightCol }, m ? t.left : t.right)) : x$1("div", {
		class: f.squareTable,
		key: `${u}-container`
	}, x$1("div", { class: f.squareTableRow }, x$1("div", { class: p$1(f.squareTableCell, f.squareTableLabel, f.squareTableLabelRightBottom) }, m ? t.top : t.left), x$1("div", { class: f.squareTableCell }), x$1("div", { class: p$1(f.squareTableCell, f.squareTableLabel, f.squareTableLabelLeftBottom) }, m ? t.left : t.top)), x$1("div", { class: f.squareTableRow }, x$1("div", { class: f.squareTableCell }), o, x$1("div", { class: f.squareTableCell })), x$1("div", { class: f.squareTableRow }, x$1("div", { class: p$1(f.squareTableCell, f.squareTableLabel, f.squareTableLabelRightTop) }, m ? t.right : t.bottom), x$1("div", { class: f.squareTableCell }), x$1("div", { class: p$1(f.squareTableCell, f.squareTableLabel, f.squareTableLabelLeftTop) }, m ? t.bottom : t.right)));
}
function h(e, a, l) {
	const r = `${l}_arrowStart`, t = `${l}_arrowEnd`, s = "left" === e, o = {
		markerStart: null,
		markerEnd: null
	};
	switch (a) {
		case "HL":
			s ? o.markerStart = `url(#${t})` : o.markerEnd = `url(#${r})`;
			break;
		case "LL":
			o.markerStart = `url(#${t})`;
			break;
		case "LH":
			s ? o.markerEnd = `url(#${r})` : o.markerStart = `url(#${t})`;
			break;
		default: o.markerEnd = `url(#${r})`;
	}
	return o;
}
function p(i, d, b = {}) {
	const { focus: m, numClasses: u, colors: k, rotation: p } = i, { opacity: T, cssEffectFilter: _, ariaLabel: q } = b, $$1 = b.size ?? 60, g = !!m, L = Math.sqrt($$1 ** 2 + $$1 ** 2) + (g ? 0 : 5), C$1 = [], v = [], w = [], y = ($$1 || 75) / u;
	for (let t = 0; t < u; t++) {
		const s = t * y;
		for (let i = 0; i < u; i++) {
			const n = i * y, d = $(k[t][i]), b = A(null), m = {
				type: "rect",
				x: n,
				y: s,
				width: y,
				height: y
			}, u = N$1(d);
			u && C$1.push(u);
			const c = S$2(m, d.fill, b, null);
			c && v.push(c), w.push(L$2(m));
		}
	}
	const R = 15, x = 15, E = 10;
	let M = null;
	g || (M = "margin: -15px -15px -18px -15px");
	const S = h("left", m, d), B = h("right", m, d), H = R$1(w), W = C(H, L, L, 0, !1, p, !1), j = C(H, L, L, 0, !1, g ? -45 : null, !1), U = {
		filter: _ ?? void 0,
		opacity: null == T ? "" : `${T}`
	};
	return x$1("div", {
		class: g ? f.diamondMidColRamp : f.squareTableCell,
		styles: U
	}, x$1("svg", {
		"aria-label": q,
		focusable: !1,
		height: L,
		role: "image",
		style: M,
		width: L,
		xmlns: c
	}, x$1("defs", null, x$1("marker", {
		id: `${d}_arrowStart`,
		markerHeight: "10",
		markerUnits: "strokeWidth",
		markerWidth: "10",
		orient: "auto",
		refX: "5",
		refY: "5"
	}, x$1("polyline", {
		fill: "none",
		points: "0,0 5,5 0,10",
		stroke: "#555555",
		"stroke-width": "1"
	})), x$1("marker", {
		id: `${d}_arrowEnd`,
		markerHeight: "10",
		markerUnits: "strokeWidth",
		markerWidth: "10",
		orient: "auto",
		refX: "0",
		refY: "5"
	}, x$1("polyline", {
		fill: "none",
		points: "5,0 0,5 5,10",
		stroke: "#555555",
		"stroke-width": "1"
	})), C$1), x$1("g", { transform: W }, v), x$1("g", { transform: j }, x$1("line", {
		fill: "none",
		"marker-end": S.markerEnd,
		"marker-start": S.markerStart,
		stroke: "#555555",
		"stroke-width": "1",
		x1: -10,
		x2: -10,
		y1: $$1 - R,
		y2: R
	}), x$1("line", {
		fill: "none",
		"marker-end": B.markerEnd,
		"marker-start": B.markerStart,
		stroke: "#555555",
		"stroke-width": "1",
		x1: x,
		x2: $$1 - x,
		y1: $$1 + E,
		y2: $$1 + E
	}))));
}
//#endregion
//#region node_modules/@arcgis/core/widgets/Legend/support/relationshipRampUtils.js
var s = {
	HH: 315,
	HL: 45,
	LL: 135,
	LH: 225
}, l = {
	2: [["HL", "HH"], ["LL", "LH"]],
	3: [
		[
			"HL",
			"HM",
			"HH"
		],
		[
			"ML",
			"MM",
			"MH"
		],
		[
			"LL",
			"LM",
			"LH"
		]
	],
	4: [
		[
			"HL",
			"HM1",
			"HM2",
			"HH"
		],
		[
			"M2L",
			"M2M1",
			"M2M2",
			"M2H"
		],
		[
			"M1L",
			"M1M1",
			"M1M2",
			"M1H"
		],
		[
			"LL",
			"LM1",
			"LM2",
			"LH"
		]
	]
};
function n(t) {
	if (!t) return;
	const { type: s } = t;
	if (s.includes("3d")) return Z(t.symbolLayers.at(0));
	if ("simple-line" === s) {
		const e = y$1(t);
		return e && e.color;
	}
	if ("simple-marker" === t.type && ("x" === t.style || "cross" === t.style)) {
		const e = y$1(t);
		return e && e.color;
	}
	return u$3(t);
}
function H(t, o) {
	const e = o.HH.label, r = o.LL.label, s = o.HL.label, l = o.LH.label;
	switch (t) {
		case "HH":
		default: return {
			top: e,
			bottom: r,
			left: s,
			right: l
		};
		case "HL": return {
			top: s,
			bottom: l,
			left: r,
			right: e
		};
		case "LL": return {
			top: r,
			bottom: e,
			left: l,
			right: s
		};
		case "LH": return {
			top: l,
			bottom: s,
			left: e,
			right: r
		};
	}
}
function i(t) {
	const { focus: o, infos: e, numClasses: r } = t, s = l[r], L = {};
	e.forEach((t) => {
		L[t.value] = {
			label: t.label,
			fill: n(t.symbol)
		};
	});
	const i = [];
	for (let l = 0; l < r; l++) {
		const t = [];
		for (let o = 0; o < r; o++) {
			const e = L[s[l][o]];
			t.push(e.fill);
		}
		i.push(t);
	}
	return {
		type: "relationship-ramp",
		numClasses: r,
		focus: o,
		colors: i,
		labels: H(o, L),
		rotation: u(o)
	};
}
function u(t) {
	let o = s[t];
	return t && null == o && (o = s.HH), o || 0;
}
//#endregion
//#region node_modules/@arcgis/core/symbols/support/symbolUtils.js
var d = null;
var b = [
	255,
	255,
	255
];
function g(e, t) {
	return Math.floor(Math.random() * (t - e + 1) + e);
}
function w(e, t, l) {
	const { backgroundColor: a, outline: i, dotSize: r } = e, s = l?.swatchSize || 22, n = Math.round(s * s / Math.max(r, .5) ** 2 * .8), c = window.devicePixelRatio, u = document.createElement("canvas"), p = s * c;
	u.width = p, u.height = p, u.style.width = u.width / c + "px", u.style.height = u.height / c + "px";
	const f = u.getContext("2d");
	if (a && (f.fillStyle = a.toCss(!0), f.fillRect(0, 0, p, p), f.fill()), f.fillStyle = t?.toCss(!0) ?? "", d && d.length / 2 === n) for (let h = 0; h < 2 * n; h += 2) {
		const e = d[h], t = d[h + 1];
		f.fillRect(e, t, r * c, r * c), f.fill();
	}
	else {
		d = [];
		for (let e = 0; e < 2 * n; e += 2) {
			const e = g(0, p), t = g(0, p);
			d.push(e, t), f.fillRect(e, t, r * c, r * c), f.fill();
		}
	}
	i && (i.color && (f.strokeStyle = i.color.toCss(!0)), f.lineWidth = i.width, f.strokeRect(0, 0, p, p));
	const y = new Image(s, s);
	return y.src = u.toDataURL(), y.ariaLabel = l?.ariaLabel ?? null, y.alt = l?.ariaLabel ?? "", y;
}
function S(e, t = {}) {
	const l = t.radius || 40, a = 2 * Math.PI * l, i = e.length, o = a / i, n = [], c = y$1(t.outline);
	null != c?.width && (c.width *= 2), (c || t.backgroundColor) && n.push({
		shape: {
			type: "circle",
			cx: l,
			cy: l,
			r: l
		},
		fill: t.backgroundColor,
		stroke: c,
		offset: [0, 0]
	});
	const u = t.values, p = u?.length === i && 100 === u.reduce((e, t) => e + t, 0), f = [0];
	for (let r = 0; r < i; r++) {
		let t = null;
		p && (t = u[r] * a / 100, f.push(t + f[r])), n.push({
			shape: {
				type: "circle",
				cx: l,
				cy: l,
				r: l / 2
			},
			fill: [
				0,
				0,
				0,
				0
			],
			stroke: {
				width: l,
				dashArray: `${(t ?? o) / 2} ${a}`,
				dashoffset: "-" + (p ? f[r] / 2 : r * (o / 2)),
				color: e[r]
			},
			offset: [0, 0]
		});
	}
	let y = null;
	const h = 2 * l + (c?.width || 0), m = t.holePercentage;
	if (m) {
		c && n.push({
			shape: {
				type: "circle",
				cx: l,
				cy: l,
				r: l * m
			},
			fill: null,
			stroke: c,
			offset: [0, 0]
		});
		const e = h / 2;
		y = [[{
			shape: {
				type: "circle",
				cx: e,
				cy: e,
				r: e
			},
			fill: b,
			stroke: c ? {
				...c,
				color: b
			} : null,
			offset: [0, 0]
		}, {
			shape: {
				type: "circle",
				cx: e,
				cy: e,
				r: l * m
			},
			fill: [
				0,
				0,
				0
			],
			stroke: null,
			offset: [0, 0]
		}]];
	}
	return l$1([n], [h, h], {
		cssEffectFilter: t.cssEffectFilter,
		ignoreStrokeWidth: !0,
		masking: y,
		rotations: [-90],
		ariaLabel: t.ariaLabel
	});
}
function V(e, t = {}) {
	const l = 24, a = 75, i = "horizontal" === t.align, r = i ? a : l, s = i ? l : a, o = t.width ?? r, n = t.height ?? s, c = t.gradient ?? !0, u = window.devicePixelRatio, p = o * u, f = n * u, y = document.createElement("canvas");
	y.width = p, y.height = f, y.ariaLabel = t.ariaLabel ?? null, y.style.width = `${o}px`, y.style.height = `${n}px`;
	const h = y.getContext("2d"), m = i ? p : 0, d = i ? 0 : f;
	if (c) {
		const t = h.createLinearGradient(0, 0, m, d), l = e.length, a = 1 === l ? 0 : 1 / (l - 1);
		e.forEach((e, l) => t.addColorStop(l * a, e.toString())), h.fillStyle = t, h.fillRect(0, 0, p, f);
	} else {
		const t = i ? p / e.length : p, l = i ? f : f / e.length;
		let a = 0, r = 0;
		for (const s of e) h.fillStyle = s.toString(), h.fillRect(a, r, t, l), a = i ? a + t : 0, r = i ? 0 : r + l;
	}
	const b = document.createElement("div");
	return b.style.width = `${o}px`, b.style.height = `${n}px`, x(b, t?.cssEffectFilter), b.appendChild(y), b;
}
function k(e) {
	const t = e.match(/drop-shadow\(\s*([^\s]+)\s+[^\s]+\s+[^\s]+\s+.+?\)/);
	return t ? t[1] : null;
}
function x(l, a) {
	if (!a) return;
	l.style.filter = a;
	const i = k(a);
	if (i) {
		const a = u$2(o(i));
		a < 0 ? l.style.marginLeft = `${Math.abs(a)}px` : l.style.marginRight = `${a}px`;
	}
}
async function F(e, t) {
	switch (e.type) {
		case "web-style": {
			const { previewWebStyleSymbol: l } = await import("./previewWebStyleSymbol-Cg65kYdi.js");
			return l(e, F, t);
		}
		case "label-3d":
		case "line-3d":
		case "mesh-3d":
		case "point-3d":
		case "polygon-3d": {
			const { previewSymbol3D: l } = await import("./previewSymbol3D-_rhEsBTX.js").then((n) => n.n);
			return l(e, t);
		}
		case "simple-marker":
		case "simple-line":
		case "simple-fill":
		case "picture-marker":
		case "picture-fill":
		case "text": {
			const { previewSymbol2D: l } = await import("./previewSymbol2D-Cuh299Vw.js");
			return l(e, t);
		}
		case "cim": {
			const { previewCIMSymbol: l } = await import("./previewCIMSymbol-Cw5SYfEm.js").then((n) => n.n);
			return l(e, t);
		}
		default: return;
	}
}
function L(e) {
	return e && void 0 !== e.opacity ? e.opacity * ("parent" in e ? L(e.parent) : 1) : 1;
}
async function R(e$2, t) {
	if (!e$2) return;
	const l = e$2.sourceLayer, a = (null != t && t.useSourceLayer ? l : e$2.layer) ?? l, r = t?.ignoreOpacity ? 1 : L(a);
	if (null != e$2.symbol && (null == t || !0 !== t.ignoreGraphicSymbol)) {
		const l = "web-style" === e$2.symbol.type ? await e$2.symbol.fetchSymbol({
			...t,
			acceptedFormats: t?.webStyleAcceptedFormats,
			cache: t?.webStyleCache
		}) : e$2.symbol.clone();
		return L$1(l, null, { add: r }), l;
	}
	const s = t?.renderer ?? I(a);
	let o = s && "getSymbolAsync" in s ? await s.getSymbolAsync(e$2, t) : null;
	if (!o) return;
	if (o = "web-style" === o.type ? await o.fetchSymbol({
		...t,
		acceptedFormats: t?.webStyleAcceptedFormats,
		cache: t?.webStyleCache
	}) : o.clone(), !(s && "visualVariables" in s && s.visualVariables?.length && j(o))) return L$1(o, null, { add: r }), o;
	if ("arcadeRequiredForVisualVariables" in s && s.arcadeRequiredForVisualVariables && null == t?.arcade) {
		const e$1 = { ...t };
		e$1.arcade = await e(), t = e$1;
	}
	const { getColor: n, getOpacity: f, getAllSizes: y, getRotationAngle: h } = await import("./visualVariableUtils-Cml1ksAq.js").then((n) => n.i), m = [], d = [], b = [], g = [];
	for (const i of s.visualVariables) switch (i.type) {
		case "color":
			m.push(i);
			break;
		case "opacity":
			d.push(i);
			break;
		case "rotation":
			g.push(i);
			break;
		case "size": i.target || b.push(i);
	}
	const w = !!m.length && m[m.length - 1], S = w ? n(w, e$2, t) : null, v = !!t?.ignoreOpacity, V = !!d.length && d[d.length - 1], k = V ? f(V, e$2, t) : null;
	if (L$1(o, S, v ? void 0 : {
		override: k,
		add: r
	}), b.length && !0 !== t?.ignoreSizeVariables) {
		const l = y(b, e$2, t);
		await M(o, l);
	}
	if (!0 !== t?.ignoreRotationVariables) for (const i of g) N(o, h(i, e$2, t), i.axis);
	return o;
}
function j(e) {
	return !S$1(e) || "water" !== e.symbolLayers.at(0)?.type;
}
function I(e) {
	if (e) return "renderer" in e ? e.renderer : void 0;
}
//#endregion
export { w as a, k$1 as c, V as i, R as n, i as o, S as r, u as s, F as t };

//# sourceMappingURL=symbolUtils-Dvf-MlT2.js.map