import { t as r, w as a } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { b as s } from "./promiseUtils-DhYhergm.js";
import "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./SimpleObservable-CNlRjEs1.js";
import "./JSONSupport-BUaD4jSd.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import "./Clonable-D_RHUyXD.js";
import "./Polygon-CCBjbbXT.js";
import "./curveUtils-CfkOAT4m.js";
import "./coordsUtils-DXLB9bAf.js";
import "./aaBoundingRect-CgUWvAgv.js";
import "./common-BxLRDsKd.js";
import "./vec2-BPF6SpMH.js";
import "./curveExtent--ue9-x0m.js";
import "./mat3-CPqND9LM.js";
import "./mat3f64-DZZP34-L.js";
import "./Polyline-Cv0nwof6.js";
import "./vec3f64-CwISzc_v.js";
import "./Multipoint-B5Liskmz.js";
import "./spatialReferenceEllipsoidUtils-qNeWENaq.js";
import "./GeographicTransformation-D90zE-j2.js";
import "./geodesicConstants-C0TscDSm.js";
import "./projectBuffer-CV6RkXdH.js";
import "./projectionUtils-CmEsVWfk.js";
import "./mat4-CCf33Vjt.js";
import "./mat4f64-BA1Qbgtv.js";
import "./vec4-DVix-cmy.js";
import "./vec4f64-SXri5KT8.js";
import "./vec2f64-BKe4utUH.js";
import "./vec3-BfQf1_cT.js";
import { r as e } from "./meshCloneUtils-Dh0QdG3w.js";
import "./MeshLocalVertexSpace-BYbh0klK.js";
import { n as u } from "./MeshVertexAttributes-D4tx79HJ.js";
import "./meshVertexSpaceUtils-BWu8ERFF.js";
import "./projectPointToVector-ChBhT6rD.js";
import "./computeTranslationToOriginAndRotation-BFvldVy8.js";
import "./BufferView-BsD36vI9.js";
import "./Util-QEnjDgyY.js";
import "./vec3-BRQ7MvdQ.js";
import "./vec4-K8MEUVrW.js";
import { r as q } from "./vertexSpaceConversion-CuFAcIQR.js";
//#region node_modules/@arcgis/core/geometry/support/meshUtils/convertMeshVertexSpace.js
async function m(m, n, c) {
	await Promise.resolve(), s(c);
	const l = q(m, n, { useEllipsoid: c?.useEllipsoid });
	if (!l) throw new r("meshUtils:convertVertexSpace()", "Failed to convert to provided vertex space due to projection errors");
	return m.clone(e(void 0, {
		vertexAttributes: new u({
			...l,
			uv: a(m.vertexAttributes.uv),
			color: a(m.vertexAttributes.color)
		}),
		vertexSpace: n,
		transform: null
	}));
}
//#endregion
export { m as convertMeshVertexSpace };

//# sourceMappingURL=convertMeshVertexSpace-CDZbJ0Z-.js.map