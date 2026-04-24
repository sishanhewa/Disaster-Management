import { S as u, l as b, y as p } from "./aaBoundingRect-CgUWvAgv.js";
import { o as f } from "./Polyline-Cv0nwof6.js";
import { n as L } from "./densifyCurvedGeometry-LJustJq_.js";
import { i as t } from "./densificationConstants-Bt2UDmIu.js";
//#region node_modules/@arcgis/core/symbols/support/densifyForPreview.js
function n(t$1, o, r, e) {
	const { height: n, width: p } = e ?? m(t$1);
	return L(t$1, { maxDeviation: Math.min(p / o, n / r) * t() });
}
function m(i) {
	const s = f(u(), i);
	return {
		width: p(s),
		height: b(s)
	};
}
//#endregion
export { n as t };

//# sourceMappingURL=densifyForPreview-ChNlTKfc.js.map