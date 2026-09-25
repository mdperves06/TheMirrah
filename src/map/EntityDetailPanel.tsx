// src/map/EntityDetailPanel.tsx
// Comprehensive Diplomatic Intelligence Dossier & Connected Entity Inspector

import React from 'react';
import { useMirrahStore } from '../store/useMirrahStore';
import {
  CITIES,
  RESOURCES,
  ROUTES,
  HUMANITARIAN_CORRIDORS,
  SANCTION_TARGETS,
  GEOGRAPHY_FEATURES,
  ASHEN_HAND,
  HISTORY_EVENTS,
} from '../data/scenario';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import { WATER_COORDS, ASHEN_HAND_SITES, STRATEGIC_CONNECTIONS, getEntityCoordinates } from '../data/coordinates';
import {
  X,
  ExternalLink,
  Award,
  ShieldAlert,
  Route as RouteIcon,
  Pickaxe,
  MapPin,
  Clock,
  Compass,
  AlertTriangle,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export const EntityDetailPanel: React.FC = () => {
  const { selectedEntityId, setSelectedEntityId, setCameraFocus, openQuiz, appliedSanctions } =
    useMirrahStore();

  if (!selectedEntityId) return null;

  // 1. Resolve entity across all categories
  const city = CITIES.find((c) => c.id === selectedEntityId);
  const resource = RESOURCES.find(
    (r) => r.id === selectedEntityId || r.name.replace(/\s+/g, '') === selectedEntityId
  );
  const route = ROUTES.find(
    (r) =>
      r.id === selectedEntityId ||
      r.name.replace(/\s+/g, '') === selectedEntityId ||
      r.id.replace('route-', '') === selectedEntityId.toLowerCase()
  );
  const corridor = HUMANITARIAN_CORRIDORS.find(
    (c) =>
      c.id === selectedEntityId ||
      c.name.replace(/\s+/g, '') === selectedEntityId ||
      c.id.replace('corridor-', '') === selectedEntityId.toLowerCase()
  );
  const water = WATER_COORDS[selectedEntityId];
  const ashenSite = ASHEN_HAND_SITES[selectedEntityId];
  const geo = GEOGRAPHY_FEATURES.find((g) => g.id === selectedEntityId);

  // 2. Connected intelligence
  const connections = STRATEGIC_CONNECTIONS[selectedEntityId] || { connectedEntities: [] };

  // 3. Find linked sanctions
  const linkedSanction = SANCTION_TARGETS.find(
    (t) => t.mapEntityId === selectedEntityId || t.code === selectedEntityId
  );
  const isSanctionActive = linkedSanction ? Boolean(appliedSanctions[linkedSanction.code]) : false;

  // 4. Find relevant historical event
  const relatedHistory = HISTORY_EVENTS.find(
    (h) => h.locationKey === selectedEntityId || h.title.toLowerCase().includes(selectedEntityId.toLowerCase())
  );

  // 5. Find relevant quiz item
  const relevantQuiz = QUIZ_QUESTIONS.find(
    (q) =>
      q.linkedEntityId === selectedEntityId ||
      q.question.toLowerCase().includes(selectedEntityId.toLowerCase())
  );

  // Setup visual presentation metadata
  let title = selectedEntityId;
  let categoryLabel = 'Intelligence Dossier';
  let badgeColor = 'bg-parchment-800 text-parchment-200 border-parchment-600/30';
  let controller = 'Neutral / Contested';
  let overview = '';
  let strategicSignificance = '';
  let diplomaticImplication = '';

  if (city) {
    title = city.name;
    categoryLabel = `City • ${city.role}`;
    controller = city.controller;
    badgeColor =
      city.controller === 'Kharaan'
        ? 'bg-kharaan/20 text-kharaan border-kharaan/50'
        : city.controller === 'Zahari Front'
        ? 'bg-zahari/20 text-zahari-light border-zahari/50'
        : 'bg-seam/20 text-seam-light border-seam/50';
    overview = city.description;
    strategicSignificance = city.strategicSignificance;
    diplomaticImplication =
      city.controller === 'Kharaan'
        ? 'Anchor of Kharaan administrative sovereignty and northern logistical throughput.'
        : city.controller === 'Zahari Front'
        ? 'Vital bastion of indigenous resistance and economic leverage.'
        : 'Primary flashpoint on The Seam; status directly conditions ceasefire viability.';
  } else if (resource) {
    title = resource.name;
    categoryLabel = `Strategic Mineral • Analog: ${resource.analog.split('/')[0]}`;
    controller = resource.control;
    badgeColor = 'bg-sky-950 text-sky-300 border-sky-600/40';
    overview = resource.importance;
    strategicSignificance = resource.economicDetail;
    diplomaticImplication = `Access to ${resource.name} is a cornerstone of negotiations in Phase 2. Concord dependency drives bargaining positions.`;
  } else if (route) {
    title = route.name;
    categoryLabel = `Trunk Route • ${route.type.toUpperCase()}`;
    controller = route.controller;
    badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-600/40';
    overview = route.description;
    strategicSignificance = `Routing: ${route.path}. Essential for commercial throughput and military maneuver.`;
    diplomaticImplication = 'Disruption or reopening of this route directly alters economic leverage and civilian supply security.';
  } else if (corridor) {
    title = corridor.name;
    categoryLabel = `Humanitarian Lifeline • ${corridor.statusLabel}`;
    controller = 'Concord Monitored / Contested';
    badgeColor = 'bg-purple-950 text-purple-300 border-purple-600/40';
    overview = corridor.description;
    strategicSignificance = `Transit Corridor: ${corridor.route}. Critical for civilian survival and medical supplies.`;
    diplomaticImplication = `Vulnerability: ${corridor.vulnerability}. Negotiating formal security guarantees is a Phase 1/Phase 2 prerequisite.`;
  } else if (water) {
    title = water.name;
    categoryLabel = 'Vital Water Aquifer';
    controller = water.restricted ? 'Kharaan Siege Cordon' : 'Neutral Oasis';
    badgeColor = water.restricted
      ? 'bg-red-950 text-red-300 border-red-600/50'
      : 'bg-sky-950 text-sky-300 border-sky-600/50';
    overview = water.restricted
      ? 'Suni Wells is currently under Kharaan military encirclement, restricting water outflow to over 80,000 Zahari civilians.'
      : 'Desert aquifer vital for caravans and nomadic replenishment.';
    strategicSignificance = 'Water access is the foremost humanitarian flashpoint in the Saverine Expanse.';
    diplomaticImplication = 'The Suni Wells siege precipitated the Concord censure of Kharaan. Immediate relief is the Front\'s core red line.';
  } else if (ashenSite) {
    title = ashenSite.name;
    categoryLabel = 'Ashen Hand Hostile Cell';
    controller = 'The Ashen Hand (Extremist)';
    badgeColor = 'bg-red-950 text-red-400 border-red-500/50';
    overview = 'Confirmed insurgent node engaged in black-market Cinderstone trafficking, bombings, and corridor ambushes.';
    strategicSignificance = ASHEN_HAND.keyFact;
    diplomaticImplication = 'The Ashen Hand opposes all agreements and seeks to perpetuate conflict. Mutual defense against it is the sole documented common ground between the parties.';
  } else if (geo) {
    title = geo.name;
    categoryLabel = `Geography • ${geo.type.toUpperCase()}`;
    overview = geo.description;
    strategicSignificance = geo.strategicNote;
    diplomaticImplication = 'Geographic terrain features shape tactical defensibility and corridor security.';
  }

  const handleCenterCamera = () => {
    const coords = getEntityCoordinates(selectedEntityId);
    if (coords) {
      setCameraFocus({ x: coords.x, z: coords.z });
    }
  };

  return (
    <div className="absolute top-4 right-4 z-30 w-80 md:w-[410px] max-h-[calc(100vh-80px)] overflow-y-auto bg-parchment-950/95 border border-kharaan/40 rounded-xl p-4 md:p-5 backdrop-blur-md shadow-2xl text-xs font-sans text-parchment-200 animate-in slide-in-from-right duration-300">
      {/* Rivets */}
      <div className="rivet-tl" />
      <div className="rivet-tr" />
      <div className="rivet-bl" />
      <div className="rivet-br" />

      {/* Header */}
      <div className="flex justify-between items-start mb-3 border-b border-kharaan/25 pb-2.5">
        <div>
          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono border mb-1.5 ${badgeColor}`}>
            {categoryLabel}
          </span>
          <h3 className="text-xl font-serif font-black text-parchment-100 leading-tight">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-parchment-400">
            <span>Control: <strong className="text-parchment-200">{controller}</strong></span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCenterCamera}
            className="text-parchment-400 hover:text-kharaan-light p-1.5 rounded hover:bg-parchment-900 transition-colors"
            title="Center 3D Camera on this entity"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSelectedEntityId(null)}
            className="text-parchment-400 hover:text-parchment-100 p-1.5 rounded hover:bg-parchment-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Information */}
      <div className="space-y-3.5 mb-4">
        {/* Intelligence Overview */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-kharaan-light mb-1 font-bold">
            Tactical Overview
          </h4>
          <p className="text-[11px] leading-relaxed text-parchment-300">
            {overview}
          </p>
        </div>

        {/* Strategic Significance */}
        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-kharaan-light mb-1 font-bold">
            Strategic Significance (Why it Matters)
          </h4>
          <p className="text-[11px] leading-relaxed text-parchment-200 bg-parchment-900/70 p-2.5 rounded-lg border border-parchment-400/15">
            {strategicSignificance}
          </p>
        </div>

        {/* Diplomatic Relevance */}
        {diplomaticImplication && (
          <div className="bg-kharaan/10 border border-kharaan/20 p-2.5 rounded-lg">
            <strong className="text-[10px] font-mono uppercase tracking-wider text-kharaan block mb-0.5">
              Negotiation Implication:
            </strong>
            <p className="text-[11px] text-parchment-300 leading-snug">
              {diplomaticImplication}
            </p>
          </div>
        )}

        {/* Connected Strategic Entities */}
        {connections.connectedEntities.length > 0 && (
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-wider text-parchment-400 mb-1.5 font-bold flex items-center gap-1">
              <RouteIcon className="w-3 h-3 text-kharaan" />
              <span>Connected Strategic Links:</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {connections.connectedEntities.map((connId) => (
                <button
                  key={connId}
                  onClick={() => setSelectedEntityId(connId)}
                  className="px-2 py-0.5 rounded bg-parchment-900 hover:bg-kharaan hover:text-ink-dark text-parchment-300 text-[10px] font-mono border border-parchment-400/20 transition-all"
                >
                  {connId} →
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Related Historical Flashpoint */}
        {relatedHistory && (
          <div className="bg-parchment-900/50 border border-parchment-400/15 p-2.5 rounded-lg text-[11px]">
            <div className="flex items-center gap-1.5 font-mono text-kharaan font-bold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Historical Precedent: {relatedHistory.period}</span>
            </div>
            <strong className="block text-parchment-100 font-serif mb-0.5">
              {relatedHistory.title}
            </strong>
            <p className="text-parchment-400 text-[10px] leading-snug">
              {relatedHistory.description}
            </p>
          </div>
        )}

        {/* Linked Sanctions Indicator */}
        {linkedSanction && (
          <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] font-bold text-amber-300 font-mono">
                  Sanction Register: {linkedSanction.code}
                </span>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${isSanctionActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-parchment-900 text-parchment-400'}`}>
                {isSanctionActive ? 'SANCTION ACTIVE' : 'UNSANCTIONED'}
              </span>
            </div>
            <p className="text-[10px] text-amber-200/80 leading-snug">
              {linkedSanction.name} ({linkedSanction.designation})
            </p>
          </div>
        )}
      </div>

      {/* Action Footer: Test Knowledge Quiz Hook */}
      <div className="pt-2.5 border-t border-kharaan/25 flex gap-2">
        {relevantQuiz ? (
          <button
            onClick={() => openQuiz(relevantQuiz)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-kharaan hover:bg-kharaan-light text-ink-dark font-serif font-bold text-xs rounded-lg shadow-gold-glow transition-all hover:scale-[1.01]"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Test Scenario Mastery on this Entity</span>
          </button>
        ) : (
          <button
            onClick={handleCenterCamera}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-parchment-900 hover:bg-parchment-800 text-parchment-300 text-xs rounded border border-parchment-400/20 font-serif"
          >
            <Compass className="w-3.5 h-3.5 text-kharaan" />
            <span>Center 3D Camera on Position</span>
          </button>
        )}
      </div>
    </div>
  );
};
