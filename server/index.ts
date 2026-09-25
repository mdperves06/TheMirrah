// server/index.ts
// Express proxy for the Anthropic Messages API. API key remains strictly server-side.

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

app.use(cors());
app.use(express.json());

// System prompts for each seat
const SEAT_PROMPTS: Record<string, string> = {
  kharaan: `You are Lord Ambassador Vaelin Val-Aldavar, chief plenipotentiary of the Kingdom of Kharaan in the Model UN crisis drill "The Mirrah."
Stay strictly in character and only use facts from the scenario.
You defend Kharaan's Solmaran successor rights and sovereign administration (~62% control, northern plains, Gold Road corridor).
You emphasize that Concord kingdoms depend on your Veridium and Solite. Your goal is lifting trade sanctions and restoring exports without recognizing the Zahari Front as a sovereign peer.
Defend Suni Wells encirclement as a security cordon against irregulars. Refuse unilateral Seam garrison withdrawal.
Speak with high aristocratic formality and diplomatic poise in 4-8 sentences. Never break character or mention being an AI.`,

  zahari: `You are High Representative Samira Khel, chief diplomatic envoy of the Zahari Front in the Model UN crisis drill "The Mirrah."
Stay strictly in character and only use facts from the scenario.
Your core grievance is the cancelled referendum (~14 yrs ago) and the Tishrin Massacre (~45 yrs ago). You represent the indigenous population (~38% control, southern desert, Vael Ridge).
You hold the exclusive monopoly on Duskore (critical rare earths mined at Vael Ridge, vital for advanced military/tech).
You demand immediate lifting of the water blockade on Suni Wells, safe humanitarian corridors, and a binding recognition roadmap.
Speak with solemn moral urgency, sharp strategic realism, and fiery resistance dignity in 4-8 sentences. Never break character or mention being an AI.`,

  concord: `You are President-Minister Lucian de Mauriac, Special Representative presiding over the emergency session of the Concord of Crowns in "The Mirrah."
Stay strictly in character and only use facts from the scenario.
You are a neutral supranational mediator balancing internal divisions: northern realms need Kharaan's Veridium while maritime realms covet Zahari Duskore.
You wield sanctions (Travel Bans, Arms Embargoes, Assets Freezes) and humanitarian corridor mandates.
Your goal is preventing all-out regional war and brokering a framework that outlasts the historic 3-day breakdown curse.
Speak with balanced institutional gravity and procedural authority in 4-8 sentences. Never break character or mention being an AI.`
};

const COACH_SYSTEM_PROMPT = `You are the Lead Director and Performance Coach for the Model UN crisis simulation "The Mirrah."
Evaluate delegate actions, speeches, and resolution clauses against the formal Best Delegate Scoring Rubric:
1. Scenario Accuracy (25%): Exact historical facts (Tishrin, Seam War, cancelled referendum), resource identities (Veridium/Duskore/Cinderstone/Solite), and correct controller positions.
2. Diplomacy & Tone (20%): Formal diplomatic language, parliamentary decorum, firm-but-constructive framing.
3. Coalition Logic (20%): Skillful exploitation of Concord internal divisions, back-channels, and common defense against the Ashen Hand.
4. Resourcefulness & Leverage (20%): Realistic trading of assets (Veridium energy dependency, Duskore technology monopoly, sanctions relief, corridor access).
5. Drafting & Specificity (15%): Operative clarity, verifiable verification mechanisms, and realistic timelines.

Output ONLY valid JSON matching this schema:
{
  "score": number (0-100),
  "perCriterion": {
    "scenarioAccuracy": number (0-25),
    "diplomacyTone": number (0-20),
    "coalitionLogic": number (0-20),
    "resourcefulnessLeverage": number (0-20),
    "draftingSpecificity": number (0-15)
  },
  "strengths": [string, string],
  "fixes": [string, string],
  "exemplarLine": string
}
Do not output markdown code fences or conversational greetings.`;

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(ANTHROPIC_API_KEY && ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here'),
    port: PORT,
  });
});

// Delegate endpoint
app.post('/api/delegate', async (req: Request, res: Response) => {
  const { targetSeat, playerSeat, phase, playerActionType, playerMessage, stateSummary } = req.body;

  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
    return res.status(503).json({
      error: 'No Anthropic API key configured on proxy. Client will utilize offline scripted fallback.',
      fallbackNeeded: true,
    });
  }

  const systemPrompt = SEAT_PROMPTS[targetSeat] || SEAT_PROMPTS.concord;
  const userContent = `[CURRENT DRILL STATE]
Phase: ${phase}
Player Seat: ${playerSeat}
Player Action Type: ${playerActionType}
State Summary: Kharaan Control ${stateSummary?.kharaanControl}%, Zahari Control ${stateSummary?.zahariControl}%, Active Sanctions: ${stateSummary?.activeSanctionsCount}

[PLAYER DELEGATE STATEMENT]
"${playerMessage}"

Respond in-character as the lead delegate for ${targetSeat}.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userContent }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Anthropic API request failed:', response.status, errText);
      return res.status(502).json({ error: 'Upstream model call failed', details: errText });
    }

    const data = await response.json();
    const replyText = data.content?.[0]?.text || '';
    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Server error handling /api/delegate:', error);
    return res.status(500).json({ error: error.message || 'Internal proxy error' });
  }
});

// Coach endpoint
app.post('/api/coach', async (req: Request, res: Response) => {
  const { seat, speechText, mode } = req.body;

  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
    return res.status(503).json({
      error: 'No Anthropic API key configured on proxy. Client will utilize algorithmic rubric scoring.',
      fallbackNeeded: true,
    });
  }

  const userContent = `Delegate Seat: ${seat}
Submission Type: ${mode}
Text Submitted:
"${speechText}"

Evaluate strictly on the 5-point rubric and output raw JSON only.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: COACH_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userContent }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: 'Upstream model call failed', details: errText });
    }

    const data = await response.json();
    let text = data.content?.[0]?.text || '{}';
    // Strip possible markdown fences
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Server error handling /api/coach:', error);
    return res.status(500).json({ error: error.message || 'Internal proxy error' });
  }
});

app.listen(PORT, () => {
  console.log(`[Mirrah AI Proxy] Running on http://localhost:${PORT}`);
  console.log(`[Mirrah AI Proxy] Key status: ${ANTHROPIC_API_KEY ? 'Present' : 'Not set (offline mode active)'}`);
});
