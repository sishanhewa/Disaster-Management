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
import "./JSONSupport-BUaD4jSd.js";
import "./Promise-Dhhz7kXA.js";
import "./Loadable-CQsALnOO.js";
import "./jsonMap-CFSDFmi6.js";
import "./Ellipsoid-DzO_iHAj.js";
import "./assets-BZbzeyNa.js";
import "./pe-BLztJ5xc.js";
import "./spatialReferenceUtils-b3vCEkpS.js";
import "./units-Dg-cK1vO.js";
import { t as S } from "./SpatialReference-rIfb2LrD.js";
import "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./reactiveUtils-DRpp6Nmg.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import "./Color-C99QAF80.js";
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
import "./DoubleArray-EEc6IyGQ.js";
import "./aaBoundingBox-CzeY9F8R.js";
import "./vec4-DVix-cmy.js";
import "./vec4f64-SXri5KT8.js";
import "./vec2f64-BKe4utUH.js";
import "./vec3-BfQf1_cT.js";
import "./imageUtils-Nuxwq2Iq.js";
import "./quatf64-3OZfmMeM.js";
import "./quat-Bz1zxyz4.js";
import "./axisAngleDegrees-C6HVfxeG.js";
import { n as g } from "./MeshTexture-D7k6Z_hO.js";
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
import { n as o } from "./constants-CV46VM0u.js";
import { r as u } from "./importUtils-BmhkesUr.js";
//#region node_modules/@arcgis/core/widgets/PanoramicViewer/support/PanoramicTileNode.js
var l = class l {
	constructor(i, l, n, h, m$2, w, p, u$2, f, d) {
		this.level = i, this.row = l, this.column = n, this.horizontalFieldOfView = h, this.verticalFieldOfView = m$2, this.yaw = w, this.pitch = p, this.distance = u$2, this.horizonAngles = f, this.getPixelBlock = d, this._cache = null, this.loadMesh = async (i) => {
			const { level: l, row: n, column: h, horizontalFieldOfView: m$1, verticalFieldOfView: w, yaw: p, pitch: u$1, distance: f } = this, { Mesh: d, MeshComponent: g$1, MeshVertexAttributes: v, panoramicMeshManager: M } = await u(), { faces: x, ...y } = await M.getFacesWithVertexAttributes({
				distance: f,
				yaw: p,
				horizontalFieldOfView: m$1,
				pitch: u$1,
				verticalFieldOfView: w
			});
			s(i);
			const V = await this.getPixelBlock(l, n, h, i);
			if (s(i), !V) throw new r("panoramic-viewer:missing-tile-data", `Tile data for level ${l}, row ${n}, column ${h} is missing`, {
				level: l,
				row: n,
				column: h
			});
			const A = await M.convertPixelBlockToImageData(V);
			s(i);
			const F = new d({
				vertexAttributes: new v(y),
				components: [new g$1({
					faces: x,
					trustSourceNormals: !0,
					material: new m({ colorTexture: new g({ data: A }) })
				})],
				spatialReference: S.WebMercator
			});
			return F.rotate(...this.horizonAngles, { origin: o }), await F.load(i), this._cache = F, this._cache;
		}, this.loadMeshAtDistance = async (e, t) => {
			const i = this.distance;
			return this.distance = e, Math.abs(i - e) > 1e-6 && this._cache ? this._cache : await this.loadMesh(t);
		};
	}
	get loaded() {
		return null !== this._cache;
	}
	get key() {
		return `${this.level}/${this.row}/${this.column}`;
	}
	clone() {
		const { level: e, row: t, column: s, horizontalFieldOfView: o, verticalFieldOfView: r, yaw: a, pitch: c, distance: n, getPixelBlock: h, horizonAngles: m } = this, w = new l(e, t, s, o, r, a, c, n, m, h);
		if (this._cache) {
			const { vertexAttributes: e, components: t, spatialReference: s } = this._cache, o = t?.map(({ material: e, faces: t, trustSourceNormals: i }) => ({
				material: e,
				faces: t?.slice(),
				trustSourceNormals: i
			}));
			w._cache = new Y({
				components: o,
				vertexAttributes: e.clone(),
				spatialReference: s
			});
		}
		return w;
	}
};
//#endregion
export { l as default };

//# sourceMappingURL=PanoramicTileNode-DuddHGCa.js.map