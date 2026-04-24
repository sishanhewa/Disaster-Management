import { n, w as a } from "./Error-CzxduO2m.js";
import { V as I, Y as V, a as L, d as j } from "./request-CuG5cxow.js";
import { h as y } from "./commonProperties-DQjThAJZ.js";
//#region node_modules/@arcgis/core/layers/support/multiLayerServiceUtils.js
function i(o) {
	const { nonStandardUrlAllowed: e = !1, separator: i } = o ?? {}, s = a(y), u = s.json?.write;
	return "object" == typeof u && u && (u.writer = function(r, t, o, e) {
		j(this, r, i, t, e);
	}), {
		...s,
		set: function(r) {
			if (null == r) return void this._set("url", r);
			const o = L({
				layer: this,
				url: r,
				nonStandardUrlAllowed: e,
				logger: n.getLogger(this)
			});
			this._set("url", o.url), null != o.layerId && this._set("layerId", o.layerId);
		}
	};
}
function s(r, t) {
	const { separator: l } = t ?? {}, n = I(r.url);
	return null != n && (null != r.dynamicDataSource ? n.path = V(n.path, "dynamicLayer") : null != r.layerId && (n.path = V(n.path, l ?? "", r.layerId.toString()))), n;
}
//#endregion
export { s as n, i as t };

//# sourceMappingURL=multiLayerServiceUtils-DCT7dTXz.js.map