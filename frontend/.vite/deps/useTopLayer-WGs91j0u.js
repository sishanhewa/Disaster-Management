import { n as makeGenericController } from "./controllers-2rrOeKHA.js";
//#region node_modules/@esri/calcite-components/dist/chunks/useTopLayer.js
var useTopLayer = (options) => {
	return makeGenericController((component, controller) => {
		let opened = false;
		controller.onConnected(() => {
			if (opened) togglePopover(true);
		});
		async function togglePopover(open) {
			await component.componentOnReady();
			const nativePopoverEl = typeof options.target === "function" ? options.target() : options.target.value;
			if (!nativePopoverEl || !nativePopoverEl.hasAttribute("popover")) return;
			if (options.disabledOverride?.() || "topLayerDisabled" in component && component.topLayerDisabled === true || !open) {
				opened = false;
				nativePopoverEl.hidePopover();
				return;
			}
			opened = true;
			nativePopoverEl.showPopover();
		}
		return {
			show: async () => {
				await togglePopover(true);
			},
			hide: async () => {
				await togglePopover(false);
			}
		};
	});
};
//#endregion
export { useTopLayer as t };

//# sourceMappingURL=useTopLayer-WGs91j0u.js.map