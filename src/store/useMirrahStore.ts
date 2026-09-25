import { create } from 'zustand';
import { SANCTION_TARGETS } from '../data/scenario';
import { QuizQuestion, QuizTopic } from '../data/quizzes';
import {
  UserMasteryData,
  loadMastery,
  recordQuizAttempt,
  recordCoachScore,
  recordCampaignVictory,
} from '../lib/save';
import { CrisisEvent, triggerAshenHandCrisis, callAiDelegate } from '../lib/ai';
import { evaluateOfflineSpeech } from '../lib/scoring';

export type PartySeat = 'kharaan' | 'zahari' | 'concord';

export interface ActionConsequence {
  actionType: string;
  score: number;
  diplomaticImpact: string;
  economicImpact: string;
  humanitarianImpact: string;
  politicalImpact: string;
  directorCritique: string;
}

export interface CampaignMessage {
  id: string;
  sender: 'player' | 'kharaan' | 'zahari' | 'concord' | 'ashen' | 'director' | 'system';
  senderName: string;
  type: 'statement' | 'proposal' | 'caucus' | 'concession' | 'escalation' | 'crisis' | 'ruling';
  text: string;
  timestamp: string;
  score?: number;
  metadata?: Record<string, any>;
}

export interface MapLayerToggles {
  controlZones: boolean;
  resources: boolean;
  military: boolean;
  ashenHand: boolean;
  routes: boolean;
  corridors: boolean;
  sanctionsHeat: boolean;
  showStrategicLinks: boolean;
}

export interface SanctionEntry {
  code: string;
  instrument: 'travel_ban' | 'arms_embargo' | 'assets_freeze';
  appliedAt: number;
}

export interface MirrahState {
  // Campaign Seat & Progression
  playerSeat: PartySeat;
  diplomaticLens: 'kharaan' | 'zahari' | 'concord';
  currentPhase: 1 | 2 | 3;
  phaseTurnsLeft: number;
  phaseCompleted: boolean;
  campaignFinished: boolean;
  campaignOutcome: 'success' | 'collapse' | null;

  // Relationship & Trust Meters
  kharaanTrust: number; // 0 - 100
  zahariTrust: number;  // 0 - 100
  concordLeaning: number; // -50 (pro-Zahari) to +50 (pro-Kharaan)

  // Map & Control State
  kharaanControl: number; // e.g. 62%
  zahariControl: number;  // e.g. 38%
  seamContested: boolean;
  suniWellsStatus: 'restricted' | 'neutral_monitored' | 'liberated';
  beymouthStatus: 'active' | 'suspended' | 'bombed';

  // Map Layer Toggles & Inspection
  layerToggles: MapLayerToggles;
  selectedEntityId: string | null;
  cameraFocus: { x: number; z: number } | null;

  // Sanctions State (Phase 3 sandbox)
  appliedSanctions: Record<string, SanctionEntry>;
  sanctionsImpact: {
    kharaanLeverage: number; // % change
    zahariLeverage: number;  // % change
    ashenFunding: number;    // % reduction
    concordCredibility: number;
  };
  objectionModal: { targetName: string; objectingSeat: string; objectionText: string } | null;

  // Dialogue & Crisis Events
  campaignHistory: CampaignMessage[];
  activeCrisis: CrisisEvent | null;
  lastActionConsequence: ActionConsequence | null;
  isAiThinking: boolean;

  // Quiz & Mastery
  activeQuiz: QuizQuestion | null;
  mastery: UserMasteryData;

  // Actions
  setPlayerSeat: (seat: PartySeat) => void;
  setDiplomaticLens: (lens: 'kharaan' | 'zahari' | 'concord') => void;
  setCurrentPhase: (phase: 1 | 2 | 3) => void;
  toggleLayer: (layer: keyof MapLayerToggles) => void;
  setSelectedEntityId: (id: string | null) => void;
  setCameraFocus: (focus: { x: number; z: number } | null) => void;
  
  // Sanctions actions
  applySanction: (code: string, instrument: 'travel_ban' | 'arms_embargo' | 'assets_freeze') => void;
  removeSanction: (code: string) => void;
  closeObjectionModal: () => void;

  // Campaign turn loop
  submitPlayerAction: (actionType: 'statement' | 'proposal' | 'caucus' | 'concession' | 'escalation', messageText: string) => Promise<void>;
  resolveCrisisChoice: (choiceId: string) => void;
  dismissCrisis: () => void;
  dismissConsequence: () => void;
  advanceToNextPhase: () => void;
  resetCampaign: () => void;

  // Quiz & Coach
  openQuiz: (question: QuizQuestion) => void;
  closeQuiz: () => void;
  answerQuiz: (topic: QuizTopic, quizId: string, isCorrect: boolean) => void;
  submitCoachEvaluation: (score: number) => void;
}

export const useMirrahStore = create<MirrahState>((set, get) => ({
  // Initial state
  playerSeat: 'kharaan',
  diplomaticLens: 'kharaan',
  currentPhase: 1,
  phaseTurnsLeft: 5,
  phaseCompleted: false,
  campaignFinished: false,
  campaignOutcome: null,

  kharaanTrust: 55,
  zahariTrust: 45,
  concordLeaning: 5,

  kharaanControl: 62,
  zahariControl: 38,
  seamContested: true,
  suniWellsStatus: 'restricted',
  beymouthStatus: 'suspended',

  layerToggles: {
    controlZones: true,
    resources: true,
    military: true,
    ashenHand: true,
    routes: true,
    corridors: true,
    sanctionsHeat: false,
    showStrategicLinks: true,
  },
  selectedEntityId: null,
  cameraFocus: null,

  appliedSanctions: {},
  sanctionsImpact: {
    kharaanLeverage: 0,
    zahariLeverage: 0,
    ashenFunding: 0,
    concordCredibility: 50,
  },
  objectionModal: null,

  campaignHistory: [
    {
      id: 'init-1',
      sender: 'director',
      senderName: 'Concord Director',
      type: 'ruling',
      text: 'Concord Plenary session convened. All parties have taken their seats. Phase 1: Framework & Ceasefire negotiations are officially open.',
      timestamp: '00:00',
    },
  ],
  activeCrisis: null,
  lastActionConsequence: null,
  isAiThinking: false,

  activeQuiz: null,
  mastery: loadMastery(),

  // Mutators
  setPlayerSeat: (seat) => set({ playerSeat: seat }),
  setDiplomaticLens: (lens) => set({ diplomaticLens: lens }),
  setCurrentPhase: (phase) => set({ currentPhase: phase, phaseTurnsLeft: 5, phaseCompleted: false }),
  toggleLayer: (layer) =>
    set((state) => ({
      layerToggles: { ...state.layerToggles, [layer]: !state.layerToggles[layer] },
    })),
  setSelectedEntityId: (id) => set({ selectedEntityId: id }),
  setCameraFocus: (focus) => set({ cameraFocus: focus }),

  // Sanctions
  applySanction: (code, instrument) => {
    const target = SANCTION_TARGETS.find((t) => t.code === code);
    if (!target) return;

    set((state) => {
      const updated = {
        ...state.appliedSanctions,
        [code]: { code, instrument, appliedAt: Date.now() },
      };

      // Calculate dynamic impact readout
      let kLev = 0;
      let zLev = 0;
      let ashFundRed = 0;
      let cred = 50;

      Object.values(updated).forEach((item) => {
        const t = SANCTION_TARGETS.find((x) => x.code === item.code);
        if (!t) return;
        if (t.category === 'A') {
          ashFundRed += 18;
          cred += 6;
        } else if (t.category === 'B') {
          kLev -= 12;
          zLev += 6;
          cred += 4;
        } else if (t.category === 'C') {
          zLev -= 10;
          kLev += 5;
          cred += 2;
        } else if (t.category === 'D') {
          ashFundRed += 12;
          cred += 5;
        }
      });

      // Handle objection modal if target is Disputed
      let objection = state.objectionModal;
      if (target.isDisputed) {
        objection = {
          targetName: `${target.code} — ${target.name}`,
          objectingSeat: target.category === 'C' ? 'The Zahari Front' : 'Kingdom of Kharaan',
          objectionText: target.disputeNote || 'Formal diplomatic protest entered against designation of legitimate personnel under emergency sanctions.',
        };
      }

      return {
        appliedSanctions: updated,
        sanctionsImpact: {
          kharaanLeverage: Math.max(-60, kLev),
          zahariLeverage: Math.max(-50, zLev),
          ashenFunding: Math.min(95, ashFundRed),
          concordCredibility: Math.min(100, cred),
        },
        objectionModal: objection,
      };
    });
  },

  removeSanction: (code) => {
    set((state) => {
      const updated = { ...state.appliedSanctions };
      delete updated[code];
      return { appliedSanctions: updated };
    });
  },

  closeObjectionModal: () => set({ objectionModal: null }),
  dismissConsequence: () => set({ lastActionConsequence: null }),

  // Campaign action turn
  submitPlayerAction: async (actionType, messageText) => {
    const state = get();
    if (state.phaseTurnsLeft <= 0 || state.isAiThinking) return;

    // Evaluate against Best Delegate rubric
    const evalResult = evaluateOfflineSpeech(state.playerSeat, messageText, actionType === 'caucus' ? 'caucus' : 'speech');

    // Dynamic adjustments based on player action
    let deltaKTrust = 0;
    let deltaZTrust = 0;
    let deltaKControl = 0;
    let deltaZControl = 0;

    if (actionType === 'concession') {
      if (state.playerSeat === 'kharaan') {
        deltaZTrust += 10;
        deltaKControl -= 2;
        deltaZControl += 2;
      } else if (state.playerSeat === 'zahari') {
        deltaKTrust += 10;
      }
    } else if (actionType === 'escalation') {
      if (state.playerSeat === 'kharaan') {
        deltaZTrust -= 12;
        deltaKControl += 3;
        deltaZControl -= 3;
      } else {
        deltaKTrust -= 12;
      }
    } else if (actionType === 'proposal') {
      deltaKTrust += 4;
      deltaZTrust += 4;
    }

    const consequence: ActionConsequence = {
      actionType,
      score: evalResult.score,
      diplomaticImpact: `${deltaKTrust >= 0 ? '+' : ''}${deltaKTrust} Kharaan Trust / ${deltaZTrust >= 0 ? '+' : ''}${deltaZTrust} Zahari Trust`,
      economicImpact: actionType === 'concession' ? 'Tariff relief & cross-border freight guarantee signaled' : actionType === 'escalation' ? 'Trade flow friction increased along contested junctions' : 'Resource verification clauses tabled for joint audit',
      humanitarianImpact: actionType === 'concession' ? 'Relief Line civilian convoys granted security escort' : actionType === 'escalation' ? 'Suni Wells checkpoint alert level raised to amber' : 'Humanitarian access protocols acknowledged by chair',
      politicalImpact: state.playerSeat === 'kharaan' ? 'Sovereign integrity reaffirmed; hardliner pressure remains vigilant' : state.playerSeat === 'zahari' ? 'Self-determination advocacy strengthened across southern coalition' : 'Concord mediator neutrality balance preserved',
      directorCritique: evalResult.strengths[0] || evalResult.fixes[0] || 'Drafting registered by plenary secretariat.',
    };

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const playerMsg: CampaignMessage = {
      id: `msg-${Date.now()}`,
      sender: 'player',
      senderName: state.playerSeat === 'kharaan' ? 'Kingdom of Kharaan' : state.playerSeat === 'zahari' ? 'Zahari Front' : 'Concord Mediator',
      type: actionType,
      text: messageText,
      timestamp,
      score: evalResult.score,
      metadata: consequence,
    };

    set((s) => ({
      campaignHistory: [...s.campaignHistory, playerMsg],
      phaseTurnsLeft: s.phaseTurnsLeft - 1,
      isAiThinking: true,
      lastActionConsequence: consequence,
    }));

    // Target AI seat: if player is Kharaan -> Zahari responds; if Zahari -> Kharaan responds; if Concord -> both respond
    const targetSeat: PartySeat = state.playerSeat === 'kharaan' ? 'zahari' : state.playerSeat === 'zahari' ? 'kharaan' : 'kharaan';

    try {
      const aiResponse = await callAiDelegate({
        playerSeat: state.playerSeat,
        targetSeat,
        phase: state.currentPhase,
        playerActionType: actionType,
        playerMessage: messageText,
        stateSummary: {
          kharaanControl: state.kharaanControl,
          zahariControl: state.zahariControl,
          kharaanTrust: state.kharaanTrust,
          zahariTrust: state.zahariTrust,
          concordLeaning: state.concordLeaning,
          activeSanctionsCount: Object.keys(state.appliedSanctions).length,
        },
      });

      const aiMsg: CampaignMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: targetSeat,
        senderName: targetSeat === 'kharaan' ? 'Kingdom of Kharaan' : targetSeat === 'zahari' ? 'Zahari Front' : 'Concord of Crowns',
        type: 'statement',
        text: aiResponse.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Check if Ashen Hand triggers a crisis event (turn 3 or turn 1)
      let crisis: CrisisEvent | null = null;
      if (state.phaseTurnsLeft === 3 || state.phaseTurnsLeft === 1) {
        crisis = triggerAshenHandCrisis(state.currentPhase, state.phaseTurnsLeft);
      }

      // Check phase completion
      const newTurns = state.phaseTurnsLeft - 1;
      const isPhaseDone = newTurns <= 0;

      set((s) => ({
        campaignHistory: [...s.campaignHistory, aiMsg],
        kharaanTrust: Math.min(100, Math.max(10, s.kharaanTrust + deltaKTrust)),
        zahariTrust: Math.min(100, Math.max(10, s.zahariTrust + deltaZTrust)),
        kharaanControl: Math.min(80, Math.max(25, s.kharaanControl + deltaKControl)),
        zahariControl: Math.min(75, Math.max(20, s.zahariControl + deltaZControl)),
        activeCrisis: crisis,
        isAiThinking: false,
        phaseCompleted: isPhaseDone,
      }));
    } catch (err) {
      set({ isAiThinking: false });
    }
  },

  resolveCrisisChoice: (choiceId) => {
    const state = get();
    const crisis = state.activeCrisis;
    if (!crisis) return;

    const choice = crisis.choices.find((c) => c.id === choiceId);
    const logMsg: CampaignMessage = {
      id: `msg-crisis-res-${Date.now()}`,
      sender: 'system',
      senderName: 'Crisis Directorate',
      type: 'ruling',
      text: `Crisis Resolved: "${choice?.text}". Consequence: ${choice?.consequence}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set((s) => ({
      campaignHistory: [...s.campaignHistory, logMsg],
      activeCrisis: null,
      kharaanTrust: Math.min(100, Math.max(15, s.kharaanTrust + crisis.kharaanImpact)),
      zahariTrust: Math.min(100, Math.max(15, s.zahariTrust + crisis.zahariImpact)),
    }));
  },

  dismissCrisis: () => set({ activeCrisis: null }),

  advanceToNextPhase: () => {
    const state = get();
    if (state.currentPhase === 1) {
      set({
        currentPhase: 2,
        phaseTurnsLeft: 5,
        phaseCompleted: false,
        campaignHistory: [
          ...state.campaignHistory,
          {
            id: `phase-2-${Date.now()}`,
            sender: 'director',
            senderName: 'Concord Director',
            type: 'ruling',
            text: 'Phase 1 concluded. Advancing to Phase 2: Territory & Resources (Seam border line, Veridium/Duskore access, corridors).',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      });
    } else if (state.currentPhase === 2) {
      set({
        currentPhase: 3,
        phaseTurnsLeft: 5,
        phaseCompleted: false,
        campaignHistory: [
          ...state.campaignHistory,
          {
            id: `phase-3-${Date.now()}`,
            sender: 'director',
            senderName: 'Concord Director',
            type: 'ruling',
            text: 'Phase 2 concluded. Advancing to Phase 3: Sanctions & Repercussions (Target list, travel bans, assets freeze, arms embargoes).',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      });
    } else {
      // Completed all 3 phases
      const success = state.kharaanTrust >= 40 && state.zahariTrust >= 40;
      const updatedMastery = recordCampaignVictory(state.playerSeat);

      set({
        campaignFinished: true,
        campaignOutcome: success ? 'success' : 'collapse',
        mastery: updatedMastery,
      });
    }
  },

  resetCampaign: () => {
    set({
      currentPhase: 1,
      phaseTurnsLeft: 5,
      phaseCompleted: false,
      campaignFinished: false,
      campaignOutcome: null,
      kharaanTrust: 55,
      zahariTrust: 45,
      concordLeaning: 5,
      kharaanControl: 62,
      zahariControl: 38,
      suniWellsStatus: 'restricted',
      beymouthStatus: 'suspended',
      activeCrisis: null,
      campaignHistory: [
        {
          id: `reset-${Date.now()}`,
          sender: 'director',
          senderName: 'Concord Director',
          type: 'ruling',
          text: 'Campaign session restarted. Phase 1: Framework & Ceasefire negotiations opened.',
          timestamp: '00:00',
        },
      ],
    });
  },

  // Quizzes & Coach
  openQuiz: (question) => set({ activeQuiz: question }),
  closeQuiz: () => set({ activeQuiz: null }),
  answerQuiz: (topic, quizId, isCorrect) => {
    const updated = recordQuizAttempt(topic, quizId, isCorrect);
    set({ mastery: updated });
  },
  submitCoachEvaluation: (score) => {
    const updated = recordCoachScore(score);
    set({ mastery: updated });
  },
}));
