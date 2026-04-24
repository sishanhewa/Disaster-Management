import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./mathUtils-hEBUcrMa.js";
import "./aaBoundingRect-CgUWvAgv.js";
import "./Cyclical-BTNbmw1N.js";
import { n as h, r as l$1 } from "./dataUtils-DWp1Pvuo.js";
import { r as s, t as d } from "./loadUtils-CuYeteL6.js";
//#region node_modules/@arcgis/core/views/3d/support/flow/FlowWorker.js
var o = class {
	constructor() {
		this._tileData = /* @__PURE__ */ new Map();
	}
	async generateStreamlines(t) {
		const { flowData: e, flowExtentInfo: s, needsMagnitude: a, simulationSettings: r, startPositions: o } = t, n = l(h(r, e), r, s.modelSize, a, o);
		return {
			result: { streamlines: n },
			transferList: n?.map((t) => t.vertices.buffer)
		};
	}
	async generateTiledStreamlines(t) {
		const { flowDataTiles: e, flowExtentInfo: a, needsMagnitude: i, reset: r, simulationSettings: o, startPositions: n } = t;
		this._updateTileData(e, r);
		const f = l(d(o, this._tileData, a), o, a.modelSize, i, n);
		return {
			result: { streamlines: f },
			transferList: f?.map((t) => t.vertices.buffer) ?? []
		};
	}
	_updateTileData(t, e) {
		if (e) for (const s of this._tileData.keys()) t.has(s) || this._tileData.delete(s);
		t.forEach((t, e) => {
			"delete" === t.type ? this._tileData.delete(e) : "on-worker" !== t.type && "invalid" !== t.type && this._tileData.set(e, t.data);
		});
	}
};
o = __decorate([c("esri.views.3d.support.flow.FlowWorker")], o);
var n = o;
function l(t, e, s$1, i, o) {
	if (null == t) return;
	const n = l$1(e, t, s$1[0], s$1[1], { positions: o }), l = [], f = s(i);
	for (const { vertices: a, stage: r } of n) {
		const t = new Float32Array(a.length * f);
		for (let e = 0; e < a.length; e++) t[e * f] = a[e].x, t[e * f + 1] = a[e].y, t[e * f + 2] = a[e].time, i && (t[e * f + 3] = a[e].speed);
		l.push({
			vertices: t,
			stage: r,
			hasMagnitude: i
		});
	}
	return l;
}
//#endregion
export { n as default };

//# sourceMappingURL=FlowWorker-Iml4pnA6.js.map