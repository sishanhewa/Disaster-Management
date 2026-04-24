import { t as n$1 } from "./assets-BZbzeyNa.js";
//#region node_modules/@arcgis/core/libs/parquet/loadParquetModule.js
var n = null;
async function s() {
	return n || (n = a()), n;
}
async function a() {
	const n = await import("./bundle-BzzL5SC6.js").then((n) => n.t);
	return await n.default({ module_or_path: n$1("esri/libs/parquet/pkg/bundle_bg.wasm") }), n;
}
//#endregion
export { s as t };

//# sourceMappingURL=loadParquetModule-C6PNN_hg.js.map