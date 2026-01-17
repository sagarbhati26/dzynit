import React, { useRef } from "react";

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    label?: string;
}

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => inputRef.current?.click()}>
            <div className="relative w-8 h-8 rounded-full shadow-sm ring-1 ring-white/10 group-hover:ring-white/30 transition-all overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: color }}
                />
                <input
                    ref={inputRef}
                    type="color"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
            </div>
            {label && <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{label}</span>}
            <div className="text-xs font-mono text-gray-500 uppercase ml-auto">{color}</div>
        </div>
    );
}
