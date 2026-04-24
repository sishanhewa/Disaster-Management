import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { A as has } from "./Error-CzxduO2m.js";
import { C as L, K as r$1 } from "./typedArrayUtil-BAuNmygZ.js";
import { t as $ } from "./promiseUtils-DhYhergm.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import { t as b } from "./Accessor-kDoDKy4v.js";
import { t as a$1 } from "./tracking-DBoczQof.js";
import { i as r$2 } from "./Evented-GLJbxWO5.js";
import { t as s$1 } from "./SimpleObservable-CNlRjEs1.js";
import { h as e$1 } from "./util-xsku_21L.js";
import { h as _, u as R } from "./enums-DUaXkkTm.js";
import { t } from "./VertexElementDescriptor-CtQdY5fR.js";
import { t as h } from "./EffectView-R15HeTXu.js";
import { t as o$2 } from "./BufferObject-Bl5cyT6T.js";
import { t as h$1 } from "./VertexArrayObject-CDnnpFXv.js";
import { t as r$3 } from "./VertexBuffer-DseGkba_.js";
//#region node_modules/@arcgis/core/views/2d/engine/transitions/FadeTransition.js
var r = class extends b {
	constructor(t) {
		super(t), this.computedOpacity = 1, this.computedVisible = !0, this.opacity = 1, this.visible = !0, this._fadeOutResolver = null, this._fadeInResolver = null;
	}
	get transitioning() {
		return (this._fadeOutResolver || !this.visible ? 0 : this.opacity) !== this.computedOpacity;
	}
	endTransition() {
		this._fadeInResolver?.(), this._fadeOutResolver?.(), this._fadeInResolver = this._fadeOutResolver = null, this.computedOpacity = this.visible ? this.opacity : 0;
	}
	fadeIn() {
		return this._fadeInResolver || (this.opacity = 1, this.computedOpacity = 0, this._fadeOutResolver?.(), this._fadeOutResolver = null, this._fadeInResolver = $()), this._fadeInResolver.promise;
	}
	fadeOut() {
		return this._fadeOutResolver || (this.opacity = 0, this._fadeInResolver?.(), this._fadeInResolver = null, this._fadeOutResolver = $()), this._fadeOutResolver.promise;
	}
	transitionStep(t, e) {
		const i = has("mapview-transitions-duration"), s = i ? 1 / i : 0;
		if (0 === s) this.computedOpacity = this.opacity, this.computedVisible = this.visible;
		else {
			const e = this._fadeOutResolver || !this.visible ? 0 : this.opacity, i = this.computedOpacity;
			if (i === e) this.computedVisible = this.visible;
			else {
				const o = t * s;
				this.computedOpacity = i > e ? Math.max(e, i - o) : Math.min(e, i + o), this.computedVisible = this.computedOpacity > 0;
			}
		}
		this.transitioning || (this._fadeInResolver?.(), this._fadeOutResolver?.(), this._fadeOutResolver = this._fadeInResolver = null);
	}
};
__decorate([a()], r.prototype, "computedOpacity", void 0), __decorate([a()], r.prototype, "computedVisible", void 0), __decorate([a()], r.prototype, "opacity", void 0), __decorate([a()], r.prototype, "visible", void 0), __decorate([a()], r.prototype, "transitioning", null), __decorate([a()], r.prototype, "_fadeOutResolver", void 0), __decorate([a()], r.prototype, "_fadeInResolver", void 0), r = __decorate([c("esri.views.2d.engine.transitions.FadeTransition")], r);
//#endregion
//#region node_modules/@arcgis/core/views/2d/engine/DisplayObject.js
var e = class extends r$2 {
	constructor() {
		super(...arguments), this._transitionables = null, this._clips = [], this._fadeTransition = null, this._isReady = !1, this._opacity = 1, this.parent = null, this._stage = null, this._visible = !0;
	}
	get computedOpacity() {
		return this._fadeTransition?.computedOpacity ?? this.opacity;
	}
	get clips() {
		return this._clips;
	}
	set clips(t) {
		this._clips = t, this.requestRender();
	}
	get effectiveVisible() {
		return this.visible && !0 === this.parent?.effectiveVisible;
	}
	get fadeTransitionEnabled() {
		return null !== this._fadeTransition;
	}
	set fadeTransitionEnabled(t) {
		!this._fadeTransition && t ? (this._fadeTransition = new r({
			opacity: this.opacity,
			visible: this.visible
		}), this.addTransitionable(this._fadeTransition)) : this._fadeTransition && !t && (this.removeTransitionable(this._fadeTransition), this._fadeTransition = null);
	}
	get inFadeTransition() {
		return this._fadeTransition?.transitioning ?? !1;
	}
	get isReady() {
		return this._isReady;
	}
	get opacity() {
		return this._opacity;
	}
	set opacity(t) {
		this._opacity !== t && (this._opacity = Math.min(1, Math.max(t, 0)), this._fadeTransition && (this._fadeTransition.opacity = this._opacity), this.requestRender());
	}
	get stage() {
		return this._stage;
	}
	set stage(t) {
		if (this._stage === t) return;
		const i = this._stage;
		this._stage = t, t ? this._stage?.untrashDisplayObject(this) || (this.onAttach(), this.emit("attach")) : i?.trashDisplayObject(this);
	}
	get transforms() {
		return this._transforms ??= this._createTransforms(), this._transforms;
	}
	get transitioning() {
		return this.isTransitioning();
	}
	get usedMemory() {
		return 0;
	}
	get visible() {
		return this._visible;
	}
	set visible(t) {
		this._visible !== t && (this._visible = t, this._fadeTransition && (this._fadeTransition.visible = this._visible), this.requestRender());
	}
	get hasLabels() {
		return !1;
	}
	get hasHighlight() {
		return !1;
	}
	get hasBlending() {
		return !1;
	}
	addTransitionable(t) {
		this._transitionables ??= [], this._transitionables.push(t), this.requestRender();
	}
	removeTransitionable(i) {
		i.endTransition(), this._transitionables && L(this._transitionables, i), this.requestRender();
	}
	fadeIn() {
		this.fadeTransitionEnabled = !0;
		const t = this._fadeTransition.fadeIn();
		return this.opacity = 1, this.requestRender(), t;
	}
	fadeOut() {
		this.fadeTransitionEnabled = !0;
		const t = this._fadeTransition.fadeOut();
		return this.opacity = 0, this.requestRender(), t;
	}
	endTransitions() {
		if (this._transitionables) {
			for (const t of this._transitionables) t.endTransition();
			this.requestRender();
		}
	}
	beforeRender(t) {
		this.transitionStep(t.deltaTime, t.state.scale), this.setTransform(t.state);
	}
	afterRender(t) {
		this.transitioning && this.requestRender();
	}
	remove() {
		this.parent?.removeChild(this);
	}
	setTransform(t) {}
	processRender(t) {
		this.stage && (this._fadeTransition?.computedVisible ?? this.visible) && this.doRender(t);
	}
	requestRender() {
		this.stage && this.stage.requestRender();
	}
	processDetach() {
		this.endTransitions(), this.onDetach(), this.emit("detach");
	}
	isTransitioning() {
		return this._transitionables?.some((t) => t.transitioning) ?? !1;
	}
	transitionStep(t, i) {
		if (this._transitionables) for (const s of this._transitionables) s.transitionStep(t, i);
	}
	onAttach() {}
	onDetach() {}
	doRender(t) {}
	ready() {
		this._isReady || (this._isReady = !0, this.emit("isReady"), this.requestRender());
	}
};
//#endregion
//#region node_modules/@arcgis/core/views/2d/engine/Container.js
var n = class extends e {
	constructor() {
		super(...arguments), this._childrenSet = /* @__PURE__ */ new Set(), this._needsSort = !1, this._children = [], this._childrenObservable = new s$1(), this._effectView = null, this._highlightGradient = null;
	}
	get blendMode() {
		return this._blendMode;
	}
	set blendMode(e) {
		this._blendMode = e, this.requestRender();
	}
	get children() {
		return a$1(this._childrenObservable), this._children;
	}
	get clips() {
		return this._clips;
	}
	set clips(e) {
		this._clips = e, this.children.forEach((t) => t.clips = e);
	}
	get computedEffects() {
		return this._effectView?.effects ?? null;
	}
	get effect() {
		return this._effectView?.effect ?? "";
	}
	set effect(e) {
		(this._effectView || e) && (this._effectView || (this._effectView = new h(), this.addTransitionable(this._effectView)), this._effectView.effect = e, this.requestRender());
	}
	get highlightGradient() {
		return this._highlightGradient;
	}
	set highlightGradient(e) {
		this._highlightGradient = e, this.requestRender();
	}
	get hasBlending() {
		return !!this.blendMode;
	}
	get hasHighlight() {
		return this.children.some((e) => e.hasHighlight);
	}
	get hasLabels() {
		return this.children.some((e) => e.hasLabels);
	}
	get requiresDedicatedFBO() {
		return this.children.some((e) => "blendMode" in e && e.blendMode && "normal" !== e.blendMode);
	}
	get isReady() {
		return this.children.every((e) => e.isReady);
	}
	get sortFunction() {
		return this._sortFunction;
	}
	set sortFunction(e) {
		this._sortFunction = e, e && (this._needsSort = !0);
	}
	get usedMemory() {
		return this.children.reduce((e, t) => e + t.usedMemory, 0);
	}
	doRender(e) {
		const t = this.createRenderParams(e), { painter: i } = t;
		i.beforeRenderLayer(t, this._clips?.length ? 255 : 0, this.computedOpacity), this.renderChildren(t), i.afterRenderLayer(t, this.computedOpacity);
	}
	addChild(e) {
		return this.addChildAt(e, this.children.length);
	}
	addChildAt(e, t = this.children.length) {
		if (!e) return e;
		if (this.contains(e)) return e;
		this._needsSort = !0;
		const i = e.parent;
		return i && i !== this && i.removeChild(e), t >= this.children.length ? this.children.push(e) : this.children.splice(t, 0, e), this._childrenSet.add(e), e.parent = this, e.stage = this.stage, this !== this.stage && (e.clips = this.clips), this.requestRender(), this._childrenObservable.notify(), e;
	}
	contains(t) {
		return a$1(this._childrenObservable), this._childrenSet.has(t);
	}
	removeAllChildren() {
		this._childrenSet.clear(), this._needsSort = !0;
		for (const e of this.children) this !== this.stage && (e.clips = []), e.stage = null, e.parent = null;
		this.children.length = 0, this._childrenObservable.notify();
	}
	removeChild(e) {
		return this.contains(e) ? this.removeChildAt(this.children.indexOf(e)) : e;
	}
	removeChildAt(e) {
		if (e < 0 || e >= this.children.length) return null;
		this._needsSort = !0;
		const t = this.children.splice(e, 1)[0];
		return this._childrenSet.delete(t), this !== this.stage && (t.clips = []), t.stage = null, t.parent = null, this._childrenObservable.notify(), t;
	}
	beforeRender(e) {
		super.beforeRender(e), this.sortFunction && this._needsSort && (this.children.sort(this.sortFunction), this._needsSort = !1, this._childrenObservable.notify());
		for (const t of this.children) t.beforeRender(e);
	}
	afterRender(e) {
		super.afterRender(e);
		for (const t of this.children) t.afterRender(e);
	}
	_createTransforms() {
		return { displayViewScreenMat3: e$1() };
	}
	onAttach() {
		super.onAttach();
		const e = this.stage;
		for (const t of this.children) t.stage = e;
	}
	onDetach() {
		super.onDetach();
		for (const e of this.children) e.stage = null;
	}
	renderChildren(e) {
		for (const t of this.children) t.processRender(e);
	}
	createRenderParams(e) {
		return {
			...e,
			requireFBO: this.requiresDedicatedFBO,
			blendMode: this.blendMode,
			effects: this.computedEffects,
			globalOpacity: e.globalOpacity * this.computedOpacity,
			inFadeTransition: this.inFadeTransition,
			highlightGradient: this._highlightGradient || e.highlightGradient
		};
	}
	isTransitioning() {
		return super.isTransitioning() || this.children.some((e) => e.transitioning);
	}
};
//#endregion
//#region node_modules/@arcgis/core/views/2d/engine/webgl/meshing/definitions.js
var T = {
	[R.BYTE]: 1,
	[R.UNSIGNED_BYTE]: 1,
	[R.SHORT]: 2,
	[R.UNSIGNED_SHORT]: 2,
	[R.HALF_FLOAT]: 2,
	[R.INT]: 4,
	[R.UNSIGNED_INT]: 4,
	[R.FLOAT]: 4
};
//#endregion
//#region node_modules/@arcgis/core/views/2d/engine/webgl/meshing/Mesh.js
var o$1 = class {
	constructor(r, t) {
		this._boundPart = null, this.vertexBuffers = /* @__PURE__ */ new Map(), this.indexBuffers = /* @__PURE__ */ new Map(), this.groups = [];
		for (const e in t.vertex) {
			const { data: s, layout: o } = t.vertex[e], n = new r$3(r, o, s);
			this.vertexBuffers.set(e, n);
		}
		for (const s in t.index) {
			const { data: i } = t.index[s], o = o$2.createIndex(r, 35044, i);
			this.indexBuffers.set(s, o);
		}
		for (const e of t.groups) this.groups.push({
			...e,
			vertexArrays: /* @__PURE__ */ new Map()
		});
		this.parts = t.parts;
	}
	bind(e, s, i) {
		if (null == e.gl) return void (this._boundPart = null);
		this._boundPart = i;
		const { group: o } = this.parts[this._boundPart], n = this.groups[o];
		if (!n) throw new Error(`Missing group ${o}.`);
		let f = n.vertexArrays.get(s.stringHash);
		if (!f) {
			const { locations: i, stringHash: o } = s, a = r$1(new Set(i.keys())), u = n.index ? this.indexBuffers.get(n.index) : null, h = /* @__PURE__ */ new Map();
			for (const [r, e] of this.vertexBuffers) e.layout.filter((r) => a.has(r.name)).length > 0 && h.set(r, e);
			f = new h$1(e, h, u, void 0, i), n.vertexArrays.set(o, f);
		}
		e.bindVAO(f);
	}
	draw(r) {
		if (null == this._boundPart) throw new Error("Mesh.bind() has not been called.");
		const { start: e, count: t } = this.parts[this._boundPart], { group: i } = this.parts[this._boundPart], { primitive: o, index: n } = this.groups[i];
		if (n) {
			const i = this.indexBuffers.get(n);
			if (!i) throw new Error(`Missing index buffer "${n}".`);
			const { indexType: f } = i;
			if (!f) throw new Error("Buffer type error.");
			r.drawElements(o, t, f, e * T[f]);
		} else r.drawArrays(o, e, t);
	}
	unbind(r) {
		this._boundPart = null, r.bindVAO(null);
	}
	destroy() {
		this.groups.forEach(({ vertexArrays: r }) => r.forEach((r) => r.disposeVAOOnly())), this.vertexBuffers.forEach((r) => r.dispose()), this.indexBuffers.forEach((r) => r.dispose());
	}
};
//#endregion
//#region node_modules/@arcgis/core/views/2d/engine/webgl/meshing/SimpleMesh.js
var o = { position: {
	type: R.SHORT,
	count: 2
} };
var s = class s extends o$1 {
	static create(e, r) {
		const i = [];
		let { stride: o } = r;
		if (null == o) {
			o = 0;
			for (const [e, { count: i, type: n, offset: s }] of Object.entries(r.layout)) {
				if (null != s) throw new Error("Stride cannot be computed automatically when attribute offsets are supplied explicitly.");
				o += i * T[n];
			}
		}
		let a = 0;
		for (const [s, { count: d, offset: f, type: m, normalized: x }] of Object.entries(r.layout)) {
			null != f && (a = f);
			const e = new t(s, d, m, a, o, null != x && x, 0);
			i.push(e), a += d * T[m];
		}
		const l = { primitive: r.primitive };
		null != r.index && (l.index = "indexData");
		let { count: u } = r;
		if (null == u && (u = r.index ? r.index.length : r.vertex.byteLength / o, Math.floor(u) !== u)) throw new Error(`The byte length of vertex data must be an exact multiple of the stride, which is ${o}.`);
		const c = {
			start: 0,
			count: u,
			group: 0,
			primitive: r.primitive
		}, p = {
			vertex: { vertexData: {
				data: r.vertex,
				layout: i
			} },
			parts: [c],
			groups: [l]
		};
		return null != r.index && (p.index = { indexData: { data: r.index } }), new s(e, p, r.layout);
	}
	static createForShader(t, e) {
		return this.create(t, e);
	}
	static fromVertexStream(t, e) {
		return s.create(t, {
			primitive: _.TRIANGLE_STRIP,
			vertex: new Uint16Array(e),
			layout: o
		});
	}
	constructor(t, e, r) {
		super(t, e), this._spec = r;
	}
	bind(t, e, r = 0) {
		super.bind(t, e, r);
	}
};
//#endregion
export { e as i, o$1 as n, n as r, s as t };

//# sourceMappingURL=SimpleMesh-DcVi7r5f.js.map