"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import DraggableDecal from "./DraggableDecal";
import { Slider } from "./ui/Slider";

interface DesignElement {
  id: string;
  type: string;
  content: string;
  width?: number;
  height?: number;
  rotation?: number;
  view?: string; // 'front' | 'back'
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  align?: CanvasTextAlign;
  url?: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  position?: { x: number; y: number } | null; // % (0-100)
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

export default function DesignCanvas({
  productType = "tshirt",
  currentView = "front", // 'front' or 'back'
  setCurrentView = () => { },
  selectedColor = "white",
  setSelectedColor = () => { },
  designElements = [],
  setDesignElements = () => { },
  setUnsavedChanges = () => { },
}: DesignCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradientCanvasRef = useRef<HTMLCanvasElement>(null);

  // Tool State
  const [toolMode, setToolMode] = useState<"point" | "brush" | "text">("point");
  const [brushColor, setBrushColor] = useState("#ff5722");
  const [brushRadius, setBrushRadius] = useState(50); // pixels
  const [brushHardness, setBrushHardness] = useState(0.5);

  // Selection
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Gradient Painting State (Simple 2D points for now, could act as "spots")
  const [gradientPoints, setGradientPoints] = useState<{ x: number, y: number, color: string, radius: number }[]>([]);

  // Effect: Auto-place new elements that have no position
  useEffect(() => {
    const unplacedIndex = designElements.findIndex(el => !el.position && el.view === currentView);
    if (unplacedIndex !== -1) {
      setDesignElements(prev => prev.map((el, i) => {
        if (i === unplacedIndex) {
          return {
            ...el,
            position: { x: 50, y: 30 }, // Default to chest area
            width: el.width || 150
          };
        }
        return el;
      }));
      setSelectedElementId(designElements[unplacedIndex].id);
    }
  }, [designElements, currentView, setDesignElements]);

  // Handle Canvas Painting (Gradients)
  const drawGradients = useCallback(() => {
    const canvas = gradientCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all points
    gradientPoints.forEach(pt => {
      // x,y are in %
      const x = (pt.x / 100) * canvas.width;
      const y = (pt.y / 100) * canvas.height;
      const radius = pt.radius; // in pixels? or scale relative to canvas? Let's say pixels for now.

      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, pt.color);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.globalCompositeOperation = "multiply"; // Blend mode!!
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

  }, [gradientPoints]);

  useEffect(() => {
    // Resize canvas to match container
    if (containerRef.current && gradientCanvasRef.current) {
      gradientCanvasRef.current.width = containerRef.current.offsetWidth;
      gradientCanvasRef.current.height = containerRef.current.offsetHeight;
      drawGradients();
    }
  }, [currentView, drawGradients]); // Re-run on view change?

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (toolMode === 'point' || toolMode === 'brush') {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setGradientPoints(prev => [...prev, {
        x, y,
        color: brushColor,
        radius: brushRadius
      }]);
    } else {
      // Deselect if clicking empty space
      setSelectedElementId(null);
    }
  };

  // Filter elements for current view
  const visibleElements = designElements.filter(el => (el.view || 'front') === currentView);
  const selectedElement = designElements.find(el => el.id === selectedElementId);

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden flex flex-col items-center justify-center p-8">

      {/* Toggle View */}
      <div className="absolute top-4 left-4 z-20 flex gap-2 bg-white/10 p-1 rounded-lg">
        {['front', 'back'].map(view => (
          <button
            key={view}
            onClick={() => setCurrentView?.(view)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-all ${currentView === view ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Main Editor Area */}
      <div
        ref={containerRef}
        className="relative w-full max-w-lg aspect-[3/4] bg-white/5 rounded-2xl shadow-2xl overflow-hidden select-none"
        onClick={handleCanvasClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const json = e.dataTransfer.getData("application/json");
          if (!json || !containerRef.current) return;

          try {
            const data = JSON.parse(json);
            const rect = containerRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            const newEl: DesignElement = {
              id: Math.random().toString(36).substr(2, 9),
              type: data.type || 'image',
              content: data.url || data.content,
              width: 150,
              position: { x, y },
              rotation: 0,
              view: currentView
            };

            setDesignElements(prev => [...prev, newEl]);
            setSelectedElementId(newEl.id);
          } catch (err) {
            console.error("Failed to parse drop data", err);
          }
        }}
        style={{
          // Base shirt color (if using a transparent white shirt image, we can tint the background)
          // Or we use CSS filter on the image. Let's try background color for now.
          // backgroundColor: selectedColor
        }}
      >
        {/* 1. Base Image Layer */}
        {/* Wrapper for tinting */}
        <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: selectedColor }}>
          <img
            src={currentView === 'back' ? '/assets/tshirt-back.png' : '/assets/tshirt-front.png'}
            alt="T-Shirt"
            className="w-full h-full object-contain pointer-events-none mix-blend-multiply opacity-100" // Simple tinting: White shirt + blend multiply
          />
        </div>

        {/* 2. Gradient/Paint Layer */}
        <canvas
          ref={gradientCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-multiply opacity-90"
        />

        {/* 3. Decal Layer */}
        {visibleElements.map((el) => (
          <DraggableDecal
            key={el.id}
            element={el}
            isSelected={selectedElementId === el.id}
            onSelect={() => setSelectedElementId(el.id)}
            containerRef={containerRef}
            onUpdate={(updated) => {
              setDesignElements(prev => prev.map(item => item.id === el.id ? updated : item));
            }}
            onDelete={() => {
              setDesignElements(prev => prev.filter(item => item.id !== el.id));
              setSelectedElementId(null);
            }}
          />
        ))}

      </div>

      {/* Floating Controls Overlay - Bottom Center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-panel rounded-full px-6 py-3 flex gap-4 items-center animate-in z-30" style={{ animationDelay: '0.1s' }}>

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
        {/* Brush Reset Button */}
        <button
          onClick={() => setGradientPoints([])}
          className="p-2.5 rounded-full text-red-400 hover:bg-white/10 hover:text-red-300 transition-all"
          title="Clear Drawing"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
        </button>
      </div>

      {/* Selected Element Context Panel */}
      {selectedElement && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 glass-panel p-5 rounded-2xl w-64 animate-in space-y-4 z-30">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 className="font-semibold text-white">Design Settings</h3>
            <button onClick={() => setSelectedElementId(null)} className="text-gray-500 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          <div className="space-y-4">
            {selectedElement.type === 'text' && (
              <div>
                <textarea
                  value={selectedElement.content}
                  onChange={(e) => {
                    setDesignElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, content: e.target.value } : el));
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-violet-500 min-h-[60px]"
                />
              </div>
            )}
            <div>
              <Slider label="Size" value={selectedElement.width || 100} min={20} max={400} onChange={(e) => {
                setDesignElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, width: Number(e.target.value) } : el));
              }} />
            </div>
            {selectedElement.type === 'text' && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">Color</label>
                  <input type="color" className="w-full h-8 rounded cursor-pointer" value={selectedElement.color || '#ffffff'} onChange={(e) => {
                    setDesignElements(prev => prev.map(el => el.id === selectedElement.id ? { ...el, color: e.target.value } : el));
                  }} />
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setDesignElements(prev => prev.filter(el => el.id !== selectedElementId));
                setSelectedElementId(null);
              }}
              className="w-full py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium border border-red-500/20"
            >
              Delete Element
            </button>
          </div>
        </div>
      )}

      {/* Tool Settings Context (Painting) */}
      {(toolMode === 'point' || toolMode === 'brush') && !selectedElement && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 glass-panel p-5 rounded-2xl w-64 animate-in space-y-4 z-30">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h3 className="font-semibold text-white">Brush Settings</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Color</label>
              <input type="color" className="w-full h-8 rounded cursor-pointer" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} />
            </div>
            <div>
              <Slider label="Size" value={brushRadius} min={10} max={200} onChange={(e) => setBrushRadius(Number(e.target.value))} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
