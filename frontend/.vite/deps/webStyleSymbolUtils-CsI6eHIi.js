import { n as __exportAll } from "./chunk-BoAXSpZd.js";
import { t as r } from "./Error-CzxduO2m.js";
import { G as Rt, V as I, b as p } from "./request-CuG5cxow.js";
import { t as M } from "./Portal-DYysvbhZ.js";
import { E as p$2, T as p$1, o as S } from "./typeUtils-DZkmoi8p.js";
import { t as a } from "./jsonUtils-Ds8phlm4.js";
import { a as y, i as p$3, n as i, r as m, t as h$1 } from "./styleUtils-DIEtWrns.js";
import { n as c, t as a$1 } from "./devEnvironmentUtils-CxOeS9KJ.js";
import { t as e } from "./webStyleAcceptedFormats-rS47CeqR.js";
//#region node_modules/@arcgis/core/symbols/support/webStyleSymbolUtils.js
var webStyleSymbolUtils_exports = /* @__PURE__ */ __exportAll({
	fetchSymbolFromStyle: () => j,
	getStyleItemFromStyle: () => g,
	resolveWebStyleSymbol: () => h
});
function h(t, e, o) {
	const l = t.name;
	return null == l ? Promise.reject(new r("symbolstyleutils:style-symbol-reference-name-missing", "Missing name in style symbol reference")) : "Esri2DPointSymbolsStyle" === t.styleName ? U(l, e, o) : i(t, e, o).then((t) => j(t, l, e, y, o));
}
function g(t, e) {
	return e.items.find((e) => e.name === t);
}
async function j(i, u, f, h, j) {
	const U = null != f?.portal ? f.portal : M.getDefault(), w = {
		portal: U,
		url: I(i.baseUrl)
	}, N = g(u, i.data);
	if (!N) throw new r("symbolstyleutils:symbol-name-not-found", `The symbol name '${u}' could not be found`, { symbolName: u });
	const S$1 = j?.acceptedFormats ?? e, D = h(N, S$1);
	if (!D) throw new r("symbolstyleutils:symbol-reference-no-accepted-format", `The symbol name '${u}' does not have an accepted format (one of ${S$1})`, { symbolName: u });
	const { url: $, format: v } = D;
	let E = p($, w), O = N.thumbnail?.href ?? null;
	const P = N.thumbnail?.imageData;
	c() && (E = a$1(E) ?? "", O = a$1(O));
	const T = {
		portal: U,
		url: I(Rt(E)),
		origin: "portal-item"
	};
	return p$3(E, j).then((t) => {
		const r = a("cim" === v ? m(t.data) : t.data, T);
		if (r && S(r)) {
			if (O) r.thumbnail = new p$1({ url: p(O, w) });
			else P && (r.thumbnail = new p$1({ url: `data:image/png;base64,${P}` }));
			i.styleUrl ? r.styleOrigin = new p$2({
				portal: f.portal,
				styleUrl: i.styleUrl,
				name: u
			}) : i.styleName && (r.styleOrigin = new p$2({
				portal: f.portal,
				styleName: i.styleName,
				name: u
			}));
		}
		return r;
	});
}
function U(t, e, r) {
	const s = h$1.replaceAll(/\{SymbolName\}/gi, t), a$2 = null != e.portal ? e.portal : M.getDefault();
	return p$3(s, r).then((t) => {
		return a(m(t.data), {
			portal: a$2,
			url: I(Rt(s)),
			origin: "portal-item"
		});
	});
}
//#endregion
export { webStyleSymbolUtils_exports as i, h as n, j as r, g as t };

//# sourceMappingURL=webStyleSymbolUtils-CsI6eHIi.js.map