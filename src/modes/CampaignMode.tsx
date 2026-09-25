// src/modes/CampaignMode.tsx
// Mode 3: Crisis Campaign — Play Every Party vs AI Counterparts across 3 Phases

import React, { useState, useRef, useEffect } from 'react';
import { useMirrahStore, PartySeat } from '../store/useMirrahStore';
import { PARTIES } from '../data/scenario';
import { CrisisModal } from '../components/CrisisModal';
import {
  Swords,
  Send,
  MessageSquare,
  Shield,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export const CampaignMode: React.FC = () => {
  const {
    playerSeat,
    setPlayerSeat,
    currentPhase,
    phaseTurnsLeft,
    phaseCompleted,
    campaignFinished,
    campaignOutcome,
    kharaanTrust,
    zahariTrust,
    concordLeaning,
    kharaanControl,
    zahariControl,
    campaignHistory,
    lastActionConsequence,
    dismissConsequence,
    isAiThinking,
    submitPlayerAction,
    advanceToNextPhase,
    resetCampaign,
  } = useMirrahStore();

  const [inputMessage, setInputMessage] = useState('');
  const [actionType, setActionType] = useState<
    'statement' | 'proposal' | 'caucus' | 'concession' | 'escalation'
  >('statement');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activePartyInfo = PARTIES[playerSeat as keyof typeof PARTIES];

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [campaignHistory, isAiThinking]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isAiThinking || phaseTurnsLeft <= 0) return;
    const text = inputMessage;
    setInputMessage('');
    await submitPlayerAction(actionType, text);
  };

  const samplePrompts = [
    {
      label: 'Propose Ceasefire Buffer',
      type: 'proposal' as const,
      text: `We formally table an operative proposal to establish a 5-kilometer demilitarized buffer zone along The Seam, verified by joint Concord observers, in exchange for an immediate cessation of forward artillery movements at Sef Karib.`,
    },
    {
      label: 'Offer Water Access Concession',
      type: 'concession' as const,
      text: `In the interest of regional de-escalation, our delegation agrees to permit unconditional neutral Concord relief convoys access to the Suni Wells aquifer, conditioned upon the immediate unblocking of the Gold Road Veridium freight lines.`,
    },
    {
      label: 'Leverage Duskore Monopoly',
      type: 'statement' as const,
      text: `Let all delegations remember that the Concord's advanced guidance systems and military aircraft rely exclusively upon Duskore mined at Vael Ridge. We will not entertain any framework that does not offer a binding, verified pathway to full sovereign recognition.`,
    },
    {
      label: 'Warning on Sovereignty',
      type: 'escalation' as const,
      text: `The Kingdom will not compromise its ancient Solmaran successor rights under armed duress. If hostile infiltrations along the Seam Crossing continue, we will authorize full military countermeasures to secure the Adessa border.`,
    },
  ];

  return (
    <div className="w-full h-[calc(100vh-53px)] bg-[#14100c] text-parchment-200 flex flex-col md:flex-row overflow-hidden">
      {/* Crisis event overlay if triggered */}
      <CrisisModal />

      {/* LEFT COLUMN: Seat Selector, Briefing, Relationship Meters */}
      <aside className="w-full md:w-80 lg:w-96 bg-parchment-950 border-r border-kharaan/25 p-4 flex flex-col justify-between overflow-y-auto shrink-0 shadow-lg">
        <div className="space-y-4">
          {/* Seat Switcher */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-kharaan block mb-1.5">
              Select Your Delegation Seat:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['kharaan', 'zahari', 'concord'] as const).map((seat) => (
                <button
                  key={seat}
                  onClick={() => setPlayerSeat(seat)}
                  className={`py-2 px-2 rounded-lg text-xs font-serif font-bold transition-all text-center border ${
                    playerSeat === seat
                      ? seat === 'kharaan'
                        ? 'bg-kharaan text-ink-dark border-kharaan shadow-md'
                        : seat === 'zahari'
                        ? 'bg-zahari text-parchment-100 border-zahari shadow-md'
                        : 'bg-concord text-parchment-100 border-concord shadow-md'
                      : 'bg-parchment-900/60 text-parchment-400 hover:text-parchment-200 border-parchment-400/10'
                  }`}
                >
                  {seat === 'kharaan'
                    ? 'Kharaan'
                    : seat === 'zahari'
                    ? 'Zahari'
                    : 'Concord'}
                </button>
              ))}
            </div>
          </div>

          {/* Current Phase Badge */}
          <div className="p-3 rounded-lg bg-parchment-900/70 border border-kharaan/30">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-mono text-kharaan uppercase font-bold">
                Phase {currentPhase} of 3
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-parchment-950 text-parchment-300 border border-parchment-400/20">
                Turns Left: <strong>{phaseTurnsLeft}</strong>
              </span>
            </div>
            <h3 className="font-serif font-bold text-parchment-100 text-sm">
              {currentPhase === 1
                ? 'Framework & Ceasefire'
                : currentPhase === 2
                ? 'Territory & Resources'
                : 'Sanctions & Repercussions'}
            </h3>
            <p className="text-[11px] text-parchment-400 mt-1 leading-snug">
              {currentPhase === 1
                ? 'Agree on negotiating ground rules, de-escalate forward garrisons, and stabilize the Seam line.'
                : currentPhase === 2
                ? 'Demarcate resource extraction corridors, resolve Suni Wells water access, and trade Veridium for Duskore.'
                : 'Impose or relax targeted measures against the Category A–D target list to force a final treaty.'}
            </p>
          </div>

          {/* Dynamic Trust / Relationship Meters */}
          <div className="p-3.5 rounded-lg bg-parchment-900/50 border border-parchment-400/15 space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-kharaan-light font-bold flex items-center justify-between">
              <span>Diplomatic Trust Telemetry</span>
              <TrendingUp className="w-3 h-3 text-kharaan" />
            </h4>

            {/* Kharaan Trust */}
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-serif">
                <span className="text-kharaan-light">Kharaan Trust</span>
                <span className="font-mono">{kharaanTrust}%</span>
              </div>
              <div className="h-2 w-full bg-parchment-950 rounded-full overflow-hidden border border-parchment-400/20">
                <div
                  className="h-full bg-gradient-to-r from-kharaan-dark to-kharaan transition-all duration-500"
                  style={{ width: `${kharaanTrust}%` }}
                />
              </div>
            </div>

            {/* Zahari Trust */}
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-serif">
                <span className="text-zahari-light">Zahari Front Trust</span>
                <span className="font-mono">{zahariTrust}%</span>
              </div>
              <div className="h-2 w-full bg-parchment-950 rounded-full overflow-hidden border border-parchment-400/20">
                <div
                  className="h-full bg-gradient-to-r from-zahari-dark to-zahari-light transition-all duration-500"
                  style={{ width: `${zahariTrust}%` }}
                />
              </div>
            </div>

            {/* Territory Split Live Hook */}
            <div className="pt-2 border-t border-parchment-400/10">
              <div className="flex justify-between text-[10px] text-parchment-400 font-mono mb-1">
                <span>Kharaan: {kharaanControl}%</span>
                <span>Zahari: {zahariControl}%</span>
              </div>
              <div className="h-2 w-full bg-parchment-950 rounded-full overflow-hidden flex border border-parchment-400/20">
                <div
                  className="h-full bg-kharaan transition-all duration-500"
                  style={{ width: `${kharaanControl}%` }}
                />
                <div
                  className="h-full bg-zahari transition-all duration-500"
                  style={{ width: `${zahariControl}%` }}
                />
              </div>
            </div>
          </div>

          {/* Seat Tactical Objectives & Red Lines */}
          <div className="p-3 rounded-lg bg-parchment-900/40 border border-parchment-400/10 text-xs">
            <h4 className="font-serif font-bold text-parchment-100 mb-1">
              Your Mandate & Red Lines:
            </h4>
            <ul className="text-[11px] text-parchment-300 space-y-1 list-disc list-inside">
              {activePartyInfo.redLines.map((rl: string, idx: number) => (
                <li key={idx} className="text-red-300/90">
                  {rl}
                </li>
              ))}
            </ul>
          </div>

          {/* Current Room Psychological Representation */}
          <div className="p-3 rounded-lg bg-parchment-900/60 border border-kharaan/25 text-xs space-y-2">
            <h4 className="font-mono text-[10px] uppercase tracking-wider text-kharaan font-bold flex items-center justify-between">
              <span>Current Room Posture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center">
                <span className="text-kharaan-light font-serif">Kharaan:</span>
                <span className="font-mono text-[10px] text-parchment-300">
                  {kharaanTrust >= 60 ? 'Receptive to Compromise' : kharaanTrust >= 40 ? 'Guarded & Legalistic' : 'Hardline / Brinkmanship'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zahari-light font-serif">Zahari Front:</span>
                <span className="font-mono text-[10px] text-parchment-300">
                  {zahariTrust >= 60 ? 'Constructive Bargaining' : zahariTrust >= 40 ? 'Suspicious / Demands Relief' : 'Outraged / Ultimatums'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-concord-light font-serif">Concord Mediator:</span>
                <span className="font-mono text-[10px] text-parchment-300">
                  Pressure for 3-Day Breakthrough
                </span>
              </div>
            </div>
            <div className="pt-1.5 border-t border-parchment-400/10 text-[10px] text-parchment-400">
              <span className="font-bold text-kharaan">Active Fault Line: </span>
              {currentPhase === 1 ? 'Seam Ceasefire & Buffer Demarcation' : currentPhase === 2 ? 'Suni Wells Water Siege & Duskore Quotas' : 'Target Register Enforcement & Amnesty'}
            </div>
          </div>
        </div>

        {/* Campaign Reset Button */}
        <div className="pt-3 border-t border-kharaan/20 mt-4">
          <button
            onClick={resetCampaign}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-parchment-900 hover:bg-parchment-800 text-parchment-400 hover:text-parchment-200 text-xs rounded border border-parchment-400/20 transition-all font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Drill</span>
          </button>
        </div>
      </aside>

      {/* RIGHT COLUMN: Dialogue Plenary Stream & Action Console */}
      <main className="flex-1 flex flex-col justify-between overflow-hidden bg-parchment-950/40 relative">
        {/* Plenary Header */}
        <div className="p-3 bg-parchment-950/80 border-b border-kharaan/20 flex items-center justify-between text-xs px-6 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-kharaan" />
            <h2 className="font-serif font-bold text-parchment-100 uppercase tracking-wide">
              Concord Emergency Session Plenary
            </h2>
          </div>
          <span className="text-[11px] text-parchment-400 font-mono">
            {campaignHistory.length} Recorded Interventions
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
          {campaignHistory.map((msg: any) => {
            const isPlayer = msg.sender === 'player';
            const isSystem = msg.sender === 'system' || msg.sender === 'director';
            const isAshen = msg.sender === 'ashen';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-3">
                  <div className="max-w-xl text-center px-4 py-2 rounded-lg bg-parchment-900/60 border border-kharaan/20 text-xs text-parchment-300 font-serif italic">
                    <span className="font-mono text-kharaan font-bold block text-[10px] uppercase not-italic mb-0.5">
                      {msg.senderName} • {msg.timestamp}
                    </span>
                    {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isPlayer ? 'items-end' : 'items-start'} max-w-2xl ${
                  isPlayer ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span
                    className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                      isPlayer
                        ? 'bg-kharaan/20 text-kharaan-light border border-kharaan/40'
                        : msg.sender === 'zahari'
                        ? 'bg-zahari/20 text-zahari-light border border-zahari/40'
                        : 'bg-concord/20 text-concord-light border border-concord/40'
                    }`}
                  >
                    {msg.senderName}
                  </span>
                  {isPlayer && msg.score !== undefined && (
                    <span className="text-[9px] font-mono font-bold text-kharaan bg-kharaan/15 border border-kharaan/30 px-1.5 py-0.5 rounded">
                      Best Delegate Rubric: {msg.score}/100
                    </span>
                  )}
                  <span className="text-[10px] text-parchment-500 font-mono">{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed shadow-sm ${
                    isPlayer
                      ? 'bg-parchment-900/90 border-kharaan/40 text-parchment-100 rounded-tr-none'
                      : 'bg-parchment-950 border-parchment-400/20 text-parchment-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}

          {/* Authentic Diplomatic Caucus / Deliberation State */}
          {isAiThinking && (
            <div className="flex items-center gap-2 text-xs text-parchment-300 italic px-2 animate-pulse font-serif">
              <span className="w-2 h-2 rounded-full bg-kharaan" />
              <span>
                {playerSeat === 'kharaan'
                  ? 'Reading the room... The Zahari Front caucus is reviewing counter-demands...'
                  : playerSeat === 'zahari'
                  ? 'Reading the room... Kingdom plenipotentiaries are conferring with Solmaran legal counsel...'
                  : 'Reading the room... The plenary secretariat is formulating compromise terms...'}
              </span>
            </div>
          )}

          {/* Real-Time Strategic Consequence Card */}
          {lastActionConsequence && (
            <div className="my-2 p-3 bg-kharaan/10 border border-kharaan/35 rounded-xl text-xs space-y-2 backdrop-blur-md shadow-lg animate-fade-in">
              <div className="flex items-center justify-between border-b border-kharaan/20 pb-1.5">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-kharaan" />
                  <span className="font-serif font-bold text-kharaan">Director Evaluation: Score {lastActionConsequence.score}/100</span>
                  <span className="text-[10px] font-mono uppercase bg-kharaan/20 text-kharaan-light px-1.5 py-0.5 rounded font-bold">
                    {lastActionConsequence.actionType}
                  </span>
                </div>
                <button
                  onClick={dismissConsequence}
                  className="text-parchment-400 hover:text-parchment-100 text-xs px-2 py-0.5 rounded hover:bg-parchment-900 transition-colors"
                  title="Dismiss Feedback"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-parchment-900/80 p-2 rounded-lg border border-parchment-400/10">
                  <span className="text-parchment-400 font-mono block text-[9px] uppercase font-bold">Diplomatic Shift</span>
                  <span className="font-bold text-kharaan-light">{lastActionConsequence.diplomaticImpact}</span>
                </div>
                <div className="bg-parchment-900/80 p-2 rounded-lg border border-parchment-400/10">
                  <span className="text-parchment-400 font-mono block text-[9px] uppercase font-bold">Economic Impact</span>
                  <span className="text-parchment-200">{lastActionConsequence.economicImpact}</span>
                </div>
                <div className="bg-parchment-900/80 p-2 rounded-lg border border-parchment-400/10">
                  <span className="text-parchment-400 font-mono block text-[9px] uppercase font-bold">Humanitarian Impact</span>
                  <span className="text-parchment-200">{lastActionConsequence.humanitarianImpact}</span>
                </div>
                <div className="bg-parchment-900/80 p-2 rounded-lg border border-parchment-400/10">
                  <span className="text-parchment-400 font-mono block text-[9px] uppercase font-bold">Political Stance</span>
                  <span className="text-parchment-200">{lastActionConsequence.politicalImpact}</span>
                </div>
              </div>

              <p className="text-[11px] text-parchment-300 italic pt-1 border-t border-kharaan/15">
                <span className="font-bold text-kharaan not-italic">Chair Critique: </span>
                {lastActionConsequence.directorCritique}
              </p>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Phase After-Action Banner / Victory Screen */}
        {phaseCompleted && !campaignFinished && (
          <div className="p-4 bg-kharaan/10 border-t border-b border-kharaan/40 flex items-center justify-between px-6 backdrop-blur-md">
            <div>
              <h4 className="font-serif font-bold text-kharaan text-sm">
                Phase {currentPhase} Concluded
              </h4>
              <p className="text-xs text-parchment-300">
                {currentPhase === 1
                  ? 'The ceasefire framework holds — for now. Now the difficult part: territory and resources.'
                  : 'Resource quotas tabled in plenary. Advancing to sanctions and final enforcement.'}
              </p>
            </div>
            <button
              onClick={advanceToNextPhase}
              className="flex items-center gap-2 px-4 py-2 bg-kharaan hover:bg-kharaan-light text-ink-dark font-serif font-bold text-xs rounded-lg shadow-gold-glow transition-all"
            >
              <span>Advance to Phase {currentPhase + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {campaignFinished && (
          <div className="p-5 bg-parchment-950 border-t-2 border-kharaan space-y-4 px-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-kharaan" />
                  <h4 className="font-serif font-black text-parchment-100 text-base">
                    {campaignOutcome === 'success' ? 'Framework Secured — Talks Survived First Test' : 'Talks Collapsed — 28-Year Curse Continues'}
                  </h4>
                </div>
                <p className="text-xs text-parchment-300 mt-1">
                  {campaignOutcome === 'success'
                    ? 'A fragile multilateral framework was ratified! Seam trade reopened and the Ashen Hand marginalized.'
                    : 'The plenary fractured under irreconcilable red lines. Forward garrisons resume tactical mobilization.'}
                </p>
              </div>
              <button
                onClick={resetCampaign}
                className="px-4 py-2 bg-kharaan hover:bg-kharaan-light text-ink-dark font-serif font-bold text-xs rounded-lg shadow transition-all whitespace-nowrap"
              >
                Play Again as Different Seat
              </button>
            </div>

            {/* Strategic Stakes Audit (Section 4.12) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 border-t border-kharaan/20 text-xs">
              <div className="bg-parchment-900/60 p-2.5 rounded-lg border border-parchment-400/10">
                <span className="font-bold text-kharaan block mb-1">1. The Seam Territory</span>
                <p className="text-[11px] text-parchment-300">
                  {kharaanControl >= 60 ? 'Kharaan holds defensive primacy along the ridge.' : 'Zahari autonomy established over southern redoubt.'}
                </p>
              </div>
              <div className="bg-parchment-900/60 p-2.5 rounded-lg border border-parchment-400/10">
                <span className="font-bold text-kharaan block mb-1">2. Veridium & Duskore Flow</span>
                <p className="text-[11px] text-parchment-300">
                  Concord guidance supply secured; southern transit royalties negotiated under escrow.
                </p>
              </div>
              <div className="bg-parchment-900/60 p-2.5 rounded-lg border border-parchment-400/10">
                <span className="font-bold text-kharaan block mb-1">3. Ashen Hand Deterrence</span>
                <p className="text-[11px] text-parchment-300">
                  Joint intelligence sharing protocols ratified; black-market arms ring interdicted.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Input Console */}
        {!phaseCompleted && !campaignFinished && (
          <div className="p-4 bg-parchment-950 border-t border-kharaan/25">
            {/* Quick Exemplar Prompts */}
            <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1 text-[11px]">
              <span className="text-parchment-400 font-mono shrink-0">Tactical Templates:</span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActionType(p.type);
                    setInputMessage(p.text);
                  }}
                  className="px-2 py-0.5 rounded bg-parchment-900/80 hover:bg-parchment-800 text-parchment-300 hover:text-kharaan-light border border-parchment-400/20 whitespace-nowrap transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Action Type Pills */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase text-parchment-400">Action Type:</span>
              {(['statement', 'proposal', 'caucus', 'concession', 'escalation'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActionType(t)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-all border ${
                    actionType === t
                      ? 'bg-kharaan text-ink-dark font-bold border-kharaan'
                      : 'bg-parchment-900/60 text-parchment-400 hover:text-parchment-200 border-transparent'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Text Input Form */}
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                placeholder={`Speak as ${activePartyInfo.name} (e.g. deliver opening speech, table proposal)...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isAiThinking || phaseTurnsLeft <= 0}
                className="flex-1 bg-parchment-900/90 border border-parchment-400/25 rounded-lg px-4 py-2.5 text-xs text-parchment-100 placeholder:text-parchment-500 focus:outline-none focus:border-kharaan"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isAiThinking || phaseTurnsLeft <= 0}
                className="px-5 py-2.5 bg-kharaan hover:bg-kharaan-light disabled:opacity-40 disabled:cursor-not-allowed text-ink-dark font-serif font-bold text-xs rounded-lg shadow-gold-glow transition-all flex items-center gap-1.5"
              >
                <span>Deliver Intervention</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
