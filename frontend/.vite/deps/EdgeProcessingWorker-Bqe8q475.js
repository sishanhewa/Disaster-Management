import "./typedArrayUtil-BAuNmygZ.js";
import "./PooledArray-ChtfzjBt.js";
import "./mathUtils-hEBUcrMa.js";
import "./common-BxLRDsKd.js";
import "./vec2-BPF6SpMH.js";
import "./vec3f64-CwISzc_v.js";
import "./vec4-DVix-cmy.js";
import "./vec4f64-SXri5KT8.js";
import "./vec2f64-BKe4utUH.js";
import "./vec3-BfQf1_cT.js";
import "./enums-DUaXkkTm.js";
import "./Indices-DB34mfoI.js";
import "./deduplicate-hU9JgWcz.js";
import "./BufferView-BsD36vI9.js";
import "./Util-QEnjDgyY.js";
import "./InterleavedLayout-DXooKt4K.js";
import "./FloatArray-B6XX6BxB.js";
import "./TextureBackedBufferLayout-CyySbGgQ.js";
import "./Normals-BCAHM6Kn.js";
import { n as u$1 } from "./workerHelper-re_-cH-I.js";
import { a as d$1, i as g, n as c$1, o as n, r as f$1, t as a } from "./edgeProcessing-DXNqWbLW.js";
//#region node_modules/@arcgis/core/views/3d/webgl-engine/lib/edgeRendering/EdgeProcessingWorker.js
var o = class {
	async extract(e) {
		const t = c(e), n = c$1(t), r = [t.data.buffer];
		return {
			result: u(n, r),
			transferList: r
		};
	}
	async extractComponentsEdgeLocations(t) {
		const s = c(t), a = d$1(f$1(s.data, s.skipDeduplicate, s.indices, s.indicesLength), p), o = [];
		return {
			result: u$1(a.regular.instancesData, o),
			transferList: o
		};
	}
	async extractEdgeLocations(t) {
		const s = c(t), a = d$1(f$1(s.data, s.skipDeduplicate, s.indices, s.indicesLength), f), o = [];
		return {
			result: u$1(a.regular.instancesData, o),
			transferList: o
		};
	}
};
function c(e) {
	return {
		data: n.createView(e.dataBuffer),
		indices: "Uint32Array" === e.indicesType ? new Uint32Array(e.indices) : "Uint16Array" === e.indicesType ? new Uint16Array(e.indices) : "Uint8Array" === e.indicesType ? new Uint8Array(e.indices) : e.indices,
		indicesLength: e.indicesLength,
		writerSettings: e.writerSettings,
		skipDeduplicate: e.skipDeduplicate
	};
}
function u(t, n) {
	n.push(t.regular.lodInfo.lengths.buffer), n.push(t.silhouette.lodInfo.lengths.buffer);
	return {
		regular: {
			instancesData: u$1(t.regular.instancesData, n),
			lodInfo: { lengths: t.regular.lodInfo.lengths.buffer }
		},
		silhouette: {
			instancesData: u$1(t.silhouette.instancesData, n),
			lodInfo: { lengths: t.silhouette.lodInfo.lengths.buffer }
		},
		averageEdgeLength: t.averageEdgeLength
	};
}
var l = class {
	allocate(e) {
		return g.createBuffer(e);
	}
	trim(e, t) {
		return e.slice(0, t);
	}
	write(e, t, n) {
		e.position0.setVec(t, n.position0), e.position1.setVec(t, n.position1);
	}
};
var d = class {
	allocate(e) {
		return a.createBuffer(e);
	}
	trim(e, t) {
		return e.slice(0, t);
	}
	write(e, t, n) {
		e.position0.setVec(t, n.position0), e.position1.setVec(t, n.position1), e.componentIndex.set(t, n.componentIndex);
	}
};
var f = new l(), p = new d();
//#endregion
export { o as default };

//# sourceMappingURL=EdgeProcessingWorker-Bqe8q475.js.map