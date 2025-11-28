import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type MeshInfo = {
  mesh: THREE.Mesh;
  material: THREE.Material | THREE.Material[];
};

export interface ProductModelProps {
  productType: "tshirt" | "hoodie" | string;
  scale?: number;
  onModelReady?: (meshes: MeshInfo[]) => void;
}

const ProductModel = forwardRef(function ProductModel(
  { productType = "tshirt", scale = 1, onModelReady }: ProductModelProps,
  ref
) {
  const file = productType === "hoodie" ? "/assets/hoodie.glb" : "/assets/tshirt.glb";
  const gltf = useGLTF(file) as any;
  const scene = gltf?.scene;

  const modelGroupRef = useRef<THREE.Group>(null);
  const meshesRef = useRef<MeshInfo[]>([]);

  useEffect(() => {
    if (!scene || !modelGroupRef.current) return;

    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

    meshesRef.current = [];

    scene.traverse((child: any) => {
      if (child.isMesh) {
        const mesh: THREE.Mesh = child;

        if (!mesh.geometry.attributes.uv) {
          console.warn("ProductModel: mesh has no UVs:", mesh.name);
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.raycast = THREE.Mesh.prototype.raycast;  // 🔥 IMPORTANT: ensure raycasting works

        meshesRef.current.push({ mesh, material: mesh.material });
      }
    });

    onModelReady?.(meshesRef.current);
  }, [scene, onModelReady]);

  useImperativeHandle(ref, () => ({
    getMeshes: () => meshesRef.current,
    group: modelGroupRef.current
  }));

  if (!scene) return null;

  return (
    <group ref={modelGroupRef}>
      <primitive object={scene} scale={scale} />
    </group>
  );
});

useGLTF.preload("/assets/tshirt.glb");
useGLTF.preload("/assets/hoodie.glb");

export default ProductModel;