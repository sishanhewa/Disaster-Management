import { o as w } from "./intl-1FbLkipu.js";
import { n as c$1 } from "./Widget-D7J6FR9J.js";
import { c as x } from "./widget-BsQfm1ik.js";
//#region node_modules/@arcgis/core/support/actions/actionUtils.js
var n = () => c$1({ action: () => import("./calcite-action-BQLn8VGB.js").then((n) => n.t) });
function e(t, i, n) {
	const { title: e, textEnabled: c } = i, { type: r, active: s, uid: d, disabled: u, indicator: l } = t;
	return t.visible ? x("calcite-action", {
		...i,
		active: "toggle" === r && t.value,
		"data-action-id": t.id,
		"data-action-uid": d,
		disabled: u,
		icon: a(t),
		indicator: l,
		loading: s,
		text: e ?? "",
		title: c ? void 0 : e
	}, n) : null;
}
function a(t) {
	return t.icon ? t.icon : "image" in t && t.image || t.className ? void 0 : "question";
}
function c(t) {
	return t ? { backgroundImage: `url(${t})` } : {};
}
function r({ action: i, feature: o }) {
	const n = o?.attributes, e = "image" in i ? i.image : void 0;
	return e && n ? w(e, n) : e ?? "";
}
//#endregion
export { r as a, n as i, c as n, e as r, a as t };

//# sourceMappingURL=actionUtils-Cy0Gr9_I.js.map