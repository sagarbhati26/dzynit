"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Decal, Text } from "@react-three/drei";
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
import { Slider } from "./ui/Slider";

interface DesignElement {
  id: string;
  type: string;
  content: string;
  x?: number;
  y?: number;
  width?: number; // fontSize for text
  height?: number;
  rotation?: number;
  view?: string;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  align?: CanvasTextAlign;
  url?: string;
  dropCanvasWidth?: number;
  dropCanvasHeight?: number;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  position?: [number, number, number];
  rotationVector?: [number, number, number];
  scaleVector?: [number, number, number];
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
  const [showDebugGrid, setShowDebugGrid] = useState(false);

  // selected index
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);

  // dragging state: index currently dragging (null if none)
  const draggingIndexRef = useRef<number | null>(null);
  const draggingTextIndexRef = useRef<number | null>(null);
  const isPaintingRef = useRef(false);

  const updateTexture = useCallback(() => {
    if (!modelMeshesRef.current || modelMeshesRef.current.length === 0) return;
    applyGradientToMeshes(
      modelMeshesRef.current,
      controlPoints.map((p) => ({ uv: p.uv, color: p.color, radius: p.radius })),
      0.9
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
    updateModelColor();
    // Initial draw
    if (controlPoints.length > 0 || designElements.some(e => e.type === "text")) {
      updateTexture();
    }
  }, [controlPoints.length, designElements, updateModelColor, updateTexture]);

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
    if (!e.intersections || e.intersections.length === 0) return;
    const inter = e.intersections[0];

    if (inter.object?.userData?.isHandle) return;

    if (toolMode === "point") {
      addPointFromIntersection(inter);
    } else if (toolMode === "text") {
      if (!inter.uv) return;

      // Calculate rotation from normal to keep decal on surface
      let rotation: [number, number, number] = [0, 0, 0];
      let position: [number, number, number] = [0, 0, 0];

      if (inter.face && inter.face.normal) {
        // Transform normal to world space
        const normal = inter.face.normal.clone();
        normal.transformDirection(inter.object.matrixWorld).normalize();

        // Offset slightly outwards to avoid Z-fighting
        const pos = inter.point.clone().add(normal.clone().multiplyScalar(0.05));
        position = [pos.x, pos.y, pos.z];

        // The decal needs to look at the normal
        const helper = new THREE.Object3D();
        helper.position.copy(pos);
        helper.lookAt(pos.clone().add(normal));
        rotation = [helper.rotation.x, helper.rotation.y, helper.rotation.z];
      } else {
        const pos = inter.point ? [inter.point.x, inter.point.y, inter.point.z] : [0, 0, 0.2];
        position = [pos[0], pos[1], pos[2]];
      }

      if (selectedTextIndex !== null && designElements[selectedTextIndex]?.type === 'text') {
        // Move existing
        setDesignElements(designElements.map((el, i) => (i === selectedTextIndex ? { ...el, position: position, rotationVector: rotation } : el)));
        draggingTextIndexRef.current = selectedTextIndex;
      } else {
        // Create New Text
        const newIdx = designElements.length;
        setDesignElements([...designElements, {
          id: Math.random().toString(36).slice(2),
          type: "text",
          content: "New Text",
          position: position,
          rotationVector: rotation,
          rotation: 0,
          width: 32,
          color: "#ffffff",
          strokeColor: "transparent",
          strokeWidth: 0,
          view: currentView
        }]);
        setSelectedTextIndex(newIdx);
        draggingTextIndexRef.current = newIdx;
      }
    } else {
      isPaintingRef.current = true;
      if (inter.uv) {
        paintBrush(inter.uv.x, inter.uv.y, brushColor, brushRadius, brushHardness);
        updateTexture();
      }
    }
  };

  const handlePointerMove = (e: any) => {
    const draggingIndex = draggingIndexRef.current;
    if (draggingIndex !== null) {
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
      const targetInter = (e.intersections || []).find((it: any) => !it.object?.userData?.isHandle && it.object?.type === "Mesh");
      if (!targetInter) return;
      const { point } = targetInter;
      setDesignElements(designElements.map((el, i) => (i === draggingText ? { ...el, position: [point.x, point.y, point.z] } : el)));
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
  };

  const startHandleDrag = (index: number, e: any) => {
    e.stopPropagation();
    draggingIndexRef.current = index;
    setSelectedPointIndex(index);
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

          <React.Suspense fallback={null}>
            {designElements
              .filter(e => e.type === "text")
              .map((el, i) => {
                // Find the primary mesh (usually the body) by surface area or name, fallback to first
                // Simply picking the first mesh is risky if it's a button or zipper.
                // We'll pick the mesh with the largest geometry bounding sphere for now as a heuristic.
                const targetMesh = modelMeshesRef.current.reduce((max, curr) => {
                  if (!max) return curr;
                  if (!curr.mesh.geometry.boundingSphere) curr.mesh.geometry.computeBoundingSphere();
                  if (!max.mesh.geometry.boundingSphere) max.mesh.geometry.computeBoundingSphere();
                  return (curr.mesh.geometry.boundingSphere?.radius || 0) > (max.mesh.geometry.boundingSphere?.radius || 0) ? curr : max;
                }, modelMeshesRef.current[0])?.mesh;

                // Ensure we have a valid mesh
                if (!targetMesh || !targetMesh.geometry) return null;

                const pos = el.position ? new THREE.Vector3(...el.position) : new THREE.Vector3(0, 0, 0.6);
                const rot = el.rotationVector ? el.rotationVector : [0, 0, 0];

                return (
                  <Decal
                    key={el.id}
                    position={pos}
                    rotation={rot as any}
                    scale={[0.4, 0.4, 0.4]}
                    mesh={{ current: targetMesh } as any}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setSelectedTextIndex(i);
                      draggingTextIndexRef.current = i;
                    }}
                  >
                    <Text
                      fontSize={el.width ? el.width / 500 : 0.1}
                      color={el.color}
                      anchorX="center"
                      anchorY="middle"
                      outlineWidth={(el.strokeWidth || 0) * 0.002}
                      outlineColor={el.strokeColor || "transparent"}
                      rotation={[0, 0, (el.rotation || 0) * Math.PI / 180]}
                    >
                      {el.content}
                    </Text>
                  </Decal>
                );
              })
            }
          </React.Suspense>
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
        <div className="w-px h-6 bg-white/10 mx-2"></div>
        {/* <div className="flex items-center gap-3">
          <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-white/20" title="Brush Color" />
          <div className="flex flex-col w-24">
            <Slider value={brushRadius} min={0.01} max={0.2} step={0.01} onChange={(e) => setBrushRadius(Number(e.target.value))} />
          </div>
        </div> */}
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
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Color</label>
              <div className="flex gap-2">
                <input type="color" className="w-full h-10 rounded-lg cursor-pointer" value={controlPoints[selectedPointIndex].color} onChange={(e) => {
                  const val = e.target.value;
                  setControlPoints(prev => prev.map((p, i) => i === selectedPointIndex ? { ...p, color: val, worldPos: p.worldPos.clone() } : p));
                }} />
              </div>
            </div>
            <div>
              <Slider label="Radius" value={controlPoints[selectedPointIndex].radius} min={0.01} max={0.5} step={0.01} onChange={(e) => {
                const val = Number(e.target.value);
                setControlPoints(prev => prev.map((p, i) => i === selectedPointIndex ? { ...p, radius: val, worldPos: p.worldPos.clone() } : p));
              }} />
            </div>
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
            <h3 className="font-semibold text-white">Text Settings</h3>
            <button onClick={() => setSelectedTextIndex(null)} className="text-gray-500 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          <div className="space-y-4">
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
            <div>
              <Slider label="Size" value={designElements[selectedTextIndex].width || 64} min={12} max={300} onChange={(e) => {
                const val = Number(e.target.value);
                setDesignElements((prev: DesignElement[]) => prev.map((el, i) => i === selectedTextIndex ? { ...el, width: val } : el));
              }} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Color</label>
                <input type="color" className="w-full h-8 rounded cursor-pointer" value={designElements[selectedTextIndex].color} onChange={(e) => {
                  const val = e.target.value;
                  setDesignElements((prev: DesignElement[]) => prev.map((el, i) => i === selectedTextIndex ? { ...el, color: val } : el));
                }} />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400 mb-1 block">Rotation</label>
                <input type="number" className="w-full h-8 bg-white/5 border border-white/10 rounded px-2 text-xs" value={designElements[selectedTextIndex].rotation || 0} onChange={(e) => {
                  const val = Number(e.target.value);
                  setDesignElements((prev: DesignElement[]) => prev.map((el, i) => i === selectedTextIndex ? { ...el, rotation: val } : el));
                }} />
              </div>
            </div>

            <button
              onClick={() => {
                setDesignElements((prev: DesignElement[]) => prev.filter((_, i) => i !== selectedTextIndex));
                setSelectedTextIndex(null);
              }}
              className="w-full py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium border border-red-500/20"
            >
              Delete Text
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


