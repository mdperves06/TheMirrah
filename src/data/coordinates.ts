// src/data/coordinates.ts
// Normalized grid coordinates (x: 0->100 west->east, z: 0->100 north->south)

export interface Coord2D {
  x: number;
  z: number;
}

export interface MapRegion {
  id: string;
  name: string;
  description: string;
  bounds: {
    minX?: number;
    maxX?: number;
    minZ?: number;
    maxZ?: number;
    center?: Coord2D;
    radius?: number;
  };
}

export interface MapPin {
  id: string;
  name: string;
  category: 'city' | 'resource' | 'water' | 'ashen' | 'military';
  coord: Coord2D;
  controller?: 'Kharaan' | 'Zahari Front' | 'Contested' | 'Ashen Hand' | 'Neutral';
  restricted?: boolean;
  highlight?: boolean;
  code?: string;
  description: string;
}

export interface RoutePolyline {
  id: string;
  name: string;
  type: 'trade' | 'military' | 'smuggling' | 'resource' | 'humanitarian';
  color: string;
  dashed?: boolean;
  status?: string;
  waypoints: Coord2D[];
}

export const REGIONS: Record<string, MapRegion> = {
  seaEdge: {
    id: "seaEdge",
    name: "Sundered Sea Littoral",
    description: "Western maritime shelf and coastal waters",
    bounds: { minX: 0, maxX: 12, minZ: 0, maxZ: 100 },
  },
  goldenWastes: {
    id: "goldenWastes",
    name: "The Golden Wastes",
    description: "Raised northern dune fields; impassable natural buffer",
    bounds: { minX: 0, maxX: 100, minZ: 0, maxZ: 30 },
  },
  theSpine: {
    id: "theSpine",
    name: "The Spine",
    description: "Eastern mountain range, highest elevation in the Expanse",
    bounds: { minX: 80, maxX: 100, minZ: 0, maxZ: 100 },
  },
  theGash: {
    id: "theGash",
    name: "The Gash",
    description: "Deep tectonic canyon forming a natural choke point",
    bounds: { center: { x: 28, z: 55 }, radius: 10 },
  },
  theSeam: {
    id: "theSeam",
    name: "The Seam",
    description: "Pulsing red contested ceasefire band",
    bounds: { minX: 25, maxX: 70, minZ: 38, maxZ: 50 },
  },
};

export const CITIES_COORDS: Record<string, Coord2D> = {
  KharaanCity: { x: 8, z: 25 },
  TalVureen: { x: 22, z: 28 },
  Adessa: { x: 42, z: 22 },
  Marquum: { x: 15, z: 42 },
  OrunDal: { x: 55, z: 33 },
  SefKarib: { x: 33, z: 40 },
  ZaharOun: { x: 48, z: 80 },
  Imghala: { x: 32, z: 78 },
  VaelRidge: { x: 62, z: 75 },
  Tishrin: { x: 22, z: 68 },
  Beymouth: { x: 42, z: 48 },
  QasarGate: { x: 62, z: 45 },
};

export const RESOURCES_COORDS: Record<string, Coord2D> = {
  Veridium: { x: 48, z: 18 },
  Solite: { x: 15, z: 44 },
  Cinderstone_Spine: { x: 72, z: 60 },
  Cinderstone_Seam: { x: 46, z: 40 },
  Duskore: { x: 55, z: 85 },
  Ashsalt_flats: { x: 60, z: 30 },
};

export const WATER_COORDS: Record<string, Coord2D & { restricted?: boolean; name: string }> = {
  VireOasis: { x: 10, z: 55, name: "Vire Oasis" },
  SuniWells: { x: 45, z: 58, restricted: true, name: "Suni Wells (Restricted / Encircled)" },
  TalOasis: { x: 68, z: 24, name: "Tal Oasis" },
};

export const ASHEN_HAND_SITES: Record<string, Coord2D & { name: string; isMajor?: boolean }> = {
  AH_baseCamp_west: { x: 18, z: 62, name: "Western Base Camp (AH-01 Varak)", isMajor: true },
  AH_spineCell: { x: 74, z: 64, name: "Spine Bunker Cell (AH-02 Ember Council)", isMajor: true },
  AH_3: { x: 35, z: 52, name: "Seam Infiltration Post (AH-03)", isMajor: false },
  AH_4: { x: 52, z: 66, name: "Southern Wadi Cache (AH-04)", isMajor: false },
  AH_5: { x: 28, z: 72, name: "Tishrin Foothill Cell (AH-05)", isMajor: false },
  AH_6: { x: 64, z: 52, name: "Qasar Perimeter Hideout", isMajor: false },
};

export const MILITARY_POSITIONS = {
  kharaanFOBs: [
    { id: "kfob-1", name: "FOB Sef Karib", x: 33, z: 40 },
    { id: "kfob-2", name: "FOB Seam-West", x: 40, z: 42 },
    { id: "kfob-3", name: "FOB Redoubt Central", x: 50, z: 41 },
    { id: "kfob-4", name: "FOB Spine Gate", x: 60, z: 43 },
  ],
  zahariPositions: [
    { id: "zpos-1", name: "Zahari Outpost Suni Flank", x: 36, z: 55 },
    { id: "zpos-2", name: "Zahari Redoubt Wadi-2", x: 48, z: 60 },
    { id: "zpos-3", name: "Zahari Steppe Observation Post", x: 58, z: 58 },
    { id: "zpos-4", name: "Zahari Defense Line Vael Ridge", x: 62, z: 75 },
  ],
};

export const ROUTES_POLYLINES: RoutePolyline[] = [
  {
    id: "GoldRoad",
    name: "Gold Road",
    type: "trade",
    color: "#c9a13b", // Kharaan gold
    waypoints: [
      { x: 8, z: 25 },  // Kharaan City
      { x: 22, z: 28 }, // Tal Vureen
      { x: 42, z: 22 }, // Adessa
      { x: 55, z: 33 }, // Orun Dal
      { x: 80, z: 35 }, // Spine Export Pass
    ],
  },
  {
    id: "IronLine",
    name: "Iron Line",
    type: "military",
    color: "#9e7b24",
    waypoints: [
      { x: 8, z: 25 },  // Kharaan City
      { x: 25, z: 35 }, // Western Waypoint
      { x: 33, z: 40 }, // Sef Karib
    ],
  },
  {
    id: "SeamCrossing",
    name: "Seam Crossing",
    type: "trade",
    color: "#b5402f", // Seam red (volatile)
    dashed: true,
    status: "Suspended / Volatile",
    waypoints: [
      { x: 42, z: 30 },
      { x: 42, z: 48 }, // Beymouth
      { x: 42, z: 62 },
    ],
  },
  {
    id: "SmugglersVein",
    name: "Smuggler's Vein",
    type: "smuggling",
    color: "#3f7d52", // Zahari green
    dashed: true,
    waypoints: [
      { x: 20, z: 70 },
      { x: 32, z: 78 }, // Imghala
      { x: 45, z: 82 },
      { x: 62, z: 75 }, // Vael Ridge
    ],
  },
  {
    id: "DuskoreRun",
    name: "Duskore Run",
    type: "resource",
    color: "#4ade80",
    waypoints: [
      { x: 62, z: 75 }, // Vael Ridge
      { x: 48, z: 80 }, // Zahar-Oun
    ],
  },
  // Humanitarian Corridors
  {
    id: "MercyCorridor",
    name: "Mercy Corridor",
    type: "humanitarian",
    color: "#38bdf8", // Cyan / active but threatened
    dashed: true,
    status: "Active (Threatened)",
    waypoints: [
      { x: 2, z: 46 },   // Western border
      { x: 42, z: 48 },  // Beymouth
    ],
  },
  {
    id: "ReliefLine",
    name: "Relief Line",
    type: "humanitarian",
    color: "#fbbf24", // Amber / partial
    dashed: true,
    status: "Partially Operational",
    waypoints: [
      { x: 40, z: 92 },  // Southern entry
      { x: 48, z: 80 },  // Zahar-Oun
    ],
  },
  {
    id: "GateRelief",
    name: "Gate Relief",
    type: "humanitarian",
    color: "#a855f7", // Purple / proposed
    dashed: true,
    status: "Proposed",
    waypoints: [
      { x: 62, z: 45 },  // Qasar Gate
      { x: 48, z: 80 },  // Zahar-Oun
    ],
  },
  {
    id: "RefugeeLine",
    name: "Refugee Line",
    type: "humanitarian",
    color: "#f87171", // Rose / informal
    dashed: true,
    status: "Informal",
    waypoints: [
      { x: 42, z: 48 },  // Beymouth
      { x: 22, z: 68 },  // Tishrin
    ],
  },
];

// Helper to convert 0-100 normalized coordinates into Three.js 3D world coordinates
export function gridToWorld(x: number, z: number, scale = 1.0): [number, number, number] {
  // World origin (0,0) is center of map (x: 50, z: 50)
  // Horizontal plane: X = (x - 50) * 0.3 * scale, Z = (z - 50) * 0.3 * scale
  const worldX = (x - 50) * 0.3 * scale;
  const worldZ = (z - 50) * 0.3 * scale;
  const worldY = computeTerrainHeight(x, z);
  return [worldX, worldY, worldZ];
}

export const STRATEGIC_CONNECTIONS: Record<string, { connectedEntities: string[]; primaryResource?: string; routes?: string[] }> = {
  VaelRidge: {
    connectedEntities: ['Duskore', 'ZaharOun', 'Imghala', 'DuskoreRun', 'SmugglersVein', 'res-duskore', 'Z-04'],
    primaryResource: 'Duskore',
    routes: ['DuskoreRun', 'SmugglersVein'],
  },
  Adessa: {
    connectedEntities: ['Veridium', 'OrunDal', 'TalVureen', 'GoldRoad', 'res-veridium', 'K-02'],
    primaryResource: 'Veridium',
    routes: ['GoldRoad'],
  },
  Beymouth: {
    connectedEntities: ['SeamCrossing', 'MercyCorridor', 'RefugeeLine', 'theSeam', 'SefKarib', 'Tishrin', 'AH-03', 'K-01'],
    routes: ['SeamCrossing', 'MercyCorridor', 'RefugeeLine'],
  },
  SefKarib: {
    connectedEntities: ['IronLine', 'theSeam', 'Beymouth', 'K-01', 'K-04'],
    routes: ['IronLine'],
  },
  SuniWells: {
    connectedEntities: ['theSeam', 'Tishrin', 'RefugeeLine', 'K-01'],
    routes: ['RefugeeLine'],
  },
  QasarGate: {
    connectedEntities: ['GateRelief', 'theSeam', 'ZaharOun', 'Z-01'],
    routes: ['GateRelief'],
  },
  ZaharOun: {
    connectedEntities: ['DuskoreRun', 'ReliefLine', 'GateRelief', 'VaelRidge', 'Z-03'],
    routes: ['DuskoreRun', 'ReliefLine', 'GateRelief'],
  },
  Imghala: {
    connectedEntities: ['SmugglersVein', 'VaelRidge', 'Z-02', 'AH-05'],
    routes: ['SmugglersVein'],
  },
  Tishrin: {
    connectedEntities: ['RefugeeLine', 'SuniWells', 'AH-05', 'Z-05'],
    routes: ['RefugeeLine'],
  },
  Marquum: {
    connectedEntities: ['Solite', 'res-solite'],
    primaryResource: 'Solite',
  },
  OrunDal: {
    connectedEntities: ['GoldRoad', 'Veridium', 'K-05', 'N-01'],
    routes: ['GoldRoad'],
  },
  KharaanCity: {
    connectedEntities: ['GoldRoad', 'IronLine', 'K-03'],
    routes: ['GoldRoad', 'IronLine'],
  },
  Duskore: {
    connectedEntities: ['VaelRidge', 'DuskoreRun', 'ZaharOun', 'Z-04'],
    routes: ['DuskoreRun'],
  },
  Veridium: {
    connectedEntities: ['Adessa', 'GoldRoad', 'OrunDal', 'K-02'],
    routes: ['GoldRoad'],
  },
  GoldRoad: {
    connectedEntities: ['KharaanCity', 'TalVureen', 'Adessa', 'OrunDal'],
    routes: ['GoldRoad'],
  },
  IronLine: {
    connectedEntities: ['KharaanCity', 'SefKarib'],
    routes: ['IronLine'],
  },
  SeamCrossing: {
    connectedEntities: ['Beymouth', 'SefKarib', 'theSeam'],
    routes: ['SeamCrossing'],
  },
  SmugglersVein: {
    connectedEntities: ['Imghala', 'VaelRidge', 'Z-02'],
    routes: ['SmugglersVein'],
  },
  DuskoreRun: {
    connectedEntities: ['VaelRidge', 'ZaharOun'],
    routes: ['DuskoreRun'],
  },
  MercyCorridor: {
    connectedEntities: ['Beymouth', 'AH_baseCamp_west', 'AH-01'],
    routes: ['MercyCorridor'],
  },
  ReliefLine: {
    connectedEntities: ['ZaharOun'],
    routes: ['ReliefLine'],
  },
  GateRelief: {
    connectedEntities: ['QasarGate', 'ZaharOun'],
    routes: ['GateRelief'],
  },
  RefugeeLine: {
    connectedEntities: ['Beymouth', 'Tishrin', 'SuniWells'],
    routes: ['RefugeeLine'],
  },
};

export function getEntityCoordinates(id: string): { x: number; z: number } | null {
  if (CITIES_COORDS[id]) return CITIES_COORDS[id];
  if (RESOURCES_COORDS[id]) return RESOURCES_COORDS[id];
  if (WATER_COORDS[id]) return { x: WATER_COORDS[id].x, z: WATER_COORDS[id].z };
  if (ASHEN_HAND_SITES[id]) return { x: ASHEN_HAND_SITES[id].x, z: ASHEN_HAND_SITES[id].z };

  // Try matching resource clean name
  const resKey = Object.keys(RESOURCES_COORDS).find(k => k.toLowerCase() === id.toLowerCase() || id.toLowerCase().includes(k.toLowerCase()));
  if (resKey) return RESOURCES_COORDS[resKey];

  // Try matching route midpoint
  const route = ROUTES_POLYLINES.find(r => r.id === id || r.name.replace(/\s+/g, '') === id);
  if (route && route.waypoints.length > 0) {
    const midIdx = Math.floor(route.waypoints.length / 2);
    return route.waypoints[midIdx];
  }

  // Check military positions
  const kfob = MILITARY_POSITIONS.kharaanFOBs.find(f => f.id === id);
  if (kfob) return { x: kfob.x, z: kfob.z };
  const zpos = MILITARY_POSITIONS.zahariPositions.find(p => p.id === id);
  if (zpos) return { x: zpos.x, z: zpos.z };

  return null;
}

// Procedural height calculation consistent across terrain and markers
export function computeTerrainHeight(x: number, z: number): number {
  let height = 0.2; // base plateau

  // 1. Sundered Sea (West littoral, x: 0-12) slopes into the water
  if (x < 14) {
    height = -0.5 + (x / 14) * 0.7;
    return height;
  }

  // 2. The Spine (East, x: 80-100) - high mountain ridge
  if (x > 75) {
    const spineT = (x - 75) / 25;
    const ridgeNoise = Math.sin(z * 0.15) * 0.8 + Math.cos(z * 0.28) * 0.5;
    height += Math.pow(spineT, 1.4) * 3.5 + ridgeNoise * 0.4;
  }

  // 3. The Golden Wastes (North, z: 0-30) - raised rolling dunes
  if (z < 32) {
    const duneT = (32 - z) / 32;
    const duneWave = Math.sin(x * 0.2 + z * 0.1) * 0.35 + Math.cos(x * 0.1) * 0.25;
    height += duneT * 1.1 + duneWave * 0.3;
  }

  // 4. The Gash (Canyon centered ~ x: 28, z: 55) - carved depression
  const gashDist = Math.hypot((x - 28) * 1.5, z - 55);
  if (gashDist < 12) {
    const canyonFactor = (12 - gashDist) / 12;
    height -= canyonFactor * 1.4;
  }

  // 5. The Seam (Z: 38-50, X: 25-70) - rugged trench/rift line
  if (z >= 38 && z <= 50 && x >= 25 && x <= 70) {
    const seamCenterDist = Math.abs(z - 44);
    height -= (1 - seamCenterDist / 6) * 0.3;
  }

  return Math.max(-0.6, height);
}

