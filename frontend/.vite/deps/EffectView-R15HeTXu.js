import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { A as has, n, w as a$1 } from "./Error-CzxduO2m.js";
import { n as c, t as a$2 } from "./decorators-DE7S5xmd.js";
import { t as b } from "./Accessor-kDoDKy4v.js";
import { i as t, t as e } from "./utils-3ndlmaCD.js";
import { t as g } from "./parser-DVDIh5bD.js";
//#region node_modules/@arcgis/core/layers/effects/EffectView.js
var l = -1;
var h = class extends b {
	constructor(t) {
		super(t), this._from = null, this._to = null, this._final = null, this._current = [], this._time = 0, this.duration = has("mapview-transitions-duration"), this.effects = [];
	}
	set effect(t) {
		if (this._get("effect") !== (t = t || "")) {
			this._set("effect", t);
			try {
				this._transitionTo(a(t));
			} catch (e) {
				this._transitionTo([]), n.getLogger(this).warn("Invalid Effect", {
					effect: t,
					error: e
				});
			}
		}
	}
	get final() {
		return this._final;
	}
	get hasEffects() {
		return this.transitioning || !!this.effects.length;
	}
	set scale(t) {
		this._updateForScale(t);
	}
	get transitioning() {
		return null !== this._to;
	}
	canTransitionTo(t) {
		try {
			return this.scale > 0 && u(this._current, a(t), this.scale);
		} catch {
			return !1;
		}
	}
	transitionStep(t, e) {
		this._applyTimeTransition(t), this._updateForScale(e);
	}
	endTransition() {
		this._applyTimeTransition(this.duration);
	}
	_transitionTo(t) {
		this.scale > 0 && u(this._current, t, this.scale) ? (this._final = t, this._to = a$1(t), _(this._current, this._to, this.scale), this._from = a$1(this._current), this._time = 0) : (this._from = this._to = this._final = null, this._current = t), this._set("effects", this._current[0] ? a$1(this._current[0].effects) : []);
	}
	_applyTimeTransition(t) {
		if (!(this._to && this._from && this._current && this._final)) return;
		this._time += t;
		const e = Math.min(1, this._time / this.duration);
		for (let s = 0; s < this._current.length; s++) {
			const t = this._current[s], i = this._from[s], r = this._to[s];
			t.scale = p(i.scale, r.scale, e);
			for (let s = 0; s < t.effects.length; s++) {
				const n = t.effects[s], c = i.effects[s], f = r.effects[s];
				n.interpolate(c, f, e);
			}
		}
		1 === e && (this._current = this._final, this._set("effects", this._current[0] ? a$1(this._current[0].effects) : []), this._from = this._to = this._final = null);
	}
	_updateForScale(t) {
		if (this._set("scale", t), 0 === this._current.length) return;
		const e = this._current, s = this._current.length - 1;
		let i, r, n = 1;
		if (1 === e.length || t >= e[0].scale) r = i = e[0].effects;
		else if (t <= e[s].scale) r = i = e[s].effects;
		else for (let c = 0; c < s; c++) {
			const s = e[c], f = e[c + 1];
			if (s.scale >= t && f.scale <= t) {
				n = (t - s.scale) / (f.scale - s.scale), i = s.effects, r = f.effects;
				break;
			}
		}
		for (let c = 0; c < this.effects.length; c++) this.effects[c].interpolate(i[c], r[c], n);
	}
};
function a(t) {
	const e = g(t) || [];
	return m(e) ? [{
		scale: l,
		effects: e
	}] : e;
}
function u(t$1, e, s) {
	if (!t$1[0]?.effects || !e[0]?.effects) return !0;
	return !((t$1[0]?.scale === l || e[0]?.scale === l) && (t$1.length > 1 || e.length > 1) && s <= 0) && t(t$1[0].effects, e[0].effects);
}
function _(t, e$1, s) {
	const i = t.length > e$1.length ? t : e$1, r = t.length > e$1.length ? e$1 : t, n = r[r.length - 1], c = n?.scale ?? s, f = n?.effects ?? [];
	for (let o = r.length; o < i.length; o++) r.push({
		scale: c,
		effects: [...f]
	});
	for (let h = 0; h < i.length; h++) r[h].scale = r[h].scale === l ? s : r[h].scale, i[h].scale = i[h].scale === l ? s : i[h].scale, e(r[h].effects, i[h].effects);
}
function p(t, e, s) {
	return t + (e - t) * s;
}
function m(t) {
	const e = t[0];
	return !!e && "type" in e;
}
__decorate([a$2()], h.prototype, "_to", void 0), __decorate([a$2()], h.prototype, "duration", void 0), __decorate([a$2({ value: "" })], h.prototype, "effect", null), __decorate([a$2({ readOnly: !0 })], h.prototype, "effects", void 0), __decorate([a$2({ readOnly: !0 })], h.prototype, "final", null), __decorate([a$2({ readOnly: !0 })], h.prototype, "hasEffects", null), __decorate([a$2({ value: 0 })], h.prototype, "scale", null), __decorate([a$2({ readOnly: !0 })], h.prototype, "transitioning", null), h = __decorate([c("esri.layers.effects.EffectView")], h);
//#endregion
export { h as t };

//# sourceMappingURL=EffectView-R15HeTXu.js.map