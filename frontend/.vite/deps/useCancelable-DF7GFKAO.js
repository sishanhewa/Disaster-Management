import { n as makeGenericController } from "./controllers-2rrOeKHA.js";
//#region node_modules/@esri/calcite-components/dist/chunks/useCancelable.js
var useCancelable = () => {
	return makeGenericController((_, controller) => {
		const resources = /* @__PURE__ */ new Set();
		controller.onDisconnected(() => {
			resources.forEach((resource) => resource.cancel());
		});
		return {
			add: (resourceOrResources) => {
				[resourceOrResources].flat().forEach((resource) => resources.add(resource));
			},
			resources
		};
	});
};
//#endregion
export { useCancelable as t };

//# sourceMappingURL=useCancelable-DF7GFKAO.js.map