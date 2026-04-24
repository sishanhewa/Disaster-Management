import { n as f } from "./utils-5irCjX9t.js";
import { t as g } from "./FeatureSet-Sjrap7hf.js";
import { t as R } from "./Query-aOayEcb1.js";
import { a as l } from "./query-IgT1qZDA.js";
//#region node_modules/@arcgis/core/rest/query/executeQueryJSON.js
async function s(r, o, e, s) {
	const p = await n(r, o, e, s);
	return g.fromJSON(p);
}
function n(t, s, n, p) {
	const u = f(t), i = { ...n }, m = R.from(s);
	return l(u, m, m.sourceSpatialReference, i, p);
}
//#endregion
export { s as n, n as t };

//# sourceMappingURL=executeQueryJSON-D-PTxyOy.js.map