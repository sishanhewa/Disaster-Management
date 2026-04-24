import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { t as f } from "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./Evented-GLJbxWO5.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
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
import "./curveUtils-CfkOAT4m.js";
import "./aaBoundingRect-CgUWvAgv.js";
import "./common-BxLRDsKd.js";
import "./vec2-BPF6SpMH.js";
import "./curveExtent--ue9-x0m.js";
import "./mat3-CPqND9LM.js";
import "./mat3f64-DZZP34-L.js";
import "./Polyline-Cv0nwof6.js";
import { i as u$1, n as f$1, r as s } from "./utils-5irCjX9t.js";
import "./versionManagementUtils-DdkGBUES.js";
import "./EditBusLayer-BrMVPiuf.js";
import "./typeUtils-CFnTDMtU.js";
import "./NetworkElement-Bc_17I9h.js";
import "./TelecomNetworkElement-CK1MxXNb.js";
import { t as S } from "./Circuit-B-XJxsTt.js";
import "./TraceLocation-DqkqiD8w.js";
import "./CircuitLocation-DO9dNaIi.js";
//#region node_modules/@arcgis/core/rest/networks/circuits/support/QueryCircuitsResult.js
var e = class extends n {
	constructor(r) {
		super(r), this.circuits = null, this.circuitNames = null;
	}
};
__decorate([a({
	type: [S],
	json: { write: !0 }
})], e.prototype, "circuits", void 0), __decorate([a({
	type: [String],
	json: { write: !0 }
})], e.prototype, "circuitNames", void 0), e = __decorate([c("esri.rest.networks.circuits.support.QueryCircuitsResult")], e);
//#endregion
//#region node_modules/@arcgis/core/rest/networks/circuits/queryCircuits.js
async function u(u, e$1, c) {
	const p = f$1(u), n = e$1.toJSON();
	e$1.circuits && (n.circuits = JSON.stringify(e$1.circuits)), e$1.resultTypes && (n.resultTypes = JSON.stringify(e$1.resultTypes));
	const m = {
		...n,
		f: "json"
	}, f$2 = s(u$1({
		...p.query,
		...m
	}), {
		...c,
		method: "post",
		authMode: "no-prompt"
	}), { data: l } = await f(`${p.path}/circuits/query`, f$2);
	return e.fromJSON(l);
}
//#endregion
export { u as queryCircuits };

//# sourceMappingURL=queryCircuits-Ci7zApZN.js.map