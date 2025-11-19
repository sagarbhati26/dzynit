// GradientTexture.ts
// Generates a UV-space gradient texture from control points.

import * as THREE from "three";

export interface ControlPoint {
  uv: { x: number; y: number };
  color: string;
  radius: number; // 0..1
}

export function generateGradientTexture(
  points: ControlPoint[],
  size: number = 512
) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // transparent base
  ctx.clearRect(0, 0, size, size);

  points.forEach((p) => {
    const px = p.uv.x * size;
    const py = (1 - p.uv.y) * size;
    const r = p.radius * size;

    const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
    grad.addColorStop(0, p.color);
    grad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = grad;
    ctx.fillRect(px - r, py - r, r * 2, r * 2);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.flipY = false; // VERY IMPORTANT for GLTF UVs

  return texture;
}