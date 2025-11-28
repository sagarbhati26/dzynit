// GradientPainter.ts
import * as THREE from "three";

export class GradientPainter {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;
  private size: number;

  constructor(size = 2048) {
    this.size = size;

    this.canvas = document.createElement("canvas");
    this.canvas.width = size;
    this.canvas.height = size;

    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    this.ctx = ctx;

    this.ctx.clearRect(0, 0, size, size);

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.flipY = false;
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.wrapS = this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.needsUpdate = true;
  }

  // Paint radial spot
  paintSpot(u: number, v: number, color: string, radius: number, hardness = 0.6, composite: GlobalCompositeOperation = "source-over") {
    const x = u * this.size;
    const y = (1 - v) * this.size;
    const r = Math.max(1, radius * this.size);

    const grad = this.ctx.createRadialGradient(x, y, 0, x, y, r);

    grad.addColorStop(0, color);
    grad.addColorStop(hardness, color);
    grad.addColorStop(1, "rgba(0,0,0,0)");

    this.ctx.globalCompositeOperation = composite;
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(x - r, y - r, r * 2, r * 2);
    this.ctx.globalCompositeOperation = "source-over";

    this.texture.needsUpdate = true;
  }

  // Draw text (UV-based)
  drawText(
    u: number,
    v: number,
    text: string,
    fontSize: number = 64,
    color: string = "#000000",
    fontWeight: string = "normal",
    rotationDeg: number = 0,
    align: CanvasTextAlign = "center"
  ) {
    const x = u * this.size;
    const y = (1 - v) * this.size;

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate((rotationDeg * Math.PI) / 180);
    this.ctx.textAlign = align;
    this.ctx.textBaseline = "middle";
    this.ctx.font = `${fontWeight} ${Math.max(8, fontSize)}px Inter, system-ui, sans-serif`;
    this.ctx.fillStyle = color;
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillText(text, 0, 0);
    this.ctx.restore();

    this.texture.needsUpdate = true;
  }

  // Clear
  clear() {
    this.ctx.clearRect(0, 0, this.size, this.size);
    this.texture.needsUpdate = true;
  }

  getTexture() {
    return this.texture;
  }

  toPNG() {
    return this.canvas.toDataURL("image/png");
  }
}

export default GradientPainter;