// src/App.tsx
// Shell layout with React Router, top navigation, and global modals

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { StrategicHud } from './components/StrategicHud';
import { QuizModal } from './components/QuizModal';
import { AtlasMode } from './modes/AtlasMode';
import { CodexMode } from './modes/CodexMode';
import { CampaignMode } from './modes/CampaignMode';
import { SanctionsMode } from './modes/SanctionsMode';
import { CoachMode } from './modes/CoachMode';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#14100c] text-parchment-200 flex flex-col font-sans selection:bg-kharaan/30 selection:text-kharaan-light">
        {/* Navigation bar across all modes */}
        <Navbar />

        {/* Global Strategic Crisis Telemetry Bar */}
        <StrategicHud />

        {/* Dynamic Mode Routes */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<AtlasMode />} />
            <Route path="/codex" element={<CodexMode />} />
            <Route path="/campaign" element={<CampaignMode />} />
            <Route path="/sanctions" element={<SanctionsMode />} />
            <Route path="/coach" element={<CoachMode />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Quiz Modal (hooked to "Test Me" buttons) */}
        <QuizModal />
      </div>
    </BrowserRouter>
  );
};

export default App;
