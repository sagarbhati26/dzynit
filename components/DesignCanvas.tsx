"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import ProductModel from "./Product model/GradientProductModel";
import {
  applyGradientToMeshes,
  paintBrush,
  exportTexturePNG,
  getPainter,
} from "./GradientPoints/GradientOverlay";
import type { ControlPoint as BaseControlPoint } from "./GradientPoints/GradientTexture";
import GradientPoint3D from "./GradientPoints/GradientPoint3D";

interface DesignElement {
  id: string;
  type: string;
  content: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  view?: string;
  color?: string;
  url?: string;
  dropCanvasWidth?: number;
  dropCanvasHeight?: number;
}

interface DesignCanvasProps {
  productType?: string;
  currentView?: string;
  setProductType?: (type: string) => void;
  setCurrentView?: (view: string) => void;
  selectedColor?: string;
  setSelectedColor?: (color: string) => void;
  designElements?: DesignElement[];
  setDesignElements?: (elements: DesignElement[]) => void;
  setUnsavedChanges?: (value: boolean) => void;
}

type ControlPoint = BaseControlPoint & { worldPos: THREE.Vector3 };

export default function DesignCanvas({
  productType = "tshirt",
  currentView = "front",
  setProductType = () => {},
  setCurrentView = () => {},
  selectedColor = "black",
  setSelectedColor = () => {},
  designElements = [],
  setDesignElements = () => {},
  setUnsavedChanges = () => {},
}: DesignCanvasProps) {
  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const model3DRef = useRef<OrbitControlsImpl | null>(null);

  // store meshes (from ProductModel)
  const modelMeshesRef = useRef<{ mesh: THREE.Mesh; material: THREE.Material | THREE.Material[] }[]>([]);

  // points: uv + color + radius + worldPos
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([]);

  // painting & tool state
  const [toolMode, setToolMode] = useState<"point" | "brush" | "text">("point");
  const [brushColor, setBrushColor] = useState("#ff5722");
  const [brushRadius, setBrushRadius] = useState(0.06);
  const [brushHardness, setBrushHardness] = useState(0.6);

  // selected index
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);

  // dragging state: index currently dragging (null if none)
  const draggingIndexRef = useRef<number | null>(null);
  const draggingTextIndexRef = useRef<number | null>(null);
  const isPaintingRef = useRef(false);
  const onModelReady = (meshes: { mesh: THREE.Mesh; material: THREE.Material | THREE.Material[] }[]) => {
    modelMeshesRef.current = meshes;
    if (controlPoints.length > 0) {
      applyGradientToMeshes(modelMeshesRef.current, controlPoints, 0.9);
      const p = getPainter();
      designElements
        .filter((e) => e.type === "text" && e.x !== undefined && e.y !== undefined)
        .forEach((t) => p.drawText(t.x as number, t.y as number, t.content, (t.width as number) || 64, t.color || "#000", (t.rotation as number) || 0));
    }
  };
  useEffect(() => {
    if (!modelMeshesRef.current || modelMeshesRef.current.length === 0) return;
    applyGradientToMeshes(
      modelMeshesRef.current,
      controlPoints.map((p) => ({ uv: p.uv, color: p.color, radius: p.radius })),
      0.9
    );
    const p = getPainter();
    designElements
      .filter((e) => e.type === "text" && e.x !== undefined && e.y !== undefined)
      .forEach((t) => p.drawText(t.x as number, t.y as number, t.content, (t.width as number) || 64, t.color || "#000", (t.rotation as number) || 0));
  }, [controlPoints, designElements]);

  useEffect(() => {
    if (!modelMeshesRef.current || modelMeshesRef.current.length === 0) return;
    const col = new THREE.Color(selectedColor);
    modelMeshesRef.current.forEach(({ mesh }) => {
      if (Array.isArray(mesh.material)) {
        (mesh.material as any[]).forEach((m: any) => {
          if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
            m.color.copy(col);
            m.needsUpdate = true;
          }
        });
      } else {
        const m: any = mesh.material;
        if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
          m.color.copy(col);
          m.needsUpdate = true;
        }
      }
    });
    applyGradientToMeshes(
      modelMeshesRef.current,
      controlPoints.map((p) => ({ uv: p.uv, color: p.color, radius: p.radius })),
      0.9
    );
    const p = getPainter();
    designElements
      .filter((e) => e.type === "text" && e.x !== undefined && e.y !== undefined)
      .forEach((t) => p.drawText(t.x as number, t.y as number, t.content, (t.width as number) || 64, t.color || "#000", (t.rotation as number) || 0));
  }, [selectedColor, designElements]);

  const addPointFromIntersection = (inter: any) => {
    if (!inter || !inter.uv) return;
    const uv = { x: inter.uv.x, y: inter.uv.y };
    const worldPos = inter.point.clone();
    const cp: ControlPoint = {
      uv,
      color: brushColor,
      radius: brushRadius,
      worldPos,
    };
    setControlPoints((prev) => [...prev, cp]);
    setSelectedPointIndex(controlPoints.length);
  };

  const handlePointerDown = (e: any) => {
    console.log("PointerDown event:", e);
console.log("Intersections:", e.intersections);
    if (!e.intersections || e.intersections.length === 0) return;
    const inter = e.intersections[0];

    // If pointer hits a handle (mesh.userData.isHandle), don't add a new point here
    if (inter.object?.userData?.isHandle) {
      // Let the handle's onPointerDown manage starting drag
      return;
    }

    if (toolMode === "point") {
      addPointFromIntersection(inter);
    } else if (toolMode === "text") {
      if (!inter.uv) return;
      let idx = selectedTextIndex;
      if (idx === null) {
        const lastTextIndex = [...designElements].map((e, i) => ({ e, i })).filter((x) => x.e.type === "text").map((x) => x.i).pop();
        if (lastTextIndex === undefined) return;
        idx = lastTextIndex;
        setSelectedTextIndex(idx);
      }
      setDesignElements((prev) => prev.map((e, i) => (i === (idx as number) ? { ...e, x: inter.uv.x, y: inter.uv.y, rotation: e.rotation || 0 } : e)) as any);
      draggingTextIndexRef.current = idx as number;
      const p = getPainter();
      designElements
        .filter((e) => e.type === "text" && e.x !== undefined && e.y !== undefined)
        .forEach((t) => p.drawText(t.x as number, t.y as number, t.content, (t.width as number) || 64, t.color || "#000", (t.rotation as number) || 0));
    } else {
      isPaintingRef.current = true;
      if (inter.uv) {
        paintBrush(inter.uv.x, inter.uv.y, brushColor, brushRadius, brushHardness);
        if (modelMeshesRef.current.length) {
          applyGradientToMeshes(modelMeshesRef.current, controlPoints.map((p) => ({ uv: p.uv, color: p.color, radius: p.radius })), 0.9);
          const p = getPainter();
          designElements
            .filter((e) => e.type === "text" && e.x !== undefined && e.y !== undefined)
            .forEach((t) => p.drawText(t.x as number, t.y as number, t.content, (t.width as number) || 64, t.color || "#000", (t.rotation as number) || 0));
        }
      }
    }
  };

  const handlePointerMove = (e: any) => {
    // If a handle is being dragged, update its position using the first intersection that is not a handle
    const draggingIndex = draggingIndexRef.current;
    if (draggingIndex !== null) {
      // find first intersection with uv that is NOT a handle
      const targetInter = (e.intersections || []).find((it: any) => !it.object?.userData?.isHandle && it.uv);
      if (!targetInter) return;

      const { point, uv } = targetInter;
      setControlPoints((prev) =>
        prev.map((p, idx) => (idx === draggingIndex ? { ...p, worldPos: point.clone(), uv: { x: uv.x, y: uv.y } } : p))
      );
      return;
    }

    const draggingText = draggingTextIndexRef.current;
    if (draggingText !== null) {
      const targetInter = (e.intersections || []).find((it: any) => !it.object?.userData?.isHandle && it.uv);
      if (!targetInter) return;
      const { uv } = targetInter;
      setDesignElements((prev) => prev.map((el, i) => (i === draggingText ? { ...el, x: uv.x, y: uv.y } : el)) as any);
      const p = getPainter();
      designElements
        .filter((de) => de.type === "text" && de.x !== undefined && de.y !== undefined)
        .forEach((t) => p.drawText(t.x as number, t.y as number, t.content, (t.width as number) || 64, t.color || "#000", (t.rotation as number) || 0));
      return;
    }

    if (!isPaintingRef.current) return;
    const inter = (e.intersections || [])[0];
    if (!inter || !inter.uv) return;
    paintBrush(inter.uv.x, inter.uv.y, brushColor, brushRadius, brushHardness);
    if (modelMeshesRef.current.length) {
      applyGradientToMeshes(modelMeshesRef.current, controlPoints.map((p) => ({ uv: p.uv, color: p.color, radius: p.radius })), 0.9);
      const p = getPainter();
      designElements
        .filter((de) => de.type === "text" && de.x !== undefined && de.y !== undefined)
        .forEach((t) => p.drawText(t.x as number, t.y as number, t.content, (t.width as number) || 64, t.color || "#000", (t.rotation as number) || 0));
    }
  };

  const handlePointerUp = (e: any) => {
    isPaintingRef.current = false;
    draggingIndexRef.current = null;
    draggingTextIndexRef.current = null;
  };
  const startHandleDrag = (index: number, e: any) => {
    e.stopPropagation();
    draggingIndexRef.current = index;
    // also mark selected
    setSelectedPointIndex(index);
  };
  const exportUVTexture = () => {
    const url = exportTexturePNG();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "uv-gradient.png";
    a.click();
  };
  const render3DProductShape = () => {
    return (
      <div className="w-full h-full" style={{ backgroundColor: "#2b2b2b" }}>
        <Canvas
          camera={{ fov: 50 }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <React.Suspense fallback={null}>
            <ProductModel productType={productType} scale={1} onModelReady={onModelReady} />
          </React.Suspense>

          {/* Render 3D gradient handles (spheres) */}
          {controlPoints.map((p, i) => {
            // if worldPos isn't available (shouldn't happen), skip rendering that handle
            if (!p.worldPos) return null;
            return (
              <GradientPoint3D
                key={i}
                index={i}
                worldPos={p.worldPos}
                color={p.color}
                radius={p.radius}
                selected={selectedPointIndex === i}
                onPointerDown={startHandleDrag}
              />
            );
          })}

          <OrbitControls ref={model3DRef} enablePan={false} makeDefault/>
        </Canvas>
      </div>
    );
  };


  return (
    <div className="flex flex-row h-full">
      {/* LEFT: 3D */}
      <div className="flex-1 relative overflow-hidden border rounded-lg bg-gray-50">
        <div
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          onDragOver={(e) => e.preventDefault()}
        >
          {render3DProductShape()}
        </div>

        {/* <div className="absolute bottom-2 left-2 flex items-center space-x-2 bg-white/80 p-2 rounded">
          <span className="text-sm text-gray-500">Zoom:</span>
          <input
            type="range"
            min="50"
            max="200"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-24"
          />
        </div> */}
      </div>
      <div className="w-80 p-4  border-l overflow-auto">
        <h2 className="text-lg font-semibold mb-3">Design Tools</h2>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setToolMode("point")}
            className={`px-3 py-1 rounded ${toolMode === "point" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Point
          </button>
          <button
            onClick={() => setToolMode("brush")}
            className={`px-3 py-1 rounded ${toolMode === "brush" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Brush
          </button>
          <button
            onClick={() => setToolMode("text")}
            className={`px-3 py-1 rounded ${toolMode === "text" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
          >
            Text
          </button>
          <button onClick={exportUVTexture} className="px-3 py-1 rounded bg-gray-100">Export UV</button>
        </div>

        <div className="mb-3">
          <label className="block text-sm">Brush Color</label>
          <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="block text-sm">Brush Radius: {(brushRadius * 100).toFixed(0)}%</label>
          <input
            type="range"
            min="0.01"
            max="0.6"
            step="0.01"
            value={brushRadius}
            onChange={(e) => setBrushRadius(Number(e.target.value))}
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm">Hardness: {brushHardness}</label>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={brushHardness}
            onChange={(e) => setBrushHardness(Number(e.target.value))}
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm">Garment Color</label>
          <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} />
        </div>

        <hr className="my-3" />

        <h3 className="font-semibold">Points ({controlPoints.length})</h3>
        <div className="space-y-2 mt-2">
          {controlPoints.map((p, i) => (
            <div
              key={i}
              className={`p-2 rounded border ${selectedPointIndex === i ? "border-blue-500" : "border-gray-200"}`}
              onClick={() => setSelectedPointIndex(i)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div style={{ width: 18, height: 18, background: p.color, borderRadius: 4, border: "1px solid #ddd" }} />
                  <div className="text-sm">Point #{i + 1}</div>
                </div>
                <div className="text-xs text-gray-500">{Math.round(p.radius * 100)}%</div>
              </div>

              {selectedPointIndex === i && (
                <div className="mt-2 space-y-2">
                  <div>
                    <label className="text-sm">Color</label>
                    <input
                      type="color"
                      value={p.color}
                      onChange={(e) =>
                        setControlPoints((prev) => {
                          const next = prev.map((x, idx) =>
                            idx === i
                              ? { ...x, color: e.target.value, worldPos: x.worldPos.clone() }
                              : x
                          );

                          setTimeout(() => {
                            if (modelMeshesRef.current.length) {
                              applyGradientToMeshes(
                                modelMeshesRef.current,
                                next.map((p) => ({
                                  uv: p.uv,
                                  color: p.color,
                                  radius: p.radius,
                                })),
                                0.9
                              );
                            }
                          }, 0);

                          return next;
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm">Radius</label>
                    <input
                      type="range"
                      min="0.01"
                      max="0.6"
                      step="0.01"
                      value={p.radius}
                      onChange={(e) =>
                        setControlPoints((prev) => {
                          const next = prev.map((x, idx) =>
                            idx === i
                              ? { ...x, radius: Number(e.target.value), worldPos: x.worldPos.clone() }
                              : x
                          );

                          setTimeout(() => {
                            if (modelMeshesRef.current.length) {
                              applyGradientToMeshes(
                                modelMeshesRef.current,
                                next.map((p) => ({
                                  uv: p.uv,
                                  color: p.color,
                                  radius: p.radius,
                                })),
                                0.9
                              );
                            }
                          }, 0);

                          return next;
                        })
                      }
                    />
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => {
                        setControlPoints((prev) => prev.filter((_, idx) => idx !== i));
                        setSelectedPointIndex(null);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="px-2 py-1 bg-gray-100 rounded"
                      onClick={() => {
                        const cp = controlPoints[i];
                        setControlPoints((prev) => [...prev, { uv: { ...cp.uv }, color: cp.color, radius: cp.radius, worldPos: cp.worldPos.clone() }]);
                      }}
                    >
                      Duplicate
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

