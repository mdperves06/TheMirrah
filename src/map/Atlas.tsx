// src/map/Atlas.tsx
// Flagship 3D Atlas root with Three.js Canvas, CameraDirector, StrategicLinks, and LayerControls

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

import { Terrain } from './Terrain';
import { Sea } from './Sea';
import { Spine } from './Spine';
import { Territory } from './Territory';
import { TheSeam } from './TheSeam';
import { Markers } from './Markers';
import { Routes } from './Routes';
import { LayerControls } from './LayerControls';
import { EntityDetailPanel } from './EntityDetailPanel';
import { useMirrahStore } from '../store/useMirrahStore';
import { gridToWorld, getEntityCoordinates, STRATEGIC_CONNECTIONS } from '../data/coordinates';

// Smooth Camera Director that flies to focused entities
const CameraDirector: React.FC<{ controlsRef: React.RefObject<OrbitControlsImpl> }> = ({ controlsRef }) => {
  const { cameraFocus, selectedEntityId } = useMirrahStore();
  const targetPos = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    let focusCoord = cameraFocus;
    if (!focusCoord && selectedEntityId) {
      focusCoord = getEntityCoordinates(selectedEntityId);
    }
    if (focusCoord) {
      const [wx, wy, wz] = gridToWorld(focusCoord.x, focusCoord.z);
      targetPos.current = new THREE.Vector3(wx, wy, wz);
    }
  }, [cameraFocus, selectedEntityId]);

  useFrame((_, delta) => {
    if (targetPos.current && controlsRef.current) {
      // Lerp controls target toward targetPos
      controlsRef.current.target.lerp(targetPos.current, Math.min(1, delta * 3.5));
      if (controlsRef.current.target.distanceTo(targetPos.current) < 0.05) {
        targetPos.current = null;
      }
      controlsRef.current.update();
    }
  });

  return null;
};

// Strategic Links — glowing curved connection beams between selected entities
const StrategicLinks: React.FC = () => {
  const { selectedEntityId, layerToggles } = useMirrahStore();
  if (!layerToggles.showStrategicLinks || !selectedEntityId) return null;

  const conn = STRATEGIC_CONNECTIONS[selectedEntityId];
  if (!conn || conn.connectedEntities.length === 0) return null;

  const originCoords = getEntityCoordinates(selectedEntityId);
  if (!originCoords) return null;
  const [ox, oy, oz] = gridToWorld(originCoords.x, originCoords.z);

  return (
    <group name="strategic-links">
      {conn.connectedEntities.map((targetId) => {
        const targetCoords = getEntityCoordinates(targetId);
        if (!targetCoords) return null;
        const [tx, ty, tz] = gridToWorld(targetCoords.x, targetCoords.z);

        const points = [
          new THREE.Vector3(ox, oy + 0.4, oz),
          new THREE.Vector3((ox + tx) / 2, Math.max(oy, ty) + 1.2, (oz + tz) / 2),
          new THREE.Vector3(tx, ty + 0.4, tz),
        ];
        const curve = new THREE.CatmullRomCurve3(points);
        const curvePoints = curve.getPoints(20).map((p) => [p.x, p.y, p.z] as [number, number, number]);

        return (
          <Line
            key={`${selectedEntityId}-${targetId}`}
            points={curvePoints}
            color="#fbbf24"
            lineWidth={2.2}
            dashed={true}
            dashScale={2}
            dashSize={0.5}
            gapSize={0.3}
            transparent
            opacity={0.8}
          />
        );
      })}
    </group>
  );
};

export const Atlas: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Snap camera facing North (looking from South toward North)
  const handleSnapNorth = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(0, 22, 22);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  // Reset default diplomat isometric eye
  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(-6, 20, 20);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px] overflow-hidden bg-[#14100c]">
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <PerspectiveCamera
          makeDefault
          position={[-6, 20, 20]}
          fov={42}
          near={0.5}
          far={150}
        />

        <OrbitControls
          ref={controlsRef}
          enableDamping={true}
          dampingFactor={0.08}
          minDistance={8}
          maxDistance={48}
          maxPolarAngle={Math.PI / 2.15} // Prevent going below terrain plane
        />

        <CameraDirector controlsRef={controlsRef} />

        {/* Atmosphere & Lighting */}
        <color attach="background" args={['#17120e']} />
        <fog attach="fog" args={['#17120e', 22, 52]} />

        <ambientLight intensity={0.9} color="#fff4e0" />
        <directionalLight
          position={[-15, 30, 15]}
          intensity={1.7}
          color="#fffaed"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[15, 10, -15]} intensity={0.4} color="#78a0c4" />

        {/* 3D Map Entities */}
        <Suspense fallback={null}>
          <Terrain />
          <Sea />
          <Spine />
          <Territory />
          <TheSeam />
          <Markers />
          <Routes />
          <StrategicLinks />
        </Suspense>
      </Canvas>

      {/* Floating 2D UI Overlays */}
      <LayerControls onSnapNorth={handleSnapNorth} onResetView={handleResetView} />
      <EntityDetailPanel />
    </div>
  );
};
