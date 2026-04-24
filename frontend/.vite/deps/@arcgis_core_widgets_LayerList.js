import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { h as r$1, n } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c$1, t as a } from "./decorators-DE7S5xmd.js";
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
import { a as h, r as a$1, s as l$1 } from "./reactiveUtils-DRpp6Nmg.js";
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
import { n as c$2, t as O } from "./Widget-D7J6FR9J.js";
import { a as m$1, c as x, p as w, s as v$1 } from "./widget-BsQfm1ik.js";
import { t as e$1 } from "./globalCss-Dvrz6ByO.js";
import "./projector-76ZJJlBX.js";
import { t as e$2 } from "./ReactiveMap-B1BORGbU.js";
import "./runtime-C8rHe43j.js";
import "./actionUtils-Cy0Gr9_I.js";
import { c as h$1, d as q$1, f as s$1, l as m$2, m as v$2, n as C, p as u, r as N, s as f, t as t$1 } from "./listUtils-D7SjyOSp.js";
import { t as e$3 } from "./utils-br6xDzeb.js";
import { t as I } from "./ListItem-BRO6GY-q.js";
//#region node_modules/@arcgis/core/widgets/LayerList/css.js
var t = "esri-layer-list", i = `${t}__item`, e = {
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
	itemCatalogIcon: `${i}-catalog-icon`,
	statusIndicator: `${t}__status-indicator`,
	publishing: `${t}__publishing`,
	updating: `${t}__updating`,
	connectionStatus: `${t}__connection-status`,
	connectionStatusConnected: `${t}__connection-status--connected`,
	visibleToggle: `${t}__visible-toggle`,
	visibleIcon: `${t}__visible-icon`
};
//#endregion
//#region node_modules/@arcgis/core/widgets/LayerList/LayerListViewModel.js
var m = {
	view: "view",
	viewLayers: "view-layers",
	mapLayers: "map-layers",
	layerViews: "layer-views",
	layerListMode: "layer-list-mode"
}, c = "hide", p = q.ofType(I);
var y = class extends l {
	constructor(e) {
		super(e), this.checkPublishStatusEnabled = !1, this.listItemCreatedFunction = null, this.listModeDisabled = !1, this.operationalItems = new p(), this.view = null;
	}
	initialize() {
		this.addHandles([
			l$1(() => !0 === this.view?.ready, () => this._viewHandles(), h),
			l$1(() => [
				this.listItemCreatedFunction,
				this.checkPublishStatusEnabled,
				this.listModeDisabled
			], () => this._recompileList()),
			l$1(() => e$3(this.view) ? this.view.inGeographicLayout : null, () => this._compileList())
		], m.view);
	}
	destroy() {
		this._removeAllItems(), this.view = null;
	}
	get state() {
		const { view: e } = this;
		return e?.ready ? "ready" : e ? "loading" : "disabled";
	}
	get totalItems() {
		return this.operationalItems.flatten((e) => e.children).length;
	}
	triggerAction(e, t) {
		e && !e.disabled && this.emit("trigger-action", {
			action: e,
			item: t
		});
	}
	moveListItem(e, t, s, i) {
		const a = e?.layer;
		if (!a || "subtype-sublayer" === a.type || "sublayer" === a.type) return;
		const r = this.view?.map?.layers, l = t ? m$2(t) : r, o = s ? m$2(s) : r;
		if (!l || !o) return;
		const { operationalItems: n } = this, h = t?.children || n, m = s?.children || n, c = o.length - i;
		e.parent = s || null, h.remove(e), l.remove(a), m.includes(e) || m.add(e, c), o.includes(a) || o.add(a, c), this._compileList();
	}
	_createLayerViewHandles(e) {
		this.removeHandles(m.layerViews), this._compileList(), e && this.addHandles(e.on("change", () => this._compileList()), m.layerViews);
	}
	_createMapLayerHandles(e) {
		this.removeHandles(m.mapLayers), this._compileList(), e && this.addHandles(e.on("change", () => this._compileList()), m.mapLayers);
	}
	_createListItem(e) {
		const { view: t, listItemCreatedFunction: s, checkPublishStatusEnabled: i, listModeDisabled: a } = this;
		return new I({
			checkPublishStatusEnabled: i,
			listModeDisabled: a,
			layer: e,
			listItemCreatedFunction: s,
			view: t
		});
	}
	_removeAllItems() {
		this.operationalItems.destroyAll();
	}
	_getViewableLayers(e) {
		return e ? this.listModeDisabled ? e : e.filter((e) => u(e) !== c) : void 0;
	}
	_watchLayersListMode(e) {
		this.removeHandles(m.layerListMode), e && !this.listModeDisabled && this.addHandles(l$1(() => e.filter((e) => "listMode" in e).map((e) => e.listMode).toArray(), () => this._compileList()), m.layerListMode);
	}
	_compileList() {
		const e = this.view?.map?.layers, t = e$3(this.view) && !this.view.inGeographicLayout ? e?.filter(({ type: e }) => "link-chart" === e) : e;
		this._watchLayersListMode(t);
		const s = this._getViewableLayers(t);
		s?.length ? (this._createNewItems(s), this._removeItems(s), this._sortItems(s)) : this._removeAllItems();
	}
	_createNewItems(e) {
		const { operationalItems: t } = this;
		e.forEach((e) => {
			t.some((t) => t.layer === e) || t.add(this._createListItem(e));
		});
	}
	_removeItems(e) {
		const { operationalItems: t } = this, s = [];
		t.forEach((t) => {
			t && e && e.includes(t.layer) || s.push(t);
		}), t.destroyMany(s);
	}
	_sortItems(e) {
		const { operationalItems: t } = this;
		t.sort((t, s) => {
			const i = e.indexOf(t.layer), a = e.indexOf(s.layer);
			return i > a ? -1 : i < a ? 1 : 0;
		});
	}
	_recompileList() {
		this._removeAllItems(), this._compileList();
	}
	_viewHandles() {
		const { view: e } = this;
		this.removeHandles([
			m.mapLayers,
			m.layerViews,
			m.viewLayers
		]), e?.ready ? this.addHandles([l$1(() => this.view?.map?.allLayers, (e) => this._createMapLayerHandles(e), h), l$1(() => this.view?.allLayerViews, (e) => this._createLayerViewHandles(e), h)], m.viewLayers) : this._removeAllItems();
	}
};
__decorate([a()], y.prototype, "checkPublishStatusEnabled", void 0), __decorate([a()], y.prototype, "listItemCreatedFunction", void 0), __decorate([a({ nonNullable: !0 })], y.prototype, "listModeDisabled", void 0), __decorate([a({ type: p })], y.prototype, "operationalItems", void 0), __decorate([a({ readOnly: !0 })], y.prototype, "state", null), __decorate([a()], y.prototype, "totalItems", null), __decorate([a()], y.prototype, "view", void 0), y = __decorate([c$1("esri.widgets.LayerList.LayerListViewModel")], y);
var v = y;
//#endregion
//#region node_modules/@arcgis/core/widgets/LayerList/LayerListVisibleElements.js
var r = class extends b {
	constructor(o) {
		super(o), this.catalogLayerList = !0, this.closeButton = !1, this.collapseButton = !1, this.errors = !1, this.filter = !1, this.flow = !0, this.heading = !1, this.statusIndicators = !0, this.temporaryLayerIndicators = !1;
	}
};
__decorate([a({
	type: Boolean,
	nonNullable: !0
})], r.prototype, "catalogLayerList", void 0), __decorate([a({
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
})], r.prototype, "temporaryLayerIndicators", void 0), r = __decorate([c$1("esri.widgets.LayerList.LayerListVisibleElements")], r);
var s = r;
//#endregion
//#region node_modules/@arcgis/core/widgets/LayerList.js
var D = q.ofType(I), R = "nested";
var k = class extends o(O) {
	constructor(e$6, o) {
		super(e$6, o), this._rootListEl = null, this._activeItem = null, this._tooltipReferenceMap = new e$2(), this._focusRootFlowItem = !1, this._focusPanelFlowItem = !1, this._focusLayerFlowItem = null, this._layerListMap = new e$2(), this._lastDragDetail = null, this._selectedDragItemLayerUid = null, this._rootGroupUid = `operational-${this.uid}`, this._openedLayersController = null, this.catalogLayerList = null, this.catalogOptions = null, this.collapsed = !1, this.dragEnabled = !1, this.filterPlaceholder = "", this.filterPredicate = null, this.filterText = "", this.headingLevel = 2, this.knowledgeGraphOptions = null, this.layerTablesEnabled = new q(["knowledge-graph"]), this.listItemCanGiveFunction = null, this.listItemCanReceiveFunction = null, this.mapImageOptions = null, this.messages = null, this.messagesCommon = null, this.minDragEnabledItems = 2, this.minFilterItems = 10, this.openedLayers = new q(), this.openedLayerLists = new q(), this.selectedItems = new D(), this.selectionMode = "none", this.tableList = null, this.tileOptions = null, this.viewModel = new v(), this.visibilityAppearance = "default", this.visibleElements = new s(), this._canMove = ({ dragEl: e, fromEl: t, toEl: i }, o) => {
			const s = "pull" === o ? this.listItemCanGiveFunction : this.listItemCanReceiveFunction, l = N(e);
			if (!l?.sortable) return !1;
			const r = N(t), a = q$1(t), n = N(i), d = q$1(i), p = !!a && !!d && a === d, c = {
				selected: l,
				from: r,
				to: n
			}, m = t.group, h = i.group, y = r?.layer?.type ?? "", u = n?.layer?.type ?? "", g = new Set([
				"map-image",
				"catalog",
				"knowledge-graph"
			]);
			return m && h && "function" == typeof s ? s.call(null, c) : p && !g.has(y) && !g.has(u) && l?.layer?.type !== "sublayer";
		}, this._onCatalogOpen = (e) => {
			this.openedLayers.push(e.layer?.parent), this._focusLayerFlowItem = e.layer?.uid;
		}, this._onTablesOpen = (e) => {
			this.openedLayers.push(e.layer), this._focusLayerFlowItem = e.layer?.uid;
		}, this._onPanelOpen = () => {
			this._focusPanelFlowItem = !0;
		}, this._onTooltipReferenceChange = (e, t) => {
			t ? this._tooltipReferenceMap.set(e, t) : this._tooltipReferenceMap.delete(e);
		}, this._onSelectedDragItemLayerUidChange = (e) => {
			this._selectedDragItemLayerUid = e;
		}, this._onTriggerAction = (e, t) => {
			this.triggerAction(e, t);
		}, this._clearActiveItem = () => {
			this._activeItem = null;
		}, this._setActiveItem = (e$5) => {
			if ("default" !== this.visibilityAppearance) return;
			this._activeItem = N(Array.from(e$5.composedPath()).find((e$4) => e$4.classList?.contains(e.item)));
		}, this._onCalciteListOrderChange = (e) => {
			const { _lastDragDetail: t } = this, { toEl: i, fromEl: o, dragEl: s, newIndex: l } = e;
			if (o && i && !(t?.newIndex === l && t?.dragEl === s && t?.toEl === i && t?.fromEl === o)) {
				if (this._lastDragDetail = e, this._selectedDragItemLayerUid = s.value, o === i) {
					const e = Array.from(o.children).filter((e) => e?.matches("calcite-list-item")).map((e) => e.value);
					this._sortLayers(o, e);
					return;
				}
				this._moveLayerFromChildList({
					toEl: i,
					fromEl: o,
					dragEl: s,
					newIndex: l
				});
			}
		}, this.announceDeprecation = () => {
			r$1(n.getLogger(this), "Layer List", "arcgis-layer-list", { version: "5.0" });
		};
	}
	initialize() {
		this.addHandles([
			a$1(() => this.openedLayers, "change", () => this._handleOpenedLayersChange(), h),
			a$1(() => this.viewModel.operationalItems, "change", () => s$1(this.selectedItems), h),
			l$1(() => [this.filterPredicate, this._rootListEl], () => f(this._rootListEl, this.filterPredicate))
		]);
	}
	loadDependencies() {
		return c$2({
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
	get _totalItems() {
		return this.viewModel.operationalItems.flatten((e) => e.children.filter((e) => "catalog-dynamic-group" !== e.layer?.type)).length;
	}
	get _visibleItems() {
		return this.operationalItems?.filter((e) => !e.hidden && (this.visibleElements.errors || !e.error));
	}
	get _openedPanelItems() {
		return this._visibleItems.flatten((e) => e.children).filter(({ hidden: e, panel: t }) => !e && t?.open && !t.disabled && t.flowEnabled);
	}
	get _dragEnabled() {
		return this._totalItems >= this.minDragEnabledItems && this.dragEnabled;
	}
	get _filterEnabled() {
		return this._totalItems >= this.minFilterItems && this.visibleElements.filter;
	}
	get _renderedOpenLayerFlowItems() {
		const { openedLayers: e } = this;
		return e.toArray().map((t, i) => this._renderLayerFlowItem(t, i === e.length - 1));
	}
	get icon() {
		return "layers";
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
	get operationalItems() {
		return this.viewModel.operationalItems;
	}
	set operationalItems(e) {
		this.viewModel.operationalItems = e;
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
		const e$7 = this.viewModel?.state, t = {
			[e$1.hidden]: "loading" === e$7,
			[e$1.disabled]: "disabled" === e$7
		};
		return x("div", { class: this.classes(e.base, e$1.widget, e$1.panel, t) }, this._renderItemTooltips(), this._renderItems());
	}
	async _createFlowList(e, t) {
		const { _layerListMap: i } = this, o = i.get(e);
		if (o) return o;
		const s = "catalog" === e.type ? await this._createCatalogLayerList(e) : await this._createTableList(e);
		return t.aborted || i.set(e, s), s;
	}
	async _handleOpenedLayersChange() {
		const { _layerListMap: e, openedLayers: t, openedLayerLists: i } = this;
		this._openedLayersController?.abort();
		const o = new AbortController(), { signal: s } = o;
		this._openedLayersController = o, e.forEach((i, o) => {
			t.includes(o) || (i.destroy(), e.delete(o));
		});
		const l = await Promise.all(t.map((e) => this._createFlowList(e, s)));
		if (s.aborted) return;
		i.removeAll(), i.addMany(l);
		const r = i.at(-1);
		r ? "catalogLayer" in r ? (this._set("catalogLayerList", r), this._set("tableList", null)) : (this._set("catalogLayerList", null), this._set("tableList", r)) : (this._set("catalogLayerList", null), this._set("tableList", null));
	}
	_destroyOpenedLayerLists() {
		this.openedLayerLists.destroyAll(), this.openedLayers.removeAll(), this._layerListMap.clear();
	}
	_renderItemTooltip(e) {
		const { _tooltipReferenceMap: t, messages: i } = this;
		return e ? x("calcite-tooltip", {
			key: `tooltip-${e.layer?.uid}`,
			overlayPositioning: "fixed",
			referenceElement: t.get(e.layer?.uid),
			topLayerDisabled: this.topLayerDisabled
		}, i.layerIncompatibleTooltip) : null;
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
	async _createCatalogLayerList(e) {
		const { default: t } = await import("./CatalogLayerList-BIHfeSBT.js"), { headingLevel: i, catalogOptions: o, view: s, filterPlaceholder: l, listItemCreatedFunction: r, minFilterItems: a, selectionMode: n, visibilityAppearance: d, _onCatalogOpen: p, _onTablesOpen: c, layerTablesEnabled: m } = this;
		return new t({
			headingLevel: i,
			view: s,
			filterPlaceholder: l,
			listItemCreatedFunction: r,
			minFilterItems: a,
			selectionMode: n,
			visibilityAppearance: d,
			...o,
			catalogLayer: e,
			layerTablesEnabled: m,
			onCatalogOpen: p,
			onTablesOpen: c
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
		const { default: t } = await import("./TableList-BlAXKxeA.js"), { headingLevel: i, selectionMode: o, dragEnabled: s } = this;
		return new t({
			headingLevel: i,
			selectionMode: o,
			dragEnabled: s,
			...this._getTableListParams(e)
		});
	}
	_renderLayerFlowItem(e, t) {
		const { messages: i, openedLayers: o } = this, s = e.title || this.messages.untitledLayer;
		return x("calcite-flow-item", {
			afterCreate: this._focusLayerFlowItemNode,
			afterUpdate: this._focusLayerFlowItemNode,
			bind: this,
			"data-layer-uid": e.uid,
			description: s,
			heading: i["catalog" === e.type ? "catalogLayers" : "tables"],
			headingLevel: this.headingLevel,
			key: `flow-layer-list-${e.uid}`,
			selected: t,
			onCalciteFlowItemBack: (e) => {
				e.preventDefault(), o.pop();
				const t = o.at(-1);
				t ? this._focusLayerFlowItem = t.uid : this._focusRootFlowItem = !0;
			}
		}, this._layerListMap.get(e)?.render());
	}
	_renderPanelFlowItems() {
		const { _openedPanelItems: e, openedLayers: t } = this;
		return e.toArray().map(({ title: i, panel: o }, s) => {
			const l = () => this._handlePanelFlowItemBack(o);
			return x("calcite-flow-item", {
				afterCreate: this._focusPanelFlowItemNode,
				afterUpdate: this._focusPanelFlowItemNode,
				bind: this,
				description: i,
				heading: o.title,
				headingLevel: this.headingLevel,
				key: `flow-panel-${o.uid}`,
				selected: !t.length && s === e.length - 1,
				onCalciteFlowItemBack: (e) => {
					e.preventDefault(), l();
				}
			}, o.render(), x("calcite-button", {
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
	_focusLayerFlowItemNode(e) {
		this._focusLayerFlowItem === e.dataset.layerUid && (this._focusLayerFlowItem = null, w(e));
	}
	_focusPanelFlowItemNode(e) {
		this._focusPanelFlowItem && (this._focusPanelFlowItem = !1, w(e));
	}
	_renderItems() {
		const { visible: e$8, collapsed: t, _visibleItems: i, _openedPanelItems: o, _filterEnabled: s, _rootGroupUid: l, visibleElements: { closeButton: r, collapseButton: a, heading: n, flow: d }, _dragEnabled: p, selectionMode: c, filterText: h, openedLayers: y, filterPlaceholder: u, messages: g } = this, L = [
			x("calcite-flow-item", {
				afterCreate: this._focusRootFlowItemNode,
				afterUpdate: this._focusRootFlowItemNode,
				bind: this,
				closable: r,
				closed: !e$8,
				collapsed: t,
				collapsible: a,
				heading: n ? g.widgetLabel : void 0,
				headingLevel: this.headingLevel,
				key: "root-flow-item",
				selected: !y.length && !o.length,
				onCalciteFlowItemClose: () => this.visible = !1
			}, i?.length ? null : this._renderNoItems(), x("calcite-list", {
				afterCreate: (e) => {
					this._rootListEl = e, e.addEventListener("focusin", this._setActiveItem), e.addEventListener("focusout", this._clearActiveItem);
				},
				afterRemoved: (e) => {
					this._rootListEl = null, e.removeEventListener("focusin", this._setActiveItem), e.removeEventListener("focusout", this._clearActiveItem);
				},
				canPull: (e) => this._canMove(e, "pull"),
				canPut: (e) => this._canMove(e, "put"),
				"data-layer-type": l,
				displayMode: R,
				dragEnabled: p,
				filterEnabled: s,
				filterPlaceholder: u,
				filterProps: t$1,
				filterText: s ? h : "",
				group: l,
				key: "root-list",
				label: g.widgetLabel,
				onmouseleave: this._clearActiveItem,
				onmouseover: this._setActiveItem,
				selectionAppearance: "border",
				selectionMode: c,
				onCalciteListChange: (e) => this._handleCalciteListChange(e),
				onCalciteListDragEnd: (e) => this._handleCalciteListDragEnd(e.detail),
				onCalciteListFilter: (e) => this.filterText = e.currentTarget?.filterText ?? "",
				onCalciteListOrderChange: (e) => this._onCalciteListOrderChange(e.detail)
			}, i.toArray().map((e) => this._renderItem(e)), s ? x("div", {
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
		return e$8 ? d ? x("calcite-flow", { key: "root-flow" }, L) : L : null;
	}
	_renderItem(e$9, t, i) {
		return x(C, {
			activeItem: this._activeItem,
			canMove: this._canMove,
			css: e,
			displayMode: R,
			dragEnabled: this.dragEnabled,
			item: e$9,
			key: `layerListItem-${e$9.layer?.uid}`,
			layerTablesEnabled: this.layerTablesEnabled,
			listModeDisabled: this.viewModel.listModeDisabled,
			messages: this.messages,
			messagesCommon: this.messagesCommon,
			parent: t,
			parentTitles: i,
			rootGroupUid: this._rootGroupUid,
			selectedDragItemLayerUid: this._selectedDragItemLayerUid,
			selectedItems: this.selectedItems,
			selectionMode: this.selectionMode,
			visibilityAppearance: this.visibilityAppearance,
			visibleElements: this.visibleElements,
			onAction: this._onTriggerAction,
			onCatalogOpen: this._onCatalogOpen,
			onPanelOpen: this._onPanelOpen,
			onSelectedDragItemLayerUidChange: this._onSelectedDragItemLayerUidChange,
			onTablesOpen: this._onTablesOpen,
			onTooltipReferenceChange: this._onTooltipReferenceChange
		});
	}
	_moveLayerFromChildList({ toEl: e, fromEl: t, dragEl: i, newIndex: o }) {
		const s = N(i), l = N(e), r = N(t);
		this.viewModel.moveListItem(s, r, l, o);
	}
	_handleCalciteListDragEnd(e) {
		const { fromEl: t, dragEl: i, oldIndex: o } = e;
		t.insertBefore(i, t.children[o]);
	}
	_sortLayers(e, t) {
		if (e) if (e === this._rootListEl) v$2(this.view?.map?.layers, t);
		else {
			const i = N(e);
			if (!i) return;
			h$1(i, t);
		}
	}
	_handleCalciteListChange(e) {
		const { selectionMode: t, selectedItems: i } = this;
		if ("none" === t) return;
		const o = e.target.selectedItems.map((e) => N(e)).filter(Boolean);
		i.removeAll(), i.addMany(o);
	}
};
__decorate([a()], k.prototype, "_rootListEl", void 0), __decorate([a()], k.prototype, "_activeItem", void 0), __decorate([a()], k.prototype, "_tooltipReferenceMap", void 0), __decorate([a()], k.prototype, "_focusRootFlowItem", void 0), __decorate([a()], k.prototype, "_focusPanelFlowItem", void 0), __decorate([a()], k.prototype, "_focusLayerFlowItem", void 0), __decorate([a()], k.prototype, "_layerListMap", void 0), __decorate([a()], k.prototype, "_totalItems", null), __decorate([a()], k.prototype, "_visibleItems", null), __decorate([a()], k.prototype, "_openedPanelItems", null), __decorate([a()], k.prototype, "_dragEnabled", null), __decorate([a()], k.prototype, "_filterEnabled", null), __decorate([a()], k.prototype, "_renderedOpenLayerFlowItems", null), __decorate([a({ readOnly: !0 })], k.prototype, "catalogLayerList", void 0), __decorate([a()], k.prototype, "catalogOptions", void 0), __decorate([a()], k.prototype, "collapsed", void 0), __decorate([a()], k.prototype, "dragEnabled", void 0), __decorate([a()], k.prototype, "filterPlaceholder", void 0), __decorate([a()], k.prototype, "filterPredicate", void 0), __decorate([a()], k.prototype, "filterText", void 0), __decorate([a()], k.prototype, "headingLevel", void 0), __decorate([a()], k.prototype, "icon", null), __decorate([a()], k.prototype, "knowledgeGraphOptions", void 0), __decorate([a()], k.prototype, "label", null), __decorate([a()], k.prototype, "layerTablesEnabled", void 0), __decorate([a()], k.prototype, "listItemCanGiveFunction", void 0), __decorate([a()], k.prototype, "listItemCanReceiveFunction", void 0), __decorate([a()], k.prototype, "listItemCreatedFunction", null), __decorate([a()], k.prototype, "mapImageOptions", void 0), __decorate([a(), v$1("esri/widgets/LayerList/t9n/LayerList")], k.prototype, "messages", void 0), __decorate([a(), v$1("esri/t9n/common")], k.prototype, "messagesCommon", void 0), __decorate([a()], k.prototype, "minDragEnabledItems", void 0), __decorate([a()], k.prototype, "minFilterItems", void 0), __decorate([a({ readOnly: !0 })], k.prototype, "openedLayers", void 0), __decorate([a({ readOnly: !0 })], k.prototype, "openedLayerLists", void 0), __decorate([a()], k.prototype, "operationalItems", null), __decorate([a()], k.prototype, "selectedItems", void 0), __decorate([a()], k.prototype, "selectionMode", void 0), __decorate([a({ readOnly: !0 })], k.prototype, "tableList", void 0), __decorate([a()], k.prototype, "tileOptions", void 0), __decorate([a()], k.prototype, "view", null), __decorate([m$1("trigger-action"), a({ type: v })], k.prototype, "viewModel", void 0), __decorate([a()], k.prototype, "visibilityAppearance", void 0), __decorate([a({
	type: s,
	nonNullable: !0
})], k.prototype, "visibleElements", void 0), k = __decorate([c$1("esri.widgets.LayerList")], k);
var j = k;
//#endregion
export { j as default };

//# sourceMappingURL=@arcgis_core_widgets_LayerList.js.map