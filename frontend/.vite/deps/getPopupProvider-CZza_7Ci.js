//#region node_modules/@arcgis/core/graphic/getPopupProvider.js
var n = Symbol("popupProvider");
function o(n) {
	return "object" == typeof n && null !== n && "popupEnabled" in n && "popupTemplate" in n;
}
function p(o) {
	return !!o && n in o;
}
function t(o) {
	return p(o) ? o[n] : null;
}
//#endregion
export { o as n, t as r, n as t };

//# sourceMappingURL=getPopupProvider-CZza_7Ci.js.map