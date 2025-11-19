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
  /**
   * Called when the model and its meshes are ready. Receives an array of meshes
   * (useful to inject gradient textures or patch shaders later).
   */
  onModelReady?: (meshes: MeshInfo[]) => void;
}

/**
 * ProductModel: Loads the GLB and preserves original PBR materials.
 * It centers the model, ensures shadows are enabled and exposes mesh refs
 * via onModelReady so callers can later inject gradient textures or patch
 * material shaders with onBeforeCompile.
 */
const ProductModel = forwardRef(function ProductModel(
  { productType = "tshirt", scale = 1, onModelReady }: ProductModelProps,
  ref
) {
  const file = productType === "hoodie" ? "/assets/hoodie.glb" : "/assets/tshirt.glb";
  const gltf = useGLTF(file) as any;
  const scene = gltf?.scene;
  const meshesRef = useRef<MeshInfo[]>([]);

  // center + prepare model once loaded
  useEffect(() => {
    if (!scene) return;

    // center model
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);

    meshesRef.current = [];

    // traverse and collect meshes
    scene.traverse((child: any) => {
      if (child.isMesh) {
        const mesh: THREE.Mesh = child as THREE.Mesh;

        // ensure UVs exist — if not, log a warning but still keep the material
        if (!mesh.geometry.attributes.uv) {
          console.warn("ProductModel: mesh has no UVs:", mesh.name);
        }

        // Preserve existing material (do NOT replace it). This keeps base color, normal, AO etc.
        // Ensure shadow reception and casting
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        meshesRef.current.push({ mesh, material: mesh.material });
      }
    });

    // notify parent that model is ready
    onModelReady?.(meshesRef.current);
  }, [scene, onModelReady]);

  // Expose helper methods if parent uses a ref (optional)
  useImperativeHandle(ref, () => ({
    getMeshes: () => meshesRef.current,
  }));

  if (!scene) return null;

  return <primitive object={scene} scale={scale} />;
});

useGLTF.preload("/assets/tshirt.glb");
useGLTF.preload("/assets/hoodie.glb");

export default ProductModel;
