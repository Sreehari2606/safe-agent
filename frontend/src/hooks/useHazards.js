import { useState, useEffect, useCallback } from 'react';
import { hazardApi } from '../services/api';
import { DEFAULT_HAZARDS } from '../utils/constants';

function getLocalHazards(params = {}) {
  try {
    const local = JSON.parse(localStorage.getItem('saferoute_local_hazards') || '[]');
    let combined = [...local, ...DEFAULT_HAZARDS];
    if (params.category) combined = combined.filter(h => h.category === params.category);
    if (params.status) combined = combined.filter(h => h.status === params.status);
    return combined;
  } catch {
    return DEFAULT_HAZARDS;
  }
}

export function useHazards(params = {}) {
  // Pre-seed state so hazards appear instantly on first paint without delay
  const [hazards, setHazards] = useState(() => getLocalHazards(params));
  const [total, setTotal] = useState(() => getLocalHazards(params).length);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      const { data } = await hazardApi.list(params);
      if (data && data.hazards && data.hazards.length > 0) {
        // Also combine with any locally reported hazards created by this user
        const local = JSON.parse(localStorage.getItem('saferoute_local_hazards') || '[]');
        const combined = [...local, ...data.hazards];
        setHazards(combined);
        setTotal(combined.length);
      } else {
        const fallback = getLocalHazards(params);
        setHazards(fallback);
        setTotal(fallback.length);
      }
    } catch {
      // If backend is sleeping/offline/mixed-content blocked, use reliable local dataset
      const fallback = getLocalHazards(params);
      setHazards(fallback);
      setTotal(fallback.length);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => { 
    fetch(); 
  }, [fetch]);

  return { hazards, total, loading, error, refetch: fetch };
}
