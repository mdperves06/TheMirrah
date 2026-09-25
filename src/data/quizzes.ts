// src/data/quizzes.ts
// Question bank of ≥40 items covering every aspect of "The Mirrah" scenario

export type QuizTopic = 'history' | 'parties' | 'geography' | 'resources' | 'routes' | 'ashenHand' | 'sanctions' | 'crisis';
export type QuizDifficulty = 'novice' | 'intermediate' | 'expert';

export interface QuizQuestion {
  id: string;
  topic: QuizTopic;
  difficulty: QuizDifficulty;
  type: 'mcq' | 'true_false' | 'map_locate';
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
  linkedEntityId?: string; // For auto-highlighting in Atlas or Codex
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // 1. History
  {
    id: "q-hist-01",
    topic: "history",
    difficulty: "novice",
    type: "mcq",
    question: "What event ~45 years ago led scattered nomadic tribes to formally unite into the Zahari Front?",
    options: [
      "The First March of King Aldavar II",
      "The Tishrin Massacre",
      "The Discovery of Veridium",
      "The Collapse of the Solmaran Dominion"
    ],
    correctAnswer: 1,
    explanation: "Kharaan forces fired upon Zahari civilian protesters demanding water rights ~45 years ago at Tishrin, galvanizing the tribes into the Zahari Front.",
    linkedEntityId: "Tishrin"
  },
  {
    id: "q-hist-02",
    topic: "history",
    difficulty: "novice",
    type: "mcq",
    question: "What military conflict froze the current front line into what is now known as 'The Seam'?",
    options: [
      "The 18-month Seam War ~35 years ago",
      "The Solmaran War of Succession",
      "The Siege of Suni Wells",
      "The First March of King Aldavar II"
    ],
    correctAnswer: 0,
    explanation: "An 18-month stalemate ended with a Concord-brokered ceasefire that froze the front line into 'The Seam.'",
    linkedEntityId: "TheSeam"
  },
  {
    id: "q-hist-03",
    topic: "history",
    difficulty: "intermediate",
    type: "mcq",
    question: "Which broken promise ~14 years ago constitutes the defining historical grievance of the Zahari Front?",
    options: [
      "The unilateral cancellation of the promised referendum by Kharaan",
      "The expulsion of Zahari delegates from the Concord Assembly",
      "The bombing of the Qasar Gate peace summit",
      "The annexation of the Sundered Sea ports"
    ],
    correctAnswer: 0,
    explanation: "Queen Solvane I promised a self-determination referendum ~20 yrs ago, but Kharaan voided it ~14 yrs ago, collapsing the ceasefire and cementing Zahari resistance.",
    linkedEntityId: "ZaharOun"
  },
  {
    id: "q-hist-04",
    topic: "history",
    difficulty: "intermediate",
    type: "true_false",
    question: "True or False: The Ashen Hand emerged immediately after the ancient collapse of the Solmaran Dominion 150 years ago.",
    options: ["True", "False"],
    correctAnswer: 1,
    explanation: "False. The Ashen Hand formed ~28 years ago as an extremist splinter faction after the collapse of the Qasar Accords.",
    linkedEntityId: "QasarGate"
  },
  {
    id: "q-hist-05",
    topic: "history",
    difficulty: "expert",
    type: "mcq",
    question: "What specific action ~2 years ago resulted in the Concord of Crowns issuing its first formal censure of the Kingdom of Kharaan?",
    options: [
      "The encirclement and water cutoff of Suni Wells",
      "The cancellation of Queen Solvane's referendum",
      "The construction of forward FOBs at Sef Karib",
      "The imposition of freight tariffs along the Gold Road"
    ],
    correctAnswer: 0,
    explanation: "Kharaan forces encircled Suni Wells and restricted its aquifer access, prompting the Concord's historic first censure of a founding kingdom.",
    linkedEntityId: "SuniWells"
  },
  {
    id: "q-hist-06",
    topic: "history",
    difficulty: "novice",
    type: "mcq",
    question: "Which monarch claimed Solmaran successor rights over the entire Mirrah Expanse ~90 years ago without Concord objection?",
    options: [
      "King Aldavar II",
      "Queen Solvane I",
      "King Aldavar I",
      "Lord Casvan Duur"
    ],
    correctAnswer: 0,
    explanation: "King Aldavar II declared the First March ~90 years ago, invoking Solmaran successor rights.",
    linkedEntityId: "KharaanCity"
  },

  // 2. Parties
  {
    id: "q-part-01",
    topic: "parties",
    difficulty: "novice",
    type: "mcq",
    question: "Approximately what percentage of the Mirrah territory is administered by the Kingdom of Kharaan?",
    options: ["~38%", "~50%", "~62%", "~75%"],
    correctAnswer: 2,
    explanation: "Kharaan controls ~62% of the territory, mostly in the northern plains, industrial centers, and major routes.",
    linkedEntityId: "KharaanCity"
  },
  {
    id: "q-part-02",
    topic: "parties",
    difficulty: "intermediate",
    type: "mcq",
    question: "What is the primary sovereign legal claim asserted by the Kingdom of Kharaan over the territory?",
    options: [
      "Solmaran Dominion successor rights and unbroken legal title",
      "Concord Security Council Mandate 404",
      "Indigenous tribal lineage through Queen Solvane",
      "Right of conquest following the Seam War"
    ],
    correctAnswer: 0,
    explanation: "Kharaan rests its claim on being the legitimate successor realm to the ancient Solmaran Dominion.",
    linkedEntityId: "KharaanCity"
  },
  {
    id: "q-part-03",
    topic: "parties",
    difficulty: "novice",
    type: "mcq",
    question: "Where is the declared capital of the Zahari Front located?",
    options: ["Adessa", "Zahar-Oun", "Tishrin", "Vael Ridge"],
    correctAnswer: 1,
    explanation: "Zahar-Oun is the declared political and administrative capital of the Zahari Front in the south.",
    linkedEntityId: "ZaharOun"
  },
  {
    id: "q-part-04",
    topic: "parties",
    difficulty: "intermediate",
    type: "mcq",
    question: "Why is the Concord of Crowns described as 'internally divided' regarding the conflict?",
    options: [
      "Member realms dispute maritime borders in the Sundered Sea",
      "Some members depend on Kharaan's Veridium while others seek Zahari Duskore",
      "Half the members formally recognize the Ashen Hand as a legitimate state",
      "Disputes over religious holy sites in the Golden Wastes"
    ],
    correctAnswer: 1,
    explanation: "Northern and agrarian members depend on Kharaan's Veridium and Solite, while industrial realms covet Zahari Duskore.",
    linkedEntityId: "concord"
  },
  {
    id: "q-part-05",
    topic: "parties",
    difficulty: "expert",
    type: "true_false",
    question: "True or False: The Zahari Front is currently a voting sovereign member of the Concord of Crowns.",
    options: ["True", "False"],
    correctAnswer: 1,
    explanation: "False. The Zahari Front is an unrecognized non-state resistance authority without Concord membership or voting rights.",
    linkedEntityId: "ZaharOun"
  },

  // 3. Geography
  {
    id: "q-geo-01",
    topic: "geography",
    difficulty: "novice",
    type: "mcq",
    question: "Which geographic feature acts as an impassable natural barrier across the far north of the Mirrah?",
    options: [
      "The Spine",
      "The Golden Wastes (dune fields)",
      "The Gash",
      "The Sundered Sea"
    ],
    correctAnswer: 1,
    explanation: "The Golden Wastes are vast, raised northern dune fields forming a natural defensive buffer.",
    linkedEntityId: "goldenWastes"
  },
  {
    id: "q-geo-02",
    topic: "geography",
    difficulty: "novice",
    type: "mcq",
    question: "What is 'The Gash' in the Mirrah Expanse?",
    options: [
      "A coastal bay along the Sundered Sea",
      "A deep carved canyon and choke point in the center-west",
      "The formal border checkpoint between Kharaan and the Concord",
      "An abandoned open-pit Veridium quarry"
    ],
    correctAnswer: 1,
    explanation: "The Gash is a deep tectonic canyon centered ~x:28, z:55 that constricts north-south overland movement.",
    linkedEntityId: "theGash"
  },
  {
    id: "q-geo-03",
    topic: "geography",
    difficulty: "intermediate",
    type: "mcq",
    question: "Which mountain range dominates the eastern edge of the Mirrah, controlling access and harboring Cinderstone?",
    options: ["The Spine", "Vael Ridge", "The Solmaran Escarpment", "The Iron Crags"],
    correctAnswer: 0,
    explanation: "The Spine is the eastern mountain barrier (x: 80–100) rich in Cinderstone deposits.",
    linkedEntityId: "theSpine"
  },
  {
    id: "q-geo-04",
    topic: "geography",
    difficulty: "intermediate",
    type: "mcq",
    question: "Which of the three major oases is currently under military encirclement and water restriction?",
    options: ["Vire Oasis", "Tal Oasis", "Suni Wells", "Adessa Springs"],
    correctAnswer: 2,
    explanation: "Suni Wells is encircled by Kharaan forces, creating an acute humanitarian water crisis for southern enclaves.",
    linkedEntityId: "SuniWells"
  },
  {
    id: "q-geo-05",
    topic: "geography",
    difficulty: "expert",
    type: "true_false",
    question: "True or False: The three Salt Flats containing Ashsalt are exclusively located within Kharaan-administered territory.",
    options: ["True", "False"],
    correctAnswer: 1,
    explanation: "False. The Salt Flats span across both zones and have historically functioned as de facto neutral shared territory.",
    linkedEntityId: "Ashsalt_flats"
  },

  // 4. Resources
  {
    id: "q-res-01",
    topic: "resources",
    difficulty: "novice",
    type: "mcq",
    question: "Who controls Vael Ridge, and which crucial resource is mined there?",
    options: [
      "Kingdom of Kharaan; Veridium",
      "The Zahari Front; Duskore",
      "Concord of Crowns; Solite",
      "The Ashen Hand; Cinderstone"
    ],
    correctAnswer: 1,
    explanation: "Vael Ridge is controlled by the Zahari Front and is the sole source of Duskore (rare earth minerals).",
    linkedEntityId: "VaelRidge"
  },
  {
    id: "q-res-02",
    topic: "resources",
    difficulty: "intermediate",
    type: "mcq",
    question: "Which real-world element or commodity is the strategic analog of the northern resource 'Veridium'?",
    options: [
      "Lithium (battery energy storage)",
      "Crude Petroleum",
      "Industrial Diamonds",
      "Uranium Ore"
    ],
    correctAnswer: 0,
    explanation: "Veridium is the scenario's lithium analog, essential for clean energy storage and Concord power grids.",
    linkedEntityId: "Veridium"
  },
  {
    id: "q-res-03",
    topic: "resources",
    difficulty: "intermediate",
    type: "mcq",
    question: "What is the strategic analog and primary economic application of 'Solite' mined around Marquum?",
    options: [
      "Phosphate / Agricultural fertilizer",
      "Titanium / Armor plating",
      "Natural Gas / Heating fuel",
      "Silicon / Semiconductor wafers"
    ],
    correctAnswer: 0,
    explanation: "Solite is a phosphate analog mined in Marquum, indispensable for agricultural grain output across the kingdoms.",
    linkedEntityId: "Marquum"
  },
  {
    id: "q-res-04",
    topic: "resources",
    difficulty: "intermediate",
    type: "mcq",
    question: "Which resource is illicitly mined along the Spine and trafficked on the black market to fund the Ashen Hand?",
    options: ["Cinderstone", "Duskore", "Veridium", "Ashsalt"],
    correctAnswer: 0,
    explanation: "Cinderstone (a clean solid gas analog) is trafficked via the black-market 'Cinder Exchange' by Ashen Hand cells.",
    linkedEntityId: "Cinderstone_Spine"
  },
  {
    id: "q-res-05",
    topic: "resources",
    difficulty: "expert",
    type: "mcq",
    question: "Why is 'Ashsalt' considered by diplomats as the prime candidate for initial joint-management treaties?",
    options: [
      "It is shared across dried lake beds in both zones with a history of neutral harvesting",
      "It has zero economic or industrial value to either party",
      "Kharaan surrendered all salt harvesting rights during the Qasar Accords",
      "The Ashen Hand strictly forbids its extraction"
    ],
    correctAnswer: 0,
    explanation: "Ashsalt deposits span both territories and have historically enjoyed de facto neutral harvesting, making it low-friction for confidence-building.",
    linkedEntityId: "Ashsalt_flats"
  },
  {
    id: "q-res-06",
    topic: "resources",
    difficulty: "expert",
    type: "mcq",
    question: "Match the resource to its accurate real-world analog: Duskore is to ____ as Veridium is to ____.",
    options: [
      "Rare earths; Lithium",
      "Phosphate; Natural gas",
      "Petroleum; Uranium",
      "Potash; Cobalt"
    ],
    correctAnswer: 0,
    explanation: "Duskore represents heavy rare earths (precision military/tech), while Veridium represents lithium (energy storage).",
    linkedEntityId: "Duskore"
  },

  // 5. Routes & Corridors
  {
    id: "q-rot-01",
    topic: "routes",
    difficulty: "novice",
    type: "mcq",
    question: "Which highway, constructed ~75 years ago, serves as Kharaan's primary mineral export artery to the Spine?",
    options: [
      "The Gold Road",
      "The Iron Line",
      "The Smuggler's Vein",
      "The Duskore Run"
    ],
    correctAnswer: 0,
    explanation: "The Gold Road connects Kharaan City, Tal Vureen, Adessa, and Orun Dal directly to eastern export routes.",
    linkedEntityId: "GoldRoad"
  },
  {
    id: "q-rot-02",
    topic: "routes",
    difficulty: "intermediate",
    type: "mcq",
    question: "What is the primary function of Kharaan's 'Iron Line' route?",
    options: [
      "A dedicated military supply corridor from the north directly to the Sef Karib Seam garrison",
      "A commercial passenger railroad connecting to the Sundered Sea ports",
      "A pipeline carrying liquid Solite to southern agriculture",
      "An unfortified pilgrimage trail to the Golden Wastes"
    ],
    correctAnswer: 0,
    explanation: "The Iron Line is Kharaan's military corridor funneling heavy armor and supplies straight to Sef Karib on the Seam.",
    linkedEntityId: "IronLine"
  },
  {
    id: "q-rot-03",
    topic: "routes",
    difficulty: "novice",
    type: "mcq",
    question: "Which clandestine route enables the Zahari Front to bypass northern checkpoints and export minerals?",
    options: [
      "The Smuggler's Vein",
      "The Seam Crossing",
      "The Mercy Corridor",
      "The Gold Road"
    ],
    correctAnswer: 0,
    explanation: "The Smuggler's Vein routes through Imghala and dry southern wadis to bypass Kharaan military cordons.",
    linkedEntityId: "SmugglersVein"
  },
  {
    id: "q-rot-04",
    topic: "routes",
    difficulty: "intermediate",
    type: "mcq",
    question: "What is the current operational status of the Seam Crossing passing through Beymouth?",
    options: [
      "Suspended and highly volatile following the market bombing",
      "Fully demilitarized and guarded by Concord peacekeepers",
      "Solely dedicated to commercial Veridium rail freight",
      "Permanent international demilitarized green zone"
    ],
    correctAnswer: 0,
    explanation: "Concord suspended all formal Seam trade ~4 years ago following the Beymouth bombing that killed 34.",
    linkedEntityId: "SeamCrossing"
  },
  {
    id: "q-rot-05",
    topic: "routes",
    difficulty: "expert",
    type: "mcq",
    question: "What is the key vulnerability facing the western 'Mercy Corridor'?",
    options: [
      "The Ashen Hand western base camp (AH-01) lies within striking range of convoy routes",
      "Tidal flooding from the Sundered Sea during winter seasons",
      "Total lack of paved roads or motor transport capability",
      "Opposition from the Zahari Front due to religious customs"
    ],
    correctAnswer: 0,
    explanation: "The western Mercy Corridor runs close to Varak the Grey's hidden base camp (AH-01), subjecting convoys to ambush.",
    linkedEntityId: "MercyCorridor"
  },
  {
    id: "q-rot-06",
    topic: "routes",
    difficulty: "expert",
    type: "mcq",
    question: "Which proposed humanitarian corridor is stalled because neither side has agreed to cross-Seam inspection terms?",
    options: [
      "Gate Relief (Qasar Gate to Zahar-Oun)",
      "Refugee Line (Beymouth to Tishrin)",
      "Mercy Corridor (West to Beymouth)",
      "Relief Line (South to Zahar-Oun)"
    ],
    correctAnswer: 0,
    explanation: "Gate Relief across Qasar Gate remains purely proposed due to mutual mistrust over frontline inspection protocols.",
    linkedEntityId: "GateRelief"
  },

  // 6. Ashen Hand
  {
    id: "q-ash-01",
    topic: "ashenHand",
    difficulty: "novice",
    type: "mcq",
    question: "Why is the Ashen Hand NOT a playable or negotiable party in the crisis drill?",
    options: [
      "Its objective is the perpetuation of conflict; it opposes any ceasefire and targets agreements",
      "It was completely eradicated during the Seam War",
      "It has already signed a secret treaty with Kharaan",
      "It is merely a peaceful religious movement without weapons"
    ],
    correctAnswer: 0,
    explanation: "The Ashen Hand seeks eternal conflict and operates solely as an environmental antagonist to wreck peace deals.",
    linkedEntityId: "ashen"
  },
  {
    id: "q-ash-02",
    topic: "ashenHand",
    difficulty: "intermediate",
    type: "mcq",
    question: "What unique diplomatic fact makes the Ashen Hand significant in negotiations between Kharaan and the Front?",
    options: [
      "Neither party controls it and both have suffered its attacks, making it their only shared common ground",
      "The Front receives all its funding and heavy weapons from it",
      "Kharaan uses it as a licensed private military contractor",
      "It holds an observer seat in the Concord Assembly"
    ],
    correctAnswer: 0,
    explanation: "Shared hatred and vulnerability to the Ashen Hand is the single documented point of common interest between the two rivals.",
    linkedEntityId: "ashen"
  },
  {
    id: "q-ash-03",
    topic: "ashenHand",
    difficulty: "novice",
    type: "mcq",
    question: "Who is designated AH-01 and recognized as the supreme military commander of the Ashen Hand?",
    options: [
      "Varak the Grey",
      "Sorn Delvak",
      "General Tovan Reth",
      "Lord Casvan Duur"
    ],
    correctAnswer: 0,
    explanation: "Varak the Grey is supreme commander operating out of the western base camp (AH-01).",
    linkedEntityId: "AH_baseCamp_west"
  },
  {
    id: "q-ash-04",
    topic: "ashenHand",
    difficulty: "intermediate",
    type: "mcq",
    question: "Which operative (AH-03) engineered the explosives used in the deadly Beymouth market bombing?",
    options: [
      "Sorn Delvak",
      "Mira Ashvane",
      "Davan Mir",
      "Aldric Sorne"
    ],
    correctAnswer: 0,
    explanation: "Sorn Delvak (AH-03) is the chief bomb-maker and mastermind behind the Cinderstone munitions.",
    linkedEntityId: "Beymouth"
  },
  {
    id: "q-ash-05",
    topic: "ashenHand",
    difficulty: "expert",
    type: "mcq",
    question: "How many confirmed active operational sites does the Ashen Hand maintain across the Mirrah?",
    options: ["6 confirmed sites", "2 sites", "12 sites", "Zero fixed sites"],
    correctAnswer: 0,
    explanation: "The Ashen Hand operates 6 confirmed sites across both territories, including a western base camp and Spine cell.",
    linkedEntityId: "ashen"
  },

  // 7. Sanctions
  {
    id: "q-sanc-01",
    topic: "sanctions",
    difficulty: "novice",
    type: "mcq",
    question: "Which of the three Concord sanction instruments is authorized to target an entire political party or military faction?",
    options: [
      "Arms Embargo",
      "Travel Ban",
      "Assets Freeze",
      "Diplomatic Expulsion"
    ],
    correctAnswer: 0,
    explanation: "Under Concord rules, an Arms Embargo can target individuals, entities, and entire parties; Travel Bans only target individuals.",
    linkedEntityId: "arms_embargo"
  },
  {
    id: "q-sanc-02",
    topic: "sanctions",
    difficulty: "intermediate",
    type: "mcq",
    question: "Why is Commander Yara Sunn's designation (Z-01) on the Concord sanctions list marked as 'Disputed'?",
    options: [
      "The Front defends her as legitimate defense against Kharaan aggression; Kharaan labels her a terrorist",
      "Her identity has never been confirmed by Concord intelligence",
      "She has already defected to the Concord peacekeeping force",
      "She was pardoned by King Aldavar II"
    ],
    correctAnswer: 0,
    explanation: "Category C targets are heavily disputed: Front leaders view her as a hero defending native soil; Kharaan demands she be blacklisted.",
    linkedEntityId: "QasarGate"
  },
  {
    id: "q-sanc-03",
    topic: "sanctions",
    difficulty: "intermediate",
    type: "mcq",
    question: "Which instrument CANNOT legally target a corporation or state agency under Concord sanction rules?",
    options: [
      "Travel Ban",
      "Assets Freeze",
      "Arms Embargo",
      "Export Prohibition"
    ],
    correctAnswer: 0,
    explanation: "Travel Bans apply exclusively to natural persons (individuals), not legal entities or corporations.",
    linkedEntityId: "travel_ban"
  },
  {
    id: "q-sanc-04",
    topic: "sanctions",
    difficulty: "expert",
    type: "mcq",
    question: "Which Category B target is the state extraction conglomerate accused of forced Zahari labor in northern mines?",
    options: [
      "Mirrah Extraction Authority (K-02)",
      "Gold Road Logistics Consortium (K-05)",
      "The Cinder Exchange (AH-04)",
      "Merchant House Velorn (N-01)"
    ],
    correctAnswer: 0,
    explanation: "The Mirrah Extraction Authority (K-02) operates northern Veridium mines and faces severe forced labor accusations.",
    linkedEntityId: "Adessa"
  },
  {
    id: "q-sanc-05",
    topic: "sanctions",
    difficulty: "expert",
    type: "mcq",
    question: "What makes Category D target 'Merchant House Velorn' (N-01) a war profiteering concern?",
    options: [
      "It secretly sells chemical weapon precursors to Kharaan militias and Ashen Hand cells at the same time",
      "It holds an illegal monopoly on all water shipments to Suni Wells",
      "It refuses to accept Concord gold currency",
      "It assassinated the Concord naval attaché"
    ],
    correctAnswer: 0,
    explanation: "Merchant House Velorn is flagged for dual-dealing: supplying munitions precursors to both Kharaan contractors and Ashen Hand cells.",
    linkedEntityId: "OrunDal"
  },

  // 8. Crisis & Diplomacy
  {
    id: "q-crs-01",
    topic: "crisis",
    difficulty: "novice",
    type: "mcq",
    question: "What is the historical '3-day collapse rule' referenced in the Mirrah briefing?",
    options: [
      "In 28 years, no ceasefire or negotiating framework has survived past 3 days without collapsing",
      "Concord sessions are legally mandated to adjourn after exactly 72 hours",
      "Food convoys spoil in 3 days due to extreme desert temperatures",
      "A delegate has 3 days to deliver their opening speech"
    ],
    correctAnswer: 0,
    explanation: "Every peace attempt in 28 years has fractured within 3 days due to skirmishes or Ashen Hand sabotage.",
    linkedEntityId: "concord"
  },
  {
    id: "q-crs-02",
    topic: "crisis",
    difficulty: "intermediate",
    type: "mcq",
    question: "In the Best Delegate scoring rubric, which criterion carries the highest weight at 25%?",
    options: [
      "Scenario Accuracy (verifiable facts, dates, controllers)",
      "Diplomacy & Parliamentary Tone",
      "Coalition Logic",
      "Operative Drafting & Specificity"
    ],
    correctAnswer: 0,
    explanation: "Scenario accuracy is weighted highest (25%), rewarding mastery of real crisis lore and factual discipline.",
    linkedEntityId: "director"
  },
  {
    id: "q-crs-03",
    topic: "crisis",
    difficulty: "intermediate",
    type: "mcq",
    question: "How can a savvy Zahari delegate best exploit internal Concord divisions in negotiations?",
    options: [
      "Offer preferential Duskore export contracts to industrial realms in exchange for diplomatic recognition backing",
      "Threaten to blow up all Vael Ridge mining shafts immediately",
      "Form a formal military alliance with the Ashen Hand",
      "Agree to become an unconditional province of Kharaan"
    ],
    correctAnswer: 0,
    explanation: "Trading exclusive Duskore access directly tests the loyalties of Concord industrial states against Kharaan's Veridium bloc.",
    linkedEntityId: "zahari"
  },
  {
    id: "q-crs-04",
    topic: "crisis",
    difficulty: "expert",
    type: "mcq",
    question: "What is an effective compromise mechanism to resolve the Suni Wells water siege without Kharaan appearing weak?",
    options: [
      "Transfer aquifer management to neutral Concord civilian engineers while maintaining a demilitarized perimeter",
      "Permanently cement shut the Suni Wells aquifer shafts",
      "Sell the entire oasis to Merchant House Velorn",
      "Allow Ashen Hand fighters to patrol the wells"
    ],
    correctAnswer: 0,
    explanation: "Neutral Concord oversight addresses Zahari humanitarian survival while preserving face and security for Kharaan.",
    linkedEntityId: "SuniWells"
  },
  {
    id: "q-crs-05",
    topic: "crisis",
    difficulty: "expert",
    type: "mcq",
    question: "What constitutes a 'talks-collapse' outcome for the Kingdom of Kharaan?",
    options: [
      "Expanded international sanctions, continued Duskore dependency, and renewed Seam war risk",
      "Unconditional recognition of the Zahari Front by the Concord",
      "Loss of royal title for King Aldavar II",
      "Immediate military conquest by the Ashen Hand"
    ],
    correctAnswer: 0,
    explanation: "Section 4.12: Kharaan collapse outcome is expanded sanctions, sustained Duskore starvation, and renewed Seam war.",
    linkedEntityId: "kharaan"
  },
  {
    id: "q-crs-06",
    topic: "crisis",
    difficulty: "intermediate",
    type: "mcq",
    question: "When drafting an operative resolution clause on corridor security, which element earns the highest drafting score?",
    options: [
      "Specific inspection mechanisms, demilitarized buffer zones, and third-party monitoring verification",
      "Vague general appeals for regional friendship and universal peace",
      "Threats of unilateral airstrikes against civilian towns",
      "Immediate cessation of all international diplomatic activity"
    ],
    correctAnswer: 0,
    explanation: "Clear, verifiable verification mechanisms and specific timelines earn top marks under the Best Delegate rubric.",
    linkedEntityId: "director"
  }
];
