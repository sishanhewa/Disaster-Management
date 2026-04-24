import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as n$1, w as a } from "./Error-CzxduO2m.js";
import { G as n$2 } from "./typedArrayUtil-BAuNmygZ.js";
import { b as p$1, t as f } from "./request-CuG5cxow.js";
import { b as s, f as d$1, j as u$1 } from "./promiseUtils-DhYhergm.js";
import { E as D, N as w, _ as t$1, a as o, i as r$1, n as c$1, o as r, t as a$1 } from "./decorators-DE7S5xmd.js";
import { n as l$2 } from "./Evented-GLJbxWO5.js";
import { t as q } from "./Collection-BAJSKCip.js";
import { n as n$3 } from "./collectionUtils-DQeMhtWS.js";
import { n as n$4, t as a$2 } from "./JSONSupport-BUaD4jSd.js";
import { r as u$2 } from "./Loadable-CQsALnOO.js";
import { n as l$3 } from "./loadAll-BbdxAVDP.js";
import { n as F } from "./Basemap-u-nyEwoW.js";
import { i as f$1 } from "./reactiveUtils-DRpp6Nmg.js";
import { t as g$1 } from "./Color-C99QAF80.js";
import { t as l$4 } from "./CollectionFlattener-CTOTtTl_.js";
import { t as n$5 } from "./groundInstanceUtils-D2G6vBle.js";
import { n as r$2, t as n$6 } from "./opacityUtils-DgEZ8x-q.js";
import { n as l$5, t as f$2 } from "./Clonable-D_RHUyXD.js";
import { n as n$7 } from "./uuid-CI605U6Y.js";
import { t as j$1 } from "./persistable-D3uxCw6O.js";
import { t as p$2 } from "./PolygonCollection-B4RSLInz.js";
import { t as e } from "./editableLayers-CbwLaa1q.js";
import { n as l$6, r as p$3, t as f$3 } from "./basemapEnsureType-Dr1Yhv3d.js";
import { i as t$2, n as d$2, t as n$8 } from "./TablesMixin-CteIDOCu.js";
//#region node_modules/@arcgis/core/ground/NavigationConstraint.js
var n;
var p = n = class extends n$4 {
	constructor(o) {
		super(o), this.type = "none";
	}
	clone() {
		return new n({ type: this.type });
	}
};
__decorate([r({
	none: "none",
	stayAbove: "stay-above"
}), a$1({ json: { write: { isRequired: !0 } } })], p.prototype, "type", void 0), p = n = __decorate([c$1("esri.ground.NavigationConstraint")], p);
var i$2 = p;
//#endregion
//#region node_modules/@arcgis/core/Ground.js
var S, I;
var b = I = class extends a$2(u$2) {
	static {
		S = n$5;
	}
	constructor(r) {
		super(r), this[S] = !0, this.parent = null, this.opacity = 1, this.surfaceColor = null, this.undergroundColor = new g$1("white"), this.navigationConstraint = null, this.layers = new q();
		const s = (r) => {
			const { parent: e } = r;
			e && e !== this && "remove" in e && e.remove?.(r), r.parent = this, "elevation" !== r.type && "base-elevation" !== r.type && n$1.getLogger(this).error(`Layer '${r.title}, id:${r.id}' of type '${r.type}' is not supported as a ground layer and will therefore be ignored. Only layers of type 'elevation' are supported.`);
		}, a = (r) => {
			r.parent = null;
		};
		this.addHandles([this.layers.on("after-add", (r) => s(r.item)), this.layers.on("after-remove", (r) => a(r.item))]), this.allLayers = new l$4({ getCollections: () => [this.layers, this.parent?.basemap?.groundLayers] });
	}
	removeChildLayer(r) {
		this.layers.remove(r);
	}
	initialize() {
		this.when().catch((r) => {
			d$1(r) || n$1.getLogger(this).error("#load()", "Failed to load ground", r);
		}), this.resourceInfo && this.read(this.resourceInfo.data, this.resourceInfo.context);
	}
	get integratedMeshGround() {
		const r = this.parent?.basemap?.groundLayers.at(0);
		return r?.replacesTerrain ? r : null;
	}
	destroy() {
		const r = this.layers.removeAll();
		for (const e of r) u$1(e);
		this.layers.destroy();
	}
	normalizeCtorArgs(r) {
		return r && "resourceInfo" in r && (this._set("resourceInfo", r.resourceInfo), delete (r = { ...r }).resourceInfo), r;
	}
	get loaded() {
		return super.loaded;
	}
	get layers() {
		return this._get("layers");
	}
	set layers(r) {
		this._set("layers", n$3(r, this._get("layers")));
	}
	writeLayers(r, e, o, t) {
		const s = [];
		r ? (t = {
			...t,
			layerContainerType: "ground"
		}, r.forEach((r) => {
			if ("write" in r) {
				const e = {};
				n$2(r)().write(e, t) && s.push(e);
			} else t$1(t, r);
		}), e.layers = s) : e.layers = s;
	}
	load(r) {
		return this.addResolvingPromise(this._loadFromSource(r)), Promise.resolve(this);
	}
	loadAll() {
		return l$3(this, (r) => r(this.layers));
	}
	async queryElevation(r, e) {
		await this.load({ signal: e?.signal });
		const { queryAll: o } = await import("./ElevationQuery-BqO_7Hn4.js").then((n) => n.t);
		s(e);
		const t = this.layers.filter(A).toArray();
		return this.parent?.basemap?.groundLayers && this.parent?.basemap?.groundLayers.forEach((r) => {
			t.push(r);
		}), o(t, r, e);
	}
	async createElevationSampler(r, e) {
		await this.load({ signal: e?.signal });
		const { createSampler: o } = await import("./ElevationQuery-BqO_7Hn4.js").then((n) => n.t);
		s(e);
		return o(this.layers.filter(A).toArray(), r, e);
	}
	clone() {
		const r = {
			opacity: this.opacity,
			surfaceColor: a(this.surfaceColor),
			undergroundColor: a(this.undergroundColor),
			navigationConstraint: a(this.navigationConstraint),
			layers: this.layers.slice()
		};
		return this.loaded && (r.loadStatus = "loaded"), new I({ resourceInfo: this.resourceInfo }).set(r);
	}
	read(r, e) {
		this.resourceInfo || this._set("resourceInfo", {
			data: r,
			context: e
		}), super.read(r, e);
	}
	_loadFromSource(r) {
		const e = this.resourceInfo;
		return e ? this._loadLayersFromJSON(e.data, e.context, r) : Promise.resolve();
	}
	async _loadLayersFromJSON(r, e, o) {
		const t = e?.origin || "web-scene", s$1 = e?.portal || null, a = e?.url || null, { populateOperationalLayers: i } = await import("./layersCreator-DNyeIoMI.js");
		s(o);
		const n = [];
		if (r.layers && Array.isArray(r.layers)) {
			const e = {
				context: {
					origin: t,
					url: a,
					portal: s$1,
					layerContainerType: "ground"
				},
				defaultLayerType: "ArcGISTiledElevationServiceLayer"
			};
			n.push(i(this.layers, r.layers, e));
		}
		await Promise.allSettled(n);
	}
};
function A(r) {
	return r && "createElevationSampler" in r;
}
__decorate([a$1()], b.prototype, "parent", void 0), __decorate([a$1()], b.prototype, "integratedMeshGround", null), __decorate([a$1({ json: {
	read: !1,
	write: { isRequired: !0 }
} })], b.prototype, "layers", null), __decorate([a$1()], b.prototype, "allLayers", void 0), __decorate([r$1("layers")], b.prototype, "writeLayers", null), __decorate([a$1({ readOnly: !0 })], b.prototype, "resourceInfo", void 0), __decorate([a$1({
	type: Number,
	nonNullable: !0,
	range: {
		min: 0,
		max: 1
	},
	json: {
		type: D,
		read: {
			reader: r$2,
			source: "transparency"
		},
		write: {
			writer: (r, e) => {
				e.transparency = n$6(r);
			},
			target: "transparency"
		}
	}
})], b.prototype, "opacity", void 0), __decorate([a$1({
	type: g$1,
	json: {
		type: [D],
		write: (r, e) => {
			e.surfaceColor = r.toJSON().slice(0, 3);
		}
	}
})], b.prototype, "surfaceColor", void 0), __decorate([a$1({ type: g$1 })], b.prototype, "undergroundColor", void 0), __decorate([a$1({
	type: i$2,
	json: { write: !0 }
})], b.prototype, "navigationConstraint", void 0), b = I = __decorate([c$1("esri.Ground")], b);
var E = b;
//#endregion
//#region node_modules/@arcgis/core/effects/FocusAreaOutline.js
var i$1 = class extends l$5(n$4) {
	constructor(o) {
		super(o), this.color = null;
	}
};
__decorate([a$1({
	type: g$1,
	json: {
		type: [D],
		write: !0
	}
})], i$1.prototype, "color", void 0), i$1 = __decorate([c$1("esri.effects.FocusAreaOutline")], i$1);
var l$1 = i$1;
//#endregion
//#region node_modules/@arcgis/core/effects/FocusArea.js
var d = class extends a$2(f$2) {
	constructor(e) {
		super(e), this.id = `focusarea-${n$7()}`, this.title = null, this.enabled = !0, this.outline = null, this.geometries = new p$2();
	}
	readGeometries(e, o, r) {
		Array.isArray(e) ? this.geometries = p$2.fromJSON(e, r) : "web-scene" !== r.origin && "portal-item" !== r.origin || r.hooks?.onAfterLoad?.(() => this._loadGeometries(p$1(e, r), r));
	}
	async _loadGeometries(e, r) {
		const t = await f(e, { responseType: "json" });
		this.geometries = p$2.fromJSON(t.data, r);
	}
};
__decorate([a$1({
	type: String,
	nonNullable: !0,
	json: {
		write: !0,
		origins: { "web-scene": { write: { isRequired: !0 } } }
	}
}), a$1()], d.prototype, "id", void 0), __decorate([a$1({
	type: String,
	json: { write: !0 }
})], d.prototype, "title", void 0), __decorate([a$1({
	type: Boolean,
	nonNullable: !0,
	json: {
		write: !0,
		origins: { "web-scene": { write: { isRequired: !0 } } }
	}
})], d.prototype, "enabled", void 0), __decorate([a$1({
	type: l$1,
	json: { write: !0 }
})], d.prototype, "outline", void 0), __decorate([a$1({
	type: p$2,
	nonNullable: !0,
	json: {
		write: !0,
		origins: { "web-scene": { write: { isRequired: !0 } } }
	},
	clonable: (e) => new p$2(e.items.map((e) => e.clone()))
}), j$1({
	origins: ["web-scene", "portal-item"],
	type: "resource",
	prefix: "geometries",
	contentAddressed: !0
})], d.prototype, "geometries", void 0), __decorate([o([
	"web-scene",
	"portal-item",
	"service"
], "geometries")], d.prototype, "readGeometries", null), d = __decorate([c$1("esri.effects.FocusArea")], d);
var u = d;
//#endregion
//#region node_modules/@arcgis/core/effects/FocusAreas.js
var l = class extends a$2(f$2) {
	constructor(o) {
		super(o), this.areas = new q(), this.style = "bright";
	}
};
__decorate([a$1({
	type: q.ofType(u),
	nonNullable: !0,
	json: {
		write: !0,
		origins: { "web-scene": { write: { isRequired: !0 } } }
	},
	clonable: (o) => new q(o.items.map((o) => o.clone()))
})], l.prototype, "areas", void 0), __decorate([a$1({
	type: ["bright", "dark"],
	nonNullable: !0,
	json: { write: !0 }
})], l.prototype, "style", void 0), l = __decorate([c$1("esri.effects.FocusAreas")], l);
var c = l;
//#endregion
//#region node_modules/@arcgis/core/support/groundUtils.js
var i = {
	"world-elevation": {
		id: "worldElevation",
		url: "//elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
		layerType: "ArcGISTiledElevationServiceLayer"
	},
	"world-topobathymetry": {
		id: "worldTopoBathymetry",
		url: "//elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/TopoBathy3D/ImageServer",
		layerType: "ArcGISTiledElevationServiceLayer"
	}
};
function t(t) {
	if ("string" != typeof t) return w(E, t);
	if (t in i) {
		const e = i[t];
		return new E({ resourceInfo: { data: { layers: [e] } } });
	}
	return n$1.getLogger("esri.support.groundUtils").warn(`Unable to find ground definition for: ${t}. Try "world-elevation"`), null;
}
//#endregion
//#region node_modules/@arcgis/core/Map.js
var g = class extends n$8(d$2(l$2)) {
	constructor(e$1) {
		super(e$1), this._allLayers = new l$4({
			getCollections: () => [
				this.basemap?.baseLayers,
				this.basemap?.groundLayers,
				this.ground?.layers,
				this.layers,
				this.basemap?.referenceLayers
			],
			getChildrenFunction: (e) => "layers" in e ? e.layers : null
		}), this.focusAreas = new c(), this.allTables = t$2(this), this.editableLayers = new l$4({
			getCollections: () => [this.allLayers],
			itemFilterFunction: e
		}), this._basemapCache = f$3(), this.ground = new E(), this.addHandles(f$1(() => this.ground, (e, s) => {
			s?.parent === this && (s.parent = null), e.parent = this;
		}, {
			sync: !0,
			initial: !0
		}));
	}
	destroy() {
		l$6(this._basemapCache), this._basemapCache = null, this.focusAreas.destroy(), this.allLayers.destroy(), this.allTables.destroy(), this.editableLayers.destroy(), this.basemap = u$1(this.basemap), u$1(this.ground), this._set("ground", null);
	}
	get allLayers() {
		return this._allLayers;
	}
	get basemap() {
		return this._get("basemap");
	}
	set basemap(e) {
		this._set("basemap", p$3(e, this._basemapCache));
	}
	get ground() {
		return this._get("ground");
	}
	set ground(e) {
		const s = t(e);
		null != s && this._set("ground", s);
	}
	findLayerById(e) {
		return this.allLayers.find((s) => s.id === e);
	}
	findTableById(e) {
		return this.allTables.find((s) => s.id === e);
	}
};
__decorate([a$1({ readOnly: !0 })], g.prototype, "allLayers", null), __decorate([a$1({
	type: c,
	nonNullable: !0,
	json: { write: { overridePolicy: (e) => ({
		enabled: e.areas.length > 0,
		ignoreOrigin: !0
	}) } }
})], g.prototype, "focusAreas", void 0), __decorate([a$1({ readOnly: !0 })], g.prototype, "allTables", void 0), __decorate([a$1({
	type: F,
	useTypeForAutocast: !1,
	json: {
		read: { source: "baseMap" },
		write: { target: "baseMap" }
	},
	value: null
})], g.prototype, "basemap", null), __decorate([a$1({ readOnly: !0 })], g.prototype, "editableLayers", void 0), __decorate([a$1({
	type: E,
	useTypeForAutocast: !1,
	nonNullable: !0
})], g.prototype, "ground", null), __decorate([a$1()], g.prototype, "undoRedo", void 0), g = __decorate([c$1("esri.Map")], g);
var j = g;
//#endregion
export { j as t };

//# sourceMappingURL=Map-D-G56Z6R.js.map