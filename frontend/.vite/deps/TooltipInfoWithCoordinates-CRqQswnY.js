import { r as __decorate } from "./tslib.es6-DlxpVI88.js";
import { n as c, t as a } from "./decorators-DE7S5xmd.js";
import { r as i } from "./Point-B7zMqEx6.js";
import { i as c$1 } from "./quantity-B4e5bEqI.js";
import { a as x } from "./euclideanLengthMeasurementUtils-DGwIRMtn.js";
import { t as r } from "./geodesicMeasurementUtils-BKvxSbFi.js";
import { h as K } from "./SketchTooltipInfo-CYNdTJai.js";
import { D as z, g as O, h as M, v as R, y as T } from "./SnappingContext-BBM5_gEX.js";
//#region node_modules/@arcgis/core/views/interactive/tooltip/infos/TooltipInfoWithCoordinates.js
var g = (g) => {
	const d = g;
	let m = class extends d {
		constructor() {
			super(...arguments), this.longitude = O(), this.latitude = T(), this.x = R(), this.y = z(), this.elevation = M(), this.geographic = !1;
		}
		get effectiveX() {
			return this.geographic ? this.longitude : this.x;
		}
		get effectiveY() {
			return this.geographic ? this.latitude : this.y;
		}
		get key() {
			return {
				longitude: this.longitude.actual,
				latitude: this.latitude.actual,
				x: this.x.actual,
				y: this.y.actual,
				elevation: this.elevation.actual,
				geographic: this.geographic
			};
		}
		setLocationFromPoint(t, i$1 = t?.spatialReference) {
			if (this.geographic = !!i$1 && r(i$1), null == t) return this._setActualLonLat(null, null), void this._setActualXY(null, null);
			if (this.geographic) {
				const e = i(t, f);
				this._setActualLonLat(K(e?.[0]), K(e?.[1]));
			} else this._setActualXY(c$1(t.x), c$1(t.y));
		}
		setElevationFromPoint(t, e) {
			const { elevation: i } = this;
			i.actual = x(t), i.visible = e.hasZ, i.readOnly = !1, i.showAsZ = !0;
		}
		_setActualLonLat(t, e) {
			this.longitude.actual = t, this.latitude.actual = e;
		}
		_setActualXY(t, e) {
			this.x.actual = t, this.y.actual = e;
		}
	};
	return __decorate([a()], m.prototype, "geographic", void 0), __decorate([a()], m.prototype, "effectiveX", null), __decorate([a()], m.prototype, "effectiveY", null), __decorate([a()], m.prototype, "key", null), m = __decorate([c("esri.views.interactive.tooltip.infos.TooltipInfoWithCoordinates")], m), m;
}, f = [0, 0];
//#endregion
export { g as t };

//# sourceMappingURL=TooltipInfoWithCoordinates-CRqQswnY.js.map