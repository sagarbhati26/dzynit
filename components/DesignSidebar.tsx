"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Slider } from "./ui/Slider";
import { ColorPicker } from "./ui/ColorPicker";

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
  setProductType?: (type: string) => void;
  currentView?: string;
}

export default function DesignSidebar({
  onAddElement = () => { },
  productType = "tshirt",
  setProductType = () => { },
  currentView = "front"
}: DesignSidebarProps) {
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("elements");
  const [fontSize, setFontSize] = useState(24);
  const [fontWeight, setFontWeight] = useState("normal");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const tabs = [
    {
      id: "uploads", label: "Uploads", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
      )
    },
    {
      id: "text", label: "Text", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3" /><path d="M21 12.1H3" /><path d="M15.1 18H3" /></svg>
      )
    },
    {
      id: "templates", label: "Templates", icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
      )
    },
  ];

  // Mock fonts
  const fonts = [
    { id: "inter", name: "Inter" },
    { id: "roboto", name: "Roboto" },
    { id: "montserrat", name: "Montserrat" },
    { id: "oswald", name: "Oswald" },
    { id: "playfair", name: "Playfair Display" }
  ];

  // Mock templates
  const templates = [
    { id: "t1", name: "Sports", thumbnail: "🏆" },
    { id: "t2", name: "Vintage", thumbnail: "🕰️" },
    { id: "t3", name: "Minimal", thumbnail: "◯" },
    { id: "t4", name: "Type", thumbnail: "𝓣" },
    { id: "t5", name: "Street", thumbnail: "🎨" },
    { id: "t6", name: "Nature", thumbnail: "🌿" }
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

  // Drag events
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
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

  const handleAddText = () => {
    if (text.trim()) {
      onAddElement({
        id: Math.random().toString(36).substr(2, 9),
        type: "text",
        content: text,
        width: fontSize,
        rotation: 0,
        color: textColor,
        fontWeight,
        fontFamily,
        align: "center",
        x: 0.5,
        y: 0.5,
        view: currentView,
        strokeColor: "transparent",
        strokeWidth: 0,
        shadowColor: "transparent",
        shadowBlur: 0
      });
      setText("");
    }
  };

  const handleElementDragStart = (e: DragEvent<HTMLDivElement>, element: DesignElement) => {
    e.dataTransfer.effectAllowed = 'copy';
    const payload = JSON.stringify({
      type: element.url ? 'image' : 'shape',
      name: element.name,
      url: element.url || '',
      width: 100, height: 100,
      content: element.name || ''
    });
    e.dataTransfer.setData("application/json", payload);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "uploads":
        return (
          <div className="space-y-4 animate-in">
            <div
              className={`border border-dashed transition-all duration-300 rounded-xl p-8 text-center cursor-pointer group ${isDragging ? 'border-primary bg-primary/10' : 'border-white/20 hover:border-primary/50 hover:bg-white/5'}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-primary transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              </div>
              <p className="text-sm font-medium text-gray-300">Drop files or click to upload</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG</p>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {uploadedImages.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square rounded-lg border border-white/10 bg-white/5 relative group cursor-grab active:cursor-grabbing overflow-hidden hover:border-primary/50 transition-all"
                    draggable
                    onDragStart={(e: any) => handleElementDragStart(e, image)}
                    onClick={() => onAddElement({
                      id: image.id,
                      type: 'image',
                      url: image.url,
                      content: image.url,
                      name: image.name,
                      width: 150
                    })}
                  >
                    <img src={image.url} alt={image.name} className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs font-medium text-white">Click to Add</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "text":
        return (
          <div className="space-y-6 animate-in">
            <div className="space-y-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text here..."
                className="w-full h-24 rounded-xl p-4 bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-gray-600 resize-none text-sm"
              />
              <button
                onClick={handleAddText}
                disabled={!text.trim()}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${text.trim() ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" : "bg-white/5 text-gray-500 cursor-not-allowed"}`}
              >
                Add Text Layer
              </button>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Typography</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  {fonts.map(font => <option key={font.id} value={font.name}>{font.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ColorPicker color={textColor} onChange={setTextColor} label="Color" />
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Weight</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-1.5 text-xs outline-none"
                    value={fontWeight}
                    onChange={(e) => setFontWeight(e.target.value)}
                  >
                    <option value="normal">Regular</option>
                    <option value="medium">Medium</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
              </div>

              <Slider
                label="Size"
                value={fontSize}
                min={12} max={200}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                valueDisplay={`${fontSize}px`}
              />
            </div>
          </div>
        );
      case "templates":
        return (
          <div className="grid grid-cols-2 gap-3 animate-in">
            {templates.map((template) => (
              <div key={template.id} className="group relative aspect-[4/5] rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden hover:border-primary/50 transition-all cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                  {template.thumbnail}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-xs font-medium text-white">{template.name}</p>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Product Selector Header */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Product</div>
        <div className="flex p-1 bg-white/5 rounded-lg border border-white/5">
          {['tshirt', 'hoodie'].map((type) => (
            <button
              key={type}
              onClick={() => setProductType(type)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${productType === type ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Tab Bar */}
      <div className="flex p-1 bg-white/5 rounded-xl mb-6 border border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {renderTabContent()}
      </div>
    </div>
  );
}