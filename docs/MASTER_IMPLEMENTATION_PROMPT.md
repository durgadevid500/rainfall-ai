# Master implementation prompt

Build a production-style AI Rainfall Post-Processing System for SIH 2026.

Core pipeline:
Real NWP Data
→ Weather Regime Classification
→ Regime-Based Bias Correction
→ Heavy Rainfall Probability
→ District-Level Forecast
→ Verification
→ Explainable AI (SHAP)
→ Offline ONNX Alert
→ Voice Assistant

Required stack:
Frontend: React + Vite + TypeScript/JS, Tailwind or clean CSS, Recharts, Leaflet
Backend: Python FastAPI + Pydantic
ML: scikit-learn, XGBoost, SHAP, ONNX Runtime
Data: NOAA GFS/NOMADS, IMD observations, NASA GPM IMERG where appropriate
Database: PostgreSQL/PostGIS for production; SQLite acceptable for development
Deployment: Docker
Voice: browser Web Speech API initially; API-connected intent handling

Required API endpoints:
GET /api/health
GET /api/data-status
GET /api/districts
GET /api/forecast
GET /api/forecast/{district}
POST /api/predict/regime
POST /api/predict/correction
POST /api/predict/risk
GET /api/verification
GET /api/explain/{district}
POST /api/offline-alert
POST /api/voice/query

Voice intents:
GET_DISTRICT_FORECAST
GET_RAINFALL_PROBABILITY
GET_WEATHER_REGIME
GET_HIGH_RISK_DISTRICTS
GET_SHAP_EXPLANATION
COMPARE_RAW_AND_CORRECTED
GET_VERIFICATION
GET_ALERT_STATUS
READ_FORECAST
ENABLE_OFFLINE_MODE

Scientific integrity:
- Never fabricate accuracy or verification metrics.
- Never present synthetic data as real.
- Clearly label DEVELOPMENT/SYNTHETIC/CACHED/LIVE states.
- SHAP is model attribution, not causal proof.
- Offline local inference does not mean SMS works without cellular connectivity.
- Do not claim world-first.
- Verification must remain unavailable until real observations are available.

Start with the existing Phase 1 scaffold. Add real data ingestion and trained ML models only after the basic app is verified.
