import { t as z } from "./Extent-CquIzaXp.js";
import { n as f } from "./utils-5irCjX9t.js";
import { t as R } from "./Query-aOayEcb1.js";
import { n as d, s as p, t as O } from "./query-IgT1qZDA.js";
//#region node_modules/@arcgis/core/rest/query/executeForCount.js
function m$1(m, p, i, s) {
	return O(f(m), R.from(p), i, s);
}
//#endregion
//#region node_modules/@arcgis/core/rest/query/executeForExtent.js
async function m(m, e, i) {
	const u = await d(f(m), R.from(e), { ...i }), a = u.extent;
	return !a || isNaN(a.xmin) || isNaN(a.ymin) || isNaN(a.xmax) || isNaN(a.ymax) ? {
		count: u.count,
		extent: null
	} : {
		count: u.count,
		extent: z.fromJSON(a)
	};
}
//#endregion
//#region node_modules/@arcgis/core/rest/query/executeForIds.js
async function i(i, n, u, e) {
	const m = await p(f(i), R.from(n), u, e);
	return m.objectIds ?? s(m.uniqueIds) ?? [];
}
function n(r) {
	return !Array.isArray(r[0]);
}
function s(r) {
	if (r) return n(r) ? r : r.map((r) => JSON.stringify(r));
}
//#endregion
export { m as n, m$1 as r, i as t };

//# sourceMappingURL=executeForIds-CkMccKxc.js.map