import { useRef } from "react";

export default function GradientStopHandle({ stop, onPosChange, onColorChange }) {
  const handleRef = useRef(null);

  // Handle dragging the stop left/right
  const onDrag = (e) => {
    const parent = (handleRef.current?.parentElement)?.getBoundingClientRect();
    if (!parent) return;

    const pos = (e.clientX - parent.left) / parent.width;
    onPosChange(stop.id, pos);
  };

  return (
    <div
      ref={handleRef}
      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-white shadow cursor-pointer"
      style={{
        left: `${stop.pos * 100}%`,
        backgroundColor: stop.color,
      }}
      draggable
      onDrag={onDrag}
    >
      {/* Hidden color picker over the stop */}
      <input
        type="color"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => onColorChange(stop.id, e.target.value)}
      />
    </div>
  );
}