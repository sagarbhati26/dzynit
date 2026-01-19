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
  strength = 0.9,
  designElements: any[] = [] // Using any[] to match DesignElement structure later
) {
  const p = getPainter();
  if (!p) return;

  // Clear and apply control points
  p.clear();
  controlPoints.forEach((pt) => {
    p.paintSpot(pt.uv.x, pt.uv.y, pt.color, pt.radius, 0.6);
  });

  // Paint Design Elements (Text)
  designElements.forEach((el) => {
    if (el.type === "text" && el.uv) {
      p.drawText(
        el.uv.x,
        el.uv.y,
        el.content,
        el.width ? el.width : 64,
        el.color,
        el.fontWeight,
        el.rotation,
        el.align,
        el.fontFamily,
        el.strokeColor,
        el.strokeWidth,
        el.shadowColor,
        el.shadowBlur
      );
    }
  });

  const tex = p.getTexture();
  tex.needsUpdate = true;

  const shouldPatch = (m: any) => m?.isMeshStandardMaterial || m?.isMeshPhysicalMaterial || typeof m?.onBeforeCompile === "function";
  meshes.forEach(({ mesh }) => {
    if (Array.isArray(mesh.material)) {
      (mesh.material as any[]).forEach((m: any) => {
        if (shouldPatch(m) && !m.gradientPatched) {
          patchMaterialWithGradient(m, tex, strength);
        }
      });
    } else {
      const m: any = mesh.material;
      if (shouldPatch(m) && !m.gradientPatched) {
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