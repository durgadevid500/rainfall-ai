from fastapi import APIRouter
from app.services.forecast_service import get_forecast, get_districts
from app.services.regime_service import classify_regime
from app.services.correction_service import correct_rainfall
from app.services.risk_service import heavy_rain_probability
from app.services.explain_service import explain_forecast
from app.services.verification_service import verification_status
from app.services.alert_service import offline_alert
from app.services.voice_service import process_voice_query

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "healthy", "service": "rainfall-ai-backend"}


@router.get("/data-status")
def data_status():
    return {
        "mode": "DEVELOPMENT",
        "source": "SYNTHETIC",
        "live_nwp_connected": False,
        "observations_connected": False,
        "message": "Connect NOAA GFS / IMD / GPM before presenting as live."
    }


@router.get("/districts")
def districts():
    return get_districts()


@router.get("/forecast")
def forecast():
    return get_forecast()


@router.get("/forecast/{district}")
def district_forecast(district: str):
    return get_forecast(district)


@router.post("/predict/regime")
def predict_regime(payload: dict):
    return classify_regime(payload)


@router.post("/predict/correction")
def predict_correction(payload: dict):
    return correct_rainfall(payload)


@router.post("/predict/risk")
def predict_risk(payload: dict):
    return heavy_rain_probability(payload)


@router.get("/verification")
def verification():
    return verification_status()


@router.get("/explain/{district}")
def explain(district: str):
    return explain_forecast(district)


@router.post("/offline-alert")
def alert(payload: dict):
    return offline_alert(payload)


@router.post("/voice/query")
def voice_query(payload: dict):
    return process_voice_query(payload.get("query", ""))
