// PBRMaterialPatcher.ts
// Injects gradientTexture into existing MeshStandardMaterial via onBeforeCompile.

import * as THREE from "three";

export function patchMaterialWithGradient(
  material: THREE.MeshStandardMaterial,
  gradientTexture: THREE.Texture,
  strength: number = 0.8 // recommended realistic blend
) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.gradientTexture = { value: gradientTexture };
    shader.uniforms.gradientStrength = { value: strength };

    // Inject AFTER baseColor map sampling
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `
        #include <map_fragment>

        vec4 grad = texture2D(gradientTexture, vUv);

        // Combine original fabric color with gradient color
        diffuseColor.rgb = mix(diffuseColor.rgb, grad.rgb, grad.a * gradientStrength);
      `
    );
  };

  material.needsUpdate = true;
}