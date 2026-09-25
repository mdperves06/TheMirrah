// src/modes/AtlasMode.tsx
// Mode 1: The Live 3D Tactical Atlas (Flagship Feature)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Atlas } from '../map/Atlas';
import { useMirrahStore } from '../store/useMirrahStore';
import { MapPin, AlertCircle, FileText, ChevronRight, X } from 'lucide-react';

export const AtlasMode: React.FC = () => {
  const { setSelectedEntityId, setCameraFocus } = useMirrahStore();
  const navigate = useNavigate();

  const [showDispatch, setShowDispatch] = useState(() => {
    return !sessionStorage.getItem('mirrah_dispatch_acknowledged');
  });

  const dismissDispatch = () => {
    sessionStorage.setItem('mirrah_dispatch_acknowledged', '1');
    setShowDispatch(false);
  };

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
      <div className="bg-parchment-950/90 border-b border-kharaan/25 px-4 py-2 flex items-center justify-between text-xs z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-parchment-300">
              The Seam: <strong className="text-red-400">Frontline Standoff (Frozen ~14y)</strong>
            </span>
          </div>

          <button
            onClick={() => setShowDispatch(true)}
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-kharaan/10 hover:bg-kharaan/20 border border-kharaan/30 text-[10px] font-mono text-kharaan transition-colors"
          >
            <FileText className="w-3 h-3" />
            <span>Confidential Cable</span>
          </button>
        </div>

        {/* Quick Location Jumpers */}
        <div className="hidden md:flex items-center gap-1.5">
          <span className="text-[11px] text-parchment-400 font-mono">Pressure Points:</span>
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

      {/* Authored 15-Second Opening Editorial Cable */}
      {showDispatch && (
        <div className="absolute top-14 left-4 z-40 max-w-sm sm:max-w-md bg-parchment-950/95 border-2 border-kharaan/70 rounded-xl p-5 shadow-[0_12px_45px_rgba(0,0,0,0.85)] backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="rivet-tl" />
          <div className="rivet-tr" />
          <div className="rivet-bl" />
          <div className="rivet-br" />

          <div className="flex items-center justify-between border-b border-kharaan/25 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-mono text-[10px] uppercase text-kharaan font-bold tracking-wider">
                Emergency Plenary Dispatch • Read Before Entering
              </span>
            </div>
            <button
              onClick={dismissDispatch}
              className="text-parchment-400 hover:text-parchment-100 p-1 rounded hover:bg-parchment-900 transition-colors"
              title="Acknowledge and Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs font-serif leading-relaxed text-parchment-200 mb-4">
            <p className="font-bold text-sm text-parchment-100 tracking-wide">
              "The Seam has been frozen for fourteen years."
            </p>
            <p className="text-parchment-300">
              The Concord has summoned the delegations back to the table under emergency plenary rules.
            </p>
            <p className="text-parchment-300">
              Trade along the Gold Road is suspended. Suni Wells is encircled under military siege.
            </p>
            <p className="text-amber-300 font-semibold italic">
              And the Ashen Hand is determined that these talks collapse by nightfall.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-kharaan/20">
            <button
              onClick={dismissDispatch}
              className="flex-1 py-2 px-3 bg-kharaan hover:bg-kharaan-light text-ink-dark font-serif font-bold text-xs rounded-lg shadow-gold-glow transition-all text-center"
            >
              Enter the Atlas →
            </button>
            <button
              onClick={() => {
                dismissDispatch();
                navigate('/codex');
              }}
              className="py-2 px-3 bg-parchment-900 hover:bg-parchment-800 text-parchment-200 border border-parchment-400/20 font-serif text-xs rounded-lg transition-all flex items-center gap-1"
            >
              <span>Open Briefing</span>
              <ChevronRight className="w-3.5 h-3.5 text-kharaan" />
            </button>
          </div>
        </div>
      )}

      {/* Main 3D Atlas Canvas */}
      <div className="relative flex-1 w-full h-full">
        <Atlas />
      </div>
    </div>
  );
};

