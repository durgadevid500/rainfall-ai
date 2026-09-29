def offline_alert(payload: dict):
    probability = float(payload.get("heavy_rain_probability", 0))
    triggered = probability >= 70
    return {
        "triggered": triggered,
        "mode": "LOCAL / DEVELOPMENT",
        "internet_required": False,
        "cellular_sms_note": "SMS requires cellular connectivity.",
        "message": "Local heavy-rain alert triggered." if triggered else "No local alert."
    }
