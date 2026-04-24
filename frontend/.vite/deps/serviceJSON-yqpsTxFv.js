import { t as f } from "./request-CuG5cxow.js";
//#region node_modules/@arcgis/core/request/serviceJSON.js
async function r(r, t) {
	return (await f(r, {
		responseType: "json",
		query: {
			f: "json",
			...t?.customParameters,
			token: t?.apiKey
		}
	})).data;
}
//#endregion
export { r as t };

//# sourceMappingURL=serviceJSON-yqpsTxFv.js.map