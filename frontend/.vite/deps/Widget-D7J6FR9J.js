import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as n$4, w as a } from "./Error-CzxduO2m.js";
import { et as _ } from "./request-CuG5cxow.js";
import { L as e$2, N as n$5, P as o$2, j as u, o as L, v as m } from "./promiseUtils-DhYhergm.js";
import { n as c$1, t as a$1 } from "./decorators-DE7S5xmd.js";
import { s as s$1 } from "./Accessor-kDoDKy4v.js";
import { n as f } from "./tracking-DBoczQof.js";
import { n as l } from "./Evented-GLJbxWO5.js";
import { t as m$1 } from "./Promise-Dhhz7kXA.js";
import { t as n$6 } from "./assets-BZbzeyNa.js";
import { c as w, i as f$1, s as l$1 } from "./reactiveUtils-DRpp6Nmg.js";
import { n as n$7 } from "./uuid-CI605U6Y.js";
import { n as N, r as R } from "./intl-1FbLkipu.js";
import { _ as t$3, b as e$4, g as o$3, h as e$3, m as c$2, o as p, v as d$1, x as t$4, y as f$2 } from "./widget-BsQfm1ik.js";
import { n as n$8 } from "./projector-76ZJJlBX.js";
import { o as setAssetPath$1 } from "./runtime-C8rHe43j.js";
//#region node_modules/@arcgis/core/core/domUtils.js
function n$3(n) {
	return "string" == typeof n ? document.getElementById(n) : n ?? null;
}
function t$2(n, t) {
	for (;;) {
		const e = n.firstChild;
		if (!e) break;
		t.appendChild(e);
	}
}
//#endregion
//#region node_modules/@arcgis/core/libs/maquette-advanced-projector/advanced-projector-options.js
var e$1 = { handleInterceptedEvent: (e, p, t, n) => (e.scheduleRender(), p.properties[`on${n.type}`].apply(p.properties.bind || t, [n])) };
//#endregion
//#region node_modules/@arcgis/core/libs/maquette-advanced-projector/utils.js
var e = {
	namespace: void 0,
	performanceLogger: () => {},
	eventHandlerInterceptor: void 0,
	styleApplyer: (e, t, r) => {
		t.startsWith("-") ? e.style.setProperty(t, r) : e.style[t] = r;
	}
}, t$1 = (t) => ({
	...e,
	...t
});
//#endregion
//#region node_modules/@arcgis/core/libs/maquette-advanced-projector/projector.js
var o$1 = (e, r) => {
	const t = [];
	for (; e && e !== r;) t.push(e), e = e.parentNode;
	return t;
}, n$2 = (e, r) => e.find(r), d = (e, r, t = !1) => {
	let o = e;
	return r.forEach((e, d) => {
		const s = o?.children ? n$2(o.children, (r) => r.domNode === e) : void 0;
		t && !s && d !== r.length - 1 || (o = s);
	}), o;
}, s = (n) => {
	let s;
	const c = {
		...e$1,
		...n
	}, i = t$1(c), a = i.performanceLogger;
	let m, p = !0, l = !1;
	const f = [], u = [], h = (e, r, t) => {
		let n;
		i.eventHandlerInterceptor = (e, r, t, i) => function(e) {
			let r;
			a("domEvent", e);
			const t = o$1(e.currentTarget, n.domNode), i = t.some((e) => customElements.get(e?.tagName?.toLowerCase()));
			if (e.eventPhase === Event.CAPTURING_PHASE || !i) t.reverse(), r = d(n.getLastRender(), t);
			else {
				const t = e.composedPath(), o = t.slice(t.indexOf(e.currentTarget), t.indexOf(n.domNode)).reverse();
				r = d(n.getLastRender(), o, !0);
			}
			let m;
			return r && (m = c.handleInterceptedEvent(s, r, this, e)), a("domEventProcessed", e), m;
		}, c.postProcessProjectionOptions?.(i);
		const m = t();
		n = e(r, m, i), i.eventHandlerInterceptor = void 0, f.push(n), u.push(t), c.afterFirstVNodeRendered && c.afterFirstVNodeRendered(n, m);
	};
	let v = () => {
		if (m = void 0, p) {
			p = !1, a("renderStart", void 0);
			for (let r = 0; r < f.length; r++) {
				const t = u[r]();
				a("rendered", void 0);
				try {
					f[r].update(t);
				} catch (e) {
					console.error(e);
				}
				a("patched", void 0);
			}
			a("renderDone", void 0), p = !0;
		}
	};
	return c.modifyDoRenderImplementation && (v = c.modifyDoRenderImplementation(v, f, u)), s = {
		renderNow: v,
		scheduleRender: () => {
			m || l || (m = requestAnimationFrame(v));
		},
		stop: () => {
			m && (cancelAnimationFrame(m), m = void 0), l = !0;
		},
		resume: () => {
			l = !1, p = !0, s.scheduleRender();
		},
		append: (r, t) => {
			h(n$8.append, r, t);
		},
		insertBefore: (r, t) => {
			h(n$8.insertBefore, r, t);
		},
		merge: (r, t) => {
			h(n$8.merge, r, t);
		},
		replace: (r, t) => {
			h(n$8.replace, r, t);
		},
		detach: (e) => {
			for (let r = 0; r < u.length; r++) if (u[r] === e) return u.splice(r, 1), f.splice(r, 1)[0];
			throw new Error("renderFunction was not found");
		}
	}, s;
};
//#endregion
//#region node_modules/@esri/calcite-components/dist/index.js
var assetPathChanged = false;
var setAssetPath = (path) => {
	assetPathChanged = true;
	setAssetPath$1(path);
};
//#endregion
//#region node_modules/@arcgis/core/widgets/support/componentsUtils.js
var n$1;
function r() {
	assetPathChanged || setAssetPath(_(n$6(n$1)));
}
function c(t) {
	const o = [];
	for (const s of Object.keys(t)) customElements.get(`calcite-${s}`) || o.push(t[s]?.());
	return o.length > 0 ? Promise.all(o) : null;
}
n$1 = "components/assets";
//#endregion
//#region node_modules/@arcgis/core/widgets/support/tests.js
var t = /* @__PURE__ */ new Set();
function n(e) {
	t.add(e), e.finally(() => t.delete(e));
}
function o(t) {
	return e$2();
}
//#endregion
//#region node_modules/@arcgis/core/widgets/Widget.js
var H;
var $ = 0;
function D(e, t) {
	const r = Object.prototype.hasOwnProperty;
	for (const s in t) r.call(t, s) && r.call(e, s) && (null != e[s] && null != t[s] && "object" == typeof e[s] && "object" == typeof t[s] ? D(e[s], t[s]) : e[s] = t[s]);
	return e;
}
var U = s({
	postProcessProjectionOptions(e) {
		const t = e.eventHandlerInterceptor, r = /capture$/i;
		e.eventHandlerInterceptor = (e, s, o, i) => {
			const n = t?.(e, s, o, i), d = r.test(e);
			if (!((e = e.replace(r, "")).toLowerCase() in o) || d) {
				const t = e[2].toLowerCase() + e.slice(3), r = (e) => n?.call(o, e);
				o.addEventListener(t, r, d);
				const s = () => o.removeEventListener(t, r, d), a = i.afterRemoved;
				i.afterRemoved = (e) => {
					a?.(e), s();
				};
			}
			return n;
		};
	},
	handleInterceptedEvent(e, t, r, s) {
		const { eventPhase: o, type: i } = s, n = o === Event.CAPTURING_PHASE;
		let d = `on${i}${n ? "capture" : ""}`;
		const a = t.properties;
		(a && d in a || (d = `on${i[0].toUpperCase()}${i.slice(1)}${n ? "Capture" : ""}`, a && d in a)) && (t$3(), e.scheduleRender(), a[d].call(a.bind || r, s));
	}
});
var z = !1, x = class extends m$1(l) {
	static {
		this[H] = !0;
	}
	constructor(e, r$1) {
		super(e, r$1), this._attached = !1, this._projector = U, this._readyForTrueRender = !1, this.key = this, this.autoRenderingEnabled = !0, this.topLayerDisabled = !1, this._loadLocale = L(async () => {
			if (this._messageBundleProps?.length) {
				const e = await Promise.allSettled(this._messageBundleProps.map(async ({ bundlePath: e, propertyName: r }) => {
					if (this.destroyed) return;
					let s = await N(e);
					this.destroyed || (this.uiStrings && Object.keys(this.uiStrings) && (s = D(a(s), this.uiStrings)), this[r] = s);
				}));
				if (this.destroyed) return;
				for (const t of e) "rejected" === t.status && n$4.getLogger(this).error("widget-intl:locale-error", this.declaredClass, t.reason);
			}
			await this.loadLocale();
		}), this.addHandles(o()), r();
		const s = "esri-widget-uid-" + n$7(), o$4 = this.render.bind(this);
		this._trackingTarget = new s$1(() => {
			this.autoRenderingEnabled && this.scheduleRender();
		});
		const i = () => ({
			vnodeSelector: "div",
			properties: {
				key: `${s}-hidden`,
				class: "",
				styles: { display: "none" }
			},
			domNode: null,
			children: void 0,
			text: void 0
		}), n$9 = () => {
			if (!this._readyForTrueRender || this.destroyed) return null;
			const e = o$4() ?? i(), t = e.properties ??= {};
			if (t.key ??= s, f$2(e.vnodeSelector)) {
				if (!this.visible) return i();
			} else this.visible ? t.styles || (t.styles = {}) : (t.class = "", t.styles = { display: "none" }), t.styles.display ??= "";
			let r = 0;
			return e.children?.forEach((e) => {
				f$2(e.vnodeSelector) || (e.properties ??= {}, e.properties.key ??= `${this.id}--${r++}`);
			}), d$1(this, e);
		};
		this.render = () => {
			if (z) return n$9();
			let e = e$3(this) ?? null;
			if (e) return e;
			this._trackingTarget.clear(), z = !0;
			try {
				e = f(this._trackingTarget, n$9);
			} catch (t) {
				throw n$4.getLogger(this).error(t), t;
			} finally {
				z = !1;
			}
			return e && c$2(this, e), e;
		};
		const l = this.beforeFirstRender();
		l ? this._resourcesFetch = l.then(() => {
			this.destroyed || (this._readyForTrueRender = !0, this._postInitialize());
		}) : (this._resourcesFetch = Promise.resolve().then(() => {
			this.destroyed || this._postInitialize();
		}), this._readyForTrueRender = !0), this.addResolvingPromise(this._resourcesFetch), n(this._resourcesFetch);
	}
	normalizeCtorArgs(e, t) {
		const r = { ...e };
		return t && (r.container = t), r;
	}
	postInitialize() {}
	beforeFirstRender() {
		const e = this.loadDependencies();
		return this._messageBundleProps?.length || e ? Promise.all([e, this._loadLocale()]).then(() => {}).catch(m) : null;
	}
	loadDependencies() {
		return null;
	}
	loadLocale() {
		return null;
	}
	destroy() {
		this.destroyed || (u(this._trackingTarget), u(this.viewModel), this._detach(this.container), this._set("container", null), this.render = () => null, this._projector = null, o$3(this));
	}
	get container() {
		return this._get("container");
	}
	set container(e) {
		this._get("container") || this._set("container", n$3(e));
	}
	get destroyed() {
		return super.destroyed;
	}
	get domNode() {
		return this.container;
	}
	set domNode(e) {
		this.container = e;
	}
	get icon() {
		return null;
	}
	set icon(e) {
		this._overrideIfSome("icon", e);
	}
	get id() {
		return this._get("id") || this.container?.id || Date.now().toString(16) + "-widget-" + $++;
	}
	set id(e) {
		e && this._set("id", e);
	}
	get label() {
		return this.declaredClass.split(".").pop();
	}
	set label(e) {
		this._overrideIfSome("label", e);
	}
	get renderable() {
		return this._resourcesFetch;
	}
	get visible() {
		return this._get("visible");
	}
	set visible(e) {
		this._set("visible", e);
	}
	get [(H = t$4, e$4)]() {
		return { projector: this._projector };
	}
	static {
		this.vnodeSelector = "div";
	}
	render() {
		throw new Error("not implemented");
	}
	removeContainer() {
		this._set("container", null);
	}
	scheduleRender() {
		this.destroyed || (o$3(this), this._projector.scheduleRender());
	}
	classes(...e) {
		return p.apply(this, e);
	}
	renderNow() {
		o$3(this), this._projector.renderNow();
	}
	_postInitialize() {
		if (this.destroyed) return;
		this.scheduleRender(), this._delegatedEventNames?.length && this.addHandles(l$1(() => this.viewModel, (e, t) => {
			t && this.removeHandles("delegated-events"), e && n$5(e) && this.addHandles(this._delegatedEventNames.map((t) => o$2(e, t, (e) => {
				this.emit(t, e);
			})), "delegated-events");
		}, w)), this.postInitialize();
		const e = async () => {
			await this._loadLocale().catch(m), this.scheduleRender();
		};
		this.addHandles([R(e), l$1(() => this.uiStrings, e)]), this.addHandles(f$1(() => this.container, (e) => {
			this.destroyed || (e.closest("[arcgis-widget-wrapped]") || (this.topLayerDisabled = !0, this.announceDeprecation?.()), this._attach(e));
		}, {
			initial: !0,
			once: !0
		}));
	}
	_attach(e) {
		e && (this._projector.merge(e, this.render), this._attached = !0);
	}
	_detach(e) {
		this._attached && (this._projector.detach(this.render), this._attached = !1), e?.parentNode?.removeChild(e);
	}
};
__decorate([a$1()], x.prototype, "_readyForTrueRender", void 0), __decorate([a$1({ value: null })], x.prototype, "container", null), __decorate([a$1()], x.prototype, "icon", null), __decorate([a$1()], x.prototype, "id", null), __decorate([a$1()], x.prototype, "label", null), __decorate([a$1()], x.prototype, "renderable", null), __decorate([a$1()], x.prototype, "uiStrings", void 0), __decorate([a$1()], x.prototype, "viewModel", void 0), __decorate([a$1({ value: !0 })], x.prototype, "visible", null), __decorate([a$1()], x.prototype, "key", void 0), __decorate([a$1()], x.prototype, "children", void 0), __decorate([a$1()], x.prototype, "afterCreate", void 0), __decorate([a$1()], x.prototype, "afterUpdate", void 0), __decorate([a$1()], x.prototype, "afterRemoved", void 0), __decorate([a$1()], x.prototype, "topLayerDisabled", void 0), x = __decorate([c$1("esri.widgets.Widget")], x);
var O = x;
//#endregion
export { t$2 as i, c as n, n$3 as r, O as t };

//# sourceMappingURL=Widget-D7J6FR9J.js.map