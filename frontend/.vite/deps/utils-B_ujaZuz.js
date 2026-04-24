import { t as S } from "./SpatialReference-rIfb2LrD.js";
import { t as I } from "./applyEditsUtils-B-PWWx9K.js";
//#region node_modules/@arcgis/core/rest/networks/support/utils.js
function t(t) {
	return t.map((t) => {
		const i = t.editedFeatures, a = S.fromJSON(i?.spatialReference);
		return i ? {
			layerId: t.id,
			editedFeatures: I(i, a)
		} : null;
	}).filter((e) => null !== e);
}
//#endregion
export { t };

//# sourceMappingURL=utils-B_ujaZuz.js.map