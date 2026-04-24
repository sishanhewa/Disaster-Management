import { L as e$5, U as t$4, _ as l$2 } from "./promiseUtils-DhYhergm.js";
import { O as t$5 } from "./Accessor-kDoDKy4v.js";
import { n as K } from "./scheduling-DiUcWka1.js";
import { c as w$1, s as l$3 } from "./reactiveUtils-DRpp6Nmg.js";
//#region node_modules/@arcgis/core/core/keyboard.js
function n$2(n) {
	return "Enter" === n || " " === n;
}
//#endregion
//#region node_modules/@arcgis/core/widgets/support/symbols.js
var t$3 = Symbol("widget"), e$4 = Symbol("widget-test-data");
//#endregion
//#region node_modules/@arcgis/core/widgets/support/jsxWidgetSupport.js
var o$1 = [], n$1 = {}, i = /* @__PURE__ */ new Map();
function d$1(e, t) {
	let r = t.children;
	if (r?.length) for (let o = 0; o < r.length; ++o) r[o] = d$1(e, r[o]);
	else r = o$1;
	const i = t.vnodeSelector;
	if (f$2(i)) {
		const o = t.properties || n$1, d = o.key || i, f = {
			key: d,
			afterCreate: c$1,
			afterUpdate: s,
			afterRemoved: a$2,
			parentWidget: e,
			widgetConstructor: i,
			widgetProperties: {
				...o,
				key: d,
				children: r
			}
		};
		return {
			vnodeSelector: i.vnodeSelector,
			properties: f,
			children: void 0,
			text: void 0,
			domNode: null
		};
	}
	return t;
}
function c$1(t, o, n, { parentWidget: d, widgetConstructor: c, widgetProperties: s }) {
	const f = new c(s);
	f.container = t, i.set(t, f), f.afterCreate?.(f, t), d.addHandles(e$5(() => a$2(t))), queueMicrotask(() => {
		f[e$4].projector?.renderNow();
	});
}
function s(e, t, r, { widgetProperties: o }) {
	const n = i.get(e);
	n && (n.set(o), n.afterUpdate?.(n, e));
}
function a$2(e) {
	const t = i.get(e);
	t && (t.afterRemoved?.(t, e), t.destroy(), i.delete(e));
}
function f$2(e) {
	return "function" == typeof e && e[t$3];
}
//#endregion
//#region node_modules/@arcgis/core/widgets/support/vnodeCache.js
var n = /* @__PURE__ */ new Map();
function t$2() {
	n.clear();
}
function e$3(t) {
	return n.get(t);
}
function c(t, e) {
	n.set(t, e);
}
function o(t) {
	n.delete(t);
}
function v$1(...t) {
	const n = t$5.acquire();
	for (let e = 0; e < t.length; e++) {
		const o = t[e], i = typeof o;
		if ("string" === i) n.push(o);
		else if (Array.isArray(o)) n.push.apply(n, o);
		else if ("object" === i) for (const e in o) o[e] && n.push(e);
	}
	const o = n.join(" ");
	return t$5.release(n), o;
}
(() => {
	const e = /* @__PURE__ */ new Map(), o = new ResizeObserver((t) => {
		t$2();
		for (const n of t) e.get(n.target)?.(n);
	}), s = (t, i, r) => (e.set(t, i), o.observe(t, r), e$5(() => {
		o.unobserve(t), e.delete(t);
	}));
	return (e, o, c) => {
		let a = null;
		return t$4([l$3(() => "function" == typeof e ? e() : e, (e) => {
			a?.remove(), e && (a = s(e, o, c));
		}, w$1), e$5(() => a?.remove())]);
	};
})();
function L(e) {
	const t = e?.closest("[dir]");
	return null !== t && t instanceof HTMLElement && "rtl" === t.dir || "rtl" === document.dir;
}
function E(e) {
	const t = "data-node-ref";
	this[e.getAttribute(t)] = null;
}
function h$1(e) {
	const t = "data-node-ref";
	this[e.getAttribute(t)] = e;
}
async function w(e, t) {
	await K(l$2(t));
	const n = "function" == typeof e ? e() : e;
	n && ("setFocus" in n && "function" == typeof n.setFocus ? await n.setFocus() : n instanceof HTMLElement && n.focus());
}
//#endregion
//#region node_modules/@arcgis/core/widgets/support/decorators/accessibleHandler.js
function t$1() {
	return function(n, t) {
		if (!n[t]) throw new TypeError(`Cannot auto bind undefined function '${String(t)}'`);
		return { value: r(n[t]) };
	};
}
function e$2(n) {
	const t = n?.type;
	return n instanceof KeyboardEvent || "keyup" === t || "keydown" === t || "keypress" === t;
}
function r(t) {
	return function(r, ...o) {
		e$2(r) ? n$2(r.key) && (r.preventDefault(), r.stopPropagation(), r.target.click()) : t.call(this, r, ...o);
	};
}
//#endregion
//#region node_modules/@arcgis/core/widgets/support/decorators/messageBundle.js
function e$1(e) {
	return (s, r) => {
		s.hasOwnProperty("_messageBundleProps") || (s._messageBundleProps = s._messageBundleProps ? s._messageBundleProps.slice() : []);
		s._messageBundleProps.push({
			bundlePath: e,
			propertyName: r
		});
	};
}
//#endregion
//#region node_modules/@arcgis/core/widgets/support/decorators/vmEvent.js
function e(e) {
	return (a) => {
		a.hasOwnProperty("_delegatedEventNames") || (a._delegatedEventNames = a._delegatedEventNames ? a._delegatedEventNames.slice() : []);
		const n = a._delegatedEventNames;
		e = Array.isArray(e) ? e : t(e), n.push(...e);
	};
}
function t(e) {
	return e.split(",").map((e) => e.trim());
}
//#endregion
//#region node_modules/@arcgis/core/widgets/support/widget.js
var a = function(e) {
	return {
		vnodeSelector: "",
		properties: void 0,
		children: void 0,
		text: e.toString(),
		domNode: null
	};
}, u = function(e, o) {
	for (var r = 0, t = e.length; r < t; r++) {
		var n = e[r];
		Array.isArray(n) ? u(n, o) : null != n && !1 !== n && (n.hasOwnProperty("vnodeSelector") || (n = a(n)), o.push(n));
	}
}, f = function(e, o) {
	for (var r = [], t = 2; t < arguments.length; t++) r[t - 2] = arguments[t];
	if (1 === r.length && "string" == typeof r[0]) return {
		vnodeSelector: e,
		properties: o || void 0,
		children: void 0,
		text: r[0],
		domNode: null
	};
	var n = [];
	return u(r, n), {
		vnodeSelector: e,
		properties: o || void 0,
		children: n,
		text: void 0,
		domNode: null
	};
}, l = t$1, p = v$1, v = e$1, m = e, y = L;
function x(e, r, ...t) {
	return "function" != typeof e || f$2(e) ? f(e, r ?? null, ...t) : e(r, ...t);
}
function S(...e) {
	return e;
}
function b(e) {
	return e && "function" == typeof e.render;
}
function N(e) {
	return e && "function" == typeof e.postMixInProperties && "function" == typeof e.buildRendering && "function" == typeof e.postCreate && "function" == typeof e.startup;
}
//#endregion
export { n$2 as S, t$2 as _, m as a, e$4 as b, x as c, L as d, h$1 as f, o as g, e$3 as h, l as i, y as l, c as m, S as n, p as o, w as p, b as r, v as s, N as t, E as u, d$1 as v, t$3 as x, f$2 as y };

//# sourceMappingURL=widget-BsQfm1ik.js.map