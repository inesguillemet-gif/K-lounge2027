import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add your Gemini API key in Settings > Secrets.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const KLOUNGE_KNOWLEDGE = `
K-Lounge Paris Pop-Up Store Facts:
- Dates: 2 weeks only — March 23 to April 5, 2026.
- Address: 10 rue Pastourelle, 75003 Paris (Le Marais). Metro: Arts et Métiers, Filles du Calvaire, Temple.
- Hours: Tuesday to Sunday, 11:00 to 20:00 (closed Mondays). Walk-ins welcome; complimentary diagnosis recommended to pre-book.
- Pop-up Launch Discounts: 15% to 25% off ALL 18 curated Korean beauty products only during the 2-week pop-up. Visitors reserve their selection in the Visit Bag online with no shipping fees and pay/pick up on site at 10 rue Pastourelle.
- 6 Pop-up Stations: 01 Free Skin + Scalp Diagnosis (with AI Derm-Vision camera & Custom Skin Report), 02 K-Beauty Curated Drops & Starter Trio, 03 Custom Cushion & Sticker Bar, 04 Salt Bread & Matcha Counter, 05 Peggy Gou Opening Night & DJ Courtyard, 06 Passport Trail & Grand Tombola (chance to win a Seoul round-trip).
- Interactive Experiences & Website Tabs:
  - "popup": The Pop-up overview, 6 sensory stations, hero live countdown, Seoul Skin Lab photo strip.
  - "products": Opening Drop ("First 6 Things You Can Buy"), Glass Skin Starter Trio (€49 instead of €64), and full catalog of 18 SKUs with -15% to -25% pop-up prices.
  - "passport": 3 Passport Missions (Social Boarding +50 pts, Match-3 Flip Cards +75 pts, K-Beauty Detective +75 pts), Grand Tombola draw, Quarterly K-Beauty Box waitlist, Peggy Gou spotlight, K-Lounge Loyalty Card & NFT perks.
  - "quiz": 5-step Skin & Scalp Quiz generating a personalized Skin Dossier + AM/PM routine + hair match (+50 Glow Points).
  - "app": App & Cycle — Interactive Period & Cycle Skincare Advisor (tracks menstrual, follicular, ovulation, and luteal phases, logs cycle days/symptoms like breakouts, dryness, redness, oiliness, cramps, fatigue, and adapts AM/PM K-beauty advice & product picks) + Live Skin + Hair AI Scan preview & K-Lounge App Pass.
  - "games": Glow Arcade mini-games (Match-3 Memory Flip + Catch the Drops) earning Glow Points to unlock real in-store voucher codes (free sheet mask, Salt Bread & Matcha, VIP Priority Pass, Glass Skin Tote).
  - "visit": 10 rue Pastourelle interactive Marais street map, hours, popup offer, VIP newsletter signup.
  - "faq": Searchable & categorized Frequently Asked Questions about the Paris pop-up.
  - "agent": MY PERSONAL AGENT — dedicated AI & Vocal Command concierge hub.

Product Catalog (use exact productId values when triggering ADD_PRODUCT or OPEN_PRODUCT):
- aestura-cream: AESTURA Atobarrier 365 Cream (€22.50, was €28, -20%) — DermaON Ceramide Capsules, barrier repair, First Buy #01.
- aestura-lotion: AESTURA Atobarrier 365 Lotion (€22, was €26, -15%) — face & body lightweight ceramide milk.
- aestura-hydro: AESTURA Atobarrier 365 Hydro Soothing Cream (€20.50, was €24, -15%) — cooling gel-cream.
- skin1004-ampoule: SKIN1004 Madagascar Centella Probio-Cica Intensive Ampoule (€17.50, was €22, -20%) — soothing redness & reactive skin.
- skin1004-cream: SKIN1004 Madagascar Centella Probio-Cica Enrich Cream (€17, was €20, -15%) — nourishing cica seal.
- skin1004-toner: SKIN1004 Madagascar Centella Probio-Cica Essence Toner (€15.50, was €18, -15%) — comforting first-step toner.
- torriden-serum: Torriden DIVE-IN Low Molecular Hyaluronic Acid Serum (€16, was €20, -20%) — 5D Hyaluronic glass-skin hydration, First Buy #02.
- torriden-pad: Torriden DIVE-IN Multi Pad (€18.50, was €22, -15%) — 80 hydrating toner pads.
- torriden-cream: Torriden DIVE-IN Soothing Cream (€18, was €21, -15%) — 100ml lightweight water cream.
- unove-shampoo: UNOVE Deep Damage Repair Shampoo (€18.50, was €22, -15%) — silk protein repair shampoo.
- unove-treatment: UNOVE Deep Damage Treatment EX (€15, was €19, -20%) — protein hair mask, First Buy #03.
- unove-oil: UNOVE Silk Oil Essence Tender Bloom (€22, was €26, -15%) — glowing botanical hair oil.
- jsm-cushion: JUNG SAEM MOOL Essential Skin Nuder Cushion (€30.50, was €36, -15%) — SPF50+ makeup artist cushion, First Buy #04.
- clio-palette: CLIO Pro Eye Palette Air (€21, was €26, -20%) — 10 walkable matte & satin eyeshadow shades.
- mediheal-vitc: MEDIHEAL Vitamin C Sheet Mask (€2, was €2.50, -20%) — brightening mask.
- mediheal-rose: MEDIHEAL Rose PDRN Sheet Mask (€2, was €2.50, -20%) — vegan PDRN glow sheet mask, First Buy #05.
- tamburins-chamo: TAMBURINS Chamo Perfume 50ml (€83.50, was €98, -15%) — chamomile, soft wood & musk, First Buy #06.
- lactofit: LACTO-FIT Probiotics Gold (€12, was €16, -25%) — daily Korean synbiotic sticks, biggest discount (-25%).
`;

interface ChatHistoryTurn {
  role: 'user' | 'model';
  text: string;
}

interface AgentRequestContext {
  activeTab?: string;
  quizProfile?: string | null;
  cyclePhase?: string | null;
  bagCount?: number;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '12mb' }));

  app.post('/api/agent/chat', async (req, res) => {
    try {
      const { message, history = [], context = {} } = req.body as {
        message?: string;
        history?: ChatHistoryTurn[];
        context?: AgentRequestContext;
      };

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.status(400).json({ error: 'Please provide a question or voice command.' });
        return;
      }

      const ai = getGeminiClient();

      const systemInstruction = `You are the official AI & Voice Concierge for K-Lounge Paris, a 2-week K-Beauty pop-up sanctuary in Le Marais (10 rue Pastourelle, 75003 Paris, March 23 – April 5, 2026).

${KLOUNGE_KNOWLEDGE}

Current visitor context:
- Active website tab: ${context.activeTab ?? 'popup'}
- Completed Skin Quiz archetype: ${context.quizProfile ?? 'not completed yet'}
- Current Cycle Phase (if tracked): ${context.cyclePhase ?? 'not synced'}
- Items in Visit Bag: ${context.bagCount ?? 0}

Rules:
1. Respond in the SAME language as the user's message (French, English, or Korean). Keep answers concise, warm, refined, and helpful (2–4 sentences max so they sound great read aloud via voice).
2. Always trigger the right UI action when the user asks to navigate, view products, add an item to their bag, open booking, open QR pass, start the skin quiz, open period/cycle skincare, or check visit details:
   - NAVIGATE_TAB: set tabId to one of 'popup' | 'products' | 'passport' | 'quiz' | 'app' | 'games' | 'visit' | 'faq' | 'agent'.
   - OPEN_CYCLE_TRACKER: navigates straight to the Period & Cycle Skincare Advisor inside the App & Cycle tab.
   - START_QUIZ: opens the Skin & Scalp Quiz tab.
   - OPEN_BOOKING: opens the Free Skin + Hair Diagnosis booking modal.
   - OPEN_APP_PASS: opens the K-Lounge App QR Pass modal.
   - OPEN_BAG: opens the Visit Bag drawer.
   - ADD_PRODUCT: puts an exact productId from the catalog into the visitor's bag (only use valid IDs from the list above).
   - OPEN_PRODUCT: opens the detail modal for an exact productId from the catalog.
   - NONE: for purely informational FAQ answers with no screen change requested.
3. Provide a short 3–6 word human-readable actionSummary whenever action != 'NONE' (e.g. "Opening Products (-25%)", "Added Torriden Serum to bag").`;

      const contents = [
        ...history.slice(-6).map((turn) => ({
          role: turn.role,
          parts: [{ text: turn.text }],
        })),
        { role: 'user' as const, parts: [{ text: message.trim() }] },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: 'Concise natural language answer in the same language as the user.',
              },
              action: {
                type: Type.STRING,
                description:
                  'One of: NONE, NAVIGATE_TAB, OPEN_CYCLE_TRACKER, START_QUIZ, OPEN_BOOKING, OPEN_APP_PASS, OPEN_BAG, ADD_PRODUCT, OPEN_PRODUCT.',
              },
              tabId: {
                type: Type.STRING,
                description:
                  'Target tab when action is NAVIGATE_TAB: popup, products, passport, quiz, app, games, visit, faq, or agent.',
              },
              productId: {
                type: Type.STRING,
                description:
                  'Exact product id from the K-Lounge catalog when action is ADD_PRODUCT or OPEN_PRODUCT.',
              },
              actionSummary: {
                type: Type.STRING,
                description: 'Short label summarizing the UI action performed, if any.',
              },
            },
            required: ['reply', 'action'],
          },
        },
      });

      const raw = (response.text ?? '{}').trim();
      const parsed = JSON.parse(raw) as {
        reply?: string;
        action?: string;
        tabId?: string;
        productId?: string;
        actionSummary?: string;
      };

      res.json({
        reply: parsed.reply ?? 'How can I help you explore K-Lounge Paris?',
        action: parsed.action ?? 'NONE',
        tabId: parsed.tabId,
        productId: parsed.productId,
        actionSummary: parsed.actionSummary,
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to process agent request.';
      console.error('[API /api/agent/chat error]', err);
      const status = errMsg.includes('API_KEY_INVALID') || errMsg.includes('GEMINI_API_KEY') ? 403 : 500;
      res.status(status).json({ error: errMsg });
    }
  });

  app.post('/api/agent/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType } = req.body as {
        audioBase64?: string;
        mimeType?: string;
      };

      if (!audioBase64 || typeof audioBase64 !== 'string') {
        res.status(400).json({ error: 'Missing audio data.' });
        return;
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'audio/webm',
                data: audioBase64,
              },
            },
            {
              text: 'Transcribe the spoken question or voice command accurately in the language spoken (English, French, or Korean). Output only the spoken transcript without timestamps or labels.',
            },
          ],
        },
      });

      const transcript = (response.text ?? '').trim();
      res.json({ transcript });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Audio transcription failed.';
      console.error('[API /api/agent/transcribe error]', err);
      res.status(500).json({ error: errMsg });
    }
  });

  app.post('/api/agent/speak', async (req, res) => {
    try {
      const { text } = req.body as { text?: string };
      if (!text || typeof text !== 'string' || !text.trim()) {
        res.status(400).json({ error: 'Missing text for speech synthesis.' });
        return;
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.trim().slice(0, 600),
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null;

      if (!base64Audio) {
        res.status(502).json({ error: 'No audio returned from speech synthesis.' });
        return;
      }

      res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Speech synthesis failed.';
      console.error('[API /api/agent/speak error]', err);
      res.status(500).json({ error: errMsg });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`K-Lounge Paris server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
