// src/lib/scoring.ts
// Best Delegate Scoring Rubric Implementation (Section 6)

export interface CriteriaBreakdown {
  scenarioAccuracy: number;      // max 25
  diplomacyTone: number;         // max 20
  coalitionLogic: number;        // max 20
  resourcefulnessLeverage: number; // max 20
  draftingSpecificity: number;   // max 15
}

export interface RubricEvaluation {
  score: number;                 // 0 - 100
  perCriterion: CriteriaBreakdown;
  strengths: string[];
  fixes: string[];
  exemplarLine: string;
}

// Offline algorithmic rubric evaluator (used when server/API key is not present)
export function evaluateOfflineSpeech(
  seat: 'kharaan' | 'zahari' | 'concord',
  speechText: string,
  type: 'speech' | 'caucus' | 'clause' = 'speech'
): RubricEvaluation {
  const text = speechText.toLowerCase();

  // 1. Scenario accuracy keywords (up to 25 pts)
  const accuracyKeywords = [
    'veridium', 'duskore', 'solite', 'cinderstone', 'ashsalt',
    'suni wells', 'tishrin', 'beymouth', 'qasar gate', 'vael ridge', 'gold road', 'smuggler',
    'seam', 'referendum', 'solvane', 'aldavar', 'ashen hand', 'concord', 'ceasefire'
  ];
  let accuracyCount = 0;
  for (const kw of accuracyKeywords) {
    if (text.includes(kw)) accuracyCount++;
  }
  const scenarioAccuracy = Math.min(25, Math.max(8, Math.round(accuracyCount * 4.5)));

  // 2. Diplomacy & Tone (up to 20 pts)
  const diplomaticTerms = [
    'distinguished', 'delegates', 'sovereignty', 'humanitarian', 'assembly',
    'propose', 'table', 'cordially', 'urge', 'reaffirm', 'imperative', 'mandate',
    'framework', 'constructive', 'compromise', 'protocol'
  ];
  let dipCount = 0;
  for (const term of diplomaticTerms) {
    if (text.includes(term)) dipCount++;
  }
  const hasAggression = text.includes('destroy you') || text.includes('liars') || text.includes('traitors') || text.includes('idiots');
  let diplomacyTone = Math.min(20, Math.max(6, Math.round(dipCount * 3.5)));
  if (hasAggression) diplomacyTone = Math.max(3, diplomacyTone - 8);

  // 3. Coalition logic (up to 20 pts)
  const coalitionTerms = [
    'concord members', 'neutral', 'division', 'back-channel', 'common threat',
    'ashen hand', 'extremism', 'multilateral', 'joint', 'guarantor', 'bloc', 'consensus'
  ];
  let coalCount = 0;
  for (const term of coalitionTerms) {
    if (text.includes(term)) coalCount++;
  }
  const coalitionLogic = Math.min(20, Math.max(6, Math.round(coalCount * 4.0)));

  // 4. Resourcefulness & leverage (up to 20 pts)
  let leverageCount = 0;
  if (seat === 'kharaan') {
    if (text.includes('veridium') || text.includes('energy') || text.includes('sanction') || text.includes('export')) leverageCount += 2;
    if (text.includes('administration') || text.includes('order') || text.includes('quota')) leverageCount += 2;
  } else if (seat === 'zahari') {
    if (text.includes('duskore') || text.includes('rare earth') || text.includes('refinery')) leverageCount += 2;
    if (text.includes('suni wells') || text.includes('water') || text.includes('recognition')) leverageCount += 2;
  } else {
    // Concord
    if (text.includes('sanction') || text.includes('freeze') || text.includes('embargo')) leverageCount += 2;
    if (text.includes('corridor') || text.includes('recognition') || text.includes('aid')) leverageCount += 2;
  }
  const resourcefulnessLeverage = Math.min(20, Math.max(5, Math.round(leverageCount * 4.2)));

  // 5. Drafting & Specificity (up to 15 pts)
  const operativeVerbs = [
    'calls upon', 'mandates', 'urges', 'establishes', 'authorizes',
    'further invites', 'demands', 'directs', 'resolves', 'requests',
    'percent', 'phase', 'monitor', 'verification', 'buffer'
  ];
  let draftCount = 0;
  for (const verb of operativeVerbs) {
    if (text.includes(verb)) draftCount++;
  }
  if (text.length > 250) draftCount++;
  const draftingSpecificity = Math.min(15, Math.max(4, Math.round(draftCount * 3.2)));

  const totalScore = scenarioAccuracy + diplomacyTone + coalitionLogic + resourcefulnessLeverage + draftingSpecificity;

  // Generate dynamic strengths, fixes, and exemplar line based on seat & score
  const strengths: string[] = [];
  const fixes: string[] = [];

  if (scenarioAccuracy >= 18) {
    strengths.push("Excellent retention and deployment of verified Mirrah scenario lore and accurate regional designations.");
  } else {
    fixes.push("Ground your argument deeper in concrete facts (cite the Tishrin Massacre, the 14-year-old cancelled referendum, or specific resource hubs).");
  }

  if (diplomacyTone >= 15) {
    strengths.push("Maintained an authentic, high-level diplomatic register suited for an emergency Concord plenary.");
  } else {
    fixes.push("Elevate parliamentary tone: avoid raw emotive ultimatums and adopt formal multilateral phrasing.");
  }

  if (coalitionLogic >= 14) {
    strengths.push("Skillfully targeted the fractures in the room, distinguishing between neutral observers and partisan blocs.");
  } else {
    fixes.push("Exploit Concord internal divisions: remember that northern realms need Veridium while maritime realms covet Duskore.");
  }

  if (strengths.length < 2) {
    strengths.push("Clear strategic intent and proactive defense of core constituency survival.");
  }
  if (fixes.length < 2) {
    fixes.push("Add verifiable enforcement mechanisms: specify inspection protocols or phased verification timelines.");
  }

  let exemplarLine = "";
  if (seat === 'kharaan') {
    exemplarLine = '"The Kingdom stands ready to restore full Veridium grid allocations across all Concord realms, conditioned solely upon the immediate lifting of unilateral Seam freight embargoes and neutral monitoring of the Sef Karib perimeter."';
  } else if (seat === 'zahari') {
    exemplarLine = '"We will guarantee bilateral Duskore supply contracts to any realm willing to formally co-sponsor the demilitarization of the Suni Wells aquifer under international humanitarian auspices."';
  } else {
    exemplarLine = '"The Concord Assembly hereby establishes a 72-hour provisional security corridor along the Seam Crossing, overseen by neutral engineering observers, tying sanctions relief directly to verified stand-downs at forward redoubts."';
  }

  return {
    score: totalScore,
    perCriterion: {
      scenarioAccuracy,
      diplomacyTone,
      coalitionLogic,
      resourcefulnessLeverage,
      draftingSpecificity,
    },
    strengths,
    fixes,
    exemplarLine,
  };
}
