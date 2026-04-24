import { n as __exportAll } from "./chunk-BoAXSpZd.js";
import { _ as s } from "./Error-CzxduO2m.js";
import { Z as X, t as f } from "./request-CuG5cxow.js";
//#region node_modules/@arcgis/core/support/apiKeyUtils.js
var apiKeyUtils_exports = /* @__PURE__ */ __exportAll({
	getApiKey: () => c,
	getSessionToken: () => l,
	hasBasemapStylesApiKey: () => u,
	isApiKeyApplicable: () => m,
	supportsApiKey: () => p
});
var r = /^https?:\/\/(i?basemaps|basemapstyles)-api\.arcgis\.com\//i, n = "https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/sessions/start", a = new Set([
	"elevation3d.arcgis.com",
	"js.arcgis.com",
	"jsdev.arcgis.com",
	"jsqa.arcgis.com",
	"static.arcgis.com"
]), i = /* @__PURE__ */ new Map();
var o = null;
function c(e) {
	if (!p(e)) return null;
	const t = (s) => s instanceof RegExp ? s.test(e) : "string" == typeof s && e.startsWith(s), n = s.apiKeys;
	if (Array.isArray(n.scopes)) {
		for (const s of n.scopes) if (Array.isArray(s.urls)) {
			if (s.urls.some(t)) return s.token;
		} else if (t(s.urls)) return s.token;
	}
	return n.basemapStyles && r.test(e) ? n.basemapStyles : s.apiKey && /^https?:\/\/.+\.arcgis\.com(\/|$)/i.test(e) ? s.apiKey : null;
}
async function l(t) {
	if (!s.sessions?.basemap?.enabled || !r.test(t)) return null;
	const a = c(t);
	if (!a) return null;
	o && await o;
	const { styleFamily: l = "arcgis", autoRefresh: u, duration: m = 43200 } = s.sessions.basemap, p = `${a}:${l}`, y = i.get(p);
	if (y && (!u || y.endTime > Date.now())) return y.sessionToken;
	let f$1;
	o = f(n, {
		cacheBust: !0,
		query: {
			durationSeconds: m,
			styleFamily: l,
			token: a
		}
	});
	try {
		f$1 = (await o).data, f$1.endTime -= 5e3, i.set(p, f$1);
	} finally {
		o = null;
	}
	return f$1.sessionToken;
}
function u() {
	return null != s.apiKey || null != s.apiKeys.basemapStyles;
}
function m(s, e) {
	return e ? p(s) : null != c(s);
}
function p(s) {
	const e = X(s, !0);
	return !!e && !a.has(e) && !s.endsWith("/sharing/rest/generateToken");
}
//#endregion
export { u as a, p as i, c as n, m as r, apiKeyUtils_exports as t };

//# sourceMappingURL=apiKeyUtils-Bv2Uwsd3.js.map