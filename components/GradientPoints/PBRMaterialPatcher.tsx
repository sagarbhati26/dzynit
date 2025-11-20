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

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `
        #include <map_fragment>

        vec4 grad = texture2D(gradientTexture, vUv);
        diffuseColor.rgb = mix(diffuseColor.rgb, grad.rgb, grad.a * gradientStrength);
      `
    );
  };

  material.needsUpdate = true;
}