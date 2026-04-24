import { n } from "./Error-CzxduO2m.js";
import { N as w } from "./decorators-DE7S5xmd.js";
import { a as u } from "./apiKeyUtils-Bv2Uwsd3.js";
import { t as a } from "./basemapDefinitions-CGK-Ctsz.js";
import { n as F } from "./Basemap-u-nyEwoW.js";
//#region node_modules/@arcgis/core/support/basemapEnsureType.js
var c = () => n.getLogger("esri.support.basemapUtils");
function f() {
	return {};
}
function l(e) {
	for (const r in e) {
		const s = e[r];
		s && !s.destroyed && s.destroy(), delete e[r];
	}
}
function p(r, s) {
	let i;
	if ("string" == typeof r) {
		const o = r in a, a$1 = !o && r.includes("/");
		if (!o && !a$1) {
			if (u()) c().warn(`Unable to find basemap definition for: ${r}. See available styles at https://developers.arcgis.com/rest/basemap-styles/`);
			else {
				const e = Object.entries(a).filter(([e, r]) => r.classic || r.is3d).map(([e]) => `"${e}"`).sort().join(", ");
				c().warn(`Unable to find basemap definition for: ${r}. Try one of these: ${e}`);
			}
			return null;
		}
		s && (i = s[r]), i || (i = o ? F.fromId(r) : new F({ style: { id: r } }), s && (s[r] = i));
	} else i = w(F, r);
	return i?.destroyed && (c().warn("The provided basemap is already destroyed", { basemap: i }), i = null), i;
}
//#endregion
export { l as n, p as r, f as t };

//# sourceMappingURL=basemapEnsureType-Dr1Yhv3d.js.map