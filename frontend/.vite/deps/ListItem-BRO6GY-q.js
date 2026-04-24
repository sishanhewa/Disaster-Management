import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { T as N } from "./typedArrayUtil-BAuNmygZ.js";
import { j as u } from "./promiseUtils-DhYhergm.js";
import { B as o, n as c$1, r as m, t as a } from "./decorators-DE7S5xmd.js";
import { t as b } from "./Accessor-kDoDKy4v.js";
import { t as q } from "./Collection-BAJSKCip.js";
import { a as h, s as l } from "./reactiveUtils-DRpp6Nmg.js";
import { t as o$1 } from "./Identifiable-D2tBaz7a.js";
import { n as a$1, r as p, t as r } from "./ActionToggle-JH4srUd2.js";
import { t as O$1 } from "./Widget-D7J6FR9J.js";
import { c as x, r as b$1 } from "./widget-BsQfm1ik.js";
import { a as b$2, h as x$1, i as a$2, o as d, p as u$1, u as p$1 } from "./listUtils-D7SjyOSp.js";
//#region node_modules/@arcgis/core/widgets/LayerList/ListItemPanel.js
var g = class extends o$1(O$1) {
	constructor(e, t) {
		super(e, t), this._legend = null, this.content = null, this.flowEnabled = !1, this.image = null, this.listItem = null, this.open = !1, this.visible = !0;
	}
	initialize() {
		this.addHandles([l(() => this._canCreateLegend, () => this._createLegend(), h), l(() => [this._legend, this._legendOptions], () => this._updateLegend(), h)]);
	}
	destroy() {
		this._legend = u(this._legend);
	}
	get _canCreateLegend() {
		const { content: e, listItem: t } = this;
		if (!t) return !1;
		const n = "legend";
		return e === n || null != e && !!Array.isArray(e) && e.includes(n);
	}
	get _legendOptions() {
		const { listItem: e, _legendLayerInfo: t } = this, n = e?.view;
		return t && n ? {
			view: n,
			layerInfos: [t]
		} : {};
	}
	get _legendLayerInfo() {
		const e = this.listItem?.layer;
		if (!e || "subtype-sublayer" === e.type) return null;
		const t = x$1(e) ? e : null, n = "map-layer" === t?.source?.type ? t.source : null, i = "layer" in e && e.layer, r = "";
		return n && i ? {
			layer: i,
			title: r,
			sublayerIds: [n.mapLayerId]
		} : {
			layer: e,
			title: r
		};
	}
	get disabled() {
		const { listItem: e, _legend: t, content: n } = this;
		return !e || !(Array.isArray(n) && n.length > 1) && !!t && (!t.activeLayerInfos?.length || !e.visibleAtCurrentScale || !e.visible);
	}
	set disabled(e) {
		this._overrideIfSome("disabled", e);
	}
	get icon() {
		const { image: e } = this, t = this._getFirstWidget();
		return this._get("icon") ?? (!e && t ? t.icon : null);
	}
	set icon(e) {
		this._overrideIfSome("icon", e);
	}
	get title() {
		return this._get("title") || (this._getFirstWidget()?.label ?? "");
	}
	set title(e) {
		this._override("title", e);
	}
	render() {
		return x("div", { class: "esri-list-item-panel" }, this._renderContents());
	}
	_renderContent(e) {
		const { _legend: t, disabled: n, open: i } = this;
		return e && !n && i ? "legend" === e && t ? x("div", { key: "legend-widget" }, t.render()) : "string" == typeof e ? x("div", {
			innerHTML: e,
			key: e
		}) : b$1(e) ? x("div", { key: "content-widget" }, e.render()) : e instanceof HTMLElement ? x("div", {
			afterCreate: this._attachToNode,
			bind: e,
			key: "content-element"
		}) : null : null;
	}
	_renderContents() {
		const { content: e, open: t } = this;
		return t ? Array.isArray(e) ? e.map((e) => this._renderContent(e)) : this._renderContent(e) : null;
	}
	async _createLegend() {
		if (u(this._legend), this._legend = null, !this._canCreateLegend) return;
		const { default: e } = await import("./Legend-vmhV6aBy.js");
		this._legend = new e(this._legendOptions);
	}
	_attachToNode(e) {
		e.appendChild(this);
	}
	_updateLegend() {
		const e = this._legend;
		e && e.set(this._legendOptions);
	}
	_getWidget(e) {
		return "legend" === e ? this._legend : b$1(e) ? e : null;
	}
	_getFirstWidget() {
		const { content: e } = this;
		return Array.isArray(e) ? e.map((e) => this._getWidget(e)).find((e) => e) : this._getWidget(e);
	}
};
__decorate([a()], g.prototype, "_legend", void 0), __decorate([a()], g.prototype, "_canCreateLegend", null), __decorate([a()], g.prototype, "_legendOptions", null), __decorate([a()], g.prototype, "_legendLayerInfo", null), __decorate([a()], g.prototype, "content", void 0), __decorate([a()], g.prototype, "disabled", null), __decorate([a()], g.prototype, "flowEnabled", void 0), __decorate([a()], g.prototype, "icon", null), __decorate([a()], g.prototype, "image", void 0), __decorate([a()], g.prototype, "listItem", void 0), __decorate([a()], g.prototype, "open", void 0), __decorate([a()], g.prototype, "title", null), __decorate([a()], g.prototype, "visible", void 0), g = __decorate([c$1("esri.widgets.LayerList.ListItemPanel")], g);
var c = g;
//#endregion
//#region node_modules/@arcgis/core/widgets/LayerList/ListItem.js
var C;
var w = q.ofType({
	key: "type",
	defaultKeyValue: "button",
	base: p,
	typeMap: {
		button: a$1,
		toggle: r
	}
}), _ = q.ofType(w), S = "layer", M = "child-list-mode", P = "hide";
var O = C = class extends o$1(b) {
	constructor(e) {
		super(e), this.actionsSections = new _(), this.actionsOpen = !1, this.checkPublishStatusEnabled = !1, this.children = new (q.ofType(C))(), this.childrenSortable = !0, this.hidden = !1, this.layer = null, this.listItemCreatedFunction = null, this.listModeDisabled = !1, this.open = !1, this.parent = null, this.view = null;
	}
	initialize() {
		if (this.addHandles([
			l(() => [
				this.layer,
				this.layer?.listMode,
				this.listModeDisabled
			], () => this._watchLayerProperties(this.layer), h),
			l(() => this.checkPublishStatusEnabled, (e) => this._updateChildrenPublishing(e), h),
			l(() => this.view, (e) => this._updateChildrenView(e), h),
			l(() => this.panel, (e) => this._setListItemOnPanel(e), h)
		]), "function" == typeof this.listItemCreatedFunction) {
			const e = { item: this };
			this.listItemCreatedFunction.call(null, e);
		}
	}
	destroy() {
		this.panel?.destroy(), this.children.destroyAll(), this.view = null;
	}
	get connectionStatus() {
		const { layerView: e, publishing: t } = this;
		if (!t && e && "connectionStatus" in e) return e.connectionStatus;
	}
	get error() {
		return this.layer?.loadError;
	}
	get incompatible() {
		const { layerView: e } = this;
		return !(!e || !("spatialReferenceSupported" in e)) && !e.spatialReferenceSupported;
	}
	get layerView() {
		const { layer: e, view: t } = this;
		if (!e || !t || "sublayer" === e.type) return null;
		const i = "subtype-sublayer" === e.type ? e.parent : e;
		return t.allLayerViews.find((e) => e.layer === i) ?? null;
	}
	set panel(e) {
		const t = this._get("panel");
		e !== t && e && t?.destroy(), this._set("panel", e);
	}
	castPanel(e) {
		return this.panel?.open && !e.hasOwnProperty("open") && (e.open = !0), e ? new c(e) : null;
	}
	get sortable() {
		return "knowledge-graph-sublayer" !== this.layer?.type && this._get("sortable");
	}
	set sortable(e) {
		this._set("sortable", e);
	}
	get title() {
		const e = o(this, "layer.layer");
		return (!e || e && o(this, "layer.layer.loaded")) && o(this, "layer.title") || o(this, "layer.attributes.title") || "";
	}
	set title(e) {
		this._override("title", e);
	}
	get publishing() {
		const { layer: e, checkPublishStatusEnabled: t } = this;
		return !!(t && e && "publishingInfo" in e && "publishing" === e.publishingInfo?.status);
	}
	get updating() {
		const { layerView: e, connectionStatus: t, layer: i, publishing: s } = this;
		return !s && !t && (e ? e.updating : "loading" === i?.loadStatus || !1);
	}
	get visible() {
		return !!this.layer?.visible;
	}
	set visible(e) {
		const t = this.layer;
		t && (t.visible = e);
	}
	get visibleAtCurrentScale() {
		return this.layerView?.visibleAtCurrentScale ?? !b$2(this.layer, this.view?.scale);
	}
	get visibleAtCurrentTimeExtent() {
		return this.layerView?.visibleAtCurrentTimeExtent ?? !0;
	}
	get visibilityMode() {
		return a$2(this.layer);
	}
	clone() {
		return new C({
			actionsSections: this.actionsSections.clone(),
			actionsOpen: this.actionsOpen,
			checkPublishStatusEnabled: this.checkPublishStatusEnabled,
			children: this.children.clone(),
			childrenSortable: this.childrenSortable,
			hidden: this.hidden,
			layer: this.layer,
			listItemCreatedFunction: this.listItemCreatedFunction,
			listModeDisabled: this.listModeDisabled,
			open: this.open,
			panel: this.panel,
			parent: this.parent,
			sortable: this.sortable,
			title: this.title,
			view: this.view,
			visible: this.visible
		});
	}
	_setListItemOnPanel(e) {
		e && (e.listItem = this);
	}
	_updateChildrenPublishing(e) {
		this.children?.forEach((t) => t.checkPublishStatusEnabled = e);
	}
	_updateChildrenView(e) {
		const t = this.children;
		t && t.forEach((t) => t.view = e);
	}
	_createChildren(e) {
		const { listModeDisabled: t, children: i } = this, s = e.filter((e) => !i.some((t) => t.layer === e));
		i.addMany(this._createChildItems(s, t));
	}
	_destroyChildren(e) {
		const { children: t } = this, i = t.filter((t) => !!t.layer && !e.includes(t.layer));
		t.destroyMany(i);
	}
	_sortChildren(e) {
		this.children.sort((t, i) => e.indexOf(i.layer) - e.indexOf(t.layer));
	}
	_destroyAllChildren() {
		this.removeHandles(M), this.children.destroyAll();
	}
	_watchChildLayerListMode(e) {
		this.removeHandles(M), this.listModeDisabled || this.addHandles(e.toArray().map((t) => l(() => t.listMode, () => this._compileChildren(e))), M);
	}
	_compileChildren(e) {
		const t = this.listModeDisabled ? e : e?.filter((e) => u$1(e) !== P);
		e?.length ? (this._createChildren(t), this._destroyChildren(t), this._sortChildren(t), this._watchChildLayerListMode(e)) : this._destroyAllChildren();
	}
	_watchSublayerChanges(e) {
		e && this.addHandles(e.on("change", () => this._compileChildren(e)), S);
	}
	_initializeChildLayers(e) {
		this._compileChildren(e), this._watchSublayerChanges(e);
	}
	_createChildItems(e, t) {
		return e.reverse().map((e) => t || p$1(e) ? new C({
			layer: e,
			checkPublishStatusEnabled: this.checkPublishStatusEnabled,
			listItemCreatedFunction: this.listItemCreatedFunction,
			listModeDisabled: this.listModeDisabled,
			parent: this,
			view: this.view
		}) : null).filter(N);
	}
	_watchLayerProperties(e) {
		if (this.removeHandles(S), this.removeHandles(M), !e) return;
		if ("hide-children" === (!this.listModeDisabled && u$1(e))) return void this.children.destroyAll();
		const t = d(e);
		t && this.addHandles(l(() => e[t], (i) => {
			e.hasOwnProperty(t) && this._initializeChildLayers(i);
		}, h), S);
	}
};
__decorate([a({ type: _ })], O.prototype, "actionsSections", void 0), __decorate([a()], O.prototype, "actionsOpen", void 0), __decorate([a()], O.prototype, "checkPublishStatusEnabled", void 0), __decorate([a({ type: q.ofType(O) })], O.prototype, "children", void 0), __decorate([a()], O.prototype, "childrenSortable", void 0), __decorate([a({ readOnly: !0 })], O.prototype, "connectionStatus", null), __decorate([a({ readOnly: !0 })], O.prototype, "error", null), __decorate([a()], O.prototype, "hidden", void 0), __decorate([a({ readOnly: !0 })], O.prototype, "incompatible", null), __decorate([a()], O.prototype, "layer", void 0), __decorate([a({ readOnly: !0 })], O.prototype, "layerView", null), __decorate([a()], O.prototype, "listItemCreatedFunction", void 0), __decorate([a({ nonNullable: !0 })], O.prototype, "listModeDisabled", void 0), __decorate([a()], O.prototype, "open", void 0), __decorate([a({ type: c })], O.prototype, "panel", null), __decorate([m("panel")], O.prototype, "castPanel", null), __decorate([a()], O.prototype, "parent", void 0), __decorate([a({ value: !0 })], O.prototype, "sortable", null), __decorate([a()], O.prototype, "title", null), __decorate([a({ readOnly: !0 })], O.prototype, "publishing", null), __decorate([a({ readOnly: !0 })], O.prototype, "updating", null), __decorate([a()], O.prototype, "view", void 0), __decorate([a()], O.prototype, "visible", null), __decorate([a({ readOnly: !0 })], O.prototype, "visibleAtCurrentScale", null), __decorate([a({ readOnly: !0 })], O.prototype, "visibleAtCurrentTimeExtent", null), __decorate([a({ readOnly: !0 })], O.prototype, "visibilityMode", null), O = C = __decorate([c$1("esri.widgets.LayerList.ListItem")], O);
var I = O;
//#endregion
export { I as t };

//# sourceMappingURL=ListItem-BRO6GY-q.js.map