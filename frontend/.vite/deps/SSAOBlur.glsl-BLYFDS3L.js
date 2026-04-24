import { n as t } from "./glsl-C9NBR2C0.js";
import { t as r } from "./FloatPassUniform-CUouKVjO.js";
import { t as e } from "./Texture2DDrawUniform-yQGJWXaK.js";
import { t as e$1 } from "./Texture2DPassUniform-JB6oXs--.js";
import { t as s } from "./ShaderBuilder-C0sRkEfT.js";
import { t as a } from "./ReadDepth.glsl-BVS7zOL0.js";
import { t as o } from "./ScreenSpacePass.glsl-CTkGBdF9.js";
import { t as e$2 } from "./Float2DrawUniform-CRcJfyY3.js";
//#region node_modules/@arcgis/core/chunks/SSAOBlur.glsl.js
var d = 4;
function i() {
	const i = new s(), f = i.fragment;
	i.include(o);
	const u = (d + 1) / 2, c = 1 / (2 * u * u);
	return f.include(a), f.uniforms.add(new e$1("depthMap", (e) => e.depthTexture), new e("tex", (e) => e.colorTexture), new e$2("blurSize", (e) => e.blurSize), new r("projScale", (e, r) => {
		const t = r.camera.distance;
		return t > 5e4 ? Math.max(0, e.projScale - (t - 5e4)) : e.projScale;
	})), f.code.add(t`
    void blurFunction(vec2 uv, float r, float center_d, float sharpness, inout float wTotal, inout float bTotal) {
      float c = texture(tex, uv).r;
      float d = linearDepthFromTexture(depthMap, uv);

      float ddiff = d - center_d;

      float w = exp(-r * r * ${t.float(c)} - ddiff * ddiff * sharpness);
      wTotal += w;
      bTotal += w * c;
    }
  `), i.outputs.add("fragBlur", "float"), f.main.add(t`
    float b = 0.0;
    float w_total = 0.0;

    float center_d = linearDepthFromTexture(depthMap, uv);

    float sharpness = -0.05 * projScale / center_d;
    for (int r = -${t.int(d)}; r <= ${t.int(d)}; ++r) {
      float rf = float(r);
      vec2 uvOffset = uv + rf * blurSize;
      blurFunction(uvOffset, rf, center_d, sharpness, w_total, b);
    }
    fragBlur = b / w_total;`), i;
}
var f = Object.freeze(Object.defineProperty({
	__proto__: null,
	build: i
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
export { i as n, f as t };

//# sourceMappingURL=SSAOBlur.glsl-BLYFDS3L.js.map