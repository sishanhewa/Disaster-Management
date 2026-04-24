import { O as a$1 } from "./decorators-DE7S5xmd.js";
import { y as r$1 } from "./mathUtils-hEBUcrMa.js";
//#region node_modules/@arcgis/core/symbols/support/textUtils.js
var l = [
	"none",
	"underline",
	"line-through"
], t = [
	"normal",
	"italic",
	"oblique"
], r = [
	"normal",
	"lighter",
	"bold",
	"bolder"
], n = {
	type: Number,
	cast: (l) => {
		const t = a$1(l);
		return 0 === t ? 1 : r$1(t, .1, 4);
	},
	nonNullable: !0
}, i = [
	"left",
	"right",
	"center"
], a = [
	"baseline",
	"top",
	"middle",
	"bottom"
], m = {
	type: i,
	nonNullable: !0
}, p = {
	type: a,
	nonNullable: !0
};
//#endregion
export { r as a, p as i, m as n, t as o, n as r, l as t };

//# sourceMappingURL=textUtils-B4iTDAON.js.map