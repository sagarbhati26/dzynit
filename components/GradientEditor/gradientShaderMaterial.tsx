import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// Vertex shader (normal string)
const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform vec3 stopColors[8];
  uniform float stopPositions[8];
  uniform int stopCount;
  uniform float angle;
  uniform vec2 center;

  varying vec2 vUv;

  void main() {
    float rad = radians(angle);
    vec2 dir = vec2(cos(rad), sin(rad));

    float t = dot(vUv - center, dir) + 0.5;

    vec3 result = stopColors[0];

    for (int i = 1; i < 8; i++) {
      if (i < stopCount && t >= stopPositions[i]) {
        result = stopColors[i];
      }
    }

    gl_FragColor = vec4(result, 1.0);
  }
`;

export const GradientMaterial = shaderMaterial(
  {
    stopColors: Array(8).fill(new THREE.Color(1, 1, 1)),
    stopPositions: Array(8).fill(0),
    stopCount: 0,
    angle: 0,
    center: new THREE.Vector2(0.5, 0.5),
  },
  vertexShader,
  fragmentShader
);

export default GradientMaterial;