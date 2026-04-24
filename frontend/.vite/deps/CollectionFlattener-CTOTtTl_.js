import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { C as m, l as l$1 } from "./decorators-DE7S5xmd.js";
import { o as i } from "./Accessor-kDoDKy4v.js";
import { t as q } from "./Collection-BAJSKCip.js";
import { n as U } from "./reactiveUtils-DRpp6Nmg.js";
//#region node_modules/@arcgis/core/core/CollectionFlattener.js
var n = class extends q {
	constructor(t) {
		super(t), this.getCollections = null;
	}
	initialize() {
		this.addHandles(i(() => this._refresh(), U));
	}
	destroy() {
		this.getCollections = null;
	}
	_refresh() {
		const t = this.getCollections?.();
		if (null == t) return void this.removeAll();
		let o = 0;
		for (const e of t) null != e && (o = this._processCollection(o, e));
		this.splice(o);
	}
	_createNewInstance(t) {
		return new q(t);
	}
	_processCollection(t, o) {
		if (!o) return t;
		const e = this.itemFilterFunction ?? ((t) => !!t);
		for (const r of o) if (r) {
			if (e(r)) {
				const o = this.indexOf(r, t);
				o >= 0 ? o !== t && this.reorder(r, t) : this.add(r, t), ++t;
			}
			if (this.getChildrenFunction) {
				const o = this.getChildrenFunction(r);
				if (Array.isArray(o)) for (const e of o) t = this._processCollection(t, e);
				else t = this._processCollection(t, o);
			}
		}
		return t;
	}
};
__decorate([m()], n.prototype, "getCollections", void 0), __decorate([m()], n.prototype, "getChildrenFunction", void 0), __decorate([m()], n.prototype, "itemFilterFunction", void 0), n = __decorate([l$1("esri.core.CollectionFlattener")], n);
var l = n;
//#endregion
export { l as t };

//# sourceMappingURL=CollectionFlattener-CTOTtTl_.js.map