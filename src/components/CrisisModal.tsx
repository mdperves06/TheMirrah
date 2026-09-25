// src/components/CrisisModal.tsx
// Emergency Red Alert Modal triggered by Ashen Hand crisis event injection

import React from 'react';
import { useMirrahStore } from '../store/useMirrahStore';
import { Flame, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

export const CrisisModal: React.FC = () => {
  const { activeCrisis, resolveCrisisChoice, dismissCrisis } = useMirrahStore();

  if (!activeCrisis) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-xl bg-parchment-950 border-2 border-red-600 rounded-xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.35)] text-parchment-200">
        {/* Rivets */}
        <div className="rivet-tl" />
        <div className="rivet-tr" />
        <div className="rivet-bl" />
        <div className="rivet-br" />

        {/* Alarm Banner */}
        <div className="flex items-center justify-between border-b border-red-500/30 pb-2 mb-3">
          <div className="flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-widest font-bold">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Breaking Dispatch • Plenary Interrupted</span>
          </div>
          <span className="text-[10px] font-mono bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-500/40">
            Ashen Hand Hostile Infiltration
          </span>
        </div>

        {/* Crisis Title & Subtitle */}
        <div className="mb-3">
          <h2 className="text-xl font-serif font-black text-parchment-100 tracking-wide mb-1 leading-tight">
            {activeCrisis.title}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-mono text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{activeCrisis.location}</span>
            </span>
            <span className="text-parchment-500 text-xs">•</span>
            <span className="text-parchment-300 font-serif italic text-xs">
              The room has changed. Delegations are on their feet.
            </span>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="bg-parchment-900/90 p-3.5 rounded-lg border border-red-500/25 text-xs leading-relaxed text-parchment-200 mb-3">
          <p>{activeCrisis.description}</p>
        </div>

        {/* Operational Consequence & Telemetric Shifts */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-[10px] font-mono">
          <div className="p-2 rounded bg-red-950/60 border border-red-500/30 text-red-300">
            <span className="block font-bold">Humanitarian Risk</span>
            <span>Pressure ↑ Surging</span>
          </div>
          <div className="p-2 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300">
            <span className="block font-bold">Concord Urgency</span>
            <span>Demands Truce ↑</span>
          </div>
          <div className="p-2 rounded bg-red-950/60 border border-red-500/30 text-red-300">
            <span className="block font-bold">Talks Stability</span>
            <span>Fragility ↓ At Risk</span>
          </div>
        </div>

        <div className="bg-red-950/30 p-2.5 rounded border border-red-500/20 text-[11px] text-parchment-300 mb-4 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <div>
            <strong className="block font-serif uppercase tracking-wider text-red-400 text-[10px]">
              Direct Diplomatic Impact:
            </strong>
            <span>{activeCrisis.impactText}</span>
          </div>
        </div>

        {/* Decision Dilemma */}
        <div className="mb-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-kharaan-light font-bold mb-2">
            Select Your Delegation's Strategic Response:
          </h3>

          <div className="space-y-2">
            {activeCrisis.choices.map((choice: any) => (
              <button
                key={choice.id}
                onClick={() => resolveCrisisChoice(choice.id)}
                className="w-full text-left p-3 rounded-lg border border-parchment-400/20 bg-parchment-900/60 hover:bg-parchment-900 hover:border-kharaan/60 transition-all text-xs group"
              >
                <div className="font-serif font-bold text-parchment-100 group-hover:text-kharaan-light flex items-center justify-between">
                  <span>{choice.text}</span>
                  <ShieldCheck className="w-4 h-4 text-parchment-500 group-hover:text-kharaan transition-colors" />
                </div>
                <p className="text-[11px] text-parchment-300 mt-1">{choice.description}</p>
                <div className="text-[10px] text-amber-300/80 font-mono mt-1">
                  Expected Outcome: {choice.consequence}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
