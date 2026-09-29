def correct_rainfall(payload: dict):
    raw = float(payload.get("raw_nwp_mm", 0))
    regime = payload.get("regime", "Active Monsoon")
    factors = {
        "Active Monsoon": 1.20,
        "Break Monsoon": 0.85,
        "Depression": 1.35,
        "Coastal": 1.15,
        "Orographic": 1.25,
    }
    corrected = raw * factors.get(regime, 1.0)
    return {
        "raw_nwp_mm": raw,
        "corrected_mm": round(corrected, 2),
        "regime": regime,
        "status": "DEVELOPMENT MODEL"
    }
