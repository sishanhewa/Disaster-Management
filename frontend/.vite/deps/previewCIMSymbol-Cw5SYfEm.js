import { n as __exportAll } from "./chunk-BoAXSpZd.js";
import { f as u$1, r as e } from "./screenUtils-BR-xd7ya.js";
import { a as E } from "./utils-CwgvNNZ_.js";
import { i as _ } from "./CIMSymbolHelper-BFA0d3St.js";
import { n as v } from "./OverrideHelper-DhbzoJ-m.js";
import { n as y$1 } from "./CIMSymbolRasterizer-BOut_ooA.js";
import { n as l } from "./renderUtils-5lWsid4p.js";
//#region node_modules/@arcgis/core/symbols/support/previewCIMSymbol.js
var previewCIMSymbol_exports = /* @__PURE__ */ __exportAll({
	getCIMSymbolPreviewSize: () => g,
	previewCIMSymbol: () => u
});
var a = new y$1(null), s = e(22), m = e(120), h = e(50), c = 1;
async function y(e, t, i) {
	const o = t?.size;
	let l = null != o && "object" == typeof o && "width" in o ? o.width : o, r = null != o && "object" == typeof o && "height" in o ? o.height : o;
	if (!l || !r) if ("esriGeometryPolygon" === i) l = r = t.maxSize ? Math.min(t.maxSize, s) : s;
	else {
		const o = await g(e, t, i);
		o && (l = o.width, r = o.height), "esriGeometryPolyline" === i && (l = t.maxSize ? Math.min(t.maxSize, h) : h), l = null != l && isFinite(l) ? Math.min(l, m) : s, r = null != r && isFinite(r) ? Math.max(Math.min(r, m), c) : s;
	}
	return "legend" === t.style && "esriGeometryPolyline" === i && (l = h), {
		width: l,
		height: r
	};
}
async function g(e, t = {}, o) {
	const n = t.cimOptions || t;
	o ??= n.geometryType || E(e?.data?.symbol);
	const { feature: s, fieldMap: m, viewParams: h } = n, c = await v.resolveSymbolOverrides(e.data, s, null, m, o, null, h);
	if (!c) return null;
	(e = e.clone()).data = {
		type: "CIMSymbolReference",
		symbol: c
	}, e.data.primitiveOverrides = void 0;
	const y = [];
	return _.fetchResources(c, a.resourceManager, y), _.fetchFonts(c, a.resourceManager, y), y.length > 0 && await Promise.all(y), _.getEnvelope(c, null, a.resourceManager);
}
async function u(i, o = {}) {
	const { node: l$1, opacity: s, symbolConfig: m } = o, h = null != m && "object" == typeof m && "isSquareFill" in m && m.isSquareFill, c = o.cimOptions || o, g = c.geometryType || E(i?.data?.symbol), u = await y(i, o, g), { feature: d, fieldMap: f } = c, p = o?.geometry || h || "esriGeometryPolygon" !== g ? "preview" : "legend";
	let w = u;
	const b = u;
	if (o?.geometry && ("esriGeometryPolygon" === g || "esriGeometryPolyline" === g)) {
		const i = 200;
		if (u$1(u.width) < i || u$1(u.height) < i) {
			const e$1 = u.width > u.height ? e(i) * u.height / u.width : e(i);
			w = {
				width: u.width > u.height ? e(i) : e(i) * u.width / u.height,
				height: e$1
			};
		}
	}
	const M = await a.rasterizeCIMSymbolAsync(i, d, w, p, f, g, null, c.viewParams, c.allowScalingUp, o?.geometry?.toJSON());
	if (!M) return null;
	const { width: S, height: v } = M, j = document.createElement("canvas");
	j.width = S, j.height = v;
	j.getContext("2d").putImageData(M, 0, 0);
	const P = u$1(b.width), x = u$1(b.height), z = new Image(P, x);
	z.src = j.toDataURL(), z.ariaLabel = o.ariaLabel ?? null, z.alt = o.ariaLabel ?? "", null != s && (z.style.opacity = `${s}`);
	let C = z;
	if (o.cssEffectFilter) C = l([[{
		shape: {
			type: "image",
			x: 0,
			y: 0,
			width: P,
			height: x,
			src: z.src
		},
		fill: null,
		stroke: null,
		offset: [0, 0]
	}]], [P, x], o);
	return l$1 && C && l$1.appendChild(C), C;
}
//#endregion
export { previewCIMSymbol_exports as n, g as t };

//# sourceMappingURL=previewCIMSymbol-Cw5SYfEm.js.map