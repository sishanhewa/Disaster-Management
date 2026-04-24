import { P as h$1, _ as t$2, a as a$2, c as e$4, g as s$3, h as r$3, l as f$2, m as o$4, o as c$2, v as u$2 } from "./typedArrayUtil-BAuNmygZ.js";
//#region node_modules/@arcgis/core/core/has.js
var e$3 = globalThis, a$1 = { ...e$3.esriConfig?.has };
function has(d) {
	return "function" == typeof a$1[d] ? a$1[d] = a$1[d](e$3) : a$1[d];
}
has.add = (e, d, r, t) => {
	(t || void 0 === a$1[e]) && (a$1[e] = d), r && has(e);
}, has.cache = a$1, has.add("big-integer-warning-enabled", !0), has.add("esri-deprecation-warnings", !0), has.add("esri-tests-disable-screenshots", !1), has.add("esri-tests-use-full-window", !1), has.add("esri-tests-post-to-influx", !0), has.add("esri-cim-animations-enable-status", "enabled"), has.add("esri-cim-animations-spotlight", !1), has.add("esri-cim-animations-freeze-time", !1), (() => {
	has.add("host-webworker", void 0 !== e$3.WorkerGlobalScope && self instanceof e$3.WorkerGlobalScope);
	const a = "undefined" != typeof window && "undefined" != typeof location && "undefined" != typeof document && window.location === location && window.document === document;
	if (has.add("host-browser", a), has.add("host-node", !("object" != typeof e$3.process || !e$3.process.versions?.node || !e$3.process.versions.v8)), has.add("dom", a), has("host-browser")) {
		const e = navigator, a = e.userAgent, d = e.appVersion, r = parseFloat(d);
		if (has.add("wp", parseFloat(a.split("Windows Phone")[1]) || void 0), has.add("msapp", parseFloat(a.split("MSAppHost/")[1]) || void 0), has.add("khtml", d.includes("Konqueror") ? r : void 0), has.add("edge", parseFloat(a.split("Edge/")[1]) || void 0), has.add("opr", parseFloat(a.split("OPR/")[1]) || void 0), has.add("webkit", !has("wp") && !has("edge") && parseFloat(a.split("WebKit/")[1]) || void 0), has.add("chrome", !has("edge") && !has("opr") && parseFloat(a.split("Chrome/")[1]) || void 0), has.add("android", !has("wp") && parseFloat(a.split("Android ")[1]) || void 0), has.add("safari", !d.includes("Safari") || has("wp") || has("chrome") || has("android") || has("edge") || has("opr") ? void 0 : parseFloat(d.split("Version/")[1])), has.add("mac", d.includes("Macintosh")), !has("wp") && /(iPhone|iPod|iPad)/.test(a)) {
			const e = RegExp.$1.replace(/P/, "p"), d = /OS ([\d_]+)/.test(a) ? RegExp.$1 : "1", r = parseFloat(d.replace(/_/, ".").replaceAll("_", ""));
			has.add(e, r), has.add("ios", r);
		}
		has("webkit") || (!a.includes("Gecko") || has("wp") || has("khtml") || has("edge") || has.add("mozilla", r), has("mozilla") && has.add("ff", parseFloat(a.split("Firefox/")[1] || a.split("Minefield/")[1]) || void 0));
	}
})(), (() => {
	if (e$3.navigator) {
		const e = navigator.userAgent, a = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(e), d = /iPhone/i.test(e);
		a && has.add("esri-mobile", a), d && has.add("esri-iPhone", d), has.add("esri-geolocation", !!navigator.geolocation);
	}
	has.add("esri-wasm", "WebAssembly" in e$3), has.add("esri-performance-mode-frames-between-render", 20), has.add("esri-force-performance-mode", !1), has.add("esri-shared-array-buffer", () => {
		const a = "SharedArrayBuffer" in e$3, d = !1 === e$3.crossOriginIsolated;
		return a && !d;
	}), has.add("wasm-simd", () => {
		return WebAssembly.validate(new Uint8Array([
			0,
			97,
			115,
			109,
			1,
			0,
			0,
			0,
			1,
			5,
			1,
			96,
			0,
			1,
			123,
			3,
			2,
			1,
			0,
			10,
			10,
			1,
			8,
			0,
			65,
			0,
			253,
			15,
			253,
			98,
			11
		]));
	}), has.add("esri-atomics", "Atomics" in e$3), has.add("esri-workers", "Worker" in e$3), has.add("web-feat:cache", "caches" in e$3), has.add("esri-workers-arraybuffer-transfer", !has("safari") || Number(has("safari")) >= 12), has.add("workers-pool-size", 8), has.add("featurelayer-simplify-thresholds", [
		.5,
		.5,
		.5,
		.5
	]), has.add("featurelayer-simplify-payload-size-factors", [
		1,
		1,
		4
	]), has.add("featurelayer-animation-enabled", !0), has.add("featurelayer-snapshot-enabled", !0), has.add("featurelayer-snapshot-initial-tolerance", 0), has.add("featurelayer-snapshot-point-min-threshold", 8e4), has.add("featurelayer-snapshot-point-max-threshold", 4e5), has.add("featurelayer-snapshot-multipoint-min-threshold", 2e4), has.add("featurelayer-snapshot-multipoint-max-threshold", 1e5), has.add("featurelayer-snapshot-polygon-min-threshold", 2e3), has.add("featurelayer-snapshot-polygon-max-threshold", 2e3), has.add("featurelayer-snapshot-polyline-min-threshold", 2e3), has.add("featurelayer-snapshot-polyline-max-threshold", 2e3), has.add("featurelayer-snapshot-max-vertex-count", 25e4), has.add("featurelayer-snapshot-non-hosted-exceedslimit-enabled", !0), has.add("featurelayer-snapshot-concurrency", 4), has.add("featurelayer-snapshot-allow-editable", !1), has.add("featurelayer-snapshot-coverage", .1), has.add("featurelayer-query-max-depth", 4), has.add("featurelayer-query-max-page-size", 8e3), has.add("featurelayer-query-pausing-enabled", !1), has.add("featurelayer-query-tile-concurrency", 4), has.add("featurelayer-query-tile-max-features", 6e5), has.add("featurelayer-advanced-symbols", !1), has.add("featurelayer-pbf", !0), has.add("featurelayer-pbf-statistics", !1), has.add("featurelayer-pbf-true-curves", !0), has.add("feature-layers-workers", !0), has.add("feature-polyline-generalization-factor", 1), has.add("featurelayer-relative-time-queries-enabled", !0), has.add("featurelayer-relative-time-queries-bin-window-public", 1), has.add("featurelayer-relative-time-queries-bin-window-private", 60), has.add("parquetlayer-full-query-feature-count", 2e4), has.add("parquetlayer-hittest-max-feature-count", 1), has.add("parquetlayer-persistence-enabled", !1), has.add("parquetlayer-cache-enabled", !0), has.add("mapview-transitions-duration", 200), has.add("mapview-essential-goto-duration", 200), has.add("mapview-srswitch-adjust-rotation-scale-threshold", 24e6), has.add("mapserver-pbf-version-support", 10.81), has.add("mapservice-popup-identify-max-tolerance", 20), has.add("request-queue-concurrency-global", 50), has.add("request-queue-concurrency-hosted", 16), has.add("request-queue-concurrency-non-hosted", 10), has.add("curve-densification-coarse-segments", 128), has.add("curve-densification-max-segments", 2e3), has.add("curve-densification-min-segments", 3), has.add("curve-densification-pixel-deviation", .5), has.add("view-readyState-waiting-delay", 1e3), has.add("gradient-depth-bias", .01), has.add("gradient-depth-epsilon", 1e-8), has.add("enable-feature:esri-compress-textures", !0), has.add("enable-feature:basemap-groundlayers", !0), has.add("enable-feature:oit-ground", !0), !has("host-webworker") && has("host-browser") && (has.add("esri-csp-restrictions", () => {
		try {
			new Function();
		} catch {
			return !0;
		}
		return !1;
	}), has.add("esri-url-encodes-apostrophe", () => {
		const e = window.document.createElement("a");
		return e.href = "?'", e.href.includes("?%27");
	}));
})();
//#endregion
//#region node_modules/@arcgis/core/core/lang.js
function l$2(t, n) {
	let e;
	if (n) for (e in t) t.hasOwnProperty(e) && (void 0 === t[e] ? delete t[e] : t[e] instanceof Object && l$2(t[e], !0));
	else for (e in t) t.hasOwnProperty(e) && void 0 === t[e] && delete t[e];
	return t;
}
function a(t) {
	if (!t || "object" != typeof t || "function" == typeof t) return t;
	const n = O(t);
	if (null != n) return n;
	if (y(t)) return t.clone();
	if (b(t)) return t.map(a);
	if (m$1(t)) throw new Error("Trying to clone an unclonable Accessor instance");
	const e = {};
	for (const r of Object.getOwnPropertyNames(t)) e[r] = a(t[r]);
	return e;
}
function p$1(t, n) {
	if (!t || "object" != typeof t || "function" == typeof t || "HTMLElement" in globalThis && t instanceof HTMLElement) return t;
	const e = O(t);
	if (null != e) return e;
	if (b(t)) {
		let e = !0;
		const r = t.map((t) => {
			const r = p$1(t, n);
			return null != t && null == r && (e = !1), r;
		});
		return e ? r : null;
	}
	if (y(t)) return t.clone(n);
	if (t instanceof File || t instanceof Blob) return t;
	if (m$1(t)) return null;
	const r = new (Object.getPrototypeOf(t)).constructor();
	for (const o of Object.getOwnPropertyNames(t)) {
		const n = t[o], e = p$1(n);
		if (null != n && null == e) return null;
		r[o] = e;
	}
	return r;
}
function y(t) {
	return "function" == typeof t.clone;
}
function b(t) {
	return "function" == typeof t.map && "function" == typeof t.forEach;
}
function m$1(t) {
	return "function" == typeof t.notifyChange && "function" == typeof t.watch;
}
function g$1(t) {
	if ("[object Object]" !== Object.prototype.toString.call(t)) return !1;
	const n = Object.getPrototypeOf(t);
	return null === n || n === Object.prototype;
}
function O(t) {
	if (r$3(t) || t$2(t) || u$2(t) || o$4(t) || c$2(t) || e$4(t) || a$2(t) || f$2(t) || s$3(t)) return t.slice();
	if (t instanceof Date) return new Date(t);
	if (t instanceof ArrayBuffer) return t.slice(0, t.byteLength);
	if (t instanceof Map) {
		const n = /* @__PURE__ */ new Map();
		for (const [e, r] of t) n.set(e, a(r));
		return n;
	}
	if (t instanceof Set) {
		const n = /* @__PURE__ */ new Set();
		for (const e of t) n.add(a(e));
		return n;
	}
	return null;
}
function j(t, n) {
	return t === n || "number" == typeof t && isNaN(t) && "number" == typeof n && isNaN(n) || "function" == typeof t?.getTime && "function" == typeof n?.getTime && t.getTime() === n.getTime() || !1;
}
function h(n, e) {
	return n === e || (null == n || "string" == typeof n ? n === e : "number" == typeof n ? n === e || "number" == typeof e && isNaN(n) && isNaN(e) : n instanceof Date ? e instanceof Date && n.getTime() === e.getTime() : Array.isArray(n) ? Array.isArray(e) && h$1(n, e) : n instanceof Set ? e instanceof Set && N(n, e) : n instanceof Map ? e instanceof Map && T(n, e) : !!g$1(n) && g$1(e) && w(n, e));
}
function w(t, n) {
	if (null === t || null === n) return !1;
	const e = Object.keys(t);
	if (null === n || Object.keys(n).length !== e.length) return !1;
	for (const r of e) if (t[r] !== n[r] || !Object.prototype.hasOwnProperty.call(n, r)) return !1;
	return !0;
}
function N(t, n) {
	if (t.size !== n.size) return !1;
	for (const e of t) if (!n.has(e)) return !1;
	return !0;
}
function T(t, n) {
	if (t.size !== n.size) return !1;
	for (const [e, r] of t) {
		const t = n.get(e);
		if (t !== r || void 0 === t && !n.has(e)) return !1;
	}
	return !0;
}
//#endregion
//#region node_modules/@arcgis/core/core/object.js
function n$3(r, n, t = !1) {
	return f$1(r, n, t);
}
function t$1(r, n) {
	if (null != n) return n[r] || u$1(r.split("."), !1, n);
}
function e$2(r, n, t) {
	const e = r.split("."), i = e.pop(), f = u$1(e, !0, t);
	f && i && (f[i] = n);
}
function i$3(r, n) {
	if (null == r && null == n) return !1;
	if (null == r) return !0;
	if (null == n) return !0;
	if ("object" == typeof r) {
		if (Array.isArray(r)) {
			const t = n;
			if (r.length !== t.length) return !0;
			for (let n = 0; n < r.length; n++) if (i$3(r[n], t[n])) return !0;
			return !1;
		}
		if (Object.keys(r).length !== Object.keys(n).length) return !0;
		for (const t in r) if (i$3(r[t], n[t])) return !0;
		return !1;
	}
	return r !== n;
}
function u$1(r, n, t) {
	let e = t;
	for (const i of r) {
		if (null == e) return;
		if (!(i in e)) {
			if (!n) return;
			e[i] = {};
		}
		e = e[i];
	}
	return e;
}
function f$1(n, t, e) {
	return t ? Object.keys(t).reduce((n, i) => {
		if ("__proto__" === i) return n;
		let u = n[i], o = t[i];
		return u === o ? n : void 0 === u ? (n[i] = a(o), n) : (Array.isArray(o) || Array.isArray(n) ? (u = u ? Array.isArray(u) ? n[i] = u.slice() : n[i] = [u] : n[i] = [], o && (Array.isArray(o) || (o = [o]), e ? o.forEach((r) => {
			u.includes(r) || u.push(r);
		}) : n[i] = o.slice())) : o && "object" == typeof o ? n[i] = f$1(u, o, e) : n.hasOwnProperty(i) && !t.hasOwnProperty(i) || (n[i] = o), n);
	}, n || {}) : n;
}
function o$3(r, n) {
	for (const t of Object.entries(r)) if (n === t[1]) return t[0];
}
function l$1(r, n) {
	return Object.values(r).includes(n);
}
//#endregion
//#region node_modules/@arcgis/core/config.js
var s$2 = {
	apiKey: void 0,
	apiKeys: { scopes: [] },
	applicationName: "",
	applicationUrl: globalThis.location?.href,
	assetsPath: "",
	fontsUrl: "https://static.arcgis.com/fonts",
	geometryServiceUrl: "https://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer",
	geoRSSServiceUrl: "https://utility.arcgis.com/sharing/rss",
	kmlServiceUrl: "https://utility.arcgis.com/sharing/kml",
	userPrivilegesApplied: !0,
	portalUrl: "https://www.arcgis.com",
	respectPrefersReducedMotion: !0,
	routeServiceUrl: "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
	workers: { loaderConfig: {
		has: {},
		paths: {},
		map: {},
		packages: []
	} },
	request: {
		crossOriginNoCorsDomains: null,
		httpsDomains: [
			"arcgis.com",
			"arcgisonline.com",
			"esrikr.com",
			"premiumservices.blackbridge.com",
			"esripremium.accuweather.com",
			"gbm.digitalglobe.com",
			"firstlook.digitalglobe.com",
			"msi.digitalglobe.com"
		],
		interceptors: [],
		internalInterceptors: [],
		maxUrlLength: 2e3,
		priority: "high",
		proxyRules: [],
		proxyUrl: null,
		timeout: 62e3,
		trustedServers: [],
		useIdentity: !0
	},
	log: {
		interceptors: [],
		level: null
	}
};
if (globalThis.esriConfig && (n$3(s$2, globalThis.esriConfig, !0), delete s$2.has), !s$2.assetsPath) {
	s$2.assetsPath = `https://js.arcgis.com/5.0.17/@arcgis/core/assets`;
	s$2.defaultAssetsPath = s$2.assetsPath;
}
//#endregion
//#region node_modules/@arcgis/core/core/deprecate.js
var e$1 = /* @__PURE__ */ new WeakMap();
function n$2(n, t, r = !1) {
	const o = `🛑 DEPRECATED - ${t}`;
	if (!r) return void n.warn(o);
	let i = e$1.get(n);
	i || (i = /* @__PURE__ */ new Set(), e$1.set(n, i)), i.has(t) || (i.add(t), n.warn(o));
}
function r$2(e, n, r, o = {}) {
	has("esri-deprecation-warnings") && m(e, `This widget is deprecated. Use the ${n} component instead.`, {
		see: [`${n} component reference: https://www.esriurl.com/${r}/`, `Esri's move to web components: https://www.esriurl.com/components-transition-plan/`],
		replacement: `<${r}></${r}>`,
		warnOnce: !0,
		...o
	});
}
function o$2(e, n, r, o = {}) {
	has("esri-deprecation-warnings") && m(e, `This class is deprecated. Use the ${n} component instead.`, {
		see: [`${n} component reference: https://www.esriurl.com/${r}/`, `Esri's move to web components: https://www.esriurl.com/components-transition-plan/`],
		replacement: `<${r}></${r}>`,
		warnOnce: !0,
		...o
	});
}
function i$2(e, n, t = {}) {
	has("esri-deprecation-warnings") && m(e, `Module: ${$(n)}`, t);
}
function s$1(e, n, t = {}) {
	if (has("esri-deprecation-warnings")) {
		const { moduleName: r } = t;
		m(e, `Function: ${(r ? $(r) + "::" : "") + n + "()"}`, t);
	}
}
function c$1(e, n, t = {}) {
	if (has("esri-deprecation-warnings")) {
		const { moduleName: r } = t;
		m(e, `Property: ${(r ? $(r) + "::" : "") + n}`, t);
	}
}
function p(e, n, t = {}) {
	has("esri-deprecation-warnings") && m(e, `Multiple argument constructor: ${n = $(n)}`, {
		warnOnce: !0,
		replacement: `new ${n}({ <your properties here> })`,
		...t
	});
}
function m(e, t, r = {}) {
	if (has("esri-deprecation-warnings")) {
		const { replacement: o, version: i, see: s, warnOnce: c } = r;
		let a = t;
		if (o && (a += `\n\t🛠️ Replacement: ${o}`), i && (a += `\n\t⚙️ Version: ${i}`), s) if (Array.isArray(s)) {
			a += "\n	🔗 See for more details:";
			for (const e of s) a += `\n\t\t${e}`;
		} else a += `\n\t🔗 See ${s} for more details.`;
		n$2(e, a, c);
	}
}
function $(e) {
	return e.startsWith("esri.") ? e.replace("esri.", "@arcgis/core/").replaceAll(".", "/") : e;
}
//#endregion
//#region node_modules/@arcgis/core/core/string.js
var e = /\{([^}]+)\}/g;
function n$1(t) {
	return t ?? "";
}
function r$1(r, o) {
	return o ? r.replaceAll(e, "object" == typeof o ? (e, r) => n$1(t$1(r, o)) : (t, e) => n$1(o(e))) : r;
}
function o$1(e, n) {
	return e.replaceAll(/\$\{([^\s:}]*)(?::([^\s:}]+))?\}/g, (e, r) => {
		if ("" === r) return "$";
		return (t$1(r, n) ?? "").toString();
	});
}
function u(t, e) {
	return t.replaceAll(/([.$?*|{}()[\]\\/+\-^])/g, (t) => e?.includes(t) ? t : `\\${t}`);
}
function l(t) {
	let e = 0;
	for (let n = 0; n < t.length; n++) e = (e << 5) - e + t.charCodeAt(n), e |= 0;
	return e;
}
var c;
function i$1(t) {
	c ??= new DOMParser();
	return c.parseFromString(t || "", "text/html").body.innerText || "";
}
function f(t, e) {
	return new RegExp(`{${e}}`, "ig").test(t);
}
function g(t, ...e) {
	let n = t[0];
	for (let r = 0; r < e.length; ++r) n += e[r] + t[r + 1];
	return n;
}
//#endregion
//#region node_modules/@arcgis/core/core/Logger.js
var i = {
	info: 0,
	warn: 1,
	error: 2,
	none: 3
};
var n = class n {
	constructor(e) {
		this.level = null, this._module = "", this._parent = null, this.writer = null, this._loggedMessages = {
			error: /* @__PURE__ */ new Map(),
			warn: /* @__PURE__ */ new Map(),
			info: /* @__PURE__ */ new Map()
		}, null != e.level && (this.level = e.level), null != e.writer && (this.writer = e.writer), this._module = e.module, n._loggers.set(this.module, this);
		const t = this.module.lastIndexOf(".");
		-1 !== t && (this._parent = n.getLogger(this.module.slice(0, t)));
	}
	get module() {
		return this._module;
	}
	get parent() {
		return this._parent;
	}
	error(...e) {
		this._log("error", "always", ...e);
	}
	warn(...e) {
		this._log("warn", "always", ...e);
	}
	info(...e) {
		this._log("info", "always", ...e);
	}
	errorOnce(...e) {
		this._log("error", "once", ...e);
	}
	warnOnce(...e) {
		this._log("warn", "once", ...e);
	}
	infoOnce(...e) {
		this._log("info", "once", ...e);
	}
	errorOncePerTick(...e) {
		this._log("error", "oncePerTick", ...e);
	}
	warnOncePerTick(...e) {
		this._log("warn", "oncePerTick", ...e);
	}
	infoOncePerTick(...e) {
		this._log("info", "oncePerTick", ...e);
	}
	get test() {}
	static get test() {}
	static getLogger(e) {
		return e = "string" != typeof e ? e.declaredClass : e, n._loggers.get(e) || new n({ module: e });
	}
	static {
		this._loggers = /* @__PURE__ */ new Map();
	}
	static {
		this._tickCounter = 0;
	}
	static {
		this._tickCounterScheduled = !1;
	}
	static {
		this._throttlingDisabled = !1;
	}
	_log(t, r, ...i) {
		if (!this._matchLevel(t)) return;
		if ("always" !== r && !n._throttlingDisabled) {
			const e = s(i), o = this._loggedMessages[t].get(e);
			if ("once" === r && null != o || "oncePerTick" === r && o && o >= n._tickCounter) return;
			this._loggedMessages[t].set(e, n._tickCounter), n._scheduleTickCounterIncrement();
		}
		for (const n of s$2.log.interceptors) if (n(t, this.module, ...i)) return;
		this._inheritedWriter()(t, this.module, ...i);
	}
	_parentWithMember(e, t) {
		let r = this;
		for (; null != r;) {
			const t = r[e];
			if (null != t) return t;
			r = r.parent;
		}
		return t;
	}
	_inheritedWriter() {
		return this._parentWithMember("writer", o);
	}
	_matchLevel(t) {
		const r = s$2.log.level || "warn";
		return i[this._parentWithMember("level", r)] <= i[t];
	}
	static _scheduleTickCounterIncrement() {
		n._tickCounterScheduled || (n._tickCounterScheduled = !0, Promise.resolve().then(() => {
			n._tickCounter++, n._tickCounterScheduled = !1;
		}));
	}
};
function o(e, r, ...i) {
	console[e](`[${$(r)}]`, ...i);
}
function s(...e) {
	const t = (e, t) => "object" != typeof t || Array.isArray(t) ? t : "[Object]";
	return l(JSON.stringify(e, t));
}
//#endregion
//#region node_modules/@arcgis/core/core/Error.js
var r = class r {
	constructor(t, e, r) {
		this.type = "error", this.name = t, this.message = e ? o$1(e, r) : "", this.details = r;
	}
	toString() {
		const { name: t, message: e } = this;
		return `[${t}]: ${e}`;
	}
	toJSON() {
		if (null != this.details) try {
			return {
				name: this.name,
				message: this.message,
				details: JSON.parse(JSON.stringify(this.details, (e, s) => {
					if (s && "object" == typeof s && "function" == typeof s.toJSON) return s;
					try {
						return a(s);
					} catch (r) {
						return "[object]";
					}
				}))
			};
		} catch (s) {
			throw n.getLogger("esri.core.Error").error(s), s;
		}
		return {
			name: this.name,
			message: this.message,
			details: this.details
		};
	}
	static fromJSON(t) {
		return new r(t.name, t.message, t.details);
	}
};
//#endregion
export { has as A, t$1 as C, l$2 as D, j as E, p$1 as O, o$3 as S, h as T, s$2 as _, i$1 as a, l$1 as b, r$1 as c, i$2 as d, m as f, s$1 as g, r$2 as h, g as i, y as k, u as l, p as m, n, l as o, o$2 as p, f as r, o$1 as s, r as t, c$1 as u, e$2 as v, a as w, n$3 as x, i$3 as y };

//# sourceMappingURL=Error-CzxduO2m.js.map