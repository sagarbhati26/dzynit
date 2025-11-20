// frontend/components/GradientPoints/GradientPoint3D.tsx
import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  index: number;
  worldPos: THREE.Vector3;
  color: string;
  radius: number; // used for visual scale only
  onPointerDown: (index: number, e: any) => void;
  selected?: boolean;
}

/**
 * Small glowing sphere used as a 3D handle on the garment.
 * It's rendered inside the Canvas, so R3F hooks are allowed here.
 */
export default function GradientPoint3D({
  index,
  worldPos,
  color,
  radius,
  onPointerDown,
  selected = false,
}: Props) {
  const ref = useRef<THREE.Mesh | null>(null);

  // make the sphere gently pulse to indicate it's interactive
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = 1 + Math.sin(clock.elapsedTime * 6) * 0.03;
    const baseScale = Math.max(0.02, radius * 0.15);
    ref.current.scale.setScalar(baseScale * t);
  });

  useEffect(() => {
    if (!ref.current) return;
    // mark as handle so we can filter it out during model raycasts
    ref.current.userData.isHandle = true;
  }, []);

  return (
    <mesh
      ref={ref}
      position={[worldPos.x, worldPos.y, worldPos.z]}
      onPointerDown={(e) => {
        // stop event from hitting model behind
        e.stopPropagation();
        // call parent to start dragging this handle
        onPointerDown(index, e);
      }}
      // pointer cursor feedback
      onPointerOver={(e) => {
        document.body.style.cursor = "grab";
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = "default";
      }}
    >
      <sphereGeometry args={[1, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={selected ? new THREE.Color(color) : new THREE.Color(0x000000)}
        emissiveIntensity={selected ? 0.6 : 0.15}
        metalness={0.2}
        roughness={0.5}
        transparent={true}
        opacity={0.95}
      />
    </mesh>
  );
}