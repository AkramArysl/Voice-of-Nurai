# Voice of Nurai — Safety Platform

> A women's safety platform that enables instant SOS alerts, real-time location sharing with trusted contacts, incident reporting, and an AI-powered safety assistant — built for Kyrgyzstan.

---

## What it does

- **SOS button** — one tap sends an emergency alert with a live location tracking link to all trusted contacts via email and Telegram
- **Live tracking** — trusted contacts open the link and watch the user's location update in real time on a map
- **Trusted contacts** — users add people who receive SOS notifications; contacts connect via Telegram bot to get instant messages
- **Incident reports** — users anonymously report dangerous areas, harassment, or suspicious activity with photos and location
- **Safety map** — shows nearby hospitals and police stations around the user's location
- **AI assistant** — Telegram bot that gives step-by-step safety advice based on a verified knowledge base

---

## Repository structure

```
voice-of-nurai/
├── backend/      — Node.js Express REST API + WebSocket
├── frontend/     — React Vite SPA
└── ai/           — Python Telegram AI bot (separate service)
└── project/      - All the information by our Project Manager
└── .gitignore

```

---

## Technology stack

| Part | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express.js, MySQL, WebSocket (ws) |
| Maps | 2GIS MapGL JS + 2GIS Places API |
| Auth | Session tokens (nanoid) in httpOnly cookies |
| Email | Gmail API via OAuth2 |
| Telegram | Telegram Bot API (polling) |
| Photo storage | Cloudinary |
| AI bot | Python, python-telegram-bot, ChromaDB, sentence-transformers, OpenRouter, Gemini 2.0 Flash |
| Deployment | Railway (backend + AI), Vercel (frontend), Docker |
| Database | MySQL (Railway plugin) |

---

## Backend

### Architecture

MVC pattern — controllers call services, services call models, all SQL lives in models only.

```
src/
├── app.js              — entry point, Express + WebSocket setup
├── config/
│   ├── db.js           — MySQL connection pool
│   ├── migrate.js      — creates all tables
│   └── cloudinary.js   — Cloudinary SDK config
├── controllers/        — receive requests, send responses
├── middlewares/
│   ├── checkAuth.js    — reads cookie, validates session token
│   ├── validate.js     — Joi schema validation
│   ├── upload.js       — multer memory storage for photos
│   └── errorHandler.js — global error handler
├── models/             — all SQL queries
├── routes/             — URL definitions
├── services/           — business logic, notifications
├── telegram/
│   └── botHandler.js   — SOS Telegram bot (invite token linking)
├── validators/         — Joi schemas with Russian error messages
└── websocket/
    └── locationWs.js   — real-time location sessions
```

### API endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Login, sets cookie |
| POST | /api/auth/logout | Required | Logout |
| GET | /api/auth/me | Required | Current user |
| GET | /api/users/profile | Required | Get profile |
| DELETE | /api/users/account | Required | Delete account |
| GET | /api/contacts | Required | List contacts |
| POST | /api/contacts | Required | Add contact + send invite email |
| DELETE | /api/contacts/:id | Required | Remove contact |
| GET | /api/contacts/invite/:token | Public | Invite info |
| POST | /api/contacts/telegram | Public | Called by SOS bot to link Telegram |
| POST | /api/sos/trigger | Required | Trigger SOS, notify contacts |
| POST | /api/sos/resolve | Required | Resolve SOS, notify contacts |
| GET | /api/sos/track/:sessionId | Public | Tracking page data |
| GET | /api/reports | Public | All reports (anonymous) |
| GET | /api/reports/my | Required | Current user's reports |
| POST | /api/reports | Required | Create report with optional photo |
| DELETE | /api/reports/:id | Required | Delete own report |

### WebSocket

**Client → Server:**
```json
{ "type": "join", "role": "sender", "sessionId": "abc123" }
{ "type": "join", "role": "watcher", "sessionId": "abc123" }
{ "type": "location", "lat": 42.87, "lng": 74.56 }
{ "type": "resolved", "sessionId": "abc123" }
```

**Server → Watchers:**
```json
{ "type": "location", "lat": 42.87, "lng": 74.56, "timestamp": 1234567890 }
{ "type": "resolved" }
{ "type": "sender_disconnected" }
```

### Database tables

- `users` — id, username, email, password (bcrypt)
- `refresh_tokens` — session tokens with expiry (30 days)
- `contacts` — trusted contacts with invite token and Telegram chat ID
- `reports` — incident reports with category, location, optional photo URL
- `sos_events` — SOS sessions with coordinates and status

### Environment variables (backend)

```
PORT=3001
NODE_ENV=production
CLIENT_URL=https://voice-of-nurai-blhi.vercel.app

DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=

COOKIE_SECRET=

GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=

TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Frontend

### Pages

| Path | Access | Description |
|---|---|---|
| / | All | Home, reports list, safety map |
| /login | Public | Login |
| /register | Public | Register |
| /sos | Auth | SOS countdown page |
| /sos/active | Auth | Active SOS with live map |
| /track/:sessionId | Public | Live tracking for trusted contacts |
| /contacts | Auth | Manage trusted contacts |
| /report/new | Auth | Create incident report |
| /ai | All | AI assistant info + Telegram link |

### Environment variables (frontend)

```
VITE_WS_URL=https:
VITE_TELEGRAM_BOT_USERNAME=
VITE_2GIS_MAPGL_KEY=
VITE_2GIS_PLACES_KEY=
```

### vercel.json (API proxy — required for cookie auth)

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": ""
    },
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

---

## AI Feature: Intelligent Safety Assistant

### What it does

The core of our AI feature is a Telegram bot that acts as a smart safety companion for girls in dangerous situations. It provides instant, step-by-step advice based on verified knowledge, not generic AI guesses.

Capabilities:
- Answers safety questions (e.g., "Someone is following me", "Suspicious taxi")
- Recognises emergency scenarios via quick-reply buttons (SOS, stalking, attack, etc.)
- Refuses off-topic questions (weather, jokes, recipes)
- Adapts all advice to Kyrgyzstan / CIS — emergency numbers 112, police 102, local places

### How it works

1. **User input** — user writes a message or presses an emergency button in Telegram
2. **Message handling** — python-telegram-bot receives the message; button presses trigger predefined instant answers, text questions go to the AI module
3. **RAG (Retrieval-Augmented Generation)** — the bot searches a knowledge base of pre-approved safety articles:
   - Converts the question into a vector using sentence-transformers (`paraphrase-multilingual-MiniLM-L12-v2`)
   - Queries ChromaDB to find the 3 most similar text chunks from 5 safety articles
4. **Prompt construction** — combines a strict system prompt with retrieved chunks, sends to OpenRouter API
5. **LLM call** — OpenRouter calls Gemini 2.0 Flash (fast, excellent Russian understanding)
6. **Response** — Gemini returns fact-based, bullet-point safety instructions
7. **Reply** — bot sends the answer back via Telegram, keeping the emergency keyboard visible

### Why it matters

| Problem | Solution |
|---|---|
| In a crisis, users have no time to search the internet | Bot gives a ready-to-use action plan in 1–2 seconds |
| Generic AI may hallucinate dangerous advice | RAG grounds answers in approved articles |
| Stress makes typing hard | Emergency buttons provide one-tap help |
| Foreign advice often irrelevant | Localised numbers and locations for Kyrgyzstan |
| Extra apps are a barrier | Telegram works everywhere, no installation needed |

### AI technology stack

| Component | Role |
|---|---|
| python-telegram-bot | Telegram integration, buttons, message routing |
| ChromaDB | Vector database for article chunks |
| sentence-transformers | Converts text to embeddings (multilingual) |
| OpenRouter | Proxy API to access Gemini without Google billing |
| Gemini 2.0 Flash | Fast, Russian-friendly LLM |
| Railway + Docker | 24/7 deployment and hosting |

> The RAG pipeline is custom-built — only `langchain-text-splitters` for chunking and `langchain_community.vectorstores` as a thin wrapper around ChromaDB. No heavy LangChain chains or agents, keeping the bot simple and debuggable.


## Deployment

### Infrastructure

| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Root directory: `/frontend` |
| Backend | Railway | Root directory: `/backend`, Docker |
| AI bot | Railway (separate project) | Root directory: `/ai`, Docker |
| MySQL | Railway plugin | Same project as backend |
| Photos | Cloudinary | Free tier, 25GB |

### Deploy backend (Railway)

1. Create Railway project → add MySQL plugin → copy DB variables to backend service
2. Add all environment variables listed above
3. Connect GitHub repo, set Root Directory to `backend`
4. After first deploy, run migration in Railway shell:
```bash
node src/config/migrate.js
```

### Deploy frontend (Vercel)

1. Connect GitHub repo, set Root Directory to `frontend`
2. Add environment variables listed above
3. Make sure `vercel.json` is committed in the `frontend` folder
4. After deploy, copy Vercel URL → update `CLIENT_URL` on Railway → Railway auto-redeploys

### Deploy AI bot (Railway)

1. Create a separate Railway project
2. Connect same GitHub repo, set Root Directory to `ai`
3. Add AI-specific environment variables
4. Railway detects Dockerfile automatically

---

## Adding to phone home screen

**iPhone:**
1. Open the site in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

**Android (Redmi/MIUI):**
1. Open the site in Chrome
2. Tap three dots → "Add to Home Screen"

**Quick SOS shortcut:**
- iPhone: Settings → Accessibility → Touch → Back Tap → assign to open the app
- Android Redmi: Settings → Always-on display & Lock screen → Double press power button → change to open the app

---

## Emergency numbers (Kyrgyzstan)

- **112** — unified emergency number
- **102** — police
- **103** — ambulance
