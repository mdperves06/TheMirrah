// src/components/HowToPlayModal.tsx
// Comprehensive briefing popup explaining how to play and master the Mirrah drill

import React from 'react';
import { X, BookOpen, Compass, Swords, ShieldAlert, GraduationCap, CheckCircle2 } from 'lucide-react';

export const HowToPlayModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-parchment-950 border border-kharaan/40 rounded-xl p-6 shadow-2xl text-parchment-200 text-sm">
        {/* Rivets */}
        <div className="rivet-tl" />
        <div className="rivet-tr" />
        <div className="rivet-bl" />
        <div className="rivet-br" />

        <div className="flex justify-between items-center pb-3 border-b border-kharaan/20 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-kharaan animate-pulse" />
            <h2 className="text-lg font-serif font-bold text-parchment-100 uppercase tracking-wide">
              Field Briefing: How to Master The Mirrah
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-parchment-400 hover:text-parchment-100 p-1 rounded hover:bg-parchment-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-sans leading-relaxed text-parchment-300">
          <div className="bg-parchment-900/60 p-3 rounded-lg border border-parchment-400/10">
            <p className="font-serif italic text-parchment-100 text-sm mb-1">
              "The Mirrah is an emergency crisis drill set in the Saverine Expanse. 28 years of deadlock, 14 years since the cancelled referendum, and an environmental threat actor determined to wreck any agreement."
            </p>
            <p className="text-[11px] text-parchment-400">
              Tone: Serious diplomatic strategy meets confidential field atlas and flashcard mastery engine.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase text-kharaan tracking-wider mb-2 font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> 1. The Five Operational Modes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-parchment-900/40 border border-parchment-400/10">
                <strong className="text-kharaan-light block">Atlas Mode (3D):</strong>
                Explore the live 3D terrain, click cities & resources, toggle layers, inspect routes, and observe live control shifts.
              </div>
              <div className="p-2 rounded bg-parchment-900/40 border border-parchment-400/10">
                <strong className="text-emerald-400 block">Codex Mode:</strong>
                Learn the scenario cold: 10 structured briefing tabs, interactive timeline with ★ escalation points, and instant "Test Me" quizzes.
              </div>
              <div className="p-2 rounded bg-parchment-900/40 border border-parchment-400/10">
                <strong className="text-amber-400 block">Campaign Mode:</strong>
                Play as Kharaan, Zahari Front, or Concord through 3 Phases against AI delegates. Overcome Ashen Hand crisis strikes.
              </div>
              <div className="p-2 rounded bg-parchment-900/40 border border-parchment-400/10">
                <strong className="text-orange-400 block">Sanctions Sandbox:</strong>
                Target Categories A–D using Travel Bans, Arms Embargoes, and Asset Freezes with live economic impact charts.
              </div>
              <div className="p-2 rounded bg-parchment-900/40 border border-parchment-400/10 sm:col-span-2">
                <strong className="text-purple-400 block">Delegate Coach:</strong>
                Submit free-write speeches, caucus points, and resolution clauses. Graded on the 5-point Best Delegate rubric with radar analytics.
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase text-kharaan tracking-wider mb-2 font-bold flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5" /> 2. The Three Playable Seats
            </h3>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-kharaan shrink-0 mt-0.5" />
                <span>
                  <strong className="text-kharaan-light">Kingdom of Kharaan:</strong> Defend administration (~62% control) & Veridium energy exports. Defend Suni Wells security, seek sanctions removal, resist sovereign recognition of insurgents.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-zahari-light shrink-0 mt-0.5" />
                <span>
                  <strong className="text-zahari-light">The Zahari Front:</strong> Resistance authority (~38% control). Leverage Duskore rare earth monopoly, demand immediate end to the Suni Wells water siege, and fight for a binding recognition pathway.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-concord-light shrink-0 mt-0.5" />
                <span>
                  <strong className="text-concord-light">The Concord of Crowns:</strong> Supranational mediator. Balance internal divisions (Veridium vs Duskore realms), wield sanctions instruments, and avert all-out war.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-red-950/30 border border-red-500/30 p-2.5 rounded-lg text-[11px]">
            <strong className="text-red-400 block font-mono uppercase">
              Important: The Ashen Hand is NOT a Seat
            </strong>
            The Ashen Hand is an environmental threat engine. It seeks perpetual conflict and periodically detonates crisis events to shatter negotiations. You cannot negotiate with it.
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-kharaan/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-kharaan hover:bg-kharaan-light text-ink-dark font-serif font-bold text-xs rounded transition-all shadow"
          >
            Acknowledge & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};
