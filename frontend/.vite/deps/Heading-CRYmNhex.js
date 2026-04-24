import { y as r } from "./mathUtils-hEBUcrMa.js";
import { c as x, o as p } from "./widget-BsQfm1ik.js";
import { t as e } from "./globalCss-Dvrz6ByO.js";
//#region node_modules/@arcgis/core/widgets/support/Heading.js
function i({ level: r, class: i, ...l }, s) {
	const a = n(r);
	return x(`h${a}`, {
		...l,
		"aria-level": String(a),
		class: p(e.heading, i),
		role: "heading"
	}, s);
}
function n(t) {
	return r(Math.ceil(t), 1, 6);
}
function l(r, t = 1) {
	return n(r + t);
}
//#endregion
export { l as n, i as t };

//# sourceMappingURL=Heading-CRYmNhex.js.map