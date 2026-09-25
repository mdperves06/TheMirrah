// src/map/Markers.tsx
// 3D pins, billboards, and interactive entities for Cities, Resources, Ashen Hand sites, and Military FOBs

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useMirrahStore } from '../store/useMirrahStore';
import {
  CITIES_COORDS,
  RESOURCES_COORDS,
  WATER_COORDS,
  ASHEN_HAND_SITES,
  MILITARY_POSITIONS,
  gridToWorld,
} from '../data/coordinates';
import { CITIES, RESOURCES, SANCTION_TARGETS } from '../data/scenario';

interface PinProps {
  id: string;
  name: string;
  x: number;
  z: number;
  color: string;
  category: 'city' | 'resource' | 'water' | 'ashen' | 'military';
  subLabel?: string;
  pulsing?: boolean;
  restricted?: boolean;
  highlightHeat?: boolean;
}

const PinMarker: React.FC<PinProps> = ({
  id,
  name,
  x,
  z,
  color,
  category,
  subLabel,
  pulsing = false,
  restricted = false,
  highlightHeat = false,
}) => {
  const { selectedEntityId, setSelectedEntityId } = useMirrahStore();
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const isSelected = selectedEntityId === id;

  const [worldX, worldY, worldZ] = gridToWorld(x, z);

  useFrame(({ clock }) => {
    if (pulsing && meshRef.current) {
      const s = 1.0 + Math.sin(clock.getElapsedTime() * 4.0) * 0.25;
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group
      position={[worldX, worldY + 0.35, worldZ]}
      ref={meshRef}
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
      {/* 3D Pin geometry */}
      {category === 'city' ? (
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.22, 0.05, 0.6, 6]} />
          <meshStandardMaterial
            color={isSelected ? '#ffffff' : color}
            emissive={highlightHeat ? '#f59e0b' : color}
            emissiveIntensity={isSelected || highlightHeat ? 0.7 : 0.2}
            roughness={0.4}
          />
        </mesh>
      ) : category === 'ashen' ? (
        <mesh position={[0, 0.35, 0]}>
          <octahedronGeometry args={[0.26]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#b91c1c"
            emissiveIntensity={0.8}
            roughness={0.3}
          />
        </mesh>
      ) : category === 'resource' ? (
        <mesh position={[0, 0.3, 0]}>
          <dodecahedronGeometry args={[0.24]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            roughness={0.2}
            metalness={0.7}
          />
        </mesh>
      ) : category === 'water' ? (
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.28, 0.08, 8, 16]} />
          <meshStandardMaterial
            color={restricted ? '#ef4444' : '#38bdf8'}
            emissive={restricted ? '#dc2626' : '#0284c7'}
            emissiveIntensity={restricted ? 0.9 : 0.5}
          />
        </mesh>
      ) : (
        // Military
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </mesh>
      )}

      {/* Target indicator ring when selected or heated */}
      {(isSelected || highlightHeat) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
          <ringGeometry args={[0.4, 0.55, 16]} />
          <meshBasicMaterial
            color={highlightHeat ? '#f59e0b' : '#ffffff'}
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {/* 2D HTML Label / Tooltip */}
      {(hovered || isSelected || category === 'city') && (
        <Html
          position={[0, 0.85, 0]}
          center
          distanceFactor={18}
          zIndexRange={[100, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div
            className={`px-2 py-1 rounded text-[11px] whitespace-nowrap font-medium transition-all ${
              isSelected
                ? 'bg-amber-400 text-ink-dark font-bold shadow-lg scale-110 border border-ink'
                : hovered
                ? 'bg-parchment-950/95 text-parchment-100 border border-kharaan/60 shadow-md scale-105'
                : 'bg-parchment-950/75 text-parchment-200 border border-parchment-400/20 text-[10px]'
            }`}
          >
            <div className="flex items-center gap-1">
              <span>{name}</span>
              {subLabel && (
                <span className="text-[9px] opacity-75 font-mono">({subLabel})</span>
              )}
            </div>
            {restricted && (
              <span className="text-[9px] text-red-400 font-bold block">
                [RESTRICTED / SIEGE]
              </span>
            )}
            {highlightHeat && (
              <span className="text-[9px] text-amber-300 font-mono block">
                [SANCTIONS TARGET]
              </span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};

export const Markers: React.FC = () => {
  const { layerToggles, appliedSanctions, suniWellsStatus, beymouthStatus } = useMirrahStore();

  // Determine sanctioned entity map codes
  const sanctionedMapEntities = React.useMemo(() => {
    const list = new Set<string>();
    Object.keys(appliedSanctions).forEach((code) => {
      const target = SANCTION_TARGETS.find((t) => t.code === code);
      if (target?.mapEntityId) {
        list.add(target.mapEntityId);
      }
    });
    return list;
  }, [appliedSanctions]);

  return (
    <group name="atlas-markers">
      {/* 1. Cities */}
      {CITIES.map((c) => {
        const coords = CITIES_COORDS[c.id] || { x: 50, z: 50 };
        const color =
          c.controller === 'Kharaan'
            ? '#c9a13b'
            : c.controller === 'Zahari Front'
            ? '#3f7d52'
            : '#b5402f';

        const isBombed = c.id === 'Beymouth' && beymouthStatus === 'bombed';
        const isSanctioned = sanctionedMapEntities.has(c.id);

        return (
          <PinMarker
            key={c.id}
            id={c.id}
            name={c.name}
            x={coords.x}
            z={coords.z}
            color={color}
            category="city"
            subLabel={c.role}
            pulsing={isBombed}
            highlightHeat={layerToggles.sanctionsHeat && isSanctioned}
          />
        );
      })}

      {/* 2. Resources */}
      {layerToggles.resources &&
        RESOURCES.map((r) => {
          const coords = RESOURCES_COORDS[r.name.replace(/[^a-zA-Z]/g, '')] ||
            RESOURCES_COORDS[r.id] || { x: r.coordinates.x, z: r.coordinates.z };
          const color =
            r.name.includes('Veridium')
              ? '#38bdf8'
              : r.name.includes('Duskore')
              ? '#a855f7'
              : r.name.includes('Solite')
              ? '#f59e0b'
              : r.name.includes('Cinderstone')
              ? '#fb923c'
              : '#94a3b8';

          const isSanctioned = sanctionedMapEntities.has(r.id);

          return (
            <PinMarker
              key={r.id}
              id={r.id}
              name={r.name}
              x={coords.x}
              z={coords.z}
              color={color}
              category="resource"
              subLabel={r.analog.split('/')[0]}
              highlightHeat={layerToggles.sanctionsHeat && isSanctioned}
            />
          );
        })}

      {/* 3. Water / Oases */}
      {layerToggles.resources &&
        Object.entries(WATER_COORDS).map(([key, data]) => {
          const isRestricted = key === 'SuniWells' && suniWellsStatus === 'restricted';
          const isSanctioned = sanctionedMapEntities.has(key);

          return (
            <PinMarker
              key={key}
              id={key}
              name={data.name}
              x={data.x}
              z={data.z}
              color="#38bdf8"
              category="water"
              restricted={isRestricted}
              pulsing={isRestricted}
              highlightHeat={layerToggles.sanctionsHeat && isSanctioned}
            />
          );
        })}

      {/* 4. Ashen Hand Sites */}
      {layerToggles.ashenHand &&
        Object.entries(ASHEN_HAND_SITES).map(([key, data]) => {
          const isSanctioned = sanctionedMapEntities.has(key);
          return (
            <PinMarker
              key={key}
              id={key}
              name={data.name}
              x={data.x}
              z={data.z}
              color="#ef4444"
              category="ashen"
              subLabel="Threat Cell"
              pulsing={true}
              highlightHeat={layerToggles.sanctionsHeat && isSanctioned}
            />
          );
        })}

      {/* 5. Military Positions */}
      {layerToggles.military && (
        <>
          {MILITARY_POSITIONS.kharaanFOBs.map((fob) => (
            <PinMarker
              key={fob.id}
              id={fob.id}
              name={fob.name}
              x={fob.x}
              z={fob.z}
              color="#c9a13b"
              category="military"
              subLabel="Kharaan FOB"
            />
          ))}
          {MILITARY_POSITIONS.zahariPositions.map((pos) => (
            <PinMarker
              key={pos.id}
              id={pos.id}
              name={pos.name}
              x={pos.x}
              z={pos.z}
              color="#3f7d52"
              category="military"
              subLabel="Zahari Outpost"
            />
          ))}
        </>
      )}
    </group>
  );
};
