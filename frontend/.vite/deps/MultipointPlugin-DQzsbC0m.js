import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
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
import "./reactiveUtils-DRpp6Nmg.js";
import "./mathUtils-hEBUcrMa.js";
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
import { r as c$1 } from "./typeUtils-DaICxhuY.js";
import "./UpdatingHandles-BpejPsAZ.js";
import { t as n } from "./PluginBase-aHv44JPd.js";
//#region node_modules/@arcgis/core/views/draw/plugins/MultipointPlugin.js
var s = class extends n {
	get helpMessageKey() {
		return "multipoint";
	}
	start(e) {
		super.start(e), e.session.appendOrReplacePart(null, []);
	}
	beforeAttachPlugin(e) {
		return {
			useStandaloneSession: !0,
			geometryType: "point"
		};
	}
	detachPlugin(e, t) {
		if ("complete" !== t) return;
		const o = this._context?.getSession(e), n = this._session, s = o?.generatePreviewGeometry({
			includeAutomaticConnection: !1,
			geometryType: "point"
		});
		s && c$1(s) && n && (n.appendOrReplacePoint(null, s), n.appendOrReplacePart(null, []), n.automaticRestart = !1, n.groupGeometryChanges()), e.configuration && this._context?.requestBeginDownstreamPlugin(e.configuration);
	}
};
__decorate([a()], s.prototype, "helpMessageKey", null), s = __decorate([c("esri.views.draw.plugins.MultipointPlugin")], s);
//#endregion
export { s as MultipointPlugin };

//# sourceMappingURL=MultipointPlugin-DQzsbC0m.js.map