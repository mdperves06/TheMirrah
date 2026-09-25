# The Mirrah — Diplomatic Crisis Atlas & Strategy Drill

> *"Diplomatic strategy meets a polished, explorable atlas: Civilization diplomacy screen × museum interactive × flashcard mastery tracker."*

**The Mirrah** is a single-page web app and serious game that trains a delegate to master a fictional Model United Nations crisis drill set in the Saverine Expanse.

---

## 🌟 Flagship Features

1. **Atlas Mode (3D Interactive Tactical Atlas)**
   - Procedural low-poly terrain built with `@react-three/fiber` & `three.js`.
   - Procedural desert basin, The Spine mountain ridge on the east, Sundered Sea animated water plane on the west, raised Golden Wastes dunes in the north, and The Gash canyon choke point.
   - **Live-colored territory overlay**: Kharaan Gold (~62%) vs Zahari Front Green (~38%), pulsing red contested Seam band.
   - Interactive 3D pins and billboards for all cities, strategic resource nodes, encircled oases, and Ashen Hand threat cells with hover tooltips and slide-in inspection dossiers.
   - Flowing dashed route lines (Gold Road, Iron Line, Seam Crossing, Smuggler's Vein, Duskore Run) and 4 status-coded humanitarian corridors.
   - Layer toggles & Sanctions Heat map highlights.

2. **Briefing Codex Mode**
   - 10 comprehensive briefing tabs containing verbatim lore and strategic data.
   - Interactive horizontal chronology scrubber covering ~150 years of conflict, highlighting ★ escalation points (Tishrin Massacre, Seam War, Qasar Accords collapse, Suni Wells siege).
   - "Test Me" flashcard hooks on every briefing card.

3. **Campaign Mode (Video Game Crisis Negotiation)**
   - Replay the drill from **every party's seat**: Kingdom of Kharaan, The Zahari Front, or The Concord of Crowns.
   - 3-Phase structured campaign:
     - **Phase 1:** Framework & Ceasefire
     - **Phase 2:** Territory & Resources
     - **Phase 3:** Sanctions & Repercussions
   - In-character AI counterparts powered by Claude (via the Express proxy) with realistic offline scripted fallback.
   - **The Ashen Hand Environmental Threat Engine**: non-negotiable antagonist periodically firing crisis cards and dilemmas.
   - Live trust meters, territorial control shifts, and after-action victory/breakdown reports.

4. **Sanctions Sandbox (Phase 3 Sandbox)**
   - Official Target Register spanning Categories A, B, C (mostly Disputed), and D.
   - 3 multilateral instruments: Travel Ban, Arms Embargo, and Assets Freeze.
   - Enforced targeting rules (e.g. Travel Bans restricted to natural persons).
   - Real-time `Recharts` impact readout calculating leverage shifts and Ashen Hand funding cuts.
   - Diplomatic objections triggered on contested designations.

5. **Best Delegate Coach Mode**
   - Free-write console for Opening Speeches, Moderated Caucus Points, and Draft Resolution Clauses.
   - Graded strictly against the 5-point Model UN rubric (Scenario Accuracy 25%, Diplomacy & Tone 20%, Coalition Logic 20%, Leverage 20%, Drafting Specificity 15%).
   - Returns scores, key strengths, diagnostic fixes, and a rewritten exemplar line.
   - **Mastery Dashboard**: Recharts Radar Chart tracking 8 scenario dimensions with an automated *"Weakest Area → Drill This"* action button.

6. **Flashcard Question Bank**
   - Over 40 scenario-locked quiz items covering History, Parties, Geography, Resources, Routes, Ashen Hand, Sanctions, and Crisis Diplomacy.
   - Persistent mastery tracking via `localStorage`.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for AI)
To enable live Anthropic Claude model responses:
1. Copy `server/.env.example` to `server/.env`:
   ```bash
   cp server/.env.example server/.env
   ```
2. Add your Anthropic API key:
   ```env
   ANTHROPIC_API_KEY=your_key_here
   PORT=3001
   ```
> **Note:** If no API key is provided, the application runs in offline mode using scripted in-character fallback dialogues and algorithmic rubric evaluation.

### 3. Run the Development Server
```bash
npm run dev
```
Visit `http://localhost:5173` in your browser.

### 4. (Optional) Run the AI Proxy Backend
In a separate terminal:
```bash
npm run server
```
The server will run on `http://localhost:3001` and proxy `/api/delegate` and `/api/coach`.

### 5. Deploying to Render (Web Service)
- **Service Type:** Web Service (Node)
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start`
- **Environment Variables (Optional):** `ANTHROPIC_API_KEY=your_key`
The unified production server automatically serves the compiled frontend (`dist/`) and handles client-side routing fallback and `/api/*` requests on the assigned port.

---

## 🛠 Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **3D Engine:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **State Management:** Zustand (`useMirrahStore`)
- **Routing:** React Router v6
- **Analytics & Charts:** Recharts
- **Backend Proxy:** Express, CORS, dotenv
- **Model:** `claude-sonnet-4-6` (via server proxy) with graceful offline fallback
- **Persistence:** LocalStorage wrapper (`save.ts`)

---

## 📜 Scenario Lore Reference

- **Title:** The Mirrah — Contested Lands of the Saverine Expanse
- **Initial Territorial Control:** Kingdom of Kharaan ~62% | The Zahari Front ~38% | The Seam contested
- **Defining Zahari Grievance:** The cancellation of Queen Solvane I's promised self-determination referendum ~14 years ago
- **Key Resources:** Veridium (Lithium analog), Duskore (Rare Earths analog), Solite (Phosphate analog), Cinderstone (Natural Gas analog), Ashsalt (Potash analog)
- **Threat Actor:** The Ashen Hand (stateless extremist non-seat org aiming to perpetuate conflict)
