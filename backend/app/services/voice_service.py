def process_voice_query(query: str):
    q = query.lower().strip()

    if "cuddalore" in q and ("risk" in q or "rainfall" in q):
        return {
            "intent": "GET_DISTRICT_FORECAST",
            "answer": "Cuddalore has a development-mode heavy rainfall probability of 84 percent. The detected regime is Active Monsoon.",
            "district": "Cuddalore"
        }

    if "regime" in q:
        return {
            "intent": "GET_WEATHER_REGIME",
            "answer": "The current development dashboard regime is Active Monsoon."
        }

    if "high-risk" in q or "high risk" in q:
        return {
            "intent": "GET_HIGH_RISK_DISTRICTS",
            "answer": "Development-mode high-risk districts are Cuddalore, Nagapattinam and Nilgiris."
        }

    if "verification" in q:
        return {
            "intent": "GET_VERIFICATION",
            "answer": "Verification is unavailable until real observation data are connected."
        }

    return {
        "intent": "UNKNOWN",
        "answer": "I can provide district forecast, rainfall risk, weather regime, high-risk districts, or verification status."
    }
