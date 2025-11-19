"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "py-3 bg-background/80 backdrop-blur-lg shadow-sm" 
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold transition-all duration-300 group-hover:bg-primary group-hover:text-white">
              DZ
            </div>
            <div>
              <div className="font-semibold">Dzyn</div>
              <div className="text-xs text-muted -mt-0.5">
                design & marketplace
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/marketplace" className="text-sm font-medium text-muted hover:text-primary transition-colors duration-200">
            Marketplace
          </Link>
          <Link href="/dzyn" className="text-sm font-medium text-muted hover:text-primary transition-colors duration-200">
            Design Studio
          </Link>
          <Link href="/profile" className="text-sm font-medium text-muted hover:text-primary transition-colors duration-200">
            Profile
          </Link>
          <Link href="/dzyn">
            <button className="ml-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-all duration-200 transform hover:-translate-y-0.5">
              Start Creating
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-background/95 backdrop-blur-lg transition-all duration-300 overflow-hidden ${
        mobileMenuOpen ? 'max-h-60 border-b border-border' : 'max-h-0'
      }`}>
        <div className="px-6 py-4 flex flex-col gap-4">
          <Link href="/marketplace" className="text-sm font-medium py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
            Marketplace
          </Link>
          <Link href="/dzyn" className="text-sm font-medium py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
            Design Studio
          </Link>
          <Link href="/profile" className="text-sm font-medium py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
            Profile
          </Link>
          <Link href="/dzyn" onClick={() => setMobileMenuOpen(false)}>
            <button className="w-full mt-2 py-3 rounded-lg bg-primary text-white font-medium">
              Start Creating
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}