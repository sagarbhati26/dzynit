"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Decal, useTexture } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

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

// T-shirt 3D model component
interface TShirtModelProps {
  color?: string;
  designElements?: DesignElement[];
}

function TShirtModel({ color = "white", designElements = [] }: TShirtModelProps) {
  // Fixed: useGLTF does not return `error` or `loading`
  const gltf = useGLTF("/assets/tshirt.glb");
  const scene = gltf.scene;

  // Fixed: proper ref typing
  const meshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);

      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          meshRef.current = mesh;

          const material = mesh.material as THREE.MeshStandardMaterial;
          if (material?.color) {
            material.color.set(color);
          }
        }
      });
    }
  }, [color, scene]);

  return (
    <primitive object={scene} scale={2}>
      {meshRef.current &&
        designElements.map((element) => {
          if (element.type === "image" && element.url && element.view === "front") {
            return (
              <Decal
                key={element.id}
                mesh={meshRef} // FIXED — Drei expects ref, not meshRef.current
                position={[0, 0, 0.15]}
                rotation={[0, 0, element.rotation]}
                scale={0.15}
              >
                <meshBasicMaterial
                  map={new THREE.TextureLoader().load(element.url)}
                  transparent
                  polygonOffset
                  polygonOffsetFactor={-1}
                />
              </Decal>
            );
          }
          return null;
        })}
    </primitive>
  );
}

useGLTF.preload("/assets/tshirt.glb");

interface ImageDecalProps {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

const ImageDecal = ({ url, position, rotation }: ImageDecalProps) => {
  const texture = useTexture(url) as THREE.Texture;
  return <Decal position={position} rotation={rotation} scale={1} map={texture} />;
};

interface DesignElementsLayerProps {
  elements: DesignElement[];
  currentView: string;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
}

function DesignElementsLayer() {
  return null;
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
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const model3DRef = useRef<OrbitControlsImpl>(null);

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

  const getColorHex = () => {
    const map: Record<string, string> = {
      white: "#ffffff",
      black: "#111111",
      navy: "#0a2463",
      gray: "#6b7280",
      red: "#ef4444",
      green: "#10b981",
      blue: "#3b82f6",
      purple: "#8b5cf6",
    };
    return map[selectedColor] || "#ffffff";
  };

  const render3DProductShape = () => {
    return (
      <div className="w-full h-full" style={{ backgroundColor: "#4a4a4a" }}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          onCreated={({ camera }) => {
            console.log("Camera fov:", (camera as THREE.PerspectiveCamera).fov);
          }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          <Suspense fallback={null}>
            <TShirtModel color={getColorHex()} designElements={designElements} />
          </Suspense>

          <OrbitControls ref={model3DRef} enablePan={false} />
        </Canvas>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative overflow-hidden border rounded-lg bg-gray-50">
        <div
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {render3DProductShape()}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
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

        <div className="flex space-x-1">
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
    </div>
  );
}