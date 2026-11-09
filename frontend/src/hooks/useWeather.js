import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { weatherApi } from '../services/api';
import { DEFAULT_LOCATION } from '../utils/constants';

const WMO_CODES = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 53: "Moderate drizzle",
  55: "Dense drizzle", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
  71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow", 77: "Snow grains",
  80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
  85: "Slight snow showers", 86: "Heavy snow showers",
  95: "Thunderstorm", 96: "Thunderstorm w/ hail", 99: "Thunderstorm w/ heavy hail",
};

function getSafetyLevel(code, wind, precip) {
  if ([95, 96, 99].includes(code) || wind > 60 || precip > 10) return "dangerous";
  if ([61, 63, 65, 80, 81, 82].includes(code) || wind > 35 || precip > 3) return "caution";
  return "safe";
}

export function useWeather(lat = DEFAULT_LOCATION.lat, lon = DEFAULT_LOCATION.lon) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Try backend proxy first
      const { data } = await weatherApi.current(lat, lon);
      setWeather(data);
    } catch {
      // 2. Direct browser fallback to Open-Meteo API (works 100% on Vercel even if backend is offline)
      try {
        const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,apparent_temperature',
            hourly: 'precipitation_probability',
            forecast_days: 1,
            timezone: 'auto',
          },
          timeout: 8000,
        });
        const cur = res.data.current || {};
        const code = cur.weather_code || 0;
        const wind = cur.wind_speed_10m || 0;
        const precip = cur.precipitation || 0;
        const hourlyProb = res.data.hourly?.precipitation_probability || [0];
        const maxProb = Math.max(...hourlyProb.slice(0, 6));

        setWeather({
          latitude: lat,
          longitude: lon,
          temperature: cur.temperature_2m,
          apparent_temperature: cur.apparent_temperature,
          humidity: cur.relative_humidity_2m,
          wind_speed: wind,
          precipitation: precip,
          weather_code: code,
          condition: WMO_CODES[code] || "Clear",
          precipitation_probability: maxProb || 0,
          safety_level: getSafetyLevel(code, wind, precip),
          timezone: res.data.timezone,
          source: "Open-Meteo (Live Direct)",
        });
      } catch (err2) {
        setError(err2.message || 'Failed to load weather');
      }
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => { fetch(); }, [fetch]);

  return { weather, loading, error, refetch: fetch };
}
