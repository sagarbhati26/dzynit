import React from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import PointHandle from "./PointHandle";
import type { ControlPoint } from "./GradientTexture";

export default function PointManager({
  points,
  setPoints,
}: {
  points: ControlPoint[];
  setPoints: React.Dispatch<React.SetStateAction<ControlPoint[]>>;
}) {
  const { camera, raycaster, mouse, scene } = useThree();

  const updatePointDrag = (id: string, clientX: number, clientY: number) => {
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (!intersects.length || !intersects[0].uv) return;

    const { point, uv } = intersects[0];

    setPoints((prev: ControlPoint[]) =>
      prev.map((p: ControlPoint) =>
        p.id === id
          ? {
              ...p,
              worldPos: point.clone(),
              uv: { x: uv.x, y: uv.y },
            }
          : p
      )
    );
  };

  const removePoint = (id: string) => {
    setPoints((prev: ControlPoint[]) => prev.filter((p: ControlPoint) => p.id !== id));
  };

  return (
    <>
      {points.map((p) => (
        <PointHandle
          key={p.id}
          id={p.id}
          color={p.color}
          worldPos={p.worldPos}
          camera={camera}
          onDrag={updatePointDrag}
          onRemove={removePoint}
        />
      ))}
    </>
  );
}