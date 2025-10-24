"use client";

import DesignCanvas from "../../components/DesignCanvas";
import DesignSidebar from "../../components/DesignSidebar";
import Link from "next/link";
import { useState } from "react";

export default function DesignStudioPage() {
  const [designName, setDesignName] = useState("Untitled Design");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </Link>
            <div className="h-6 w-px bg-border"></div>
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSave}
              className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-background/80 transition-colors flex items-center gap-2"
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
            <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                <line x1="16" y1="5" x2="22" y2="5"></line>
                <line x1="19" y1="2" x2="19" y2="8"></line>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              <span>Publish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 h-[calc(100vh-180px)] overflow-hidden card-glass rounded-xl p-4 soft-shadow">
            <DesignSidebar />
          </div>
          
          {/* Canvas */}
          <div className="lg:col-span-3">
            <DesignCanvas />
          </div>
        </div>
      </div>
    </div>
  );
}