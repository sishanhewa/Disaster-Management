import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { h as r$1, n as n$2 } from "./Error-CzxduO2m.js";
import { T as N } from "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { B as o$1, N as w, n as c$1, r as m$1, t as a } from "./decorators-DE7S5xmd.js";
import { t as b } from "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import { n as l$1 } from "./Evented-GLJbxWO5.js";
import "./SimpleObservable-CNlRjEs1.js";
import { t as q } from "./Collection-BAJSKCip.js";
import "./JSONSupport-BUaD4jSd.js";
import "./Promise-Dhhz7kXA.js";
import "./Loadable-CQsALnOO.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import "./messages-BSXJ_xjI.js";
import { a as h$1, r as a$1, s as l$2 } from "./reactiveUtils-DRpp6Nmg.js";
import { t as o$2 } from "./Identifiable-D2tBaz7a.js";
import "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./catalogUtils-lRNSLCIB.js";
import "./uuid-CI605U6Y.js";
import { n as a$2, r as p, t as r$2 } from "./ActionToggle-JH4srUd2.js";
import "./number-DwLpDjta.js";
import "./intl-1FbLkipu.js";
import "./sanitizerUtils-D4_LRYnp.js";
import { n as c$2, t as O } from "./Widget-D7J6FR9J.js";
import { a as m$2, c as x, p as w$1, r as b$1, s as v$1 } from "./widget-BsQfm1ik.js";
import { t as e } from "./globalCss-Dvrz6ByO.js";
import "./projector-76ZJJlBX.js";
import "./runtime-C8rHe43j.js";
import "./actionUtils-Cy0Gr9_I.js";
import { d as q$1, f as s, n as C, o as d, p as u, s as f, t as t$2, u as p$1 } from "./listUtils-D7SjyOSp.js";
//#region node_modules/@arcgis/core/widgets/TableList/css.js
var t$1 = "esri-table-list", i = `${t$1}__item`, o = {
	base: t$1,
	actionMenu: `${t$1}__action-menu`,
	actionGroup: `${t$1}__action-group`,
	filterNoResults: `${t$1}__filter-no-results`,
	item: i,
	itemContentBottom: `${i}-content-bottom`,
	itemMessage: `${i}-message`,
	itemActionIcon: `${i}-action-icon`,
	itemActionImage: `${i}-action-image`,
	itemTemporaryIcon: `${i}-temporary-icon`,
	publishing: `${t$1}__publishing`,
	statusIndicator: `${t$1}__status-indicator`
};
//#endregion
//#region node_modules/@arcgis/core/widgets/TableList/ListItemPanel.js
var l = class extends o$2(O) {
	constructor(t, e) {
		super(t, e), this.content = null, this.flowEnabled = !1, this.image = null, this.listItem = null, this.open = !1, this.visible = !0;
	}
	get disabled() {
		return !(this.content && this.listItem);
	}
	set disabled(t) {
		this._overrideIfSome("disabled", t);
	}
	get icon() {
		const { image: t } = this, e = this._getFirstWidget();
		return this._get("icon") ?? (!t && e ? e.icon : null);
	}
	set icon(t) {
		this._overrideIfSome("icon", t);
	}
	get title() {
		return this._get("title") || (this._getFirstWidget()?.label ?? "");
	}
	set title(t) {
		this._override("title", t);
	}
	render() {
		return x("div", { class: "esri-list-item-panel" }, this._renderContents());
	}
	_renderContent(t) {
		const { disabled: e, open: i } = this;
		return t && !e && i ? "string" == typeof t ? x("div", {
			innerHTML: t,
			key: t
		}) : b$1(t) ? x("div", { key: "content-widget" }, t.render()) : t instanceof HTMLElement ? x("div", {
			afterCreate: this._attachToNode,
			bind: t,
			key: "content-element"
		}) : null : null;
	}
	_renderContents() {
		const { content: t, open: e } = this;
		return e ? Array.isArray(t) ? t.map((t) => this._renderContent(t)) : this._renderContent(t) : null;
	}
	_attachToNode(t) {
		t.appendChild(this);
	}
	_getWidget(t) {
		return b$1(t) ? t : null;
	}
	_getFirstWidget() {
		const { content: t } = this;
		return Array.isArray(t) ? t.map((t) => this._getWidget(t)).find((t) => t) : this._getWidget(t);
	}
};
__decorate([a()], l.prototype, "content", void 0), __decorate([a()], l.prototype, "disabled", null), __decorate([a()], l.prototype, "flowEnabled", void 0), __decorate([a()], l.prototype, "icon", null), __decorate([a()], l.prototype, "image", void 0), __decorate([a()], l.prototype, "listItem", void 0), __decorate([a()], l.prototype, "open", void 0), __decorate([a()], l.prototype, "title", null), __decorate([a()], l.prototype, "visible", void 0), l = __decorate([c$1("esri.widgets.TableList.ListItemPanel")], l);
//#endregion
//#region node_modules/@arcgis/core/widgets/TableList/ListItem.js
var _;
var g = "layer", v = "child-list-mode", P = "hide", I = q.ofType({
	key: "type",
	defaultKeyValue: "button",
	base: p,
	typeMap: {
		button: a$2,
		toggle: r$2
	}
}), S = q.ofType(I);
var M = _ = class extends o$2(b) {
	constructor(t) {
		super(t), this.actionsSections = new S(), this.actionsOpen = !1, this.checkPublishStatusEnabled = !1, this.children = new (q.ofType(_))(), this.hidden = !1, this.layer = null, this.listItemCreatedFunction = null, this.listModeDisabled = !1, this.open = !1, this.parent = null, this.sortable = !0;
	}
	initialize() {
		if (this.addHandles([
			l$2(() => [this.layer?.listMode, this.listModeDisabled], () => this._watchLayerProperties(this.layer), h$1),
			l$2(() => this.checkPublishStatusEnabled, (t) => this._updateChildrenPublishing(t), h$1),
			l$2(() => this.panel, (t) => this._setListItemOnPanel(t), h$1)
		]), "function" == typeof this.listItemCreatedFunction) {
			const t = { item: this };
			this.listItemCreatedFunction.call(null, t);
		}
	}
	destroy() {
		this.panel?.destroy(), this.children.destroyAll();
	}
	get error() {
		return this.layer?.loadError;
	}
	set panel(t) {
		const e = this._get("panel");
		t !== e && t && e?.destroy(), this._set("panel", t);
	}
	castPanel(t) {
		return this.panel?.open && !t.hasOwnProperty("open") && (t.open = !0), w(l, t);
	}
	get publishing() {
		const { layer: t, checkPublishStatusEnabled: e } = this;
		return (e && t && "publishingInfo" in t && "publishing" === t.publishingInfo?.status) ?? !1;
	}
	get title() {
		const t = o$1(this, "layer.layer");
		return (!t || t && o$1(this, "layer.layer.loaded") ? this.layer?.title : null) ?? "";
	}
	set title(t) {
		this._overrideIfSome("title", t);
	}
	clone() {
		return new _({
			actionsSections: this.actionsSections.clone(),
			actionsOpen: this.actionsOpen,
			checkPublishStatusEnabled: this.checkPublishStatusEnabled,
			children: this.children.clone(),
			hidden: this.hidden,
			layer: this.layer,
			listItemCreatedFunction: this.listItemCreatedFunction,
			listModeDisabled: this.listModeDisabled,
			open: this.open,
			panel: this.panel,
			parent: this.parent,
			sortable: this.sortable,
			title: this.title
		});
	}
	_updateChildrenPublishing(t) {
		this.children?.forEach((e) => e.checkPublishStatusEnabled = t);
	}
	_setListItemOnPanel(t) {
		t && (t.listItem = this);
	}
	_createChildItems(t, e) {
		return t.reverse().map((t) => e || p$1(t) ? new _({
			layer: t,
			checkPublishStatusEnabled: this.checkPublishStatusEnabled,
			listItemCreatedFunction: this.listItemCreatedFunction,
			listModeDisabled: this.listModeDisabled,
			parent: this
		}) : null).filter(N);
	}
	_createChildren(t) {
		const { listModeDisabled: e, children: i } = this, s = t.reverse().filter((t) => !i.some((e) => e.layer === t));
		i.addMany(this._createChildItems(s, e));
	}
	_destroyChildren(t) {
		const { children: e } = this, i = e.filter((e) => !!e.layer && !t.includes(e.layer));
		e.destroyMany(i);
	}
	_sortChildren(t) {
		this.children.sort((e, i) => t.indexOf(i.layer) - t.indexOf(e.layer));
	}
	_destroyAllChildren() {
		this.removeHandles(v), this.children.destroyAll();
	}
	_compileChildren(t) {
		const e = this.listModeDisabled ? t : t?.filter((t) => u(t) !== P);
		t?.length ? (this._createChildren(e), this._destroyChildren(e), this._sortChildren(e), this._watchChildLayerListMode(t)) : this._destroyAllChildren();
	}
	_watchChildLayerListMode(t) {
		this.removeHandles(v), this.listModeDisabled || this.addHandles(t.toArray().map((e) => l$2(() => e.listMode, () => this._compileChildren(t))), v);
	}
	_watchSublayerChanges(t) {
		t && this.addHandles(t.on("change", () => this._compileChildren(t)), g);
	}
	_initializeChildLayers(t) {
		this._compileChildren(t), this._watchSublayerChanges(t);
	}
	_watchLayerProperties(t) {
		if (this.removeHandles(g), this.removeHandles(v), !t) return;
		t.load();
		if ("hide-children" === (!this.listModeDisabled && u(t))) return void this.children.destroyAll();
		const e = d(t);
		e && this.addHandles(l$2(() => t[e], (i) => {
			t.hasOwnProperty(e) && this._initializeChildLayers(i);
		}, h$1), g);
	}
};
__decorate([a({ type: S })], M.prototype, "actionsSections", void 0), __decorate([a()], M.prototype, "actionsOpen", void 0), __decorate([a()], M.prototype, "checkPublishStatusEnabled", void 0), __decorate([a({ type: q.ofType(M) })], M.prototype, "children", void 0), __decorate([a({ readOnly: !0 })], M.prototype, "error", null), __decorate([a()], M.prototype, "hidden", void 0), __decorate([a()], M.prototype, "layer", void 0), __decorate([a()], M.prototype, "listItemCreatedFunction", void 0), __decorate([a({ nonNullable: !0 })], M.prototype, "listModeDisabled", void 0), __decorate([a()], M.prototype, "open", void 0), __decorate([a({ type: l })], M.prototype, "panel", null), __decorate([m$1("panel")], M.prototype, "castPanel", null), __decorate([a()], M.prototype, "parent", void 0), __decorate([a({ readOnly: !0 })], M.prototype, "publishing", null), __decorate([a()], M.prototype, "sortable", void 0), __decorate([a()], M.prototype, "title", null), M = _ = __decorate([c$1("esri.widgets.TableList.ListItem")], M);
//#endregion
//#region node_modules/@arcgis/core/widgets/TableList/TableListViewModel.js
var m = {
	map: "map",
	layerListMode: "layer-list-mode"
}, n$1 = "hide", h = q.ofType(M);
var c = class extends l$1 {
	constructor(t) {
		super(t), this.checkPublishStatusEnabled = !1, this.listItemCreatedFunction = null, this.listModeDisabled = !1, this.tableItems = new h(), this.map = null;
	}
	initialize() {
		this.addHandles([l$2(() => [this.tables, this.map?.allTables.toArray()], () => this._compileList(), h$1), l$2(() => [
			this.map?.loaded,
			this.listItemCreatedFunction,
			this.checkPublishStatusEnabled,
			this.listModeDisabled
		], () => this._recompileList())], m.map);
	}
	destroy() {
		this._removeAllItems(), this.map = null, this.tables = null;
	}
	get tables() {
		return this.map?.allTables;
	}
	set tables(t) {
		this._overrideIfSome("tables", t);
	}
	get state() {
		const { map: t, tables: e } = this;
		if (!t) return e ? "ready" : "disabled";
		const s = t?.loadStatus;
		return "string" == typeof s ? "loaded" === s ? "ready" : "loading" === s ? "loading" : "disabled" : "ready";
	}
	get totalItems() {
		return this.tableItems.length;
	}
	triggerAction(t, e) {
		t && !t.disabled && this.emit("trigger-action", {
			action: t,
			item: e
		});
	}
	_removeAllItems() {
		this.tableItems.destroyAll();
	}
	_getViewableTables(t) {
		return t ? this.listModeDisabled ? t : t.filter((t) => u(t) !== n$1) : void 0;
	}
	_watchTablesListMode(t) {
		this.removeHandles(m.layerListMode), t && !this.listModeDisabled && this.addHandles(l$2(() => t.filter((t) => "listMode" in t).map((t) => t.listMode).toArray(), () => this._compileList()), m.layerListMode);
	}
	_compileList() {
		const { tables: t } = this;
		this._watchTablesListMode(t);
		const e = this._getViewableTables(t);
		e?.length ? (this._createNewItems(e), this._removeItems(e), this._sortItems(e)) : this._removeAllItems();
	}
	_createNewItems(t) {
		const { tableItems: e, listItemCreatedFunction: s, checkPublishStatusEnabled: i } = this;
		t.forEach((t) => {
			e.some((e) => e.layer === t) || e.add(new M({
				checkPublishStatusEnabled: i,
				layer: t,
				listItemCreatedFunction: s
			}));
		});
	}
	_removeItems(t) {
		const { tableItems: e } = this;
		e.forEach((s) => {
			if (!s) return;
			t?.find((t) => s.layer === t) || (e.remove(s), s.destroy());
		});
	}
	_sortItems(t) {
		const { tableItems: e } = this;
		e.sort((e, s) => {
			const i = t.indexOf(e.layer), l = t.indexOf(s.layer);
			return i > l ? -1 : i < l ? 1 : 0;
		});
	}
	_recompileList() {
		this._removeAllItems(), this._compileList();
	}
};
__decorate([a()], c.prototype, "checkPublishStatusEnabled", void 0), __decorate([a()], c.prototype, "listItemCreatedFunction", void 0), __decorate([a({ nonNullable: !0 })], c.prototype, "listModeDisabled", void 0), __decorate([a({
	type: h,
	readOnly: !0
})], c.prototype, "tableItems", void 0), __decorate([a()], c.prototype, "tables", null), __decorate([a()], c.prototype, "map", void 0), __decorate([a({ readOnly: !0 })], c.prototype, "state", null), __decorate([a()], c.prototype, "totalItems", null), c = __decorate([c$1("esri.widgets.TableList.TableListViewModel")], c);
//#endregion
//#region node_modules/@arcgis/core/widgets/TableList/TableListVisibleElements.js
var r = class extends b {
	constructor(o) {
		super(o), this.closeButton = !1, this.collapseButton = !1, this.errors = !1, this.filter = !1, this.flow = !0, this.heading = !1, this.statusIndicators = !0, this.temporaryTableIndicators = !1;
	}
};
__decorate([a({
	type: Boolean,
	nonNullable: !0
})], r.prototype, "closeButton", void 0), __decorate([a({
	type: Boolean,
	nonNullable: !0
})], r.prototype, "collapseButton", void 0), __decorate([a({
	type: Boolean,
	nonNullable: !0
})], r.prototype, "errors", void 0), __decorate([a({
	type: Boolean,
	nonNullable: !0
})], r.prototype, "filter", void 0), __decorate([a({
	type: Boolean,
	nonNullable: !0
})], r.prototype, "flow", void 0), __decorate([a({
	type: Boolean,
	nonNullable: !0
})], r.prototype, "heading", void 0), __decorate([a({
	type: Boolean,
	nonNullable: !0
})], r.prototype, "statusIndicators", void 0), __decorate([a({
	type: Boolean,
	nonNullable: !0
})], r.prototype, "temporaryTableIndicators", void 0), r = __decorate([c$1("esri.widgets.TableList.TableListVisibleElements")], r);
//#endregion
//#region node_modules/@arcgis/core/widgets/TableList/support/tableListUtils.js
function n(n) {
	return n["data-item"];
}
function t(n, t) {
	n?.sort((n, i) => {
		const e = t.indexOf(n.uid), r = t.indexOf(i.uid);
		return e > r ? -1 : e < r ? 1 : 0;
	});
}
//#endregion
//#region node_modules/@arcgis/core/widgets/TableList.js
var T = "nested", U = q.ofType(M);
var j = class extends o$2(O) {
	constructor(e, t$4) {
		super(e, t$4), this._rootListEl = null, this._focusRootFlowItem = !1, this._focusPanelFlowItem = !1, this._lastDragDetail = null, this._selectedDragItemLayerUid = null, this._rootGroupUid = `table-${this.uid}`, this.collapsed = !1, this.dragEnabled = !1, this.filterPlaceholder = "", this.filterPredicate = null, this.filterText = "", this.headingLevel = 2, this.listItemCanGiveFunction = null, this.listItemCanReceiveFunction = null, this.messages = null, this.messagesCommon = null, this.minDragEnabledItems = 2, this.minFilterItems = 10, this.selectedItems = new U(), this.selectionMode = "none", this.viewModel = new c(), this.visibleElements = new r(), this._canMove = ({ dragEl: e, fromEl: t, toEl: i }, o) => {
			const s = "pull" === o ? this.listItemCanGiveFunction : this.listItemCanReceiveFunction, l = n(e);
			if (!l?.sortable) return !1;
			const r = n(t), n$3 = q$1(t), a = n(i), d = q$1(i), c = !!n$3 && !!d && n$3 === d, m = {
				selected: l,
				from: r,
				to: a
			}, p = t.group, h = i.group;
			return p && h && "function" == typeof s ? s.call(null, m) : c;
		}, this._onCalciteListOrderChange = (e) => {
			const { _lastDragDetail: t$3 } = this, { toEl: i, fromEl: o, dragEl: s, newIndex: l } = e;
			if (!o || !i || t$3?.newIndex === l && t$3?.dragEl === s && t$3?.toEl === i && t$3?.fromEl === o) return;
			this._lastDragDetail = e, this._selectedDragItemLayerUid = s.value;
			const r = Array.from(o.children).filter((e) => e?.matches("calcite-list-item")).map((e) => e.value);
			t(this.map?.tables, r);
		}, this._onSelectedDragItemLayerUidChange = (e) => {
			this._selectedDragItemLayerUid = e;
		}, this._onTriggerAction = (e, t) => {
			this.triggerAction(e, t);
		}, this._onPanelOpen = () => {
			this._focusPanelFlowItem = !0;
		}, this.announceDeprecation = () => {
			r$1(n$2.getLogger(this), "Table List", "arcgis-table-list", { version: "5.0" });
		};
	}
	initialize() {
		this.addHandles([a$1(() => this.viewModel.tableItems, "change", () => s(this.selectedItems), h$1), l$2(() => [this.filterPredicate, this._rootListEl], () => f(this._rootListEl, this.filterPredicate))]);
	}
	loadDependencies() {
		return c$2({
			button: () => import("./calcite-button-NFLae_BI.js"),
			flow: () => import("./calcite-flow-6Tjw27s-.js"),
			"flow-item": () => import("./calcite-flow-item-me4GdYnB.js"),
			list: () => import("./calcite-list-Dfj1KW2E.js"),
			notice: () => import("./calcite-notice-BerHV0zg.js")
		});
	}
	get _dragEnabled() {
		return this.viewModel.totalItems >= this.minDragEnabledItems && this.dragEnabled;
	}
	get _filterEnabled() {
		return this.viewModel.totalItems >= this.minFilterItems && this.visibleElements.filter;
	}
	get _visibleItems() {
		return this.tableItems?.filter((e) => !e.hidden && (this.visibleElements.errors || !e.error));
	}
	get _openedPanelItems() {
		return this._visibleItems.filter(({ hidden: e, panel: t }) => !e && t?.open && !t.disabled && t.flowEnabled);
	}
	get icon() {
		return "table";
	}
	set icon(e) {
		this._overrideIfSome("icon", e);
	}
	get label() {
		return this.messages?.widgetLabel ?? "";
	}
	set label(e) {
		this._overrideIfSome("label", e);
	}
	get listItemCreatedFunction() {
		return this.viewModel.listItemCreatedFunction;
	}
	set listItemCreatedFunction(e) {
		this.viewModel.listItemCreatedFunction = e;
	}
	get map() {
		return this.viewModel.map;
	}
	set map(e) {
		this.viewModel.map = e;
	}
	get tableItems() {
		return this.viewModel.tableItems;
	}
	get tables() {
		return this.viewModel.tables;
	}
	set tables(e) {
		this.viewModel.tables = e;
	}
	triggerAction(e, t) {
		return this.viewModel.triggerAction(e, t);
	}
	render() {
		const e$1 = this.viewModel?.state, t = {
			[e.hidden]: "loading" === e$1,
			[e.disabled]: "disabled" === e$1
		};
		return x("div", { class: this.classes(o.base, e.widget, e.panel, t) }, this._renderItems());
	}
	_renderNoItemsMessage() {
		return x("div", { slot: "message" }, this.messages.noItemsToDisplay);
	}
	_renderNoItems() {
		return x("div", {
			class: o.itemMessage,
			key: "esri-layer-list__no-items"
		}, x("calcite-notice", {
			icon: "information",
			kind: "info",
			open: !0,
			width: "full"
		}, this._renderNoItemsMessage()));
	}
	_renderPanelFlowItems() {
		const { _openedPanelItems: e } = this;
		return e.toArray().map(({ title: t, panel: i }, o) => {
			const s = () => this._handlePanelFlowItemBack(i);
			return x("calcite-flow-item", {
				afterCreate: this._focusPanelFlowItemNode,
				afterUpdate: this._focusPanelFlowItemNode,
				bind: this,
				description: t,
				heading: i.title,
				headingLevel: this.headingLevel,
				key: `flow-panel-${i.uid}`,
				selected: o === e.length - 1,
				onCalciteFlowItemBack: (e) => {
					e.preventDefault(), s();
				}
			}, i.render(), x("calcite-button", {
				appearance: "transparent",
				onclick: s,
				slot: "footer-start",
				width: "full"
			}, this.messagesCommon.back));
		});
	}
	_handlePanelFlowItemBack(e) {
		e.open = !1, this._focusRootFlowItem = !0;
	}
	_focusRootFlowItemNode(e) {
		this._focusRootFlowItem && (this._focusRootFlowItem = !1, w$1(e));
	}
	_focusPanelFlowItemNode(e) {
		this._focusPanelFlowItem && (this._focusPanelFlowItem = !1, w$1(e));
	}
	_renderItems() {
		const { visible: e, collapsed: t, visibleElements: { closeButton: i, collapseButton: o$3, heading: s, flow: l }, _dragEnabled: r, _visibleItems: n, _filterEnabled: a, _rootGroupUid: d, _openedPanelItems: c, selectionMode: m, messages: p, filterPlaceholder: h, filterText: u } = this, g = [x("calcite-flow-item", {
			afterCreate: this._focusRootFlowItemNode,
			afterUpdate: this._focusRootFlowItemNode,
			bind: this,
			closable: i,
			closed: !e,
			collapsed: t,
			collapsible: o$3,
			heading: s ? p.widgetLabel : void 0,
			headingLevel: this.headingLevel,
			key: "root-flow-item",
			selected: !c.length,
			onCalciteFlowItemClose: () => this.visible = !1
		}, n?.length ? null : this._renderNoItems(), x("calcite-list", {
			afterCreate: (e) => {
				this._rootListEl = e;
			},
			afterRemoved: () => {
				this._rootListEl = null;
			},
			canPull: (e) => this._canMove(e, "pull"),
			canPut: (e) => this._canMove(e, "put"),
			"data-layer-type": d,
			displayMode: T,
			dragEnabled: r,
			filterEnabled: a,
			filterPlaceholder: h,
			filterProps: t$2,
			filterText: a ? u : "",
			group: d,
			key: "root-list",
			label: p.widgetLabel,
			selectionAppearance: "border",
			selectionMode: m,
			onCalciteListChange: (e) => this._handleCalciteListChange(e),
			onCalciteListDragEnd: (e) => this._handleCalciteListDragEnd(e.detail),
			onCalciteListFilter: (e) => this.filterText = e.currentTarget?.filterText ?? "",
			onCalciteListOrderChange: (e) => this._onCalciteListOrderChange(e.detail)
		}, n.toArray().map((e) => this._renderItem(e)), a ? x("div", {
			class: o.filterNoResults,
			slot: "filter-no-results"
		}, x("calcite-notice", {
			kind: "info",
			open: !0,
			width: "full"
		}, this._renderNoItemsMessage())) : null)), this._renderPanelFlowItems()];
		return e ? l ? x("calcite-flow", { key: "root-flow" }, g) : g : null;
	}
	_handleCalciteListDragEnd(e) {
		const { fromEl: t, dragEl: i, oldIndex: o } = e;
		t.insertBefore(i, t.children[o]);
	}
	_renderItem(e) {
		return x(C, {
			canMove: this._canMove,
			css: o,
			displayMode: T,
			dragEnabled: this.dragEnabled,
			item: e,
			key: `layerListItem-${e.layer.uid}`,
			listModeDisabled: this.viewModel.listModeDisabled,
			messages: this.messages,
			messagesCommon: this.messagesCommon,
			rootGroupUid: this._rootGroupUid,
			selectedDragItemLayerUid: this._selectedDragItemLayerUid,
			selectedItems: this.selectedItems,
			selectionMode: this.selectionMode,
			visibleElements: this.visibleElements,
			onAction: this._onTriggerAction,
			onPanelOpen: this._onPanelOpen,
			onSelectedDragItemLayerUidChange: this._onSelectedDragItemLayerUidChange
		});
	}
	_handleCalciteListChange(e) {
		const { selectionMode: t, selectedItems: i } = this;
		if ("none" === t) return;
		const o = e.target.selectedItems.map((e) => n(e)).filter(Boolean);
		i.removeAll(), i.addMany(o);
	}
};
__decorate([a()], j.prototype, "_rootListEl", void 0), __decorate([a()], j.prototype, "_focusRootFlowItem", void 0), __decorate([a()], j.prototype, "_focusPanelFlowItem", void 0), __decorate([a()], j.prototype, "_dragEnabled", null), __decorate([a()], j.prototype, "_filterEnabled", null), __decorate([a()], j.prototype, "_visibleItems", null), __decorate([a()], j.prototype, "_openedPanelItems", null), __decorate([a()], j.prototype, "collapsed", void 0), __decorate([a()], j.prototype, "dragEnabled", void 0), __decorate([a()], j.prototype, "filterPlaceholder", void 0), __decorate([a()], j.prototype, "filterPredicate", void 0), __decorate([a()], j.prototype, "filterText", void 0), __decorate([a()], j.prototype, "headingLevel", void 0), __decorate([a()], j.prototype, "icon", null), __decorate([a()], j.prototype, "label", null), __decorate([a()], j.prototype, "listItemCanGiveFunction", void 0), __decorate([a()], j.prototype, "listItemCanReceiveFunction", void 0), __decorate([a()], j.prototype, "listItemCreatedFunction", null), __decorate([a()], j.prototype, "map", null), __decorate([a(), v$1("esri/widgets/TableList/t9n/TableList")], j.prototype, "messages", void 0), __decorate([a(), v$1("esri/t9n/common")], j.prototype, "messagesCommon", void 0), __decorate([a()], j.prototype, "minDragEnabledItems", void 0), __decorate([a()], j.prototype, "minFilterItems", void 0), __decorate([a({ type: U })], j.prototype, "selectedItems", void 0), __decorate([a()], j.prototype, "selectionMode", void 0), __decorate([a({ readOnly: !0 })], j.prototype, "tableItems", null), __decorate([a()], j.prototype, "tables", null), __decorate([m$2("trigger-action"), a({ type: c })], j.prototype, "viewModel", void 0), __decorate([a({
	type: r,
	nonNullable: !0
})], j.prototype, "visibleElements", void 0), j = __decorate([c$1("esri.widgets.TableList")], j);
var k = j;
//#endregion
export { k as default };

//# sourceMappingURL=TableList-BlAXKxeA.js.map