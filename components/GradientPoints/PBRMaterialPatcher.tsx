// PBRMaterialPatcher.ts
import * as THREE from "three";

export function patchMaterialWithGradient(
  material: THREE.MeshStandardMaterial,
  gradientTexture: THREE.Texture,
  strength = 1.0
) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.gradientTexture = { value: gradientTexture };
    shader.uniforms.gradientStrength = { value: strength };

    shader.defines = shader.defines || {};
    (shader.defines as any).USE_UV = 1;

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform sampler2D gradientTexture;
        uniform float gradientStrength;
        `
      )
      .replace(
        "#include <map_fragment>",
        `
        #include <map_fragment>

        vec4 grad = texture(gradientTexture, vUv);
        diffuseColor.rgb = mix(diffuseColor.rgb, grad.rgb, grad.a * gradientStrength);
        `
      );
  };

  material.needsUpdate = true;
}