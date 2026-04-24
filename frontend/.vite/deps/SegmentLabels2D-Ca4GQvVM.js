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
import "./Promise-Dhhz7kXA.js";
import "./Loadable-CQsALnOO.js";
import "./asyncUtils-D83Q647Q.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import "./Portal-DYysvbhZ.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import "./messages-BSXJ_xjI.js";
import "./reactiveUtils-DRpp6Nmg.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import "./Color-C99QAF80.js";
import { p as v } from "./curveUtils-CfkOAT4m.js";
import "./coordsUtils-DXLB9bAf.js";
import "./aaBoundingRect-CgUWvAgv.js";
import "./common-BxLRDsKd.js";
import "./vec2-BPF6SpMH.js";
import "./curveExtent--ue9-x0m.js";
import "./mat3-CPqND9LM.js";
import "./mat3f64-DZZP34-L.js";
import "./Polyline-Cv0nwof6.js";
import "./vec3f64-CwISzc_v.js";
import { i as f } from "./screenUtils-BR-xd7ya.js";
import "./Cyclical-BTNbmw1N.js";
import "./number-DwLpDjta.js";
import "./intl-1FbLkipu.js";
import "./lengthUtils-DrG-JkjU.js";
import "./unitConversionUtils-dsyJpUwL.js";
import "./vec4-DVix-cmy.js";
import "./vec4f64-SXri5KT8.js";
import "./sanitizerUtils-D4_LRYnp.js";
import "./projector-76ZJJlBX.js";
import "./vec2f64-BKe4utUH.js";
import { i as F } from "./vec3-BfQf1_cT.js";
import "./elevationInfoUtils-BTAkLxlB.js";
import "./colorUtils-RKWmAehh.js";
import "./quantity-B4e5bEqI.js";
import "./getDefaultUnitForView-BJSbSmh_.js";
import "./unitFormatUtils-DytVjSyU.js";
import "./quantityFormatUtils-D1io5Xca.js";
import "./vec3-ByKKGMhe.js";
import { t as V } from "./SegmentLabels-Btmyx_G0.js";
//#region node_modules/@arcgis/core/views/2d/interactive/SegmentLabels2D.js
var i = class extends V {
	getCameraOrExtent({ view: e }) {
		return e.extent;
	}
	toScreenPointArray({ view: e, editGeometryOperations: r }, o, s = f()) {
		const { coordinateHelper: n } = r.data, i = e.toScreen(n.arrayToPoint(o));
		return i && (s[0] = i.x, s[1] = i.y), s;
	}
	getRing(e, t, r, n, i) {
		const a = [];
		for (const o of t.parts[i].iterateVertices()) o.leftSegment ? a.push(o.leftSegment.toCurveOrCoordinate()) : a.push(o.pos);
		if (0 === i && null != r && a.push(n.vectorToArray(r)), a.length < 2) return a;
		const c = a[0], m = a.at(-1), p = n.toXYZ(n.arrayToVector(v(c))), l = n.toXYZ(n.arrayToVector(v(m)));
		return "polygon" === e.type && a.length > 2 && !F(p, l) && a.push(c), a;
	}
};
i = __decorate([c("esri.views.2d.interactive.SegmentLabels2D")], i);
//#endregion
export { i as SegmentLabels2D };

//# sourceMappingURL=SegmentLabels2D-Ca4GQvVM.js.map