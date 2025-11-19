import React, { useRef, useEffect } from "react";

export default function PointHandle({
  id,
  worldPos,
  camera,
  size = 20,
  color,
  onDrag,
  onRemove,
}) {
  const elRef = useRef<HTMLDivElement | null>(null);

  const updateScreenPosition = () => {
    if (!elRef.current) return;
    const vec = worldPos.clone().project(camera);
    const x = (vec.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-vec.y * 0.5 + 0.5) * window.innerHeight;

    elRef.current.style.transform = `translate3d(${x - size / 2}px, ${
      y - size / 2
    }px, 0)`;
  };

  useEffect(() => {
    updateScreenPosition();
    const handle = () => updateScreenPosition();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [worldPos, camera]);

  return (
    <div
      ref={elRef}
      style={{
        position: "fixed",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        border: "2px solid white",
        cursor: "grab",
        zIndex: 50,
      }}
      draggable
      onDrag={(e) => onDrag(id, e.clientX, e.clientY)}
      onDoubleClick={() => onRemove(id)}
    />
  );
}