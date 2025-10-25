"use client";

import DesignCanvas from "@/components/DesignCanvas";
import DesignSidebar from "@/components/DesignSidebar";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

export default function DesignStudioPage() {
  const [designName, setDesignName] = useState("Untitled Design");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState("Just now");
  const [showTutorial, setShowTutorial] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [designElements, setDesignElements] = useState([]);
  const [productType, setProductType] = useState("tshirt");
  const [currentView, setCurrentView] = useState("front");
  const [selectedColor, setSelectedColor] = useState("black");
  
  // Communication between sidebar and canvas
  const handleAddElement = (element) => {
    setDesignElements((prev) => [...prev, element]);
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
    let autoSaveTimer;
    
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
    const handleBeforeUnload = (e) => {
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
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      
      // Cmd/Ctrl + P to publish
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        handlePublish();
      }
      
      // Cmd/Ctrl + Z for undo (would need actual implementation)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        console.log("Undo action");
      }
      
      // Cmd/Ctrl + Shift + Z for redo (would need actual implementation)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        console.log("Redo action");
      }
      
      // ? to toggle keyboard shortcuts
      if (e.key === '?') {
        setShowKeyboardShortcuts(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="border-b border-border sticky top-20 bg-background z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </Link>
            <div className="h-6 w-px bg-border"></div>
            <div className="flex flex-col">
              <input
                type="text"
                value={designName}
                onChange={(e) => {
                  setDesignName(e.target.value);
                  setUnsavedChanges(true);
                }}
                className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0"
              />
              <div className="text-xs text-muted flex items-center gap-1">
                {unsavedChanges ? (
                  <span className="text-amber-500">Unsaved changes</span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Saved {lastSaved}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Product type selector */}
          <div className="hidden md:flex items-center gap-3 bg-background/50 px-3 py-1.5 rounded-lg border border-border">
            <button 
              onClick={() => {
                setProductType("tshirt");
                setUnsavedChanges(true);
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 ${productType === "tshirt" ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
              </svg>
              T-Shirt
            </button>
            <button 
              onClick={() => {
                setProductType("hoodie");
                setUnsavedChanges(true);
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 ${productType === "hoodie" ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
                <path d="M12 2v5"></path>
                <path d="M6 10v4a6 6 0 0 0 12 0v-4"></path>
              </svg>
              Hoodie
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted mr-2 hidden sm:block">
              <button 
                className="text-primary hover:underline flex items-center gap-1"
                onClick={() => {
                  // Preview functionality would be implemented here
                  console.log("Preview design");
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Preview
              </button>
            </div>
            <button 
              onClick={handleSave}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-background/80 transition-colors flex items-center gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-muted" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  <span>Save</span>
                </>
              )}
            </button>
            <button 
              onClick={handlePublish}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                    <line x1="16" y1="5" x2="22" y2="5"></line>
                    <line x1="19" y1="2" x2="19" y2="8"></line>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                  <span>Publish</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* View selector */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <div className="flex items-center justify-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-border inline-flex mx-auto">
          <button 
            onClick={() => {
              setCurrentView("front");
              setUnsavedChanges(true);
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 ${currentView === "front" ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground"}`}
          >
            Front
          </button>
          <button 
            onClick={() => {
              setCurrentView("back");
              setUnsavedChanges(true);
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 ${currentView === "back" ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground"}`}
          >
            Back
          </button>
          <button 
            onClick={() => {
              setCurrentView("left");
              setUnsavedChanges(true);
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 ${currentView === "left" ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground"}`}
          >
            Left
          </button>
          <button 
            onClick={() => {
              setCurrentView("right");
              setUnsavedChanges(true);
            }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 ${currentView === "right" ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground"}`}
          >
            Right
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 h-[calc(100vh-220px)] overflow-hidden card-glass rounded-xl p-4 soft-shadow">
            <DesignSidebar 
              onAddElement={handleAddElement}
              productType={productType}
              currentView={currentView}
            />
          </div>
          
          {/* Canvas */}
          <div className="lg:col-span-3">
            <DesignCanvas 
              productType={productType}
              currentView={currentView}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              designElements={designElements}
              setDesignElements={setDesignElements}
              setUnsavedChanges={setUnsavedChanges}
            />
          </div>
        </div>
      </div>

      {/* Tutorial overlay - shown to new users */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-background rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Welcome to the Design Studio!</h3>
            <p className="text-muted mb-4">
              Here's how to get started with your custom apparel design:
            </p>
            <ol className="space-y-3 mb-6">
              <li className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <strong>Choose your product</strong> - Select between T-shirts and hoodies
                </div>
              </li>
              <li className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <strong>Select a view</strong> - Design the front, back, or sides of your product
                </div>
              </li>
              <li className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <strong>Add elements</strong> - Drag images, text, or shapes onto your design
                </div>
              </li>
              <li className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">4</div>
                <div>
                  <strong>Customize</strong> - Resize, rotate, and adjust your design elements
                </div>
              </li>
            </ol>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowTutorial(false)}
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts helper */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
              <button 
                onClick={() => setShowKeyboardShortcuts(false)}
                className="text-muted hover:text-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Save</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted/20 rounded text-xs font-mono">⌘</kbd>
                  <span className="text-xs">+</span>
                  <kbd className="px-2 py-1 bg-muted/20 rounded text-xs font-mono">S</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Publish</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted/20 rounded text-xs font-mono">⌘</kbd>
                  <span className="text-xs">+</span>
                  <kbd className="px-2 py-1 bg-muted/20 rounded text-xs font-mono">P</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Undo</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted/20 rounded text-xs font-mono">⌘</kbd>
                  <span className="text-xs">+</span>
                  <kbd className="px-2 py-1 bg-muted/20 rounded text-xs font-mono">Z</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Redo</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted/20 rounded text-xs font-mono">⌘</kbd>
                  <span className="text-xs">+</span>
                  <kbd className="px-2 py-1 bg-muted/20 rounded text-xs font-mono">Shift</kbd>
                  <span className="text-xs">+</span>
                  <kbd className="px-2 py-1 bg-muted/20 rounded text-xs font-mono">Z</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Delete Element</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted/20 rounded text-xs font-mono">Delete</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Shortcuts</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted/20 rounded text-xs font-mono">?</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button 
          className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors shadow-lg"
          onClick={() => setShowKeyboardShortcuts(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="M6 8h.001"></path>
            <path d="M10 8h.001"></path>
            <path d="M14 8h.001"></path>
            <path d="M18 8h.001"></path>
            <path d="M8 12h.001"></path>
            <path d="M12 12h.001"></path>
            <path d="M16 12h.001"></path>
            <path d="M7 16h10"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}