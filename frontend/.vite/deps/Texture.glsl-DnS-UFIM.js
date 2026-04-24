import { l as r } from "./vec3f64-CwISzc_v.js";
import { n as t } from "./glsl-C9NBR2C0.js";
import { t as e } from "./Float3PassUniform-DlZqND9N.js";
import { t as e$1 } from "./Texture2DPassUniform-JB6oXs--.js";
import { t as s } from "./ShaderBuilder-C0sRkEfT.js";
import { t as o } from "./ScreenSpacePass.glsl-CTkGBdF9.js";
import { t as c } from "./NoParameters-CKaHdqgO.js";
//#region node_modules/@arcgis/core/chunks/Texture.glsl.js
var a = class extends c {
	constructor() {
		super(...arguments), this.color = r(1, 1, 1);
	}
};
function n() {
	const e$2 = new s();
	return e$2.include(o), e$2.fragment.uniforms.add(new e$1("tex", (e) => e.texture), new e("uColor", (e) => e.color)).main.add(t`vec4 texColor = texture(tex, uv);
fragColor = texColor * vec4(uColor, 1.0);`), e$2;
}
var m = Object.freeze(Object.defineProperty({
	__proto__: null,
	TexturePassParameters: a,
	build: n
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
export { m as n, n as r, a as t };

//# sourceMappingURL=Texture.glsl-DnS-UFIM.js.map