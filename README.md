# SafeRoute – AI-Powered Delivery Safety Assistant

> 🚀 A production-quality prototype built for a Swiggy Growth internship assessment.
> Demonstrates a full-stack delivery partner safety platform with real weather data, interactive maps, hazard reporting and an AI safety assistant.

---

## ⚡ Quick Start (Windows)

### Option 1 – One-click start
```bat
start.bat
```

### Option 2 – Manual start

**Backend (Terminal 1)**
```powershell
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend (Terminal 2)**
```powershell
cd frontend
npm install
npm run dev
```

### URLs
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3737 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| Health Check | http://localhost:8000/health |

---

## 📁 Project Structure

```
safe-agent-prototype/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Environment config
│   ├── database.py          # SQLAlchemy + SQLite setup
│   ├── requirements.txt
│   ├── Procfile             # Render deployment
│   ├── models/
│   │   └── hazard.py        # Hazard ORM model
│   ├── schemas/
│   │   └── hazard.py        # Pydantic schemas
│   ├── routes/
│   │   ├── hazards.py       # CRUD hazard endpoints
│   │   ├── weather.py       # Open-Meteo proxy
│   │   └── assistant.py     # AI assistant (demo)
│   └── services/
│       └── seed.py          # Demo data seeder
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SafetyMap.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── HazardReport.jsx
│   │   │   ├── Emergency.jsx
│   │   │   └── Settings.jsx
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── WeatherWidget.jsx
│   │   │   └── HazardCard.jsx
│   │   ├── hooks/
│   │   │   ├── useWeather.js
│   │   │   └── useHazards.js
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   │       └── constants.js
│   ├── vercel.json
│   └── vite.config.js
├── .env.example
├── .gitignore
├── start.bat
└── README.md
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v3 |
| Map | Leaflet + React-Leaflet + OpenStreetMap |
| Icons | Lucide React |
| Backend | Python 3.12, FastAPI |
| Database | SQLite (SQLAlchemy ORM) |
| Weather | Open-Meteo (free, no key) |
| AI Chat | Demo mode (Gemini API ready) |
| HTTP Client | Axios (frontend), HTTPX (backend) |

---

## ✅ Implemented Features

| Feature | Status | Notes |
|---------|--------|-------|
| Dashboard with stats | ✅ Live | Real hazard counts, live weather |
| Interactive safety map | ✅ Live | OpenStreetMap + hazard markers |
| Hazard filtering on map | ✅ Live | By category and status |
| Hazard reporting form | ✅ Live | Saves to SQLite |
| Hazard listing | ✅ Live | From backend API |
| Live weather widget | ✅ Live | Open-Meteo API |
| Weather safety level | ✅ Live | Auto-calculated |
| AI Safety Assistant | ✅ Demo | Pre-programmed responses |
| Emergency contacts | ✅ Static | Real India emergency numbers |
| SOS demo | ✅ Demo | Clearly labelled |
| Settings page | ✅ Demo | UI only |
| Backend API + Swagger | ✅ Live | /docs |
| Mobile responsive | ✅ | Collapsible sidebar |
| Dark Swiggy theme | ✅ | Navy + orange palette |

---

## ⚠️ Demo Data

The following are clearly labelled as DEMO DATA:
- 6 pre-seeded hazard reports (Bengaluru area)
- AI assistant responses (pre-programmed, not live AI)
- SOS button (does NOT contact emergency services)
- User profile (Rahul Kumar, SW4821)
- Delivery stats and activity feed

---

## 🌐 Free Deployment

### Frontend → Vercel
1. Push to GitHub
2. Connect repo to [vercel.com](https://vercel.com)
3. Set Root Directory: `frontend`
4. Set env var: `VITE_API_BASE_URL=https://your-backend.onrender.com`

### Backend → Render
1. Push to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Set Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Set env var: `CORS_ORIGINS=https://your-frontend.vercel.app`

> **⚠️ SQLite on Render Free Tier:** Render's free tier uses ephemeral storage – your SQLite database resets on every deploy/restart. For production persistence, consider:
> - **Render PostgreSQL** (free tier available, 90-day trial)
> - **Supabase** (free tier PostgreSQL)
> - **TiDB Serverless** (free MySQL-compatible)
> SQLAlchemy's connection string just needs to be updated in the env var – no code changes.

---

## 🔑 Enabling Gemini AI

1. Get a free API key from [aistudio.google.com](https://aistudio.google.com)
2. Add to `backend/.env`: `GEMINI_API_KEY=your_key_here`
3. Update `backend/routes/assistant.py` to use `google-generativeai` package
4. The chat endpoint's interface stays the same – just swap the response logic

---

## 📋 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /hazards/ | List hazards (paginated, filterable) |
| POST | /hazards/ | Create hazard report |
| GET | /hazards/{id} | Get single hazard |
| PATCH | /hazards/{id} | Update hazard status |
| DELETE | /hazards/{id} | Delete hazard |
| GET | /weather/current | Current weather (Open-Meteo) |
| POST | /assistant/chat | AI safety assistant |

Full interactive docs: http://localhost:8000/docs

---

## ⚖️ Disclaimer

SafeRoute is a demonstration prototype for educational and assessment purposes.
- Not affiliated with Swiggy Ltd.
- Does not represent real road conditions.
- SOS button does NOT contact emergency services.
- In a real emergency, call **112**.

