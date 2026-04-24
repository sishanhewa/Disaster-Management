import { y as o } from "./vec2-BPF6SpMH.js";
import { l as o$1 } from "./vec4-DVix-cmy.js";
import { i as n$1 } from "./vec4f64-SXri5KT8.js";
import { i as n$2 } from "./vec2f64-BKe4utUH.js";
import { n as t } from "./glsl-C9NBR2C0.js";
import { t as e } from "./Float2BindUniform-BnjnrRSF.js";
import { t as e$1 } from "./Float4BindUniform-17HGOBFV.js";
//#region node_modules/@arcgis/core/views/3d/webgl-engine/core/shaderLibrary/util/CameraSpace.glsl.js
function c(r) {
	r.fragment.uniforms.add(new e$1("projInfo", (r) => n(r.camera))), r.fragment.uniforms.add(new e("zScale", (r) => m(r.camera))), r.fragment.code.add(t`vec3 reconstructPosition(vec2 fragCoord, float depth) {
return vec3((fragCoord * projInfo.xy + projInfo.zw) * (zScale.x * depth + zScale.y), depth);
}`);
}
function n(r) {
	const o = r.projectionMatrix;
	return 0 === o[11] ? o$1(s, 2 / (r.fullWidth * o[0]), 2 / (r.fullHeight * o[5]), (1 + o[12]) / o[0], (1 + o[13]) / o[5]) : o$1(s, -2 / (r.fullWidth * o[0]), -2 / (r.fullHeight * o[5]), (1 - o[8]) / o[0], (1 - o[9]) / o[5]);
}
var s = n$1();
function m(o$2) {
	return 0 === o$2.projectionMatrix[11] ? o(l, 0, 1) : o(l, 1, 0);
}
var l = n$2();
//#endregion
export { c as t };

//# sourceMappingURL=CameraSpace.glsl-DbyAJc8m.js.map