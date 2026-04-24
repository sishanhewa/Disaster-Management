import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n, u as c } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { t as f } from "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c$1, t as a$1 } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import { n as n$1 } from "./JSONSupport-BUaD4jSd.js";
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
import "./mathUtils-hEBUcrMa.js";
import "./curveUtils-CfkOAT4m.js";
import "./aaBoundingRect-CgUWvAgv.js";
import "./common-BxLRDsKd.js";
import "./vec2-BPF6SpMH.js";
import "./curveExtent--ue9-x0m.js";
import "./mat3-CPqND9LM.js";
import "./mat3f64-DZZP34-L.js";
import "./Polyline-Cv0nwof6.js";
import { i as u, n as f$1, r as s } from "./utils-5irCjX9t.js";
import { c as s$1 } from "./typeUtils-CFnTDMtU.js";
import "./NetworkElement-Bc_17I9h.js";
import "./TelecomNetworkElement-CK1MxXNb.js";
import { t as u$1 } from "./Association-CbQaWt5x.js";
//#region node_modules/@arcgis/core/rest/networks/support/QueryAssociationsResult.js
var i = class extends n$1 {
	constructor(o) {
		super(o), this.associations = [];
	}
};
__decorate([a$1({
	type: [u$1],
	json: { write: !0 }
})], i.prototype, "associations", void 0), i = __decorate([c$1("esri.rest.networks.support.QueryAssociationsResult")], i);
//#endregion
//#region node_modules/@arcgis/core/rest/networks/queryAssociations.js
function a(e) {
	const { returnDeletes: t, elements: o, gdbVersion: n, moment: s } = e.toJSON();
	return {
		returnDeletes: t,
		elements: JSON.stringify(o.map((e) => ({
			globalId: e.globalId,
			networkSourceId: e.networkSourceId,
			terminalId: e.terminalId
		}))),
		types: JSON.stringify(e.types.map((e) => s$1.toJSON(e))).replaceAll("\"connectivity\"", "\"junctionJunctionConnectivity\""),
		gdbVersion: n,
		moment: s ?? Date.now()
	};
}
async function p(r, p, m) {
	const u$2 = f$1(r), l = {
		...a(p),
		f: "json"
	}, d = s(u({
		...u$2.query,
		...l
	}), {
		...m,
		method: "post"
	}), { data: g } = await f(`${u$2.path}/associations/query`, d), j = i.fromJSON(g);
	return p.types.includes("connectivity") && c(n.getLogger("esri/rest/networks/support/QueryAssociationsParameters"), "types", {
		replacement: "Please use 'junction-junction-connectivity' instead of 'connectivity'.",
		see: "https://arcg.is/11Tr8a#types",
		version: "4.29",
		warnOnce: !0
	}), j;
}
//#endregion
export { p as queryAssociations };

//# sourceMappingURL=queryAssociations-joPv6fep.js.map