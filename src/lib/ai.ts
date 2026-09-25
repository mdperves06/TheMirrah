// src/lib/ai.ts
// AI client with proxy endpoints (/api/delegate, /api/coach) and offline scripted fallbacks

import { evaluateOfflineSpeech, RubricEvaluation } from './scoring';
import { PERSONAS } from '../data/personas';

export interface DelegateCallParams {
  playerSeat: 'kharaan' | 'zahari' | 'concord';
  targetSeat: 'kharaan' | 'zahari' | 'concord';
  phase: number;
  playerActionType: string;
  playerMessage: string;
  stateSummary: {
    kharaanControl: number;
    zahariControl: number;
    kharaanTrust: number;
    zahariTrust: number;
    concordLeaning: number;
    activeSanctionsCount: number;
  };
}

export interface CrisisEvent {
  id: string;
  title: string;
  location: string;
  description: string;
  impactText: string;
  kharaanImpact: number; // effect on trust/control
  zahariImpact: number;
  choices: {
    id: string;
    text: string;
    description: string;
    consequence: string;
  }[];
}

// 1. Call AI Delegate endpoint with offline fallback
export async function callAiDelegate(params: DelegateCallParams): Promise<{ reply: string; source: 'claude' | 'fallback' }> {
  try {
    const res = await fetch('/api/delegate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return { reply: data.reply, source: 'claude' };
      }
    }
  } catch (err) {
    // Server down or offline, proceed to fallback
  }

  // Scripted high-authenticity in-character fallback
  const fallbackReply = generateFallbackDelegateReply(params);
  return { reply: fallbackReply, source: 'fallback' };
}

// 2. Call AI Coach endpoint with offline fallback
export async function callAiCoach(
  seat: 'kharaan' | 'zahari' | 'concord',
  speechText: string,
  mode: 'speech' | 'caucus' | 'clause'
): Promise<RubricEvaluation> {
  try {
    const res = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seat, speechText, mode }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.score !== undefined && data.perCriterion) {
        return data as RubricEvaluation;
      }
    }
  } catch (err) {
    // Server down or offline, fall back to algorithmic scoring
  }

  return evaluateOfflineSpeech(seat, speechText, mode);
}

// 3. Generate Crisis Card (Ashen Hand threat engine)
export function triggerAshenHandCrisis(phase: number, turnCount: number): CrisisEvent {
  const crises: CrisisEvent[] = [
    {
      id: "crisis-beymouth-bombing",
      title: "Explosion at Beymouth Grain Market",
      location: "Beymouth (The Seam)",
      description: "Cinderstone-enhanced munitions detonated in the central square of Beymouth just as joint trade monitors arrived. 18 casualties reported. Black-market detonator serials point to clandestine Ashen Hand networks.",
      impactText: "Seam transit halted. Both delegations accuse the other of security negligence.",
      kharaanImpact: -8,
      zahariImpact: -8,
      choices: [
        {
          id: "joint-investigation",
          text: "Authorize Joint Concord-Led Investigation",
          description: "Both parties permit neutral Concord inspectors access to Seam checkpoints.",
          consequence: "Stabilizes trust (+5 both), but delays Phase negotiations by 1 turn."
        },
        {
          id: "harden-seam",
          text: "Deploy Forward Heavy Garrisons",
          description: "Reinforce Sef Karib and forward Zahari redoubts against insurgent infiltrators.",
          consequence: "Reduces Ashen Hand freedom, but spikes frontline military tensions."
        }
      ]
    },
    {
      id: "crisis-mercy-ambush",
      title: "Convoy Ambush along Mercy Corridor",
      location: "Western Sand Ridges near AH-01 Base Camp",
      description: "Ashen Hand raiders attacked an unmarked international medical convoy en route to displaced encampments. Three aid trucks burned, drivers taken hostage.",
      impactText: "Humanitarian NGOs threaten total evacuation from western Expanse.",
      kharaanImpact: -5,
      zahariImpact: -12,
      choices: [
        {
          id: "escort-agreement",
          text: "Ratify Immediate Neutral Military Escorts",
          description: "Guarantee safe passage with mixed Concord-monitored escorts along the corridor.",
          consequence: "Secures humanitarian flow; Front gains credibility in Concord."
        },
        {
          id: "divert-vein",
          text: "Reroute Emergency Supplies via Smuggler's Vein",
          description: "Utilize clandestine southern trails to bypass the western ambush zone.",
          consequence: "Maintains aid delivery, but Kharaan lodges formal protest over illicit routes."
        }
      ]
    },
    {
      id: "crisis-suni-skirmish",
      title: "Water Pipeline Breach at Suni Wells",
      location: "Suni Wells Perimeter",
      description: "Saboteurs destroyed the primary intake valves feeding water to the southern settlements. Local Zahari irregulars fired upon Kharaan perimeter guards.",
      impactText: "Acute water shortage imminent for 80,000 civilians. Risk of full military clash.",
      kharaanImpact: -14,
      zahariImpact: -10,
      choices: [
        {
          id: "concord-engineering",
          text: "Admit Neutral Concord Repair Engineers",
          description: "Allow international technicians through Kharaan lines under temporary local truce.",
          consequence: "Averts civilian catastrophe; substantially raises Concord prestige."
        },
        {
          id: "unilateral-kharaan",
          text: "Kharaan Sovereign Repair & Quota Reallocation",
          description: "Kharaan royal engineers repair the valve and dictate strict daily quotas.",
          consequence: "Kharaan retains control, but Zahari outrage reaches boiling point."
        }
      ]
    },
    {
      id: "crisis-cinder-revelation",
      title: "Illicit Cinderstone Ring Busted in Orun Dal",
      location: "Orun Dal Rail Junction",
      description: "Concord customs impounded a freight consignment containing 40 tons of illegal Cinderstone concealed beneath Veridium slag, linked to Merchant House Velorn (N-01).",
      impactText: "Proof of war profiteering and arms smuggling through official Kharaan rail lines.",
      kharaanImpact: -10,
      zahariImpact: +4,
      choices: [
        {
          id: "freeze-velorn",
          text: "Enforce Immediate Assets Freeze on Velorn (N-01)",
          description: "Blacklist the merchant house and seize all freight containers.",
          consequence: "Cripples Ashen Hand black-market funding (-25%); penalizes corrupt middlemen."
        },
        {
          id: "joint-audit",
          text: "Mandate Full Supply-Chain Audit on Gold Road",
          description: "Concord inspectors placed at Adessa and Orun Dal logistics hubs.",
          consequence: "Kharaan Veridium exports slow temporarily, but international trust is restored."
        }
      ]
    }
  ];

  const index = (phase + turnCount) % crises.length;
  return crises[index];
}

// Helper to build realistic, rich scripted replies for offline play
function generateFallbackDelegateReply(params: DelegateCallParams): string {
  const { targetSeat, playerSeat, playerActionType, playerMessage } = params;

  if (targetSeat === 'kharaan') {
    if (playerActionType === 'concession' || playerMessage.toLowerCase().includes('veridium')) {
      return `The Crown acknowledges the constructive spirit of this intervention. Let it be registered that the Kingdom of Kharaan has never sought the deprivation of the Mirrah's inhabitants, but rather orderly Solmaran administration and the security of continental energy supply. If the assembly guarantees the unhindered flow of Veridium along the Gold Road without punitive Seam tariffs, we are prepared to review garrison posture at Sef Karib. However, we reiterate: sovereign administrative authority is not negotiable.`;
    }
    if (playerMessage.toLowerCase().includes('suni wells') || playerMessage.toLowerCase().includes('water')) {
      return `On the matter of Suni Wells, let the record be clear: the security cordon established by General Reth was necessitated by continuous irregular infiltration, not malice toward civilians. We are willing to entertain neutral Concord monitoring of the aquifer's civilian outflow, provided that demilitarized buffers are established and armed cells are expelled from the perimeter. Sovereign security cannot be compromised.`;
    }
    return `The Kingdom of Kharaan maintains its rightful Solmaran successor rights over the northern territories and its vital infrastructure. We remind all delegations that Concord industry runs on our Veridium and Solite. We seek an end to discriminatory trade sanctions and a verified ceasefire, but we will not bargain away legal sovereignty under the duress of insurgent demands.`;
  }

  if (targetSeat === 'zahari') {
    if (playerActionType === 'concession' || playerMessage.toLowerCase().includes('recognition') || playerMessage.toLowerCase().includes('referendum')) {
      return `For fourteen years since Queen Solvane's promised referendum was discarded, our people have endured military cordons, economic strangulation, and the stain of non-recognition. The Zahari Front welcomes this acknowledgment of our inherent rights. In exchange for a binding, Concord-guaranteed roadmap toward self-determination and an immediate end to the Suni Wells siege, we will commit to supplying international markets with refined Duskore from Vael Ridge under fair multilateral oversight.`;
    }
    if (playerMessage.toLowerCase().includes('duskore')) {
      return `Duskore is not merely a mineral to be bargained away to the highest bidder; it is the inheritance of our ancestral soil. We know well that the Concord's advanced aerospace and military manufactories cannot function without Vael Ridge. We will not ship a single ounce of rare earths while our children in Tishrin and the southern encampments are denied clean water from Suni Wells. Resolve the humanitarian crisis, and trade will follow.`;
    }
    return `The Zahari Front did not take up arms out of choice, but out of necessity born at the Tishrin Massacre. We represent the indigenous inhabitants of this Expanse. We demand three non-negotiable prerequisites for any durable framework: immediate lifting of the water blockade at Suni Wells, unhindered humanitarian corridors, and a formal seat at the Concord negotiating table. Anything less is an invitation to perpetual stalemate.`;
  }

  // Concord
  return `The Concord Assembly notes with grave concern the fragility of our present deliberations. For twenty-eight years, no framework in this Expanse has endured past three days. We cannot allow internal rivalries between Veridium-dependent realms and Duskore-seeking kingdoms to paralyze this plenary while the Ashen Hand detonates civilian hubs. We urge both parties to accept our proposed security guarantees, open the Mercy Corridor, and agree to phased sanctions adjustments tied strictly to verified demilitarization.`;
}
