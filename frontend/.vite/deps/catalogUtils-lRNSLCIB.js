import { L as e } from "./promiseUtils-DhYhergm.js";
import { c as w, s as l } from "./reactiveUtils-DRpp6Nmg.js";
import { t as b } from "./Layer-BKiNQen_.js";
//#region node_modules/@arcgis/core/layers/catalog/catalogUtils.js
var a = /* @__PURE__ */ new WeakMap();
function o(i) {
	return !i.destroyed && (a.has(i) || i.addHandles([l(() => {
		const { parent: e } = i;
		return !!(e && e instanceof b) && ("catalog-dynamic-group" === e.type || o(e));
	}, (e) => a.set(i, e), w), e(() => a.delete(i))]), a.get(i));
}
function c(e, t) {
	const r = e.parent, { layer: n } = e;
	if ("map-image" !== n?.type || !n.sourceJSON || !r) return !1;
	const a = n.sourceJSON.layers;
	if (!a) return !1;
	const o = a.find((t) => e.id === t.id), i = "footprints" === t ? "Feature Layer" : "Catalog Dynamic Group Layer";
	return o?.type === i && "Catalog Layer" === a.find((e) => e.id === r.id)?.type;
}
//#endregion
export { o as n, c as t };

//# sourceMappingURL=catalogUtils-lRNSLCIB.js.map