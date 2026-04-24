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
import { n as u } from "./jsonUtils-D_oLUjKv.js";
//#region node_modules/@arcgis/core/arcade/geometry/operatorsWorker.js
function t(e, t) {
	let r;
	return {
		loaded: !1,
		load: () => r ??= t().then((t) => {
			o[e] = {
				loaded: !0,
				execute: t
			};
		})
	};
}
function r(e) {
	return null == e ? null : e.toJSON();
}
var o = {
	disjoint: t("disjoint", () => import("./disjointOperator-D_Xv070E.js").then((e) => e.execute)),
	intersects: t("intersects", () => import("./intersectsOperator-Bb3pNLzf.js").then((e) => e.execute)),
	touches: t("touches", () => import("./touchesOperator-vdZaJZ3I.js").then((e) => e.execute)),
	crosses: t("crosses", () => import("./crossesOperator-D6XQTTqU.js").then((e) => e.execute)),
	within: t("within", () => import("./withinOperator-C1B2ta9R.js").then((e) => e.execute)),
	contains: t("contains", () => import("./containsOperator-CA7IYrjV.js").then((e) => e.execute)),
	overlaps: t("overlaps", () => import("./overlapsOperator-C2ALKwlh.js").then((e) => e.execute)),
	equals: t("equals", async () => {
		const t = await import("./equalsOperator-CEgXJyG9.js");
		return (r, o) => t.execute(u(r), u(o));
	}),
	relate: t("relate", async () => {
		const t = await import("./relateOperator-DO4UngqN.js");
		return (r, o, n) => t.execute(u(r), u(o), n);
	}),
	intersection: t("intersection", () => import("./intersectionOperator-DgIoP2lY.js").then((e) => e.execute)),
	union: t("union", () => import("./unionOperator-BGizLBD3.js").then((e) => e.executeMany)),
	difference: t("difference", async () => {
		const t = await import("./differenceOperator-DU9IuFtE.js");
		return (o, n) => r(t.execute(u(o), u(n)));
	}),
	symmetricDifference: t("symmetricDifference", async () => {
		const t = await import("./symmetricDifferenceOperator-HO5pJkaW.js");
		return (o, n) => r(t.execute(u(o), u(n)));
	}),
	clip: t("clip", async () => {
		const t = await import("./clipOperator-CtSO0VA1.js");
		return (o, n) => r(t.execute(u(o), u(n)));
	}),
	cut: t("cut", async () => {
		const t = await import("./cutOperator-BHSPqqNk.js");
		return (o, n) => t.execute(u(o), u(n)).map((e) => r(e));
	}),
	area: t("area", async () => {
		const t = await import("./areaOperator-DTNFHllL.js"), { convertFromSpatialReferenceUnit: r, toAreaUnit: o } = await import("./unitConversion-CSpfQSlF.js").then((n) => n.i);
		return (n, a) => {
			const s = t.execute(u(n));
			return r(n.spatialReference, o(a), s);
		};
	}),
	geodeticArea: t("geodeticArea", async () => {
		const t = await import("./geodeticAreaOperator-BhW1jxLs.js"), { convert: r, squareMeters: o, toAreaUnit: n } = await import("./unitConversion-CSpfQSlF.js").then((n) => n.i);
		return await t.load(), (a, s, i) => {
			const c = t.execute(u(a), { curveType: i });
			return r(o, n(s), c);
		};
	}),
	length: t("length", async () => {
		const e = await import("./lengthOperator-CMUhtj-j.js"), { convertFromSpatialReferenceUnit: t, toLengthUnit: r } = await import("./unitConversion-CSpfQSlF.js").then((n) => n.i);
		return (o, n) => {
			const a = e.execute(o);
			return t(o.spatialReference, r(n), a);
		};
	}),
	geodeticLength: t("geodeticLength", async () => {
		const t = await import("./geodeticLengthOperator-BC2TNOA5.js"), { convert: r, meters: o, toLengthUnit: n } = await import("./unitConversion-CSpfQSlF.js").then((n) => n.i);
		return await t.load(), (a, s, i) => {
			const c = t.execute(u(a), { curveType: i });
			return r(o, n(s), c);
		};
	}),
	distance: t("distance", async () => {
		const t = await import("./distanceOperator-DguwOTO8.js"), { convertFromSpatialReferenceUnit: r, toLengthUnit: o } = await import("./unitConversion-CSpfQSlF.js").then((n) => n.i);
		return (n, a, s) => {
			const i = t.execute(u(n), u(a));
			return r(n.spatialReference, o(s), i);
		};
	}),
	densify: t("densify", async () => {
		const t = await import("./densifyOperator-C5Z9FwpY.js"), { convertToSpatialReferenceUnit: o, toLengthUnit: n } = await import("./unitConversion-CSpfQSlF.js").then((n) => n.i);
		return (a, s, i) => (s = o(n(i), a.spatialReference, s), r(t.execute(u(a), s)));
	}),
	geodeticDensify: t("geodeticDensify", async () => {
		const t = await import("./geodeticDensifyOperator-CQHpLJ59.js"), { convert: o, meters: n, toLengthUnit: a } = await import("./unitConversion-CSpfQSlF.js").then((n) => n.i);
		return await t.load(), (s, i, c, p) => (i = o(a(c), n, i), r(t.execute(u(s), i, { curveType: p })));
	}),
	generalize: t("generalize", async () => {
		const t = await import("./generalizeOperator-BCdazX5s.js"), { convertToSpatialReferenceUnit: o, toLengthUnit: n } = await import("./unitConversion-CSpfQSlF.js").then((n) => n.i);
		return (a, s, i, c) => (s = o(n(i), a.spatialReference, s), r(t.execute(u(a), s, c)));
	}),
	buffer: t("buffer", async () => {
		const e = await import("./bufferOperator-BYlvOvhQ.js"), { convertToSpatialReferenceUnit: t, toLengthUnit: r } = await import("./unitConversion-CSpfQSlF.js").then((n) => n.i);
		return (o, n, a) => (n = t(r(a), o.spatialReference, n), e.execute(o, n));
	}),
	geodesicBuffer: t("geodesicBuffer", async () => {
		const e = await import("./geodesicBufferOperator-C0hNeRIP.js"), { convert: t, meters: r, toLengthUnit: o } = await import("./unitConversion-CSpfQSlF.js").then((n) => n.i);
		return await e.load(), (n, a, s, i) => (a = t(o(s), r, a), e.execute(n, a, { curveType: i }));
	}),
	offset: t("offset", async () => {
		const { executeOffsetJson: e } = await import("./offset-C0nsWIbp.js");
		return e;
	}),
	rotate: t("rotate", async () => {
		const t = await import("./affineTransformOperator-t6JexdB0.js"), { default: o } = await import("./Transformation-CaXwLA3j.js");
		return (n, a, s, i) => {
			const c = new o().rotate(a, s, i);
			return r(t.execute(u(n), c));
		};
	}),
	centroid: t("centroid", async () => {
		const t = await import("./centroidOperator-4eudOeB1.js");
		return (o) => r(t.execute(u(o)));
	}),
	labelPoint: t("labelPoint", async () => {
		const t = await import("./labelPointOperator-iDxH5AzO.js");
		return (o) => r(t.execute(u(o)));
	}),
	simplify: t("simplify", () => import("./simplifyOperator-CeQtV0PT.js").then((e) => e.execute)),
	isSelfIntersecting: t("isSelfIntersecting", async () => {
		const { NonSimpleResult: t } = await import("./OperatorDefinitions-qR_stCRK.js").then((n) => n.t), r = await import("./simplifyOGCOperator-uTV8WW0L.js"), o = new Set([
			5,
			6,
			7,
			10,
			11,
			12
		]);
		return (n) => {
			const a = new t();
			return !r.isSimple(u(n), a) && o.has(a.m_reason);
		};
	}),
	isSimple: t("isSimple", () => import("./simplifyOperator-CeQtV0PT.js").then((e) => e.isSimple)),
	convexHull: t("convexHull", () => import("./convexHullOperator-DrdD1lQE.js").then((e) => e.execute)),
	getNearestCoordinate: t("getNearestCoordinate", async () => {
		const t = await import("./proximityOperator-CH8lxFPO.js");
		return (o, n, a) => {
			const s = t.getNearestCoordinate(u(o), u(n), a);
			return {
				...s,
				coordinate: r(s.coordinate)
			};
		};
	}),
	getNearestVertex: t("getNearestVertex", async () => {
		const { executeNearestVertex: t } = await import("./nearestVertex-B6c5IJqi.js");
		return (o, n) => {
			const a = t(u(o), u(n));
			return null == a ? null : {
				...a,
				coordinate: r(a.coordinate)
			};
		};
	})
};
function n(e, t) {
	const r = o[e];
	return r.loaded ? r.execute.apply(void 0, t) : r.load().then(() => n(e, t));
}
//#endregion
export { n as invokeGeometryOp };

//# sourceMappingURL=operatorsWorker-BPtRJGV6.js.map