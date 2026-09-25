// src/map/Spine.tsx
// Eastern mountain ridge features (The Spine, x: 80-100)

import React, { useMemo } from 'react';
import * as THREE from 'three';

export const Spine: React.FC = () => {
  // Generate jagged crag clusters along the eastern perimeter
  const peaks = useMemo(() => {
    const list: { position: [number, number, number]; scale: [number, number, number]; rotation: [number, number, number] }[] = [];
    const count = 35;

    for (let i = 0; i < count; i++) {
      const zNorm = (i / count) * 100 + (Math.random() * 4 - 2);
      const xNorm = 82 + Math.random() * 14;
      
      const worldX = (xNorm - 50) * 0.3;
      const worldZ = (zNorm - 50) * 0.3;
      const height = 1.8 + Math.random() * 2.2;
      const baseRadius = 0.8 + Math.random() * 0.9;

      list.push({
        position: [worldX, height * 0.5, worldZ],
        scale: [baseRadius, height, baseRadius],
        rotation: [Math.random() * 0.2, Math.random() * Math.PI, Math.random() * 0.2],
      });
    }

    return list;
  }, []);

  return (
    <group name="the-spine-mountains">
      {peaks.map((p, idx) => (
        <mesh
          key={idx}
          position={p.position}
          scale={p.scale}
          rotation={p.rotation}
          castShadow
          receiveShadow
        >
          <coneGeometry args={[1, 1, 5]} />
          <meshStandardMaterial
            color="#5a4535"
            roughness={0.92}
            metalness={0.05}
            flatShading={true}
          />
        </mesh>
      ))}
    </group>
  );
};
