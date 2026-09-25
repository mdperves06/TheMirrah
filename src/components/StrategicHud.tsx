// src/components/StrategicHud.tsx
// Global Strategic HUD — Real-time persistent crisis telemetry bar

import React, { useState } from 'react';
import { useMirrahStore } from '../store/useMirrahStore';
import {
  ShieldAlert,
  Flame,
  Droplet,
  Compass,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Scale,
} from 'lucide-react';

export const StrategicHud: React.FC = () => {
  const {
    currentPhase,
    kharaanControl,
    zahariControl,
    kharaanTrust,
    zahariTrust,
    suniWellsStatus,
    appliedSanctions,
    playerSeat,
  } = useMirrahStore();

  const [collapsed, setCollapsed] = useState(false);

  const activeSanctionsCount = Object.keys(appliedSanctions).length;

  return (
    <div className="bg-parchment-950/95 border-b border-kharaan/25 px-4 py-1.5 z-30 relative backdrop-blur-md shadow-sm text-xs font-sans">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Phase & Frontline */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-kharaan/15 text-kharaan border border-kharaan/30 font-mono text-[10px] uppercase font-bold">
            <span>P{currentPhase}</span>
            <span className="opacity-60">•</span>
            <span>
              {currentPhase === 1
                ? 'Framework & Ceasefire'
                : currentPhase === 2
                ? 'Territory & Resources'
                : 'Sanctions & Enforcement'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-parchment-300">
            <span className="font-mono text-parchment-400">Frontline:</span>
            <span className="text-kharaan-light font-bold font-mono">Kharaan {kharaanControl}%</span>
            <span className="text-parchment-600">/</span>
            <span className="text-zahari-light font-bold font-mono">Zahari {zahariControl}%</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-[11px] text-red-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>The Seam: Strained Standoff (Frozen ~14y)</span>
          </div>
        </div>

        {/* Right: Telemetry Badges & Collapse Toggle */}
        <div className="flex items-center gap-2">
          {/* Humanitarian water status */}
          <div
            className={`hidden lg:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
              suniWellsStatus === 'restricted'
                ? 'bg-red-950/60 text-red-300 border-red-500/40'
                : 'bg-sky-950/60 text-sky-300 border-sky-500/40'
            }`}
          >
            <Droplet className="w-3 h-3 text-sky-400" />
            <span>Suni Wells: {suniWellsStatus === 'restricted' ? 'Encircled (80k Affected)' : 'Relief Monitored'}</span>
          </div>

          {/* Ashen Hand threat */}
          <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/30 text-[10px] font-mono">
            <Flame className="w-3 h-3 text-red-500" />
            <span>Ashen Threat: 6 Active Cells</span>
          </div>

          {/* Active Sanctions Count */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-parchment-900 text-amber-300 border border-parchment-400/20 text-[10px] font-mono">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>Sanctions: {activeSanctionsCount} Active Mandates</span>
          </div>

          {/* Trust Preview */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-parchment-900 border border-parchment-400/20 text-[10px] font-mono">
            <span className="text-kharaan-light">K:{kharaanTrust}%</span>
            <span className="text-parchment-600">|</span>
            <span className="text-zahari-light">Z:{zahariTrust}%</span>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-0.5 text-parchment-400 hover:text-parchment-100 rounded hover:bg-parchment-900 transition-colors"
            title={collapsed ? 'Expand Strategic HUD' : 'Collapse Strategic HUD'}
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Telemetry Drawer */}
      {!collapsed && (
        <div className="mt-1.5 pt-1.5 border-t border-parchment-400/10 grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-parchment-300 font-sans animate-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-1.5">
            <Scale className="w-3 h-3 text-kharaan" />
            <span>Delegation Seat: <strong className="text-parchment-100 uppercase">{playerSeat}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Historic Fault Line: <strong className="text-parchment-100">Cancelled Referendum (~14y)</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-sky-400" />
            <span>Resource Leverage: <strong className="text-parchment-100">Veridium (North) & Duskore (South)</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Treaty Fragility: <strong className="text-parchment-100">3-Day Breakdown Curse Active</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
