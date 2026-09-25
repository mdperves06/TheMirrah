## 0. THE ONE-LINE BRIEF

Build a single-page web app that teaches a delegate to **master a fictional MUN crisis drill ("The Mirrah")** by combining:
1. A **live, interactive 3D map** of the territory that reacts in real time to the state of negotiations.
2. A **video-game campaign** in which the player assumes and plays **every party** (Kharaan, the Zahari Front, the Concord of Crowns) against AI-driven counterparts.
3. A **Best Delegate coaching layer** that grades speeches, position moves, and resolutions and tracks mastery.

The tone is "serious game": diplomatic strategy meets a polished, explorable atlas. Think *Civilization diplomacy screen* × *museum interactive* × *flashcard mastery tracker*.

---

## 1. TECH STACK (use exactly this unless a dependency fails)

| Layer | Choice | Notes |
|---|---|---|
| Build tool | **Vite** | `npm create vite@latest mirrah -- --template react-ts` |
| Language | **React 18 + TypeScript** | strict mode on |
| 3D | **three.js** via **@react-three/fiber** + **@react-three/drei** | procedural terrain, no external 3D assets required |
| Styling | **Tailwind CSS** | plus a small custom theme (Section 7) |
| State | **Zustand** | single global store, `useMirrahStore` |
| Routing | **react-router-dom** | one route per mode |
| Animation | **framer-motion** | UI transitions only (not 3D) |
| Charts | **recharts** | sanctions impact + mastery dashboards |
| AI backend | **Express proxy** (`/server`) calling the Anthropic Messages API | key stays server-side, never in the client |
| Persistence | **localStorage** wrapper (`src/lib/save.ts`) | mastery, progress, save slots |

**Do not** put the Anthropic API key in client code. Read it from `server/.env` (`ANTHROPIC_API_KEY=...`), add `.env` to `.gitignore`, and proxy all model calls through `POST /api/delegate` and `POST /api/coach`. Provide a `.env.example` with a placeholder. The app must degrade gracefully (scripted fallback responses) if no key is present, so the map/codex/quizzes work offline.

Model string for in-app AI: **`claude-sonnet-4-6`**, `max_tokens: 1024`.

---

## 2. APP STRUCTURE / FILE TREE

```
mirrah/
├─ SPEC.md
├─ index.html
├─ package.json
├─ .gitignore
├─ server/
│  ├─ index.ts            # Express proxy: /api/delegate, /api/coach
│  └─ .env.example
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx             # router + layout shell
│  ├─ theme.css
│  ├─ data/
│  │  ├─ scenario.ts      # ALL data from Section 4 (single source of truth)
│  │  ├─ coordinates.ts   # map coords from Section 5
│  │  ├─ personas.ts      # AI system prompts from Section 8
│  │  └─ quizzes.ts       # question bank from Section 9
│  ├─ store/
│  │  └─ useMirrahStore.ts
│  ├─ lib/
│  │  ├─ save.ts          # localStorage
│  │  ├─ ai.ts            # fetch wrappers for the proxy + offline fallback
│  │  └─ scoring.ts       # Best Delegate rubric
│  ├─ map/               # the 3D Atlas
│  │  ├─ Atlas.tsx        # <Canvas> root
│  │  ├─ Terrain.tsx      # procedural desert mesh
│  │  ├─ Territory.tsx    # control-zone overlay (re-colors live)
│  │  ├─ TheSeam.tsx      # pulsing contested band
│  │  ├─ Spine.tsx        # eastern mountains
│  │  ├─ Sea.tsx          # Sundered Sea water plane
│  │  ├─ Markers.tsx      # cities, resources, oases, Ashen Hand sites
│  │  ├─ Routes.tsx       # animated trade / military / humanitarian lines
│  │  └─ LayerControls.tsx
│  ├─ modes/
│  │  ├─ AtlasMode.tsx        # explore the live map
│  │  ├─ CodexMode.tsx        # structured briefing + history timeline
│  │  ├─ CampaignMode.tsx     # play each party through the phases
│  │  ├─ SanctionsMode.tsx    # Phase 3 sandbox
│  │  └─ CoachMode.tsx        # speech/resolution feedback + mastery
│  └─ components/             # shared UI (Panel, Card, Pin, Tooltip, etc.)
└─ README.md
```

---

## 3. THE FIVE MODES (feature specs)

### 3.1 ATLAS MODE — the live 3D map *(flagship feature)*
- Full-screen `@react-three/fiber` `<Canvas>` with `OrbitControls` (rotate/zoom/pan), a default "diplomat's eye" isometric camera, and a "snap to north" button.
- Procedural low-poly terrain: flat-ish desert basin, the **Spine** as a mountain ridge along the east edge, the **Sundered Sea** as an animated water plane on the west, raised dune fields ("Golden Wastes") in the north, and **The Gash** as a carved canyon center-west.
- **Territory overlay** colored live from store state: Kharaan **gold (~62%)**, Zahari Front **green (~38%)**, **The Seam** a translucent **red band** that *pulses*. When campaign events shift control, the overlay re-colors with a smooth tween — this is what makes the map "live."
- **Markers** (3D pins/billboards): every city, resource deposit, oasis, and Ashen Hand site from Section 4/5. Click → side panel with the entry's facts, sanctions links, and "why it matters." Hover → tooltip.
- **Animated routes**: Gold Road, Iron Line, Seam Crossing, Smuggler's Vein, Duskore Run (flowing dashed lines), plus the four humanitarian corridors (distinct style + status color: active/threatened/proposed/informal).
- **Layer toggles** (`LayerControls`): Control zones · Resources · Military positions (4 Kharaan FOBs / 4 Zahari positions) · Ashen Hand sites (threat-pulse) · Trade routes · Humanitarian corridors · Sanctions heat (highlights map entities on the target list).
- **Live state hooks**: sanctions applied in Sanctions Mode visibly mark affected markers; siege/escalation events from Campaign Mode trigger map effects (e.g., Suni Wells turns restricted-red, Beymouth flashes on a bombing event).

### 3.2 CODEX MODE — learn the scenario cold
- Tabbed reference built entirely from `scenario.ts`: **Overview · History · Parties · The Ashen Hand · Geography · Resources · Routes · Current Situation · Stakes · Sanctions List.**
- Interactive **history timeline** (horizontal scrub) with the ★ escalation events emphasized; clicking a node highlights the relevant place on a mini-map.
- Each Codex card carries a "Test me" button that pulls a relevant quiz item (Section 9) and updates mastery.

### 3.3 CAMPAIGN MODE — *play every party* (the "video game")
A phase-based campaign. The player picks a **seat** and negotiates against AI-driven versions of the other seats. Replayable from any seat.

**Seats (all playable):**
- **Kingdom of Kharaan** — state actor defending administration + Veridium exports, under Concord scrutiny.
- **The Zahari Front** — resistance seeking recognition, Duskore revenue, humanitarian relief.
- **The Concord of Crowns** — mediator/sanctions authority, internally divided.
- **The Ashen Hand** — **NOT a seat.** It is an environmental antagonist AI that periodically injects crisis events designed to wreck any agreement. The player never controls or negotiates with it; it raises stakes.

**Phases (the doc implies a 3-phase structure; build all three):**
- **Phase 1 — Framework & Ceasefire:** agree on a negotiating framework and stabilize the Seam.
- **Phase 2 — Territory & Resources:** Seam line, resource access (Veridium / Duskore / Cinderstone / Ashsalt), corridors.
- **Phase 3 — Sanctions & Repercussions:** apply/relax measures against the target list (links to Sanctions Mode).

**Turn loop per phase:**
1. Briefing panel: the seat's objectives, constraints, red lines, and current map state.
2. Player chooses an **action**: deliver a statement, table a proposal, form a caucus/back-channel, make a concession, escalate, or respond to a crisis card.
3. AI counterparts respond in-character via `/api/delegate` (personas in Section 8). The Concord can issue censures/sanctions; the Ashen Hand may fire a crisis card.
4. The **Director** scores the move against the Best Delegate rubric (Section 6) and updates: relationship meters (trust per party), map control state, sanctions state, and a phase objective tracker.
5. Phase ends on objective completion, breakdown (3-day collapse rule from the lore), or a fixed action budget. Show an after-action report.

**Win/learn conditions** mirror Section 4.10 "What Is At Stake": each seat has a *talks-succeed* and *talks-collapse* outcome, plus a Best Delegate score (0–100).

### 3.4 SANCTIONS MODE — Phase 3 sandbox
- Render the full target list (Categories A–D) as cards with code, name, role, designation, and **Disputed** flags.
- Three sanction instruments — **Travel Ban** (individuals only), **Arms Embargo** (individuals/entities/parties), **Assets Freeze** (individuals/corporations/state entities) — enforced against the "Who it can target" rules so the player learns the constraints.
- Applying a sanction updates the live map (heat layer) and produces a `recharts` **impact readout** (effect on each party's leverage + Ashen Hand funding). Designations marked *Disputed/Contested* trigger an AI objection from the relevant seat, teaching negotiation over contested designations.

### 3.5 COACH MODE — Best Delegate trainer
- Free-write box for an **opening speech**, a **moderated-caucus point**, or a **draft resolution clause**. Player picks the seat they're speaking as.
- `/api/coach` returns structured feedback scored on the rubric (Section 6): accuracy to the scenario, diplomatic tone, coalition logic, resourcefulness, and resolution drafting. Returns a numeric score, 2–3 strengths, 2–3 fixes, and one rewritten exemplar line.
- **Mastery dashboard**: radar/heatmap of topic coverage (history, parties, geography, resources, routes, sanctions, crisis response) driven by quiz + campaign + coach performance, with a single "Mastery %" and a "weakest area → drill this" call to action.

---

## 4. SCENARIO DATA (embed verbatim into `src/data/scenario.ts`)

Export each block as typed constants. This is the single source of truth — every mode reads from here.

### 4.1 Meta
- Title: **The Mirrah** — Contested Lands of the Saverine Expanse.
- Negotiating parties: **Kingdom of Kharaan · The Zahari Front · The Concord of Crowns.**
- Threat actor (not a party): **The Ashen Hand.**
- Entry point: present-day Concord of Crowns emergency session; all parties summoned.
- Control split: Kharaan ~62% · Zahari ~38% · The Seam contested.

### 4.2 History (ordered)
- ~150 yrs: **Solmaran Dominion** collapses → Mirrah ungoverned, nomadic Zahari tribes remain, no recognized sovereign.
- ~130 yrs: **Concord of Crowns** founded by successor kingdoms (trade/diplomacy/sanctions/recognition authority).
- ~90 yrs: **First March** — King **Aldavar II** claims Solmaran successor rights; Concord doesn't object.
- ~75 yrs: **Settlement Decree + Gold Road** built; Zahari pushed south.
- ~60 yrs: **Veridium discovery** in the north → Mirrah becomes strategically vital; Concord kingdoms become dependent.
- ~45 yrs: ★ **Tishrin Massacre** — Kharaan forces fire on Zahari civilians; scattered tribes unify into the **Zahari Front**, declare **Zahar-Oun** capital.
- ~40 yrs: First Concord petition by the Front; no action.
- ~35 yrs: ★ **The Seam War** (18 months) → stalemate; Concord ceasefire freezes the Seam front line.
- ~28 yrs: ★ **Qasar Accords collapse**; first **Beymouth bombing** by the newly emerged **Ashen Hand**.
- ~20 yrs: **Referendum promised** by Queen **Solvane I**; brief ceasefire; Front suspends armed ops.
- ~14 yrs: ★ **Referendum cancelled** → ceasefire voided; Ashen Hand resurges at scale. *(Defining Zahari grievance.)*
- ~8 yrs: **Duskore discovery** in the Zahari south → Front gains leverage; Concord splits.
- ~4 yrs: ★ **Beymouth bombing — 34 killed** → Concord suspends Seam trade.
- ~2 yrs: ★ **Suni Wells Siege** — Kharaan encircles a Zahari water source → first Concord **censure of Kharaan**.
- **PRESENT:** Concord emergency session — the drill begins.

### 4.3 Party — Kingdom of Kharaan
State actor. Capital **Kharaan City** (royal seat, outside the Mirrah proper). Holds ~62% (northern plains, Gold Road corridor, major cities). Claim: Solmaran successor rights. Administers majority as sovereign; garrisons the Seam; controls primary resource infrastructure. Founding, influential Concord member, under scrutiny post-Suni Wells. **Key asset: Veridium + Solite** — resources most Concord kingdoms depend on.

### 4.4 Party — The Zahari Front
Resistance / non-state actor. Capital **Zahar-Oun** (south). Holds ~38% (southern desert, eastern approaches, **Vael Ridge**). Claim: indigenous rights + self-determination; not consulted on annexation. Runs the **Smuggler's Vein** supply route; holds **Duskore** mining at Vael Ridge. Not Concord-recognized, but some members keep back-channel contact. **Key asset: Duskore** (rare earths, vital to advanced/military industry) — primary bargaining chip.

### 4.5 Party — The Concord of Crowns
Mediating body. Seat neutral/external. Role: mediator, sanctions authority, humanitarian coordinator, framework negotiator. Members = all major Solmaran successor kingdoms incl. Kharaan; the Front is **not** a member. Leverage: impose/lift trade sanctions, control recognition, administer humanitarian corridor access. **Internally divided** — some members depend on Kharaan's Veridium, others want Zahari Duskore (not a monolith). Has censured Kharaan once (Suni Wells), suspended Seam trade (Beymouth), and called this session.

### 4.6 The Ashen Hand (environmental threat)
Non-state extremist org, stateless, no fixed territory. Emerged ~28 yrs ago as a splinter after the Qasar Accords collapse; now recruits Expanse-wide. **Objective: perpetuation of conflict** — opposes any ceasefire/peace/humanitarian deal and will target it. Methods: bombings of trade/civilian sites, assassination of moderates/negotiators, disrupting corridors, black-market **Cinderstone** trading. Six confirmed operational sites incl. a western base camp and a Spine-ridge cell; operates in both territories. **Key fact:** neither party controls or supports it; both have suffered its attacks — the one documented area of common ground.

### 4.7 Geography
- **The Seam** — contested east-west strip; frozen ceasefire line; skirmishes + key deposits.
- **The Spine** — eastern mountain range; controls eastern access; Cinderstone along the ridge.
- **The Golden Wastes** — vast northern dune fields; largely impassable; natural buffer.
- **The Gash** — deep canyon center-west; choke point on north-south movement.
- **The Sundered Sea** — western coastal waters; maritime access to the territory's west.
- **Salt Flats (×3)** — dried lake beds in both zones; Ashsalt; historically near-neutral.
- **Oases (×3)** — **Vire** (west), **Suni Wells** (center-south, currently restricted), **Tal** (northeast).

### 4.8 Cities
| City | Controller | Role |
|---|---|---|
| Kharaan City | Kharaan | Royal capital (outside Mirrah) |
| Tal Vureen | Kharaan | Admin hub, north |
| Adessa | Kharaan | Primary Veridium town |
| Marquum | Kharaan | Solite (phosphate) center |
| Sef Karib | Kharaan | Forward garrison on the Seam |
| Orun Dal | Kharaan | Rail/logistics junction, center |
| Zahar-Oun | Zahari Front | Declared capital |
| Imghala | Zahari Front | Southern stronghold, Smuggler's Vein hub |
| Vael Ridge | Zahari Front | Duskore mining camp (primary economic asset) |
| Tishrin | Zahari Front | Desert post; Tishrin Massacre site |
| Beymouth | Contested | Trade town on the Seam; primary flashpoint |
| Qasar Gate | Contested | Seam checkpoint; failed Qasar Accords site |

### 4.9 Resources
| Resource | Analog | Location | Control | Importance |
|---|---|---|---|---|
| Veridium | Lithium | N. interior + Seam | Kharaan / Contested | Energy storage; critical to all Concord economies |
| Solite | Phosphate | Marquum plains, NW | Kharaan | Fertilizer; agricultural output |
| Cinderstone | Solid natural gas | Spine ridge + Seam | Contested | Clean fuel; Ashen Hand trades it illegally |
| Duskore | Rare earths | Vael Ridge + S. Zahari | Zahari Front | Advanced tech + military; Zahari bargaining chip |
| Ashsalt | Potash / salts | Salt flats, both zones | Shared (de facto) | Agriculture/industry; joint-management candidate |

### 4.10 Routes
- **Gold Road** (Kharaan) — Kharaan City → Adessa → Orun Dal → Spine export points.
- **Iron Line** (Kharaan) — military corridor, Kharaan north → Sef Karib garrison.
- **Seam Crossing** (Contested) — main north-south crossing through Beymouth; most volatile/critical.
- **Smuggler's Vein** (Zahari) — southern supply/export; bypasses Kharaan checkpoints.
- **Duskore Run** (Zahari) — Vael Ridge → Zahar-Oun; rare-earth export.

**Humanitarian corridors (status matters):**
- **Mercy Corridor** — western border → Beymouth — *Active but threatened (Ashen Hand nearby).*
- **Relief Line** — southern entry → Zahari heartland — *Partially operational; legal status disputed by Kharaan.*
- **Gate Relief** — Qasar Gate → Zahar-Oun (cross-Seam) — *Proposed; not yet agreed/secured.*
- **Refugee Line** — Beymouth → Tishrin (west along Seam) — *Informal; no formal protection.*

### 4.11 Current crises (all simultaneous)
Military standoff (4 Kharaan FOBs vs 4 Zahari positions; no stand-down in 14 yrs) · Humanitarian crisis (Suni Wells water restriction; dangerous Refugee Line; all corridors interfered with) · Economic stranglehold (Seam-trade suspension hurts both: Kharaan can't fully export Veridium, Front can't formally trade Duskore) · Ashen Hand escalation (6 sites, 2 cells capable of major coordinated attacks; threat to negotiators HIGH) · Political deadlock (no framework has held >3 days in 28 yrs; cancelled referendum the defining grievance).

### 4.12 Stakes (drive campaign win/lose outcomes)
- **Kharaan** — success: sanctions lifted, Mirrah stabilized under its administration, full Veridium exports. collapse: expanded sanctions, continued Duskore dependency, renewed Seam war risk.
- **Zahari Front** — success: recognition pathway, secured Duskore revenue, improved humanitarian conditions. collapse: continued non-recognition, sustained military pressure, worsening civilian conditions.
- **Concord** — success: restored Seam trade, access to both Veridium + Duskore, proven mediation authority. collapse: prolonged disruption, regional destabilization, lost credibility.
- **Ashen Hand** — success(for them): marginalization. collapse(of talks): expanded freedom, recruitment, black-market revenue.

### 4.13 Sanctions target list (for `SanctionsMode`)
**Category A — Ashen Hand (universal):** AH-01 Varak the Grey (supreme commander, western base camp; Extremist Leadership) · AH-02 The Ember Council (5-member command; Extremist Org) · AH-03 Sorn Delvak (chief bomb-maker, Beymouth bombing; Extremist Operative) · AH-04 The Cinder Exchange (black-market Cinderstone network; Illicit Finance) · AH-05 Mira Ashvane (recruiter in Tishrin/Imghala; Extremist Operative).
**Category B — Kharaan-linked:** K-01 General Tovan Reth (Seam commander, ordered Suni Wells encirclement; Military—HR Concern) · K-02 Mirrah Extraction Authority (state Veridium/Solite corp, accused of forced Zahari labour; State Entity—Labour) · K-03 Lord Casvan Duur (Settlement Decree architect, pro-annexation; Political—Hardliner) · K-04 Aldric Sorne (arms dealer beyond Concord quotas; Illicit Arms) · K-05 Gold Road Logistics Consortium (freight monopoly, accused of blocking Zahari goods; Commercial—Trade).
**Category C — Zahari-linked (mostly Disputed):** Z-01 Commander Yara Sunn (Front military chief, Qasar Gate skirmishes; Military—Disputed) · Z-02 The Vein Council (Smuggler's Vein oversight; Quasi-Gov—Disputed) · Z-03 Davan Mir (external fundraiser, accused of soliciting extremist sympathizers; Finance—Disputed) · Z-04 The Duskore Collective (Vael Ridge co-op; Commercial—Disputed) · Z-05 Elder Sova Tarris (senior figure who once praised Ashen Hand attacks, later retracted; Political—Contested).
**Category D — Neutral / third party:** N-01 Merchant House Velorn (supplies Kharaan militias + Ashen Hand cells; Dual Concern) · N-02 The Grey Brokers (Cinderstone black-market intermediaries; Illicit Finance) · N-03 Admiral Cassen Volk (retired Concord officer advising Kharaan on Sundered Sea positioning; Conflict of Interest).
**Instruments:** Travel Ban (individuals only) · Arms Embargo (individuals/entities/parties) · Assets Freeze (individuals/corporations/state entities).

---

## 5. MAP COORDINATES (embed in `src/data/coordinates.ts`)

Normalized grid: `x` 0→100 (west→east), `z` 0→100 (north→south), `y` is terrain height (compute procedurally). Convert to world units in `Terrain.tsx` (e.g. `world = (n - 50) * scale`).

```ts
// regions (for terrain shaping)
seaEdge:        x 0–12  (west water plane)
goldenWastes:   z 0–30  raised dunes (north)
theSpine:       x 80–100 mountains (east), highest mesh
theGash:        canyon centered ~x28,z55 (carved depression)
theSeam:        red contested band, z ≈ 38–50 across x 25–70

// cities  {x, z}
KharaanCity {8,25} TalVureen {22,28} Adessa {42,22} Marquum {15,42}
OrunDal {55,33} SefKarib {33,40} ZaharOun {48,80} Imghala {32,78}
VaelRidge {62,75} Tishrin {22,68} Beymouth {42,48} QasarGate {62,45}

// resources (deposits) {x, z}
Veridium {48,18} Solite {15,44} Cinderstone_Spine {72,60}
Cinderstone_Seam {46,40} Duskore {55,85} Ashsalt_flats {60,30}

// water {x,z}
VireOasis {10,55} SuniWells {45,58 ; restricted} TalOasis {68,24}

// Ashen Hand sites (6) {x,z} — base camp + Spine cell emphasized
AH_baseCamp_west {18,62} AH_spineCell {74,64}
AH_3 {35,52} AH_4 {52,66} AH_5 {28,72} AH_6 {64,52}

// military {x,z}
Kharaan_FOB x4: SefKarib{33,40}, {40,42}, {50,41}, {60,43}
Zahari_pos  x4: {36,55}, {48,60}, {58,58}, VaelRidge{62,75}

// route polylines (ordered waypoints)
GoldRoad:     KharaanCity → TalVureen → Adessa → OrunDal → Spine{80,35}
IronLine:     KharaanCity → {25,35} → SefKarib
SeamCrossing: {42,30} → Beymouth → {42,62}            // north-south, volatile
SmugglersVein:{20,70} → Imghala → {45,82} → VaelRidge // dashed, south
DuskoreRun:   VaelRidge → ZaharOun

// humanitarian (dashed green, status-colored)
MercyCorridor: {2,46} → Beymouth                 // active/threatened
ReliefLine:    {40,92} → ZaharOun                // partial/disputed
GateRelief:    QasarGate → ZaharOun (cross-Seam) // proposed
RefugeeLine:   Beymouth → Tishrin               // informal
```

---

## 6. BEST DELEGATE SCORING RUBRIC (embed in `src/lib/scoring.ts`)

Score every player action/speech 0–100 as a weighted sum. This is the spine of the "mastery" feel — tune it to reward real MUN skill.

| Criterion | Weight | What earns points |
|---|---|---|
| **Scenario accuracy** | 25% | Correct facts, dates, controllers, resources, party positions; no invented lore. |
| **Diplomacy & tone** | 20% | Formal, in-character, firm-but-constructive; no personal attacks. |
| **Coalition logic** | 20% | Exploits Concord internal divisions / back-channels / shared Ashen Hand threat; builds blocs. |
| **Resourcefulness & leverage** | 20% | Uses the seat's real leverage (Veridium dependence, Duskore chip, sanctions/recognition power) and trades realistically. |
| **Drafting & specificity** | 15% | Clear operative clauses, verifiable mechanisms (corridor security, monitored ceasefire, phased recognition). |

Return `{ score, perCriterion, strengths[], fixes[], exemplarLine }`. Mastery % = rolling average across quizzes, campaign actions, and coach submissions, bucketed by topic for the radar.

---

## 7. VISUAL DESIGN

Read `frontend-design` principles, then apply this theme (it should feel like a confidential field atlas, not a generic dashboard):
- Palette: parchment/sand base `#f1e7d0`, ink `#2a2118`, **Kharaan gold `#c9a13b`**, **Zahari green `#3f7d52`**, **Seam red `#b5402f`**, Ashen Hand charcoal `#3a3a3a`, Concord slate-blue `#3b5775`.
- Type: a serif for headings (e.g. "Spectral"/"Cormorant"), a clean sans for body, a monospace for codes (AH-01, K-02…).
- Chrome: thin double-border "document" frames echoing the briefing; corner rivets optional; subtle paper grain. Keep the 3D canvas the hero — UI panels are translucent overlays, not heavy boxes.
- Motion: restrained. The Seam pulse, route flow, and territory re-color are the only ambient animations.

---

## 8. AI PERSONAS (embed in `src/data/personas.ts` as system prompts)

Each AI seat gets a system prompt. Keep them in-character, scenario-locked (must only use Section 4 facts), and length-limited. Pattern:

> **You are the lead delegate for [PARTY] in a Model UN crisis drill called "The Mirrah." Stay strictly in character and only use facts from the provided scenario. Pursue [PARTY]'s objectives and respect its red lines. Be diplomatic but firm. Respond in 4–8 sentences. Never break character or mention being an AI.**

- **Kharaan persona:** defends sovereignty + Solmaran successor claim, prioritizes lifting sanctions and full Veridium export; sensitive about Suni Wells and the labour accusations; willing to discuss monitored corridors but resists recognition language.
- **Zahari Front persona:** anchors everything on the cancelled referendum + self-determination; leverages Duskore; demands humanitarian relief (Suni Wells, Refugee Line) and a recognition pathway; wary of Kharaan garrisons.
- **Concord persona:** neutral mediator; wields sanctions/recognition/corridor access; voices internal division (Veridium-dependent vs Duskore-interested members); pushes a durable framework and Ashen Hand counter-measures.
- **Ashen Hand (event generator, not a negotiator):** a separate non-dialogue prompt that, on trigger, emits a **crisis card** (bombing, assassination attempt on a negotiator, corridor disruption, Cinderstone black-market revelation) targeting whatever progress was just made. Output is a short event with map effects + a decision the seats must respond to. It never offers terms.
- **Director/Coach persona:** out-of-character evaluator that applies Section 6 and returns structured JSON only.

Each call: send the persona system prompt + a compact JSON of current state (phase, control split, trust meters, recent moves, active sanctions) so replies stay consistent. Strip code fences before parsing Director/Coach JSON.

---

## 9. QUESTION BANK (seed `src/data/quizzes.ts`, ≥40 items)

Tag every item with a `topic` (history / parties / geography / resources / routes / ashenHand / sanctions / crisis) and `difficulty`. Mix MCQ, true/false, and "place it on the map." Seed examples:
- Who controls Vael Ridge, and which resource is mined there? → Zahari Front; Duskore.
- What froze the current front line, and what is that line called? → Concord ceasefire after the 18-month Seam War; The Seam.
- Why can't the Ashen Hand be negotiated with? → its objective is the perpetuation of conflict; it targets any agreement.
- Which Concord action followed the Suni Wells Siege? → first formal censure of Kharaan.
- Which sanction type can target an entire party? → Arms Embargo.
- The cancelled referendum is whose defining grievance? → the Zahari Front.
- Match resource → real-world analog (Veridium=lithium, Duskore=rare earths, Cinderstone=natural gas, Solite=phosphate, Ashsalt=potash).
Generate the rest to cover every Section-4 table.

---

## 10. BUILD MILESTONES (Claude Code: do these in order, verify each)

1. **Scaffold** Vite+React+TS+Tailwind+Zustand+router; theme.css; empty mode routes + nav shell. *Verify: app boots.*
2. **Data layer:** fill `scenario.ts`, `coordinates.ts`, `quizzes.ts`, `personas.ts` from Sections 4/5/8/9. *Verify: typed, imports cleanly.*
3. **Codex Mode:** all tabs + interactive history timeline + "Test me" hooks. *Verify: every Section-4 fact is reachable.*
4. **Atlas Mode (3D):** terrain → sea → Spine → territory overlay → Seam pulse → markers → routes → layer toggles → click panels. *Verify: orbit/zoom smooth; markers clickable; layers toggle; territory re-colors on a test state change.*
5. **Quiz engine + mastery store** wired to localStorage and the radar dashboard.
6. **AI proxy:** `server/index.ts` with `/api/delegate` + `/api/coach`; `.env.example`; offline scripted fallback in `src/lib/ai.ts`. *Verify: works with and without a key.*
7. **Campaign Mode:** seat select → phase loop → AI counterparts → trust meters → crisis cards → live map effects → after-action report; all three seats playable; all three phases.
8. **Sanctions Mode:** target list + instruments with targeting rules + impact charts + map heat layer + Disputed-designation AI objections.
9. **Coach Mode:** speech/clause grading on the rubric + mastery dashboard + "drill your weakest area."
10. **Polish:** loading states, empty/error states, mobile-responsive panels, a short in-app "How to play," and a README with run instructions (`npm i`, set key, `npm run dev`, `npm run server`).

**Acceptance:** a new user can (a) explore the live 3D map and toggle every layer, (b) learn the whole scenario in Codex and pass quizzes, (c) play a full phase as **each** of Kharaan, the Zahari Front, and the Concord against AI counterparts with the map reacting live, (d) run a Phase-3 sanctions exercise, and (e) see a Best Delegate score and a mastery % that pinpoints their weakest topic.

---

## 11. GUARDRAILS
- Treat the **Ashen Hand** purely as a fictional in-game antagonist for drill realism — it is an event generator, never a controllable or negotiable party, and the app should never present its methods as instructional content beyond the abstract lore in Section 4.
- Keep all model output scenario-locked: AI seats must use only embedded facts and must not invent new lore that contradicts Section 4.
- Never hardcode or expose the API key. Never commit `.env`.

*End of specification — v1.0.*
