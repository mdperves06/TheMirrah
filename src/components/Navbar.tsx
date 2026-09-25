// src/components/Navbar.tsx
// Top navigation bar with mode switching, mastery badge, and crisis indicators

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useMirrahStore } from '../store/useMirrahStore';
import {
  Compass,
  BookOpen,
  Swords,
  ShieldAlert,
  GraduationCap,
  HelpCircle,
  Award,
} from 'lucide-react';
import { HowToPlayModal } from './HowToPlayModal';

export const Navbar: React.FC = () => {
  const { mastery, currentPhase, playerSeat } = useMirrahStore();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const navLinks = [
    { to: '/', label: 'Atlas (3D)', icon: <Compass className="w-4 h-4" /> },
    { to: '/codex', label: 'Briefing Codex', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/campaign', label: 'Campaign Drill', icon: <Swords className="w-4 h-4" /> },
    { to: '/sanctions', label: 'Sanctions Sandbox', icon: <ShieldAlert className="w-4 h-4" /> },
    { to: '/coach', label: 'Delegate Coach', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  const seatLabel =
    playerSeat === 'kharaan'
      ? 'Kharaan'
      : playerSeat === 'zahari'
      ? 'Zahari Front'
      : 'Concord';

  return (
    <>
      <header className="bg-parchment-950/95 border-b border-kharaan/30 backdrop-blur-md px-4 py-2.5 z-40 sticky top-0 flex items-center justify-between text-parchment-100 shadow-md">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-kharaan flex items-center justify-center bg-gradient-to-br from-kharaan-dark to-parchment-950 shadow-gold-glow">
            <span className="font-serif font-black text-kharaan text-base tracking-tighter">M</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-serif font-bold text-parchment-100 tracking-wide uppercase">
                The Mirrah
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-mono bg-kharaan/20 text-kharaan border border-kharaan/30 uppercase">
                Crisis Drill
              </span>
            </div>
            <p className="text-[10px] text-parchment-400 font-sans hidden md:block">
              Contested Lands of the Saverine Expanse • Concord Emergency Session
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-serif font-medium transition-all ${
                  isActive
                    ? 'bg-kharaan text-ink-dark font-bold shadow-md shadow-kharaan/20 scale-[1.02]'
                    : 'text-parchment-300 hover:text-kharaan-light hover:bg-parchment-900/60'
                }`
              }
            >
              {item.icon}
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Status Indicators & Mastery Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Seat & Phase Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-parchment-900/80 border border-parchment-400/20 text-[11px] font-mono">
            <span className="text-parchment-400">Seat:</span>
            <span className="text-kharaan-light font-bold">{seatLabel}</span>
            <span className="text-parchment-600">|</span>
            <span className="text-parchment-400">P{currentPhase}</span>
          </div>

          {/* Mastery % Badge */}
          <NavLink
            to="/coach"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-kharaan-dark/40 to-kharaan/20 border border-kharaan/40 hover:border-kharaan text-parchment-100 transition-all text-xs font-serif"
            title="View Best Delegate Mastery Radar"
          >
            <Award className="w-3.5 h-3.5 text-kharaan" />
            <span className="font-mono font-bold text-kharaan">{mastery.overallPercentage}%</span>
            <span className="hidden md:inline text-[10px] text-parchment-300">Mastery</span>
          </NavLink>

          {/* How to Play Guide Button */}
          <button
            onClick={() => setShowHowToPlay(true)}
            className="p-1.5 text-parchment-400 hover:text-kharaan-light rounded hover:bg-parchment-900 transition-colors"
            title="Drill Briefing & Instructions"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* How to play modal */}
      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
    </>
  );
};
