import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { w as a$2 } from "./Error-CzxduO2m.js";
import { i as r$1, n as c$3, t as a$3 } from "./decorators-DE7S5xmd.js";
import { t as S } from "./SpatialReference-rIfb2LrD.js";
import { m as s$2, t as _ } from "./Point-B7zMqEx6.js";
import { t as z } from "./Extent-CquIzaXp.js";
import { p as v$2, r as e$1 } from "./curveUtils-CfkOAT4m.js";
import { S as u$3, v as o$2 } from "./aaBoundingRect-CgUWvAgv.js";
import { t as n } from "./curveExtent--ue9-x0m.js";
//#region node_modules/@arcgis/core/geometry/support/boundsUtils.js
function o$1(n) {
	return void 0 !== n.xmin && void 0 !== n.ymin && void 0 !== n.xmax && void 0 !== n.ymax;
}
function u$2(n) {
	return void 0 !== n.points;
}
function c$2(n) {
	return void 0 !== n.x && void 0 !== n.y;
}
function s$1(n) {
	return void 0 !== n.paths;
}
function l$1(n) {
	return void 0 !== n.rings;
}
function h$2(n) {
	function t(t, i) {
		return null == t ? i : null == i ? t : n(t, i);
	}
	return t;
}
var m$2 = h$2(Math.min), a$1 = h$2(Math.max);
function f$2(n, t) {
	return s$1(t) ? y$2(n, t.curvePaths ?? t.paths, !1, !1) ?? n : l$1(t) ? y$2(n, t.curveRings ?? t.rings, !1, !1) ?? n : u$2(t) ? p(n, t.points, !1, !1, !1, !1) : o$1(t) ? d$1(n, t) : (c$2(t) && (n[0] = t.x, n[1] = t.y, n[2] = t.x, n[3] = t.y), n);
}
function x$1(n) {
	let i, r, e, o;
	for (n.reset(), i = e = Infinity, r = o = -Infinity; n.nextPath();) {
		const t = g(n);
		i = Math.min(t[0], i), e = Math.min(t[1], e), r = Math.max(t[2], r), o = Math.max(t[3], o);
	}
	return u$3([
		i,
		e,
		r,
		o
	]);
}
function g(n) {
	let i, r, e, o;
	for (i = e = Infinity, r = o = -Infinity; n.nextPoint();) i = Math.min(n.x, i), e = Math.min(n.y, e), r = Math.max(n.x, r), o = Math.max(n.y, o);
	return u$3([
		i,
		e,
		r,
		o
	]);
}
function v$1(n, t) {
	return s$1(t) ? y$2(n, t.curvePaths ?? t.paths, !0, !1) ?? n : l$1(t) ? y$2(n, t.curveRings ?? t.rings, !0, !1) ?? n : u$2(t) ? p(n, t.points, !0, !1, !0, !1) : o$1(t) ? d$1(n, t, !0, !1, !0, !1) : (c$2(t) && (n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.x, n[4] = t.y, n[5] = t.z), n);
}
function y$2(t, o, u, c) {
	const s = u ? 3 : 2;
	if (!o.length || !o[0].length) return null;
	let l, h, f, x, [g, v] = v$2(o[0][0]), y = g, d = v;
	for (let p = 0; p < o.length; p++) {
		const t = o[p];
		for (let o = 0; o < t.length; o++) {
			const p = v$2(t[o]), [M, z] = p;
			if (g = m$2(g, M), v = m$2(v, z), y = a$1(y, M), d = a$1(d, z), u && p.length > 2) {
				const n = p[2];
				l = m$2(l, n), h = a$1(h, n);
			}
			if (c && p.length > s) {
				const n = p[s];
				f = m$2(f, n), x = a$1(x, n);
			}
			const P = t[o];
			if (e$1(P) || o < 1) continue;
			const j = v$2(t[o - 1]), R = o$2(g, v, y, d);
			[g, v, y, d] = n(R, j, P);
		}
	}
	return u ? c ? (t[0] = g, t[1] = v, t[2] = l, t[3] = f, t[4] = y, t[5] = d, t[6] = h, t[7] = x, t.length = 8, t) : (t[0] = g, t[1] = v, t[2] = l, t[3] = y, t[4] = d, t[5] = h, t.length = 6, t) : c ? (t[0] = g, t[1] = v, t[2] = f, t[3] = y, t[4] = d, t[5] = x, t.length = 6, t) : (t[0] = g, t[1] = v, t[2] = y, t[3] = d, t.length = 4, t);
}
function d$1(n, t, i, r, e, o) {
	const u = t.xmin, c = t.xmax, s = t.ymin, l = t.ymax;
	let h = t.zmin, m = t.zmax, a = t.mmin, f = t.mmax;
	return e ? (h = h || 0, m = m || 0, o ? (a = a || 0, f = f || 0, n[0] = u, n[1] = s, n[2] = h, n[3] = a, n[4] = c, n[5] = l, n[6] = m, n[7] = f, n) : (n[0] = u, n[1] = s, n[2] = h, n[3] = c, n[4] = l, n[5] = m, n)) : o ? (a = a || 0, f = f || 0, n[0] = u, n[1] = s, n[2] = a, n[3] = c, n[4] = l, n[5] = f, n) : (n[0] = u, n[1] = s, n[2] = c, n[3] = l, n);
}
function p(n, t, i, r, e, o) {
	const u = i ? 3 : 2, c = r && o, s = i && e;
	if (!t.length || !t[0].length) return null;
	let l, h, f, x, [g, v] = t[0], [y, d] = t[0];
	for (let p = 0; p < t.length; p++) {
		const n = t[p], [i, r] = n;
		if (g = m$2(g, i), v = m$2(v, r), y = a$1(y, i), d = a$1(d, r), s && n.length > 2) {
			const t = n[2];
			l = m$2(l, t), h = a$1(h, t);
		}
		if (c && n.length > u) {
			const t = n[u];
			f = m$2(l, t), x = a$1(h, t);
		}
	}
	return e ? (l = l || 0, h = h || 0, o ? (f = f || 0, x = x || 0, n[0] = g, n[1] = v, n[2] = l, n[3] = f, n[4] = y, n[5] = d, n[6] = h, n[7] = x, n) : (n[0] = g, n[1] = v, n[2] = l, n[3] = y, n[4] = d, n[5] = h, n)) : o ? (f = f || 0, x = x || 0, n[0] = g, n[1] = v, n[2] = f, n[3] = y, n[4] = d, n[5] = x, n) : (n[0] = g, n[1] = v, n[2] = y, n[3] = d, n);
}
//#endregion
//#region node_modules/@arcgis/core/geometry/support/extentUtils.js
function t(n) {
	return void 0 !== n.xmin && void 0 !== n.ymin && void 0 !== n.xmax && void 0 !== n.ymax;
}
function u$1(n) {
	return void 0 !== n.points;
}
function r(n) {
	return void 0 !== n.x && void 0 !== n.y;
}
function m$1(n) {
	return void 0 !== n.paths;
}
function o(n) {
	return void 0 !== n.rings;
}
var x = [];
function a(n, i, t, u) {
	return {
		xmin: n,
		ymin: i,
		xmax: t,
		ymax: u
	};
}
function c$1(n, i, t, u, r, m) {
	return {
		xmin: n,
		ymin: i,
		zmin: t,
		xmax: u,
		ymax: r,
		zmax: m
	};
}
function s(n, i, t, u, r, m) {
	return {
		xmin: n,
		ymin: i,
		mmin: t,
		xmax: u,
		ymax: r,
		mmax: m
	};
}
function e(n, i, t, u, r, m, o, x) {
	return {
		xmin: n,
		ymin: i,
		zmin: t,
		mmin: u,
		xmax: r,
		ymax: m,
		zmax: o,
		mmax: x
	};
}
function f$1(n, i = !1, t = !1) {
	return i ? t ? e(n[0], n[1], n[2], n[3], n[4], n[5], n[6], n[7]) : c$1(n[0], n[1], n[2], n[3], n[4], n[5]) : t ? s(n[0], n[1], n[2], n[3], n[4], n[5]) : a(n[0], n[1], n[2], n[3]);
}
function l(n) {
	return n ? t(n) ? n : r(n) ? v(n) : o(n) ? d(n) : m$1(n) ? h$1(n) : u$1(n) ? y$1(n) : null : null;
}
function y$1(n) {
	const { hasZ: t, hasM: u, points: r } = n, m = p(x, r, t ?? !1, u ?? !1, t ?? !1, u ?? !1);
	return m ? f$1(m, t, u) : null;
}
function v(n) {
	const { x: i, y: t, z: u, m: r } = n, m = null != r;
	return null != u ? m ? e(i, t, u, r, i, t, u, r) : c$1(i, t, u, i, t, u) : m ? s(i, t, r, i, t, r) : a(i, t, i, t);
}
function d(i) {
	const { hasZ: t, hasM: u, rings: r, curveRings: m } = i, o = y$2(x, m ?? r, t ?? !1, u ?? !1);
	return o ? f$1(o, t, u) : null;
}
function h$1(i) {
	const { hasZ: t, hasM: u, paths: r, curvePaths: m } = i, o = y$2(x, m ?? r, t ?? !1, u ?? !1);
	return o ? f$1(o, t, u) : null;
}
//#endregion
//#region node_modules/@arcgis/core/geometry/support/zmUtils.js
function h(h, a, s = !1) {
	let { hasM: t, hasZ: e } = h;
	Array.isArray(a) ? 4 !== a.length || t || e ? 3 === a.length && s && !t ? (e = !0, t = !1) : 3 === a.length && t && e && (t = !1, e = !1) : (t = !0, e = !0) : (e = !e && a.hasZ && (!t || a.hasM), t = !t && a.hasM && (!e || a.hasZ)), h.hasZ = e, h.hasM = t;
}
//#endregion
//#region node_modules/@arcgis/core/geometry/Polyline.js
var u;
function c(t) {
	return !Array.isArray(t[0]);
}
function f(t) {
	return "number" == typeof t[0]?.[0];
}
function m(t) {
	if (!t) return;
	let { paths: e, hasM: s, hasZ: r, spatialReference: i } = t;
	switch (e ??= [], f(e) && (e = [e]), e[0]?.[0]?.length) {
		case 4:
			r ??= !0, s ??= !0;
			break;
		case 3:
			r ??= !0 !== s, s ??= !r;
			break;
		default: r ??= !1, s ??= !1;
	}
	return i ??= S.WGS84, {
		...t,
		hasM: s,
		hasZ: r,
		paths: e,
		spatialReference: i
	};
}
var y = u = class extends s$2 {
	constructor(t) {
		super(m(t)), this.curvePaths = void 0, this.paths = [], this.type = "polyline";
	}
	get cache() {
		return this.commitProperty("curvePaths"), this.commitProperty("hasM"), this.commitProperty("hasZ"), this.commitProperty("paths"), this.commitProperty("spatialReference"), {};
	}
	writeCurvePaths(t, s) {
		s.curvePaths = a$2(t);
	}
	get extent() {
		const t = h$1(this), { spatialReference: e } = this;
		return t ? new z({
			...t,
			spatialReference: e
		}) : null;
	}
	writePaths(t, s) {
		s.paths = a$2(this.paths);
	}
	addPath(t) {
		if (!t) return;
		const e = this.paths, s = e.length;
		if (c(t)) {
			const r = [];
			for (let e = 0, s = t.length; e < s; e++) r[e] = t[e].toArray();
			e[s] = r;
		} else e[s] = t.slice();
		return this.notifyChange("paths"), this;
	}
	clone() {
		const t = new u();
		return t.spatialReference = this.spatialReference, t.paths = a$2(this.paths), t.curvePaths = a$2(this.curvePaths), t.hasZ = this.hasZ, t.hasM = this.hasM, t;
	}
	getPoint(t, e) {
		if (!this._validateInputs(t, e)) return null;
		const s = this.paths[t][e], r = this.hasZ, i = this.hasM;
		return r && !i ? new _(s[0], s[1], s[2], void 0, this.spatialReference) : i && !r ? new _(s[0], s[1], void 0, s[2], this.spatialReference) : r && i ? new _(s[0], s[1], s[2], s[3], this.spatialReference) : new _(s[0], s[1], this.spatialReference);
	}
	insertPoint(t, e, s) {
		return this._validateInputs(t, e, !0) ? (h(this, s), Array.isArray(s) || (s = s.toArray()), this.paths[t].splice(e, 0, s), this.notifyChange("paths"), this) : this;
	}
	removePath(t) {
		if (!this._validateInputs(t, null)) return null;
		const e = this.paths.splice(t, 1)[0], s = this.spatialReference, r = e.map((t) => new _(t, s));
		return this.notifyChange("paths"), r;
	}
	removePoint(t, e) {
		if (!this._validateInputs(t, e)) return null;
		const s = new _(this.paths[t].splice(e, 1)[0], this.spatialReference);
		return this.notifyChange("paths"), s;
	}
	setPoint(t, e, s) {
		return this._validateInputs(t, e) ? (h(this, s), Array.isArray(s) || (s = s.toArray()), this.paths[t][e] = s, this.notifyChange("paths"), this) : this;
	}
	_validateInputs(t, e, s = !1) {
		if (null == t || t < 0 || t >= this.paths.length) return !1;
		if (null != e) {
			const r = this.paths[t];
			if (s && (e < 0 || e > r.length)) return !1;
			if (!s && (e < 0 || e >= r.length)) return !1;
		}
		return !0;
	}
	toJSON(t) {
		return this.write({}, t);
	}
};
__decorate([a$3({ readOnly: !0 })], y.prototype, "cache", null), __decorate([a$3({ json: {
	write: !0,
	origins: {
		"portal-item": { write: !1 },
		"web-map": { write: !1 },
		"web-scene": { write: !1 }
	}
} })], y.prototype, "curvePaths", void 0), __decorate([r$1("curvePaths")], y.prototype, "writeCurvePaths", null), __decorate([a$3({ readOnly: !0 })], y.prototype, "extent", null), __decorate([a$3({
	type: [[[Number]]],
	json: { write: { isRequired: !0 } }
})], y.prototype, "paths", void 0), __decorate([r$1("paths")], y.prototype, "writePaths", null), y = u = __decorate([c$3("esri.geometry.Polyline")], y), y.prototype.toJSON.isDefaultToJSON = !0;
//#endregion
export { y$1 as a, v$1 as c, l as i, x$1 as l, h as n, f$2 as o, d as r, g as s, y as t, y$2 as u };

//# sourceMappingURL=Polyline-Cv0nwof6.js.map