import { useState, useEffect, useCallback } from 'react';
import { hazardApi } from '../services/api';
import { DEFAULT_HAZARDS } from '../utils/constants';

export function useHazards(params = {}) {
  const [hazards, setHazards] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await hazardApi.list(params);
      setHazards(data.hazards || []);
      setTotal(data.total || 0);
    } catch {
      // Graceful fallback to default seed hazards + local user reports if backend is offline/sleeping
      try {
        const localCustom = JSON.parse(localStorage.getItem('saferoute_local_hazards') || '[]');
        let combined = [...localCustom, ...DEFAULT_HAZARDS];
        if (params.category) combined = combined.filter(h => h.category === params.category);
        if (params.status) combined = combined.filter(h => h.status === params.status);
        setHazards(combined);
        setTotal(combined.length);
      } catch {
        setHazards(DEFAULT_HAZARDS);
        setTotal(DEFAULT_HAZARDS.length);
      }
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { hazards, total, loading, error, refetch: fetch };
}
