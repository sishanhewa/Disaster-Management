import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
//#region node_modules/@arcgis/core/layers/mixins/APIKeyMixin.js
function r(e) {
	return "portalItem" in e;
}
var s = (s) => {
	const p = s;
	let o = class extends p {
		get apiKey() {
			return this._isOverridden("apiKey") ? this._get("apiKey") : r(this) ? this.portalItem?.apiKey : null;
		}
		set apiKey(e) {
			null != e ? this._override("apiKey", e) : (this._clearOverride("apiKey"), this.clear("apiKey", "user"));
		}
	};
	return __decorate([a({ type: String })], o.prototype, "apiKey", null), o = __decorate([c("esri.layers.mixins.APIKeyMixin")], o), o;
};
//#endregion
export { s as t };

//# sourceMappingURL=APIKeyMixin-CpWoJvp9.js.map