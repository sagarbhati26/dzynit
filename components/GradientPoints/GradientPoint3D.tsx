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
    const t = 1 + Math.sin(clock.elapsedTime * 4) * 0.05;
    // Scale handled visually
    ref.current.scale.setScalar(t);
  });

  useEffect(() => {
    if (!ref.current) return;
    // mark as handle so we can filter it out during model raycasts
    ref.current.userData.isHandle = true;
  }, []);

  return (
    <group position={[worldPos.x, worldPos.y, worldPos.z]}>
      {/* Selection Ring */}
      {selected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 0.2, radius * 0.25, 32]} />
          <meshBasicMaterial color="white" opacity={0.8} transparent side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Main Handle Sphere */}
      <mesh
        ref={ref}
        scale={[radius * 0.15, radius * 0.15, radius * 0.15]}
        onPointerDown={(e) => {
          e.stopPropagation();
          onPointerDown(index, e);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 0.8 : 0.4}
          roughness={0.2}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  );
}