<div align="center">

# FIN-X

### India's AI-Powered NSE Market Intelligence Platform

*Real-time institutional signals · AI analysis · Live chat · ET Hackathon — AI Fintech Track*

<br/>

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Auth](https://img.shields.io/badge/Auth-JWT_+_Google_OAuth-F7DF1E?style=flat-square&logo=jsonwebtokens&logoColor=black)](https://jwt.io)
[![Tests](https://img.shields.io/badge/Tests-22_passing-22c55e?style=flat-square&logo=pytest&logoColor=white)](#testing)
[![License](https://img.shields.io/badge/License-MIT-8b5cf6?style=flat-square)](LICENSE)

</div>

---

## What is FIN-X?

FIN-X tracks **NSE bulk and block deals** in real time, runs them through a **3-tier AI stack** (Gemini 2.5 Flash → GPT-4o → rule fallback), and surfaces institutional smart money movements before the broader market reacts.

Built for the **Economic Times AI Fintech Hackathon**.

> ⚠️ Educational use only. Not SEBI-registered investment advice.

---

## Features

### 🔭 Opportunity Radar
Real-time NSE bulk and block deal scanner. Detects institutional accumulation and distribution patterns with AI-generated signal explanations, risk levels, and confidence scores.

### 📊 AI Signal Cards
Per-stock deep analysis on demand: live price + technicals (EMA, RSI, MACD, Bollinger Bands), AI sentiment score, news impact rating, pattern success rate, institutional cluster detection, and management tone shift analysis.

### 💬 Live Market Chat
Ask anything about the market. Every answer is grounded in live NSE prices, Nifty 50 snapshot, active radar signals, and latest news sentiment — not hallucinated.

### 📰 Inshorts Intelligence
Finance news with AI-augmented context: sentiment classification, keyword extraction, and direct symbol mapping to affected NSE stocks.

### 🔐 Production Auth System
Email + password with Brevo verification emails, Google OAuth 2.0, JWT access + refresh tokens with silent rotation, bcrypt hashing, rate limiting, and security headers.

---

## Architecture

```
+----------------------------------------------------------+
|                        FIN-X                             |
|                                                          |
|   React 18 + Tailwind CSS + Vite                         |
|   +----------+  +-----------+  +-------+  +----------+  |
|   |  Radar   |  |  Signal   |  | Chat  |  | Inshorts |  |
|   |  Page    |  |  Cards    |  | Page  |  |  Page    |  |
|   +----+-----+  +-----+-----+  +---+---+  +----+-----+  |
|        +--------------+-----------+-----------+          |
|                       | Axios + JWT Bearer               |
+---------------------------------------------------+------+
|                   FastAPI Backend                 |      |
|                                                   |      |
|   /api/v2/auth/*   JWT + Google OAuth             |      |
|   /api/signals     NSE Radar engine               |      |
|   /api/card/*      AI Signal Card generator       |      |
|   /api/chat        Grounded market chat           |      |
|   /api/market/*    Live prices + WebSocket        |      |
|   /api/inshorts    News intelligence              |      |
|                                                   |      |
|   AI Layer: Gemini 2.5 Flash > GPT-4o > Fallback  |      |
|   SQLite(dev) / PostgreSQL(prod) + APScheduler    |      |
+---------------------------------------------------+------+
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Tailwind CSS, Vite, Recharts, Lucide Icons |
| **Backend** | FastAPI, Uvicorn, APScheduler, WebSockets |
| **Database** | SQLite (dev) → PostgreSQL (prod) via SQLAlchemy |
| **AI** | Gemini 2.5 Flash Lite, GPT-4o fallback, custom prompt chains |
| **Auth** | JWT (python-jose), bcrypt, Google OAuth 2.0 (Authlib) |
| **Email** | Brevo SMTP (transactional) |
| **Market Data** | NSE India, yfinance, custom scrapers |
| **Testing** | pytest, FastAPI TestClient, SQLAlchemy StaticPool |
| **Deploy** | Render (backend), Vercel / Netlify (frontend) |

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Clone

```bash
git clone https://github.com/eshaansingla/Fin-X.git
cd Fin-X
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # macOS / Linux
pip install -r requirements.txt
cp .env.example .env        # then fill in your keys
```

Key `.env` values:

```env
GEMINI_API_KEY=...
OPENAI_API_KEY=...
NEWS_API_KEY=...

# Generate: python -c "import secrets; print(secrets.token_hex(32))"
JWT_SECRET_KEY=...

# Brevo SMTP
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-login
SMTP_PASS=your-brevo-key
SMTP_FROM=verified@yourdomain.com

# Google OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

APP_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
CORS_ORIGINS=http://localhost:5173
```

```bash
uvicorn main:app --reload
# API  -> http://localhost:8000
# Docs -> http://localhost:8000/docs
```

### 3. Frontend

```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000/api" > .env.local
npm run dev
# App -> http://localhost:5173
```

---

## Auth Flow

```
Email Signup                    Google OAuth
------------                    ------------
POST /api/v2/auth/signup        GET /api/v2/auth/google/login
  bcrypt hash password            redirect to Google consent
  send verification email
                                GET /api/v2/auth/google/callback
GET /api/v2/auth/verify-email     fetch email + name
  mark is_verified = true         create or find user
  redirect to frontend            issue JWT tokens
                                  redirect to frontend
POST /api/v2/auth/login              with tokens in URL
  validate credentials
  check is_verified

         { access_token, refresh_token }
                  |
          stored in localStorage
          Bearer header on every request
                  |
          silent refresh on 401
          session restore on page load
```

---

## API Reference

### Auth  `/api/v2/auth`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/signup` | Register — bcrypt hash + verification email |
| `GET` | `/verify-email?token=` | Activate account via link |
| `POST` | `/login` | Credentials → access + refresh tokens |
| `POST` | `/refresh` | Rotate tokens (old instantly invalidated) |
| `GET` | `/me` | Current authenticated user |
| `GET` | `/google/login` | Start Google OAuth flow |
| `GET` | `/google/callback` | OAuth callback — issues tokens |

### Market  `/api`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/signals` | All active radar signals |
| `POST` | `/signals/refresh` | Force radar refresh |
| `GET` | `/card/{symbol}` | Full AI signal card |
| `GET` | `/market/live/{symbol}` | Live quote |
| `GET` | `/market/chart/{symbol}` | OHLCV chart data |
| `WS` | `/market/ws/{symbol}` | Real-time WebSocket feed |
| `GET` | `/market/movers` | Top gainers + losers |
| `GET` | `/market/status` | Market open / closed |
| `POST` | `/chat` | Grounded market chat |
| `GET` | `/inshorts` | AI-augmented finance news |
| `GET` | `/search?q=` | Symbol search |
| `GET` | `/analytics/success-rate/{symbol}` | Pattern stats |
| `GET` | `/analytics/clusters` | Institutional cluster map |

Full interactive docs at `/docs` (Swagger UI) and `/redoc`.

---

## Testing

```bash
cd backend
pytest tests/test_auth.py -v
# 22 passed in 6.97s
```

| Suite | Tests |
|---|---|
| **Signup** | Valid signup, duplicate email, 4 weak password variants |
| **Login** | Unverified block, success, wrong password, unknown email, JWT format |
| **`/me`** | Authenticated, no token, invalid token |
| **Token Refresh** | Success, old token rejected, invalid |
| **Email Verification** | Invalid redirect, valid token activation |
| **Rate Limiting** | 429 after 10 failed attempts |
| **Security Headers** | All 5 headers present on every response |

---

## Security

| Feature | Implementation |
|---|---|
| Password hashing | bcrypt, 12 rounds |
| Token signing | HS256 JWT |
| Refresh rotation | Version-locked — old tokens instantly invalidated |
| Rate limiting | Per-IP, 10 attempts / 60 seconds |
| Security headers | X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy |
| CORS | Explicit origin whitelist via `CORS_ORIGINS` env var |
| Secrets | `.env` only — nothing hardcoded |

---

## Deployment

### Backend on Render

`render.yaml` is included at `backend/render.yaml`. Connect the repo on Render and set all env vars in the dashboard. For production PostgreSQL: set `DATABASE_URL=postgresql+psycopg2://user:pass@host/db` — the app switches automatically.

### Frontend on Vercel / Netlify

```bash
cd frontend && npm run build
# Set env var: VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Project Structure

```
FIN_X/
├── backend/
│   ├── main.py                app factory, middleware, router registration
│   ├── database.py            raw SQLite layer (v1 routes)
│   ├── scheduler.py           APScheduler — hourly radar refresh
│   ├── core/
│   │   ├── config.py          Pydantic settings (reads .env)
│   │   ├── db.py              SQLAlchemy engine + session
│   │   └── security.py        bcrypt + JWT create/decode
│   ├── models/user.py         auth_users SQLAlchemy model
│   ├── schemas/auth.py        Pydantic request/response schemas
│   ├── routes/auth.py         all /api/v2/auth/* endpoints
│   ├── routers/               signals, cards, chat, market, inshorts...
│   ├── services/              15+ modules: NSE, AI, email, OAuth...
│   ├── tests/test_auth.py     22 pytest tests
│   ├── prompts/               AI prompt templates
│   ├── .env.example
│   ├── render.yaml
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx            loading guard + route switch
    │   ├── api/index.js       Axios client + silent token refresh
    │   ├── context/
    │   │   ├── AuthContext.jsx    tokens, session restore, Google callback
    │   │   └── ThemeContext.jsx   dark/light mode
    │   ├── components/        Navbar, SignalCard, ChatInterface...
    │   └── pages/             Landing, Radar, Card, Chat, Inshorts
    ├── vite.config.js         code-split: react/chart/http vendors
    └── package.json
```

---

## License

MIT 2025 FIN-X

---

<div align="center">

**Built for the ET AI Fintech Hackathon**

*For educational purposes only · Not SEBI-registered investment advice · Data: NSE India*

</div>
