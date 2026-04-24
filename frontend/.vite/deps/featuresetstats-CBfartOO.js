import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import "./decorators-DE7S5xmd.js";
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
import "./locale-BdrQIP_a.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import { i as DateTime } from "./UnknownTimeZone-Dk-CZx5e.js";
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
import "./jsonUtils-D_oLUjKv.js";
import "./fieldType-D7SwLPxF.js";
import { i as o, n as f, o as t, t as e } from "./guards-06ZwtKv3.js";
import "./Field-jzopk-Sr.js";
import { o as n } from "./enum-D9ePJlKL.js";
import { o as m } from "./TimeOnly-DiAMH6GI.js";
import { Y as oe, ct as z, o as B, rt as ue, tt as te, v as K, y as Ke } from "./deepClone-Cw0Dfuaj.js";
import "./shared-BrEWD0Qh.js";
import "./number-D09FUQhc.js";
import "./Dictionary-D2UlVih4.js";
import { t as I } from "./containerUtils-CFU-lPXN.js";
import { a as r, t as M } from "./WhereClause-CROVW3Le.js";
import { t as l } from "./fieldStats-DoMjMie9.js";
//#region node_modules/@arcgis/core/arcade/functions/featuresetstats.js
async function F(n, t, e, r) {
	if (1 === e.length) {
		if (o(e[0])) return l(n, e[0], z(e[1], -1));
		if (te(e[0])) return l(n, e[0].toArray(), z(e[1], -1));
	} else if (2 === e.length) {
		if (o(e[0])) return l(n, e[0], z(e[1], -1));
		if (te(e[0])) return l(n, e[0].toArray(), z(e[1], -1));
		if (B(e[0])) {
			const a = await e[0].load(), i = await w(M.create(e[1], {
				fieldsIndex: a.getFieldsIndex(),
				timeZone: a.dateFieldsTimeZoneDefaultUTC
			}), r, t);
			return h(t, await e[0].calculateStatistic(n, i, z(e[2], 1e3), t.abortSignal));
		}
	} else if (3 === e.length && B(e[0])) {
		const a = await e[0].load(), i = await w(M.create(e[1], {
			fieldsIndex: a.getFieldsIndex(),
			timeZone: a.dateFieldsTimeZoneDefaultUTC
		}), r, t);
		return h(t, await e[0].calculateStatistic(n, i, z(e[2], 1e3), t.abortSignal));
	}
	return l(n, e, -1);
}
function h(t, e) {
	return r.isTimestampOffset(e) ? m.fromReaderAsTimeStampOffset(e.toStorageFormat()) : f(e) ? m.dateJSAndZoneToArcadeDate(e, Ke(t)) : DateTime.isDateTime(e) ? m.dateTimeToArcadeDate(e) : e;
}
async function w(n, t, e) {
	const r = n.getVariables();
	if (r.length > 0) {
		const a = {};
		for (const n of r) a[n] = t.evaluateIdentifier(e, { name: n });
		n.parameters = a;
	}
	return n;
}
function S(n$2) {
	"async" === n$2.mode && (n$2.functions.stdev = function(t, e) {
		return n$2.standardFunctionAsync(t, e, (e, r, a) => F("stdev", t, a, n$2));
	}, n$2.functions.variance = function(t, e) {
		return n$2.standardFunctionAsync(t, e, (e, r, a) => F("variance", t, a, n$2));
	}, n$2.functions.average = function(t, e) {
		return n$2.standardFunctionAsync(t, e, (e, r, a) => F("mean", t, a, n$2));
	}, n$2.functions.mean = function(t, e) {
		return n$2.standardFunctionAsync(t, e, (e, r, a) => F("mean", t, a, n$2));
	}, n$2.functions.sum = function(t, e) {
		return n$2.standardFunctionAsync(t, e, (e, r, a) => F("sum", t, a, n$2));
	}, n$2.functions.min = function(t, e) {
		return n$2.standardFunctionAsync(t, e, (e, r, a) => F("min", t, a, n$2));
	}, n$2.functions.max = function(t, e) {
		return n$2.standardFunctionAsync(t, e, (e, r, a) => F("max", t, a, n$2));
	}, n$2.functions.count = function(t, s) {
		return n$2.standardFunctionAsync(t, s, async (n$1, u, c) => {
			if (oe(c, 1, 1, t, s), null == c[0]) return 0;
			if (B(c[0])) return c[0].count(n$1.abortSignal);
			if (o(c[0]) || e(c[0])) return c[0].length;
			if (te(c[0])) return c[0].length();
			if (K(c[0])) return c[0].entryCount();
			throw new n(t, "InvalidParameter", s);
		});
	}, n$2.functions.isempty = function(i, o) {
		return n$2.standardFunctionAsync(i, o, async (n$3, i, o) => {
			if (oe(o, 1, 2, n$3, i), o.length >= 2 && !t(o[1])) throw new n(n$3, "InvalidParameter", i);
			return z(o[1], !1) ? B(o[0]) ? await o[0].isEmpty(n$3.abortSignal) : I(o[0]) : ue(o[0]);
		});
	});
}
//#endregion
export { S as registerFunctions };

//# sourceMappingURL=featuresetstats-CBfartOO.js.map