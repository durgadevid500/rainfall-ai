def explain_forecast(district: str):
    return {
        "district": district,
        "method": "SHAP-compatible explanation endpoint",
        "status": "DEVELOPMENT PLACEHOLDER",
        "features": [
            {"feature": "NWP rainfall", "contribution": 0.42},
            {"feature": "Humidity", "contribution": 0.24},
            {"feature": "Vertical motion", "contribution": 0.18},
            {"feature": "Wind convergence", "contribution": 0.10},
            {"feature": "Topography", "contribution": 0.06},
        ],
        "note": "These are development placeholders, not real SHAP values."
    }
