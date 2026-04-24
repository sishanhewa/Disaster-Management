import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c$1, t as a$1 } from "./decorators-DE7S5xmd.js";
import { n as o$1, t as c$2 } from "./catalogUtils-lRNSLCIB.js";
import { o as w$1 } from "./intl-1FbLkipu.js";
import { n as c$3, t as O } from "./Widget-D7J6FR9J.js";
import { c as x$1, p as w$2 } from "./widget-BsQfm1ik.js";
import { n as c$4, t as a$2 } from "./actionUtils-Cy0Gr9_I.js";
//#region node_modules/@arcgis/core/widgets/LayerList/support/layerListUtils.js
var n = {
	hide: "hide",
	hideChildren: "hide-children"
};
function t$1({ exclusive: n, visible: i, visibilityAppearance: e }) {
	const t = "checkbox" === e;
	return i ? n ? "circle-f" : t ? "check-square-f" : "view-visible" : n ? "circle" : t ? "square" : "view-hide";
}
function r({ connectionStatus: n, publishing: i }) {
	return n ? "connected" === n ? "beacon" : "offline" : i ? "square" : "bullet-point";
}
function l(i) {
	return i?.listMode === n.hideChildren;
}
function u(n) {
	return n?.listMode ?? void 0;
}
function o(n) {
	return null != n && "minScale" in n && null != n.minScale ? n.minScale : void 0;
}
function c(n) {
	return null != n && "maxScale" in n && null != n.maxScale ? n.maxScale : void 0;
}
function a(n) {
	if (!n) return "inherited";
	const i = S(x(n) ? n.layer : n);
	return null != i ? i ? "independent" : "inherited" : "visibilityMode" in n && null != n.visibilityMode ? n.visibilityMode : "independent";
}
function s(n) {
	n?.removeMany(n.filter((n) => n?.destroyed));
}
function d(n) {
	if (n && (!("type" in n) || "wmts" !== n.type)) return "sublayers" in n ? "sublayers" : "layers" in n ? "layers" : void 0;
}
function f(n, i) {
	n && (n.filterPredicate = i ? (n) => i(N(n)) : void 0);
}
function y(n) {
	const i = (n?.layer && x(n.layer) ? n.layer.layer : void 0) ?? n?.layer;
	return !!i && "catalog" !== i.type && (M(i) ?? !0);
}
function p(i) {
	return u(i) !== n.hide;
}
function b(n, i) {
	if (!n || null == i || isNaN(i)) return !1;
	const e = o(n), t = c(n);
	return null != e && !isNaN(e) && e > 0 && i > e || null != t && !isNaN(t) && t > 0 && i < t;
}
function v(n, i) {
	n?.sort((n, e) => {
		const t = "uid" in n ? i.indexOf(n.uid) : -1, r = "uid" in e ? i.indexOf(e.uid) : -1;
		return t > r ? -1 : t < r ? 1 : 0;
	});
}
function h(n, i) {
	const e = n?.layer;
	if (!e) return;
	const t = d(e);
	if (!t) return;
	let r;
	"layers" === t && "layers" in e ? r = e.layers : "sublayers" === t && "sublayers" in e && (r = e.sublayers), v(r, i);
}
function m(n) {
	const i = n?.layer;
	return i && "layers" in i ? i.layers : null;
}
function x(n) {
	return null != n && "layer" in n && null != n.layer;
}
function S(n) {
	const i = g(n);
	return null != i && "supportsSublayerVisibility" in i ? i.supportsSublayerVisibility : void 0;
}
function M(n) {
	const i = g(n);
	return null != i && "supportsDynamicLayers" in i ? i.supportsDynamicLayers : void 0;
}
function g(n) {
	return n && "capabilities" in n && null != n.capabilities && "exportMap" in n.capabilities ? n.capabilities.exportMap : void 0;
}
function N(n) {
	return n?.["data-item"];
}
function q(n) {
	return n?.getAttribute("data-layer-type");
}
function w(n) {
	const { children: i, error: e } = n, t = "incompatible" in n && n.incompatible;
	return !!i?.filter((n) => !n.hidden).length && !e && !t;
}
function k(n) {
	for (const i of n) for (const n of i) if ("button" === n.type || "toggle" === n.type) return n;
}
//#endregion
//#region node_modules/@arcgis/core/widgets/LayerList/LayerListItem.js
var _;
var I = class extends O {
	static {
		_ = this;
	}
	constructor(e) {
		super(e), this.dragEnabled = !1, this.listModeDisabled = !1, this.parent = null, this.parentTitles = null, this.viewModel = null, this._onActionMenuOpen = (e) => {
			this.item.actionsOpen = e.currentTarget.open;
		}, this._setTooltipReference = (e) => {
			this.onTooltipReferenceChange?.(this.item.layer?.uid, e);
		}, this._removeTooltipReference = () => {
			this.onTooltipReferenceChange?.(this.item.layer?.uid, null);
		};
	}
	loadDependencies() {
		return c$3({
			"action-group": () => import("./calcite-action-group-qUelwc30.js"),
			"action-menu": () => import("./calcite-action-menu-CyvIHLw0.js").then((n) => n.t),
			action: () => import("./calcite-action-BQLn8VGB.js").then((n) => n.t),
			icon: () => import("./calcite-icon-ClTjWMrb.js").then((n) => n.t),
			"list-item": () => import("./calcite-list-item-wSqyqJqf.js"),
			list: () => import("./calcite-list-Dfj1KW2E.js"),
			notice: () => import("./calcite-notice-BerHV0zg.js")
		});
	}
	static {
		this.vnodeSelector = "calcite-list-item";
	}
	render() {
		const e = this.parentTitles ?? [], { _title: t, item: i, activeItem: n, selectionMode: o, selectedItems: s, messages: l, parent: a, css: r, dragDisabled: c } = this, d = "visibleAtCurrentTimeExtent" in i && "layerInvisibleAtTime" in l && !i.visibleAtCurrentTimeExtent ? `${t} (${l.layerInvisibleAtTime})` : "visibleAtCurrentScale" in i && "layerInvisibleAtScale" in l && !i.visibleAtCurrentScale ? `${t} (${l.layerInvisibleAtScale})` : t, p = "parent" in i && "catalog" === i.parent?.layer?.type, { layer: m } = i, u = "visibleAtCurrentScale" in i && !i.visibleAtCurrentScale || "visibleAtCurrentTimeExtent" in i && !i.visibleAtCurrentTimeExtent;
		return x$1("calcite-list-item", {
			afterCreate: (e) => this._focusSelectedDragEl(e, i),
			afterUpdate: (e) => this._focusSelectedDragEl(e, i),
			class: this.classes(r.item, "itemActive" in r && { [r.itemActive]: n === i }),
			"data-item": i,
			"data-layer-id": m?.id,
			dragDisabled: !i.sortable || p || c,
			expanded: "open" in i && i.open,
			id: m?.uid,
			key: `list-item-${m?.uid}`,
			label: t,
			metadata: {
				parentTitles: e,
				_title: t
			},
			selected: "none" !== o && s.includes(i),
			title: d,
			unavailable: u,
			value: m?.uid,
			onCalciteListItemSelect: (e) => "visible" in i && this._handleCalciteListItemSelect(e, i, a),
			onCalciteListItemToggle: (e) => "open" in i && this._handleCalciteListItemToggle(e, i)
		}, this._renderedCatalogFootprintIcon, this._renderedCatalogDynamicIcon, this._renderedItemStatus, this._renderedItemToggle, this._renderedCatalogSelectNode, this._renderedItemTemporaryIcon, this._renderedChildList, this._renderedItemMessage, this._renderedPanel, this._renderedPanelAction, this._renderedActions);
	}
	get _title() {
		const { messages: e } = this;
		return this.item.title || ("untitledTable" in e ? e.untitledTable : e.untitledLayer);
	}
	get _renderedItemStatus() {
		const { item: e, parent: t, visibleElements: i, css: n } = this;
		if (!i.statusIndicators) return null;
		const { publishing: o } = e, s = "updating" in e && e.updating && !t, l = "connectionStatus" in e ? e.connectionStatus : void 0, a = !!l;
		return x$1("calcite-icon", {
			class: this.classes(n.statusIndicator, { [n.publishing]: o }, "updating" in n && { [n.updating]: s }, "connectionStatus" in n && { [n.connectionStatus]: a }, "connectionStatusConnected" in n && { [n.connectionStatusConnected]: a && "connected" === l }),
			icon: r({
				connectionStatus: l,
				publishing: o
			}),
			key: "layer-item-status",
			scale: "s",
			slot: "content-end"
		});
	}
	get _renderedItemTemporaryIcon() {
		const { item: e, visibleElements: t, css: i } = this, { layer: n } = e, s = "temporaryLayerIndicators" in t && t.temporaryLayerIndicators, l = "temporaryTableIndicators" in t && t.temporaryTableIndicators, a = n && "persistenceEnabled" in n && (o$1(n) || !n.persistenceEnabled);
		return (s || l) && a ? x$1("calcite-icon", {
			class: i.itemTemporaryIcon,
			icon: "temporary",
			key: "temporary-icon",
			scale: "s",
			slot: "content-start",
			title: this.messages.temporary
		}) : null;
	}
	get _renderedItemToggle() {
		const { _title: e, item: i, parent: n, messages: o, visibilityAppearance: s, css: l } = this;
		if (!("visible" in i && "layerVisibility" in o && "showLayer" in o && "hideLayer" in o && "visibleToggle" in l && s)) return null;
		const { visible: a } = i, r = this._getParentVisibilityMode(n);
		if ("inherited" === r) return null;
		const c = t$1({
			visible: a,
			exclusive: "exclusive" === r,
			visibilityAppearance: s
		}), d = "checkbox" === s, p = o.layerVisibility, m = w$1(a ? o.hideLayer : o.showLayer, { layerName: e });
		return x$1("calcite-action", {
			class: l.visibleToggle,
			icon: d ? c : void 0,
			key: "visibility-toggle",
			label: m,
			onclick: () => this._toggleVisibility(i, n),
			slot: d ? "actions-start" : "actions-end",
			text: p,
			title: m
		}, d ? null : x$1("calcite-icon", {
			class: this.classes({ [l.visibleIcon]: "exclusive" !== r && a }),
			icon: c,
			scale: "s"
		}));
	}
	get _renderedPanel() {
		const { panel: e } = this.item;
		return !e?.open || e.disabled || e.flowEnabled ? null : x$1("div", {
			class: this.css.itemContentBottom,
			key: `content-panel-${e.uid}`,
			slot: "content-bottom"
		}, e.render());
	}
	get _renderedPanelAction() {
		const { panel: e } = this.item;
		if (!e?.visible) return null;
		const { open: t, title: i, disabled: n } = e;
		return x$1("calcite-action", {
			active: t,
			disabled: n,
			icon: a$2(e),
			key: `action-${e.uid}`,
			onclick: () => this._togglePanel(e),
			slot: "actions-end",
			text: i ?? "",
			title: i ?? void 0
		}, this._renderFallbackIcon(e));
	}
	get _renderedActions() {
		switch (this._actionsCount) {
			case 0: return null;
			case 1: return this._singleAction;
			default: return this._renderedActionMenu;
		}
	}
	get _renderedActionMenu() {
		const { item: e, messagesCommon: t } = this, i = t.options;
		return x$1("calcite-action-menu", {
			appearance: "transparent",
			key: "item-action-menu",
			label: t.menu,
			open: e.actionsOpen,
			overlayPositioning: "fixed",
			placement: "bottom-end",
			slot: "actions-end",
			onCalciteActionMenuOpen: this._onActionMenuOpen
		}, x$1("calcite-action", {
			icon: "ellipsis",
			slot: "trigger",
			text: i,
			title: i
		}), this._renderedActionMenuContent);
	}
	get _renderedActionMenuContent() {
		return this._filteredSections.toArray().map((e) => x$1("calcite-action-group", { key: `action-section-${e.uid}` }, e.toArray().map((e) => this._renderAction({
			action: e,
			textEnabled: !0
		}))));
	}
	get _renderedCatalogFootprintIcon() {
		const { css: e } = this, t = this.item.layer, i = "catalog-footprint" === t?.type, n = "sublayer" === t?.type && c$2(t, "footprints");
		return "itemCatalogIcon" in e && (i || n) ? x$1("calcite-icon", {
			class: e.itemCatalogIcon,
			icon: "footprint",
			key: "footprint",
			scale: "s",
			slot: "content-start"
		}) : null;
	}
	get _renderedCatalogDynamicIcon() {
		const { css: e } = this, t = this.item.layer, i = "catalog-dynamic-group" === t?.type, n = "sublayer" === t?.type && c$2(t, "layers-in-view");
		return "itemCatalogIcon" in e && (i || n) ? x$1("calcite-icon", {
			class: e.itemCatalogIcon,
			icon: "catalog-dataset",
			key: "catalog-dataset",
			scale: "s",
			slot: "content-start"
		}) : null;
	}
	get _renderedCatalogSelectNode() {
		const { _title: e, item: t, visibleElements: i } = this;
		if (!("visible" in t)) return;
		const { layer: n } = t, o = "catalog-dynamic-group" === n?.type;
		return "catalogLayerList" in i && i.catalogLayerList && o ? x$1("calcite-action", {
			disabled: !n.visible,
			icon: "chevron-right",
			iconFlipRtl: !0,
			onclick: () => this._triggerOnCatalogOpen(t),
			slot: "actions-end",
			text: e
		}) : null;
	}
	get _renderedChildList() {
		const { dragEnabled: e, item: t, rootGroupUid: i, listModeDisabled: n, selectionMode: o, displayMode: s } = this;
		if (!("children" in t)) return;
		const l$1 = [...this.parentTitles ?? [], t.title], { children: a, layer: r } = t, c = "catalog-dynamic-group" !== r?.type && w(t), u = !n && l(r), g = "group" === r?.type, y$1 = !u && !c && e && g, h = !!e && "childrenSortable" in t && t.childrenSortable && y(t);
		return c || y$1 ? x$1("calcite-list", {
			canPull: (e) => !!this.canMove && this.canMove(e, "pull"),
			canPut: (e) => !!this.canMove && this.canMove(e, "put"),
			"data-item": t,
			"data-layer-type": i,
			displayMode: s,
			dragEnabled: h,
			group: g ? i : `${i}-${r?.uid}`,
			key: `child-list-${r?.uid}`,
			label: t.title,
			selectionAppearance: "border",
			selectionMode: o
		}, a?.filter((e) => !e.hidden && (this.visibleElements.errors || !e.error)).toArray().map((e) => this._renderItem(e, t, l$1)), this._renderedTablesItem) : null;
	}
	get _hasTables() {
		const { layerTablesEnabled: e } = this, t = this.item.layer;
		if (!e || !t) return !1;
		switch (t.type) {
			case "knowledge-graph": return e.includes(t.type) && "tables" in t && !!t.tables?.length;
			case "map-image":
			case "tile": return e.includes(t.type) && "subtables" in t && !!t.subtables?.length;
			default: return !1;
		}
	}
	get _renderedTablesItem() {
		const { item: e, messages: t, css: i } = this, { layer: n } = e;
		return "itemTableIcon" in i && "visible" in e && "tables" in t && this._hasTables ? x$1("calcite-list-item", {
			class: i.item,
			"data-layer-id": n?.id,
			dragDisabled: !0,
			key: `list-item-table-list-tables-${n?.uid}`,
			label: t.tables,
			title: t.tables,
			onCalciteListItemSelect: () => this._triggerOnTablesOpen(e)
		}, x$1("calcite-icon", {
			class: i.itemTableIcon,
			icon: "table",
			scale: "s",
			slot: "content-start"
		}), x$1("calcite-icon", {
			flipRtl: !0,
			icon: "chevron-right",
			scale: "s",
			slot: "content-end"
		})) : null;
	}
	get _renderedItemMessage() {
		const { item: e, messages: t, css: i } = this;
		return e.error ? x$1("div", {
			class: i.itemMessage,
			key: "esri-layer-list__error",
			slot: "content-bottom"
		}, x$1("calcite-notice", {
			icon: "exclamation-mark-triangle",
			kind: "warning",
			open: !0,
			scale: "s",
			width: "full"
		}, x$1("div", { slot: "message" }, "tableError" in t ? t.tableError : t.layerError))) : "incompatible" in e && e.incompatible && "layerIncompatible" in t ? x$1("div", {
			class: i.itemMessage,
			key: "esri-layer-list__incompatible",
			slot: "content-bottom"
		}, x$1("calcite-notice", {
			afterCreate: this._setTooltipReference,
			afterRemoved: this._removeTooltipReference,
			bind: this,
			icon: "exclamation-mark-triangle",
			kind: "warning",
			open: !0,
			scale: "s",
			tabIndex: 0,
			width: "full"
		}, x$1("div", { slot: "message" }, t.layerIncompatible))) : null;
	}
	get _singleAction() {
		return this._renderAction({
			action: k(this._filteredSections),
			textEnabled: !1
		});
	}
	get _filteredSections() {
		return this.item.actionsSections.map((e) => e.filter((e) => e.visible));
	}
	get _actionsCount() {
		return this.item.actionsSections.reduce((e, t) => e + t.length, 0);
	}
	_renderAction(e) {
		const { item: t } = this, { action: i, textEnabled: n } = e;
		if (!i) return null;
		const { active: o, disabled: s, title: a, type: r, indicator: c } = i;
		return x$1("calcite-action", {
			active: "toggle" === r && i.value,
			"data-action-id": i.id,
			disabled: s,
			icon: a$2(i),
			indicator: c,
			key: `action-${i.uid}`,
			loading: o,
			onclick: () => this._triggerAction(t, i),
			slot: n ? void 0 : "actions-end",
			text: a ?? "",
			textEnabled: n,
			title: a ?? void 0
		}, this._renderFallbackIcon(i));
	}
	_renderFallbackIcon(e) {
		const { css: t } = this, { icon: i } = e, n = "className" in e ? e.className : void 0;
		if (i) return null;
		const o = "image" in e ? e.image : void 0, s = {
			[t.itemActionIcon]: !!n,
			[t.itemActionImage]: !!o
		};
		return n && (s[n] = !0), o || n ? x$1("span", {
			"aria-hidden": "true",
			class: this.classes(t.itemActionIcon, s),
			key: "icon",
			styles: c$4(o)
		}) : null;
	}
	_renderItem(e, t, i = []) {
		return x$1(_, {
			activeItem: this.activeItem,
			canMove: this.canMove,
			css: this.css,
			displayMode: this.displayMode,
			dragEnabled: this.dragEnabled,
			item: e,
			key: `layerListItem-${e.layer?.uid}`,
			layerTablesEnabled: this.layerTablesEnabled,
			listModeDisabled: this.listModeDisabled,
			messages: this.messages,
			messagesCommon: this.messagesCommon,
			parent: t,
			parentTitles: i,
			rootGroupUid: this.rootGroupUid,
			selectedDragItemLayerUid: this.selectedDragItemLayerUid,
			selectedItems: this.selectedItems,
			selectionMode: this.selectionMode,
			visibilityAppearance: this.visibilityAppearance,
			visibleElements: this.visibleElements,
			onAction: this.onAction,
			onCatalogOpen: this.onCatalogOpen,
			onPanelOpen: this.onPanelOpen,
			onSelectedDragItemLayerUidChange: this.onSelectedDragItemLayerUidChange,
			onTablesOpen: this.onTablesOpen,
			onTooltipReferenceChange: this.onTooltipReferenceChange
		});
	}
	_triggerAction(e, t) {
		t && e && ("toggle" === t.type && (t.value = !t.value), this.onAction(t, e));
	}
	_triggerOnTablesOpen(e) {
		e && this.onTablesOpen && this.onTablesOpen(e);
	}
	_triggerOnCatalogOpen(e) {
		e && this.onCatalogOpen?.(e);
	}
	_focusSelectedDragEl(e, t) {
		this.selectedDragItemLayerUid === t.layer?.uid && (w$2(e), this.onSelectedDragItemLayerUidChange?.(null));
	}
	_handleCalciteListItemToggle(e, t) {
		e.stopPropagation(), t.open = e.target.expanded;
	}
	_getParentVisibilityMode(e) {
		return e && "visibilityMode" in e ? e.visibilityMode : null;
	}
	_handleCalciteListItemSelect(e, t, i) {
		if (N(e.target) !== t) return;
		const n = this._getParentVisibilityMode(i);
		"none" === this.selectionMode && "inherited" !== n && this._toggleVisibility(t, i);
	}
	_togglePanel(e) {
		e.open = !e.open, e.open && this.onPanelOpen();
	}
	_toggleVisibility(e, t) {
		if (!e || !("visible" in e)) return;
		"exclusive" === this._getParentVisibilityMode(t) && e.visible || (e.visible = !e.visible);
	}
};
__decorate([a$1()], I.prototype, "activeItem", void 0), __decorate([a$1()], I.prototype, "canMove", void 0), __decorate([a$1()], I.prototype, "css", void 0), __decorate([a$1()], I.prototype, "displayMode", void 0), __decorate([a$1()], I.prototype, "dragEnabled", void 0), __decorate([a$1()], I.prototype, "dragDisabled", void 0), __decorate([a$1()], I.prototype, "item", void 0), __decorate([a$1()], I.prototype, "layerTablesEnabled", void 0), __decorate([a$1()], I.prototype, "listModeDisabled", void 0), __decorate([a$1()], I.prototype, "messages", void 0), __decorate([a$1()], I.prototype, "messagesCommon", void 0), __decorate([a$1()], I.prototype, "onAction", void 0), __decorate([a$1()], I.prototype, "onPanelOpen", void 0), __decorate([a$1()], I.prototype, "onCatalogOpen", void 0), __decorate([a$1()], I.prototype, "onTablesOpen", void 0), __decorate([a$1()], I.prototype, "onSelectedDragItemLayerUidChange", void 0), __decorate([a$1()], I.prototype, "onTooltipReferenceChange", void 0), __decorate([a$1()], I.prototype, "parent", void 0), __decorate([a$1()], I.prototype, "parentTitles", void 0), __decorate([a$1()], I.prototype, "rootGroupUid", void 0), __decorate([a$1()], I.prototype, "selectionMode", void 0), __decorate([a$1()], I.prototype, "selectedItems", void 0), __decorate([a$1()], I.prototype, "selectedDragItemLayerUid", void 0), __decorate([a$1()], I.prototype, "visibleElements", void 0), __decorate([a$1()], I.prototype, "visibilityAppearance", void 0), __decorate([a$1()], I.prototype, "_title", null), __decorate([a$1()], I.prototype, "_renderedItemStatus", null), __decorate([a$1()], I.prototype, "_renderedItemTemporaryIcon", null), __decorate([a$1()], I.prototype, "_renderedItemToggle", null), __decorate([a$1()], I.prototype, "_renderedPanel", null), __decorate([a$1()], I.prototype, "_renderedPanelAction", null), __decorate([a$1()], I.prototype, "_renderedActions", null), __decorate([a$1()], I.prototype, "_renderedActionMenu", null), __decorate([a$1()], I.prototype, "_renderedActionMenuContent", null), __decorate([a$1()], I.prototype, "_renderedCatalogFootprintIcon", null), __decorate([a$1()], I.prototype, "_renderedCatalogDynamicIcon", null), __decorate([a$1()], I.prototype, "_renderedCatalogSelectNode", null), __decorate([a$1()], I.prototype, "_renderedChildList", null), __decorate([a$1()], I.prototype, "_hasTables", null), __decorate([a$1()], I.prototype, "_renderedTablesItem", null), __decorate([a$1()], I.prototype, "_renderedItemMessage", null), __decorate([a$1()], I.prototype, "_singleAction", null), __decorate([a$1()], I.prototype, "_filteredSections", null), __decorate([a$1()], I.prototype, "_actionsCount", null), I = _ = __decorate([c$1("esri.widgets.LayerList.LayerListItem")], I);
var C = I;
//#endregion
//#region node_modules/@arcgis/core/widgets/support/listUtils.js
var t = [
	"label",
	"description",
	"metadata"
];
//#endregion
export { b as a, h as c, q as d, s as f, x as h, a as i, m as l, v as m, C as n, d as o, u as p, N as r, f as s, t, p as u };

//# sourceMappingURL=listUtils-D7SjyOSp.js.map