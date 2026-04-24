import { A as has } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./SimpleObservable-CNlRjEs1.js";
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
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
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
import "./mat4-CCf33Vjt.js";
import "./mat4f64-BA1Qbgtv.js";
import "./vec4-DVix-cmy.js";
import "./vec4f64-SXri5KT8.js";
import "./vec2f64-BKe4utUH.js";
import "./vec3-BfQf1_cT.js";
import { n as c$1 } from "./MeshLocalVertexSpace-BYbh0klK.js";
import "./meshVertexSpaceUtils-BWu8ERFF.js";
import "./projectPointToVector-ChBhT6rD.js";
import "./computeTranslationToOriginAndRotation-BFvldVy8.js";
import "./BufferView-BsD36vI9.js";
import "./Util-QEnjDgyY.js";
import "./vec3-BRQ7MvdQ.js";
import "./vec4-K8MEUVrW.js";
import { r as q } from "./vertexSpaceConversion-CuFAcIQR.js";
import { t as s$1 } from "./PooledRBush-DcZxtmBy.js";
//#region node_modules/@arcgis/core/geometry/support/meshUtils/ElevationSamplerWorker.js
var n = class {
	async createIndex(t, r) {
		const n = new Array();
		if (!t.vertexAttributes?.position) return new s$1();
		const o = a(t), s = null != r ? await r.invoke("createIndexThread", o, { transferList: n }) : this.createIndexThread(o).result;
		return i().fromJSON(s);
	}
	createIndexThread(e) {
		const t = i();
		if (!e) return { result: t.toJSON() };
		const r = new Float64Array(e.position);
		return e.components ? s(t, r, e.components.map((e) => new Uint32Array(e))) : o(t, r);
	}
};
function o(e, t) {
	const r = new Array(t.length / 9);
	let n = 0;
	for (let o = 0; o < t.length; o += 9) r[n++] = c(t, o, o + 3, o + 6);
	return e.load(r), { result: e.toJSON() };
}
function s(e, t, r) {
	let n = 0;
	for (const a of r) n += a.length / 3;
	const o = new Array(n);
	let s = 0;
	for (const a of r) for (let e = 0; e < a.length; e += 3) o[s++] = c(t, 3 * a[e], 3 * a[e + 1], 3 * a[e + 2]);
	return e.load(o), { result: e.toJSON() };
}
function a(e) {
	const { vertexAttributes: { position: n }, vertexSpace: o, spatialReference: s, transform: a } = e, i = q({
		vertexAttributes: { position: n },
		vertexSpace: o,
		spatialReference: s,
		transform: a
	}, c$1.absolute, { allowBufferReuse: !0 })?.position;
	return i ? !e.components || e.components.some((e) => !e.faces) ? { position: i.buffer } : {
		position: i.buffer,
		components: e.components.map((e) => e.faces)
	} : null;
}
function i() {
	return new s$1(9, has("esri-csp-restrictions") ? (e) => e : [
		".minX",
		".minY",
		".maxX",
		".maxY"
	]);
}
function c(e, t, r, n) {
	return {
		minX: Math.min(e[t], e[r], e[n]),
		maxX: Math.max(e[t], e[r], e[n]),
		minY: Math.min(e[t + 1], e[r + 1], e[n + 1]),
		maxY: Math.max(e[t + 1], e[r + 1], e[n + 1]),
		p0: [
			e[t],
			e[t + 1],
			e[t + 2]
		],
		p1: [
			e[r],
			e[r + 1],
			e[r + 2]
		],
		p2: [
			e[n],
			e[n + 1],
			e[n + 2]
		]
	};
}
//#endregion
export { n as default };

//# sourceMappingURL=ElevationSamplerWorker-TcFSS_y-.js.map