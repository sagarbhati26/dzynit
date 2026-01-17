import React from "react";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    valueDisplay?: string | number;
}

export function Slider({ label, valueDisplay, className, ...props }: SliderProps) {
    return (
        <div className={`space-y-2 ${className || ""}`}>
            {(label || valueDisplay) && (
                <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{label}</span>
                    <span className="font-mono text-white opacity-80">{valueDisplay}</span>
                </div>
            )}
            <div className="relative h-6 flex items-center">
                <input
                    type="range"
                    className="w-full absolute z-10 opacity-0 cursor-pointer h-full"
                    {...props}
                />
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-75"
                        style={{
                            width: `${((Number(props.value) - Number(props.min || 0)) / (Number(props.max || 100) - Number(props.min || 0))) * 100}%`
                        }}
                    />
                </div>
                <div
                    className="absolute h-4 w-4 bg-white rounded-full shadow-lg pointer-events-none transition-all duration-75 border-2 border-indigo-500"
                    style={{
                        left: `${((Number(props.value) - Number(props.min || 0)) / (Number(props.max || 100) - Number(props.min || 0))) * 100}%`,
                        transform: `translateX(-50%)`
                    }}
                />
            </div>
        </div>
    );
}
