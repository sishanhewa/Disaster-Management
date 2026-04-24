import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n } from "./Error-CzxduO2m.js";
import { f as m, r as C } from "./request-CuG5cxow.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
//#region node_modules/@arcgis/core/layers/mixins/ArcGISService.js
var l = (l) => {
	const p = l;
	let u = class extends p {
		get title() {
			if (this._get("title") && "defaults" !== this.originOf("title")) return this._get("title");
			if (this.url) {
				const t = m(this.url);
				if (t?.title) return t.title;
			}
			return this._get("title") || "";
		}
		set title(t) {
			this._set("title", t);
		}
		set url(t) {
			this._set("url", C(t, n.getLogger(this)));
		}
	};
	return __decorate([a()], u.prototype, "title", null), __decorate([a({ type: String })], u.prototype, "url", null), u = __decorate([c("esri.layers.mixins.ArcGISService")], u), u;
};
//#endregion
export { l as t };

//# sourceMappingURL=ArcGISService-BFbH4hVT.js.map