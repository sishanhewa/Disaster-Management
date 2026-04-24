import { n as n$1, t as r } from "./Error-CzxduO2m.js";
import { L as Dt } from "./request-CuG5cxow.js";
import { l as T } from "./spatialReferenceUtils-b3vCEkpS.js";
import { y as ce } from "./units-Dg-cK1vO.js";
import { f as on, g as tn, l as an } from "./projectionUtils-CmEsVWfk.js";
import { n as u } from "./jsonUtils-D_oLUjKv.js";
import { t as j$1 } from "./Graphic-D2G0Ykqt.js";
import { t as A } from "./MeshTransform-NyjZftdc.js";
//#region node_modules/@arcgis/core/editing/types.js
function n(n) {
	return "object" == typeof n && null != n && "objectId" in n && !!n.objectId;
}
function e(e) {
	return e.every(n);
}
function t(n) {
	return "object" == typeof n && null != n && "globalId" in n && !!n.globalId;
}
function o(n) {
	return n.every(t);
}
//#endregion
//#region node_modules/@arcgis/core/layers/graphics/applyEditsUtils.js
async function m(e, t, r) {
	const { geometry: s } = t, o = { ...t.attributes };
	if (null != r && "mesh" === s?.type) {
		const { transformFieldRoles: t } = r, { origin: n, spatialReference: d, vertexSpace: m } = s, f = s.transform ?? new A(), g = "local" === m.type, b = e.spatialReference, y = b.isGeographic, R = T(b, d), h = on(d, b) && tn(d, b);
		if (!(g && y && h || !g && !y && R)) return null;
		const I = an(n, d, b);
		if (null == I) return null;
		if (o[t.originX] = I.x, o[t.originY] = I.y, o[t.originZ] = I.z ?? 0, null != f) {
			const { translation: e, scale: r, rotation: s } = f, n = g ? 1 : ce(d) / ce(b);
			o[t.translationX] = e[0] * n, o[t.translationY] = e[2] * n, o[t.translationZ] = -e[1] * n, o[t.scaleX] = r[0], o[t.scaleY] = r[2], o[t.scaleZ] = r[1], o[t.rotationX] = s[0], o[t.rotationY] = s[2], o[t.rotationZ] = -s[1], o[t.rotationDeg] = s[3];
		}
		return { attributes: o };
	}
	return null == s ? { attributes: o } : "mesh" === s.type || "extent" === s.type ? null : {
		geometry: s.toJSON(),
		attributes: o
	};
}
async function f(e, t) {
	const r = await Promise.all((t.addAttachments ?? []).map((t) => g(e, t))), a = await Promise.all((t.updateAttachments ?? []).map((t) => g(e, t))), s = t.deleteAttachments ?? [];
	return r.length || a.length || s.length ? {
		adds: r,
		updates: a,
		deletes: [...s]
	} : null;
}
async function g(e, t) {
	const { feature: r, attachment: a } = t, { globalId: o, name: n, contentType: l, data: i, uploadId: u } = a, d = { globalId: o };
	if (r && ("attributes" in r ? d.parentGlobalId = r.attributes?.[e.globalIdField] : r.globalId && (d.parentGlobalId = r.globalId)), u) d.uploadId = u;
	else if (i) {
		const e = await Dt(i);
		e && (d.contentType = e.mediaType, d.data = e.data), i instanceof File && (d.name = i.name);
	}
	return n && (d.name = n), l && (d.contentType = l), d;
}
function b(e$1, t, r) {
	if (!t || 0 === t.length) return [];
	if (r && o(t)) return t.map((e) => e.globalId);
	if (e(t)) return t.map((e) => e.objectId);
	const a = r ? e$1.globalIdField : e$1.objectIdField;
	return a ? t.map((e) => e.getAttribute(a)) : [];
}
function y(e) {
	const t = e?.assetMaps;
	if (t) {
		for (const e of t.addResults) e.success || n$1.getLogger("esri.layers.graphics.sources.support.sourceUtils").error(`Failed to map asset to feature with globalId ${e.globalId}.`);
		for (const e of t.updateResults) e.success || n$1.getLogger("esri.layers.graphics.sources.support.sourceUtils").error(`Failed to map asset to feature with globalId ${e.globalId}.`);
	}
	const a = e?.attachments, s = {
		addFeatureResults: e?.addResults?.map(R) ?? [],
		updateFeatureResults: e?.updateResults?.map(R) ?? [],
		deleteFeatureResults: e?.deleteResults?.map(R) ?? [],
		addAttachmentResults: a?.addResults ? a.addResults.map(R) : [],
		updateAttachmentResults: a?.updateResults ? a.updateResults.map(R) : [],
		deleteAttachmentResults: a?.deleteResults ? a.deleteResults.map(R) : []
	};
	return e?.editMoment && (s.editMoment = e.editMoment), s;
}
function R(e) {
	const r$1 = !0 === e.success ? null : e.error || {
		code: void 0,
		description: "Feature edit failed"
	};
	return {
		objectId: e.objectId,
		globalId: e.globalId,
		error: r$1 ? new r("feature-layer-source:edit-failure", r$1.description, { code: r$1.code }) : null
	};
}
function h(t, r) {
	return new j$1({
		attributes: t.attributes,
		geometry: u({
			...t.geometry,
			spatialReference: r
		})
	});
}
function I(e, t) {
	return {
		adds: e?.adds?.map((e) => h(e, t)) || [],
		updates: e?.updates?.map((e) => ({
			original: h(e[0], t),
			current: h(e[1], t)
		})) || [],
		deletes: e?.deletes?.map((e) => h(e, t)) || [],
		spatialReference: t
	};
}
function j(e) {
	const t = e.details.raw, r = +t.code, a = +t.extendedCode;
	return 500 === r && (-2147217144 === a || -2147467261 === a);
}
//#endregion
export { j as a, f as i, R as n, m as o, b as r, y as s, I as t };

//# sourceMappingURL=applyEditsUtils-B-PWWx9K.js.map