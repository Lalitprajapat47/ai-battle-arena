# Miracle - AI Battle Arena

**Autonomous dual-LLM code benchmark powered by a LangGraph parallel engine.**

Give it a prompt, and it runs two language models side-by-side on the same problem, then has a third model act as an impartial judge — scoring each solution out of 10 with detailed reasoning.

🔗 **Live demo:** [ai-battle-arena-mr7l.vercel.app](https://ai-battle-arena-mr7l.vercel.app)

---

## How it works

1. **Parallel generation** — Your prompt is sent simultaneously to **Mistral** and **Cohere**, each producing an independent solution.
2. **Autonomous judging** — **NVIDIA Nemotron 3 Ultra** reviews both solutions and scores them on correctness, clarity, and completeness. If Nemotron is unavailable, the system automatically falls back to **Google Gemini** as judge.
3. **Verdict** — Scores, reasoning, and a clear winner are displayed side-by-side in a clean, syntax-highlighted UI.

The orchestration is built with **LangGraph**, which manages the parallel generation step and the sequential judging step as a small state graph.

---

## Tech stack

**Backend**
- Node.js + Express
- LangChain / LangGraph for AI orchestration
- Model providers: Mistral AI, Cohere, Google Gemini, NVIDIA NIM (Nemotron)
- TypeScript, compiled to plain JS for production

**Frontend**
- React + Vite
- Tailwind-style utility CSS
- Canvas-based animated background
- Syntax-highlighted code blocks (highlight.js)

---

## Project structure

```
ai-battle-arena/
├── Backend/
│   ├── server.ts                 # Entry point
│   ├── src/
│   │   ├── app.ts                # Express app, routes, CORS
│   │   ├── config/config.ts      # Env var loading
│   │   └── ai/
│   │       ├── model.ai.ts       # Model client definitions
│   │       └── graph.ai.ts       # LangGraph orchestration
│   └── package.json
└── Frontend/
    ├── src/
    │   ├── main.jsx
    │   └── app/
    │       ├── App.jsx
    │       └── components/
    │           ├── ChatInterface.jsx
    │           ├── ArenaResponse.jsx
    │           └── UserMessage.jsx
    └── package.json
```

---

## Running locally

### Backend

```bash
cd Backend
npm install
cp .env.example .env   # fill in your API keys
npm run dev
```

Runs on `http://localhost:3000` by default.

### Frontend

```bash
cd Frontend
npm install
cp .env.example .env   # set VITE_API_URL if backend isn't on localhost:3000
npm run dev
```

Runs on `http://localhost:5173` by default.

---

## Environment variables

**Backend (`Backend/.env`)**

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio API key |
| `MISTRAL_API_KEY` | Mistral AI API key |
| `COHERE_API_KEY` | Cohere API key |
| `NVIDIA_API_KEY` | NVIDIA NIM API key (for Nemotron) |
| `CLIENT_ORIGIN` | Deployed frontend URL (for CORS in production) |
| `PORT` | Server port (defaults to 3000; set automatically by most hosts) |

**Frontend (`Frontend/.env`)**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Deployed backend URL |

---

## Deployment

- **Backend** is deployed on [Render](https://render.com) as a standard Node web service:
  - Build command: `npm install && npm run build`
  - Start command: `npm run start`
- **Frontend** is deployed on [Vercel](https://vercel.com) as a static Vite build.

---

## License

ISC
