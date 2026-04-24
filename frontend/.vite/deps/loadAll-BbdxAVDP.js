import { t as q } from "./Collection-BAJSKCip.js";
import { t as m } from "./Loadable-CQsALnOO.js";
import { i as h, n as b } from "./asyncUtils-D83Q647Q.js";
//#region node_modules/@arcgis/core/core/loadAll.js
async function l(o, n) {
	return await o.load(), a(o, n);
}
async function a(l, a) {
	const c = [], s = (...o) => {
		for (const n of o) null != n && (Array.isArray(n) ? s(...n) : q.isCollection(n) ? n.forEach((o) => s(o)) : m(n) && c.push(n));
	};
	a(s);
	let f = null;
	if (await h(c, async (o) => {
		const r = await b(i(o) ? o.loadAll() : o.load());
		!1 !== r.ok || f || (f = r);
	}), f) throw f.error;
	return l;
}
function i(o) {
	return "loadAll" in o && "function" == typeof o.loadAll;
}
//#endregion
export { l as n, a as t };

//# sourceMappingURL=loadAll-BbdxAVDP.js.map