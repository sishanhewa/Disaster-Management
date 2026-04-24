import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { w as a } from "./Error-CzxduO2m.js";
import { V as I, t as f } from "./request-CuG5cxow.js";
import { i as r, n as c, t as a$1, v as t } from "./decorators-DE7S5xmd.js";
import { t as q } from "./Collection-BAJSKCip.js";
import { n, t as a$2 } from "./JSONSupport-BUaD4jSd.js";
import { t as j } from "./persistable-D3uxCw6O.js";
import { t as j$1 } from "./Polygon-CCBjbbXT.js";
import { g as tn, u as hn } from "./projectionUtils-CmEsVWfk.js";
import { i as r$1, n as a$3 } from "./Lyr3DWorker-9XUANr8_.js";
import { a as u$1, r as g$1 } from "./SceneLayerWorkerHandle-HkfPaEul.js";
//#region node_modules/@arcgis/core/layers/support/SceneModification.js
var u;
var g = u = class extends n {
	constructor(e) {
		super(e), this.geometry = null, this.type = "clip";
	}
	writeGeometry(e, r, t$1, s) {
		if (s.layer?.spatialReference && 115700 === s.layer?.spatialReference.vcsWkid) {
			let e = !0;
			if (a$3()) {
				const i = r$1({
					modifications: u$1(null, [this], s.layer?.spatialReference),
					inVCS: 5773
				});
				if (i.success && i.modifications) {
					const o = g$1(i.modifications, this);
					o && (r[t$1] = o.toJSON(s), e = !1);
				}
			}
			if (e) return void (s?.messages && s.messages.push(new t("scenemodification:unsupported", "Scene modifications with incompatible spatial references are not supported", {
				modification: this,
				spatialReference: s.layer.spatialReference,
				context: s
			})));
		} else if (s.layer?.spatialReference && !s.layer.spatialReference.equals(this.geometry.spatialReference)) {
			if (!tn(e.spatialReference, s.layer.spatialReference)) return void (s?.messages && s.messages.push(new t("scenemodification:unsupported", "Scene modifications with incompatible spatial references are not supported", {
				modification: this,
				spatialReference: s.layer.spatialReference,
				context: s
			})));
			const i = new j$1();
			hn(e, i, s.layer.spatialReference), r[t$1] = i.toJSON(s);
		} else r[t$1] = e.toJSON(s);
	}
	clone() {
		return new u({
			geometry: a(this.geometry),
			type: this.type
		});
	}
};
__decorate([a$1({ type: j$1 }), j()], g.prototype, "geometry", void 0), __decorate([r(["web-scene", "portal-item"], "geometry")], g.prototype, "writeGeometry", null), __decorate([a$1({
	type: [
		"clip",
		"mask",
		"replace"
	],
	nonNullable: !0
}), j()], g.prototype, "type", void 0), g = u = __decorate([c("esri.layers.support.SceneModification")], g);
//#endregion
//#region node_modules/@arcgis/core/layers/support/SceneModifications.js
var m;
var p = m = class extends a$2(q.ofType(g)) {
	constructor(r) {
		super(r), this.url = null;
	}
	clone() {
		return new m({
			url: this.url,
			items: this.items.map((r) => r.clone())
		});
	}
	toJSON(r) {
		return this.toArray().map((o) => o.toJSON(r)).filter((r) => !!r.geometry);
	}
	static fromJSON(r, o) {
		const t = new m();
		for (const e of r) t.add(g.fromJSON(e, o));
		return t;
	}
	static async fromUrl(r, t, e) {
		const i = {
			url: I(r),
			origin: "service"
		}, n = await f(r, {
			responseType: "json",
			signal: e?.signal
		}), p = t.toJSON(), a = [];
		for (const o of n.data) a.push(g.fromJSON({
			...o,
			geometry: {
				spatialReference: p,
				...o.geometry
			}
		}, i));
		return new m({
			url: r,
			items: a
		});
	}
};
__decorate([a$1({ type: String })], p.prototype, "url", void 0), p = m = __decorate([c("esri.layers.support.SceneModifications")], p);
//#endregion
export { p as t };

//# sourceMappingURL=SceneModifications-CQus78h5.js.map