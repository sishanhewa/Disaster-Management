import { _ as s } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
import "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./SimpleObservable-CNlRjEs1.js";
import "./JSONSupport-BUaD4jSd.js";
import "./Promise-Dhhz7kXA.js";
import "./Loadable-CQsALnOO.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import { t as S } from "./SpatialReference-rIfb2LrD.js";
import { m as s$1, o as S$1, u as j } from "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import { t as M$1 } from "./Portal-DYysvbhZ.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import { n as k } from "./PortalItem-BaGmB6Wg.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./mathUtils-hEBUcrMa.js";
import "./Clonable-D_RHUyXD.js";
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
import "./vec3f64-CwISzc_v.js";
import "./Multipoint-B5Liskmz.js";
import "./spatialReferenceEllipsoidUtils-qNeWENaq.js";
import "./GeographicTransformation-D90zE-j2.js";
import "./geodesicConstants-C0TscDSm.js";
import "./projectBuffer-CV6RkXdH.js";
import { n as F$1, r as H, s as V } from "./projectionUtils-CmEsVWfk.js";
import "./jsonUtils-D_oLUjKv.js";
import "./utils-5irCjX9t.js";
import "./utils-Ch7GqCap.js";
import { n as n$1, t as n } from "./project-jhGP-KV5.js";
import "./fieldType-D7SwLPxF.js";
import { i as o, n as f, r as n$2, t as e } from "./guards-06ZwtKv3.js";
import "./Field-jzopk-Sr.js";
import { o as n$3 } from "./enum-D9ePJlKL.js";
import "./TimeOnly-DiAMH6GI.js";
import { $ as re, A as U, J as ne, K as ie, U as ee, W as ge, Y as oe, ct as z, v as K$1, y as Ke } from "./deepClone-Cw0Dfuaj.js";
import "./shared-BrEWD0Qh.js";
import "./number-D09FUQhc.js";
import { t as p } from "./Dictionary-D2UlVih4.js";
import { t } from "./ArcadePortal-BrnPdZON.js";
import { t as l } from "./portalUtils-BS6ZVfVK.js";
import { i as p$1, n as s$3, r as t$1, t as s$2 } from "./Relationship-BhYovXXq.js";
import { t as i } from "./GraphQueryStreaming-Bobz83KN.js";
//#region node_modules/@arcgis/core/arcade/functions/knowledgegraph.js
var J = null;
async function N(r) {
	const t = s.geometryServiceUrl ?? "";
	if (!t) {
		V() || await F$1();
		for (const e of r) e.container[e.indexer] = H(e.container[e.indexer], S.WGS84);
		return;
	}
	const a = await n(t, new n$1({
		geometries: r.map((e) => e.container[e.indexer]),
		outSpatialReference: S.WGS84
	}));
	for (let e = 0; e < a.length; e++) {
		const t = r[e];
		t.container[t.indexer] = a[e];
	}
}
async function F(e, r) {
	const t = new k({
		portal: e,
		id: r
	});
	return await t.load(), null === J && (J = await import("./knowledgeGraphService-BbnF15F5.js")), await J.fetchKnowledgeGraph(t.url);
}
function M(e$1, r, t, n, o$1) {
	if (null === e$1) return null;
	if (e(e$1) || n$2(e$1)) return e$1;
	if (ne(e$1)) return e$1.toJSDate();
	if (ne(e$1)) return e$1.toJSDate();
	if (re(e$1)) return e$1.toStorageFormat();
	if (ie(e$1)) return e$1.toStorageString();
	if (K$1(e$1)) {
		const a = {};
		for (const i of e$1.keys()) a[i] = M(e$1.field(i), r, t, n, o$1), a[i] instanceof s$1 && o$1.push({
			container: a,
			indexer: i
		});
		return a;
	}
	if (o(e$1)) {
		const a = e$1.map((e) => M(e, r, t, n, o$1));
		for (let e = 0; e < a.length; e++) a[e] instanceof s$1 && o$1.push({
			container: a,
			indexer: e
		});
		return a;
	}
	return U(e$1) ? e$1.spatialReference.isWGS84 ? e$1 : e$1.spatialReference.isWebMercator && r ? S$1(e$1) : e$1 : void 0;
}
function Q(e, r) {
	if (!e) return e;
	if (e.spatialReference.isWGS84 && r.spatialReference.isWebMercator) return j(e);
	if (e.spatialReference.equals(r.spatialReference)) return e;
	throw new n$3(r, "WrongSpatialReference", null);
}
function B(e, r) {
	if (!e) return null;
	const t = {};
	for (const n in e) t[n] = E(e[n], r);
	return t;
}
function E(e$2, r) {
	return null === e$2 ? null : o(e$2) ? e$2.map((e) => E(e, r)) : e$2 instanceof p$1 ? {
		graphTypeName: e$2.typeName,
		id: e$2.id,
		graphType: "entity",
		properties: B(e$2.properties, r)
	} : e$2 instanceof t$1 ? {
		graphType: "object",
		properties: B(e$2.properties, r)
	} : e$2 instanceof s$2 ? {
		graphTypeName: e$2.typeName,
		id: e$2.id,
		graphType: "relationship",
		originId: e$2.originId ?? null,
		destinationId: e$2.destinationId ?? null,
		properties: B(e$2.properties, r)
	} : e$2 instanceof s$3 ? {
		graphType: "path",
		path: e$2.path ? e$2.path.map((e) => E(e, r)) : null
	} : U(e$2) ? Q(e$2, r) : e(e$2) || n$2(e$2) || f(e$2) ? e$2 : null;
}
function K(e$4) {
	"async" === e$4.mode && (e$4.functions.knowledgegraphbyportalitem = function(t$2, i) {
		return e$4.standardFunctionAsync(t$2, i, (e$3, s, p) => {
			if (oe(p, 2, 2, t$2, i), null === p[0]) throw new n$3(t$2, "PortalRequired", i);
			if (p[0] instanceof t) {
				const e = ge(p[1]);
				let r;
				r = t$2.services?.portal ? t$2.services.portal : M$1.getDefault();
				return F(l(p[0], r), e);
			}
			if (!1 === e(p[0])) throw new n$3(t$2, "InvalidParameter", i);
			const l$1 = ge(p[0]);
			return F(t$2.services?.portal ?? M$1.getDefault(), l$1);
		});
	}, e$4.signatures.push({
		name: "knowledgegraphbyportalitem",
		min: 2,
		max: 2
	}), e$4.functions.querygraph = function(r, a) {
		return e$4.standardFunctionAsync(r, a, async (e$5, l, c) => {
			oe(c, 2, 4, r, a);
			const f = c[0];
			if (!ee(f)) throw new n$3(r, "InvalidParameter", a);
			const u = c[1];
			if (!e(u)) throw new n$3(r, "InvalidParameter", a);
			null === J && (J = await import("./knowledgeGraphService-BbnF15F5.js"));
			let m = null;
			const d = z(c[2], null);
			if (!(d instanceof p || null === d)) throw new n$3(r, "InvalidParameter", a);
			if (d) {
				let e = [];
				m = M(d, !0, !1, r, e), e = e.filter((e) => !e.container[e.indexer].spatialReference.isWGS84), e.length > 0 && await N(e);
			}
			const h = z(c[3], !1), g = new i({
				openCypherQuery: u,
				bindParameters: m,
				provenanceBehavior: h ? "include" : "exclude"
			});
			(f?.serviceDefinition?.currentVersion ?? 11.3) > 11.2 && (g.outputSpatialReference = r.spatialReference);
			const w = (await J.executeQueryStreaming(f, g)).resultRowsStream.getReader(), y = [];
			try {
				for (;;) {
					const { done: e, value: t } = await w.read();
					if (e) break;
					if (o(t)) for (const n of t) y.push(E(n, r));
					else {
						const e = [];
						for (const n of t) e.push(E(t[n], r));
						y.push(e);
					}
				}
			} catch (j) {
				throw j;
			}
			return p.convertJsonToArcade(y, Ke(r), !1, !0);
		});
	}, e$4.signatures.push({
		name: "querygraph",
		min: 2,
		max: 4
	}));
}
//#endregion
export { K as registerFunctions };

//# sourceMappingURL=knowledgegraph-BFuuDmxu.js.map