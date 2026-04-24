import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { o as L, p as f } from "./promiseUtils-DhYhergm.js";
import { a as o, i as r, n as c, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import { u as n$1 } from "./tracking-DBoczQof.js";
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
import "./asyncUtils-D83Q647Q.js";
import { n as l } from "./loadAll-BbdxAVDP.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import { t as S } from "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import "./Portal-DYysvbhZ.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import { n as k } from "./PortalItem-BaGmB6Wg.js";
import "./layerUtils-sQ-3wxAB.js";
import { c as w, n as U, r as a$1, s as l$1 } from "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import { t as b } from "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./catalogUtils-lRNSLCIB.js";
import { t as w$1 } from "./writeUtils-BXROtS1d.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import { t as l$2 } from "./CollectionFlattener-CTOTtTl_.js";
import "./opacityUtils-DgEZ8x-q.js";
import "./Clonable-D_RHUyXD.js";
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
import "./spatialReferenceEllipsoidUtils-qNeWENaq.js";
import "./GeographicTransformation-D90zE-j2.js";
import "./geodesicConstants-C0TscDSm.js";
import "./projectBuffer-CV6RkXdH.js";
import "./projectionUtils-CmEsVWfk.js";
import "./utils-3ndlmaCD.js";
import "./mat4-CCf33Vjt.js";
import { i as t, n as d, t as n$2 } from "./TablesMixin-CteIDOCu.js";
import { t as e$1 } from "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import "./portalItemUtils-CDCH3kjA.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./layerContainerType-ZF61P2__.js";
import "./parser-DVDIh5bD.js";
import "./jsonUtils-DOqHqQ2U.js";
import { n as p } from "./BlendLayer-D1uDzFu8.js";
import "./ElevationInfo-Bsg5AqQw.js";
import "./lengthUtils-DrG-JkjU.js";
import "./unitConversionUtils-dsyJpUwL.js";
import "./commonProperties-DQjThAJZ.js";
import { t as g } from "./OperationalLayer-CaAaD2Zf.js";
import { t as _ } from "./PortalLayer-B3x-_Tp7.js";
import { t as l$3 } from "./ScaleRangeLayer-CIL5S5vZ.js";
import "./styleUtils-BxEPoLoR.js";
import { r as s } from "./saveUtils-C8XCaiJv.js";
import "./associatedFeatureServiceUtils-Cl9xn0aS.js";
import "./serviceJSON-yqpsTxFv.js";
import "./loadUtils-5MBuegmx.js";
import { t as a$2 } from "./lazyLayerLoader-Cn1Ti5Ij.js";
import "./fetchService-kwjoRTYJ.js";
import "./portalLayers-BafORCmz.js";
import { populateGroupLayer as C } from "./layersCreator-DNyeIoMI.js";
//#region node_modules/@arcgis/core/support/tagSymbols.js
var e = Symbol("WebScene");
//#endregion
//#region node_modules/@arcgis/core/layers/GroupLayer.js
var V = class extends p(l$3(g(_(n$2(d(e$1(b))))))) {
	constructor(e) {
		super(e), this._allLayers = new l$2({
			getCollections: () => [this.layers],
			getChildrenFunction: (e) => "layers" in e ? e.layers : null
		}), this.allTables = t(this), this.fullExtent = void 0, this.operationalLayerType = "GroupLayer", this.spatialReference = void 0, this.type = "group", this._debouncedSaveOperations = L(async (e, t, i) => {
			const { save: r, saveAs: s } = await import("./groupLayerUtils-BqPHQW--.js");
			switch (e) {
				case 0: return r(this, t);
				case 1: return s(this, i, t);
			}
		});
	}
	initialize() {
		this._enforceVisibility(this.visibilityMode, this.visible), this.addHandles([l$1(() => {
			let e$2 = this.parent;
			for (; e$2 && "parent" in e$2 && e$2.parent;) e$2 = e$2.parent;
			return e$2 && e in e$2;
		}, (e) => {
			const t = "prevent-adding-tables";
			this.removeHandles(t), e && (this.tables.removeAll(), this.addHandles(a$1(() => this.tables, "before-add", (e) => {
				e.preventDefault(), n.getLogger(this).errorOnce("tables", "tables in group layers in a webscene are not supported. Please move the tables from the group layer to the webscene if you want to persist them.");
			}), t));
		}, w), l$1(() => this.visible, this._onVisibilityChange.bind(this), U)]);
	}
	destroy() {
		this.allLayers.destroy(), this.allTables.destroy();
	}
	get allLayers() {
		return this._allLayers;
	}
	get sourceIsPortalItem() {
		return this.portalItem && 7 === this.originIdOf("portalItem");
	}
	_writeLayers(e, t, i, r) {
		const s = [];
		if (!e) return s;
		e.forEach((e) => {
			const t = w$1(e, r.webmap ? r.webmap.getLayerJSONFromResourceInfo(e) : null, r);
			t?.layerType && s.push(t);
		}), t.layers = s;
	}
	set portalItem(e) {
		this._set("portalItem", e);
	}
	readPortalItem(e, t, i) {
		const { itemId: r, layerType: s } = t;
		if ("GroupLayer" === s && r) return new k({
			id: r,
			portal: i?.portal
		});
	}
	writePortalItem(e, t) {
		e?.id && (t.itemId = e.id);
	}
	set visibilityMode(e) {
		const t = this._get("visibilityMode") !== e;
		this._set("visibilityMode", e), t && this._enforceVisibility(e, this.visible);
	}
	async beforeSave() {
		return s(this);
	}
	load(e) {
		const t = this.loadFromPortal({
			supportedTypes: [
				"Feature Service",
				"Feature Collection",
				"Group Layer",
				"Scene Service",
				"Video Service"
			],
			layerModuleTypeMap: a$2,
			populateGroupLayer: C
		}, e).catch((e) => {
			if (f(e), this.sourceIsPortalItem) throw e;
		});
		return this.addResolvingPromise(t), Promise.resolve(this);
	}
	async loadAll() {
		return l(this, (e) => {
			e(this.layers, this.tables);
		});
	}
	async save(e) {
		return this._debouncedSaveOperations(0, e);
	}
	async saveAs(e, t) {
		return this._debouncedSaveOperations(1, t, e);
	}
	layerAdded(e) {
		e.visible && "exclusive" === this.visibilityMode ? this._turnOffOtherLayers(e) : "inherited" === this.visibilityMode && (e.visible = this.visible), this.hasHandles(e.uid) ? console.error(`Layer read to Grouplayer: uid=${e.uid}`) : this.addHandles(l$1(() => e.visible, (t) => this._onChildVisibilityChange(e, t), U), e.uid);
	}
	layerRemoved(e) {
		this.removeHandles(e.uid), this._enforceVisibility(this.visibilityMode, this.visible);
	}
	_turnOffOtherLayers(e) {
		this.layers.forEach((t) => {
			t !== e && (t.visible = !1);
		});
	}
	_enforceVisibility(e, t) {
		if (!n$1(this).initialized) return;
		const i = this.layers;
		let r = i.find((e) => e.visible);
		switch (e) {
			case "exclusive":
				i.length && !r && (r = i.at(0), r.visible = !0), this._turnOffOtherLayers(r);
				break;
			case "inherited": i.forEach((e) => {
				e.visible = t;
			});
		}
	}
	_onVisibilityChange(e) {
		"inherited" === this.visibilityMode && this.layers.forEach((t) => {
			t.visible = e;
		});
	}
	_onChildVisibilityChange(e, t) {
		switch (this.visibilityMode) {
			case "exclusive":
				t ? this._turnOffOtherLayers(e) : this._isAnyLayerVisible() || (e.visible = !0);
				break;
			case "inherited": e.visible = this.visible;
		}
	}
	_isAnyLayerVisible() {
		return this.layers.some((e) => e.visible);
	}
};
__decorate([a({ readOnly: !0 })], V.prototype, "allLayers", null), __decorate([a({ readOnly: !0 })], V.prototype, "allTables", void 0), __decorate([a({ json: {
	read: !0,
	write: !0
} })], V.prototype, "blendMode", void 0), __decorate([a()], V.prototype, "fullExtent", void 0), __decorate([a({ readOnly: !0 })], V.prototype, "sourceIsPortalItem", null), __decorate([a({ json: {
	read: !1,
	write: { ignoreOrigin: !0 }
} })], V.prototype, "layers", void 0), __decorate([r("layers")], V.prototype, "_writeLayers", null), __decorate([a({ type: ["GroupLayer"] })], V.prototype, "operationalLayerType", void 0), __decorate([a({ json: { origins: {
	"web-map": {
		read: !1,
		write: { overridePolicy(e, t, i) {
			return { enabled: "Group Layer" === e?.type && i?.initiator !== this };
		} }
	},
	"web-scene": {
		read: !1,
		write: !1
	}
} } })], V.prototype, "portalItem", null), __decorate([o("web-map", "portalItem", ["itemId"])], V.prototype, "readPortalItem", null), __decorate([r("web-map", "portalItem", { itemId: { type: String } })], V.prototype, "writePortalItem", null), __decorate([a({ type: S })], V.prototype, "spatialReference", void 0), __decorate([a({
	json: { read: !1 },
	readOnly: !0,
	value: "group"
})], V.prototype, "type", void 0), __decorate([a({
	type: [
		"independent",
		"inherited",
		"exclusive"
	],
	value: "independent",
	json: {
		write: !0,
		origins: { "web-map": {
			type: ["independent", "exclusive"],
			write: (e, t, i) => {
				"inherited" !== e && (t[i] = e);
			}
		} }
	}
})], V.prototype, "visibilityMode", null), V = __decorate([c("esri.layers.GroupLayer")], V);
var T = V;
//#endregion
export { T as default };

//# sourceMappingURL=GroupLayer-DaeYTjb7.js.map