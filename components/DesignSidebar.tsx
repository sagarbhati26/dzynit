"use client";

import { useState } from "react";

export default function DesignSidebar() {
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="font-semibold">Tools</h4>
        <p className="text-sm text-muted">Add elements to your design</p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm text-muted">Upload Image</label>
        <input type="file" className="w-full text-sm" />

        <label className="block text-sm text-muted mt-2">Add Text</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something..."
          className="w-full rounded-md p-2 border bg-white"
        />
      </div>
    </div>
  );
}