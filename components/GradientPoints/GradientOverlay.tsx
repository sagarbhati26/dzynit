import * as THREE from "three";
import { generateGradientTexture, ControlPoint } from "./GradientTexture";
import { patchMaterialWithGradient } from "./PBRMaterialPatcher";

let currentTexture: THREE.Texture | null = null;

/**
 * Apply a gradient (from points) to a list of MeshInfo items.
 * - meshes: array of objects { mesh, material }
 * - points: array of control points (uv, color, radius)
 * - strength: blend strength 0..1
 */
export function applyGradientToMeshes(
  meshes: { mesh: THREE.Mesh; material: THREE.Material | THREE.Material[] }[],
  points: ControlPoint[],
  strength: number = 0.8,
  size: number = 1024
) {
  // dispose previous texture
  if (currentTexture) {
    currentTexture.dispose();
    currentTexture = null;
  }

  if (!points || points.length === 0) {
    return;
  }

  // generate a new gradient texture (UV-space)
  if (typeof window === "undefined") return; // server guard
  const tex = generateGradientTexture(points, size);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.flipY = false;
  tex.needsUpdate = true;
  currentTexture = tex;

  // patch all mesh materials that are MeshStandardMaterial
  meshes.forEach((entry) => {
    const mesh = entry.mesh;
    // handle array of materials too
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((mat: any) => {
        if (mat && mat.isMeshStandardMaterial) {
          patchMaterialWithGradient(mat as THREE.MeshStandardMaterial, tex, strength);
        }
      });
    } else {
      const mat: any = mesh.material;
      if (mat && mat.isMeshStandardMaterial) {
        patchMaterialWithGradient(mat as THREE.MeshStandardMaterial, tex, strength);
      }
    }
  });
}

export function clearGradient() {
  if (currentTexture) {
    currentTexture.dispose();
    currentTexture = null;
  }
}
