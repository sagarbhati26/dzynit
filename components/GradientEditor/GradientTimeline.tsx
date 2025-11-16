import GradientStopHandle from "./GradientStopHandle";

export default function GradientTimeline({ stops, setStops }) {
  // Update the position of a stop (dragging)
  const updateStopPos = (id, pos) => {
    const clamped = Math.min(1, Math.max(0, pos));
    const updated = stops.map((s) =>
      s.id === id ? { ...s, pos: clamped } : s
    );

    // Sort stops by position for correct timeline rendering
    setStops(updated.sort((a, b) => a.pos - b.pos));
  };

  // Update color of a stop
  const updateStopColor = (id, color) => {
    const updated = stops.map((s) =>
      s.id === id ? { ...s, color } : s
    );
    setStops(updated);
  };

  return (
    <div className="relative w-full h-10 bg-gray-300 rounded">
      {stops.map((stop) => (
        <GradientStopHandle
          key={stop.id}
          stop={stop}
          onPosChange={updateStopPos}
          onColorChange={updateStopColor}
        />
      ))}
    </div>
  );
}