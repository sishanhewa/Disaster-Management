import { _ as s$1, w as a$1 } from "./Error-CzxduO2m.js";
import { D as s$2, V as I } from "./request-CuG5cxow.js";
import { i as p, n as c$1 } from "./apiKeyUtils-Bv2Uwsd3.js";
//#region node_modules/@arcgis/core/rest/utils.js
function s(t, n) {
	return n ? {
		...n,
		query: {
			...t,
			...n.query
		}
	} : { query: t };
}
function f(t) {
	return "string" == typeof t ? I(t) : a$1(t);
}
function u(t, n, r) {
	const e = {};
	for (const i in t) {
		if ("declaredClass" === i) continue;
		const o = t[i];
		if (null != o && "function" != typeof o) if (Array.isArray(o)) e[i] = o.map((t) => u(t));
		else if ("object" == typeof o) if (o.toJSON) {
			const t = o.toJSON(r?.[i]);
			e[i] = n ? t : JSON.stringify(t);
		} else e[i] = n ? o : JSON.stringify(o);
		else e[i] = o;
	}
	return e;
}
function c(t, r) {
	return t ? r && p(t) ? r : c$1(t) ?? s$2?.findCredential(t)?.token : null;
}
async function a(r, e, i) {
	const o = c(r, e);
	if (o) return o;
	!s$2 && s$1.request.useIdentity && await import("./IdentityManager-4SP7D8dY.js");
	return (await s$2.getCredential(r, i))?.token;
}
//#endregion
export { u as i, f as n, s as r, a as t };

//# sourceMappingURL=utils-5irCjX9t.js.map