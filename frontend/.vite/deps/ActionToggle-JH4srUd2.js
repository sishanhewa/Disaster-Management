import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c, t as a$2 } from "./decorators-DE7S5xmd.js";
import { t as b } from "./Accessor-kDoDKy4v.js";
import { t as o$2 } from "./Identifiable-D2tBaz7a.js";
//#region node_modules/@arcgis/core/support/actions/ActionBase.js
var r$2 = class extends o$2(b) {
	constructor(t) {
		super(t), this.active = !1, this.className = null, this.disabled = !1, this.icon = null, this.id = null, this.indicator = !1, this.title = null, this.type = null, this.visible = !0;
	}
};
__decorate([a$2()], r$2.prototype, "active", void 0), __decorate([a$2()], r$2.prototype, "className", void 0), __decorate([a$2()], r$2.prototype, "disabled", void 0), __decorate([a$2()], r$2.prototype, "icon", void 0), __decorate([a$2()], r$2.prototype, "id", void 0), __decorate([a$2()], r$2.prototype, "indicator", void 0), __decorate([a$2()], r$2.prototype, "title", void 0), __decorate([a$2()], r$2.prototype, "type", void 0), __decorate([a$2()], r$2.prototype, "visible", void 0), r$2 = __decorate([c("esri.support.actions.ActionBase")], r$2);
var p = r$2;
//#endregion
//#region node_modules/@arcgis/core/support/actions/ActionButton.js
var o$1;
var r$1 = o$1 = class extends p {
	constructor(t) {
		super(t), this.image = null, this.type = "button";
	}
	clone() {
		return new o$1({
			active: this.active,
			className: this.className,
			disabled: this.disabled,
			icon: this.icon,
			id: this.id,
			indicator: this.indicator,
			title: this.title,
			visible: this.visible,
			image: this.image
		});
	}
};
__decorate([a$2()], r$1.prototype, "image", void 0), r$1 = o$1 = __decorate([c("esri.support.actions.ActionButton")], r$1);
var a$1 = r$1;
//#endregion
//#region node_modules/@arcgis/core/support/actions/ActionToggle.js
var o;
var a = o = class extends p {
	constructor(i) {
		super(i), this.image = null, this.type = "toggle", this.value = !1;
	}
	clone() {
		return new o({
			active: this.active,
			className: this.className,
			disabled: this.disabled,
			icon: this.icon,
			id: this.id,
			indicator: this.indicator,
			title: this.title,
			visible: this.visible,
			image: this.image,
			value: this.value
		});
	}
};
__decorate([a$2()], a.prototype, "image", void 0), __decorate([a$2()], a.prototype, "value", void 0), a = o = __decorate([c("esri.support.actions.ActionToggle")], a);
var r = a;
//#endregion
export { a$1 as n, p as r, r as t };

//# sourceMappingURL=ActionToggle-JH4srUd2.js.map