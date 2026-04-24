import { t as q } from "./Collection-BAJSKCip.js";
import { i as G, l as T$1, u as U } from "./spatialReferenceUtils-b3vCEkpS.js";
import { A as re } from "./units-Dg-cK1vO.js";
import { t as S } from "./SpatialReference-rIfb2LrD.js";
import { m as s, t as _$1 } from "./Point-B7zMqEx6.js";
import { t as z } from "./Extent-CquIzaXp.js";
import { b as s$1 } from "./mathUtils-hEBUcrMa.js";
import { i as u } from "./common-BxLRDsKd.js";
import { C as u$1, E as y, S as r, T as x, _ as l, c as S$1, h as j, p as e, t as B$1, w as v, x as q$1, y as o } from "./vec2-BPF6SpMH.js";
import { g as tn, n as F, r as H$1, s as V } from "./projectionUtils-CmEsVWfk.js";
import { t as c } from "./Viewpoint-2CN8K_EI.js";
import { i as n, o as r$1 } from "./vec2f64-BKe4utUH.js";
import { a as f, l as s$2, o as h, r as c$1, s as i, t as M, u as u$2 } from "./mat2d-BuUJVbP4.js";
import { t as e$1 } from "./mat2df64-CT-3vBrt.js";
import { n as L, o as z$1 } from "./normalizeUtils-BbPgVXXO.js";
//#region node_modules/@arcgis/core/views/2d/viewpointUtils.js
var O = 96, Q = 39.37, T = 180 / Math.PI;
function B(t) {
	return t.wkid ? t : t.spatialReference || S.WGS84;
}
function D(t, e) {
	return e.type ? o(t, e.x, e.y) : r(t, e);
}
function W(t) {
	return re(t);
}
function H(t, e, n = 0) {
	let o = t.width, a = t.height;
	if (0 !== n) {
		const e = s$1(n), i = Math.abs(Math.cos(e)), c = Math.abs(Math.sin(e));
		o = t.width * i + t.height * c, a = t.width * c + t.height * i;
	}
	const i = Math.max(1, e[0]), c = Math.max(1, e[1]);
	return Math.max(o / i, a / c) * ct(t.spatialReference);
}
async function J(t, r, n, o) {
	let a, i;
	if (!t) return null;
	if (Array.isArray(t) && !t.length) return null;
	if (q.isCollection(t) && (t = t.toArray()), Array.isArray(t) && t.length && "object" == typeof t[0]) {
		const e = t.every((t) => "attributes" in t), a = t.some((t) => !t.geometry);
		let i = t;
		if (e && a && r && r.allLayerViews) {
			const e = /* @__PURE__ */ new Map();
			for (const r of t) {
				const t = r.layer, n = e.get(t) || [], o = r.attributes[t.objectIdField];
				null != o && n.push(o), e.set(t, n);
			}
			const n = [];
			e.forEach((t, e) => {
				const o = r.allLayerViews?.find((t) => t.layer.id === e.id);
				if (o && "queryFeatures" in o) {
					const r = e.createQuery();
					r.objectIds = t, r.returnGeometry = !0, n.push(o.queryFeatures(r));
				}
			});
			const o = await Promise.all(n), a = [];
			for (const t of o) if (t && t.features && t.features.length) for (const e of t.features) null != e.geometry && a.push(e.geometry);
			i = a;
		}
		for (const t of i) o = await J(t, r, n, o);
		return o;
	}
	if (Array.isArray(t) && 2 === t.length && "number" == typeof t[0] && "number" == typeof t[1]) a = new _$1(t);
	else if (t instanceof s) a = t;
	else if ("geometry" in t) {
		if (t.geometry) a = t.geometry;
		else if (t.layer) {
			const e = t.layer, n = r.allLayerViews?.find((t) => t.layer.id === e.id);
			if (n && "queryFeatures" in n) {
				const r = e.createQuery();
				r.objectIds = [t.attributes[e.objectIdField]], r.returnGeometry = !0;
				a = (await n.queryFeatures(r))?.features?.[0]?.geometry;
			}
		}
	}
	if (null == a) return null;
	switch (a.type) {
		case "point":
			i = new z({
				xmin: a.x,
				ymin: a.y,
				xmax: a.x,
				ymax: a.y,
				spatialReference: a.spatialReference
			});
			break;
		case "extent":
		case "multipoint":
		case "polygon":
		case "polyline":
			i = z$1(a);
			break;
		default: i = a.extent;
	}
	if (!i) return null;
	V() || tn(i.spatialReference, n) || await F();
	const c = H$1(i, n);
	if (!c) return null;
	if (o) {
		const t = c.center, e = t.clone();
		e.x = L(t.x, o.center.x, n), e.x !== t.x && c.centerAt(e), o = o.union(c);
	} else o = c;
	return o;
}
function K(t) {
	if (t && (!Array.isArray(t) || "number" != typeof t[0]) && ("object" == typeof t || Array.isArray(t) && "object" == typeof t[0])) {
		if ("layer" in t && null != t.layer?.minScale && null != t.layer.maxScale) {
			const e = t.layer;
			return {
				min: e.minScale,
				max: e.maxScale
			};
		}
		if (Array.isArray(t) && t.length && t.every((t) => "layer" in t)) {
			let e = 0, r = 0;
			for (const n of t) {
				const t = n.layer;
				t?.minScale && t.maxScale && (e = t.minScale < e ? t.minScale : e, r = t.maxScale > r ? t.maxScale : r);
			}
			return e && r ? {
				min: e,
				max: r
			} : null;
		}
	}
}
function X(t, e) {
	const r = B(t);
	return T$1(r, e) || r.imageCoordinateSystem || e.imageCoordinateSystem ? t : H$1(t, e);
}
async function Y(e, r) {
	if (!e || !r) return new c({
		targetGeometry: new _$1(),
		scale: 0,
		rotation: 0
	});
	let n = r.spatialReference;
	const { constraints: o, padding: a, viewpoint: i, size: c$2 } = r, s$3 = [a ? c$2[0] - a.left - a.right : c$2[0], a ? c$2[1] - a.top - a.bottom : c$2[1]];
	let u = null;
	e instanceof c ? u = e : e.viewpoint ? u = e.viewpoint : e.target && "esri.Viewpoint" === e.target.declaredClass && (u = e.target);
	let l = null;
	u?.targetGeometry ? l = u.targetGeometry : e instanceof z ? l = e : e instanceof s ? l = await J(e, r, n) : e && (l = await J(e.center, r, n) || await J(e.target, r, n) || await J(e, r, n)), !l && i?.targetGeometry ? l = i.targetGeometry : !l && r.extent && (l = r.extent), n || (n = B(r.spatialReference || r.extent || l)), V() || T$1(l.spatialReference, n) || tn(l.spatialReference, n) || await F();
	const f = X(l, n), m = "center" in f ? f.center : f;
	!1 !== r.pickClosestTarget && "point" === m.type && "point" === i.targetGeometry?.type && (m.x = L(m.x, i.targetGeometry.x, m.spatialReference));
	let y = 0;
	u ? y = u.rotation : e.hasOwnProperty("rotation") ? y = e.rotation : i && (y = i.rotation);
	let p = 0;
	p = null != u?.targetGeometry && "point" === u.targetGeometry.type ? u.scale : "scale" in e && e.scale ? e.scale : "zoom" in e && -1 !== e.zoom && o && o.effectiveLODs ? o.zoomToScale(e.zoom) : Array.isArray(l) || "point" === l.type || "extent" === l.type && 0 === l.width && 0 === l.height ? i.scale : H(X(l.extent, n), s$3, y);
	const g = K(e.target ?? e);
	g && (g.min && g.min < p ? p = g.min : g.max && g.max > p && (p = g.max));
	let x = new c({
		targetGeometry: m,
		scale: p,
		rotation: y
	});
	return o && (x = o.fit(x), o.constrainByGeometry(x), o.rotationEnabled || (x.rotation = i.rotation)), x;
}
function Z(t, e) {
	const r = t.targetGeometry, n = e.targetGeometry;
	return r.x = n.x, r.y = n.y, r.spatialReference = n.spatialReference, t.scale = e.scale, t.rotation = e.rotation, t;
}
function $(t, e, r) {
	return r ? o(t, .5 * (e[0] - r.right + r.left), .5 * (e[1] - r.bottom + r.top)) : l(t, e, .5);
}
var _ = function() {
	const t = n();
	return function(e, r, n) {
		const o = r.targetGeometry;
		D(t, o);
		const a = .5 * ot(r);
		return e.xmin = t[0] - a * n[0], e.ymin = t[1] - a * n[1], e.xmax = t[0] + a * n[0], e.ymax = t[1] + a * n[1], e.spatialReference = o.spatialReference, e;
	};
}();
function tt(t, e, r, n, o) {
	return xt(t, e, r.center), t.scale = H(r, n), o?.constraints?.constrain(t), t;
}
function et(t, e, r, n) {
	return lt(t, e, r, n), u$2(t, t);
}
var rt = function() {
	const t = n();
	return function(e, r, n) {
		return B$1(e, st(e, r), $(t, r, n));
	};
}(), nt = function() {
	const t = e$1(), e = n();
	return function(r, n, o$1, a) {
		const c = ot(n), l = it(n);
		return o(e, c, c), h(t, e), s$2(t, t, l), i(t, t, rt(e, o$1, a)), i(t, t, [0, a.top - a.bottom]), o(r, t[4], t[5]);
	};
}();
function ot(t) {
	return t.scale * at(t.targetGeometry?.spatialReference);
}
function at(t) {
	return U(t) ? 1 / (W(t) * Q * O) : 1;
}
function it(t) {
	return u(t.rotation) || 0;
}
function ct(t) {
	return U(t) ? W(t) * Q * O : 1;
}
function st(t, e) {
	return l(t, e, .5);
}
var ut = function() {
	const t = n(), e = n(), r = n();
	return function(n, o$2, u, l$1, f$1, m) {
		return x(t, o$2), l(e, u, .5 * m), o(r, 1 / l$1 * m, -1 / l$1 * m), f(n, e), f$1 && s$2(n, n, f$1), c$1(n, n, r), i(n, n, t), n;
	};
}(), lt = function() {
	const t = n();
	return function(e, r, n, o) {
		const a = ot(r), i = it(r);
		return D(t, r.targetGeometry), ut(e, t, n, a, i, o);
	};
}(), ft = function() {
	const t = n();
	return function(e, r, n, o) {
		const a = ot(r);
		return D(t, r.targetGeometry), ut(e, t, n, a, 0, o);
	};
}();
function mt(t) {
	const e = G(t);
	return e ? e.valid[1] - e.valid[0] : 0;
}
function yt(t, e) {
	return Math.round(mt(t) / e);
}
var pt = function() {
	const t = n(), e$2 = n(), r = [
		0,
		0,
		0
	];
	return function(n, o, a) {
		e(t, n, o), v(t, t), e(e$2, n, a), v(e$2, e$2), y(r, t, e$2);
		let i = Math.acos(j(t, e$2) / (q$1(t) * q$1(e$2))) * T;
		return r[2] < 0 && (i = -i), isNaN(i) && (i = 0), i;
	};
}(), gt = function() {
	const t = n();
	return function(e, r, n, o) {
		const a = e.targetGeometry;
		return Z(e, r), nt(t, r, n, o), a.x += t[0], a.y += t[1], e;
	};
}(), xt = function(t, e, r) {
	Z(t, e);
	const n = t.targetGeometry;
	return n.x = r.x, n.y = r.y, n.spatialReference = r.spatialReference, t;
}, ht = function() {
	const t = n();
	return function(e, r, n, o$3, a) {
		a || (a = "center"), B$1(t, n, o$3), l(t, t, .5);
		const i = t[0], c = t[1];
		switch (a) {
			case "center":
				o(t, 0, 0);
				break;
			case "left":
				o(t, -i, 0);
				break;
			case "top":
				o(t, 0, c);
				break;
			case "right":
				o(t, i, 0);
				break;
			case "bottom":
				o(t, 0, -c);
				break;
			case "top-left":
				o(t, -i, c);
				break;
			case "bottom-left":
				o(t, -i, -c);
				break;
			case "top-right":
				o(t, i, c);
				break;
			case "bottom-right": o(t, i, -c);
		}
		return kt(e, r, t), e;
	};
}();
function bt(t, e, r) {
	return Z(t, e), t.rotation += r, t;
}
function wt(t, e, r) {
	return Z(t, e), t.rotation = r, t;
}
var dt = function() {
	const t = n();
	return function(e, r, n, o$4, a) {
		return Z(e, r), isNaN(n) || 0 === n || (At(t, o$4, r, a), e.scale = r.scale * n, St(t, t, e, a), kt(e, e, o(t, t[0] - o$4[0], o$4[1] - t[1]))), e;
	};
}();
function jt(t, e, r) {
	return Z(t, e), t.scale = r, t;
}
var Gt = function() {
	const t = n();
	return function(e, r, n, o$5, a, i) {
		return Z(e, r), isNaN(n) || 0 === n || (At(t, a, r, i), e.scale = r.scale * n, e.rotation += o$5, St(t, t, e, i), kt(e, e, o(t, t[0] - a[0], a[1] - t[1]))), e;
	};
}(), Rt = function() {
	const t = n(), e = n();
	return function(r, n, o, a, i, c, s) {
		return rt(e, c, s), u$1(t, i, e), a ? Gt(r, n, o, a, t, c) : dt(r, n, o, t, c);
	};
}(), At = function() {
	const t = e$1();
	return function(e, r, n, o) {
		return S$1(e, r, et(t, n, o, 1));
	};
}(), St = function() {
	const t = e$1();
	return function(e, r, n, o) {
		return S$1(e, r, lt(t, n, o, 1));
	};
}(), kt = function() {
	const t = n(), e = e$1();
	return function(r, n, o) {
		Z(r, n);
		const a = ot(n), i = r.targetGeometry;
		return M(e, it(n)), c$1(e, e, r$1(a, a)), S$1(t, o, e), i.x += t[0], i.y += t[1], r;
	};
}();
//#endregion
export { xt as C, wt as S, ot as _, Y as a, tt as b, at as c, gt as d, ht as f, mt as g, lt as h, Rt as i, bt as l, kt as m, Gt as n, Z as o, jt as p, H as r, _ as s, $ as t, ft as u, pt as v, yt as w, ut as x, rt as y };

//# sourceMappingURL=viewpointUtils-CdjSJiJp.js.map