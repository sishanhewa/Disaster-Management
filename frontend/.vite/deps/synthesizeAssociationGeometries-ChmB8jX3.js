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
import "./typeUtils-CFnTDMtU.js";
import "./NetworkElement-Bc_17I9h.js";
import "./TelecomNetworkElement-CK1MxXNb.js";
import { t as u$1 } from "./Association-CbQaWt5x.js";
//#region node_modules/@arcgis/core/rest/networks/support/AssociationGeometriesResult.js
var i$1 = class extends n$1 {
	constructor(o) {
		super(o), this.maxGeometryCountExceeded = !1, this.associations = [];
	}
};
__decorate([a({
	type: Boolean,
	json: { write: !0 }
})], i$1.prototype, "maxGeometryCountExceeded", void 0), __decorate([a({
	type: [u$1],
	json: { write: !0 }
})], i$1.prototype, "associations", void 0), i$1 = __decorate([c("esri.rest.networks.support.AssociationGeometriesResult")], i$1);
//#endregion
//#region node_modules/@arcgis/core/rest/networks/synthesizeAssociationGeometries.js
async function n(r, n, a) {
	const c = f$1(r), f$2 = {
		...n.toJSON(),
		f: "json"
	}, m = u({
		...c.query,
		...f$2
	});
	a ? a.method = "post" : a = { method: "post" };
	const p = s(m, a);
	return f(`${c.path}/synthesizeAssociationGeometries`, p).then((t) => i(t, n.outSpatialReference));
}
function i(t, e) {
	const { data: o } = t;
	if (e) for (const s of o.associations) s.geometry.spatialReference || (s.geometry.spatialReference = e.clone());
	return i$1.fromJSON(o);
}
//#endregion
export { n as synthesizeAssociationGeometries };

//# sourceMappingURL=synthesizeAssociationGeometries-ChmB8jX3.js.map