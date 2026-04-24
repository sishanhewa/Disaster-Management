import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { a as i } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./Evented-GLJbxWO5.js";
import "./SimpleObservable-CNlRjEs1.js";
import "./Collection-BAJSKCip.js";
import "./collectionUtils-DQeMhtWS.js";
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
import "./Portal-DYysvbhZ.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import "./messages-BSXJ_xjI.js";
import "./basemapDefinitions-CGK-Ctsz.js";
import "./layerUtils-sQ-3wxAB.js";
import { s as l$1 } from "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./catalogUtils-lRNSLCIB.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import "./Color-C99QAF80.js";
import "./opacityUtils-DgEZ8x-q.js";
import "./Clonable-D_RHUyXD.js";
import "./uuid-CI605U6Y.js";
import "./Polygon-CCBjbbXT.js";
import "./curveUtils-CfkOAT4m.js";
import "./coordsUtils-DXLB9bAf.js";
import "./aaBoundingRect-CgUWvAgv.js";
import "./common-BxLRDsKd.js";
import "./vec2-BPF6SpMH.js";
import "./curveExtent--ue9-x0m.js";
import "./mat3-CPqND9LM.js";
import "./mat3f64-DZZP34-L.js";
import "./Polyline-Cv0nwof6.js";
import "./vec3f64-CwISzc_v.js";
import "./Multipoint-B5Liskmz.js";
import "./utils-3ndlmaCD.js";
import "./mat4-CCf33Vjt.js";
import "./basemapUtils-C5xoGB-C.js";
import "./jsonUtils-D_oLUjKv.js";
import "./typeUtils-DaICxhuY.js";
import "./fieldType-D7SwLPxF.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./PopupTemplate-8SH37QID.js";
import "./fieldFormatUtils-R1ptUFq7.js";
import "./ActionToggle-JH4srUd2.js";
import "./Graphic-D2G0Ykqt.js";
import "./SimpleMarkerSymbol-BjFFaoyw.js";
import "./typeUtils-DZkmoi8p.js";
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import "./aaBoundingBox-CzeY9F8R.js";
import "./symbolLayerUtils3D-BQRyZskR.js";
import "./textUtils-B4iTDAON.js";
import "./TextSymbol-CsSnkPMD.js";
import "./SimpleFillSymbol-CbXKKnxp.js";
import "./PictureMarkerSymbol-Crs5VdSs.js";
import "./Field-jzopk-Sr.js";
import "./number-DwLpDjta.js";
import { i as h$1, o as w$1 } from "./intl-1FbLkipu.js";
import "./FeatureSet-Sjrap7hf.js";
import "./DynamicDataLayer-Nl0N-nbb.js";
import "./Query-aOayEcb1.js";
import "./QuantizationParameters-BoZFfmfD.js";
import "./StatisticDefinition-DCvGQn-e.js";
import "./featureQueryAll-BuWv8PcT.js";
import "./sanitizerUtils-D4_LRYnp.js";
import "./NetworkElement-Bc_17I9h.js";
import { n as c$1, t as O } from "./Widget-D7J6FR9J.js";
import { c as x, s as v$1 } from "./widget-BsQfm1ik.js";
import { t as e } from "./globalCss-Dvrz6ByO.js";
import "./projector-76ZJJlBX.js";
import { t as e$1 } from "./ReactiveMap-B1BORGbU.js";
import "./runtime-C8rHe43j.js";
import "./utils-Dgqqelok.js";
import "./featureUtils-CfEspEWt.js";
import { n as s, t as v$2 } from "./FeatureUtilityNetworkAssociationsViewModel-CE5wa8Mx.js";
//#region node_modules/@arcgis/core/widgets/support/UtilityNetworkAssociations/UtilityNetworkAssociationList.js
var l = "esri-utility-network-association-list", p = {
	featureObserver: `${l}__feature-observer`,
	limitNoticeContainer: `${l}__limit-notice-container`,
	loadingContainer: `${l}__loading-container`
};
var m = class extends O {
	constructor(e, t) {
		super(e, t), this._isFeatureCountNoticeOpen = !0, this._observer = new IntersectionObserver(([e]) => {
			e?.isIntersecting && this._increaseFeaturePage();
		}, { root: window.document }), this._observerNode = null, this.featuresPerPage = 50, this.headingLevel = 5, this.maxFeatureCount = 1e3, this.messagesFeature = null, this.messagesCommon = null, this.selectedLayer = null, this.tooltipReferenceMap = new e$1(), this.viewModel = new v$2();
	}
	initialize() {
		this.setUpObserver();
	}
	loadDependencies() {
		return c$1({
			icon: () => import("./calcite-icon-ClTjWMrb.js").then((n) => n.t),
			loader: () => import("./calcite-loader-Bzm1Kkr9.js").then((n) => n.t),
			notice: () => import("./calcite-notice-BerHV0zg.js")
		});
	}
	destroy() {
		this.tooltipReferenceMap.clear();
	}
	get associatedFeatureCount() {
		const e = this.viewModel.associationViewModels, t = this.selectedLayer ? e.get(this.selectedLayer) : null;
		return t ? t.length : 0;
	}
	set currentFeaturePage(e) {
		const { featuresPerPage: t, associatedFeatureCount: o } = this, i = Math.ceil(o / t) || 1, r = Math.max(Math.min(e, i), 1);
		this._set("currentFeaturePage", r);
	}
	get currentFeaturePage() {
		return this._get("currentFeaturePage") ?? 1;
	}
	get endIndex() {
		const { currentFeaturePage: e, featuresPerPage: t, maxFeatureCount: o } = this;
		return Math.min(e * t, o);
	}
	renderConnectivityIcon(e, t) {
		const { tooltipReferenceMap: o } = this;
		let i;
		switch (e) {
			case "junction-edge-from-connectivity":
				i = "connection-end-left";
				break;
			case "junction-edge-to-connectivity":
				i = "connection-end-right";
				break;
			case "junction-edge-midspan-connectivity":
				i = "connection-middle";
				break;
			default: i = "connection-to-connection";
		}
		return x("calcite-icon", {
			afterCreate: (e) => o.set(t, e),
			afterRemoved: () => o.delete(t),
			icon: i,
			scale: "s",
			slot: "content-start"
		});
	}
	renderFeatureCountWarning() {
		const { associatedFeatureCount: e, maxFeatureCount: o, messagesFeature: i } = this;
		return e > o ? x("calcite-notice", {
			class: this._isFeatureCountNoticeOpen ? p.limitNoticeContainer : void 0,
			closable: !0,
			icon: "information",
			kind: "info",
			open: !0,
			scale: "s",
			width: "full",
			onCalciteNoticeBeforeOpen: () => this._isFeatureCountNoticeOpen = !0,
			onCalciteNoticeClose: () => this._isFeatureCountNoticeOpen = !1
		}, x("div", { slot: "title" }, i.associationsLimitNoticeTitle), x("div", { slot: "message" }, w$1(i.associationsLimitNoticeMessage, { number: o }))) : null;
	}
	renderFeatureObserver() {
		return x("div", {
			afterCreate: this._onObserverCreate,
			bind: this,
			class: p.featureObserver,
			key: "feature-observer"
		});
	}
	renderLoading() {
		return x("div", {
			class: p.loadingContainer,
			key: "loading-container"
		}, this.renderLoadingIcon());
	}
	renderLoadingIcon() {
		return x("calcite-loader", {
			inline: !0,
			label: this.messagesCommon.loading
		});
	}
	getConnectivityTooltip(e) {
		const { messagesFeature: t } = this;
		switch (e) {
			case "connectivity":
			case "junction-junction-connectivity": return t.associationsJunctionJunction;
			case "junction-edge-from-connectivity": return t.associationsJunctionEdgeFrom;
			case "junction-edge-midspan-connectivity": return t.associationsJunctionEdgeMidspan;
			case "junction-edge-to-connectivity": return t.associationsJunctionEdgeTo;
			default: return "";
		}
	}
	setUpObserver() {
		this.addHandles(l$1(() => this._observerNode, () => this._onObserverChange()));
	}
	_increaseFeaturePage() {
		this.currentFeaturePage++;
	}
	_onObserverChange() {
		this._observerNode && this._observer.unobserve(this._observerNode);
		const { state: e, showAllEnabled: t } = this.viewModel;
		this._observerNode && "ready" === e && t && this._observer.observe(this._observerNode);
	}
	_onObserverCreate(e) {
		this._observerNode = e;
	}
};
__decorate([a()], m.prototype, "_observer", void 0), __decorate([a()], m.prototype, "_observerNode", void 0), __decorate([a()], m.prototype, "associatedFeatureCount", null), __decorate([a()], m.prototype, "currentFeaturePage", null), __decorate([a()], m.prototype, "endIndex", null), __decorate([a()], m.prototype, "featuresPerPage", void 0), __decorate([a()], m.prototype, "headingLevel", void 0), __decorate([a()], m.prototype, "maxFeatureCount", void 0), __decorate([a(), v$1("esri/widgets/Feature/t9n/Feature")], m.prototype, "messagesFeature", void 0), __decorate([a(), v$1("esri/t9n/common")], m.prototype, "messagesCommon", void 0), __decorate([a()], m.prototype, "selectedLayer", void 0), __decorate([a()], m.prototype, "tooltipReferenceMap", void 0), __decorate([a({ type: v$2 })], m.prototype, "viewModel", void 0), m = __decorate([c("esri.widgets.support.UtilityNetworkAssociations.UtilityNetworkAssociationList")], m);
//#endregion
//#region node_modules/@arcgis/core/widgets/support/UtilityNetworkAssociations/utils/formatPercentAlong.js
function n$2(n) {
	const { percentAlong: r } = n;
	return null == r ? "" : h$1(r, {
		style: "percent",
		maximumFractionDigits: 2
	});
}
//#endregion
//#region node_modules/@arcgis/core/widgets/support/UtilityNetworkAssociations/utils/isConnectivity.js
function n$1(n) {
	const { associationType: t } = n;
	return "connectivity" === t || "junction-junction-connectivity" === t || "junction-edge-from-connectivity" === t || "junction-edge-midspan-connectivity" === t || "junction-edge-to-connectivity" === t;
}
//#endregion
//#region node_modules/@arcgis/core/widgets/support/UtilityNetworkAssociations/utils/isConnectivityMidspan.js
function n(n) {
	return "junction-edge-midspan-connectivity" === n.associationType;
}
//#endregion
//#region node_modules/@arcgis/core/widgets/Feature/FeatureUtilityNetworkAssociationList.js
var h;
var w = "esri-feature-utility-network-associations", y = {
	base: w,
	listItemHidden: `${w}__list-item--hidden`
}, f = "nested";
var b = h = class extends m {
	constructor(e, t) {
		super(e, t), this.description = null, this.flowItems = null, this.flowType = "feature-utility-network-association-type", this.listType = null, this.parentFeatureViewModel = null, this.title = null, this.viewModel = new v$2(), this.visibleElements = new s();
	}
	initialize() {
		this.setUpObserver();
	}
	loadDependencies() {
		return c$1({
			chip: () => import("./calcite-chip-_pKlSgQA.js"),
			icon: () => import("./calcite-icon-ClTjWMrb.js").then((n) => n.t),
			list: () => import("./calcite-list-Dfj1KW2E.js"),
			"list-item": () => import("./calcite-list-item-wSqyqJqf.js"),
			tooltip: () => import("./calcite-tooltip-fZdVPV_E.js")
		});
	}
	destroy() {
		this.tooltipReferenceMap.clear();
	}
	render() {
		const e$2 = this.viewModel.associationViewModels, { state: t, showAllEnabled: i } = this.viewModel, { state: s } = this.parentFeatureViewModel ?? {};
		return x("div", { class: this.classes(y.base, e.widget) }, "loading" === t || "querying" === t || "loading" === s ? this.renderLoading() : i && this.selectedLayer ? x("calcite-list", {
			displayMode: f,
			filterEnabled: !0,
			filterLabel: this.messagesFeature.associationFilterPlaceholder,
			filterPlaceholder: this.messagesFeature.associationFilterPlaceholder,
			label: this.selectedLayer?.title ?? this.messagesCommon.untitled
		}, this.renderFeatureCountWarning(), this._renderAssociatedFeatureListPage(), this.renderFeatureObserver()) : x("calcite-list", {
			displayMode: f,
			label: this.selectedLayer?.title ?? this.messagesCommon.untitled
		}, Array.from(e$2.keys(), (t) => this._renderTypeList(t, e$2.get(t)))));
	}
	_showAllAssociations(e) {
		const { flowItems: t, viewModel: i, description: s$1 } = this;
		if (!t || !e) return;
		i.showAllEnabled = !0;
		const o = new h({
			selectedLayer: e,
			title: e?.title,
			flowItems: t,
			parentFeatureViewModel: this.parentFeatureViewModel,
			featureVisibleElements: this.featureVisibleElements,
			description: s$1,
			visibleElements: new s({
				title: !1,
				description: !1
			}),
			viewModel: i
		});
		t.push(o);
	}
	_renderAssociatedFeatureListPage() {
		const e = this.viewModel.associationViewModels.get(this.selectedLayer).slice(0, this.endIndex);
		return [...this._renderTooltips(e), ...this._renderAssociatedFeatureList(e)];
	}
	_renderItemTooltip(e) {
		const { tooltipReferenceMap: t } = this;
		return n$1(e.association) ? x("calcite-tooltip", {
			key: `tooltip-${e.featureViewModel.uid}`,
			overlayPositioning: "fixed",
			referenceElement: t.get(e.featureViewModel.uid),
			topLayerDisabled: this.topLayerDisabled
		}, this.getConnectivityTooltip(e.association.associationType)) : null;
	}
	_renderAssociatedFeature(e) {
		const { featureViewModel: t, title: s } = e, o = "loading" === t.state, l = this._findFlowItem(t), r = l < 0 && this._isParentFeature(t), n$3 = r || l >= 0;
		return x("calcite-list-item", {
			class: o ? y.listItemHidden : void 0,
			description: i(e.terminalName ?? ""),
			key: `associated-feature-type-${t.uid}`,
			label: i(s),
			onCalciteListItemSelect: () => this._handleFeatureClick(r, l, t)
		}, n$1(e.association) ? this.renderConnectivityIcon(e.association.associationType, e.featureViewModel.uid) : null, n(e.association) ? x("calcite-chip", {
			label: n$2(e.association),
			scale: "s",
			slot: "content-end"
		}, n$2(e.association)) : null, this._renderChevronIconNode(n$3));
	}
	async _selectAssociation(e) {
		const { flowItems: t, featureVisibleElements: i } = this;
		if (!t) return;
		e.abilities = { utilityNetworkAssociationsContent: !0 };
		const { default: s } = await import("./Feature-CaZRFtrl.js").then((n) => n.t);
		t.push(new s({
			flowItems: t,
			flowType: "feature-association",
			viewModel: e,
			visibleElements: i
		}));
	}
	_handleFeatureClick(e, t, i) {
		if (e) this.flowItems.drain((e) => {
			"showAllEnabled" in e.viewModel && (e.viewModel.showAllEnabled = !1), e.viewModel = null, e.destroy();
		});
		else if (t < 0 || !this.flowItems) this._selectAssociation(i);
		else for (; this.flowItems.length > t + 1;) {
			const e = this.flowItems.pop();
			e && ("showAllEnabled" in e.viewModel && (e.viewModel.showAllEnabled = !1), e.viewModel = null, e.destroy());
		}
	}
	_featureViewModelMatch(e, t) {
		const i = e.graphic, s = i?.layer;
		let o = null;
		"subtype-sublayer" === s?.type && s.parent ? o = s.parent.globalIdField ?? null : s && "globalIdField" in s && (o = s.globalIdField);
		const l = o ? i?.attributes[o] : null, r = t.graphic, n = r?.layer;
		let a = null;
		"subtype-sublayer" === n?.type && n.parent ? a = n.parent.globalIdField ?? null : n && "globalIdField" in n && (a = n.globalIdField);
		const c = a ? r?.attributes[a] : null;
		return l && c && l === c;
	}
	_isParentFeature(e) {
		const t = this.flowItems?.getItemAt(0);
		if (!t) return !1;
		const i = t.parentFeatureViewModel;
		return this._featureViewModelMatch(i, e);
	}
	_findFlowItem(e) {
		return this.flowItems?.findIndex((t) => {
			if ("feature-association" !== t.flowType) return !1;
			const i = t.viewModel;
			return this._featureViewModelMatch(i, e);
		}) ?? -1;
	}
	_renderTooltips(e) {
		return e.toArray().map((e) => this._renderItemTooltip(e));
	}
	_renderAssociatedFeatureList(e) {
		return e.toArray().map((e) => this._renderAssociatedFeature(e));
	}
	_renderChevronIconNode(e) {
		return x("calcite-icon", {
			flipRtl: !0,
			icon: e ? "move-up" : "chevron-right",
			scale: "s",
			slot: "content-end"
		});
	}
	_renderTypeList(e, i) {
		const { messagesFeature: s } = this, { displayCount: o } = this.viewModel, l = i.slice(0, o), r = l.length < i.length;
		return x("calcite-list-item", {
			expanded: !0,
			key: "show-all",
			label: e.title,
			value: e.id
		}, x("calcite-chip", {
			label: String(i.length),
			scale: "s",
			slot: "content-end"
		}, i.length), x("calcite-list", {
			group: e.id,
			label: e.title ?? ""
		}, [this._renderTooltips(l), this._renderAssociatedFeatureList(l)], r ? x("calcite-list-item", {
			description: w$1(s?.numberRecords, { number: i.length.toString() }),
			key: "show-all-item",
			label: s.showAll,
			onCalciteListItemSelect: () => this._showAllAssociations(e)
		}, x("calcite-icon", {
			icon: "list",
			scale: "s",
			slot: "content-end"
		})) : null));
	}
};
__decorate([a()], b.prototype, "description", void 0), __decorate([a()], b.prototype, "featureVisibleElements", void 0), __decorate([a()], b.prototype, "flowItems", void 0), __decorate([a()], b.prototype, "flowType", void 0), __decorate([a()], b.prototype, "listType", void 0), __decorate([a()], b.prototype, "parentFeatureViewModel", void 0), __decorate([a()], b.prototype, "title", void 0), __decorate([a({ type: v$2 })], b.prototype, "viewModel", void 0), __decorate([a({
	type: s,
	nonNullable: !0
})], b.prototype, "visibleElements", void 0), b = h = __decorate([c("esri.widgets.Feature.FeatureUtilityNetworkAssociationList")], b);
var v = b;
//#endregion
export { v as default };

//# sourceMappingURL=FeatureUtilityNetworkAssociationList-Bsy9G_Dz.js.map