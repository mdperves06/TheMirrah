// src/modes/CoachMode.tsx
// Mode 5: Best Delegate Trainer — Speech/Clause Grading on Rubric + Mastery Radar Dashboard

import React, { useState } from 'react';
import { useMirrahStore } from '../store/useMirrahStore';
import { callAiCoach } from '../lib/ai';
import { RubricEvaluation } from '../lib/scoring';
import { getWeakestTopic } from '../lib/save';
import { QUIZ_QUESTIONS, QuizTopic } from '../data/quizzes';
import {
  GraduationCap,
  Award,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Target,
  ArrowRight,
  FileText,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

export const CoachMode: React.FC = () => {
  const { playerSeat, setPlayerSeat, mastery, submitCoachEvaluation, openQuiz } = useMirrahStore();

  const [speechMode, setSpeechMode] = useState<'speech' | 'caucus' | 'clause'>('speech');
  const [speechText, setSpeechText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<RubricEvaluation | null>(null);

  const weakest = getWeakestTopic(mastery);

  // Radar chart data mapping from topicMastery
  const radarData = [
    { subject: 'History', score: mastery.topicMastery.history.percentage || 20 },
    { subject: 'Parties', score: mastery.topicMastery.parties.percentage || 20 },
    { subject: 'Geography', score: mastery.topicMastery.geography.percentage || 20 },
    { subject: 'Resources', score: mastery.topicMastery.resources.percentage || 20 },
    { subject: 'Routes', score: mastery.topicMastery.routes.percentage || 20 },
    { subject: 'Ashen Hand', score: mastery.topicMastery.ashenHand.percentage || 20 },
    { subject: 'Sanctions', score: mastery.topicMastery.sanctions.percentage || 20 },
    { subject: 'Crisis & Decorum', score: mastery.topicMastery.crisis.percentage || 20 },
  ];

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!speechText.trim() || isEvaluating) return;

    setIsEvaluating(true);
    try {
      const result = await callAiCoach(playerSeat, speechText, speechMode);
      setEvaluation(result);
      submitCoachEvaluation(result.score);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleDrillWeakest = () => {
    const questions = QUIZ_QUESTIONS.filter((q) => q.topic === weakest.topic);
    if (questions.length > 0) {
      const q = questions[Math.floor(Math.random() * questions.length)];
      openQuiz(q);
    } else {
      openQuiz(QUIZ_QUESTIONS[0]);
    }
  };

  const sampleSpeeches = [
    {
      title: 'Kharaan Opening Plenary',
      seat: 'kharaan' as const,
      mode: 'speech' as const,
      text: `Distinguished delegates of the Concord Assembly. The Kingdom of Kharaan addresses this plenary not from a posture of grievance, but of unbroken sovereign stewardship. For ninety years since King Aldavar II declared our Solmaran successor rights, we have secured the northern interior and ensured the reliable export of Veridium and Solite to every realm seated in this chamber. The security measures at Suni Wells were necessitated by violent irregular cross-border incursions, not malice. We cordially propose an immediate mutual cessation of hostilities along The Seam, tied to the full lifting of Seam trade suspensions and verifiable monitoring of forward perimeters. Administrative sovereignty cannot be bartered, but peace is our supreme objective.`,
    },
    {
      title: 'Zahari Self-Determination Clause',
      seat: 'zahari' as const,
      mode: 'clause' as const,
      text: `Operative Clause 4: Mandates the establishment of an internationally guaranteed 24-month roadmap toward a binding referendum on southern self-determination, fulfilling the solemn commitment made by Queen Solvane I and voided fourteen years ago; further resolves that full commercial export quotas for Duskore mined at Vael Ridge shall be tied directly to the phased demilitarization of the Suni Wells aquifer under joint Concord observer supervision.`,
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-53px)] bg-[#14100c] text-parchment-200 p-4 md:p-6 flex flex-col gap-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Banner & Mastery Analytics */}
      <div className="parchment-panel p-6 rounded-xl document-frame relative">
        <div className="rivet-tl" />
        <div className="rivet-tr" />
        <div className="rivet-bl" />
        <div className="rivet-br" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-kharaan/20 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-kharaan" />
              <h2 className="text-2xl font-serif font-black text-parchment-100 tracking-wide">
                Best Delegate Performance Lab & Mastery Engine
              </h2>
            </div>
            <p className="text-xs text-parchment-400 mt-1">
              Submit diplomatic interventions evaluated against the 5-point Model UN rubric. Track your readiness across all scenario dimensions.
            </p>
          </div>

          {/* Drill Weakest Area CTA */}
          <button
            onClick={handleDrillWeakest}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-950 to-amber-950 hover:from-red-900 hover:to-amber-900 border border-amber-500/50 text-parchment-100 rounded-lg text-xs font-serif font-bold shadow-lg transition-all"
          >
            <Target className="w-4 h-4 text-amber-400 animate-pulse" />
            <div>
              <span className="block text-[9px] font-mono text-amber-300 uppercase">Weakest Area Detected:</span>
              <span>Drill {weakest.topic.toUpperCase()} ({weakest.percentage}%) →</span>
            </div>
          </button>
        </div>

        {/* Analytics Grid: Radar Chart + High-Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Radar Chart */}
          <div className="h-64 md:h-72 w-full flex items-center justify-center bg-parchment-900/30 rounded-xl border border-parchment-400/10 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#c9a13b" strokeOpacity={0.2} />
                <PolarAngleAxis dataKey="subject" stroke="#a89984" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#c9a13b" fontSize={9} />
                <Radar
                  name="Mastery %"
                  dataKey="score"
                  stroke="#c9a13b"
                  fill="#c9a13b"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Metrics Column */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-parchment-900/60 border border-kharaan/30">
              <span className="text-[10px] font-mono uppercase text-kharaan block">Overall Mastery Rating</span>
              <div className="text-3xl font-serif font-bold text-kharaan mt-0.5 flex items-center gap-2">
                <span>{mastery.overallPercentage}%</span>
                <Award className="w-6 h-6 text-kharaan opacity-80" />
              </div>
              <p className="text-[11px] text-parchment-400 mt-1">
                Synthesized across {mastery.completedQuizIds.length} verified quiz answers and speech evaluations.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-parchment-900/60 border border-parchment-400/15">
              <span className="text-[10px] font-mono uppercase text-parchment-400 block">Average Delegate Score</span>
              <div className="text-2xl font-mono font-bold text-parchment-100 mt-0.5">
                {mastery.averageDelegateScore > 0 ? `${mastery.averageDelegateScore} / 100` : 'No Submissions Yet'}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-parchment-900/60 border border-parchment-400/15">
              <span className="text-[10px] font-mono uppercase text-parchment-400 block">Campaign Clears</span>
              <div className="flex gap-2 text-xs mt-1 font-mono">
                <span className={mastery.campaignClears.kharaan ? 'text-kharaan font-bold' : 'text-parchment-600'}>
                  Kharaan: {mastery.campaignClears.kharaan ? '✓' : '—'}
                </span>
                <span className={mastery.campaignClears.zahari ? 'text-zahari-light font-bold' : 'text-parchment-600'}>
                  Zahari: {mastery.campaignClears.zahari ? '✓' : '—'}
                </span>
                <span className={mastery.campaignClears.concord ? 'text-concord-light font-bold' : 'text-parchment-600'}>
                  Concord: {mastery.campaignClears.concord ? '✓' : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Rubric Criteria weights card */}
          <div className="p-4 rounded-lg bg-parchment-900/40 border border-parchment-400/15 text-xs space-y-2">
            <h4 className="font-serif font-bold text-parchment-100 text-sm mb-1">
              Best Delegate Rubric (Section 6)
            </h4>
            <div className="flex justify-between text-[11px] border-b border-parchment-400/10 pb-1">
              <span>Scenario Accuracy</span>
              <span className="font-mono text-kharaan font-bold">25%</span>
            </div>
            <div className="flex justify-between text-[11px] border-b border-parchment-400/10 pb-1">
              <span>Diplomacy & Decorum</span>
              <span className="font-mono text-kharaan font-bold">20%</span>
            </div>
            <div className="flex justify-between text-[11px] border-b border-parchment-400/10 pb-1">
              <span>Coalition & Division Logic</span>
              <span className="font-mono text-kharaan font-bold">20%</span>
            </div>
            <div className="flex justify-between text-[11px] border-b border-parchment-400/10 pb-1">
              <span>Resourcefulness & Leverage</span>
              <span className="font-mono text-kharaan font-bold">20%</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>Operative Specificity</span>
              <span className="font-mono text-kharaan font-bold">15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Free-Write Evaluation Console & Diagnostic Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Writing Workspace */}
        <div className="parchment-panel p-5 rounded-xl document-frame relative flex flex-col justify-between">
          <div className="rivet-tl" />
          <div className="rivet-tr" />
          <div className="rivet-bl" />
          <div className="rivet-br" />

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h3 className="font-serif font-bold text-parchment-100 text-base">
                Draft Intervention
              </h3>

              {/* Seat Selector */}
              <div className="flex items-center gap-1">
                {(['kharaan', 'zahari', 'concord'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlayerSeat(s)}
                    className={`px-2.5 py-1 rounded text-xs font-serif font-bold capitalize transition-all border ${
                      playerSeat === s
                        ? 'bg-kharaan text-ink-dark border-kharaan shadow'
                        : 'bg-parchment-900 text-parchment-400 border-parchment-400/20 hover:text-parchment-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Submission Mode Selector */}
            <div className="flex gap-2 mb-3">
              {(
                [
                  { id: 'speech', label: 'Opening Speech' },
                  { id: 'caucus', label: 'Moderated Caucus Point' },
                  { id: 'clause', label: 'Draft Resolution Clause' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSpeechMode(m.id)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-serif transition-all border ${
                    speechMode === m.id
                      ? 'bg-parchment-900 border-kharaan text-kharaan-light font-bold'
                      : 'bg-parchment-950 border-parchment-400/10 text-parchment-400 hover:text-parchment-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Quick Exemplar Prompts */}
            <div className="mb-3 flex items-center gap-2 overflow-x-auto text-[11px] pb-1">
              <span className="text-parchment-400 font-mono shrink-0">Sample Templates:</span>
              {sampleSpeeches.map((samp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPlayerSeat(samp.seat);
                    setSpeechMode(samp.mode);
                    setSpeechText(samp.text);
                  }}
                  className="px-2 py-0.5 rounded bg-parchment-900 hover:bg-parchment-800 text-parchment-300 hover:text-kharaan-light border border-parchment-400/20 whitespace-nowrap transition-colors"
                >
                  {samp.title}
                </button>
              ))}
            </div>

            {/* Free-Write Textarea */}
            <form onSubmit={handleEvaluate} className="space-y-3">
              <textarea
                rows={9}
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                placeholder={`Draft your ${speechMode} as the lead delegate of the ${
                  playerSeat === 'kharaan' ? 'Kingdom of Kharaan' : playerSeat === 'zahari' ? 'Zahari Front' : 'Concord of Crowns'
                }...`}
                className="w-full bg-parchment-900/90 border border-parchment-400/25 rounded-lg p-3 text-xs leading-relaxed text-parchment-100 placeholder:text-parchment-500 focus:outline-none focus:border-kharaan font-sans"
              />

              <div className="flex justify-between items-center">
                <span className="text-[11px] text-parchment-400 font-mono">
                  {speechText.length} characters
                </span>
                <button
                  type="submit"
                  disabled={!speechText.trim() || isEvaluating}
                  className="px-5 py-2.5 bg-kharaan hover:bg-kharaan-light disabled:opacity-40 text-ink-dark font-serif font-bold text-xs rounded-lg shadow-gold-glow transition-all flex items-center gap-2"
                >
                  {isEvaluating ? (
                    <>
                      <span className="w-3 h-3 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                      <span>Director Grading Rubric...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Evaluate Against Rubric</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT: Director Rubric Feedback Card */}
        <div className="parchment-panel p-5 rounded-xl document-frame relative">
          <div className="rivet-tl" />
          <div className="rivet-tr" />
          <div className="rivet-bl" />
          <div className="rivet-br" />

          {evaluation ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Score Header */}
              <div className="flex justify-between items-center border-b border-kharaan/20 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-kharaan">Director Evaluation Report</span>
                  <h4 className="text-xl font-serif font-black text-parchment-100">
                    Performance Score: {evaluation.score} / 100
                  </h4>
                </div>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-base border-2 ${
                    evaluation.score >= 80
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                      : evaluation.score >= 60
                      ? 'bg-amber-950 text-amber-400 border-amber-500'
                      : 'bg-red-950 text-red-400 border-red-500'
                  }`}
                >
                  {evaluation.score}
                </div>
              </div>

              {/* Per-Criterion Breakdown Bars */}
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span>Scenario Accuracy (Facts & Lore)</span>
                    <span className="font-mono">{evaluation.perCriterion.scenarioAccuracy} / 25</span>
                  </div>
                  <div className="h-1.5 w-full bg-parchment-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-kharaan"
                      style={{ width: `${(evaluation.perCriterion.scenarioAccuracy / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span>Diplomacy & Tone</span>
                    <span className="font-mono">{evaluation.perCriterion.diplomacyTone} / 20</span>
                  </div>
                  <div className="h-1.5 w-full bg-parchment-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-400"
                      style={{ width: `${(evaluation.perCriterion.diplomacyTone / 20) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span>Coalition Logic & Divisions</span>
                    <span className="font-mono">{evaluation.perCriterion.coalitionLogic} / 20</span>
                  </div>
                  <div className="h-1.5 w-full bg-parchment-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400"
                      style={{ width: `${(evaluation.perCriterion.coalitionLogic / 20) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span>Resourcefulness & Leverage</span>
                    <span className="font-mono">{evaluation.perCriterion.resourcefulnessLeverage} / 20</span>
                  </div>
                  <div className="h-1.5 w-full bg-parchment-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400"
                      style={{ width: `${(evaluation.perCriterion.resourcefulnessLeverage / 20) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span>Operative Drafting & Specificity</span>
                    <span className="font-mono">{evaluation.perCriterion.draftingSpecificity} / 15</span>
                  </div>
                  <div className="h-1.5 w-full bg-parchment-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-400"
                      style={{ width: `${(evaluation.perCriterion.draftingSpecificity / 15) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Strengths & Fixes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                  <strong className="text-emerald-400 font-serif block mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Key Strengths:</span>
                  </strong>
                  <ul className="space-y-1 list-disc list-inside text-parchment-300 text-[11px]">
                    {evaluation.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30">
                  <strong className="text-red-400 font-serif block mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Areas to Improve:</span>
                  </strong>
                  <ul className="space-y-1 list-disc list-inside text-parchment-300 text-[11px]">
                    {evaluation.fixes.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Rewritten Exemplar Line */}
              <div className="p-3 rounded-lg bg-kharaan/10 border border-kharaan/30 text-xs">
                <strong className="text-kharaan-light font-serif block mb-1">
                  Director's Rewritten Exemplar Line:
                </strong>
                <p className="text-parchment-200 italic font-serif leading-relaxed">
                  {evaluation.exemplarLine}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-parchment-400 space-y-3">
              <FileText className="w-12 h-12 text-kharaan/40" />
              <h4 className="font-serif font-bold text-parchment-200 text-base">
                Awaiting Delegate Submission
              </h4>
              <p className="text-xs max-w-sm">
                Enter your opening speech, caucus point, or operative resolution clause on the left. The Director will score your arguments against the scenario's facts, leverage, and diplomatic tone.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
