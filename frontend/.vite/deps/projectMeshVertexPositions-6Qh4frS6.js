import { n as __exportAll } from "./chunk-BoAXSpZd.js";
import { l as T } from "./spatialReferenceUtils-b3vCEkpS.js";
import { t as o } from "./projectBuffer-CV6RkXdH.js";
import { n as c } from "./MeshLocalVertexSpace-BYbh0klK.js";
import { r as q } from "./vertexSpaceConversion-CuFAcIQR.js";
//#region node_modules/@arcgis/core/geometry/support/meshUtils/projectMeshVertexPositions.js
var projectMeshVertexPositions_exports = /* @__PURE__ */ __exportAll({ projectMeshVertexPositions: () => n });
function n(n, i) {
	const p = q(n, c.absolute);
	if (!p) return null;
	let s = p.position;
	return T(n.spatialReference, i) || (s = new Float64Array(p.position.length), o(p.position, n.spatialReference, 0, s, i, 0)) ? s : null;
}
//#endregion
export { projectMeshVertexPositions_exports as n, n as t };

//# sourceMappingURL=projectMeshVertexPositions-6Qh4frS6.js.map