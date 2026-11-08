import { useState, useEffect, useCallback } from 'react';
import { hazardApi } from '../services/api';

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
    } catch (err) {
      setError(err.message || 'Failed to load hazards');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { hazards, total, loading, error, refetch: fetch };
}

