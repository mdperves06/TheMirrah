// src/map/TheSeam.tsx
// Pulsing contested band across z ≈ 38-50, x 25-70

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const TheSeam: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const borderLineRef = useRef<THREE.LineSegments>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      // Pulsing between 0.35 and 0.65 opacity with red glow
      mat.opacity = 0.42 + Math.sin(t * 2.2) * 0.16;
    }
  });

  // World coordinates:
  // x: 25 to 70 -> width = (70 - 25) * 0.3 = 13.5, center X = (47.5 - 50) * 0.3 = -0.75
  // z: 38 to 50 -> length = (50 - 38) * 0.3 = 3.6, center Z = (44 - 50) * 0.3 = -1.8
  const width = 13.5;
  const length = 3.6;
  const centerX = -0.75;
  const centerZ = -1.8;
  const posY = 0.28; // slightly elevated above base terrain

  return (
    <group position={[centerX, posY, centerZ]}>
      {/* Translucent pulsing red band */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length, 16, 8]} />
        <meshStandardMaterial
          color="#b5402f"
          emissive="#e04e38"
          emissiveIntensity={0.35}
          roughness={0.5}
          transparent={true}
          opacity={0.5}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Flanking tactical dashed boundary markers */}
      <mesh position={[0, 0.02, -length / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, 0.08]} />
        <meshBasicMaterial color="#d95a48" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.02, length / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, 0.08]} />
        <meshBasicMaterial color="#d95a48" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};
