import { t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { t as f } from "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import { i as u, n as f$1, r as s } from "./utils-5irCjX9t.js";
//#region node_modules/@arcgis/core/rest/versionManagement/gdbVersion/deleteForwardEdits.js
async function e(e, n, m, a) {
	if (!n) throw new r("post:missing-guid", "guid for version is missing");
	const u$1 = f$1(e), d = m.toJSON(), f$2 = s(u$1.query, {
		query: u({
			...d,
			f: "json"
		}),
		...a,
		method: "post"
	});
	n.startsWith("{") && (n = n.slice(1, -1));
	const { data: c } = await f(`${u$1.path}/versions/${n}/deleteForwardEdits`, f$2);
	return c;
}
//#endregion
export { e as deleteForwardEdits };

//# sourceMappingURL=deleteForwardEdits-ChDD_fUN.js.map