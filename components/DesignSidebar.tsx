"use client";

import { useState } from "react";

export default function DesignSidebar() {
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("elements");
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState("normal");
  const [textColor, setTextColor] = useState("#000000");
  
  const tabs = [
    { id: "elements", label: "Elements", icon: "layers" },
    { id: "uploads", label: "Uploads", icon: "image" },
    { id: "text", label: "Text", icon: "type" },
    { id: "templates", label: "Templates", icon: "layout" },
  ];
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "elements":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted">Drag elements to your design</p>
            <div className="grid grid-cols-2 gap-3">
              {["Shape", "Icon", "Badge", "Pattern"].map((item) => (
                <div 
                  key={item}
                  className="aspect-square rounded-lg border border-border bg-background/50 flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h5 className="text-sm font-medium mb-2">Popular Elements</h5>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i}
                    className="aspect-square rounded-md border border-border bg-background/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <div className={`w-6 h-6 bg-primary/10 rounded-${i % 2 === 0 ? 'full' : 'md'}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "uploads":
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <p className="text-sm font-medium">Drop files here or click to upload</p>
              <p className="text-xs text-muted mt-1">PNG, JPG, SVG (max 5MB)</p>
              <input type="file" className="hidden" />
            </div>
            
            <h5 className="text-sm font-medium mt-4 mb-2">Recent Uploads</h5>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className="aspect-square rounded-md border border-border bg-background/50 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
                >
                  <div className="text-xs text-muted">Image {i}</div>
                </div>
              ))}
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
              
              {text && (
                <div className="p-3 rounded-lg border border-border bg-background/50">
                  <div className="text-sm font-medium mb-3">Text Options</div>
                  
                  <div className="space-y-3">
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
                  </div>
                  
                  <button className="w-full mt-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
                    Add to Canvas
                  </button>
                </div>
              )}
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
          </div>
        );
      case "templates":
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted">Choose a template to start with</p>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className="rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-[3/4] bg-background/50 flex items-center justify-center">
                    <span className="text-sm text-muted">Template {i}</span>
                  </div>
                  <div className="p-2 text-xs font-medium">Template {i}</div>
                </div>
              ))}
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