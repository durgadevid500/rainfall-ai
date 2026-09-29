def classify_regime(payload: dict):
    # Placeholder rule-based development classifier.
    # Replace with a trained regime model using NWP/weather-regime features.
    rainfall = float(payload.get("rainfall_mm", 0))
    if rainfall >= 50:
        regime = "Depression"
    elif rainfall >= 20:
        regime = "Active Monsoon"
    else:
        regime = "Break Monsoon"
    return {
        "regime": regime,
        "confidence": 0.70,
        "status": "DEVELOPMENT MODEL"
    }
