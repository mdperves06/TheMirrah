// src/modes/CodexMode.tsx
// Mode 2: Structured Scenario Briefing Codex + Interactive History Timeline

import React, { useState } from 'react';
import {
  SCENARIO_META,
  HISTORY_EVENTS,
  PARTIES,
  ASHEN_HAND,
  GEOGRAPHY_FEATURES,
  CITIES,
  RESOURCES,
  ROUTES,
  HUMANITARIAN_CORRIDORS,
  CURRENT_CRISES,
  SANCTION_TARGETS,
} from '../data/scenario';
import { QUIZ_QUESTIONS, QuizTopic } from '../data/quizzes';
import { useMirrahStore } from '../store/useMirrahStore';
import {
  BookOpen,
  History,
  Users,
  Flame,
  Globe,
  Pickaxe,
  Route,
  AlertTriangle,
  Award,
  Star,
  ChevronRight,
  Shield,
  Search,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { getEntityCoordinates } from '../data/coordinates';

type CodexTab =
  | 'overview'
  | 'history'
  | 'parties'
  | 'ashenHand'
  | 'geography'
  | 'resources'
  | 'routes'
  | 'crises'
  | 'sanctions';

export const CodexMode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CodexTab>('overview');
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState(HISTORY_EVENTS[HISTORY_EVENTS.length - 1]);
  const [searchQuery, setSearchQuery] = useState('');
  const { openQuiz, setSelectedEntityId, setCameraFocus, diplomaticLens, setDiplomaticLens } = useMirrahStore();
  const navigate = useNavigate();

  const handleLocateOnAtlas = (entityId?: string) => {
    if (!entityId) return;
    const coords = getEntityCoordinates(entityId);
    setSelectedEntityId(entityId);
    if (coords) {
      setCameraFocus({ x: coords.x, z: coords.z });
    }
    navigate('/');
  };

  const tabs: { key: CodexTab; label: string; icon: React.ReactNode; topic: QuizTopic }[] = [
    { key: 'overview', label: '1. Overview', icon: <BookOpen className="w-3.5 h-3.5" />, topic: 'parties' },
    { key: 'history', label: '2. History & Timeline', icon: <History className="w-3.5 h-3.5" />, topic: 'history' },
    { key: 'parties', label: '3. The Three Parties', icon: <Users className="w-3.5 h-3.5" />, topic: 'parties' },
    { key: 'ashenHand', label: '4. The Ashen Hand', icon: <Flame className="w-3.5 h-3.5" />, topic: 'ashenHand' },
    { key: 'geography', label: '5. Geography & Cities', icon: <Globe className="w-3.5 h-3.5" />, topic: 'geography' },
    { key: 'resources', label: '6. Strategic Resources', icon: <Pickaxe className="w-3.5 h-3.5" />, topic: 'resources' },
    { key: 'routes', label: '7. Routes & Corridors', icon: <Route className="w-3.5 h-3.5" />, topic: 'routes' },
    { key: 'crises', label: '8. Current Crises & Stakes', icon: <AlertTriangle className="w-3.5 h-3.5" />, topic: 'crisis' },
    { key: 'sanctions', label: '9. Sanctions Target List', icon: <Shield className="w-3.5 h-3.5" />, topic: 'sanctions' },
  ];

  // Trigger test for a specific topic or item
  const handleTestMe = (topic: QuizTopic, entityId?: string) => {
    const questions = QUIZ_QUESTIONS.filter(
      (q) => (entityId && q.linkedEntityId === entityId) || q.topic === topic
    );
    if (questions.length > 0) {
      const q = questions[Math.floor(Math.random() * questions.length)];
      openQuiz(q);
    } else {
      openQuiz(QUIZ_QUESTIONS[0]);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-53px)] bg-[#14100c] text-parchment-200 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-parchment-950/90 border-r border-kharaan/25 p-4 flex flex-col justify-between shrink-0">
        <div>
          <div className="mb-4">
            <h2 className="text-base font-serif font-bold text-parchment-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-kharaan" />
              <span>Briefing Dossier</span>
            </h2>
            <p className="text-[11px] text-parchment-400 mt-0.5">
              Confidential archival intelligence for accredited delegates.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="w-3.5 h-3.5 text-parchment-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search briefing facts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-parchment-900/80 border border-parchment-400/20 rounded-md py-1.5 pl-8 pr-3 text-xs text-parchment-100 placeholder:text-parchment-500 focus:outline-none focus:border-kharaan"
            />
          </div>

          {/* Tab Navigation */}
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-serif transition-all ${
                  activeTab === t.key
                    ? 'bg-kharaan text-ink-dark font-bold shadow-md'
                    : 'text-parchment-300 hover:text-parchment-100 hover:bg-parchment-900/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </div>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </nav>
        </div>

        {/* Global Test Me Button */}
        <div className="pt-4 border-t border-kharaan/20 mt-4">
          <button
            onClick={() => handleTestMe(tabs.find((t) => t.key === activeTab)?.topic || 'history')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-kharaan-dark to-kharaan hover:from-kharaan hover:to-kharaan-light text-ink-dark font-serif font-bold text-xs rounded-lg shadow-gold-glow transition-all"
          >
            <Award className="w-4 h-4" />
            <span>Test My Scenario Mastery</span>
          </button>
        </div>
      </aside>

      {/* Main Document Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-5xl mx-auto space-y-6">
        {/* Diplomatic Lens Switcher */}
        <div className="p-4 rounded-xl bg-parchment-950/85 border border-kharaan/30 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-md">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-kharaan font-bold block mb-1">
              Briefing Lens (Strategic Vantage):
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {(['kharaan', 'zahari', 'concord'] as const).map((lens) => (
                <button
                  key={lens}
                  onClick={() => setDiplomaticLens(lens)}
                  className={`px-3 py-1 rounded-md text-xs font-serif capitalize font-bold transition-all border ${
                    diplomaticLens === lens
                      ? lens === 'kharaan'
                        ? 'bg-kharaan text-ink-dark border-kharaan shadow'
                        : lens === 'zahari'
                        ? 'bg-zahari text-parchment-100 border-zahari shadow'
                        : 'bg-concord text-parchment-100 border-concord shadow'
                      : 'bg-parchment-900 text-parchment-400 border-parchment-400/20 hover:text-parchment-200'
                  }`}
                >
                  {lens === 'kharaan' ? 'Kharaan Lens' : lens === 'zahari' ? 'Zahari Lens' : 'Concord Lens'}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-parchment-300 md:max-w-md bg-parchment-900/70 p-2.5 rounded-lg border border-parchment-400/15 italic leading-snug">
            {diplomaticLens === 'kharaan' && (
              <span>"Sovereignty & Energy: Prioritizing Solmaran successor rights, full Veridium export throughput, and security cordon around Suni Wells."</span>
            )}
            {diplomaticLens === 'zahari' && (
              <span>"Self-Determination & Survival: Anchoring on the cancelled referendum (~14y), Duskore rare earth leverage, and water relief at Suni Wells."</span>
            )}
            {diplomaticLens === 'concord' && (
              <span>"Multilateral Balance: Navigating internal kingdom divisions, enforcing sanctions quotas, and neutralizing the Ashen Hand threat."</span>
            )}
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="parchment-panel p-6 rounded-xl document-frame relative">
              <div className="rivet-tl" />
              <div className="rivet-tr" />
              <div className="rivet-bl" />
              <div className="rivet-br" />

              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-kharaan">
                    CONFIDENTIAL DISPATCH • CONCORD SECURITY PLENARY
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif font-black text-parchment-100 mt-1">
                    {SCENARIO_META.title}
                  </h2>
                  <p className="text-sm font-serif italic text-parchment-300">
                    {SCENARIO_META.subtitle}
                  </p>
                </div>
                <button
                  onClick={() => handleTestMe('history')}
                  className="px-3 py-1 bg-parchment-900 hover:bg-kharaan hover:text-ink-dark text-parchment-200 border border-kharaan/40 rounded text-xs font-serif flex items-center gap-1.5 transition-all"
                >
                  <Award className="w-3.5 h-3.5 text-kharaan" />
                  <span>Test Me</span>
                </button>
              </div>

              <div className="bg-parchment-900/60 p-4 rounded-lg border border-parchment-400/20 text-xs leading-relaxed space-y-2 mb-4">
                <p>
                  <strong>Entry Point:</strong> {SCENARIO_META.entryPoint}
                </p>
                <p>
                  <strong>Territorial Administration:</strong> Kingdom of Kharaan controls ~{SCENARIO_META.initialControl.kharaan}% (northern plains, Veridium extraction hubs, and Gold Road corridor). The Zahari Front controls ~{SCENARIO_META.initialControl.zahari}% (southern desert and Duskore deposits at Vael Ridge). The central frozen front line—<strong>The Seam</strong>—remains contested.
                </p>
                <p>
                  <strong>Threat Architecture:</strong> The Ashen Hand is an environmental threat actor, NOT a negotiating party. Its sole objective is the perpetuation of conflict.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-kharaan/10 border border-kharaan/30">
                  <div className="text-xs font-serif font-bold text-kharaan-light">Kingdom of Kharaan</div>
                  <div className="text-[11px] text-parchment-300 mt-1">Sovereign State Actor • Solmaran Successor Claim • Veridium & Solite Monopoly.</div>
                </div>
                <div className="p-3 rounded-lg bg-zahari/10 border border-zahari/30">
                  <div className="text-xs font-serif font-bold text-zahari-light">The Zahari Front</div>
                  <div className="text-[11px] text-parchment-300 mt-1">Indigenous Resistance • Cancelled Referendum Grievance • Duskore Bargaining Chip.</div>
                </div>
                <div className="p-3 rounded-lg bg-concord/20 border border-concord/40">
                  <div className="text-xs font-serif font-bold text-concord-light">Concord of Crowns</div>
                  <div className="text-[11px] text-parchment-300 mt-1">Multilateral Mediator • Sanctions & Recognition Authority • Internally Divided.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HISTORY TIMELINE (Interactive Horizontal Scrub) */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="parchment-panel p-6 rounded-xl document-frame relative">
              <div className="rivet-tl" />
              <div className="rivet-tr" />
              <div className="rivet-bl" />
              <div className="rivet-br" />

              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-parchment-100">
                    Chronology of the Expanse (~150 Years of Conflict)
                  </h3>
                  <p className="text-xs text-parchment-400">
                    Scrub through the chronological record. Key ★ escalation flashpoints are highlighted.
                  </p>
                </div>
                <button
                  onClick={() => handleTestMe('history')}
                  className="px-3 py-1 bg-parchment-900 hover:bg-kharaan hover:text-ink-dark text-parchment-200 border border-kharaan/40 rounded text-xs font-serif flex items-center gap-1.5 transition-all"
                >
                  <Award className="w-3.5 h-3.5 text-kharaan" />
                  <span>Test History</span>
                </button>
              </div>

              {/* Horizontal Timeline Scrubber */}
              <div className="overflow-x-auto pb-4 pt-2">
                <div className="flex items-center min-w-[850px] relative py-4 px-2">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-kharaan/30 -translate-y-1/2" />

                  {HISTORY_EVENTS.map((ev) => {
                    const isSelected = selectedTimelineEvent.id === ev.id;
                    return (
                      <button
                        key={ev.id}
                        onClick={() => setSelectedTimelineEvent(ev)}
                        className={`relative z-10 flex flex-col items-center flex-1 transition-all group ${
                          isSelected ? 'scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span className="text-[10px] font-mono text-parchment-400 mb-1 group-hover:text-kharaan-light">
                          {ev.period}
                        </span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                            isSelected
                              ? 'bg-kharaan border-ink text-ink font-bold shadow-[0_0_12px_#c9a13b]'
                              : ev.isEscalation
                              ? 'bg-red-950 border-red-500 text-red-300'
                              : 'bg-parchment-900 border-parchment-400 text-parchment-300'
                          }`}
                        >
                          {ev.isEscalation ? <Star className="w-3 h-3 fill-red-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-parchment-400" />}
                        </div>
                        <span className="text-[9px] font-serif text-center mt-1.5 line-clamp-1 max-w-[80px]">
                          {ev.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Active Event Card */}
              <div className="mt-4 p-5 rounded-lg bg-parchment-900/90 border border-kharaan/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-mono text-xs text-kharaan font-bold mr-2">
                      [{selectedTimelineEvent.period}]
                    </span>
                    {selectedTimelineEvent.isEscalation && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-400 border border-red-500/40 uppercase">
                        ★ Critical Escalation Flashpoint
                      </span>
                    )}
                    <h4 className="text-lg font-serif font-bold text-parchment-100 mt-1">
                      {selectedTimelineEvent.title}
                    </h4>
                  </div>
                  {selectedTimelineEvent.locationKey && (
                    <button
                      onClick={() => handleLocateOnAtlas(selectedTimelineEvent.locationKey)}
                      className="text-xs text-kharaan-light hover:text-parchment-100 font-mono flex items-center gap-1.5 bg-parchment-900/90 hover:bg-parchment-800 px-2.5 py-1 rounded border border-kharaan/40 shadow-sm transition-all"
                    >
                      <Globe className="w-3.5 h-3.5 text-kharaan" />
                      <span>Fly to {selectedTimelineEvent.locationKey} on Atlas →</span>
                    </button>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-parchment-200 mb-3">
                  {selectedTimelineEvent.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-parchment-400">
                  <span>Parties involved:</span>
                  <span className="text-parchment-200 font-medium">
                    {selectedTimelineEvent.partiesInvolved.join(' • ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PARTIES */}
        {activeTab === 'parties' && (
          <div className="space-y-6">
            {(['kharaan', 'zahari', 'concord'] as const).map((seatKey) => {
              const party = PARTIES[seatKey];
              return (
                <div
                  key={party.id}
                  className="parchment-panel p-6 rounded-xl document-frame relative"
                >
                  <div className="rivet-tl" />
                  <div className="rivet-tr" />
                  <div className="rivet-bl" />
                  <div className="rivet-br" />

                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-kharaan">
                        {party.type} • Capital: {party.capital}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-parchment-100 mt-0.5">
                        {party.name}
                      </h3>
                      <p className="text-xs text-parchment-300 italic mt-0.5">
                        Administers {party.controlShare}
                      </p>
                    </div>
                    <button
                      onClick={() => handleTestMe('parties', party.id)}
                      className="px-2.5 py-1 bg-parchment-900 hover:bg-kharaan hover:text-ink-dark text-parchment-200 border border-kharaan/40 rounded text-xs font-serif flex items-center gap-1 transition-all"
                    >
                      <Award className="w-3.5 h-3.5 text-kharaan" />
                      <span>Test Party</span>
                    </button>
                  </div>

                  <p className="text-xs leading-relaxed text-parchment-300 mb-4">
                    {party.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-4">
                    <div className="p-3 rounded bg-parchment-900/60 border border-parchment-400/10">
                      <strong className="text-kharaan-light font-mono uppercase block text-[10px] mb-1">
                        Sovereign Claim:
                      </strong>
                      <p className="text-parchment-200">{party.claim}</p>
                    </div>
                    <div className="p-3 rounded bg-parchment-900/60 border border-parchment-400/10">
                      <strong className="text-sky-300 font-mono uppercase block text-[10px] mb-1">
                        Key Economic Asset ({party.keyAsset}):
                      </strong>
                      <p className="text-parchment-200">{party.keyAssetDescription}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                    <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/20">
                      <strong className="text-emerald-400 font-mono uppercase block mb-1">Core Leverage</strong>
                      <ul className="list-disc list-inside space-y-1 text-parchment-300">
                        {party.leverage.map((l, i) => (
                          <li key={i}>{l}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/20">
                      <strong className="text-amber-400 font-mono uppercase block mb-1">Vulnerabilities</strong>
                      <ul className="list-disc list-inside space-y-1 text-parchment-300">
                        {party.vulnerabilities.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-2.5 rounded bg-red-950/30 border border-red-500/20">
                      <strong className="text-red-400 font-mono uppercase block mb-1">Red Lines</strong>
                      <ul className="list-disc list-inside space-y-1 text-parchment-300">
                        {party.redLines.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: THE ASHEN HAND */}
        {activeTab === 'ashenHand' && (
          <div className="space-y-6">
            <div className="parchment-panel p-6 rounded-xl document-frame relative border-red-900/50">
              <div className="rivet-tl" />
              <div className="rivet-tr" />
              <div className="rivet-bl" />
              <div className="rivet-br" />

              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-red-400">
                    TRANSNATIONAL THREAT PROFILE • EXTREMIST NON-STATE ACTOR
                  </span>
                  <h3 className="text-2xl font-serif font-black text-parchment-100 mt-0.5">
                    {ASHEN_HAND.name}
                  </h3>
                  <p className="text-xs text-parchment-400 mt-0.5">
                    Origin: {ASHEN_HAND.origin}
                  </p>
                </div>
                <button
                  onClick={() => handleTestMe('ashenHand')}
                  className="px-2.5 py-1 bg-parchment-900 hover:bg-kharaan hover:text-ink-dark text-parchment-200 border border-kharaan/40 rounded text-xs font-serif flex items-center gap-1 transition-all"
                >
                  <Award className="w-3.5 h-3.5 text-kharaan" />
                  <span>Test Ashen Hand</span>
                </button>
              </div>

              <div className="bg-red-950/40 border border-red-500/30 p-4 rounded-lg text-xs mb-4">
                <strong className="text-red-400 font-mono uppercase block mb-1">
                  Strategic Objective: {ASHEN_HAND.objective}
                </strong>
                <p className="text-parchment-200">
                  The Ashen Hand opposes any ceasefire, diplomatic normalization, or humanitarian corridor. It targets any agreement.
                </p>
              </div>

              <div className="space-y-3 mb-4 text-xs">
                <h4 className="font-mono text-kharaan-light uppercase text-[11px] font-bold">
                  Tactical Operational Methods:
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-parchment-300">
                  {ASHEN_HAND.methods.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-parchment-900/60 border border-parchment-400/20 text-xs">
                <strong className="text-amber-300 font-mono uppercase block text-[10px] mb-1">
                  Crucial Diplomatic Reality:
                </strong>
                <p className="text-parchment-200 italic leading-relaxed">
                  "{ASHEN_HAND.keyFact}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GEOGRAPHY & CITIES */}
        {activeTab === 'geography' && (
          <div className="space-y-6">
            <div className="parchment-panel p-6 rounded-xl document-frame relative">
              <div className="rivet-tl" />
              <div className="rivet-tr" />
              <div className="rivet-bl" />
              <div className="rivet-br" />

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-serif font-bold text-parchment-100">
                  Major Cities & Strategic Garrisons
                </h3>
                <button
                  onClick={() => handleTestMe('geography')}
                  className="px-2.5 py-1 bg-parchment-900 hover:bg-kharaan hover:text-ink-dark text-parchment-200 border border-kharaan/40 rounded text-xs font-serif flex items-center gap-1 transition-all"
                >
                  <Award className="w-3.5 h-3.5 text-kharaan" />
                  <span>Test Geography</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-kharaan/30 text-[10px] font-mono uppercase text-kharaan-light">
                      <th className="py-2 px-3">City Name</th>
                      <th className="py-2 px-3">Controller</th>
                      <th className="py-2 px-3">Strategic Role</th>
                      <th className="py-2 px-3">Why it Matters</th>
                      <th className="py-2 px-3 text-right">Atlas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-parchment-400/10">
                    {CITIES.map((c) => (
                      <tr key={c.id} className="hover:bg-parchment-900/40">
                        <td className="py-2.5 px-3 font-serif font-bold text-parchment-100">
                          {c.name}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                              c.controller === 'Kharaan'
                                ? 'bg-kharaan/10 text-kharaan-light border-kharaan/30'
                                : c.controller === 'Zahari Front'
                                ? 'bg-zahari/10 text-zahari-light border-zahari/30'
                                : 'bg-seam/20 text-seam-light border-seam/30'
                            }`}
                          >
                            {c.controller}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-sans text-parchment-300">{c.role}</td>
                        <td className="py-2.5 px-3 font-sans text-parchment-400 max-w-xs truncate">
                          {c.strategicSignificance}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleLocateOnAtlas(c.id)}
                            className="text-[10px] text-kharaan hover:text-parchment-100 font-mono flex items-center justify-end gap-1 ml-auto bg-parchment-900/60 px-2 py-0.5 rounded border border-kharaan/20 hover:border-kharaan transition-all"
                          >
                            <Globe className="w-3 h-3 text-kharaan" />
                            <span>Fly to Atlas →</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: RESOURCES */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="parchment-panel p-6 rounded-xl document-frame relative">
              <div className="rivet-tl" />
              <div className="rivet-tr" />
              <div className="rivet-bl" />
              <div className="rivet-br" />

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-serif font-bold text-parchment-100">
                  Strategic Resource Index & Real-World Analogs
                </h3>
                <button
                  onClick={() => handleTestMe('resources')}
                  className="px-2.5 py-1 bg-parchment-900 hover:bg-kharaan hover:text-ink-dark text-parchment-200 border border-kharaan/40 rounded text-xs font-serif flex items-center gap-1 transition-all"
                >
                  <Award className="w-3.5 h-3.5 text-kharaan" />
                  <span>Test Resources</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RESOURCES.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-lg bg-parchment-900/70 border border-parchment-400/20 text-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] font-mono text-sky-400 uppercase">
                            Analog: {res.analog}
                          </span>
                          <h4 className="text-base font-serif font-bold text-parchment-100">
                            {res.name}
                          </h4>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-parchment-950 text-parchment-300 border border-parchment-400/20">
                          {res.control}
                        </span>
                      </div>
                      <p className="text-parchment-300 mb-2 leading-relaxed">
                        {res.importance}
                      </p>
                      <div className="p-2 rounded bg-parchment-950/60 border border-parchment-400/10 text-[11px] text-parchment-400 mb-2">
                        <strong>Diplomatic Leverage:</strong> {res.economicDetail}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-parchment-400/15">
                      <button
                        onClick={() => handleLocateOnAtlas(res.name.replace(/[^a-zA-Z]/g, ''))}
                        className="text-[10px] text-kharaan-light hover:text-parchment-100 font-mono flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3 text-kharaan" />
                        <span>Fly to Atlas →</span>
                      </button>
                      <button
                        onClick={() => handleTestMe('resources', res.id)}
                        className="text-[10px] text-parchment-400 hover:text-kharaan font-serif"
                      >
                        Test this resource
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ROUTES & CORRIDORS */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="parchment-panel p-6 rounded-xl document-frame relative">
              <div className="rivet-tl" />
              <div className="rivet-tr" />
              <div className="rivet-bl" />
              <div className="rivet-br" />

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-serif font-bold text-parchment-100">
                  Humanitarian Corridors & Transport Arteries
                </h3>
                <button
                  onClick={() => handleTestMe('routes')}
                  className="px-2.5 py-1 bg-parchment-900 hover:bg-kharaan hover:text-ink-dark text-parchment-200 border border-kharaan/40 rounded text-xs font-serif flex items-center gap-1 transition-all"
                >
                  <Award className="w-3.5 h-3.5 text-kharaan" />
                  <span>Test Routes</span>
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-kharaan-light font-bold">
                  The Four Humanitarian Corridors (Status & Vulnerability):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {HUMANITARIAN_CORRIDORS.map((cor) => (
                    <div
                      key={cor.id}
                      className="p-3.5 rounded-lg bg-parchment-900/60 border border-parchment-400/20 text-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <h5 className="font-serif font-bold text-parchment-100">{cor.name}</h5>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-parchment-950 text-amber-300 border border-amber-500/30">
                            {cor.statusLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-parchment-300 mb-2">{cor.description}</p>
                        <div className="text-[10px] text-red-300 bg-red-950/30 p-2 rounded border border-red-500/20 mb-2">
                          <strong>Vulnerability:</strong> {cor.vulnerability}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-parchment-400/10 flex justify-between items-center">
                        <button
                          onClick={() => handleLocateOnAtlas(cor.name.replace(/\s+/g, ''))}
                          className="text-[10px] text-purple-300 hover:text-parchment-100 font-mono flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3 text-purple-400" />
                          <span>Fly to Atlas →</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-kharaan-light font-bold mb-2">
                  Trade & Military Trunk Lines:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ROUTES.map((rt) => (
                    <div
                      key={rt.id}
                      className="p-3 rounded-lg bg-parchment-900/40 border border-parchment-400/10 text-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <strong className="text-parchment-100 font-serif">{rt.name}</strong>
                          <span className="text-[10px] font-mono text-kharaan">{rt.controller}</span>
                        </div>
                        <p className="text-[11px] text-parchment-400 font-mono mb-1">{rt.path}</p>
                        <p className="text-[11px] text-parchment-300 mb-2">{rt.description}</p>
                      </div>
                      <div className="pt-2 border-t border-parchment-400/10 flex justify-between items-center">
                        <button
                          onClick={() => handleLocateOnAtlas(rt.name.replace(/\s+/g, ''))}
                          className="text-[10px] text-emerald-300 hover:text-parchment-100 font-mono flex items-center gap-1"
                        >
                          <Globe className="w-3 h-3 text-emerald-400" />
                          <span>Fly to Atlas →</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: CRISES & STAKES */}
        {activeTab === 'crises' && (
          <div className="space-y-6">
            <div className="parchment-panel p-6 rounded-xl document-frame relative">
              <div className="rivet-tl" />
              <div className="rivet-tr" />
              <div className="rivet-bl" />
              <div className="rivet-br" />

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-serif font-bold text-parchment-100">
                  Simultaneous Crises & What Is At Stake
                </h3>
                <button
                  onClick={() => handleTestMe('crisis')}
                  className="px-2.5 py-1 bg-parchment-900 hover:bg-kharaan hover:text-ink-dark text-parchment-200 border border-kharaan/40 rounded text-xs font-serif flex items-center gap-1 transition-all"
                >
                  <Award className="w-3.5 h-3.5 text-kharaan" />
                  <span>Test Crisis</span>
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {CURRENT_CRISES.map((c, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-lg bg-parchment-900/70 border border-parchment-400/20 text-xs"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-serif font-bold text-parchment-100">{c.title}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30">
                        {c.severity} Severity
                      </span>
                    </div>
                    <p className="text-[11px] text-parchment-300">{c.description}</p>
                  </div>
                ))}
              </div>

              <h4 className="text-xs font-mono uppercase tracking-wider text-kharaan-light font-bold mb-3">
                Outcomes at Stake per Party (Drive Win/Loss Conditions):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {(['kharaan', 'zahari', 'concord'] as const).map((seat) => {
                  const p = PARTIES[seat];
                  return (
                    <div
                      key={p.id}
                      className="p-3 rounded-lg bg-parchment-900/60 border border-parchment-400/20"
                    >
                      <h5 className="font-serif font-bold text-parchment-100 mb-2">{p.name}</h5>
                      <div className="space-y-2 text-[11px]">
                        <div className="bg-emerald-950/40 p-2 rounded border border-emerald-500/20">
                          <strong className="text-emerald-400 block font-mono text-[9px] uppercase">
                            If Talks Succeed:
                          </strong>
                          <span className="text-parchment-300">{p.objectives.talksSucceed}</span>
                        </div>
                        <div className="bg-red-950/40 p-2 rounded border border-red-500/20">
                          <strong className="text-red-400 block font-mono text-[9px] uppercase">
                            If Talks Collapse:
                          </strong>
                          <span className="text-parchment-300">{p.objectives.talksCollapse}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: SANCTIONS LIST */}
        {activeTab === 'sanctions' && (
          <div className="space-y-6">
            <div className="parchment-panel p-6 rounded-xl document-frame relative">
              <div className="rivet-tl" />
              <div className="rivet-tr" />
              <div className="rivet-bl" />
              <div className="rivet-br" />

              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-parchment-100">
                    Concord Emergency Sanctions Target List (Categories A–D)
                  </h3>
                  <p className="text-xs text-parchment-400">
                    Detailed designations subject to Travel Bans, Arms Embargoes, and Assets Freezes.
                  </p>
                </div>
                <button
                  onClick={() => handleTestMe('sanctions')}
                  className="px-2.5 py-1 bg-parchment-900 hover:bg-kharaan hover:text-ink-dark text-parchment-200 border border-kharaan/40 rounded text-xs font-serif flex items-center gap-1 transition-all"
                >
                  <Award className="w-3.5 h-3.5 text-kharaan" />
                  <span>Test Sanctions</span>
                </button>
              </div>

              <div className="space-y-3">
                {SANCTION_TARGETS.map((target) => (
                  <div
                    key={target.code}
                    className="p-3.5 rounded-lg bg-parchment-900/60 border border-parchment-400/20 text-xs flex flex-col sm:flex-row justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-kharaan text-xs bg-kharaan/10 px-2 py-0.5 rounded border border-kharaan/30">
                          {target.code}
                        </span>
                        <h4 className="font-serif font-bold text-parchment-100 text-sm">
                          {target.name}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-parchment-950 text-parchment-400 border border-parchment-400/10">
                          {target.categoryLabel}
                        </span>
                        {target.isDisputed && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 uppercase font-bold">
                            Disputed
                          </span>
                        )}
                      </div>
                      <p className="text-parchment-400 text-[11px] mb-1">Role: {target.role}</p>
                      <p className="text-parchment-200 leading-relaxed">{target.details}</p>
                      {target.disputeNote && (
                        <p className="text-amber-300 text-[10px] italic mt-1 bg-amber-950/30 p-1.5 rounded border border-amber-500/20">
                          Contested Note: {target.disputeNote}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
