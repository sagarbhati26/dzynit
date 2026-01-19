"use client";

import React, { useMemo } from "react";
import { Decal } from "@react-three/drei";
import * as THREE from "three";

interface TextDecalProps {
    text: string;
    font?: string;
    color?: string;
    fontSize?: number; // Relative size factor
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    meshRef: React.RefObject<THREE.Mesh>;
    onPointerDown?: (e: any) => void;
    outlineWidth?: number;
    outlineColor?: string;
}

export function TextDecal({
    text,
    font = "Inter, sans-serif",
    color = "black",
    fontSize = 100,
    position,
    rotation,
    scale,
    meshRef,
    onPointerDown,
    outlineWidth = 0,
    outlineColor = "transparent",
}: TextDecalProps) {
    const texture = useMemo(() => {
        const canvas = document.createElement("canvas");
        // High resolution for crisp text
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Config text
        const size = fontSize * 4; // internal resolution scale
        ctx.font = `bold ${size}px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Outline
        if (outlineWidth > 0) {
            ctx.strokeStyle = outlineColor;
            ctx.lineWidth = outlineWidth * 10;
            ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
        }

        // Fill
        ctx.fillStyle = color;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 16;
        tex.needsUpdate = true;
        return tex;
    }, [text, font, color, fontSize, outlineWidth, outlineColor]);

    if (!texture || !meshRef.current) return null;

    return (
        <Decal
            position={position}
            rotation={rotation as any}
            scale={scale}
            mesh={meshRef}
            onPointerDown={onPointerDown}
        >
            <meshStandardMaterial
                map={texture}
                transparent
                polygonOffset
                polygonOffsetFactor={-1} // Bias slightly to front to prevent Z-fighting, but respect depth
                depthTest={true}
                depthWrite={false}
                roughness={1}
            />
        </Decal>
    );
}
