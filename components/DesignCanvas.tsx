"use client";

import { useState, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

// Corrected imports
//import GradientEditor from "./GradientEditor/GradientEditor";
import GradientEditor from "./GradientEditor/GradientEditor";
import GradientProductModel from "./Product model/GradientProductModel";
//import GradientProductModel from "./ProductModel/GradientProductModel";

interface DesignElement {
  id: string;
  type: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  view: string;
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

  const canvasRef = useRef<HTMLDivElement>(null);
  const model3DRef = useRef<OrbitControlsImpl>(null);

  // ⭐ Gradient State
  const [gradientData, setGradientData] = useState({
    stops: [
      { id: "stop1", color: "#ff0000", pos: 0 },
      { id: "stop2", color: "#0000ff", pos: 1 },
    ],
    angle: 0,
    center: { x: 0.5, y: 0.5 },
  });

  // Raycaster + mouse (Batch 4)
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // ⭐ CLICK HANDLER (Batch 4)
  const handleClickOnModel = (event: any) => {
    if (!event.intersections || event.intersections.length === 0) return;

    const intersect = event.intersections[0];

    if (!intersect.uv) return;

    const uv = intersect.uv;

    setGradientData((prev) => ({
      ...prev,
      center: {
        x: uv.x,
        y: uv.y,
      },
    }));
  };

  // Drag + Drop (unchanged)
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);

    const raw =
      e.dataTransfer.getData("application/json") ||
      e.dataTransfer.getData("text/plain");

    if (!raw) return;

    let elementData;
    try {
      elementData = JSON.parse(raw);
    } catch {
      return;
    }

    if (elementData.type !== "text" && elementData.type !== "image") return;

    const newElement: DesignElement = {
      id: `element-${Date.now()}`,
      type: elementData.type,
      content: elementData.content || "",
      x,
      y,
      width: elementData.width ?? 100,
      height: elementData.height ?? 100,
      rotation: 0,
      view: currentView,
      url: elementData.url || "",
      dropCanvasWidth: canvasRef.current.clientWidth,
      dropCanvasHeight: canvasRef.current.clientHeight,
    };

    setDesignElements([...designElements, newElement]);
    setUnsavedChanges(true);
  };

  // Color list (still used for solid background tone)
  const colors = [
    { name: "White", value: "white", hex: "#ffffff" },
    { name: "Black", value: "black", hex: "#111111" },
    { name: "Navy", value: "navy", hex: "#0a2463" },
    { name: "Gray", value: "gray", hex: "#6b7280" },
    { name: "Red", value: "red", hex: "#ef4444" },
    { name: "Green", value: "green", hex: "#10b981" },
    { name: "Blue", value: "blue", hex: "#3b82f6" },
    { name: "Purple", value: "purple", hex: "#8b5cf6" },
  ];

  // Render 3D Section
  const render3DProductShape = () => {
    return (
      <div className="w-full h-full" style={{ backgroundColor: "#4a4a4a" }}>
        <Canvas
          camera={{ fov: 50 }}
          onPointerDown={(e) => handleClickOnModel(e)} // ⭐ Click to move gradient
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <Suspense fallback={null}>
            <GradientProductModel
              productType={productType}
              gradient={gradientData}
            />
          </Suspense>

          <OrbitControls ref={model3DRef} enablePan={false} />
        </Canvas>
      </div>
    );
  };

  return (
    <div className="flex flex-row h-full">
      {/* LEFT ▶ 3D Canvas */}
      <div className="flex-1 relative overflow-hidden border rounded-lg bg-gray-50">
        <div
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {render3DProductShape()}
        </div>

        {/* Zoom Slider */}
        <div className="absolute bottom-2 left-2 flex items-center space-x-2 bg-white/80 p-2 rounded">
          <span className="text-sm text-gray-500">Zoom:</span>
          <input
            type="range"
            min="50"
            max="200"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-24"
          />
        </div>

        {/* Color Dots (background tone) */}
        <div className="absolute bottom-2 right-2 flex space-x-1 bg-white/80 p-2 rounded">
          {colors.map((c) => (
            <button
              key={c.value}
              className={`w-6 h-6 rounded-full ${
                selectedColor === c.value ? "ring-2 ring-primary" : ""
              }`}
              style={{ backgroundColor: c.hex }}
              onClick={() => setSelectedColor(c.value)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT ▶ Gradient Editor */}
      <GradientEditor
        onChange={(g) =>
          setGradientData((prev) => ({
            ...prev,
            stops: g.stops,
            angle: g.angle,
          }))
        }
      />
    </div>
  );
}