// src/modes/SanctionsMode.tsx
// Mode 4: Phase 3 Sanctions Sandbox — Target list A-D, Instruments, Recharts impact, Disputed objections

import React, { useState } from 'react';
import { useMirrahStore } from '../store/useMirrahStore';
import { SANCTION_TARGETS, SANCTION_INSTRUMENTS, SanctionTarget } from '../data/scenario';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
  Flame,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const SanctionsMode: React.FC = () => {
  const {
    appliedSanctions,
    applySanction,
    removeSanction,
    sanctionsImpact,
    objectionModal,
    closeObjectionModal,
    layerToggles,
    toggleLayer,
  } = useMirrahStore();

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'A' | 'B' | 'C' | 'D'>('ALL');
  const [selectedTarget, setSelectedTarget] = useState<SanctionTarget | null>(null);
  const [instrumentChoice, setInstrumentChoice] = useState<'travel_ban' | 'arms_embargo' | 'assets_freeze'>('assets_freeze');
  const [ruleWarning, setRuleWarning] = useState<string | null>(null);

  const filteredTargets = SANCTION_TARGETS.filter(
    (t) => categoryFilter === 'ALL' || t.category === categoryFilter
  );

  // Prepare chart data for Recharts
  const chartData = [
    {
      name: 'Kharaan Leverage',
      value: sanctionsImpact.kharaanLeverage,
      fill: sanctionsImpact.kharaanLeverage < 0 ? '#ef4444' : '#c9a13b',
    },
    {
      name: 'Zahari Leverage',
      value: sanctionsImpact.zahariLeverage,
      fill: sanctionsImpact.zahariLeverage < 0 ? '#ef4444' : '#3f7d52',
    },
    {
      name: 'Ashen Hand Funding',
      value: -sanctionsImpact.ashenFunding, // reduction shown as negative or cut
      fill: '#dc2626',
    },
    {
      name: 'Concord Legitimacy',
      value: sanctionsImpact.concordCredibility - 50,
      fill: '#3b5775',
    },
  ];

  const handleApply = (target: SanctionTarget) => {
    const inst = SANCTION_INSTRUMENTS.find((i) => i.id === instrumentChoice);
    if (!inst) return;

    // Strict validation against "Who it can target" rules
    if (!inst.allowedTargetTypes.includes(target.targetType)) {
      setRuleWarning(
        `Not Permitted Under Concord Law: ${inst.name} is legally restricted to ${inst.allowedTargetTypes.join(
          ', '
        )}. "${target.name}" is designated as a ${target.targetType}. Use an Assets Freeze or Arms Embargo instead.`
      );
      return;
    }

    setRuleWarning(null);
    applySanction(target.code, instrumentChoice);
  };

  return (
    <div className="w-full min-h-[calc(100vh-53px)] bg-[#14100c] text-parchment-200 p-4 md:p-6 flex flex-col gap-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Contested Designation Diplomatic Objection Modal */}
      {objectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-parchment-950 border-2 border-amber-500 rounded-xl p-5 shadow-2xl text-parchment-200">
            <div className="rivet-tl" />
            <div className="rivet-tr" />
            <div className="rivet-bl" />
            <div className="rivet-br" />

            <div className="flex justify-between items-start mb-2 border-b border-amber-500/30 pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-parchment-100 text-base">
                  Formal Diplomatic Objection Lodged
                </h3>
              </div>
              <button
                onClick={closeObjectionModal}
                className="text-parchment-400 hover:text-parchment-100 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-500/20 rounded-lg text-xs mb-3">
              <span className="font-mono text-amber-300 font-bold block mb-1">
                Target: {objectionModal.targetName}
              </span>
              <p className="text-parchment-300 italic">
                "{objectionModal.objectionText}"
              </p>
            </div>

            <div className="text-[11px] text-parchment-400 leading-relaxed mb-4">
              <strong>Diplomatic Note:</strong> Designations marked as <em>Disputed</em> represent high-friction compromises. Applying unilateral sanctions against legitimate representatives threatens to derail plenary consensus.
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeObjectionModal}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-ink-dark font-serif font-bold text-xs rounded transition-all shadow"
              >
                Acknowledge Objection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header and Telemetry Dashboard */}
      <div className="parchment-panel p-6 rounded-xl document-frame relative">
        <div className="rivet-tl" />
        <div className="rivet-tr" />
        <div className="rivet-bl" />
        <div className="rivet-br" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-kharaan/20 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h2 className="text-2xl font-serif font-black text-parchment-100 tracking-wide">
                Phase 3 Sanctions & Enforcement Sandbox
              </h2>
            </div>
            <p className="text-xs text-parchment-400 mt-1">
              Test multilateral instruments against Categories A–D. Learn targeting constraints and observe real-time leverage impact.
            </p>
          </div>

          {/* Map Heat Layer Toggle Shortcut */}
          <button
            onClick={() => toggleLayer('sanctionsHeat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-serif font-bold border transition-all flex items-center gap-1.5 ${
              layerToggles.sanctionsHeat
                ? 'bg-orange-500 text-ink-dark border-orange-400 shadow-md'
                : 'bg-parchment-900 text-parchment-300 border-parchment-400/20 hover:border-kharaan'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Map Sanctions Heat: {layerToggles.sanctionsHeat ? 'ACTIVE' : 'OFF'}</span>
          </button>
        </div>

        {/* Recharts Impact Readout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Key Stat Cards */}
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-parchment-900/60 border border-kharaan/20">
              <span className="text-[10px] font-mono text-kharaan uppercase block">Kharaan Leverage Shift</span>
              <div className="text-xl font-mono font-bold flex items-center gap-1.5 mt-0.5">
                {sanctionsImpact.kharaanLeverage >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span>{sanctionsImpact.kharaanLeverage}%</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-parchment-900/60 border border-zahari/30">
              <span className="text-[10px] font-mono text-zahari-light uppercase block">Zahari Leverage Shift</span>
              <div className="text-xl font-mono font-bold flex items-center gap-1.5 mt-0.5">
                {sanctionsImpact.zahariLeverage >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span>{sanctionsImpact.zahariLeverage}%</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30">
              <span className="text-[10px] font-mono text-red-400 uppercase block">Ashen Hand Funding Cut</span>
              <div className="text-xl font-mono font-bold text-red-400 flex items-center gap-1.5 mt-0.5">
                <Flame className="w-4 h-4 text-red-400" />
                <span>-{sanctionsImpact.ashenFunding}%</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="lg:col-span-2 h-52 bg-parchment-900/30 p-2 rounded-lg border border-parchment-400/10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#a89984" fontSize={11} />
                <YAxis stroke="#a89984" fontSize={11} domain={[-60, 60]} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#1c1510',
                    borderColor: '#c9a13b',
                    fontSize: '12px',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Target List & Instrument Control Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: Target List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-serif font-bold text-parchment-100">
              Official Target Register
            </h3>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1">
              {(['ALL', 'A', 'B', 'C', 'D'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all border ${
                    categoryFilter === cat
                      ? 'bg-kharaan text-ink-dark border-kharaan'
                      : 'bg-parchment-900/60 text-parchment-400 border-parchment-400/20 hover:text-parchment-200'
                  }`}
                >
                  {cat === 'ALL' ? 'All (18)' : `Cat ${cat}`}
                </button>
              ))}
            </div>
          </div>

          {/* List of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTargets.map((target) => {
              const active = appliedSanctions[target.code];
              return (
                <div
                  key={target.code}
                  className={`p-4 rounded-xl border text-xs transition-all relative ${
                    active
                      ? 'bg-parchment-900/90 border-amber-500 shadow-md'
                      : 'bg-parchment-950 border-parchment-400/20 hover:border-kharaan/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs bg-kharaan/20 text-kharaan px-1.5 py-0.5 rounded border border-kharaan/30">
                        {target.code}
                      </span>
                      <h4 className="font-serif font-bold text-parchment-100 text-sm">
                        {target.name}
                      </h4>
                    </div>
                    {target.isDisputed && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 uppercase font-bold">
                        Disputed
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-parchment-400 mb-1">
                    Role: <span className="text-parchment-300">{target.role}</span>
                  </p>
                  <p className="text-[10px] text-parchment-500 font-mono mb-2">
                    Type: <strong className="text-parchment-300">{target.targetType}</strong> • {target.designation}
                  </p>
                  <p className="text-[11px] text-parchment-300 line-clamp-2 mb-3">
                    {target.details}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-parchment-400/10">
                    {active ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sanctioned: {active.instrument}</span>
                        </span>
                        <button
                          onClick={() => removeSanction(target.code)}
                          className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-950/40 transition-colors"
                          title="Revoke sanction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApply(target)}
                        className="w-full py-1.5 px-3 bg-parchment-900 hover:bg-kharaan hover:text-ink-dark text-parchment-200 border border-kharaan/30 rounded text-xs font-serif transition-all text-center"
                      >
                        Apply Selected Instrument →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COL: Instruments & Legal Constraints */}
        <div className="space-y-4">
          <div className="parchment-panel p-5 rounded-xl document-frame relative">
            <div className="rivet-tl" />
            <div className="rivet-tr" />
            <div className="rivet-bl" />
            <div className="rivet-br" />

            <h3 className="font-serif font-bold text-parchment-100 text-base mb-2">
              Sanction Instruments
            </h3>
            <p className="text-[11px] text-parchment-400 mb-3">
              Select an instrument before applying to target:
            </p>

            {/* Instrument Selection */}
            <div className="space-y-2 mb-4">
              {SANCTION_INSTRUMENTS.map((inst) => (
                <button
                  key={inst.id}
                  onClick={() => {
                    setInstrumentChoice(inst.id);
                    setRuleWarning(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${
                    instrumentChoice === inst.id
                      ? 'bg-kharaan text-ink-dark border-kharaan font-bold shadow-md'
                      : 'bg-parchment-900/60 text-parchment-300 border-parchment-400/20 hover:border-kharaan/40'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span>{inst.name}</span>
                    <span className="text-[10px] font-mono uppercase opacity-75">
                      [{inst.allowedTargetTypes.join(', ')}]
                    </span>
                  </div>
                  <p className="text-[10px] opacity-85 leading-snug">
                    {inst.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Rule Constraint Warning */}
            {ruleWarning && (
              <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-xs text-red-200 mb-3 animate-in shake">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Procedural Violation</span>
                </div>
                <p className="text-[11px]">{ruleWarning}</p>
              </div>
            )}

            <div className="bg-parchment-900/60 p-3 rounded-lg border border-parchment-400/10 text-[11px] text-parchment-400 space-y-1">
              <strong className="text-kharaan-light font-mono uppercase text-[10px] block">
                Targeting Rules Checklist:
              </strong>
              <p>• <strong>Travel Ban:</strong> Natural persons (individuals) only.</p>
              <p>• <strong>Arms Embargo:</strong> Individuals, entities, and entire parties.</p>
              <p>• <strong>Assets Freeze:</strong> Individuals, corporations, state entities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
