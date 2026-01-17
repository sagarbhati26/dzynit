"use client";

import DesignCanvas from "@/components/DesignCanvas";
import DesignSidebar from "@/components/DesignSidebar";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function DesignStudioPage() {
  const [designName, setDesignName] = useState("Untitled Design");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState("Just now");
  const [showTutorial, setShowTutorial] = useState(true);
  const [designElements, setDesignElements] = useState<any[]>([]);
  const [productType, setProductType] = useState("tshirt");
  const [currentView, setCurrentView] = useState("front");
  const [selectedColor, setSelectedColor] = useState("black");

  // Communication between sidebar and canvas
  const handleAddElement = (element: any) => {
    // If text, add to designElements
    if (element.type === 'text') {
      const newEl = {
        ...element,
        id: Math.random().toString(36).substr(2, 9),
        x: 0.5,
        y: 0.5,
        position: [0, 0, 0.6],
        rotationVector: [0, 0, 0],
        view: currentView
      };
      setDesignElements((prev) => [...prev, newEl]);
    }
    // If image, handle image (not fully implemented in canvas yet but let's pass it)
    setUnsavedChanges(true);
  };

  // Handle saving the design
  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      setUnsavedChanges(false);
      setLastSaved("Just now");
    }, 1000);
  };

  // Handle publishing the design
  const handlePublish = () => {
    setIsPublishing(true);
    // Simulate publishing
    setTimeout(() => {
      setIsPublishing(false);
      setUnsavedChanges(false);
      setLastSaved("Just now");
    }, 1500);
  };

  // Auto-save functionality
  useEffect(() => {
    let autoSaveTimer: NodeJS.Timeout | undefined;

    if (unsavedChanges) {
      autoSaveTimer = setTimeout(() => {
        console.log("Auto-saving design...");
        setUnsavedChanges(false);
        setLastSaved("Just now");
      }, 30000); // Auto-save after 30 seconds of inactivity
    }

    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
    };
  }, [unsavedChanges, designElements]);

  // Prompt user before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        handlePublish();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-foreground">

      {/* 1. Background Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <DesignCanvas
          productType={productType}
          currentView={currentView}
          // setProductType={setProductType} // Removed from canvas props
          // setCurrentView={setCurrentView} // Removed from canvas props
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          designElements={designElements}
          setDesignElements={setDesignElements}
          setUnsavedChanges={setUnsavedChanges}
        />
      </div>

      {/* 2. Top Navigation (Floating) */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 pointer-events-none">
        <div className="flex justify-between items-center pointer-events-auto">
          {/* Logo area */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                D
              </div>
              <span className="font-bold text-xl tracking-tight text-white hidden md:block">dzyn<span className="text-indigo-400">it</span></span>
            </Link>
            <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-2">
              <input
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="bg-transparent border-none text-white font-medium focus:ring-0 placeholder-gray-500 hover:bg-white/5 rounded px-2 py-1 transition-colors w-48"
              />
              <span className="text-xs text-gray-500">{unsavedChanges ? 'Unsaved changes' : `Saved ${lastSaved}`}</span>
            </div>
          </div>

          {/* View Controls & Action Buttons */}
          <div className="flex items-center gap-3">
            {/* View Switcher */}
            {/* <div className="glass-panel p-1 rounded-lg flex gap-1">
              {['front', 'back', 'left', 'right'].map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${currentView === view ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  {view}
                </button>
              ))}
            </div> */}

            <div className="w-px h-6 bg-white/10 mx-2"></div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="glass-button px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 flex items-center gap-2"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              )}
              <span>Save</span>
            </button>

            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all"
            >
              {isPublishing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              )}
              <span>Publish</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Floating Sidebar (Left) */}
      <div className="absolute top-24 left-6 bottom-8 w-80 glass-panel p-4 rounded-2xl z-40 flex flex-col animate-in-right">
        <DesignSidebar
          onAddElement={handleAddElement}
          productType={productType}
          setProductType={setProductType}
          currentView={currentView}
        />
      </div>

      {/* 4. Tutorial Overlay (Optional) */}
      {showTutorial && (
        <div className="absolute bottom-8 right-8 z-50 animate-in">
          <div className="glass-panel p-4 rounded-xl max-w-xs relative">
            <button
              onClick={() => setShowTutorial(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <h4 className="font-semibold text-white mb-1">Quick Tips</h4>
            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
              <li>Drag on the canvas to rotate view</li>
              <li>Click "Paint Brush" to colorize parts</li>
              <li>Drop images from sidebar to add logos</li>
              <li>Use text tab to add custom typography</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
