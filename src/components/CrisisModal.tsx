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
        <div className="flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-widest font-bold mb-2 animate-pulse">
          <Flame className="w-4 h-4 text-red-500 animate-bounce" />
          <span>Ashen Hand Hostile Infiltration • Emergency Flashpoint</span>
        </div>

        {/* Crisis Title */}
        <h2 className="text-xl font-serif font-black text-parchment-100 tracking-wide mb-1 leading-tight">
          {activeCrisis.title}
        </h2>

        {/* Location pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/60 border border-red-500/40 text-red-300 font-mono text-xs mb-3">
          <MapPin className="w-3.5 h-3.5 text-red-400" />
          <span>Location: {activeCrisis.location}</span>
        </div>

        {/* Narrative Description */}
        <div className="bg-parchment-900/80 p-3.5 rounded-lg border border-red-500/20 text-xs leading-relaxed text-parchment-200 mb-3">
          <p>{activeCrisis.description}</p>
        </div>

        {/* Operational Consequence */}
        <div className="bg-red-950/40 p-2.5 rounded border border-red-500/30 text-[11px] text-red-300 mb-4 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <div>
            <strong className="block font-serif uppercase tracking-wider text-red-400">
              Immediate Impact on Negotiations:
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
