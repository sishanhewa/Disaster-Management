import "./Error-CzxduO2m.js";
import { T as N, j as c$3 } from "./typedArrayUtil-BAuNmygZ.js";
import { t as e$1 } from "./MapUtils-CBkGGs30.js";
import { n as B } from "./layerUtils-sQ-3wxAB.js";
import { r as N$1 } from "./date-BGzzeGV1.js";
import { o as r$3 } from "./timeUtils-LVAIYsCb.js";
import { t as g$2 } from "./Color-C99QAF80.js";
import { c as i$2, s as m$1 } from "./fieldFormatUtils-R1ptUFq7.js";
import { r as d$1 } from "./SimpleMarkerSymbol-BjFFaoyw.js";
import { a as v$1, i as h$2, t as D$1 } from "./intl-1FbLkipu.js";
import { r as l$1 } from "./typeUtils-YqCqXWJ1.js";
import { a as b$1 } from "./utils-C2bZ_DGG.js";
import { s as q } from "./utils-Dgqqelok.js";
//#region node_modules/@arcgis/core/renderers/support/numberUtils.js
var n$1 = /^-?(\d+)(\.(\d+))?$/i;
function e(t, n) {
	return t - n;
}
function r$2(t, n) {
	let e, r;
	return e = Number(t.toFixed(n)), e < t ? r = e + 1 / 10 ** n : (r = e, e -= 1 / 10 ** n), e = Number(e.toFixed(n)), r = Number(r.toFixed(n)), [e, r];
}
function o(t, n, e, r, o) {
	const i = l(t, n, e, r), u = null == i.previous || i.previous <= o, c = null == i.next || i.next <= o;
	return u && c || i.previous + i.next <= 2 * o;
}
function i$1(t) {
	const e = String(t), r = e.match(n$1);
	if (r?.[1]) return {
		integer: r[1].split("").length,
		fractional: r[3] ? r[3].split("").length : 0
	};
	if (e.toLowerCase().includes("e")) {
		const t = e.split("e"), n = t[0], r = t[1];
		if (n && r) {
			const t = Number(n);
			let e = Number(r);
			const o = e > 0;
			o || (e = Math.abs(e));
			const l = i$1(t);
			return o ? (l.integer += e, e > l.fractional ? l.fractional = 0 : l.fractional -= e) : (l.fractional += e, e > l.integer ? l.integer = 1 : l.integer -= e), l;
		}
	}
	return {
		integer: 0,
		fractional: 0
	};
}
function l(t, n, e, r) {
	const o = {
		previous: null,
		next: null
	};
	if (null != e) {
		const r = t - e, i = n - e - r;
		o.previous = Math.floor(Math.abs(100 * i / r));
	}
	if (null != r) {
		const e = r - t, i = r - n - e;
		o.next = Math.floor(Math.abs(100 * i / e));
	}
	return o;
}
function u$2(t, n = {}) {
	const l = t.slice(), { tolerance: u = 2, strictBounds: c = !1, indexes: s = l.map((t, n) => n) } = n;
	s.sort(e);
	for (let e = 0; e < s.length; e++) {
		const t = s[e], n = l[t], a = 0 === t ? null : l[t - 1], f = t === l.length - 1 ? null : l[t + 1], g = i$1(n).fractional;
		if (g) {
			let i, s = 0, m = !1;
			for (; s <= g && !m;) {
				const t = r$2(n, s);
				i = c && 0 === e ? t[1] : t[0], m = o(n, i, a, f, u), s++;
			}
			m && (l[t] = i);
		}
	}
	return l;
}
var c$2 = { maximumFractionDigits: 20 };
function s$1(n) {
	return h$2(n, c$2);
}
function m(t, e, n, i) {
	let o = "";
	0 === e ? o = `< ` : e === n && (o = `> `);
	const r = d(t, i);
	return null == r ? "" : o + r;
}
function p(t) {
	const { format: e, fieldFormat: n } = t || {};
	return "number" === n?.type || !!e && null == e.dateFormat && (null != e.places || null != e.digitSeparator);
}
function d(i, o) {
	if (null == i) return i;
	const { fieldType: r, format: l, fieldFormat: s, timeZoneOptions: u } = o || {};
	if (U(r)) return q(i, {
		fieldType: r,
		format: l?.dateFormat,
		fieldFormat: "date-time" === s?.type ? s : void 0,
		timeZoneOptions: u
	});
	if ("string" == typeof i && p(o)) {
		const t = Number(i);
		isNaN(t) || (i = t);
	}
	if ("string" == typeof i) return i;
	const f = "number" === s?.type ? v$1(s) : l ? D$1(l) : void 0;
	return f ? h$2(i, f) : s$1(i);
}
var c$1 = [
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAAAAAAAAAHqZRakAAAANUlEQVQ4jWPMy8v7z0BFwMLAwMAwcdIkqhiWn5fHwEQVk5DAqIGjBo4aOGrgqIEQwEjtKgAATl0Hu6JrzFUAAAAASUVORK5CYII=",
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAAAAAAAAAHqZRakAAAANUlEQVQ4jWPMy8v7z0BFwMLAwMAwaeIkqhiWl5/HwEQVk5DAqIGjBo4aOGrgqIEQwEjtKgAATl0Hu6sKxboAAAAASUVORK5CYII=",
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAAAAAAAAAHqZRakAAAANUlEQVQ4jWPMy8v7z0BFwMLAwMAwadJEqhiWl5fPwEQVk5DAqIGjBo4aOGrgqIEQwEjtKgAATl0Hu75+IUcAAAAASUVORK5CYII="
];
async function g$1(t) {
	if (!("visualVariables" in t) || !t.visualVariables) return null;
	const e = t.visualVariables.find((t) => "color" === t.type);
	if (!e) return null;
	let n = null, i = null;
	if (e.stops) {
		if (1 === e.stops.length) return e.stops[0].color;
		n = e.stops[0].value, i = e.stops[e.stops.length - 1].value;
	}
	const o = null != n && null != i ? n + (i - n) / 2 : 0, { getColor: r } = await import("./visualVariableUtils-Cml1ksAq.js").then((n) => n.i);
	return r(e, o) ?? null;
}
async function w$1(t, e) {
	const n = t.trailCap, i = t.trailWidth || 1;
	return new d$1({
		cap: n,
		color: e || await g$1(t) || t.color,
		width: i
	});
}
function y$1(t, e) {
	if (!e) return null;
	if ("featureReduction" in t) switch (t.featureReduction?.type) {
		case "cluster":
		case "binning": {
			const n = t.featureReduction.fields.find(({ name: t }) => t.toLowerCase() === e.toLowerCase());
			return n?.type ? n : n && "getField" in t ? t.getField(n.onStatisticField) : null;
		}
	}
	return "getField" in t ? t.getField?.(e) : null;
}
function I(t, e) {
	const n = "popupTemplate" in t ? t.popupTemplate?.fieldInfos : null;
	if (n?.length && e) return n.find((t) => t.fieldName?.toLowerCase() === e.toLowerCase());
}
function F(t) {
	let e = 0, n = 0;
	return t.stops ? (e = t.stops?.at(0)?.value ?? e, n = t.stops?.at(-1)?.value ?? n) : "minDataValue" in t && "maxDataValue" in t && (e = t.minDataValue ?? e, n = t.maxDataValue ?? n), n - e > 2 * r$3.days ? "short-date" : "short-date-short-time";
}
function U(t) {
	return [
		"date",
		"date-only",
		"time-only",
		"timestamp-offset"
	].includes(t || "");
}
function h$1(t, e, n) {
	const i = C(t, e.field, n);
	return i ? (U(i.fieldType) && (i.fieldConfigurationsContainer ? i.fieldFormat ??= new i$2({
		dateStyle: "short",
		timeStyle: "short-date-short-time" === F(e) ? "short" : null
	}) : i.format ??= new m$1({ dateFormat: F(e) })), i) : null;
}
function C(t, e, n) {
	const i = y$1(t, e), o = i?.name;
	if (!o) return null;
	const l = i?.type, a = B(t, { checkFeatureReduction: !0 });
	return {
		fieldType: l,
		format: a ? null : I(t, o)?.format,
		fieldFormat: a ? a.getFieldConfiguration(o)?.fieldFormat : null,
		fieldConfigurationsContainer: a,
		timeZoneOptions: U(l) ? {
			layerTimeZone: "preferredTimeZone" in t ? t.preferredTimeZone : null,
			viewTimeZone: n,
			datesInUnknownTimezone: "datesInUnknownTimezone" in t && t.datesInUnknownTimezone
		} : null
	};
}
function V(t, e) {
	if ("authoringInfo" in t) return t.authoringInfo?.visualVariables?.find(({ theme: t }) => t === e);
}
function j(t, e) {
	let n = null != t ? t : "";
	return null != e && e && (n = n ? "(" + n + ") AND (" + e + ")" : e), n;
}
//#endregion
//#region node_modules/@arcgis/core/widgets/Legend/support/colorRampUtils.js
var r$1 = new g$2([
	64,
	64,
	64
]);
function n(l, e) {
	const r = [], n = l.length - 1;
	return 5 === l.length ? r.push(0, 2, 4) : r.push(0, n), l.map((l, t) => r.includes(t) ? m(l, t, n, e) : null);
}
async function t(l, o, r) {
	let t = !1, u = [], s = [];
	if (l.stops) {
		const e = l.stops;
		u = e.map((l) => l.value), t = e.some((l) => !!l.label), t && (s = e.map((l) => l.label));
	}
	const i = u[0], c = u[u.length - 1];
	if (null == i && null == c) return null;
	const p = t ? null : n(u, r);
	return (await Promise.all(u.map(async (e, r) => {
		const n = "opacity" === l.type ? await a(e, l, o) : (await import("./visualVariableUtils-Cml1ksAq.js").then((n) => n.i)).getColor(l, e), u = t ? s[r] : p?.[r] ?? "";
		return null == n ? null : {
			value: e,
			color: n,
			label: u
		};
	}))).filter(N).reverse();
}
async function a(e, o, n) {
	const t = new g$2(n ?? r$1), a = (await import("./visualVariableUtils-Cml1ksAq.js").then((n) => n.i)).getOpacity(o, e);
	return null != a && (t.a = a), t;
}
function u(l) {
	let e = !1, o = [], r = [];
	o = l.map((l) => l.value), e = l.some((l) => !!l.label), e && (r = l.map((l) => l.label ?? ""));
	const t = o[0], a = o[o.length - 1];
	if (null == t && null == a) return null;
	const u = e ? null : n(o);
	return o.map((o, n) => ({
		value: o,
		color: s(o, l),
		label: e ? r[n] : u?.[n] ?? ""
	})).reverse();
}
function s(e, o) {
	const { startIndex: r, endIndex: n, weight: t } = i(e, o);
	if (r === n) return o[r].color;
	return new g$2(g$2.blendColors(o[r].color, o[n].color, t));
}
function i(l, e) {
	let o = 0, r = e.length - 1;
	return e.some((e, n) => l < e.value ? (r = n, !0) : (o = n, !1)), {
		startIndex: o,
		endIndex: r,
		weight: (l - e[o].value) / (e[r].value - e[o].value)
	};
}
function c(e, o) {
	let r = [];
	if ("multipart" === e?.type) e.colorRamps.reverse().forEach((n, t) => {
		0 === t ? r.push({
			value: o.max,
			color: new g$2(n.toColor),
			label: "high"
		}) : r.push({
			value: null,
			color: new g$2(n.toColor),
			label: ""
		}), t === e.colorRamps.length - 1 ? r.push({
			value: o.min,
			color: new g$2(n.fromColor),
			label: "low"
		}) : r.push({
			value: null,
			color: new g$2(n.fromColor),
			label: ""
		});
	});
	else {
		let n, t;
		"algorithmic" === e?.type ? (n = e.fromColor, t = e.toColor) : (n = [
			0,
			0,
			0,
			1
		], t = [
			255,
			255,
			255,
			1
		]), r = [{
			value: o.max,
			color: new g$2(t),
			label: "high"
		}, {
			value: o.min,
			color: new g$2(n),
			label: "low"
		}];
	}
	return r;
}
//#endregion
//#region node_modules/@arcgis/core/widgets/Legend/support/heatmapRampUtils.js
function r(r) {
	if (!r.colorStops) return [];
	const e = [...r.colorStops].filter((o) => o.color?.a > 0);
	let t = e.length - 1;
	if (e && e[0]) {
		const r = e[t];
		r && 1 !== r.ratio && (e.push(new l$1({
			ratio: 1,
			color: r.color
		})), t++);
	}
	return e.map((o, e) => {
		let l = "";
		return 0 === e ? l = r.legendOptions?.minLabel || "low" : e === t && (l = r.legendOptions?.maxLabel || "high"), {
			color: o.color,
			label: l,
			ratio: o.ratio
		};
	}).reverse();
}
N$1("short-date");
async function w(e, l, t) {
	e$1(e, l, () => []).push(...t);
}
async function x(l) {
	const t$1 = /* @__PURE__ */ new Map();
	if (!l) return t$1;
	if ("visualVariables" in l && l.visualVariables) {
		for (const e of l.visualVariables) if (D(e)) {
			const l = (await t(e) ?? []).map((e) => e.color);
			await w(t$1, e.field || e.valueExpression, l);
		}
	}
	if ("heatmap" === l.type) {
		const e = r(l).map((e) => e.color);
		await w(t$1, l.field || l.valueExpression, e);
	} else if ("pie-chart" === l.type) {
		for (const e of l.attributes) await w(t$1, e.field || e.valueExpression, [e.color]);
		await w(t$1, "default", [l?.othersCategory?.color, b$1(l.backgroundFillSymbol, null)]);
	} else if ("dot-density" === l.type) {
		for (const e of l.attributes) await w(t$1, e.field || e.valueExpression, [e.color]);
		await w(t$1, "default", [l.backgroundColor]);
	} else if ("unique-value" === l.type) if ("predominance" === l.authoringInfo?.type) for (const e of l.uniqueValueInfos ?? []) await w(t$1, e.value.toString(), [b$1(e.symbol, null)]);
	else {
		const e = (l.uniqueValueInfos ?? []).map((e) => b$1(e.symbol, null)), { field: i, field2: o, field3: a, valueExpression: n } = l;
		(i || n) && await w(t$1, i || n, e), o && await w(t$1, o, e), a && await w(t$1, a, e);
	}
	else if ("class-breaks" === l.type) {
		const e = l.classBreakInfos.map((e) => b$1(e.symbol, null)), { field: i, valueExpression: o } = l;
		await w(t$1, i ?? o, e);
	} else "simple" === l.type && await w(t$1, "default", [b$1(l.symbol, null)]);
	return "defaultSymbol" in l && l.defaultSymbol && await w(t$1, "default", [b$1(l.defaultSymbol, null)]), t$1.forEach((l, i) => {
		const o = c$3(l.filter(Boolean), (e, l) => JSON.stringify(e) === JSON.stringify(l));
		t$1.set(i, o);
	}), t$1;
}
function D(e) {
	return "color" === e.type;
}
//#endregion
export { l as _, t as a, V as c, g$1 as d, h$1 as f, i$1 as g, w$1 as h, s as i, c$1 as l, m, r as n, u as o, j as p, c as r, C as s, x as t, d as u, u$2 as v };

//# sourceMappingURL=utils-CMtmxS-D.js.map