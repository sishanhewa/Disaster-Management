import { t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import "./request-CuG5cxow.js";
import { b as s } from "./promiseUtils-DhYhergm.js";
import "./decorators-DE7S5xmd.js";
import "./Accessor-kDoDKy4v.js";
import "./tracking-DBoczQof.js";
import "./ObservableBase-Bz6iwe5p.js";
import "./scheduling-DiUcWka1.js";
import "./PooledArray-ChtfzjBt.js";
import "./Evented-GLJbxWO5.js";
import "./SimpleObservable-CNlRjEs1.js";
import "./Collection-BAJSKCip.js";
import "./collectionUtils-DQeMhtWS.js";
import "./JSONSupport-BUaD4jSd.js";
import "./Promise-Dhhz7kXA.js";
import "./Loadable-CQsALnOO.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import "./Portal-DYysvbhZ.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import "./Color-C99QAF80.js";
import "./opacityUtils-DgEZ8x-q.js";
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
import "./jsonUtils-D_oLUjKv.js";
import "./typeUtils-DaICxhuY.js";
import "./sql-Cyp7eZa9.js";
import "./fieldUtils-CC2YSmV6.js";
import "./PopupTemplate-8SH37QID.js";
import "./fieldFormatUtils-R1ptUFq7.js";
import "./ActionToggle-JH4srUd2.js";
import "./Graphic-D2G0Ykqt.js";
import "./SimpleMarkerSymbol-BjFFaoyw.js";
import "./typeUtils-DZkmoi8p.js";
import "./mat4f64-BA1Qbgtv.js";
import "./DoubleArray-EEc6IyGQ.js";
import "./aaBoundingBox-CzeY9F8R.js";
import "./symbolLayerUtils3D-BQRyZskR.js";
import "./textUtils-B4iTDAON.js";
import "./TextSymbol-CsSnkPMD.js";
import "./SimpleFillSymbol-CbXKKnxp.js";
import "./PictureMarkerSymbol-Crs5VdSs.js";
import "./vec4-DVix-cmy.js";
import "./vec4f64-SXri5KT8.js";
import "./vec2f64-BKe4utUH.js";
import "./vec3-BfQf1_cT.js";
import "./imageUtils-Nuxwq2Iq.js";
import "./quatf64-3OZfmMeM.js";
import "./quat-Bz1zxyz4.js";
import "./axisAngleDegrees-C6HVfxeG.js";
import { n as g$1 } from "./MeshTexture-D7k6Z_hO.js";
import { n as m } from "./MeshMaterial-iAVkcjxh.js";
import "./MeshMaterialMetallicRoughness-BpviPKJt.js";
import "./MeshComponent-DqU5soKw.js";
import { n as Y } from "./Mesh-Bw1PpR3b.js";
import "./MeshLocalVertexSpace-BYbh0klK.js";
import "./MeshTransform-NyjZftdc.js";
import "./MeshVertexAttributes-D4tx79HJ.js";
import "./meshVertexSpaceUtils-BWu8ERFF.js";
import "./earcut-CCI_bFcR.js";
import "./Indices-DB34mfoI.js";
import "./plane-3RNaG9XX.js";
import "./vectorStacks-DmZ-Tu4f.js";
import "./mathUtils-BlzSoZZn.js";
import "./triangulationUtils-COB09pVg.js";
import "./deduplicate-hU9JgWcz.js";
import "./projectPointToVector-ChBhT6rD.js";
import "./computeTranslationToOriginAndRotation-BFvldVy8.js";
import "./BufferView-BsD36vI9.js";
import "./Util-QEnjDgyY.js";
import "./vec3-BRQ7MvdQ.js";
import "./vec4-K8MEUVrW.js";
import "./vertexSpaceConversion-CuFAcIQR.js";
import "./External-b2MV5rJh.js";
import { n as o, r as t } from "./constants-CV46VM0u.js";
import { n as p, t as m$1 } from "./importUtils-BmhkesUr.js";
//#region node_modules/@arcgis/core/widgets/PanoramicViewer/utils.js
function y({ data: t$1, center: r = o, size: e = t, horizonPitch: o$1 = 0, horizonYaw: n = 0, horizonRoll: i = 0 }) {
	const s = r.clone();
	s.z = -e / 2;
	const l = Y.createSphere(s, {
		size: e,
		densificationFactor: 2,
		vertexSpace: "georeferenced",
		material: new m({ colorTexture: new g$1({ data: t$1 }) })
	});
	if (l.components[0].trustSourceNormals = !0, l.vertexAttributes.uv) {
		const t = l.vertexAttributes.uv.length ?? 0;
		for (let r = 0; r < t; r++) l.vertexAttributes.uv[2 * r + 0] = 1 - l.vertexAttributes.uv[2 * r + 0];
	}
	return l.rotate(o$1, i, n, { origin: l.extent.center }), l.centerAt(s), l;
}
async function g(t, r) {
	const o = await (await m$1()).open({
		url: t,
		ioConfig: {
			skipExtensions: ["jgw", "aux.xml"],
			skipMapInfo: !0
		},
		...r
	});
	return s(r), x(o, { url: t });
}
var x = (t, r$1) => {
	if (!t) throw new r("panoramic-viewer:missing-raster", "Raster data could not be loaded", r$1);
	return t;
};
async function b(t, r, e) {
	const o = await p();
	return s(e), new o({
		raster: t,
		horizonPitch: r.pitch,
		horizonYaw: r.yaw,
		horizonRoll: r.roll
	});
}
async function v(t, r) {
	return t?.length ? await Promise.all(t.map((t) => t.loadMesh(r))) : [];
}
//#endregion
export { y as createImageSphere, v as loadMeshes, b as loadPyramid, g as loadRaster };

//# sourceMappingURL=utils-CQjsPnVA.js.map