import { t as r } from "./Error-CzxduO2m.js";
import { h as p, m as n$1 } from "./decorators-DE7S5xmd.js";
import { k as z } from "./layerUtils-sQ-3wxAB.js";
//#region node_modules/@arcgis/core/webdoc/support/saveUtils.js
async function s(e) {
	const r = [];
	for (const o of e.allLayers) if ("beforeSave" in o && "function" == typeof o.beforeSave) {
		const e = o.beforeSave();
		e && r.push(e);
	}
	await Promise.allSettled(r);
}
function n(r$2, s, n) {
	let i = (r$2.messages ?? []).filter(({ type: e }) => "error" === e).map(({ name: r$1, message: o, details: t }) => new r(r$1, o, t));
	if (r$2.blockedRelativeUrls && (i = i.concat(r$2.blockedRelativeUrls.map((e) => p("url", `Relative url '${e}' is not supported`)))), n) {
		const { ignoreUnsupported: e, supplementalUnsupportedErrors: r = [], requiredPropertyChecksDisabled: o } = n;
		e && (i = i.filter(({ name: e }) => !(n$1.has(e) || r.includes(e)))), o && (i = i.filter((e) => "web-document-write:property-required" !== e.name));
	}
	if (i.length > 0) throw new r(s.errorName, "Failed to save due to unsupported or invalid content. See 'details.errors' for more detailed information", { errors: i });
}
function i(e) {
	return z(e).some((e) => !!e.charts?.length);
}
//#endregion
export { n, s as r, i as t };

//# sourceMappingURL=saveUtils-C8XCaiJv.js.map