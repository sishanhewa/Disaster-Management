import { n as t } from "./glsl-C9NBR2C0.js";
import { t as s } from "./ShaderBuilder-C0sRkEfT.js";
import { t as e } from "./Float4PassUniform-DIVN85R2.js";
import { a as h, i as e$1 } from "./AlphaCutoff-DBd0k7fB.js";
import { t as d } from "./ObjectAndLayerIdColor.glsl-BxfX9QuU.js";
import { t as u$1 } from "./VisualVariables.glsl-CAtl2l88.js";
import { n as f } from "./View.glsl-VyAwPrFc.js";
import { t as i } from "./TerrainDepthTest.glsl-BrU6RBH-.js";
import { t as e$2 } from "./OutputColorHighlightOLID.glsl-CVlWoZ7B.js";
import { t as o } from "./Transform.glsl-BKRY7eJF.js";
import { t as r } from "./VertexColor.glsl-8wzFVKJ3.js";
//#region node_modules/@arcgis/core/chunks/ColorMaterial.glsl.js
function u(u) {
	const v = new s(), { vertex: b, fragment: w, attributes: m, varyings: p } = v, { hasVVColor: f$1, hasVertexColors: h$1 } = u;
	return f(b, u), v.include(o), v.include(r, u), v.include(u$1, u), v.include(d, u), w.include(h, u), v.include(e$2, u), v.include(i, u), m.add("position", "vec3"), f$1 && m.add("colorFeatureAttribute", "float"), h$1 || p.add("vColor", "vec4"), p.add("vpos", "vec3", { invariant: !0 }), b.uniforms.add(new e("uColor", (e) => e.color)), b.main.add(t`
      vpos = position;
      forwardVertexColor();
      forwardObjectAndLayerIdColor();

      ${h$1 ? "vColor *= uColor;" : f$1 ? "vColor = uColor * interpolateVVColor(colorFeatureAttribute);" : "vColor = uColor;"}
      forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
      gl_Position = transformPosition(proj, view, vpos);`), w.include(e$1), w.main.add(t`discardBySlice(vpos);
discardByTerrainDepth();
outputColorHighlightOLID(applySlice(vColor, vpos), vColor.rgb);`), v;
}
var v = Object.freeze(Object.defineProperty({
	__proto__: null,
	build: u
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
export { v as n, u as t };

//# sourceMappingURL=ColorMaterial.glsl-BKLj6wx4.js.map