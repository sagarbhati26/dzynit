"use client";

import { useState, useRef, useCallback, ChangeEvent, DragEvent } from "react";

// Define types for our data structures
interface DesignElement {
  id: string;
  name: string;
  icon?: string;
  url?: string;
  file?: File;
  type?: string;
}

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  file: File;
}

interface DesignSidebarProps {
  onAddElement?: (element: any) => void;
  productType?: string;
  currentView?: string;
}

export default function DesignSidebar({ 
  onAddElement = () => {}, 
  productType = "tshirt", 
  currentView = "front" 
}: DesignSidebarProps) {
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("elements");
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState("normal");
  const [textColor, setTextColor] = useState("#000000");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const tabs = [
    
    { id: "uploads", label: "Uploads", icon: "image" },
    { id: "text", label: "Text", icon: "type" },
    { id: "templates", label: "Templates", icon: "layout" },
  ];

  // Mock elements for demonstration
  

  // Mock fonts for demonstration
  const fonts = [
    { id: "inter", name: "Inter" },
    { id: "roboto", name: "Roboto" },
    { id: "montserrat", name: "Montserrat" },
    { id: "oswald", name: "Oswald" },
    { id: "playfair", name: "Playfair Display" }
  ];

  // Mock templates for demonstration
  const templates = [
    { id: "template1", name: "Sports Team", thumbnail: "🏆" },
    { id: "template2", name: "Vintage", thumbnail: "🕰️" },
    { id: "template3", name: "Minimalist", thumbnail: "◯" },
    { id: "template4", name: "Typography", thumbnail: "𝓣" },
    { id: "template5", name: "Graffiti", thumbnail: "🎨" },
    { id: "template6", name: "Nature", thumbnail: "🌿" }
  ];

  // Handle file upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: URL.createObjectURL(file),
        file
      })) as UploadedImage[];
      
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  // Handle drag events
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const newImages = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: URL.createObjectURL(file),
        file
      })) as UploadedImage[];
      
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  // Handle adding text to canvas
  const handleAddText = () => {
    if (text.trim()) {
      const payload = {
        id: Math.random().toString(36).substr(2, 9),
        type: "text",
        content: text,
        width: fontSize,
        rotation: 0,
        color: textColor,
      };
      onAddElement(payload);
      setText("");
    }
  };

  // Handle dragging elements to canvas
  const handleElementDragStart = (e: DragEvent<HTMLDivElement>, element: DesignElement) => {
    const payload = {
      type: element.url ? 'image' : 'shape',
      name: element.name,
      url: element.url || '',
      width: 100,
      height: 100,
      content: element.name || ''
    };

    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    e.dataTransfer.setData("text/plain", JSON.stringify(payload));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "elements":
        return (
          <div className="space-y-6">
            <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 pb-2">
              <p className="text-sm text-muted">Drag elements to your design</p>
            </div>
            
           
            
            <div className="mt-4 p-3 rounded-lg border border-border bg-background/50">
              <h5 className="text-sm font-medium mb-2">Element Properties</h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted mb-1">Size</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      defaultValue="50"
                      className="flex-1"
                    />
                    <span className="text-xs font-medium w-8 text-center">50%</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-muted mb-1">Rotation</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      defaultValue="0"
                      className="flex-1"
                    />
                    <span className="text-xs font-medium w-8 text-center">0°</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-muted mb-1">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      defaultValue="#000000"
                      className="w-8 h-8 rounded-md border border-border p-0 overflow-hidden"
                    />
                    <input
                      type="text"
                      defaultValue="#000000"
                      className="flex-1 rounded-md p-1.5 text-xs border border-border bg-background/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "uploads":
        return (
          <div className="space-y-4">
            <div 
              className={`border-2 border-dashed ${isDragging ? 'border-primary bg-primary/5' : 'border-border'} rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer`}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <p className="text-sm font-medium">Drop files here or click to upload</p>
              <p className="text-xs text-muted mt-1">PNG, JPG, SVG (max 5MB)</p>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*" 
                multiple
                onChange={handleFileUpload}
              />
            </div>
            
            {uploadedImages.length > 0 && (
              <>
                <h5 className="text-sm font-medium mt-4 mb-2">Your Uploads</h5>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedImages.map((image) => (
                    <div 
                      key={image.id}
                      className="aspect-square rounded-md border border-border bg-background/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden relative group"
                      draggable
                      onDragStart={(e: DragEvent<HTMLDivElement>) => handleElementDragStart(e, image)}
                    >
                      <img 
                        src={image.url} 
                        alt={image.name} 
                        className="w-full h-full object-contain p-1" 
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="mt-4 p-3 rounded-lg border border-border bg-background/50">
              <h5 className="text-sm font-medium mb-2">Image Tools</h5>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 rounded-lg border border-border bg-background/50 flex items-center justify-center gap-1.5 hover:border-primary/50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 21a4 4 0 0 1-4-4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H7z"></path>
                    <line x1="16" y1="3" x2="16" y2="8"></line>
                    <line x1="8" y1="3" x2="8" y2="8"></line>
                    <line x1="3" y1="8" x2="21" y2="8"></line>
                    <line x1="7" y1="13" x2="17" y2="13"></line>
                    <line x1="7" y1="17" x2="12" y2="17"></line>
                  </svg>
                  <span className="text-xs">Crop</span>
                </button>
                <button className="p-2 rounded-lg border border-border bg-background/50 flex items-center justify-center gap-1.5 hover:border-primary/50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m2 12 20 0"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  <span className="text-xs">Remove BG</span>
                </button>
                <button className="p-2 rounded-lg border border-border bg-background/50 flex items-center justify-center gap-1.5 hover:border-primary/50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                    <path d="M10 2c1 .5 2 2 2 5"></path>
                  </svg>
                  <span className="text-xs">Filters</span>
                </button>
                <button className="p-2 rounded-lg border border-border bg-background/50 flex items-center justify-center gap-1.5 hover:border-primary/50 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span className="text-xs">Edit</span>
                </button>
              </div>
            </div>
          </div>
        );
      case "text":
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium">Add Text</label>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something..."
                className="w-full rounded-lg p-3 border border-border bg-background/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
              
              <div className="p-3 rounded-lg border border-border bg-background/50">
                <div className="text-sm font-medium mb-3">Text Options</div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-muted mb-1">Font Family</label>
                    <select className="w-full rounded-md p-2 text-sm border border-border bg-background/50">
                      {fonts.map(font => (
                        <option key={font.id} value={font.id}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-muted mb-1">Font Size</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="12"
                        max="72"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-xs font-medium w-8 text-center">{fontSize}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-muted mb-1">Font Weight</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["normal", "medium", "bold"].map((weight) => (
                        <button
                          key={weight}
                          onClick={() => setFontWeight(weight)}
                          className={`text-xs py-1.5 rounded border ${
                            fontWeight === weight 
                              ? 'bg-primary/10 border-primary/30 text-primary' 
                              : 'border-border bg-background/50 text-muted'
                          }`}
                        >
                          {weight.charAt(0).toUpperCase() + weight.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-muted mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-8 h-8 rounded-md border border-border p-0 overflow-hidden"
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-1 rounded-md p-1.5 text-xs border border-border bg-background/50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-muted mb-1">Alignment</label>
                      <div className="flex rounded-md border border-border overflow-hidden">
                        <button className="flex-1 py-1.5 bg-primary/10 text-primary border-r border-border">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                            <line x1="21" y1="6" x2="3" y2="6"></line>
                            <line x1="15" y1="12" x2="3" y2="12"></line>
                            <line x1="17" y1="18" x2="3" y2="18"></line>
                          </svg>
                        </button>
                        <button className="flex-1 py-1.5 bg-background/50 text-muted border-r border-border">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                            <line x1="21" y1="6" x2="3" y2="6"></line>
                            <line x1="21" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="18" x2="3" y2="18"></line>
                          </svg>
                        </button>
                        <button className="flex-1 py-1.5 bg-background/50 text-muted">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                            <line x1="21" y1="6" x2="3" y2="6"></line>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                            <line x1="21" y1="18" x2="7" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-muted mb-1">Style</label>
                      <div className="flex rounded-md border border-border overflow-hidden">
                        <button className="flex-1 py-1.5 bg-background/50 text-muted border-r border-border">
                          <span className="text-xs font-bold">B</span>
                        </button>
                        <button className="flex-1 py-1.5 bg-background/50 text-muted border-r border-border">
                          <span className="text-xs italic">I</span>
                        </button>
                        <button className="flex-1 py-1.5 bg-background/50 text-muted">
                          <span className="text-xs underline">U</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleAddText}
                  disabled={!text.trim()}
                  className={`w-full mt-3 py-2 rounded-lg ${
                    text.trim() 
                      ? 'bg-primary text-white hover:bg-primary-dark' 
                      : 'bg-primary/30 text-white/70 cursor-not-allowed'
                  } text-sm font-medium transition-colors`}
                >
                  Add to Canvas
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <h5 className="text-sm font-medium mb-2">Text Presets</h5>
              <div className="space-y-2">
                {["Heading", "Subheading", "Body Text", "Caption"].map((preset) => (
                  <div 
                    key={preset}
                    className="p-2 rounded-lg border border-border bg-background/50 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <span className="text-sm">{preset}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg border border-border bg-background/50">
              <h5 className="text-sm font-medium mb-2">Text Effects</h5>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 rounded-lg border border-border bg-background/50 flex items-center justify-center gap-1.5 hover:border-primary/50 transition-colors">
                  <span className="text-xs">Curved Text</span>
                </button>
                <button className="p-2 rounded-lg border border-border bg-background/50 flex items-center justify-center gap-1.5 hover:border-primary/50 transition-colors">
                  <span className="text-xs">Outline</span>
                </button>
                <button className="p-2 rounded-lg border border-border bg-background/50 flex items-center justify-center gap-1.5 hover:border-primary/50 transition-colors">
                  <span className="text-xs">Shadow</span>
                </button>
                <button className="p-2 rounded-lg border border-border bg-background/50 flex items-center justify-center gap-1.5 hover:border-primary/50 transition-colors">
                  <span className="text-xs">Gradient</span>
                </button>
              </div>
            </div>
          </div>
        );
      case "templates":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted">Choose a template to start with</p>
            
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className="rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-3/4 bg-background/50 flex items-center justify-center text-3xl">
                    {template.thumbnail}
                  </div>
                  <div className="p-2 text-xs font-medium">{template.name}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <h5 className="text-sm font-medium mb-2">Categories</h5>
              <div className="flex flex-wrap gap-2">
                {["Sports", "Casual", "Vintage", "Minimalist", "Typography", "Artistic"].map((category) => (
                  <button 
                    key={category}
                    className="px-3 py-1 rounded-full text-xs border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg border border-border bg-background/50">
              <h5 className="text-sm font-medium mb-2">Template Settings</h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-muted mb-1">Color Scheme</label>
                  <select className="w-full rounded-md p-2 text-sm border border-border bg-background/50">
                    <option value="original">Original</option>
                    <option value="monochrome">Monochrome</option>
                    <option value="vibrant">Vibrant</option>
                    <option value="pastel">Pastel</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-muted mb-1">Customize</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 rounded-lg border border-border bg-background/50 flex items-center justify-center gap-1.5 hover:border-primary/50 transition-colors">
                      <span className="text-xs">Edit Elements</span>
                    </button>
                    <button className="p-2 rounded-lg border border-border bg-background/50 flex items-center justify-center gap-1.5 hover:border-primary/50 transition-colors">
                      <span className="text-xs">Edit Text</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-xs font-medium transition-colors ${
              activeTab === tab.id 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-1 pb-4">
        {renderTabContent()}
      </div>
    </div>
  );
}