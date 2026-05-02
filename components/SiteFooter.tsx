"use client";

import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/dzyn") {
    return null;
  }

  return (
    <footer className="py-8 text-center text-sm text-muted/80 border-t border-transparent/10">
      © {new Date().getFullYear()} Dzyn — Crafted with love for creators
    </footer>
  );
}
