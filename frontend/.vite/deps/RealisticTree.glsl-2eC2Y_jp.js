import { c as o, r as d } from "./Emissions.glsl-Bq04sFww.js";
import { n as t, t as n } from "./glsl-C9NBR2C0.js";
import { t as e } from "./Float3PassUniform-DlZqND9N.js";
import { t as r } from "./FloatPassUniform-CUouKVjO.js";
import { t as e$1 } from "./Texture2DPassUniform-JB6oXs--.js";
import { t as s } from "./ShaderBuilder-C0sRkEfT.js";
import { n as l } from "./MaterialUtil-CUtkn25b.js";
import { t as e$2 } from "./Float4PassUniform-DIVN85R2.js";
import { a as h, t as o$1 } from "./AlphaCutoff-DBd0k7fB.js";
import { a as r$1, i as l$1, t as u } from "./VisualVariables.glsl-CAtl2l88.js";
import { n as f, t as d$1 } from "./View.glsl-VyAwPrFc.js";
import { t as i } from "./MixExternalColor.glsl-COn8Y2Lh.js";
import { t as i$1 } from "./TerrainDepthTest.glsl-BrU6RBH-.js";
import { t as e$3 } from "./OutputColorHighlightOLID.glsl-CVlWoZ7B.js";
import { r as n$1 } from "./VerticalOffset.glsl-BcRyc-Hc.js";
import { t as o$2 } from "./Transform.glsl-BKRY7eJF.js";
import { t as r$2 } from "./VertexColor.glsl-8wzFVKJ3.js";
import { a as t$1, i as p, n as f$2, o as c, r as i$2, t as f$1, u as r$3 } from "./DefaultMaterialAuxiliaryPasses.glsl-D4Nni4q6.js";
import { a as v, i as p$1, n as n$2, o as t$2, r as f$3, t as e$4 } from "./SnowCover.glsl-BWDbaNx4.js";
import { a as n$3, c as t$3, n as p$2, s as o$3, t as f$4 } from "./ReadShadowMap.glsl-B9z5I67s.js";
//#region node_modules/@arcgis/core/chunks/RealisticTree.glsl.js
function _(_) {
	const z = new s(), { attributes: U, vertex: W, fragment: H, varyings: G } = z, { output: q, offsetBackfaces: J, pbrMode: K, snowCover: Q, spherical: X } = _, Y = 1 === K || 2 === K;
	if (f(W, _), U.add("position", "vec3"), G.add("vpos", "vec3", { invariant: !0 }), z.include(u, _), z.include(p, _), z.include(n$1, _), z.include(i$1, _), !o(q)) return z.include(f$1, _), z;
	d$1(z.vertex, _), z.include(r$3, _), z.include(o$2), J && z.include(c), G.add("vNormalWorld", "vec3"), G.add("localvpos", "vec3", { invariant: !0 }), z.include(d, _), z.include(i$2, _), z.include(t$1, _), z.include(r$2, _), W.include(r$1), W.include(l$1), W.uniforms.add(new e$2("externalColor", (e) => e.externalColor, { supportsNaN: !0 })), G.add("vcolorExt", "vec4"), z.include(_.instancedDoublePrecision ? p$2 : f$4, _), W.main.add(t`
    forwardVertexColor();

    MaskedColor maskedColorExt =
      applySymbolColor(applyVVColor(applyInstanceColor(createMaskedFromNaNColor(externalColor))));

    vcolorExt = maskedColorExt.color;
    forwardColorMixMode(maskedColorExt.mask);

    bool alphaCut = opacityMixMode != ${t.int(l.ignore)} && vcolorExt.a < ${t.float(o$1)};
    vpos = getVertexInLocalOriginSpace();

    localvpos = vpos - view[3].xyz;
    vpos = subtractOrigin(vpos);
    vNormalWorld = dpNormal(vvLocalNormal(normalModel()));
    vpos = addVerticalOffset(vpos, localOrigin);
    vec4 basePosition = transformPosition(proj, view, vpos);

    forwardViewPosDepth((view * vec4(vpos, 1.0)).xyz);
    forwardTextureCoordinates();
    forwardLinearDepthToReadShadowMap();
    gl_Position = alphaCut ? vec4(1e38, 1e38, 1e38, 1.0) :
    ${n(J, "offsetBackfacingClipPosition(basePosition, vpos, vNormalWorld, cameraPosition);", "basePosition;")}
  `);
	const { hasColorTexture: Z, hasColorTextureTransform: ee } = _;
	return H.include(v, _), H.include(t$2, _), z.include(f$2, _), H.include(h, _), z.include(e$3, _), d$1(H, _), t$3(H), p$1(H), f$3(H), H.uniforms.add(W.uniforms.get("localOrigin"), W.uniforms.get("view"), new e("ambient", (e) => e.ambient), new e("diffuse", (e) => e.diffuse), new r("opacity", (e) => e.opacity), new r("layerOpacity", (e) => e.layerOpacity)), Z && H.uniforms.add(new e$1("tex", (e) => e.texture)), z.include(n$2, _), H.include(n$3, _), H.include(i), H.include(e$4, _), o$3(H), H.main.add(t`
      discardBySlice(vpos);
      discardByTerrainDepth();
      vec4 texColor = ${Z ? `texture(tex, ${ee ? "colorUV" : "vuv0"})` : " vec4(1.0)"};
      ${n(Z, `${n(_.textureAlphaPremultiplied, "texColor.rgb /= texColor.a;")}\n        discardOrAdjustAlpha(texColor);`)}
      vec3 viewDirection = normalize(vpos - cameraPosition);
      applyPBRFactors();
      float ssao = evaluateAmbientOcclusionInverse();
      ssao *= getBakedOcclusion();

      float additionalAmbientScale = additionalDirectedAmbientLight(vpos + localOrigin);
      vec3 additionalLight = ssao * mainLightIntensity * additionalAmbientScale * ambientBoostFactor * lightingGlobalFactor;
      float shadow = readShadow(additionalAmbientScale, vpos);
      vec3 matColor = max(ambient, diffuse);
      ${_.hasVertexColors ? t`vec3 albedo = mixExternalColor(vColor.rgb * matColor, texColor.rgb, vcolorExt.rgb, colorMixMode);
             float opacity_ = layerOpacity * mixExternalOpacity(vColor.a * opacity, texColor.a, vcolorExt.a, opacityMixMode);` : t`vec3 albedo = mixExternalColor(matColor, texColor.rgb, vcolorExt.rgb, colorMixMode);
             float opacity_ = layerOpacity * mixExternalOpacity(opacity, texColor.a, vcolorExt.a, opacityMixMode);`}

      vec3 shadingNormal = normalize(vNormalWorld);
      vec3 groundNormal = ${X ? "normalize(vpos + localOrigin)" : "vec3(0.0, 0.0, 1.0)"};

      ${n(Q, "vec3 faceNormal = screenDerivativeNormal(vpos);\n         float snow = getRealisticTreeSnow(faceNormal, shadingNormal, groundNormal);\n         albedo = mix(albedo, vec3(1), snow);")}

      ${t`albedo *= 1.2;
             vec3 viewForward = vec3(view[0][2], view[1][2], view[2][2]);
             float alignmentLightView = clamp(dot(viewForward, -mainLightDirection), 0.0, 1.0);
             float transmittance = 1.0 - clamp(dot(viewForward, shadingNormal), 0.0, 1.0);
             float treeRadialFalloff = vColor.r;
             float backLightFactor = 0.5 * treeRadialFalloff * alignmentLightView * transmittance * (1.0 - shadow);
             additionalLight += backLightFactor * mainLightIntensity;`}

      ${Y ? t`float additionalAmbientIrradiance = additionalAmbientIrradianceFactor * mainLightIntensity[2];
            ${n(Q, "mrr = applySnowToMRR(mrr, snow);")}
            vec3 shadedColor = evaluateSceneLightingPBR(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight, viewDirection, groundNormal, mrr, additionalAmbientIrradiance);` : t`vec3 shadedColor = evaluateSceneLighting(shadingNormal, albedo, shadow, 1.0 - ssao, additionalLight);`}
      vec4 finalColor = vec4(shadedColor, opacity_);
      outputColorHighlightOLID(applySlice(finalColor, vpos), albedo ${n(Q, ", 1.0")});`), z;
}
var z = Object.freeze(Object.defineProperty({
	__proto__: null,
	build: _
}, Symbol.toStringTag, { value: "Module" }));
//#endregion
export { z as n, _ as t };

//# sourceMappingURL=RealisticTree.glsl-2eC2Y_jp.js.map