import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { h as r, n, p as o } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { L as e } from "./promiseUtils-DhYhergm.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import { t as b$1 } from "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./Evented-GLJbxWO5.js";
import "./Promise-Dhhz7kXA.js";
import "./jsonMap-CFSDFmi6.js";
import "./assets-BZbzeyNa.js";
import "./locale-BdrQIP_a.js";
import "./messages-BSXJ_xjI.js";
import { a as h, i as f, r as a$1, s as l$1, t as P } from "./reactiveUtils-DRpp6Nmg.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./uuid-CI605U6Y.js";
import "./number-DwLpDjta.js";
import "./intl-1FbLkipu.js";
import "./sanitizerUtils-D4_LRYnp.js";
import { n as c$1, t as O } from "./Widget-D7J6FR9J.js";
import { c as x$1, r as b$2, s as v$1, t as N } from "./widget-BsQfm1ik.js";
import { t as e$1 } from "./globalCss-Dvrz6ByO.js";
import "./projector-76ZJJlBX.js";
import "./runtime-C8rHe43j.js";
//#region node_modules/@arcgis/core/widgets/Expand/ExpandViewModel.js
var l = class extends b$1 {
	constructor(e) {
		super(e), this._viewpointHandle = null, this.group = null, e?.suppressDeprecationWarning || o(n.getLogger(this), "Expand", "arcgis-expand", { version: "5.0" });
	}
	normalizeCtorArgs(e) {
		const { suppressDeprecationWarning: t, ...i } = e ?? {};
		return i;
	}
	initialize() {
		this.addHandles(a$1(() => this.view?.ui, "expand", (e) => {
			const { target: t } = e;
			t && t !== this && t.expanded && t.group && t.group === this.group && this._collapse();
		}));
	}
	destroy() {
		this._viewpointHandle = null, this.view = null;
	}
	set autoCollapse(e) {
		this._set("autoCollapse", e), this._watchViewpoint();
	}
	set expanded(e) {
		const t = !!e;
		this._set("expanded", t);
		const i = this.view?.ui;
		i && i.emit("expand", { target: this }), this._viewpointHandleChange(t);
	}
	get state() {
		return this.view?.ready ? "ready" : "disabled";
	}
	set view(e) {
		this._get("view") !== e && (this._set("view", e), e && f(() => e.ready, () => {
			this.view === e && this._watchViewpoint();
		}, {
			once: !0,
			initial: !0
		}));
	}
	_viewpointHandleChange(e) {
		this._viewpointHandle && (e ? f(() => this.view?.stationary, () => this._viewpointHandle?.resume(), {
			once: !0,
			initial: !0
		}) : this._viewpointHandle.pause());
	}
	_watchViewpoint() {
		const e = "viewpoint";
		this.removeHandles(e), this._viewpointHandle = null;
		const { autoCollapse: t, view: i } = this;
		if (!i || !t) return;
		const s = P(() => "3d" === i.type ? i.camera : i.viewpoint, () => this._collapse());
		this.addHandles(s, e), this._viewpointHandle = s;
	}
	_collapse() {
		this.expanded = !1;
	}
};
__decorate([a({ value: !1 })], l.prototype, "autoCollapse", null), __decorate([a({ value: !1 })], l.prototype, "expanded", null), __decorate([a()], l.prototype, "group", void 0), __decorate([a({ readOnly: !0 })], l.prototype, "state", null), __decorate([a({ value: null })], l.prototype, "view", null), l = __decorate([c("esri.widgets.Expand.ExpandViewModel")], l);
var d = l;
//#endregion
//#region node_modules/@arcgis/core/widgets/Expand.js
var v = "esri-expand", _ = {
	base: v,
	toggle: `${v}__toggle`,
	popoverContent: `${v}__popover-content`,
	panel: `${v}__panel`,
	panelContent: `${v}__panel-content`,
	sheet: `${v}__sheet`,
	contentContainer: `${v}__content-container`,
	icon: "esri-collapse__icon",
	iconFlip: "esri-collapse__icon-flip",
	iconNumber: `${v}__icon-number`
}, w = "chevrons-left", y = "chevrons-right", b = Symbol("scheduleRender-override-handle");
var x = class extends O {
	constructor(e, o) {
		super(e, o), this._boundScheduledRender = this.scheduleRender.bind(this), this.closeOnEsc = !0, this.collapseTooltip = "", this.content = "", this.expandTooltip = "", this.focusTrapDisabled = !1, this.iconNumber = 0, this.messages = null, this.messagesCommon = null, this.mode = "auto", this.placement = null, this.viewModel = new d({ suppressDeprecationWarning: !0 }), this.toggle = () => {
			this.viewModel.expanded = !this.viewModel.expanded;
		}, this._handlePopoverClose = (e) => {
			e.target === this._popoverEl && (this.viewModel.expanded = e.currentTarget.open);
		}, this._handleSheetClose = (e) => {
			this.viewModel.expanded = e.currentTarget.open;
		}, this._handlePanelClose = (e) => {
			this.viewModel.expanded = !e.currentTarget.closed;
		}, this._handleKeyDown = (e) => {
			this.viewModel.expanded && "Escape" === e.key && !this._willCloseOnEsc(e) && e.preventDefault();
		}, this._storeToggleActionEl = (e) => {
			this._toggleActionEl = e;
		}, this._storePopoverEl = (e) => {
			this._popoverEl = e;
		}, r(n.getLogger(this), "Expand", "arcgis-expand", { version: "4.34" });
	}
	initialize() {
		this.addHandles(l$1(() => this.viewModel?.view?.size, () => this._popoverEl?.reposition(), h));
	}
	loadDependencies() {
		return c$1({
			action: () => import("./calcite-action-BQLn8VGB.js").then((n) => n.t),
			icon: () => import("./calcite-icon-ClTjWMrb.js").then((n) => n.t),
			panel: () => import("./calcite-panel-OBok2pNu.js"),
			popover: () => import("./calcite-popover-DL1NtU9V.js").then((n) => n.t),
			sheet: () => import("./calcite-sheet-CMOkcKX-.js")
		});
	}
	get expandTitle() {
		const { expanded: e, messagesCommon: t, collapseTooltip: o, expandTooltip: n } = this;
		return (e ? o || t?.collapse : n || t?.expand) ?? "";
	}
	get _displaySheet() {
		switch (this.mode) {
			case "drawer": return !0;
			case "auto": return "xsmall" === this.viewModel.view?.widthBreakpoint;
			default: return !1;
		}
	}
	get autoCollapse() {
		return this.viewModel.autoCollapse;
	}
	set autoCollapse(e) {
		this.viewModel.autoCollapse = e;
	}
	get collapseIcon() {
		return y;
	}
	set collapseIcon(e) {
		this._overrideIfSome("collapseIcon", e);
	}
	get expanded() {
		return this.viewModel.expanded;
	}
	set expanded(e) {
		this.viewModel.expanded = e;
	}
	get expandIcon() {
		return "object" == typeof this.content && "icon" in this.content && this.content.icon ? this.content.icon : w;
	}
	set expandIcon(e) {
		this._overrideIfSome("expandIcon", e);
	}
	get group() {
		return this.viewModel.group;
	}
	set group(e) {
		this.viewModel.group = e;
	}
	get icon() {
		return null;
	}
	get label() {
		return "object" == typeof this.content && "label" in this.content && this.content.label ? this.content.label : this.messages?.widgetLabel ?? "";
	}
	set label(e) {
		this._overrideIfSome("label", e);
	}
	get view() {
		return this.viewModel.view;
	}
	set view(e) {
		this.viewModel.view = e;
	}
	expand() {
		this.viewModel.expanded = !0;
	}
	collapse() {
		this.viewModel.expanded = !1;
	}
	render() {
		const { _displaySheet: e, _toggleActionEl: t, viewModel: { expanded: o }, label: n, placement: i } = this;
		return x$1("div", { class: this.classes(_.base, e$1.widget) }, this._renderToggle(), e ? x$1("calcite-sheet", {
			class: _.sheet,
			heightScale: "l",
			label: n,
			onkeydown: this._handleKeyDown,
			open: o,
			position: "block-end",
			topLayerDisabled: this.topLayerDisabled,
			onCalciteSheetClose: this._handleSheetClose
		}, x$1("calcite-panel", {
			class: _.panel,
			closable: !0,
			closed: !o,
			heading: n,
			onkeydown: this._handleKeyDown,
			onCalcitePanelClose: this._handlePanelClose
		}, x$1("div", { class: _.panelContent }, this._renderContent()))) : t ? x$1("calcite-popover", {
			afterCreate: this._storePopoverEl,
			afterUpdate: this._storePopoverEl,
			focusTrapDisabled: this.focusTrapDisabled,
			label: n,
			onkeydown: this._handleKeyDown,
			open: o,
			overlayPositioning: "fixed",
			placement: i ?? this._getPlacement(),
			referenceElement: t,
			topLayerDisabled: this.topLayerDisabled,
			onCalcitePopoverClose: this._handlePopoverClose
		}, x$1("div", { class: _.popoverContent }, this._renderContent())) : null);
	}
	_getPlacement() {
		const { container: e, view: t } = this, o = e && t ? t.ui.getPosition(e) : null;
		if (!o || "manual" === o) return "auto";
		const [n, i] = o.split("-");
		return `${"right" === i ? "left" : "right"}-${"bottom" === n ? "end" : "start"}`;
	}
	_willCloseOnEsc(e) {
		const { closeOnEsc: t } = this;
		return "function" == typeof t ? t(e) : t;
	}
	_renderBadgeNumber() {
		const { expanded: e, iconNumber: t } = this;
		return t && !e ? x$1("span", {
			class: _.iconNumber,
			key: "expand__icon-number"
		}, t) : null;
	}
	_renderToggleButton() {
		const { expanded: e, expandTitle: t, expandIcon: o, collapseIcon: n } = this, i = e ? n : o, s = i === w || i === y;
		return x$1("calcite-action", {
			afterCreate: this._storeToggleActionEl,
			afterUpdate: this._storeToggleActionEl,
			class: e$1.widgetButton,
			onclick: this.toggle,
			text: t,
			title: t
		}, i ? x$1("calcite-icon", {
			class: this.classes(_.icon, s && _.iconFlip),
			icon: i,
			scale: "s"
		}) : null);
	}
	_renderToggle() {
		return x$1("div", { class: _.toggle }, this._renderToggleButton(), this._renderBadgeNumber());
	}
	_renderContent() {
		const { content: e } = this;
		return "string" == typeof e ? x$1("div", {
			class: _.contentContainer,
			innerHTML: e,
			key: "content__string"
		}) : b$2(e) ? x$1("div", {
			afterCreate: () => {
				this._overwriteChildScheduleRender(e);
			},
			afterRemoved: () => this.removeHandles(b),
			afterUpdate: () => {
				e.scheduleRender !== this._boundScheduledRender && (this.removeHandles(b), this._overwriteChildScheduleRender(e));
			},
			class: _.contentContainer,
			key: "content__widget"
		}, e.render()) : e instanceof HTMLElement ? x$1("div", {
			afterCreate: this._attachToNode,
			bind: e,
			class: _.contentContainer,
			key: "content__html-element"
		}) : N(e) ? x$1("div", {
			afterCreate: this._attachToNode,
			bind: e.domNode,
			class: _.contentContainer,
			key: "content__node"
		}) : null;
	}
	_overwriteChildScheduleRender(e$2) {
		const t = e$2.scheduleRender;
		e$2.scheduleRender = this._boundScheduledRender, this.addHandles(e(() => e$2.scheduleRender = t), b);
	}
	_attachToNode(e) {
		const t = this;
		e.appendChild(t);
	}
};
__decorate([a({ readOnly: !0 })], x.prototype, "expandTitle", null), __decorate([a()], x.prototype, "_toggleActionEl", void 0), __decorate([a()], x.prototype, "_displaySheet", null), __decorate([a()], x.prototype, "autoCollapse", null), __decorate([a()], x.prototype, "closeOnEsc", void 0), __decorate([a()], x.prototype, "collapseIcon", null), __decorate([a()], x.prototype, "collapseTooltip", void 0), __decorate([a()], x.prototype, "content", void 0), __decorate([a()], x.prototype, "expanded", null), __decorate([a()], x.prototype, "expandIcon", null), __decorate([a()], x.prototype, "expandTooltip", void 0), __decorate([a()], x.prototype, "focusTrapDisabled", void 0), __decorate([a()], x.prototype, "group", null), __decorate([a()], x.prototype, "icon", null), __decorate([a()], x.prototype, "iconNumber", void 0), __decorate([a()], x.prototype, "label", null), __decorate([a(), v$1("esri/widgets/Expand/t9n/Expand")], x.prototype, "messages", void 0), __decorate([a(), v$1("esri/t9n/common")], x.prototype, "messagesCommon", void 0), __decorate([a()], x.prototype, "mode", void 0), __decorate([a()], x.prototype, "placement", void 0), __decorate([a()], x.prototype, "view", null), __decorate([a({ type: d })], x.prototype, "viewModel", void 0), x = __decorate([c("esri.widgets.Expand")], x);
var C = x;
//#endregion
export { C as default };

//# sourceMappingURL=@arcgis_core_widgets_Expand.js.map