import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { t as f } from "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c, t as a$1 } from "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import { n } from "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import "./Clonable-D_RHUyXD.js";
import "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import { i as u, n as f$1, r as s } from "./utils-5irCjX9t.js";
import "./UNTraceConfiguration-KHJMMVBN.js";
import "./typeUtils-CFnTDMtU.js";
import { t as c$1 } from "./NamedTraceConfiguration-CnGSAvYn.js";
//#region node_modules/@arcgis/core/rest/networks/support/QueryNamedTraceConfigurationsResult.js
var a = class extends n {
	constructor(r) {
		super(r), this.namedTraceConfigurations = [];
	}
};
__decorate([a$1({
	type: [c$1],
	json: {
		read: { source: "traceConfigurations" },
		write: { target: "traceConfigurations" }
	}
})], a.prototype, "namedTraceConfigurations", void 0), a = __decorate([c("esri.rest.networks.support.QueryNamedTraceConfigurationsResult")], a);
//#endregion
//#region node_modules/@arcgis/core/rest/networks/queryNamedTraceConfigurations.js
async function e(e, n, g) {
	const i = f$1(e), l = n.toJSON();
	n.globalIds && n.globalIds.length > 0 && (l.globalIds = JSON.stringify(n.globalIds)), n.creators && n.creators.length > 0 && (l.creators = JSON.stringify(n.creators)), n.tags && n.tags.length > 0 && (l.tags = JSON.stringify(n.tags)), n.names && n.names.length > 0 && (l.names = JSON.stringify(n.names));
	const m = {
		...l,
		f: "json"
	}, u$1 = s(u({
		...i.query,
		...m
	}), {
		...g,
		method: "post"
	}), { data: p } = await f(`${i.path}/traceConfigurations/query`, u$1);
	return a.fromJSON(p);
}
//#endregion
export { e as queryNamedTraceConfigurations };

//# sourceMappingURL=queryNamedTraceConfigurations-9_Ozd_ZI.js.map