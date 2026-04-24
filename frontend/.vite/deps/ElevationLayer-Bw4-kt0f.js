import { n as __exportAll } from "./chunk-BoAXSpZd.js";
import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { t as r$1 } from "./Error-CzxduO2m.js";
import { M as A, t as f } from "./request-CuG5cxow.js";
import { A as t$1, b as s$1, p as f$1 } from "./promiseUtils-DhYhergm.js";
import { a as o, n as c, t as a } from "./decorators-DE7S5xmd.js";
import { t as b$1 } from "./Layer-BKiNQen_.js";
import { t as e } from "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import { t as l } from "./ArcGISService-BFbH4hVT.js";
import { t as m } from "./HeightModelInfo-CaK_zgTy.js";
import { h as y } from "./commonProperties-DQjThAJZ.js";
import { t as g } from "./OperationalLayer-CaAaD2Zf.js";
import { t as _ } from "./PortalLayer-B3x-_Tp7.js";
import { t as l$1 } from "./TerrainConst-DkJAX4Om.js";
import { t as s$2 } from "./ArcGISCachedService-BdSbWBW2.js";
import { t as u } from "./ElevationTileData-D2eRXFZ5.js";
import { t as o$1 } from "./WorkerHandle-9hUSbPch.js";
//#region node_modules/@arcgis/core/layers/support/LercDecoder.js
var r = class extends o$1 {
	constructor(e = null) {
		super("LercWorker", "_decode", { _decode: (e) => [e.buffer] }, e, { strategy: "dedicated" }), this.schedule = e, this.ref = 0;
	}
	decode(e, r, t) {
		return e && 0 !== e.byteLength ? this.invoke({
			buffer: e,
			options: r
		}, t) : Promise.resolve(null);
	}
	release() {
		--this.ref <= 0 && (t.forEach((e, r) => {
			e === this && t.delete(r);
		}), this.destroy());
	}
};
var t = /* @__PURE__ */ new Map();
function s(e = null) {
	let s = t.get(e);
	return s || (null != e ? (s = new r((r) => e.immediate.schedule(r)), t.set(e, s)) : (s = new r(), t.set(null, s))), ++s.ref, s;
}
//#endregion
//#region node_modules/@arcgis/core/layers/ElevationLayer.js
var ElevationLayer_exports = /* @__PURE__ */ __exportAll({ default: () => b });
var j = class extends s$2(l(g(_(e(b$1))))) {
	constructor(...e) {
		super(...e), this.capabilities = { operations: { supportsTileMap: !1 } }, this.copyright = null, this.heightModelInfo = null, this.path = null, this.minScale = void 0, this.maxScale = void 0, this.opacity = 1, this.operationalLayerType = "ArcGISTiledElevationServiceLayer", this.sourceJSON = null, this.type = "elevation", this.url = null, this.version = null, this._lercDecoder = s();
	}
	normalizeCtorArgs(e, r) {
		return "string" == typeof e ? {
			url: e,
			...r
		} : e;
	}
	destroy() {
		this._lercDecoder = t$1(this._lercDecoder);
	}
	readCapabilities(e, r) {
		const t = r.capabilities && r.capabilities.split(",").map((e) => e.toLowerCase().trim());
		if (!t) return { operations: { supportsTileMap: !1 } };
		return { operations: { supportsTileMap: t.includes("tilemap") } };
	}
	readVersion(e, r) {
		let t = r.currentVersion;
		return t || (t = 9.3), t;
	}
	load(e) {
		const r = null != e ? e.signal : null;
		return this.addResolvingPromise(this.loadFromPortal({
			supportedTypes: ["Image Service"],
			supportsData: !1,
			validateItem: (e) => {
				if (e.typeKeywords) {
					for (let r = 0; r < e.typeKeywords.length; r++) if ("elevation 3d layer" === e.typeKeywords[r].toLowerCase()) return !0;
				}
				throw new r$1("portal:invalid-layer-item-type", "Invalid layer item type '${type}', expected '${expectedType}' ", {
					type: "Image Service",
					expectedType: "Image Service Elevation 3D Layer"
				});
			}
		}, e).catch(f$1).then(() => this._fetchImageService(r))), Promise.resolve(this);
	}
	fetchTile(e, t, i, o) {
		const a = o?.signal, s = {
			responseType: "array-buffer",
			signal: a
		}, p = {
			noDataValue: o?.noDataValue,
			returnFileInfo: !0
		};
		return this.load().then(() => this._fetchTileAvailability(e, t, i, o)).then(() => f(this.getTileUrl(e, t, i), s)).then((e) => this._lercDecoder.decode(e.data, p, a)).then((e) => new u(e ? new u({
			values: e.pixelData,
			width: e.width,
			height: e.height,
			noDataValue: e.noDataValue
		}) : {
			values: [],
			width: 0,
			height: 0,
			noDataValue: o?.noDataValue ?? l$1
		}));
	}
	getTileUrl(e, r, t) {
		const i = !this.capabilities.operations.supportsTileMap && this.supportsBlankTile, o = A({
			...this.parsedUrl.query,
			blankTile: !i && null
		});
		return `${this.parsedUrl.path}/tile/${e}/${r}/${t}${o ? "?" + o : ""}`;
	}
	async queryElevation(e, r) {
		const { query: t } = await import("./ElevationQuery-BqO_7Hn4.js").then((n) => n.t);
		return s$1(r), t(this, e, r);
	}
	async createElevationSampler(e, r) {
		const { createSampler: t } = await import("./ElevationQuery-BqO_7Hn4.js").then((n) => n.t);
		return s$1(r), t(this, e, r);
	}
	_fetchTileAvailability(e, r, t, i) {
		return this.tilemapCache ? this.tilemapCache.fetchAvailability(e, r, t, i) : Promise.resolve("unknown");
	}
	async _fetchImageService(e) {
		if (this.sourceJSON) return this.sourceJSON;
		const t = {
			query: {
				f: "json",
				...this.parsedUrl.query
			},
			responseType: "json",
			signal: e
		}, i = await f(this.parsedUrl.path, t);
		i.ssl && (this.url = this.url?.replace(/^http:/i, "https:")), this.sourceJSON = i.data, this.read(i.data, {
			origin: "service",
			url: this.parsedUrl
		});
	}
	get hasOverriddenFetchTile() {
		return !this.fetchTile[T];
	}
};
__decorate([a({ readOnly: !0 })], j.prototype, "capabilities", void 0), __decorate([o("service", "capabilities", ["capabilities"])], j.prototype, "readCapabilities", null), __decorate([a({ json: { read: { source: "copyrightText" } } })], j.prototype, "copyright", void 0), __decorate([a({
	readOnly: !0,
	type: m
})], j.prototype, "heightModelInfo", void 0), __decorate([a({
	type: String,
	json: {
		origins: { "web-scene": {
			read: !0,
			write: !0
		} },
		read: !1
	}
})], j.prototype, "path", void 0), __decorate([a({ type: ["show", "hide"] })], j.prototype, "listMode", void 0), __decorate([a({
	json: {
		read: !1,
		write: !1,
		origins: {
			service: {
				read: !1,
				write: !1
			},
			"portal-item": {
				read: !1,
				write: !1
			},
			"web-document": {
				read: !1,
				write: !1
			}
		}
	},
	readOnly: !0
})], j.prototype, "minScale", void 0), __decorate([a({
	json: {
		read: !1,
		write: !1,
		origins: {
			service: {
				read: !1,
				write: !1
			},
			"portal-item": {
				read: !1,
				write: !1
			},
			"web-document": {
				read: !1,
				write: !1
			}
		}
	},
	readOnly: !0
})], j.prototype, "maxScale", void 0), __decorate([a({ json: {
	read: !1,
	write: !1,
	origins: { "web-document": {
		read: !1,
		write: !1
	} }
} })], j.prototype, "opacity", void 0), __decorate([a({ type: ["ArcGISTiledElevationServiceLayer"] })], j.prototype, "operationalLayerType", void 0), __decorate([a()], j.prototype, "sourceJSON", void 0), __decorate([a({
	json: { read: !1 },
	value: "elevation",
	readOnly: !0
})], j.prototype, "type", void 0), __decorate([a(y)], j.prototype, "url", void 0), __decorate([a()], j.prototype, "version", void 0), __decorate([o("version", ["currentVersion"])], j.prototype, "readVersion", null), j = __decorate([c("esri.layers.ElevationLayer")], j);
var T = Symbol("default-fetch-tile");
j.prototype.fetchTile[T] = !0;
var b = j;
//#endregion
export { ElevationLayer_exports as t };

//# sourceMappingURL=ElevationLayer-Bw4-kt0f.js.map