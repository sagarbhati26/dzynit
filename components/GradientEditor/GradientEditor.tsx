import { useState } from "react";
import GradientTimeline from "./GradientTimeline";

export default function GradientEditor({ onChange }) {
  // Default two stops (red → blue)
  const [stops, setStops] = useState([
    { id: "stop1", color: "#ff0000", pos: 0 },
    { id: "stop2", color: "#0000ff", pos: 1 },
  ]);

  const [angle, setAngle] = useState(0);

  const updateStops = (updated) => {
    setStops(updated);
    onChange({
      stops: updated,
      angle,
    });
  };

  const updateAngle = (value) => {
    setAngle(value);
    onChange({
      stops,
      angle: value,
    });
  };

  return (
    <div className="w-64 p-4 bg-white border-l flex flex-col gap-4">
      <h2 className="text-lg  text-amber-950 font-semibold">Gradient Editor</h2>

      {/* Timeline */}
      <GradientTimeline stops={stops} setStops={updateStops} />

      {/* Angle Slider */}
      <div className="flex flex-col">
        <label className="text-lg text-amber-950">Angle</label>
        <input
          type="range"
          min={0}
          max={360}
          value={angle}
          onChange={(e) => updateAngle(Number(e.target.value))}
        />
        <span className="text-lg text-blue-800">{angle}°</span>
      </div>
    </div>
  );
}