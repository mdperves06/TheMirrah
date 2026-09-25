// src/map/Routes.tsx
// Animated 3D route polylines and humanitarian corridors with flowing dashed lines & click selection

import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ROUTES_POLYLINES, gridToWorld } from '../data/coordinates';
import { useMirrahStore } from '../store/useMirrahStore';

interface AnimatedLineProps {
  id: string;
  name: string;
  waypoints: { x: number; z: number }[];
  color: string;
  dashed?: boolean;
  status?: string;
  type: string;
}

const AnimatedRouteLine: React.FC<AnimatedLineProps> = ({
  id,
  name,
  waypoints,
  color,
  dashed = false,
  status,
  type,
}) => {
  const lineRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const { selectedEntityId, setSelectedEntityId } = useMirrahStore();
  const isSelected = selectedEntityId === id;

  // Convert waypoints to world 3D positions slightly elevated above the terrain
  const points = useMemo(() => {
    const raw = waypoints.map((w) => {
      const [wx, wy, wz] = gridToWorld(w.x, w.z);
      return new THREE.Vector3(wx, wy + 0.18, wz);
    });

    // Smooth spline interpolation
    const curve = new THREE.CatmullRomCurve3(raw, false, 'catmullrom', 0.2);
    return curve.getPoints(raw.length * 8).map((p) => [p.x, p.y, p.z] as [number, number, number]);
  }, [waypoints]);

  // Midpoint for interactive badge
  const midpoint = useMemo(() => {
    if (waypoints.length === 0) return [0, 0, 0] as [number, number, number];
    const midIdx = Math.floor(waypoints.length / 2);
    const midCoord = waypoints[midIdx];
    const [wx, wy, wz] = gridToWorld(midCoord.x, midCoord.z);
    return [wx, wy + 0.5, wz] as [number, number, number];
  }, [waypoints]);

  useFrame(({ clock }) => {
    if (dashed && lineRef.current && lineRef.current.material) {
      lineRef.current.material.dashOffset = -clock.getElapsedTime() * 1.5;
    }
  });

  return (
    <group>
      <Line
        ref={lineRef}
        points={points}
        color={isSelected ? '#ffffff' : hovered ? '#fde047' : color}
        lineWidth={isSelected ? 4 : hovered ? 3.5 : 2.5}
        dashed={dashed}
        dashScale={3}
        dashSize={0.6}
        gapSize={0.3}
        transparent
        opacity={isSelected ? 1.0 : 0.88}
      />

      {/* Interactive Midpoint Click Marker */}
      <mesh
        position={midpoint}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedEntityId(id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial
          color={isSelected ? '#ffffff' : color}
          transparent
          opacity={hovered || isSelected ? 0.9 : 0.4}
        />

        {(hovered || isSelected) && (
          <Html
            position={[0, 0.5, 0]}
            center
            distanceFactor={18}
            style={{ pointerEvents: 'none' }}
          >
            <div
              className={`px-2 py-1 rounded text-[10px] whitespace-nowrap font-medium transition-all ${
                isSelected
                  ? 'bg-amber-400 text-ink-dark font-bold shadow-lg scale-110 border border-ink'
                  : 'bg-parchment-950/95 text-parchment-100 border border-kharaan/50 shadow-md'
              }`}
            >
              <span>{name}</span>
              {status && <span className="ml-1 opacity-75 font-mono text-[9px]">({status})</span>}
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
};

export const Routes: React.FC = () => {
  const { layerToggles } = useMirrahStore();

  return (
    <group name="atlas-routes">
      {/* Trade & Military Routes */}
      {layerToggles.routes &&
        ROUTES_POLYLINES.filter((r) => r.type !== 'humanitarian').map((r) => (
          <AnimatedRouteLine
            key={r.id}
            id={r.id}
            name={r.name}
            type={r.type}
            waypoints={r.waypoints}
            color={r.color}
            dashed={r.dashed || r.type === 'smuggling'}
            status={r.status}
          />
        ))}

      {/* Humanitarian Corridors */}
      {layerToggles.corridors &&
        ROUTES_POLYLINES.filter((r) => r.type === 'humanitarian').map((r) => (
          <AnimatedRouteLine
            key={r.id}
            id={r.id}
            name={r.name}
            type={r.type}
            waypoints={r.waypoints}
            color={r.color}
            dashed={true}
            status={r.status}
          />
        ))}
    </group>
  );
};
