import { V as I } from "./request-CuG5cxow.js";
import { t as M } from "./Portal-DYysvbhZ.js";
//#region node_modules/@arcgis/core/portal/support/jsonContext.js
function e(t, r) {
	return {
		...l(t, r),
		readResourcePaths: []
	};
}
function o(r, e, o) {
	const i = I(r.itemUrl);
	return {
		...l(r, e),
		messages: [],
		writtenProperties: [],
		blockedRelativeUrls: [],
		verifyItemRelativeUrls: i ? {
			rootPath: i.path,
			writtenUrls: []
		} : null,
		resources: o ? {
			toAdd: [],
			toUpdate: [],
			toKeep: [],
			pendingOperations: []
		} : null
	};
}
function l(e, o) {
	return {
		origin: o,
		url: I(e.itemUrl),
		portal: e.portal || M.getDefault(),
		portalItem: e
	};
}
//#endregion
export { o as n, e as t };

//# sourceMappingURL=jsonContext-r8n8WiRi.js.map