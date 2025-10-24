"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-transparent border-b border-transparent/10 py-4">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-ink/10 flex items-center justify-center text-ink font-bold">
              DZ
            </div>
            <div>
              <div className="font-semibold">DzynIt</div>
              <div className="text-xs text-muted -mt-0.5">
                design & marketplace
              </div>
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/marketplace" className="text-sm text-muted hover:text-ink">
            Marketplace
          </Link>
          <Link href="/dzyn" className="text-sm text-muted hover:text-ink">
            Dzyn
          </Link>
          <Link href="/profile" className="text-sm text-muted hover:text-ink">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}