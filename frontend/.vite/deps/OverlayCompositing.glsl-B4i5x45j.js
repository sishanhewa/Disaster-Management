import { n as t } from "./glsl-C9NBR2C0.js";
import { t as r } from "./FloatPassUniform-CUouKVjO.js";
import { t as e } from "./Texture2DPassUniform-JB6oXs--.js";
import { t as s } from "./ShaderBuilder-C0sRkEfT.js";
import { t as o } from "./ScreenSpacePass.glsl-CTkGBdF9.js";
import { t as c } from "./NoParameters-CKaHdqgO.js";
import { t as o$1 } from "./IntegerPassUniform-D0oBW2Xl.js";
//#region node_modules/@arcgis/core/chunks/OverlayCompositing.glsl.js
var n = class extends c {
	constructor() {
		super(...arguments), this.overlayIndex = 0, this.opacity = 1;
	}
};
function d() {
	const t$1 = new s();
	return t$1.include(o), t$1.fragment.uniforms.add(new e("tex", (e) => e.texture)), t$1.fragment.uniforms.add(new o$1("overlayIdx", (e) => e.overlayIndex)), t$1.fragment.uniforms.add(new r("opacity", (e) => e.opacity)), t$1.fragment.main.add(t`vec2 overlayUV = overlayIdx == 0 ? vec2(uv.x * 0.5, uv.y) : vec2(uv.x * 0.5 + 0.5, uv.y);
fragColor = texture(tex, overlayUV) * opacity;`), t$1;
}
var l = Object.freeze(Object.defineProperty({
	__proto__: null,
	OverlayCompositingPassParameters: n,
	build: d
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
export { l as n, n as r, d as t };

//# sourceMappingURL=OverlayCompositing.glsl-B4i5x45j.js.map