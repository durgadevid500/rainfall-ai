DISTRICTS = [
    ("Cuddalore", 18.2, "HIGH"),
    ("Chennai", 9.8, "MEDIUM"),
    ("Nagapattinam", 22.5, "HIGH"),
    ("Coimbatore", 5.2, "LOW"),
    ("Madurai", 3.8, "LOW"),
    ("Nilgiris", 28.1, "HIGH"),
]


def _forecast(name, raw, corrected, risk):
    return {
        "district": name,
        "raw_nwp_mm": raw,
        "corrected_mm": corrected,
        "heavy_rain_probability": risk,
        "regime": "Active Monsoon",
        "data_status": "SYNTHETIC / DEVELOPMENT"
    }


def get_districts():
    return [{"name": d[0], "risk": d[3]} for d in DISTRICTS]


def get_forecast(district=None):
    rows = [
        _forecast("Cuddalore", 18.2, 25.7, 84),
        _forecast("Chennai", 9.8, 13.1, 42),
        _forecast("Nagapattinam", 22.5, 31.4, 88),
        _forecast("Coimbatore", 5.2, 4.9, 18),
        _forecast("Madurai", 3.8, 4.1, 12),
        _forecast("Nilgiris", 28.1, 34.2, 91),
    ]
    if district:
        return next((x for x in rows if x["district"].lower() == district.lower()), None)
    return rows
