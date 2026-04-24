import { w as ke } from "./units-Dg-cK1vO.js";
import { t as M } from "./Portal-DYysvbhZ.js";
//#region node_modules/@arcgis/core/support/getDefaultUnitForView.js
function e(e) {
	const n = "metric";
	if (!e) return n;
	const { map: i } = e, o = (i && "portalItem" in i ? i.portalItem?.portal : null) ?? M.getDefault();
	switch (o.user?.units ?? o.units) {
		case n: return n;
		case "english": return "imperial";
	}
	return ke(e.spatialReference) ?? n;
}
//#endregion
export { e as t };

//# sourceMappingURL=getDefaultUnitForView-BJSbSmh_.js.map