import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { I as c$1, L as e, R as i, o as L } from "./promiseUtils-DhYhergm.js";
import { n as c$2, t as a } from "./decorators-DE7S5xmd.js";
import { t as b } from "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./SimpleObservable-CNlRjEs1.js";
import "./jsonMap-CFSDFmi6.js";
import { a as h } from "./reactiveUtils-DRpp6Nmg.js";
import "./Queue-CM8W5OTt.js";
import { t as h$1 } from "./UpdatingHandles-BpejPsAZ.js";
import { n as f } from "./InputManager-BkGXYhfV.js";
import "./signal-DCDIpEz3.js";
import "./PropertiesPool-0qj03Krs.js";
//#region node_modules/@arcgis/core/views/2d/layers/support/MediaLayerInteraction.js
var c = {
	redo: "r",
	undo: "z"
}, p = Symbol(), m = Symbol(), _ = Symbol();
var u = class extends b {
	constructor(e) {
		super(e), this._tool = null, this._updatingHandles = new h$1(), this.enabled = !1, this._onPointerMove = L(async (e) => {
			const t = await this._updatingHandles.addPromise(this._findElementAtScreenPoint(e));
			this.destroyed || (this.removeHandles(m), t && t !== this.selectedElement && this.addHandles(this.view.acquireCursor("pointer", "high"), m));
		});
	}
	initialize() {
		this.addHandles(c$1(this._updatingHandles)), this._updatingHandles.add(() => this.enabled, (e) => this._setEnabled(e), h), this._updatingHandles.add(() => this._preferredInteractionTool, () => this._preferredInteractionToolChanged());
	}
	get _validatedSelectedElement() {
		const e = this.selectedElement;
		if (!e) return null;
		const { layer: { source: t } } = this;
		return t ? "hasElement" in t ? t.hasElement(e) ? e : null : t === e ? e : null : null;
	}
	get _preferredInteractionTool() {
		return this.options?.tool ?? "transform";
	}
	get updating() {
		return this._updatingHandles.updating;
	}
	_setEnabled(e$1) {
		if (this.removeHandles(p), !e$1) return;
		const { view: t } = this;
		this.addHandles([
			t.on("immediate-click", (e) => this._onClick(e), f.TOOL),
			t.on("pointer-move", (e) => this._onPointerMove(e).catch(() => {}), f.TOOL),
			t.on("key-down", (e) => {
				e.key === c.undo && this._tool?.canUndo() && (this._tool.undo(), e.stopPropagation()), e.key === c.redo && this._tool?.canRedo() && (this._tool.redo(), e.stopPropagation());
			}),
			this._updatingHandles.add(() => this._validatedSelectedElement, (e) => this._selectedElementChanged(e), h),
			e(() => {
				this.removeHandles(m), this._removeTool();
			})
		], p);
	}
	async _findElementAtScreenPoint(e) {
		const t = (await this.view.hitTest(e, { include: [this.layer] })).results[0];
		return "media" === t?.type ? t.element : null;
	}
	async _onClick(e) {
		await this._updatingHandles.addPromise(e.defer(async () => {
			const t = await this._findElementAtScreenPoint(e);
			this.destroyed || (t && e.stopPropagation(), this.selectedElement = t, this.selectedElement && this.removeHandles(m));
		}));
	}
	_preferredInteractionToolChanged() {
		const { _tool: e } = this;
		e && (this._preferredInteractionTool === e.type || this._updatingHandles.addPromise(this._recreateTool()));
	}
	async _recreateTool() {
		this.removeHandles(_), this._removeTool();
		const e$2 = this._validatedSelectedElement;
		if (!e$2) return;
		const t = new AbortController();
		this.addHandles(i(t), _);
		const { TransformTool: o, ControlPointsTransformTool: n } = await import("./editingTools-BDdj8wOS.js");
		if (t.signal.aborted) return;
		const { view: r } = this;
		switch (this._preferredInteractionTool) {
			case "transform":
				this._tool = new o({
					target: e$2,
					view: r
				});
				break;
			case "reshape": this._tool = new n({
				mediaElement: e$2,
				view: r
			});
		}
		this.addHandles(e(() => {
			this._tool && (r.tools.remove(this._tool), this._tool = null);
		}), this._tool), r.addAndActivateTool(this._tool);
	}
	_removeTool() {
		this._tool && this.removeHandles(this._tool);
	}
	async _selectedElementChanged(e) {
		e?.georeference ? await this._updatingHandles.addPromise(this._recreateTool()) : this._removeTool();
	}
};
__decorate([a()], u.prototype, "_validatedSelectedElement", null), __decorate([a()], u.prototype, "_preferredInteractionTool", null), __decorate([a({ constructOnly: !0 })], u.prototype, "view", void 0), __decorate([a({ constructOnly: !0 })], u.prototype, "layer", void 0), __decorate([a()], u.prototype, "selectedElement", void 0), __decorate([a()], u.prototype, "enabled", void 0), __decorate([a()], u.prototype, "options", void 0), __decorate([a()], u.prototype, "updating", null), u = __decorate([c$2("esri.views.2d.layers.support.MediaLayerInteraction")], u);
//#endregion
export { u as MediaLayerInteraction };

//# sourceMappingURL=MediaLayerInteraction-CYlJfgQt.js.map