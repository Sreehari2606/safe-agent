import httpx
from fastapi import APIRouter, Query, HTTPException

router = APIRouter(prefix="/weather", tags=["Weather"])

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

WMO_CODES = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 53: "Moderate drizzle",
    55: "Dense drizzle", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow", 77: "Snow grains",
    80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
    85: "Slight snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm w/ hail", 99: "Thunderstorm w/ heavy hail",
}


def _safety_level(code: int, wind: float, precip: float) -> str:
    if code in (95, 96, 99) or wind > 60 or precip > 10:
        return "dangerous"
    if code in (61, 63, 65, 80, 81, 82) or wind > 35 or precip > 3:
        return "caution"
    return "safe"


@router.get("/current")
async def current_weather(
    lat: float = Query(12.9716, ge=-90, le=90, description="Latitude"),
    lon: float = Query(77.5946, ge=-180, le=180, description="Longitude"),
):
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,apparent_temperature",
        "hourly": "precipitation_probability",
        "forecast_days": 1,
        "timezone": "auto",
    }
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(OPEN_METEO_URL, params=params)
            resp.raise_for_status()
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=502, detail=f"Weather API error: {exc}")

    data = resp.json()
    cur = data.get("current", {})
    code = cur.get("weather_code", 0)
    wind = cur.get("wind_speed_10m", 0)
    precip = cur.get("precipitation", 0)
    hourly_precip_prob = data.get("hourly", {}).get("precipitation_probability", [0])
    max_precip_prob = max(hourly_precip_prob[:6]) if hourly_precip_prob else 0

    return {
        "latitude": lat,
        "longitude": lon,
        "temperature": cur.get("temperature_2m"),
        "apparent_temperature": cur.get("apparent_temperature"),
        "humidity": cur.get("relative_humidity_2m"),
        "wind_speed": wind,
        "precipitation": precip,
        "weather_code": code,
        "condition": WMO_CODES.get(code, "Unknown"),
        "precipitation_probability": max_precip_prob,
        "safety_level": _safety_level(code, wind, precip),
        "timezone": data.get("timezone"),
        "source": "Open-Meteo (live)",
    }

