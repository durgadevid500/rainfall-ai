def heavy_rain_probability(payload: dict):
    corrected = float(payload.get("corrected_mm", payload.get("rainfall_mm", 0)))
    probability = min(99, max(1, corrected * 2.8))
    return {
        "heavy_rain_probability": round(probability, 1),
        "threshold_mm": 64.5,
        "status": "DEVELOPMENT MODEL"
    }
