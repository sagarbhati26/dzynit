"use client";

import { useState } from "react";

export default function DesignCanvas() {
  const [zoom, setZoom] = useState(100);
  const [selectedColor, setSelectedColor] = useState("white");
  
  const colors = [
    { name: "White", value: "white" },
    { name: "Black", value: "black" },
    { name: "Navy", value: "navy" },
    { name: "Gray", value: "gray" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted">Product</div>
          <div className="font-medium flex items-center gap-2">
            Classic Tee — <span className="capitalize">{selectedColor}</span>
            <div className={`w-4 h-4 rounded-full border border-border bg-${selectedColor === 'white' ? 'white' : selectedColor}`}></div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-border">
            <button 
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="text-muted hover:text-primary transition-colors w-6 h-6 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
              </svg>
            </button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <button 
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="text-muted hover:text-primary transition-colors w-6 h-6 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
            </button>
          </div>
          <div className="text-sm text-muted">Canvas: 3000×3600</div>
        </div>
      </div>

      <div className="relative h-[620px] rounded-2xl card-glass soft-shadow flex items-center justify-center overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UyZThlYyIgb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
        
        {/* T-shirt mockup with dynamic color */}
        <div 
          className={`w-[${420 * zoom/100}px] h-[${520 * zoom/100}px] transition-all duration-300 ease-out`}
          style={{ 
            width: `${420 * zoom/100}px`, 
            height: `${520 * zoom/100}px`,
            transform: `scale(${zoom/100})` 
          }}
        >
          <div className={`relative w-full h-full bg-${selectedColor === 'white' ? 'white' : selectedColor} rounded-lg soft-shadow flex items-center justify-center overflow-hidden`}>
            {/* T-shirt shape overlay */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 520" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M140,50 C160,30 260,30 280,50 L310,10 L350,30 L330,90 L330,510 L90,510 L90,90 L70,30 L110,10 L140,50 Z" 
                fill={selectedColor === 'white' ? '#ffffff' : selectedColor === 'black' ? '#111111' : selectedColor === 'navy' ? '#0a2463' : '#6b7280'} 
                stroke={selectedColor === 'white' ? '#e5e7eb' : 'transparent'} 
                strokeWidth="1"
              />
              <path d="M140,50 C160,30 260,30 280,50 L280,150 L140,150 L140,50 Z" 
                fill={selectedColor === 'white' ? '#f9fafb' : selectedColor === 'black' ? '#1f1f1f' : selectedColor === 'navy' ? '#0f3076' : '#7c848e'} 
                opacity="0.5"
              />
            </svg>
            
            {/* Design area */}
            <div className="relative z-10 w-[200px] h-[200px] rounded-md flex items-center justify-center">
              <div className="text-muted text-sm">Drag elements here</div>
            </div>
          </div>
        </div>
        
        {/* Color selector */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-xl border border-border">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedColor === color.value ? 'ring-2 ring-primary ring-offset-2' : ''}`}
            >
              <div 
                className={`w-6 h-6 rounded-full border border-border`}
                style={{ 
                  backgroundColor: color.value === 'white' ? '#ffffff' : 
                                  color.value === 'black' ? '#111111' : 
                                  color.value === 'navy' ? '#0a2463' : '#6b7280'
                }}
              ></div>
            </button>
          ))}
        </div>
        
        {/* Tools */}
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-xl border border-border">
          <button className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"></path>
              <path d="m19 12-7 7-7-7"></path>
            </svg>
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v12"></path>
              <path d="m8 11 4 4 4-4"></path>
              <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"></path>
            </svg>
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-primary/10 flex items-center justify-center text-muted hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m4.93 4.93 14.14 14.14"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Quick actions */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-background/80 transition-colors">
          Save Draft
        </button>
        <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
          Preview Design
        </button>
      </div>
    </div>
  );
}