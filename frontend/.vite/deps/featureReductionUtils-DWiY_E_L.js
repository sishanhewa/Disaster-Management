//#region node_modules/@arcgis/core/views/2d/layers/features/layerAdapters/featureReductionUtils.js
function e(e, a) {
	const c = e.featureReduction;
	return c && "selection" !== c.type && (!("maxScale" in c) || !c.maxScale || c.maxScale < a.scale) ? c : null;
}
//#endregion
export { e as t };

//# sourceMappingURL=featureReductionUtils-DWiY_E_L.js.map