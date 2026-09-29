# AI Rainfall Post-Processing System

A production-style starter for the SIH 2026 rainfall NWP post-processing solution.

## Pipeline
NWP Data -> Weather Regime Classification -> Regime-Based Bias Correction ->
Heavy Rainfall Probability -> District Forecast -> Verification -> SHAP ->
Offline ONNX Alert -> Voice Assistant

## Important
This starter uses clearly labelled DEVELOPMENT/SYNTHETIC data. It does not claim live NWP,
real observations, or real verification metrics until those data sources/models are connected.

## Run backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend: http://127.0.0.1:8000
Health: http://127.0.0.1:8000/api/health
Docs: http://127.0.0.1:8000/docs

## Run frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

## Data status
The dashboard deliberately displays DEVELOPMENT MODE / SYNTHETIC DATA until real
NOAA GFS, IMD and/or NASA GPM data ingestion is implemented.
