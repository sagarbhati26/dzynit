// GradientOverlay.ts
import * as THREE from "three";
import GradientPainter from "./GradientPainter";
import { patchMaterialWithGradient } from "./PBRMaterialPatcher";

let painter: GradientPainter | null = null;

export function getPainter(size = 2048) {
  if (!painter) painter = new GradientPainter(size);
  return painter;
}

export function applyGradientToMeshes(
  meshes: { mesh: THREE.Mesh; material: THREE.Material | THREE.Material[] }[],
  controlPoints: any[],
  strength = 0.9
) {
  const p = getPainter();

  // Clear and apply control points
  p.clear();
  controlPoints.forEach((pt) => {
    p.paintSpot(pt.uv.x, pt.uv.y, pt.color, pt.radius, 0.6);
  });

  const tex = p.getTexture();
  tex.needsUpdate = true;

  meshes.forEach(({ mesh }) => {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((m: any) => {
        if (m.isMeshStandardMaterial) {
          patchMaterialWithGradient(m, tex, strength);
        }
      });
    } else {
      const m: any = mesh.material;
      if (m.isMeshStandardMaterial) {
        patchMaterialWithGradient(m, tex, strength);
      }
    }
  });
}

export function paintBrush(u: number, v: number, color: string, radius: number, hardness = 0.6) {
  const p = getPainter();
  p.paintSpot(u, v, color, radius, hardness);
}

export function exportTexturePNG() {
  if (!painter) return null;
  return painter.toPNG();
}