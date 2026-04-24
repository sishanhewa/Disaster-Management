import { l as u } from "./jsonTypeUtils-D92XTAwe.js";
import { t as G } from "./jsonUtils-D_oLUjKv.js";
//#region node_modules/@arcgis/core/rest/geometryService/utils.js
function o(e) {
	return {
		geometryType: u(e[0]),
		geometries: e.map((t) => t.toJSON())
	};
}
function r(t, o, r) {
	const n = G(o);
	return t.map((t) => {
		const e = n.fromJSON(t);
		return e.spatialReference = r, e;
	});
}
//#endregion
export { r as n, o as t };

//# sourceMappingURL=utils-Ch7GqCap.js.map