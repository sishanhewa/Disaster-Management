import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { t as f } from "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./Evented-GLJbxWO5.js";
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
import "./apiKeyUtils-Bv2Uwsd3.js";
import "./reactiveUtils-DRpp6Nmg.js";
import "./mathUtils-hEBUcrMa.js";
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
import "./Multipoint-B5Liskmz.js";
import { i as u, n as f$1, r as s } from "./utils-5irCjX9t.js";
import "./versionManagementUtils-DdkGBUES.js";
import "./EditBusLayer-BrMVPiuf.js";
import "./typeUtils-CFnTDMtU.js";
import "./NetworkElement-Bc_17I9h.js";
import "./TelecomNetworkElement-CK1MxXNb.js";
import "./Circuit-B-XJxsTt.js";
import "./TraceLocation-DqkqiD8w.js";
import "./CircuitLocation-DO9dNaIi.js";
import { t as d } from "./TraceResult-DRxRVEMl.js";
//#region node_modules/@arcgis/core/rest/networks/trace.js
async function n(o, n, a) {
	const i = f$1(o), u$1 = n.toJSON();
	u$1.traceLocations = JSON.stringify(n.traceLocations), n.resultTypes && (u$1.resultTypes = JSON.stringify(n.resultTypes)), n.moment || "SDE.DEFAULT" !== n.gdbVersion?.toUpperCase() && n.gdbVersion || (u$1.moment = Date.now());
	const y = s(i.query, {
		query: u({
			...u$1,
			f: "json"
		}),
		...a
	});
	return f(`${i.path}/trace`, y).then((t) => c(t));
}
async function a(o, n, a) {
	const c = f$1(o), i = n.toJSON();
	i.traceLocations = JSON.stringify(n.traceLocations), n.resultTypes && (i.resultTypes = JSON.stringify(n.resultTypes));
	const u$2 = s(c.query, {
		query: u({
			...i,
			async: !0,
			f: "json"
		}),
		...a
	}), { data: p } = await f(`${c.path}/trace`, u$2);
	return p.statusUrl;
}
function c(t) {
	const { data: s } = t;
	return d.fromJSON(s.traceResults);
}
//#endregion
export { a as submitTraceJob, n as trace };

//# sourceMappingURL=trace-bIpMRS_r.js.map