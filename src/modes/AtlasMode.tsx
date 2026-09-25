// src/modes/AtlasMode.tsx
// Mode 1: The Live 3D Tactical Atlas (Flagship Feature)

import React from 'react';
import { Atlas } from '../map/Atlas';
import { useMirrahStore } from '../store/useMirrahStore';
import { MapPin, AlertCircle, Info } from 'lucide-react';

export const AtlasMode: React.FC = () => {
  const { setSelectedEntityId } = useMirrahStore();

  const quickJumpLocations = [
    { id: 'Beymouth', label: 'Beymouth (Flashpoint)', color: 'text-red-400' },
    { id: 'SuniWells', label: 'Suni Wells (Encircled)', color: 'text-amber-400' },
    { id: 'VaelRidge', label: 'Vael Ridge (Duskore)', color: 'text-emerald-400' },
    { id: 'Adessa', label: 'Adessa (Veridium)', color: 'text-sky-400' },
    { id: 'QasarGate', label: 'Qasar Gate (Seam)', color: 'text-purple-400' },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-53px)] overflow-hidden flex flex-col bg-[#14100c]">
      {/* Tactical Sub-header Bar */}
      <div className="bg-parchment-950/80 border-b border-kharaan/20 px-4 py-2 flex items-center justify-between text-xs z-20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-mono text-parchment-300">
            Current Alert: <strong className="text-red-400">Military Standoff along The Seam</strong>
          </span>
        </div>

        {/* Quick Location Jumpers */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[11px] text-parchment-400 font-mono">Quick Inspect:</span>
          {quickJumpLocations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedEntityId(loc.id)}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-parchment-900/60 hover:bg-parchment-800 text-[10px] font-sans text-parchment-200 border border-parchment-400/20 hover:border-kharaan/50 transition-all"
            >
              <MapPin className={`w-3 h-3 ${loc.color}`} />
              <span>{loc.label}</span>
            </button>
          ))}
        </div>

        <div className="text-[11px] text-parchment-400 font-sans hidden sm:block">
          Left-click drag to rotate • Scroll to zoom • Right-click drag to pan
        </div>
      </div>

      {/* Main 3D Atlas Canvas */}
      <div className="relative flex-1 w-full h-full">
        <Atlas />
      </div>
    </div>
  );
};
