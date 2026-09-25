// src/map/Territory.tsx
// Dynamic territory overlay colored live from store state: Kharaan Gold (~62%) vs Zahari Green (~38%)

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMirrahStore } from '../store/useMirrahStore';

export const Territory: React.FC = () => {
  const { kharaanControl, layerToggles } = useMirrahStore();
  const northRef = useRef<THREE.Mesh>(null);
  const southRef = useRef<THREE.Mesh>(null);

  // Smooth lerp values
  const currentSplitRef = useRef<number>(kharaanControl);

  useFrame((_, delta) => {
    // Lerp toward target control split
    currentSplitRef.current = THREE.MathUtils.lerp(
      currentSplitRef.current,
      kharaanControl,
      Math.min(1, delta * 3.0)
    );

    // Dynamic Z division coordinate: 0 (north) to 100 (south)
    // 62% control means division line is at roughly Z = 44 normalized
    const splitNormZ = (currentSplitRef.current / 100) * 70 + 10;
    const worldSplitZ = (splitNormZ - 50) * 0.3;

    if (northRef.current && southRef.current) {
      // North plane covers from Z: -15 to worldSplitZ
      const northLength = Math.max(1, worldSplitZ - (-15));
      const northCenterZ = -15 + northLength / 2;
      northRef.current.scale.set(1, 1, northLength / 15);
      northRef.current.position.z = northCenterZ;

      // South plane covers from worldSplitZ to Z: +15
      const southLength = Math.max(1, 15 - worldSplitZ);
      const southCenterZ = worldSplitZ + southLength / 2;
      southRef.current.scale.set(1, 1, southLength / 15);
      southRef.current.position.z = southCenterZ;
    }
  });

  if (!layerToggles.controlZones) return null;

  return (
    <group position={[0, 0.22, 0]}>
      {/* Kharaan Northern Territory (Gold) */}
      <mesh
        ref={northRef}
        position={[0, 0, -7.5]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[26, 15, 8, 8]} />
        <meshStandardMaterial
          color="#c9a13b"
          roughness={0.6}
          transparent={true}
          opacity={0.28}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Zahari Southern Territory (Green) */}
      <mesh
        ref={southRef}
        position={[0, 0, 7.5]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[26, 15, 8, 8]} />
        <meshStandardMaterial
          color="#3f7d52"
          roughness={0.6}
          transparent={true}
          opacity={0.32}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
