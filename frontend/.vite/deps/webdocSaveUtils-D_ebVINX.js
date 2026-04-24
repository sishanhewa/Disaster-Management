import { t as r } from "./Error-CzxduO2m.js";
import "./typedArrayUtil-BAuNmygZ.js";
import { V as I, c as U$1, q as T$1 } from "./request-CuG5cxow.js";
import "./promiseUtils-DhYhergm.js";
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
import { o as S$1 } from "./Point-B7zMqEx6.js";
import "./Extent-CquIzaXp.js";
import "./locale-BdrQIP_a.js";
import { t as M$1 } from "./Portal-DYysvbhZ.js";
import "./apiKeyUtils-Bv2Uwsd3.js";
import { n as k$1 } from "./PortalItem-BaGmB6Wg.js";
import "./messages-BSXJ_xjI.js";
import "./basemapDefinitions-CGK-Ctsz.js";
import { d as T$2, f as U$2 } from "./layerUtils-sQ-3wxAB.js";
import { o as j } from "./reactiveUtils-DRpp6Nmg.js";
import "./Identifiable-D2tBaz7a.js";
import "./Layer-BKiNQen_.js";
import "./timeZoneUtils-CBNjS1ZG.js";
import "./UnknownTimeZone-Dk-CZx5e.js";
import "./date-BGzzeGV1.js";
import "./timeUtils-LVAIYsCb.js";
import "./TimeExtent-bDAyL7B5.js";
import "./catalogUtils-lRNSLCIB.js";
import "./colorUtils-BC0_8aMM.js";
import "./mathUtils-hEBUcrMa.js";
import "./Clonable-D_RHUyXD.js";
import "./uuid-CI605U6Y.js";
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
import "./utils-3ndlmaCD.js";
import "./mat4-CCf33Vjt.js";
import { a as m, r as d } from "./basemapUtils-C5xoGB-C.js";
import "./jsonUtils-D_oLUjKv.js";
import { n as p } from "./MultiOriginJSONSupport-BYBQ0x8Q.js";
import { a as i, c as u, r as c, s, t as E$1 } from "./portalItemUtils-CDCH3kjA.js";
import { n as o } from "./jsonContext-r8n8WiRi.js";
import "./utils-5irCjX9t.js";
import "./utils-Ch7GqCap.js";
import { n as n$1, t as n } from "./project-jhGP-KV5.js";
import { t as i$1 } from "./originUtils-C166CX4q.js";
import "./resourceUtils-CBs8pUFo.js";
import { n as p$1 } from "./resourceUtils-BbY7Q9V8.js";
import { n as n$2, r as s$1, t as i$2 } from "./saveUtils-C8XCaiJv.js";
//#region node_modules/@arcgis/core/webdoc/support/webdocSaveUtils.js
var A = [
	"NatGeo_World_Map",
	"Ocean_Basemap",
	"USA_Topo_Maps",
	"World_Imagery",
	"World_Street_Map",
	"World_Terrain_Base",
	"World_Topo_Map",
	"World_Hillshade",
	"Canvas/World_Light_Gray_Base",
	"Canvas/World_Light_Gray_Reference",
	"Canvas/World_Dark_Gray_Base",
	"Canvas/World_Dark_Gray_Reference",
	"Ocean/World_Ocean_Base",
	"Ocean/World_Ocean_Reference",
	"Reference/World_Boundaries_and_Places",
	"Reference/World_Reference_Overlay",
	"Reference/World_Transportation"
].map((e) => e.toLowerCase());
async function P(e, t, r) {
	r ??= {}, U(e, t), await j(() => !t.updatingFromView), await t.load(), await E(t), await s$1(t), await M(e, t);
	const a = t.portalItem, { json: n, jsonContext: i } = await O(t, a, e.origin);
	return n$2(i, { errorName: `${e.name}:save` }, r), await k(t, a), await ge(e, t, a, n, i), await Promise.all([t.updateItemThumbnail(), p$1(t.resourceReferences, i)]), a;
}
async function O(e, t, o$1) {
	const r = o(t, o$1, !0), a = e.write({}, r);
	return await Promise.all(r.resources.pendingOperations), {
		json: a,
		jsonContext: r
	};
}
async function T(e, t, r, a) {
	a ??= {};
	const n = D(e, r);
	await j(() => !t.updatingFromView), await t.load(), await E(t), await s$1(t), await M(e, t);
	const { json: i, jsonContext: s } = await O(t, n, e.origin);
	n$2(s, { errorName: `${e.name}:save` }, a), await X(t, n);
	const l = t.getThumbnailState();
	return await he(e, t, n, i, s, a) && (t.resourceReferences.portalItem = n), t.restoreThumbnailFromState(l), await Promise.all([t.updateItemThumbnail(), p$1(t.resourceReferences, s)]), n;
}
function U(t, o) {
	if (!o.portalItem) throw new r(`${t.name}:portal-item-not-set`, "Portal item to save to has not been set on the WebMap");
	C(t, o.portalItem);
}
function C(t, o) {
	if (o.type !== t.itemType) throw new r(`${t.name}:portal-item-wrong-type`, `Portal item needs to have type "${t.itemType}"`);
}
async function M(t, o) {
	if ("linkchart" !== t.name && !o.basemap?.baseLayers.length) throw new r(`${t.name}:save`, "Map does not have a valid basemap with a base layer.");
}
function D(e, t) {
	let o = k$1.from(t);
	return o.id && (o = o.clone(), o.id = null), o.type || (o.type = e.itemType), o.portal || (o.portal = M$1.getDefault()), C(e, o), o;
}
function E(e) {
	const t = [];
	return e.basemap && t.push(e.basemap.load()), e.ground && t.push(e.ground.load()), Promise.allSettled(t).then(() => {});
}
async function k(e, t) {
	t.extent = await ce(e.portalItem, e.initialViewProperties.viewpoint.targetGeometry), await Y(e, t);
}
var G = E$1.JSAPI, L = "CollectorDisabled", x = "Collector", N = "Data Editing", V = "OfflineDisabled", B = "Offline", $ = "Workforce Project", F = "Workforce Worker", H = "Workforce Dispatcher", K = "Offline Map Areas", J = "FieldMapsDisabled", q = E$1.DEVELOPER_BASEMAP, z = "UtilityNetwork", Q = "IPS";
async function X(e, t) {
	c(t, L), c(t, J), c(t, E$1.METADATA), c(t, V), c(t, K), c(t, H), c(t, $), c(t, F), await k(e, t);
}
async function Y(e, t) {
	i(t, G), await Z(e), re(e, t), ae(e, t), ne(e, t), ie(e, t), se(e, t), le(e, t), pe(e, t), t.typeKeywords && (t.typeKeywords = t.typeKeywords.filter((e, t, o) => o.indexOf(e) === t));
}
function Z(e) {
	const t = ee(e).map((e) => e.load()).toArray();
	return Promise.allSettled(t).then(() => {});
}
function ee(e) {
	return e.allLayers.concat(e.allTables);
}
function te(e) {
	return ee(e).some((e) => e.loaded && U$2(e) && e.capabilities.operations.supportsEditing && e.editingEnabled && ("subtype-group" !== e.type || e.sublayers.some((e) => e.editingEnabled)));
}
function oe(e) {
	return ee(e).filter((e) => "group" !== e.type).every((t) => t.loaded && fe(e, t));
}
function re(e, t) {
	s(t, L) || s(t, $) || s(t, F) || s(t, H) || !te(e) ? c(t, x) : i(t, x);
}
function ae(e, t) {
	te(e) ? i(t, N) : c(t, N);
}
function ne(e, t) {
	!s(t, V) && oe(e) ? i(t, B) : c(t, B);
}
function ie(e, t) {
	m(e.basemap) ? i(t, q) : c(t, q);
}
function se(e, t) {
	e.utilityNetworks?.length ? i(t, z) : c(t, z);
}
function le(e, t) {
	e.ipsInfo ? i(t, Q) : c(t, Q);
}
function pe(e, t) {
	u(t, E$1.CHARTS, i$2(e));
}
async function ce(e, t) {
	const o = t.clone().normalize();
	let r;
	if (o.length > 1) for (const a of o) r ? a.width > r.width && (r = a) : r = a;
	else r = o[0];
	return ue(e, r);
}
async function ue(e, t) {
	const o = t.spatialReference;
	if (o.isWGS84) return t.clone();
	if (o.isWebMercator) return S$1(t);
	const { getGeometryServiceURL: r } = await import("./geometryServiceUtils-DHVgMotV.js");
	return (await n(await r(e), new n$1({
		geometries: [t],
		outSpatialReference: S.WGS84
	})))[0];
}
function me(e) {
	return T$2(e) || "map-notes" === e.type || "route" === e.type;
}
function fe(e, t) {
	return U$2(t) && t.capabilities.operations.supportsSync || me(t) && !t.portalItem || de(t) && !ye(t) && t.spatialReference.equals(e.initialViewProperties.spatialReference);
}
function de(e) {
	return ("tile" === e.type || "vector-tile" === e.type) && (e.capabilities.operations.supportsExportTiles || we(e) || d(e));
}
function ye(e) {
	return "vector-tile" === e.type && Object.keys(e.sourceNameToSource).length > 1;
}
function we(e) {
	return "tile" === e.type && U$1(e.url) && A.some((t) => e.url?.toLowerCase().includes("/" + t + "/"));
}
async function ge(e, t, o, r, a) {
	await o.update({ data: r }), be(e, t, o, r, a);
}
async function he(t, o, r$1, a, n, i) {
	const s = o.portalItem, l = {
		item: s,
		authenticated: !(!s?.id || !s.portal.user)
	}, p = r$1.portal;
	await p.signIn();
	const { copyAllowed: c, itemReloaded: u } = await _e(l, p);
	if (l.authenticated ||= u, !c) throw new r(`${t.name}:save-as-copy-not-allowed`, "Owner of this map does not allow others to save a copy");
	const m = await je(r$1, l, a, i);
	return o.portalItem = r$1, be(t, o, r$1, a, n), m;
}
async function _e(e, t) {
	const { item: o, authenticated: r } = e;
	return o?.id && o.typeKeywords?.includes("useOnly") ? o.portal.portalHostname !== t.portalHostname ? {
		copyAllowed: !1,
		itemReloaded: !1
	} : (r || await o.reload(), {
		copyAllowed: "admin" === o.itemControl || "update" === o.itemControl,
		itemReloaded: !0
	}) : {
		copyAllowed: !0,
		itemReloaded: !1
	};
}
async function je(e, t, o, a) {
	const n = e.portal, { item: i } = t, { folder: s, copyAllResources: l } = a;
	let p = !1;
	if (l && i?.id && T$1(i.portal.url, n.url) && parseInt(i.portal.currentVersion, 10) >= 2023) {
		const { total: e } = await i.fetchResources();
		p = !!e;
	}
	if (p) {
		const t = await i.copy({
			copyResources: "all",
			folder: s
		});
		e.id = t.id, e.portal = t.portal;
		const r = e.toJSON();
		await e.load(), e.read(r), await e.update({ data: o });
	} else await n.user.addItem({
		item: e,
		folder: s,
		data: o
	});
	return p;
}
function be(e, o, r, i, s) {
	p.prototype.read.call(o, {
		version: i.version,
		authoringApp: i.authoringApp,
		authoringAppVersion: i.authoringAppVersion
	}, {
		origin: e.origin,
		ignoreDefaults: !0,
		url: r.itemUrl ? I(r.itemUrl) : void 0
	}), i$1(s), o.resourceInfo = i;
}
//#endregion
export { P as save, T as saveAs };

//# sourceMappingURL=webdocSaveUtils-D_ebVINX.js.map