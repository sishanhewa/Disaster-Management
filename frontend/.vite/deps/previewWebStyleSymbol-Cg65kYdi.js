import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { t as f } from "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { f as u } from "./screenUtils-BR-xd7ya.js";
import { t as e } from "./webStyleAcceptedFormats-rS47CeqR.js";
//#region node_modules/@arcgis/core/symbols/support/previewWebStyleSymbol.js
async function n(e$1, n, s) {
	const r = e$1.thumbnail?.url;
	if (r) {
		const e = o((await f(r, { responseType: "image" })).data, s);
		return s?.node ? (s.node.appendChild(e), s.node) : e;
	}
	const a = await e$1.fetchSymbol({ acceptedFormats: e });
	return a ? n(a, s) : null;
}
function o(t, i) {
	const n = !/\\.svg$/i.test(t.src) && i?.disableUpsampling, o = Math.max(t.width, t.height);
	let s = null != i?.maxSize ? u(i.maxSize) : 120;
	n && (s = Math.min(o, s));
	const r = "number" == typeof i?.size ? i?.size : null, a = Math.min(s, null != r ? u(r) : o);
	if (a !== o) {
		const e = 0 !== t.width && 0 !== t.height ? t.width / t.height : 1;
		e >= 1 ? (t.width = a, t.height = a / e) : (t.width = a * e, t.height = a);
	}
	return t;
}
//#endregion
export { n as previewWebStyleSymbol };

//# sourceMappingURL=previewWebStyleSymbol-Cg65kYdi.js.map