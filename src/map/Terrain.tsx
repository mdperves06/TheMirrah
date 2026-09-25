// src/map/Terrain.tsx
// Procedural low-poly desert basin terrain mesh with Golden Wastes, The Gash, and riverbeds

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { computeTerrainHeight } from '../data/coordinates';

export const Terrain: React.FC = () => {
  // Generate a subdivided plane geometry (100x100 grid mapping to 0-100 coordinates)
  const { geometry, colors } = useMemo(() => {
    const segments = 100;
    const size = 30; // 30 world units across (-15 to +15)
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    geom.rotateX(-Math.PI / 2); // Rotate to lie flat on XZ plane

    const pos = geom.attributes.position;
    const vertexColors: number[] = [];

    const sandColor = new THREE.Color('#dccab0');
    const duneColor = new THREE.Color('#e5d4b5');
    const gashColor = new THREE.Color('#785842');
    const basinColor = new THREE.Color('#cfb895');
    const rockColor = new THREE.Color('#94795e');

    for (let i = 0; i < pos.count; i++) {
      const worldX = pos.getX(i);
      const worldZ = pos.getZ(i);

      // Convert world position (-15 to +15) back to normalized 0-100 grid
      const normX = ((worldX / size) + 0.5) * 100;
      const normZ = ((worldZ / size) + 0.5) * 100;

      // Compute height from coordinates.ts formula
      const h = computeTerrainHeight(normX, normZ);
      pos.setY(i, h);

      // Color computation based on region and height
      let col = sandColor.clone();
      if (normZ < 30) {
        // Golden Wastes (northern dunes)
        col.lerp(duneColor, 0.7);
      } else if (Math.hypot((normX - 28) * 1.5, normZ - 55) < 12) {
        // The Gash (canyon)
        col.lerp(gashColor, 0.85);
      } else if (normX > 75) {
        // Foothills to The Spine
        col.lerp(rockColor, 0.6);
      } else {
        col.lerp(basinColor, 0.4);
      }

      vertexColors.push(col.r, col.g, col.b);
    }

    geom.computeVertexNormals();
    geom.setAttribute('color', new THREE.Float32BufferAttribute(vertexColors, 3));
    return { geometry: geom, colors: vertexColors };
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial
        vertexColors
        roughness={0.88}
        metalness={0.08}
        flatShading={true}
      />
    </mesh>
  );
};
