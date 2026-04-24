//#region node_modules/@arcgis/core/widgets/PanoramicViewer/support/importUtils.js
async function t(t) {
	return await (await import("./PanoramicMeshManager-D6kkMW6Z.js").then((t) => t.default)).getInstance().load(t);
}
async function e() {
	return i(await import("./Mesh-Bw1PpR3b.js").then((n) => n.t));
}
async function r() {
	return i(await import("./MeshComponent-DqU5soKw.js").then((n) => n.t));
}
async function n() {
	return i(await import("./MeshMaterial-iAVkcjxh.js").then((n) => n.t));
}
async function s() {
	return i(await import("./MeshTexture-D7k6Z_hO.js").then((n) => n.t));
}
async function o() {
	return (await import("./MeshVertexAttributes-D4tx79HJ.js").then((n) => n.t)).default;
}
function i(t) {
	return t.default ?? t;
}
async function u() {
	const [a, i, u, c, p, m] = await Promise.all([
		e(),
		r(),
		n(),
		s(),
		o(),
		t()
	]);
	return {
		Mesh: a,
		MeshComponent: i,
		MeshMaterial: u,
		MeshTexture: c,
		MeshVertexAttributes: p,
		panoramicMeshManager: m
	};
}
async function p() {
	return i(await import("./PanoramicTilePyramid-Cs1ICHVP.js"));
}
async function m() {
	return i(await import("./RasterFactory-Bx9FiZmI.js"));
}
//#endregion
export { p as n, u as r, m as t };

//# sourceMappingURL=importUtils-BmhkesUr.js.map