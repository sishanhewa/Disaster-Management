import { t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { t as f } from "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import { i as u, n as f$1, r as s } from "./utils-5irCjX9t.js";
import { t as i } from "./ValidateNetworkTopologyResult-zrzK2gHd.js";
//#region node_modules/@arcgis/core/rest/networks/validateNetworkTopology.js
async function o(t, o, d) {
	const l = f$1(t), u$1 = o.toJSON();
	o.validationSet && (u$1.validationSet = JSON.stringify(o.validationSet));
	const c = {
		...u$1,
		returnEdits: !0,
		f: "json"
	}, f$2 = s(u({
		...l.query,
		...c
	}), {
		...d,
		method: "post"
	}), { data: v } = await f(`${l.path}/validateNetworkTopology`, f$2);
	return i.fromJSON(n(v));
}
async function d(r$1, o, d) {
	if (!o.gdbVersion) throw new r("submit-validate-network-topology-job:missing-gdb-version", "version is missing");
	const n = f$1(r$1), l = o.toJSON();
	o.validationSet && (l.validationSet = JSON.stringify(o.validationSet));
	const u$2 = s(n.query, {
		query: u({
			...l,
			returnEdits: !0,
			async: !0,
			f: "json"
		}),
		...d,
		method: "post"
	}), { data: p } = await f(`${n.path}/validateNetworkTopology`, u$2);
	return p ? p.statusUrl : null;
}
function n(e) {
	return e.serviceEdits && (e.serviceEdits = e.serviceEdits.map((e) => (e.editedFeatures.spatialReference && (e.editedFeatures.spatialReference = {
		wkid: e.editedFeatures.spatialReference.wkid,
		wkt: e.editedFeatures.spatialReference.wkt,
		wkt2: e.editedFeatures.spatialReference.wkt2,
		latestWkid: e.editedFeatures.spatialReference.latestWkid,
		latestVcsWkid: e.editedFeatures.spatialReference.latestVcsWkid,
		vcsWkid: e.editedFeatures.spatialReference.vcsWkid
	}), e = {
		layerId: e.id,
		editedFeatures: e.editedFeatures
	}))), e;
}
//#endregion
export { n as handleValidateNetworkTopologyResult, d as submitValidateNetworkTopologyJob, o as validateNetworkTopology };

//# sourceMappingURL=validateNetworkTopology-DiNA4IWj.js.map