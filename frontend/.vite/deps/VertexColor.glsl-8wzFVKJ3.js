import { n as t } from "./glsl-C9NBR2C0.js";
//#region node_modules/@arcgis/core/views/3d/webgl-engine/core/shaderLibrary/attributes/VertexColor.glsl.js
function r(r, e) {
	e.hasVertexColors ? (r.attributes.add("color", "vec4"), r.varyings.add("vColor", "vec4"), r.vertex.code.add(t`void forwardVertexColor() { vColor = color; }`)) : r.vertex.code.add(t`void forwardVertexColor() {}`);
}
//#endregion
export { r as t };

//# sourceMappingURL=VertexColor.glsl-8wzFVKJ3.js.map