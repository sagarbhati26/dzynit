"use client";

export default function DesignCanvas() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted">Product</div>
          <div className="font-medium">Classic Tee — White</div>
        </div>
        <div className="text-sm text-muted">Canvas: 3000x3600</div>
      </div>

      <div className="relative h-[620px] rounded-2xl border bg-linear-to-b from-white to-[#f7f6f3] flex items-center justify-center">
        <div className="w-[420px] h-[520px] bg-white rounded-md soft-shadow flex items-center justify-center">
          <div className="text-muted">Design Canvas (mockup)</div>
        </div>
      </div>
    </div>
  );
}