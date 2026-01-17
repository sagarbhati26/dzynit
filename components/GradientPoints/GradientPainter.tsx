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
    align: CanvasTextAlign = "center",
    fontFamily: string = "Inter, system-ui, sans-serif",
    strokeColor: string = "transparent",
    strokeWidth: number = 0,
    shadowColor: string = "transparent",
    shadowBlur: number = 0
  ) {
    const x = u * this.size;
    const y = (1 - v) * this.size;

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate((rotationDeg * Math.PI) / 180);
    this.ctx.textAlign = align;
    this.ctx.textBaseline = "middle";
    this.ctx.font = `${fontWeight} ${Math.max(8, fontSize)}px ${fontFamily}`;

    // Shadow
    if (shadowColor !== "transparent" && shadowBlur > 0) {
      this.ctx.shadowColor = shadowColor;
      this.ctx.shadowBlur = shadowBlur;
    } else {
      this.ctx.shadowColor = "transparent";
      this.ctx.shadowBlur = 0;
    }

    // Stroke
    if (strokeColor !== "transparent" && strokeWidth > 0) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = strokeWidth;
      this.ctx.lineJoin = "round";
      this.ctx.strokeText(text, 0, 0);
    }

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

  // Debug Grid
  drawDebugGrid() {
    const steps = 10;
    this.ctx.lineWidth = 5;
    this.ctx.font = "40px Arial";
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    for (let i = 0; i <= steps; i++) {
      const p = i / steps;
      const pos = p * this.size;

      // Vertical lines (U)
      this.ctx.strokeStyle = i % 2 === 0 ? "red" : "rgba(255,0,0,0.5)";
      this.ctx.beginPath();
      this.ctx.moveTo(pos, 0);
      this.ctx.lineTo(pos, this.size);
      this.ctx.stroke();

      // Horizontal lines (V)
      this.ctx.strokeStyle = i % 2 === 0 ? "blue" : "rgba(0,0,255,0.5)";
      this.ctx.beginPath();
      this.ctx.moveTo(0, pos);
      this.ctx.lineTo(this.size, pos);
      this.ctx.stroke();

      // Labels
      this.ctx.fillText(`U:${p}`, pos, 50);
      this.ctx.fillText(`V:${1 - p}`, 50, pos);
    }
    this.contextSaveRestore(() => {
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(this.size / 2 - 100, this.size / 2 - 50, 200, 100);
      this.ctx.fillStyle = "black";
      this.ctx.font = "60px Arial";
      this.ctx.fillText("CENTER", this.size / 2, this.size / 2);
    });

    this.texture.needsUpdate = true;
  }

  private contextSaveRestore(fn: () => void) {
    this.ctx.save();
    fn();
    this.ctx.restore();
  }

  debugFillRed() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 0, this.size, this.size);
    this.texture.needsUpdate = true;
  }

  toPNG() {
    return this.canvas.toDataURL("image/png");
  }
}


export default GradientPainter;