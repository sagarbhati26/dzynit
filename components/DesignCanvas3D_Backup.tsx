"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import ProductModel from "./Product model/GradientProductModel";
import {
  applyGradientToMeshes,
  paintBrush,
  getPainter,
} from "./GradientPoints/GradientOverlay";
import type { ControlPoint as BaseControlPoint } from "./GradientPoints/GradientTexture";
import GradientPoint3D from "./GradientPoints/GradientPoint3D";
import DraggableDecal from "./DraggableDecal"; // Imported DraggableDecal
import { Slider } from "./ui/Slider";

interface DesignElement {
  id: string;
  type: string;
  content: string;
  width?: number; // scale factor
  height?: number;
  rotation?: number; // 2D rotation z-axis
  view?: string;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  align?: CanvasTextAlign;
  url?: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  position?: [number, number, number] | null;
  rotationVector?: [number, number, number];
  scaleVector?: [number, number, number];
  uv?: { x: number; y: number };
}

interface DesignCanvasProps {
  productType?: string;
  currentView?: string;
  setProductType?: (type: string) => void;
  setCurrentView?: (view: string) => void;
  selectedColor?: string;
  setSelectedColor?: (color: string) => void;
  designElements?: DesignElement[];
  setDesignElements?: React.Dispatch<React.SetStateAction<DesignElement[]>>;
  setUnsavedChanges?: (value: boolean) => void;
}

type ControlPoint = BaseControlPoint & { worldPos: THREE.Vector3 };

export default function DesignCanvas({
  productType = "tshirt",
  currentView = "front",
  selectedColor = "black",
  setSelectedColor = () => { },
  designElements = [],
  setDesignElements = () => { },
  setUnsavedChanges = () => { },
}: DesignCanvasProps) {
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
  const [showDebugGrid, setShowDebugGrid] = useState(false);

  // selected index
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);

  // dragging state
  const draggingIndexRef = useRef<number | null>(null);
  const draggingTextIndexRef = useRef<number | null>(null);
  const isPaintingRef = useRef(false);

  // Target mesh for Decals
  const [targetMesh, setTargetMesh] = useState<THREE.Mesh | null>(null);

  // Update texture for GRADIENTS only
  const updateTexture = useCallback(() => {
    if (!modelMeshesRef.current || modelMeshesRef.current.length === 0) return;
    applyGradientToMeshes(
      modelMeshesRef.current,
      controlPoints.map((p) => ({ uv: p.uv, color: p.color, radius: p.radius })),
      0.9,
      [] // Pass empty array for design elements (they are now Decals)
    );
    if (showDebugGrid) {
      const getP = getPainter;
      const p = getP();
      if (p) p.drawDebugGrid();
    }
  }, [controlPoints, showDebugGrid]);

  const updateModelColor = useCallback(() => {
    if (!modelMeshesRef.current || modelMeshesRef.current.length === 0) return;
    const col = new THREE.Color(selectedColor);
    modelMeshesRef.current.forEach(({ mesh }) => {
      const applyToMaterial = (m: any) => {
        if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
          m.color.copy(col);
          m.transparent = false;
          m.depthWrite = true;
          m.needsUpdate = true;
        }
      };

      if (Array.isArray(mesh.material)) {
        (mesh.material as any[]).forEach(applyToMaterial);
      } else {
        applyToMaterial(mesh.material);
      }
    });
  }, [selectedColor]);

  useEffect(() => {
    updateModelColor();
    updateTexture();
  }, [updateModelColor, updateTexture]);

  useEffect(() => {
    const controls = model3DRef.current as any;
    if (!controls) return;
    const polar = Math.PI / 2.5;
    const azMap: Record<string, number> = { front: 0, back: Math.PI, left: Math.PI / 2, right: -Math.PI / 2 };
    const az = azMap[currentView] ?? 0;
    if (typeof controls.rotateTo === "function") {
      controls.rotateTo(az, polar, true);
    }
  }, [currentView]);

  const onModelReady = useCallback((meshes: { mesh: THREE.Mesh; material: THREE.Material | THREE.Material[] }[]) => {
    modelMeshesRef.current = meshes;
    if (meshes.length > 0) {
      setTargetMesh(meshes[0].mesh); // Set the first mesh as target for decals
    }
    updateModelColor();
    if (controlPoints.length > 0) {
      updateTexture();
    }
  }, [controlPoints.length, updateModelColor, updateTexture]);

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
    // If we clicked a handle/decal, stop propagation usually happens there.
    // But if we clicked the mesh:
    if (!e.intersections || e.intersections.length === 0) return;
    const inter = e.intersections[0];

    // Check if we hit a helper or existing decal (handled by their own events)
    if (inter.object?.userData?.isHandle) return;

    // Tool modes for BASE layer (Gradients)
    if (toolMode === "point") {
      addPointFromIntersection(inter);
    } else if (toolMode === "brush") {
      isPaintingRef.current = true;
      if (inter.uv) {
        paintBrush(inter.uv.x, inter.uv.y, brushColor, brushRadius, brushHardness);
        updateTexture();
      }
    } else if (toolMode === "text") {
      // Allow click-to-place text?
      // We can just add text to center or at click point
      if (inter.point) {
        const { point, face } = inter;
        handleAddTextAt(point, face.normal);
      }
    }
  };

  const handleAddTextAt = (point: THREE.Vector3, normal: THREE.Vector3) => {
    // Prepare rotation aligned to normal
    const dummy = new THREE.Object3D();
    dummy.position.copy(point);
    dummy.lookAt(point.clone().add(normal));

    const newEl: DesignElement = {
      id: Math.random().toString(36).slice(2),
      type: "text",
      content: "New Text",
      position: [point.x, point.y, point.z],
      rotationVector: [dummy.rotation.x, dummy.rotation.y, dummy.rotation.z],
      width: 64,
      color: "#ffffff",
      strokeColor: "transparent",
      strokeWidth: 0,
      view: currentView
    };
    setDesignElements([...designElements, newEl]);
    setSelectedTextIndex(designElements.length);
    // Immediately start dragging?
    // draggingTextIndexRef.current = designElements.length; // Optional
  };

  // Auto-placement for new elements from sidebar
  useEffect(() => {
    if (!targetMesh || designElements.length === 0) return;

    const unplacedIndex = designElements.findIndex(el => el.position === null);
    if (unplacedIndex !== -1) {
      if (!targetMesh.geometry.boundingBox) targetMesh.geometry.computeBoundingBox();
      const bbox = targetMesh.geometry.boundingBox;

      let finalPos = new THREE.Vector3(0, 0, 0.5);
      let finalRot: [number, number, number] = [0, 0, 0];

      if (bbox) {
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        const size = new THREE.Vector3();
        bbox.getSize(size);

        center.applyMatrix4(targetMesh.matrixWorld);

        // Multi-ray scan to find the best surface point (avoiding neck holes)
        const offsets = [
          new THREE.Vector3(0, 0, 0),       // Center
          new THREE.Vector3(0, -0.15, 0),   // Solar Plexus (safer)
          new THREE.Vector3(0, 0.1, 0),     // Upper Chest
          new THREE.Vector3(-0.1, 0, 0),    // Left
          new THREE.Vector3(0.1, 0, 0)      // Right
        ];

        let bestHit: THREE.Intersection | null = null;
        let minDistance = Infinity;

        const startZ = center.z + size.z + 2;
        const direction = new THREE.Vector3(0, 0, -1);

        for (const offset of offsets) {
          // Origin matches the offset relative to center
          const origin = center.clone().add(offset).setZ(startZ);
          const raycaster = new THREE.Raycaster(origin, direction);
          const intersects = raycaster.intersectObject(targetMesh, true);

          if (intersects.length > 0) {
            const hit = intersects[0];
            const normal = hit.face?.normal?.clone().transformDirection(hit.object.matrixWorld).normalize();

            // Strict check: Surface must face FORWARD (+Z)
            if (normal && normal.z > 0.2) {
              if (hit.distance < minDistance) {
                minDistance = hit.distance;
                bestHit = hit;
              }
            }
          }
        }

        if (bestHit) {
          const normal = bestHit.face!.normal!.clone().transformDirection(bestHit.object.matrixWorld).normalize();
          finalPos = bestHit.point.clone().add(normal.multiplyScalar(0.015));

          const dummy = new THREE.Object3D();
          dummy.position.copy(finalPos);
          dummy.lookAt(finalPos.clone().add(normal));
          finalRot = [dummy.rotation.x, dummy.rotation.y, dummy.rotation.z];
        } else {
          // Fallback: Float in front
          finalPos = new THREE.Vector3(center.x, center.y, center.z + size.z / 2 + 0.1);
        }
      }

      setDesignElements(prev => prev.map((el, i) =>
        i === unplacedIndex ? {
          ...el,
          position: [finalPos.x, finalPos.y, finalPos.z],
          rotationVector: finalRot
        } : el
      ));

      setSelectedTextIndex(unplacedIndex);
    }
  }, [designElements, targetMesh]);

  // Public Add Text Button handler (adds to center usually)
  const handleAddTextDefault = () => {
    // We can now just add with null position and let the effect handle it
    setDesignElements([...designElements, {
      id: Math.random().toString(36).slice(2),
      type: "text",
      content: "New Text",
      position: null as any, // Trigger auto-placement
      rotationVector: [0, 0, 0],
      width: 64,
      color: "#ffffff",
      strokeColor: "transparent",
      strokeWidth: 0,
      view: currentView
    }]);
  };

  const handlePointerMove = (e: any) => {
    const draggingIndex = draggingIndexRef.current;

    // Dragging Gradient Point
    if (draggingIndex !== null) {
      const targetInter = (e.intersections || []).find((it: any) => !it.object?.userData?.isHandle && it.uv);
      if (!targetInter) return;
      const { point, uv } = targetInter;
      setControlPoints((prev) =>
        prev.map((p, idx) => (idx === draggingIndex ? { ...p, worldPos: point.clone(), uv: { x: uv.x, y: uv.y } } : p))
      );
      return;
    }

    // Dragging Decal
    const draggingText = draggingTextIndexRef.current;
    if (draggingText !== null && targetMesh) {
      // Find intersection specifically with the target mesh (shirt)
      const raycaster = new THREE.Raycaster();
      // We must construct a ray from camera to mouse for accurate continuous dragging
      // But standard e.intersections is usually good enough if filtered.

      // Filter hits to only Front-Facing surfaces
      const validHits = (e.intersections || []).filter((it: any) => {
        if (it.object.uuid !== targetMesh.uuid) return false;
        // transform normal to world
        const normal = it.face.normal.clone().transformDirection(it.object.matrixWorld).normalize();
        return normal.z > 0.2; // Must face forward
      });

      if (validHits.length === 0) return;
      const targetInter = validHits[0];

      const { point, face } = targetInter;

      // Calculate rotation to align with surface normal
      const normal = face.normal.clone().transformDirection(targetInter.object.matrixWorld).normalize();
      const dummy = new THREE.Object3D();
      dummy.position.copy(point);
      dummy.lookAt(point.clone().add(normal));

      setDesignElements(prev => prev.map((el, i) =>
        i === draggingText ? {
          ...el,
          position: [point.x, point.y, point.z],
          rotationVector: [dummy.rotation.x, dummy.rotation.y, dummy.rotation.z]
        } : el
      ));
      return;
    }

    if (!isPaintingRef.current) return;
    const inter = (e.intersections || [])[0];
    if (!inter || !inter.uv) return;
    paintBrush(inter.uv.x, inter.uv.y, brushColor, brushRadius, brushHardness);
    updateTexture();
  };

  const handlePointerUp = (e: any) => {
    isPaintingRef.current = false;
    draggingIndexRef.current = null;
    draggingTextIndexRef.current = null;
    if (model3DRef.current) model3DRef.current.enabled = true; // Re-enable orbit
  };

  const startHandleDrag = (index: number, e: any) => {
    e.stopPropagation();
    draggingIndexRef.current = index;
    setSelectedPointIndex(index);
    if (model3DRef.current) model3DRef.current.enabled = false; // Disable orbit while dragging
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black overflow-hidden rounded-2xl shadow-2xl border border-white/5">

      {/* 3D Canvas */}
      <div className="absolute inset-0 cursor-crosshair">
        <Canvas
          camera={{ fov: 45, position: [0, 0, 15] }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          gl={{ preserveDrawingBuffer: true, antialias: true }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.7} />
          <hemisphereLight args={[0xffffff, 0x000000, 0.8]} />
          <spotLight position={[5, 10, 5]} angle={0.5} penumbra={1} intensity={1} castShadow />
          <Environment preset="city" />

          <React.Suspense fallback={null}>
            <ProductModel productType={productType} scale={1} onModelReady={onModelReady} />
          </React.Suspense>

          {controlPoints.map((p, i) => (
            p.worldPos && (
              <GradientPoint3D
                key={i}
                index={i}
                worldPos={p.worldPos}
                color={p.color}
                radius={p.radius}
                selected={selectedPointIndex === i}
                onPointerDown={startHandleDrag}
              />
            )
          ))}

          {targetMesh && designElements.map((el, i) => {
            if (!el.position) return null; // Wait for auto-placement
            return (
              <DraggableDecal
                key={el.id}
                element={el}
                mesh={targetMesh}
                isSelected={selectedTextIndex === i}
                onDelete={() => {
                  setDesignElements(prev => prev.filter((_, idx) => idx !== i));
                  setSelectedTextIndex(null);
                }}
                onScaleChange={(newScale) => {
                  setDesignElements(prev => prev.map((item, idx) => idx === i ? { ...item, width: newScale } : item));
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  draggingTextIndexRef.current = i;
                  setSelectedTextIndex(i);
                  if (model3DRef.current) model3DRef.current.enabled = false;
                }}
              />
            );
          })}

          <OrbitControls ref={model3DRef} enablePan={true} makeDefault minDistance={0.5} maxDistance={50} />
        </Canvas>
      </div>

      {/* Floating Controls Overlay - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-panel rounded-full px-6 py-3 flex gap-4 items-center animate-in" style={{ animationDelay: '0.1s' }}>

        {/* Garment Color */}
        <div className="flex items-center gap-2" title="Garment Color">
          <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-white/20 bg-transparent p-0 border-0" title="Garment Color" />
        </div>
        <div className="w-px h-6 bg-white/10 mx-2"></div>

        <button
          onClick={() => setToolMode("point")}
          className={`p-2.5 rounded-full transition-all duration-300 ${toolMode === 'point' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-110' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
          title="Add Gradient Point"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
        </button>
        <button
          onClick={() => setToolMode("text")}
          className={`p-2.5 rounded-full transition-all duration-300 ${toolMode === 'text' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/40 scale-110' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
          title="Add Text"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3" /><path d="M21 12.1H3" /><path d="M15.1 18H3" /></svg>
        </button>
        <button
          onClick={() => setToolMode("brush")}
          className={`p-2.5 rounded-full transition-all duration-300 ${toolMode === 'brush' ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/40 scale-110' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
          title="Paint Brush"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" /><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" /><path d="M14.5 17.5 4.5 15" /></svg>
        </button>
      </div>

      {/* Floating Context Panel - Right Side */}
      {selectedPointIndex !== null && controlPoints[selectedPointIndex] && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 glass-panel p-5 rounded-2xl w-64 animate-in space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 className="font-semibold text-white">Point Settings</h3>
            <button onClick={() => setSelectedPointIndex(null)} className="text-gray-500 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div className="space-y-4">
            <label className="text-xs text-gray-400 mb-2 block">Color</label>
            <div className="flex gap-2">
              <input type="color" className="w-full h-10 rounded-lg cursor-pointer" value={controlPoints[selectedPointIndex].color} onChange={(e) => {
                const val = e.target.value;
                setControlPoints(prev => prev.map((p, i) => i === selectedPointIndex ? { ...p, color: val, worldPos: p.worldPos.clone() } : p));
              }} />
            </div>
            <Slider label="Radius" value={controlPoints[selectedPointIndex].radius} min={0.01} max={0.5} step={0.01} onChange={(e) => {
              const val = Number(e.target.value);
              setControlPoints(prev => prev.map((p, i) => i === selectedPointIndex ? { ...p, radius: val, worldPos: p.worldPos.clone() } : p));
            }} />
            <button
              onClick={() => {
                setControlPoints(prev => prev.filter((_, i) => i !== selectedPointIndex));
                setSelectedPointIndex(null);
              }}
              className="w-full py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium border border-red-500/20"
            >
              Delete Point
            </button>
          </div>
        </div>
      )}

      {selectedTextIndex !== null && designElements[selectedTextIndex] && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 glass-panel p-5 rounded-2xl w-64 animate-in space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 className="font-semibold text-white">Design Settings</h3>
            <button onClick={() => setSelectedTextIndex(null)} className="text-gray-500 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          <div className="space-y-4">
            {designElements[selectedTextIndex].type === 'text' && (
              <div>
                <textarea
                  value={designElements[selectedTextIndex].content}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDesignElements((prev: DesignElement[]) => prev.map((el, i) => i === selectedTextIndex ? { ...el, content: val } : el));
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-violet-500 min-h-[60px]"
                />
              </div>
            )}
            <div>
              <Slider label="Scale" value={designElements[selectedTextIndex].width || 64} min={12} max={300} onChange={(e) => {
                const val = Number(e.target.value);
                setDesignElements((prev: DesignElement[]) => prev.map((el, i) => i === selectedTextIndex ? { ...el, width: val } : el));
              }} />
            </div>
            {designElements[selectedTextIndex].type === 'text' && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">Color</label>
                  <input type="color" className="w-full h-8 rounded cursor-pointer" value={designElements[selectedTextIndex].color} onChange={(e) => {
                    const val = e.target.value;
                    setDesignElements((prev: DesignElement[]) => prev.map((el, i) => i === selectedTextIndex ? { ...el, color: val } : el));
                  }} />
                </div>
              </div>
            )}
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Rot (Z)</label>
              <input type="number" className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-xs" value={Math.round((designElements[selectedTextIndex].rotationVector?.[2] || 0) * 180 / Math.PI)} disabled />
              <p className="text-[10px] text-gray-500">Drag to rotate (WIP)</p>
            </div>

            <button
              onClick={() => {
                setDesignElements((prev: DesignElement[]) => prev.filter((_, i) => i !== selectedTextIndex));
                setSelectedTextIndex(null);
              }}
              className="w-full py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium border border-red-500/20"
            >
              Delete Element
            </button>
          </div>
        </div>
      )}

      {/* Debug Controls - Top Right */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={() => setShowDebugGrid(!showDebugGrid)} className={`glass-button p-2 rounded-lg text-xs font-medium ${showDebugGrid ? 'text-yellow-400 border-yellow-400/30' : 'text-gray-400'}`}>
          Debug Grid
        </button>
      </div>

    </div>
  );
}
