// src/data/scenario.ts
// Single source of truth for "The Mirrah" scenario data (Section 4)

export interface ScenarioMeta {
  title: string;
  subtitle: string;
  entryPoint: string;
  parties: string[];
  threatActor: string;
  initialControl: {
    kharaan: number; // percentage, e.g. 62
    zahari: number;  // percentage, e.g. 38
    seamContested: boolean;
  };
}

export interface HistoryEvent {
  id: string;
  period: string; // e.g. "~150 yrs"
  title: string;
  description: string;
  isEscalation: boolean; // ★ escalation events
  locationKey?: string;
  partiesInvolved: string[];
}

export interface PartyInfo {
  id: 'kharaan' | 'zahari' | 'concord';
  name: string;
  type: string;
  capital: string;
  controlShare: string;
  claim: string;
  keyAsset: string;
  keyAssetDescription: string;
  description: string;
  leverage: string[];
  vulnerabilities: string[];
  redLines: string[];
  objectives: {
    talksSucceed: string;
    talksCollapse: string;
  };
}

export interface AshenHandInfo {
  name: string;
  type: string;
  origin: string;
  objective: string;
  methods: string[];
  sitesCount: number;
  spineCell: string;
  westernBaseCamp: string;
  keyFact: string;
}

export interface GeographicFeature {
  id: string;
  name: string;
  type: 'strip' | 'mountains' | 'dunes' | 'canyon' | 'sea' | 'salt_flat' | 'oasis';
  description: string;
  strategicNote: string;
  restricted?: boolean;
}

export interface CityInfo {
  id: string;
  name: string;
  controller: 'Kharaan' | 'Zahari Front' | 'Contested';
  role: string;
  description: string;
  strategicSignificance: string;
  sanctionsLinks?: string[];
  coordinates: { x: number; z: number };
}

export interface ResourceInfo {
  id: string;
  name: string;
  analog: string;
  location: string;
  control: string;
  importance: string;
  economicDetail: string;
  coordinates: { x: number; z: number };
}

export interface RouteInfo {
  id: string;
  name: string;
  type: 'trade' | 'military' | 'smuggling' | 'resource';
  controller: string;
  path: string;
  description: string;
  status: 'active' | 'volatile' | 'clandestine';
}

export interface HumanitarianCorridor {
  id: string;
  name: string;
  route: string;
  status: 'active_threatened' | 'partially_operational' | 'proposed' | 'informal';
  statusLabel: string;
  description: string;
  vulnerability: string;
}

export interface SanctionTarget {
  code: string;
  name: string;
  role: string;
  category: 'A' | 'B' | 'C' | 'D';
  categoryLabel: string;
  designation: string;
  isDisputed: boolean;
  disputeNote?: string;
  targetType: 'individual' | 'entity' | 'corporation' | 'party';
  details: string;
  mapEntityId?: string; // Links to city/resource/site for map heat
}

export interface SanctionInstrument {
  id: 'travel_ban' | 'arms_embargo' | 'assets_freeze';
  name: string;
  allowedTargetTypes: ('individual' | 'entity' | 'corporation' | 'party')[];
  description: string;
}

// -------------------------------------------------------------
// EXPORTED CONSTANTS
// -------------------------------------------------------------

export const SCENARIO_META: ScenarioMeta = {
  title: "The Mirrah",
  subtitle: "Contested Lands of the Saverine Expanse",
  entryPoint: "Present-day Concord of Crowns emergency session; all parties summoned.",
  parties: [
    "Kingdom of Kharaan",
    "The Zahari Front",
    "The Concord of Crowns"
  ],
  threatActor: "The Ashen Hand",
  initialControl: {
    kharaan: 62,
    zahari: 38,
    seamContested: true,
  },
};

export const HISTORY_EVENTS: HistoryEvent[] = [
  {
    id: "hist-01",
    period: "~150 yrs",
    title: "Solmaran Dominion Collapses",
    description: "The ancient Solmaran Dominion collapses, leaving the Mirrah ungoverned. Nomadic Zahari tribes remain the sole inhabitants with no recognized sovereign.",
    isEscalation: false,
    partiesInvolved: ["Zahari Tribes"],
  },
  {
    id: "hist-02",
    period: "~130 yrs",
    title: "Concord of Crowns Founded",
    description: "Successor kingdoms unite to establish the Concord of Crowns, an inter-realm body holding trade, diplomacy, sanctions, and sovereignty recognition authority.",
    isEscalation: false,
    partiesInvolved: ["Concord of Crowns"],
  },
  {
    id: "hist-03",
    period: "~90 yrs",
    title: "First March of King Aldavar II",
    description: "Kharaan's King Aldavar II claims Solmaran successor rights over the entire Mirrah Expanse. The Concord of Crowns registers no formal objection.",
    isEscalation: false,
    locationKey: "KharaanCity",
    partiesInvolved: ["Kingdom of Kharaan", "Concord of Crowns"],
  },
  {
    id: "hist-04",
    period: "~75 yrs",
    title: "Settlement Decree & Gold Road",
    description: "Kharaan issues the Settlement Decree and constructs the fortified Gold Road. Zahari nomadic clans are systematically pushed south into arid basins.",
    isEscalation: false,
    locationKey: "Adessa",
    partiesInvolved: ["Kingdom of Kharaan", "Zahari Tribes"],
  },
  {
    id: "hist-05",
    period: "~60 yrs",
    title: "Veridium Discovery in the North",
    description: "Vast reserves of Veridium (lithium analog, energy storage) discovered in the northern interior. The Mirrah becomes strategically indispensable; Concord kingdoms become heavily dependent.",
    isEscalation: false,
    locationKey: "Adessa",
    partiesInvolved: ["Kingdom of Kharaan", "Concord of Crowns"],
  },
  {
    id: "hist-06",
    period: "~45 yrs",
    title: "The Tishrin Massacre",
    description: "Kharaan forces fire upon Zahari civilian protesters demanding water rights. Scattered tribes unite to form the Zahari Front, establishing Zahar-Oun as their capital.",
    isEscalation: true,
    locationKey: "Tishrin",
    partiesInvolved: ["Kingdom of Kharaan", "The Zahari Front"],
  },
  {
    id: "hist-07",
    period: "~40 yrs",
    title: "First Concord Petition",
    description: "The Zahari Front petitions the Concord of Crowns for formal diplomatic recognition and human rights oversight. The Concord takes no action.",
    isEscalation: false,
    partiesInvolved: ["The Zahari Front", "Concord of Crowns"],
  },
  {
    id: "hist-08",
    period: "~35 yrs",
    title: "The Seam War (18 Months)",
    description: "A brutal 18-month war across the central steppe ends in stalemate. A Concord-brokered ceasefire freezes the front line as 'The Seam.'",
    isEscalation: true,
    locationKey: "TheSeam",
    partiesInvolved: ["Kingdom of Kharaan", "The Zahari Front", "Concord of Crowns"],
  },
  {
    id: "hist-09",
    period: "~28 yrs",
    title: "Qasar Accords Collapse & Ashen Hand Emergence",
    description: "Peace talks at Qasar Gate collapse. Disillusioned splinters form The Ashen Hand; its first attack is a devastating bombing in Beymouth.",
    isEscalation: true,
    locationKey: "Beymouth",
    partiesInvolved: ["The Ashen Hand", "Kingdom of Kharaan", "The Zahari Front"],
  },
  {
    id: "hist-10",
    period: "~20 yrs",
    title: "Referendum Promised by Queen Solvane I",
    description: "Queen Solvane I of Kharaan pledges a self-determination referendum for the southern territories. The Zahari Front enters a tentative ceasefire and suspends armed operations.",
    isEscalation: false,
    partiesInvolved: ["Kingdom of Kharaan", "The Zahari Front"],
  },
  {
    id: "hist-11",
    period: "~14 yrs",
    title: "Referendum Cancelled — Defining Grievance",
    description: "Kharaan unilaterally voids the promised referendum. The ceasefire collapses immediately. The Ashen Hand resurges at Expanse-wide scale. This remains the defining Zahari grievance.",
    isEscalation: true,
    locationKey: "ZaharOun",
    partiesInvolved: ["Kingdom of Kharaan", "The Zahari Front", "The Ashen Hand"],
  },
  {
    id: "hist-12",
    period: "~8 yrs",
    title: "Duskore Discovery at Vael Ridge",
    description: "Deposits of Duskore (rare earth minerals vital for advanced alloys and military guidance) are found in southern Zahari territory, giving the Front vital leverage and dividing Concord interests.",
    isEscalation: false,
    locationKey: "VaelRidge",
    partiesInvolved: ["The Zahari Front", "Concord of Crowns"],
  },
  {
    id: "hist-13",
    period: "~4 yrs",
    title: "Beymouth Bombing — 34 Killed",
    description: "Ashen Hand operatives detonate explosives in Beymouth market square, killing 34 civilians and delegates. The Concord suspends all formal Seam trade.",
    isEscalation: true,
    locationKey: "Beymouth",
    partiesInvolved: ["The Ashen Hand", "Concord of Crowns"],
  },
  {
    id: "hist-14",
    period: "~2 yrs",
    title: "Suni Wells Siege — Concord Censure",
    description: "Kharaan military encircles Suni Wells, cutting vital aquifer access to Zahari population centers. In response, the Concord issues its first formal censure of Kharaan.",
    isEscalation: true,
    locationKey: "SuniWells",
    partiesInvolved: ["Kingdom of Kharaan", "Concord of Crowns", "The Zahari Front"],
  },
  {
    id: "hist-15",
    period: "PRESENT",
    title: "Concord Emergency Session",
    description: "With military escalation looming, corridors obstructed, and Ashen Hand cells active, the Concord of Crowns convenes an emergency crisis drill to avert all-out war.",
    isEscalation: false,
    partiesInvolved: ["Kingdom of Kharaan", "The Zahari Front", "Concord of Crowns"],
  },
];

export const PARTIES: Record<'kharaan' | 'zahari' | 'concord', PartyInfo> = {
  kharaan: {
    id: "kharaan",
    name: "Kingdom of Kharaan",
    type: "Sovereign State Actor",
    capital: "Kharaan City (outside Mirrah proper)",
    controlShare: "~62% of territory",
    claim: "Solmaran successor rights and legal title across the entire Mirrah Expanse.",
    keyAsset: "Veridium + Solite",
    keyAssetDescription: "Veridium (energy storage / lithium analog) and Solite (agricultural fertilizer / phosphate) upon which Concord successor realms depend.",
    description: "A centralized, historic monarchical power administering the northern plains, the Gold Road corridor, and major industrial extraction centers. Garrisons forward bases along the Seam.",
    leverage: [
      "Monopoly over northern Veridium extraction and processing infrastructure.",
      "Solite fertilizer exports critical to southern and Concord food supplies.",
      "Well-equipped regular military forces and forward bases along the Seam.",
      "Founding member voting bloc within the Concord of Crowns."
    ],
    vulnerabilities: [
      "Heavy diplomatic censure after the Suni Wells aquifer encirclement.",
      "Severed trade along the Seam impairs economic revenue from exports.",
      "International scrutiny over labour practices in the Mirrah Extraction Authority.",
      "Growing dependence on advanced tech requiring Zahari Duskore."
    ],
    redLines: [
      "No full surrender of Solmaran sovereignty or administrative control.",
      "No formal diplomatic parity or independence recognition for the Zahari Front.",
      "No unilateral withdrawal of Seam garrisons without verified security guarantees."
    ],
    objectives: {
      talksSucceed: "Lifting of trade sanctions, stabilization of the Mirrah under Kharaan administrative sovereignty, restored full Veridium exports, and demilitarization of Zahari insurgents.",
      talksCollapse: "Expanded international sanctions, loss of Concord voting dominance, renewed Seam War, and perpetual guerrilla attrition."
    }
  },

  zahari: {
    id: "zahari",
    name: "The Zahari Front",
    type: "Resistance / Non-State Indigenous Authority",
    capital: "Zahar-Oun",
    controlShare: "~38% of territory",
    claim: "Inherent indigenous rights, ancestral territory, and right to self-determination.",
    keyAsset: "Duskore",
    keyAssetDescription: "Duskore (rare earth elements vital for advanced metallurgy and military electronics) mined at Vael Ridge.",
    description: "An organized political and insurgent movement born out of the Tishrin Massacre. Controls the southern desert, Vael Ridge mining centers, and the Smuggler's Vein clandestine supply network.",
    leverage: [
      "Exclusive control of Duskore deposits at Vael Ridge, vital for modern industry.",
      "Deep local roots, asymmetric desert combat capability, and popular civilian support.",
      "Control over southern access corridors and informal transit routes.",
      "Growing sympathetic back-channel contacts within certain Concord delegations."
    ],
    vulnerabilities: [
      "Severe humanitarian crisis exacerbated by Kharaan water blockade at Suni Wells.",
      "Lack of formal international diplomatic recognition and banking access.",
      "Susceptibility of civilian refugee lines to Ashen Hand terror strikes.",
      "Economic isolation due to the Seam trade freeze."
    ],
    redLines: [
      "No resolution without an explicit, verifiable pathway to self-determination/recognition.",
      "Immediate, unconditional lifting of the water blockade at Suni Wells.",
      "Refusal to disarm without international Concord peacekeepers along the Seam."
    ],
    objectives: {
      talksSucceed: "Formal Concord recognition pathway, unblocked Duskore revenue, demilitarization of Kharaan Seam FOBs, and guaranteed humanitarian access.",
      talksCollapse: "Continued diplomatic invisibility, starvation of southern enclaves, renewed encirclement, and civilian catastrophe."
    }
  },

  concord: {
    id: "concord",
    name: "The Concord of Crowns",
    type: "Multilateral Supranational Body",
    capital: "Concord Assembly (External / Neutral Seat)",
    controlShare: "Mediating Authority / No sovereign territorial control",
    claim: "Charter mandate to maintain regional peace, international trade, and humanitarian law.",
    keyAsset: "Sanctions & Recognition Authority",
    keyAssetDescription: "Sole power to impose/lift trade sanctions, admit sovereign members, and mandate international relief corridors.",
    description: "A prestigious assembly of Solmaran successor kingdoms. While Kharaan is a founding member and the Front is unrepresented, member states are fractured between those needing Kharaan's Veridium and those seeking Zahari Duskore.",
    leverage: [
      "Binding sanctions instruments: Travel Bans, Arms Embargoes, Assets Freezes.",
      "Authority to confer sovereign recognition and treaty legitimacy.",
      "Administration of international humanitarian corridor security mandates.",
      "Control over external maritime trade through the Sundered Sea ports."
    ],
    vulnerabilities: [
      "Internal factionalism: Veridium-dependent kingdoms clash with Duskore-hungry realms.",
      "Zero direct military force in the Mirrah—relies on consensus and economic pressure.",
      "Previous failure of the Qasar Accords and cancelled referendum stains credibility.",
      "High risk of total diplomatic irrelevance if talks collapse into armed conflict."
    ],
    redLines: [
      "No regional war that cuts off both Veridium and Duskore supply chains.",
      "Zero tolerance for Ashen Hand expansion or appeasement.",
      "No unilateral border alterations without multilateral Concord ratification."
    ],
    objectives: {
      talksSucceed: "Restored Seam commerce, secured dual flow of Veridium and Duskore, institutional prestige reaffirmed, and isolation of the Ashen Hand.",
      talksCollapse: "Prolonged energy shock, regional conflagration, complete breakdown of multilateral credibility."
    }
  }
};

export const ASHEN_HAND: AshenHandInfo = {
  name: "The Ashen Hand",
  type: "Transnational Extremist Non-State Threat Actor",
  origin: "Splinter faction formed ~28 years ago following the collapse of the Qasar Accords.",
  objective: "Perpetuation of conflict — violently opposes any ceasefire, diplomatic normalization, or humanitarian corridor agreement.",
  methods: [
    "Bombings of civilian trade hubs, neutral markets, and Seam crossings (e.g. Beymouth).",
    "Targeted assassination of moderate diplomats, negotiators, and corridor coordinators.",
    "Armed ambushes of humanitarian relief convoys to maximize regional desperation.",
    "Black-market illicit financing through clandestine Cinderstone extraction and arms trafficking."
  ],
  sitesCount: 6,
  westernBaseCamp: "Hidden enclave in the western sand ridges (x:18, z:62)",
  spineCell: "Fortified mountain bunker along the eastern Spine ridge (x:74, z:64)",
  keyFact: "Neither party controls or supports it; both Kharaan and the Zahari Front have suffered catastrophic attacks from it. It represents the only documented common ground between the two enemies."
};

export const GEOGRAPHY_FEATURES: GeographicFeature[] = [
  {
    id: "geo-seam",
    name: "The Seam",
    type: "strip",
    description: "A jagged, contested east-west strip dividing the northern plains from the southern desert. Frozen front line of the Seam War, heavily fortified with minefields, checkpoints, and contested resource nodes.",
    strategicNote: "Primary flashpoint; red contested zone pulsing live on the tactical atlas."
  },
  {
    id: "geo-spine",
    name: "The Spine",
    type: "mountains",
    description: "Towering mountain chain dominating the eastern perimeter. Natural barrier controlling eastern overland approaches, rich in Cinderstone deposits.",
    strategicNote: "High elevation terrain sheltering Ashen Hand cell AH_spineCell and mineral deposits."
  },
  {
    id: "geo-wastes",
    name: "The Golden Wastes",
    type: "dunes",
    description: "Vast expanse of towering dune fields across the far north. Blistering temperatures and shifting sands make it largely impassable to mechanized formations.",
    strategicNote: "Natural northern buffer insulating Kharaan's heartland."
  },
  {
    id: "geo-gash",
    name: "The Gash",
    type: "canyon",
    description: "A tectonic fissure and deep carved canyon in the center-west. Narrow defiles create natural choke points for north-south movement.",
    strategicNote: "Critical tactical choke point between western plains and the Seam."
  },
  {
    id: "geo-sea",
    name: "The Sundered Sea",
    type: "sea",
    description: "Coastal waters bounding the western edge of the Mirrah. Provides maritime access and external shipping lanes under Concord naval monitoring.",
    strategicNote: "Western littoral entry for maritime humanitarian relief and maritime patrols."
  },
  {
    id: "geo-salt",
    name: "Salt Flats (×3)",
    type: "salt_flat",
    description: "Three expansive dried lake beds situated across both zones. Rich in Ashsalt (potash analog), historically treated as demilitarized neutral zones.",
    strategicNote: "Prime candidate for multilateral joint economic management."
  },
  {
    id: "geo-oases",
    name: "Oases of the Expanse",
    type: "oasis",
    description: "Three vital water tables: Vire (west), Suni Wells (center-south), and Tal (northeast). Suni Wells is currently under Kharaan siege.",
    strategicNote: "Suni Wells is currently restricted/encircled, precipitating the Concord censure.",
    restricted: true
  }
];

export const CITIES: CityInfo[] = [
  {
    id: "KharaanCity",
    name: "Kharaan City",
    controller: "Kharaan",
    role: "Royal Capital",
    description: "Ancestral royal seat and imperial center of the Kingdom of Kharaan, situated north outside the Mirrah proper.",
    strategicSignificance: "Nerve center of Kharaan governance, military command, and the Solmaran successor court.",
    coordinates: { x: 8, z: 25 },
  },
  {
    id: "TalVureen",
    name: "Tal Vureen",
    controller: "Kharaan",
    role: "Administrative Hub",
    description: "Northern administrative center overseeing provincial governance and resource logistics.",
    strategicSignificance: "Manages civil registry, regional garrisons, and northern supply depots.",
    coordinates: { x: 22, z: 28 },
  },
  {
    id: "Adessa",
    name: "Adessa",
    controller: "Kharaan",
    role: "Primary Veridium Town",
    description: "Booming mining and refining boomtown centered around the primary northern Veridium deposits.",
    strategicSignificance: "Economic lifeblood of Kharaan's exports to Concord realms; high strategic security.",
    coordinates: { x: 42, z: 22 },
  },
  {
    id: "Marquum",
    name: "Marquum",
    controller: "Kharaan",
    role: "Solite (Phosphate) Center",
    description: "Industrial agricultural extraction town producing Solite fertilizer for the kingdoms.",
    strategicSignificance: "Supplies agricultural nutrients vital for continental food security.",
    coordinates: { x: 15, z: 42 },
  },
  {
    id: "SefKarib",
    name: "Sef Karib",
    controller: "Kharaan",
    role: "Forward Seam Garrison",
    description: "Heavily fortified military citadel anchored directly along the northern bank of the Seam.",
    strategicSignificance: "Command post for Seam front-line forces and primary terminus of the military Iron Line.",
    sanctionsLinks: ["K-01"],
    coordinates: { x: 33, z: 40 },
  },
  {
    id: "OrunDal",
    name: "Orun Dal",
    controller: "Kharaan",
    role: "Rail & Logistics Junction",
    description: "Central transit hub connecting the Gold Road, northern mineral hubs, and Spine transit depots.",
    strategicSignificance: "Choke point for all overland cargo transit in the eastern basin.",
    sanctionsLinks: ["K-05"],
    coordinates: { x: 55, z: 33 },
  },
  {
    id: "ZaharOun",
    name: "Zahar-Oun",
    controller: "Zahari Front",
    role: "Declared Resistance Capital",
    description: "Ancient desert citadel fortified among sandstone monoliths; political headquarters of the Zahari Front.",
    strategicSignificance: "Center of Zahari civil administration, assembly halls, and the Front leadership.",
    coordinates: { x: 48, z: 80 },
  },
  {
    id: "Imghala",
    name: "Imghala",
    controller: "Zahari Front",
    role: "Southern Stronghold & Vein Hub",
    description: "Rugged desert bastion serving as the primary logistics hub for the clandestine Smuggler's Vein.",
    strategicSignificance: "Key distribution point for southern food relief, fuel, and covert arms.",
    sanctionsLinks: ["Z-02"],
    coordinates: { x: 32, z: 78 },
  },
  {
    id: "VaelRidge",
    name: "Vael Ridge",
    controller: "Zahari Front",
    role: "Duskore Mining Camp",
    description: "Fortified canyon complex extracting rare-earth Duskore deposits; guarded by Zahari elite fighters.",
    strategicSignificance: "Primary economic asset of the Zahari Front; bargaining chip in all Concord negotiations.",
    sanctionsLinks: ["Z-04"],
    coordinates: { x: 62, z: 75 },
  },
  {
    id: "Tishrin",
    name: "Tishrin",
    controller: "Zahari Front",
    role: "Desert Post & Memorial",
    description: "Historical desert outpost and solemn site of the 45-year-old Tishrin Massacre that ignited the uprising.",
    strategicSignificance: "Spiritual heart of the Zahari resistance; western anchor of the informal Refugee Line.",
    coordinates: { x: 22, z: 68 },
  },
  {
    id: "Beymouth",
    name: "Beymouth",
    controller: "Contested",
    role: "Primary Seam Flashpoint",
    description: "Divided commercial hub sitting squarely atop the Seam. Site of repeated bombings and trade shutdowns.",
    strategicSignificance: "Primary crossing point between north and south; most volatile flashpoint in the Expanse.",
    sanctionsLinks: ["AH-03", "K-01", "Z-01"],
    coordinates: { x: 42, z: 48 },
  },
  {
    id: "QasarGate",
    name: "Qasar Gate",
    controller: "Contested",
    role: "Seam Checkpoint & Historic Accords Site",
    description: "A monumental ancient fortress gateway across the central Seam where the failed Qasar Accords were drafted.",
    strategicSignificance: "Proposed terminus for cross-Seam Gate Relief humanitarian corridor.",
    coordinates: { x: 62, z: 45 },
  },
];

export const RESOURCES: ResourceInfo[] = [
  {
    id: "res-veridium",
    name: "Veridium",
    analog: "Lithium / Battery Storage",
    location: "Northern Interior & Seam Periphery",
    control: "Kharaan / Contested",
    importance: "Critical for clean energy storage devices and advanced power grids across all Concord realms.",
    economicDetail: "Concord kingdoms have severe supply dependencies on Veridium, giving Kharaan tremendous trade leverage.",
    coordinates: { x: 48, z: 18 },
  },
  {
    id: "res-solite",
    name: "Solite",
    analog: "Phosphate / Fertilizer",
    location: "Marquum Plains (Northwest)",
    control: "Kharaan",
    importance: "Agricultural soil replenishment; essential for maintaining staple grain crop yields.",
    economicDetail: "Kharaan uses Solite export quotas as soft diplomatic leverage over neighboring non-aligned states.",
    coordinates: { x: 15, z: 44 },
  },
  {
    id: "res-cinderstone-spine",
    name: "Cinderstone (Spine)",
    analog: "Solid Natural Gas / Clean Fuel",
    location: "Spine Ridge (East)",
    control: "Contested / Ashen Hand Black Market",
    importance: "Dense, low-emission heating fuel for mountain and urban centers.",
    economicDetail: "Illegally mined and trafficked by the Ashen Hand via the Cinder Exchange to fund insurgent operations.",
    coordinates: { x: 72, z: 60 },
  },
  {
    id: "res-cinderstone-seam",
    name: "Cinderstone (Seam)",
    analog: "Solid Natural Gas",
    location: "Central Seam Corridor",
    control: "Contested",
    importance: "High-yield energy blocks trapped within contested frontline fissures.",
    economicDetail: "Both parties dispute extraction rights along this section of the ceasefire buffer.",
    coordinates: { x: 46, z: 40 },
  },
  {
    id: "res-duskore",
    name: "Duskore",
    analog: "Heavy Rare Earth Minerals",
    location: "Vael Ridge & Southern Desert",
    control: "Zahari Front",
    importance: "Crucial for precision alloys, advanced avionics, and high-spec military equipment.",
    economicDetail: "Discovered 8 years ago; shattered Kharaan's monopoly on Mirrah resources and divided Concord loyalties.",
    coordinates: { x: 55, z: 85 },
  },
  {
    id: "res-ashsalt",
    name: "Ashsalt",
    analog: "Potash / Industrial Salts",
    location: "Salt Flats (North & South)",
    control: "Shared (De Facto Neutral)",
    importance: "Essential for chemical processing, food preservation, and metallurgical smelting flux.",
    economicDetail: "Traditional unmonitored harvesting; widely considered the ideal test case for joint-administration treaties.",
    coordinates: { x: 60, z: 30 },
  },
];

export const ROUTES: RouteInfo[] = [
  {
    id: "route-gold-road",
    name: "Gold Road",
    type: "trade",
    controller: "Kharaan",
    path: "Kharaan City → Tal Vureen → Adessa → Orun Dal → Spine Passes",
    description: "Fortified, paved highway constructed ~75 years ago to export Veridium and northern commodities directly to Concord realms.",
    status: "active",
  },
  {
    id: "route-iron-line",
    name: "Iron Line",
    type: "military",
    controller: "Kharaan",
    path: "Kharaan North → Western Waypoint → Sef Karib Garrison",
    description: "Dedicated military supply corridor and rail spur feeding heavy equipment to Kharaan frontline garrisons on the Seam.",
    status: "active",
  },
  {
    id: "route-seam-crossing",
    name: "Seam Crossing",
    type: "trade",
    controller: "Contested",
    path: "Northern Plains → Beymouth → Southern Steppe",
    description: "The historical north-south commercial artery passing through Beymouth. Currently suspended by Concord mandate post-bombing.",
    status: "volatile",
  },
  {
    id: "route-smugglers-vein",
    name: "Smuggler's Vein",
    type: "smuggling",
    controller: "Zahari Front",
    path: "Southwestern Basin → Imghala → Southern Foothills → Vael Ridge",
    description: "Concealed network of canyon tracks, dry wadis, and night convoys enabling the Front to export Duskore and import medicine.",
    status: "clandestine",
  },
  {
    id: "route-duskore-run",
    name: "Duskore Run",
    type: "resource",
    controller: "Zahari Front",
    path: "Vael Ridge Mining Complex → Zahar-Oun",
    description: "Heavy convoy road connecting the Vael Ridge mines to the Front capital for stockpiling, refinement, and secure dispatch.",
    status: "active",
  },
];

export const HUMANITARIAN_CORRIDORS: HumanitarianCorridor[] = [
  {
    id: "corridor-mercy",
    name: "Mercy Corridor",
    route: "Western Sundered Border → Beymouth",
    status: "active_threatened",
    statusLabel: "Active (Threatened)",
    description: "Western humanitarian supply route bringing sea-borne Concord medical and nutritional supplies toward Beymouth.",
    vulnerability: "Ashen Hand base camp (AH-01) lies within striking distance; subject to recurring ambush threats.",
  },
  {
    id: "corridor-relief",
    name: "Relief Line",
    route: "Southern Border → Zahari Heartland",
    status: "partially_operational",
    statusLabel: "Partially Operational",
    description: "Southern NGO corridor supplying civilian settlements around Zahar-Oun with drought relief and grain.",
    vulnerability: "Kharaan disputes the legality of this corridor, claiming it facilitates covert military smuggling.",
  },
  {
    id: "corridor-gate",
    name: "Gate Relief",
    route: "Qasar Gate → Zahar-Oun (Cross-Seam)",
    status: "proposed",
    statusLabel: "Proposed (Unsecured)",
    description: "A proposed formal cross-Seam corridor designed to transfer neutral medical aid directly across the fortified front line.",
    vulnerability: "Stalled in negotiations; neither side has consented to neutral inspection terms or demilitarization.",
  },
  {
    id: "corridor-refugee",
    name: "Refugee Line",
    route: "Beymouth → Tishrin (West along Seam)",
    status: "informal",
    statusLabel: "Informal (Unprotected)",
    description: "An informal dirt trek utilized by displaced families fleeing Seam skirmishes to seek shelter in Tishrin.",
    vulnerability: "Zero official security protection; frequent extortion by irregulars and exposed to sniper fire.",
  },
];

export const CURRENT_CRISES = [
  {
    title: "Military Standoff",
    description: "Four Kharaan Forward Operating Bases directly face four Zahari fortified positions along the Seam. No military stand-down has occurred in 14 years.",
    severity: "High",
  },
  {
    title: "Humanitarian Water Crisis",
    description: "The ongoing siege and restriction of Suni Wells threatens water access for over 80,000 Zahari civilians. Refugee lines lack formal protection.",
    severity: "Critical",
  },
  {
    title: "Economic Stranglehold",
    description: "Concord suspension of Seam trade hurts both sides: Kharaan cannot export Veridium at capacity, while the Front cannot formally sell Duskore.",
    severity: "High",
  },
  {
    title: "Ashen Hand Escalation",
    description: "Six active insurgent sites identified. Two coordinated cells possess the capability to carry out massive bombings targeting diplomatic personnel.",
    severity: "Critical",
  },
  {
    title: "Diplomatic Deadlock",
    description: "No ceasefire or negotiating framework has survived past 3 days in the last 28 years. The cancelled referendum remains the core grievance.",
    severity: "Critical",
  },
];

export const SANCTION_INSTRUMENTS: SanctionInstrument[] = [
  {
    id: "travel_ban",
    name: "Travel Ban",
    allowedTargetTypes: ["individual"],
    description: "Restricts individuals from traveling to or transit through Concord sovereign territories, freezing foreign diplomatic access.",
  },
  {
    id: "arms_embargo",
    name: "Arms Embargo",
    allowedTargetTypes: ["individual", "entity", "party"],
    description: "Prohibits the export, sale, transfer, and maintenance of weapons, munitions, and dual-use military components.",
  },
  {
    id: "assets_freeze",
    name: "Assets Freeze",
    allowedTargetTypes: ["individual", "corporation", "entity"],
    description: "Freezes all bank accounts, financial assets, mineral consignments, and corporate revenue streams held within Concord jurisdiction.",
  },
];

export const SANCTION_TARGETS: SanctionTarget[] = [
  // Category A — Ashen Hand (Universal Consensus)
  {
    code: "AH-01",
    name: "Varak the Grey",
    role: "Supreme Commander, Ashen Hand",
    category: "A",
    categoryLabel: "Ashen Hand Extremist",
    designation: "Extremist Leadership",
    isDisputed: false,
    targetType: "individual",
    details: "Coordinates guerrilla cells from hidden western base camp; mastermind behind cross-border raids and assassinations.",
    mapEntityId: "AH_baseCamp_west",
  },
  {
    code: "AH-02",
    name: "The Ember Council",
    role: "5-Member Supreme Command Directory",
    category: "A",
    categoryLabel: "Ashen Hand Extremist",
    designation: "Extremist Organization",
    isDisputed: false,
    targetType: "entity",
    details: "Governing cell that sanctions bombing operations, issues manifestos against peace, and enforces dogma.",
    mapEntityId: "AH_spineCell",
  },
  {
    code: "AH-03",
    name: "Sorn Delvak",
    role: "Chief Bomb-Maker & Explosives Engineer",
    category: "A",
    categoryLabel: "Ashen Hand Extremist",
    designation: "Extremist Operative",
    isDisputed: false,
    targetType: "individual",
    details: "Engineered the Cinderstone-enhanced munitions used in the Beymouth market bombing that killed 34 civilians.",
    mapEntityId: "Beymouth",
  },
  {
    code: "AH-04",
    name: "The Cinder Exchange",
    role: "Illicit Mineral Trafficking Network",
    category: "A",
    categoryLabel: "Ashen Hand Extremist",
    designation: "Illicit Finance",
    isDisputed: false,
    targetType: "entity",
    details: "Black-market clearinghouse converting stolen Cinderstone into black-powder munitions and mercenary payments.",
    mapEntityId: "res-cinderstone-spine",
  },
  {
    code: "AH-05",
    name: "Mira Ashvane",
    role: "Chief Propagandist & Youth Recruiter",
    category: "A",
    categoryLabel: "Ashen Hand Extremist",
    designation: "Extremist Operative",
    isDisputed: false,
    targetType: "individual",
    details: "Exploits grievance and civilian despair along refugee lines to recruit disillusioned youths in Tishrin and Imghala.",
    mapEntityId: "Tishrin",
  },

  // Category B — Kharaan-Linked
  {
    code: "K-01",
    name: "General Tovan Reth",
    role: "Seam Front Commander, Royal Army",
    category: "B",
    categoryLabel: "Kharaan-Linked",
    designation: "Military — Human Rights Concern",
    isDisputed: false,
    targetType: "individual",
    details: "Directly ordered the encirclement and water cutoff at Suni Wells, prompting the formal Concord censure.",
    mapEntityId: "SuniWells",
  },
  {
    code: "K-02",
    name: "Mirrah Extraction Authority",
    role: "State Resource & Mining Corporation",
    category: "B",
    categoryLabel: "Kharaan-Linked",
    designation: "State Entity — Forced Labour",
    isDisputed: false,
    targetType: "corporation",
    details: "State conglomerate operating northern Veridium and Solite mines; heavily accused of indentured Zahari labor.",
    mapEntityId: "Adessa",
  },
  {
    code: "K-03",
    name: "Lord Casvan Duur",
    role: "Crown Minister & Annexation Architect",
    category: "B",
    categoryLabel: "Kharaan-Linked",
    designation: "Political — Hardliner",
    isDisputed: false,
    targetType: "individual",
    details: "Author of the Settlement Decree; staunch opponent of the cancelled referendum and any diplomatic concessions.",
    mapEntityId: "KharaanCity",
  },
  {
    code: "K-04",
    name: "Aldric Sorne",
    role: "Defense Contractor & Procurement Magnate",
    category: "B",
    categoryLabel: "Kharaan-Linked",
    designation: "Illicit Arms Procurement",
    isDisputed: false,
    targetType: "individual",
    details: "Smuggles heavy siege artillery to Seam garrisons in deliberate violation of Concord import quotas.",
    mapEntityId: "SefKarib",
  },
  {
    code: "K-05",
    name: "Gold Road Logistics Consortium",
    role: "Monopolistic Freight & Transport Syndicate",
    category: "B",
    categoryLabel: "Kharaan-Linked",
    designation: "Commercial — Trade Violation",
    isDisputed: false,
    targetType: "corporation",
    details: "Enforces freight embargoes and excessive transit tariffs targeting Zahari agricultural cargo in Orun Dal.",
    mapEntityId: "OrunDal",
  },

  // Category C — Zahari-Linked (Mostly Disputed)
  {
    code: "Z-01",
    name: "Commander Yara Sunn",
    role: "Chief of Military Operations, Zahari Front",
    category: "C",
    categoryLabel: "Zahari-Linked (Disputed)",
    designation: "Military — Disputed",
    isDisputed: true,
    disputeNote: "Front insists she acts as legitimate defense against Kharaan incursions; Kharaan designates her a Seam terrorist.",
    targetType: "individual",
    details: "Architect of asymmetric defense tactics around Qasar Gate and the southern desert perimeter.",
    mapEntityId: "QasarGate",
  },
  {
    code: "Z-02",
    name: "The Vein Council",
    role: "Smuggler's Vein Oversight Board",
    category: "C",
    categoryLabel: "Zahari-Linked (Disputed)",
    designation: "Quasi-Governmental — Disputed",
    isDisputed: true,
    disputeNote: "Zahari claim it is a humanitarian lifeline for essential food/medicine; Kharaan claims it is an illicit contraband conduit.",
    targetType: "entity",
    details: "Oversees night convoy routing and customs levies across the southwestern clandestine trails.",
    mapEntityId: "Imghala",
  },
  {
    code: "Z-03",
    name: "Davan Mir",
    role: "International Diplomatic Envoy & Fundraiser",
    category: "C",
    categoryLabel: "Zahari-Linked (Disputed)",
    designation: "Finance — Disputed",
    isDisputed: true,
    disputeNote: "Concord hawks allege he solicited donations from radical patrons; Front argues all funds support orphanages and relief.",
    targetType: "individual",
    details: "Traveled across Concord kingdoms seeking diaspora donations and diplomatic back-channels.",
    mapEntityId: "ZaharOun",
  },
  {
    code: "Z-04",
    name: "The Duskore Collective",
    role: "Vael Ridge Mining Cooperative",
    category: "C",
    categoryLabel: "Zahari-Linked (Disputed)",
    designation: "Commercial — Disputed",
    isDisputed: true,
    disputeNote: "Kharaan claims the mine was stolen from crown lands; Front claims ancestral sovereign mineral title.",
    targetType: "corporation",
    details: "Manages rare earth extraction, refinery staffing, and revenue distribution for the Front.",
    mapEntityId: "VaelRidge",
  },
  {
    code: "Z-05",
    name: "Elder Sova Tarris",
    role: "Senior Tribal Council Elder",
    category: "C",
    categoryLabel: "Zahari-Linked (Disputed)",
    designation: "Political — Contested",
    isDisputed: true,
    disputeNote: "Made an inflammatory speech praising early resistance that hardliners equated with Ashen Hand support; later formally retracted.",
    targetType: "individual",
    details: "Respected nomadic elder whose rhetoric is weaponized by Kharaan delegates to taint the entire Front.",
    mapEntityId: "Tishrin",
  },

  // Category D — Neutral / Third Party
  {
    code: "N-01",
    name: "Merchant House Velorn",
    role: "Concord-Registered Trading Dynasty",
    category: "D",
    categoryLabel: "Neutral / Third Party",
    designation: "Dual Concern — War Profiteering",
    isDisputed: false,
    targetType: "corporation",
    details: "Uncovered selling chemical precursors simultaneously to Kharaan munitions contractors and Ashen Hand middle-men.",
    mapEntityId: "OrunDal",
  },
  {
    code: "N-02",
    name: "The Grey Brokers",
    role: "Offshore Financial Intermediary Syndicate",
    category: "D",
    categoryLabel: "Neutral / Third Party",
    designation: "Illicit Finance",
    isDisputed: false,
    targetType: "entity",
    details: "Launders proceeds from black-market Cinderstone sales through shell trading companies in Concord coastal ports.",
    mapEntityId: "res-cinderstone-spine",
  },
  {
    code: "N-03",
    name: "Admiral Cassen Volk (Ret.)",
    role: "Ex-Concord Maritime Commander",
    category: "D",
    categoryLabel: "Neutral / Third Party",
    designation: "Conflict of Interest / Mercenary Advising",
    isDisputed: false,
    targetType: "individual",
    details: "Leaked confidential Concord maritime patrol timetables to Kharaan naval contractors in the Sundered Sea.",
    mapEntityId: "geo-sea",
  },
];
