import { useState, useEffect, useCallback } from 'react';
import { weatherApi } from '../services/api';
import { DEFAULT_LOCATION } from '../utils/constants';

export function useWeather(lat = DEFAULT_LOCATION.lat, lon = DEFAULT_LOCATION.lon) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await weatherApi.current(lat, lon);
      setWeather(data);
    } catch (err) {
      setError(err.message || 'Failed to load weather');
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => { fetch(); }, [fetch]);

  return { weather, loading, error, refetch: fetch };
}

