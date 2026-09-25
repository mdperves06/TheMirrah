// src/map/Sea.tsx
// Animated water plane representing the Sundered Sea on the western littoral (x: 0-14)

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Sea: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animate subtle water wave pulse
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = 0.72 + Math.sin(t * 1.5) * 0.06;
      }
    }
  });

  // Sea covers x from 0 to 14 normalized -> world coordinates roughly -15 to -10.8
  // Plane width ~ 4.2 units, length 30 units, centered at X: -12.9, Z: 0
  return (
    <mesh
      ref={meshRef}
      position={[-12.9, -0.05, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[4.4, 30, 16, 32]} />
      <meshStandardMaterial
        color="#2b5971"
        roughness={0.2}
        metalness={0.65}
        transparent={true}
        opacity={0.75}
      />
    </mesh>
  );
};
