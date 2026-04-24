import { o as O } from "./spatialReferenceUtils-b3vCEkpS.js";
import { o as y } from "./geodesicUtils-C7KxNiIf.js";
//#region node_modules/@arcgis/core/views/support/geodesicMeasurementUtils.js
function r(r) {
	return y(r) || O(r);
}
function t(o, r, t, ...i) {
	return y(o) ? r.apply(void 0, i) : o.isWebMercator ? t.apply(void 0, i) : null;
}
//#endregion
export { t as n, r as t };

//# sourceMappingURL=geodesicMeasurementUtils-BKvxSbFi.js.map