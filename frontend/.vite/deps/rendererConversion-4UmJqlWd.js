import { t as r } from "./Error-CzxduO2m.js";
import { T as N } from "./typedArrayUtil-BAuNmygZ.js";
import { a as u$1, i as g } from "./jsonUtils-Ds8phlm4.js";
//#region node_modules/@arcgis/core/renderers/support/rendererConversion.js
function t(r) {
	return null == r || "simple" === r.type || "unique-value" === r.type || "class-breaks" === r.type || "dictionary" === r.type || "heatmap" === r.type;
}
function s(r$1, n) {
	if (null == r$1) return null;
	if (!t(r$1)) return new r("renderer-conversion-3d:unsupported-renderer", `Unsupported renderer of type '${r$1.type}'`, { renderer: r$1 });
	switch (r$1.type) {
		case "simple": return u(r$1, n);
		case "unique-value": return a(r$1, n);
		case "class-breaks": return i(r$1, n);
		case "dictionary":
		case "heatmap": return null;
	}
	return null;
}
function l(r$2, n) {
	if (!n) return null;
	if (Array.isArray(n) || (n = [n]), n.length > 0) {
		const o = n.map((r) => r.details.symbol.type || r.details.symbol.declaredClass).filter((r) => !!r);
		o.sort();
		const t = new Array();
		return o.forEach((r, e) => {
			0 !== e && r === o[e - 1] || t.push(r);
		}), new r("renderer-conversion-3d:unsupported-symbols", `Renderer contains symbols (${t.join(", ")}) which are not supported in 3D`, {
			renderer: r$2,
			symbolErrors: n
		});
	}
	return null;
}
function u(r, e) {
	const t = {
		...g,
		...e,
		cimFallbackEnabled: !0
	};
	return l(r, u$1(r.symbol, t).error);
}
function a(e, t) {
	const s = {
		...g,
		...t,
		cimFallbackEnabled: !0
	}, u = e.uniqueValueInfos?.map((r) => u$1(r.symbol, s).error).filter(N), a = u$1(e.defaultSymbol, s);
	return a.error && u?.unshift(a.error), l(e, u);
}
function i(e, t) {
	const s = {
		...g,
		...t,
		cimFallbackEnabled: !0
	}, u = e.classBreakInfos.map((r) => u$1(r.symbol, s).error).filter(N), a = u$1(e.defaultSymbol, s);
	return a.error && u.unshift(a.error), l(e, u);
}
//#endregion
export { t as n, s as t };

//# sourceMappingURL=rendererConversion-4UmJqlWd.js.map