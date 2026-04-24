import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { h as r$1, n as n$1 } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import { t as b } from "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import { n as l } from "./Evented-GLJbxWO5.js";
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
import { a as h$1, r as a$1, s as l$1 } from "./reactiveUtils-DRpp6Nmg.js";
import { t as o } from "./Identifiable-D2tBaz7a.js";
import "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./catalogUtils-lRNSLCIB.js";
import "./uuid-CI605U6Y.js";
import "./ActionToggle-JH4srUd2.js";
import "./number-DwLpDjta.js";
import "./intl-1FbLkipu.js";
import "./sanitizerUtils-D4_LRYnp.js";
import { n as c$1, t as O } from "./Widget-D7J6FR9J.js";
import { a as m$1, c as x, p as w, s as v } from "./widget-BsQfm1ik.js";
import { t as e$1 } from "./globalCss-Dvrz6ByO.js";
import "./projector-76ZJJlBX.js";
import { t as e$2 } from "./ReactiveMap-B1BORGbU.js";
import "./runtime-C8rHe43j.js";
import "./actionUtils-Cy0Gr9_I.js";
import { f as s, n as C, p as u, r as N, s as f, t as t$1 } from "./listUtils-D7SjyOSp.js";
import { t as I } from "./ListItem-BRO6GY-q.js";
//#region node_modules/@arcgis/core/widgets/CatalogLayerList/CatalogLayerListViewModel.js
var n = { layerListMode: "layer-list-mode" }, m = "hide", h = q.ofType(I);
var y = class extends l {
	constructor(t) {
		super(t), this.catalogItems = new h(), this.checkPublishStatusEnabled = !1, this.catalogLayer = null, this.listItemCreatedFunction = null, this.listModeDisabled = !1, this.view = null;
	}
	initialize() {
		this.addHandles([
			l$1(() => [this.catalogLayer?.loaded, this.view?.ready], () => this._compileList(), h$1),
			a$1(() => this.catalogLayer?.dynamicGroupLayer.layers, "change", () => this._compileList()),
			l$1(() => [
				this.listItemCreatedFunction,
				this.checkPublishStatusEnabled,
				this.listModeDisabled
			], () => this._recompileList())
		]);
	}
	destroy() {
		this.view = null, this._removeAllItems();
	}
	get state() {
		const { view: t, catalogLayer: e } = this;
		return t?.ready && e?.loaded ? "ready" : t && e ? "loading" : "disabled";
	}
	get totalItems() {
		return this.catalogItems.flatten((t) => t.children).length;
	}
	triggerAction(t, e) {
		t && !t.disabled && this.emit("trigger-action", {
			action: t,
			item: e
		});
	}
	_createListItem(t) {
		const { view: e, listItemCreatedFunction: s, checkPublishStatusEnabled: i, listModeDisabled: o } = this;
		return new I({
			checkPublishStatusEnabled: i,
			listModeDisabled: o,
			layer: t,
			listItemCreatedFunction: s,
			view: e
		});
	}
	_removeAllItems() {
		this.catalogItems.destroyAll();
	}
	_getViewableLayers(t) {
		return t ? this.listModeDisabled ? t : t.filter((t) => u(t) !== m) : void 0;
	}
	_watchLayersListMode(t) {
		this.removeHandles(n.layerListMode), t && !this.listModeDisabled && this.addHandles(l$1(() => t.filter((t) => "listMode" in t).map((t) => t.listMode).toArray(), () => this._compileList()), n.layerListMode);
	}
	_compileList() {
		const { catalogLayer: t } = this;
		if (!t?.loaded) return;
		const e = t?.dynamicGroupLayer.layers;
		this._watchLayersListMode(e);
		const s = this._getViewableLayers(e);
		s?.length ? (this._createNewItems(s), this._removeItems(s), this._sortItems(s)) : this._removeAllItems();
	}
	_createNewItems(t) {
		const { catalogItems: e } = this;
		t.forEach((t) => {
			e.some((e) => e.layer === t) || e.add(this._createListItem(t));
		});
	}
	_removeItems(t) {
		const { catalogItems: e } = this, s = [];
		e.forEach((e) => {
			e && t?.includes(e.layer) || s.push(e);
		}), e.destroyMany(s);
	}
	_sortItems(t) {
		const { catalogItems: e } = this;
		e.sort((e, s) => {
			const i = t.indexOf(e.layer), o = t.indexOf(s.layer);
			return i > o ? -1 : i < o ? 1 : 0;
		});
	}
	_recompileList() {
		this._removeAllItems(), this._compileList();
	}
};
__decorate([a({ type: h })], y.prototype, "catalogItems", void 0), __decorate([a()], y.prototype, "checkPublishStatusEnabled", void 0), __decorate([a()], y.prototype, "catalogLayer", void 0), __decorate([a()], y.prototype, "listItemCreatedFunction", void 0), __decorate([a({ nonNullable: !0 })], y.prototype, "listModeDisabled", void 0), __decorate([a({ readOnly: !0 })], y.prototype, "state", null), __decorate([a()], y.prototype, "totalItems", null), __decorate([a()], y.prototype, "view", void 0), y = __decorate([c("esri.widgets.CatalogLayerList.CatalogLayerListViewModel")], y);
//#endregion
//#region node_modules/@arcgis/core/widgets/CatalogLayerList/CatalogLayerListVisibleElements.js
var r = class extends b {
	constructor(o) {
		super(o), this.closeButton = !1, this.collapseButton = !1, this.errors = !1, this.filter = !1, this.flow = !0, this.heading = !1, this.statusIndicators = !0, this.temporaryLayerIndicators = !1;
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
})], r.prototype, "temporaryLayerIndicators", void 0), r = __decorate([c("esri.widgets.CatalogLayerList.CatalogLayerListVisibleElements")], r);
//#endregion
//#region node_modules/@arcgis/core/widgets/CatalogLayerList/css.js
var t = "esri-catalog-layer-list", i = `${t}__item`, e = {
	base: t,
	actionMenu: `${t}__action-menu`,
	actionGroup: `${t}__action-group`,
	filterNoResults: `${t}__filter-no-results`,
	item: i,
	itemActive: `${i}--active`,
	itemContentBottom: `${i}-content-bottom`,
	itemMessage: `${i}-message`,
	itemActionIcon: `${i}-action-icon`,
	itemActionImage: `${i}-action-image`,
	itemTemporaryIcon: `${i}-temporary-icon`,
	itemTableIcon: `${i}-table-icon`,
	statusIndicator: `${t}__status-indicator`,
	publishing: `${t}__publishing`,
	updating: `${t}__updating`,
	connectionStatus: `${t}__connection-status`,
	connectionStatusConnected: `${t}__connection-status--connected`,
	visibleToggle: `${t}__visible-toggle`,
	visibleIcon: `${t}__visible-icon`
};
//#endregion
//#region node_modules/@arcgis/core/widgets/CatalogLayerList.js
var T;
var P = q.ofType(I), A = "nested";
var E = T = class extends o(O) {
	constructor(e$5, i) {
		super(e$5, i), this._rootListEl = null, this._activeItem = null, this._tooltipReferenceMap = new e$2(), this._focusRootFlowItem = !1, this._focusPanelFlowItem = !1, this._focusLayerFlowItem = null, this._layerListMap = new e$2(), this._rootGroupUid = `operational-${this.uid}`, this._openedLayersController = null, this.catalogLayerList = null, this.catalogOptions = null, this.collapsed = !1, this.filterPlaceholder = "", this.filterPredicate = null, this.filterText = "", this.headingLevel = 2, this.knowledgeGraphOptions = null, this.layerTablesEnabled = new q(["knowledge-graph"]), this.mapImageOptions = null, this.messages = null, this.messagesCommon = null, this.minFilterItems = 10, this.openedLayers = new q(), this.openedLayerLists = new q(), this.selectedItems = new P(), this.selectionMode = "none", this.tableList = null, this.tileOptions = null, this.viewModel = new y(), this.visibilityAppearance = "default", this.visibleElements = new r(), this._onTablesOpen = (e) => {
			this.onTablesOpen ? this.onTablesOpen(e) : (this.openedLayers.push(e.layer), this._focusLayerFlowItem = e.layer?.uid);
		}, this._onCatalogOpen = (e) => {
			this.onCatalogOpen ? this.onCatalogOpen(e) : (this.openedLayers.push(e.layer?.parent), this._focusLayerFlowItem = e.layer?.uid);
		}, this._onPanelOpen = () => {
			this._focusPanelFlowItem = !0;
		}, this._onTooltipReferenceChange = (e, t) => {
			t ? this._tooltipReferenceMap.set(e, t) : this._tooltipReferenceMap.delete(e);
		}, this._onTriggerAction = (e, t) => {
			this.triggerAction(e, t);
		}, this._clearActiveItem = () => {
			this._activeItem = null;
		}, this._setActiveItem = (e$4) => {
			if ("default" !== this.visibilityAppearance) return;
			this._activeItem = N(Array.from(e$4.composedPath()).find((e$3) => e$3.classList?.contains(e.item)));
		}, this.announceDeprecation = () => {
			r$1(n$1.getLogger(this), "Catalog Layer List", "arcgis-catalog-layer-list", { version: "5.0" });
		};
	}
	initialize() {
		this.addHandles([
			a$1(() => this.openedLayers, "change", () => this._handleOpenedLayersChange(), h$1),
			a$1(() => this.viewModel.catalogItems, "change", () => s(this.selectedItems), h$1),
			l$1(() => [this.filterPredicate, this._rootListEl], () => f(this._rootListEl, this.filterPredicate))
		]);
	}
	loadDependencies() {
		return c$1({
			button: () => import("./calcite-button-NFLae_BI.js"),
			flow: () => import("./calcite-flow-6Tjw27s-.js"),
			"flow-item": () => import("./calcite-flow-item-me4GdYnB.js"),
			list: () => import("./calcite-list-Dfj1KW2E.js"),
			notice: () => import("./calcite-notice-BerHV0zg.js"),
			tooltip: () => import("./calcite-tooltip-fZdVPV_E.js")
		});
	}
	destroy() {
		this._destroyOpenedLayerLists(), this._tooltipReferenceMap.clear();
	}
	get _filterEnabled() {
		return this.viewModel.totalItems >= this.minFilterItems && this.visibleElements.filter;
	}
	get _visibleItems() {
		return this.catalogItems?.filter((e) => !e.hidden && (this.visibleElements.errors || !e.error));
	}
	get _openedPanelItems() {
		return this._visibleItems.flatten((e) => e.children).filter(({ hidden: e, panel: t }) => !e && t?.open && !t.disabled && t.flowEnabled);
	}
	get _renderedOpenLayerFlowItems() {
		const { openedLayers: e } = this;
		return e.toArray().map((t, o) => this._renderLayerFlowItem(t, o === e.length - 1));
	}
	get catalogItems() {
		return this.viewModel.catalogItems;
	}
	set catalogItems(e) {
		this.viewModel.catalogItems = e;
	}
	get catalogLayer() {
		return this.viewModel.catalogLayer;
	}
	set catalogLayer(e) {
		this.viewModel.catalogLayer = e;
	}
	get icon() {
		return "catalog-dataset";
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
	get view() {
		return this.viewModel.view;
	}
	set view(e) {
		this.viewModel.view = e;
	}
	triggerAction(e, t) {
		return this.viewModel.triggerAction(e, t);
	}
	render() {
		const e$6 = this.viewModel?.state, t = {
			[e$1.hidden]: "loading" === e$6,
			[e$1.disabled]: "disabled" === e$6
		};
		return x("div", { class: this.classes(e.base, e$1.widget, e$1.panel, t) }, this._renderItemTooltips(), this._renderItems());
	}
	async _createFlowList(e, t) {
		const { _layerListMap: o } = this, i = o.get(e);
		if (i) return i;
		const s = "catalog" === e.type ? this._createCatalogLayerList(e) : await this._createTableList(e);
		return t.aborted || o.set(e, s), s;
	}
	async _handleOpenedLayersChange() {
		const { _layerListMap: e, openedLayers: t, openedLayerLists: o } = this;
		this._openedLayersController?.abort();
		const i = new AbortController(), { signal: s } = i;
		this._openedLayersController = i, e.forEach((o, i) => {
			t.includes(i) || (o.destroy(), e.delete(i));
		});
		const l = await Promise.all(t.map((e) => this._createFlowList(e, s)));
		if (s.aborted) return;
		o.removeAll(), o.addMany(l);
		const a = o.at(-1);
		a ? "catalogLayer" in a ? (this._set("catalogLayerList", a), this._set("tableList", null)) : (this._set("catalogLayerList", null), this._set("tableList", a)) : (this._set("catalogLayerList", null), this._set("tableList", null));
	}
	_destroyOpenedLayerLists() {
		this.openedLayerLists.destroyAll(), this.openedLayers.removeAll(), this._layerListMap.forEach((e) => e.destroy()), this._layerListMap.clear();
	}
	_renderItemTooltip(e) {
		const { _tooltipReferenceMap: t, messages: o } = this;
		return e?.layer ? x("calcite-tooltip", {
			key: `tooltip-${e.layer.uid}`,
			overlayPositioning: "fixed",
			referenceElement: t.get(e.layer.uid),
			topLayerDisabled: this.topLayerDisabled
		}, o.layerIncompatibleTooltip) : null;
	}
	_renderItemTooltipNodes(e) {
		return e.incompatible ? this._renderItemTooltip(e) : e.children?.filter((e) => !e.hidden).toArray().map((e) => this._renderItemTooltipNodes(e));
	}
	_renderItemTooltips() {
		return this._visibleItems?.toArray().map((e) => this._renderItemTooltipNodes(e));
	}
	_renderNoItemsMessage() {
		return x("div", { slot: "message" }, this.messages.noItemsToDisplay);
	}
	_renderNoItems() {
		return x("div", {
			class: e.itemMessage,
			key: "esri-layer-list__no-items"
		}, x("calcite-notice", {
			icon: "information",
			kind: "info",
			open: !0,
			width: "full"
		}, this._renderNoItemsMessage()));
	}
	_renderPanelFlowItems() {
		const { _openedPanelItems: e, openedLayers: t } = this;
		return e.toArray().map(({ title: o, panel: i }, s) => {
			const l = () => this._handlePanelFlowItemBack(i);
			return x("calcite-flow-item", {
				afterCreate: this._focusPanelFlowItemNode,
				afterUpdate: this._focusPanelFlowItemNode,
				bind: this,
				description: o,
				heading: i.title,
				headingLevel: this.headingLevel,
				key: `flow-panel-${i.uid}`,
				selected: !t.length && s === e.length - 1,
				onCalciteFlowItemBack: (e) => {
					e.preventDefault(), l();
				}
			}, i.render(), x("calcite-button", {
				appearance: "transparent",
				onclick: l,
				slot: "footer-start",
				width: "full"
			}, this.messagesCommon.back));
		});
	}
	_handlePanelFlowItemBack(e) {
		e.open = !1, this._focusRootFlowItem = !0;
	}
	_focusRootFlowItemNode(e) {
		this._focusRootFlowItem && (this._focusRootFlowItem = !1, w(e));
	}
	_focusPanelFlowItemNode(e) {
		this._focusPanelFlowItem && (this._focusPanelFlowItem = !1, w(e));
	}
	_renderItems() {
		const { visible: e$7, collapsed: t, _visibleItems: o, _filterEnabled: i, _rootGroupUid: s, visibleElements: { closeButton: l, collapseButton: a, heading: r, flow: n }, selectionMode: p, filterText: d, filterPlaceholder: c, messages: m, openedLayers: h, _openedPanelItems: u } = this, g = [
			x("calcite-flow-item", {
				afterCreate: this._focusRootFlowItemNode,
				afterUpdate: this._focusRootFlowItemNode,
				bind: this,
				closable: l,
				closed: !e$7,
				collapsed: t,
				collapsible: a,
				heading: r ? m.widgetLabel : void 0,
				headingLevel: this.headingLevel,
				key: "root-flow-item",
				selected: !h.length && !u.length,
				onCalciteFlowItemClose: () => this.visible = !1
			}, o?.length ? null : this._renderNoItems(), x("calcite-list", {
				afterCreate: (e) => {
					this._rootListEl = e, e.addEventListener("focusin", this._setActiveItem), e.addEventListener("focusout", this._clearActiveItem);
				},
				afterRemoved: (e) => {
					this._rootListEl = null, e.removeEventListener("focusin", this._setActiveItem), e.removeEventListener("focusout", this._clearActiveItem);
				},
				"data-layer-type": s,
				displayMode: A,
				filterEnabled: i,
				filterPlaceholder: c,
				filterProps: t$1,
				filterText: i ? d : "",
				group: s,
				key: "root-list",
				label: m.widgetLabel,
				onmouseleave: this._clearActiveItem,
				onmouseover: this._setActiveItem,
				selectionAppearance: "border",
				selectionMode: p,
				onCalciteListChange: (e) => this._handleCalciteListChange(e),
				onCalciteListFilter: (e) => this.filterText = e.currentTarget?.filterText ?? ""
			}, o.toArray().map((e) => this._renderItem(e)), i ? x("div", {
				class: e.filterNoResults,
				slot: "filter-no-results"
			}, x("calcite-notice", {
				kind: "info",
				open: !0,
				width: "full"
			}, this._renderNoItemsMessage())) : null)),
			this._renderPanelFlowItems(),
			this._renderedOpenLayerFlowItems
		];
		return e$7 ? n ? x("calcite-flow", { key: "root-flow" }, g) : g : null;
	}
	_focusLayerFlowItemNode(e) {
		this._focusLayerFlowItem === e.dataset.layerUid && (this._focusLayerFlowItem = null, w(e));
	}
	_renderLayerFlowItem(e, t) {
		const { messages: o, openedLayers: i } = this, s = e.title || this.messages.untitledLayer;
		return x("calcite-flow-item", {
			afterCreate: this._focusLayerFlowItemNode,
			afterUpdate: this._focusLayerFlowItemNode,
			bind: this,
			"data-layer-uid": e.uid,
			description: s,
			heading: o["catalog" === e.type ? "catalogLayers" : "tables"],
			headingLevel: this.headingLevel,
			key: `flow-layer-list-${e.uid}`,
			selected: t,
			onCalciteFlowItemBack: (e) => {
				e.preventDefault(), i.pop();
				const t = i.at(-1);
				t ? this._focusLayerFlowItem = t.uid : this._focusRootFlowItem = !0;
			}
		}, this._layerListMap.get(e)?.render());
	}
	_createCatalogLayerList(e) {
		const { headingLevel: t, catalogOptions: o, view: i, filterPlaceholder: s, listItemCreatedFunction: l, minFilterItems: a, selectionMode: r, visibilityAppearance: n, onCatalogOpen: p, onTablesOpen: d } = this;
		return new T({
			headingLevel: t,
			view: i,
			filterPlaceholder: s,
			listItemCreatedFunction: l,
			minFilterItems: a,
			selectionMode: r,
			visibilityAppearance: n,
			...o,
			catalogLayer: e,
			onCatalogOpen: p,
			onTablesOpen: d
		});
	}
	_getTableListParams(e) {
		switch (e.type) {
			case "knowledge-graph": return {
				...this.knowledgeGraphOptions,
				tables: e.tables
			};
			case "map-image": return {
				...this.mapImageOptions,
				tables: e.subtables
			};
			case "tile": return {
				...this.tileOptions,
				tables: e.subtables
			};
			default: return null;
		}
	}
	async _createTableList(e) {
		const { default: t } = await import("./TableList-BlAXKxeA.js"), { headingLevel: o, selectionMode: i } = this;
		return new t({
			headingLevel: o,
			selectionMode: i,
			...this._getTableListParams(e)
		});
	}
	_renderItem(e$8, t, o) {
		return x(C, {
			activeItem: this._activeItem,
			css: e,
			displayMode: A,
			dragEnabled: !1,
			item: e$8,
			key: `layerListItem-${e$8.layer?.uid}`,
			layerTablesEnabled: this.layerTablesEnabled,
			listModeDisabled: this.viewModel.listModeDisabled,
			messages: this.messages,
			messagesCommon: this.messagesCommon,
			parent: t,
			parentTitles: o,
			rootGroupUid: this._rootGroupUid,
			selectedItems: this.selectedItems,
			selectionMode: this.selectionMode,
			visibilityAppearance: this.visibilityAppearance,
			visibleElements: this.visibleElements,
			onAction: this._onTriggerAction,
			onCatalogOpen: this._onCatalogOpen,
			onPanelOpen: this._onPanelOpen,
			onTablesOpen: this._onTablesOpen,
			onTooltipReferenceChange: this._onTooltipReferenceChange
		});
	}
	_handleCalciteListChange(e) {
		const { selectionMode: t, selectedItems: o } = this;
		if ("none" === t) return;
		const i = e.target.selectedItems.map((e) => N(e)).filter(Boolean);
		o.removeAll(), o.addMany(i);
	}
};
__decorate([a()], E.prototype, "_rootListEl", void 0), __decorate([a()], E.prototype, "_activeItem", void 0), __decorate([a()], E.prototype, "_tooltipReferenceMap", void 0), __decorate([a()], E.prototype, "_focusRootFlowItem", void 0), __decorate([a()], E.prototype, "_focusPanelFlowItem", void 0), __decorate([a()], E.prototype, "_focusLayerFlowItem", void 0), __decorate([a()], E.prototype, "_layerListMap", void 0), __decorate([a()], E.prototype, "_filterEnabled", null), __decorate([a()], E.prototype, "_visibleItems", null), __decorate([a()], E.prototype, "_openedPanelItems", null), __decorate([a()], E.prototype, "_renderedOpenLayerFlowItems", null), __decorate([a()], E.prototype, "catalogItems", null), __decorate([a()], E.prototype, "catalogLayer", null), __decorate([a({ readOnly: !0 })], E.prototype, "catalogLayerList", void 0), __decorate([a()], E.prototype, "catalogOptions", void 0), __decorate([a()], E.prototype, "collapsed", void 0), __decorate([a()], E.prototype, "filterPlaceholder", void 0), __decorate([a()], E.prototype, "filterPredicate", void 0), __decorate([a()], E.prototype, "filterText", void 0), __decorate([a()], E.prototype, "headingLevel", void 0), __decorate([a()], E.prototype, "icon", null), __decorate([a()], E.prototype, "knowledgeGraphOptions", void 0), __decorate([a()], E.prototype, "label", null), __decorate([a()], E.prototype, "layerTablesEnabled", void 0), __decorate([a()], E.prototype, "listItemCreatedFunction", null), __decorate([a()], E.prototype, "mapImageOptions", void 0), __decorate([a(), v("esri/widgets/CatalogLayerList/t9n/CatalogLayerList")], E.prototype, "messages", void 0), __decorate([a(), v("esri/t9n/common")], E.prototype, "messagesCommon", void 0), __decorate([a()], E.prototype, "minFilterItems", void 0), __decorate([a({ readOnly: !0 })], E.prototype, "openedLayers", void 0), __decorate([a({ readOnly: !0 })], E.prototype, "openedLayerLists", void 0), __decorate([a()], E.prototype, "onCatalogOpen", void 0), __decorate([a()], E.prototype, "onTablesOpen", void 0), __decorate([a({ type: P })], E.prototype, "selectedItems", void 0), __decorate([a()], E.prototype, "selectionMode", void 0), __decorate([a({ readOnly: !0 })], E.prototype, "tableList", void 0), __decorate([a()], E.prototype, "tileOptions", void 0), __decorate([a()], E.prototype, "view", null), __decorate([m$1("trigger-action"), a({ type: y })], E.prototype, "viewModel", void 0), __decorate([a()], E.prototype, "visibilityAppearance", void 0), __decorate([a({
	type: r,
	nonNullable: !0
})], E.prototype, "visibleElements", void 0), E = T = __decorate([c("esri.widgets.CatalogLayerList")], E);
var k = E;
//#endregion
export { k as default };

//# sourceMappingURL=CatalogLayerList-BIHfeSBT.js.map