import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import GradientMaterial from "../GradientEditor/gradientShaderMaterial";

interface GradientProductProps {
  productType: string;
  gradient: {
    stops: { id: string; color: string; pos: number }[];
    angle: number;
    center: { x: number; y: number };
  };
}

export default function GradientProductModel({ productType, gradient }: GradientProductProps) {
  const file =
    productType === "hoodie"
      ? "/assets/hoodie.glb"
      : "/assets/tshirt.glb";

  const gltf = useGLTF(file);
  const scene = gltf.scene;

  // store ALL meshes
  const meshRefs = useRef<THREE.Mesh[]>([]);

  // 1️⃣ APPLY SHADER ONCE WHEN MODEL LOADS
  useEffect(() => {
    if (!scene) return;

    // center model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

    meshRefs.current = []; // clear old refs

    scene.traverse((child) => {
      if (child.isMesh) {
        const mesh = child as THREE.Mesh;

        console.log("Applying shader to:", mesh.name);

        // skip meshes without UVs
        if (!mesh.geometry.attributes.uv) {
          console.warn("Mesh has no UVs:", mesh.name);
          return;
        }

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map(() => new GradientMaterial());
        } else {
          mesh.material = new GradientMaterial();
        }

        mesh.material.needsUpdate = true;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        meshRefs.current.push(mesh);
      }
    });
  }, [scene]);

  // 2️⃣ UPDATE SHADER UNIFORMS ON EVERY GRADIENT CHANGE
  useEffect(() => {
    meshRefs.current.forEach((mesh) => {
      const material = mesh.material as any;

      if (!material) return;

      const stops = gradient.stops.slice(0, 8);

      material.stopCount = stops.length;
      material.angle = gradient.angle;
      material.center = new THREE.Vector2(gradient.center.x, gradient.center.y);

      for (let i = 0; i < 8; i++) {
        if (i < stops.length) {
          material.stopColors[i] = new THREE.Color(stops[i].color);
          material.stopPositions[i] = stops[i].pos;
        } else {
          material.stopColors[i] = new THREE.Color(1, 1, 1);
          material.stopPositions[i] = 0;
        }
      }

      material.needsUpdate = true;
    });
  }, [gradient]);

  return <primitive object={scene} scale={1} />;
}

useGLTF.preload("/assets/tshirt.glb");
useGLTF.preload("/assets/hoodie.glb");