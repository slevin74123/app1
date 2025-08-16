import { useState, useEffect, useCallback } from 'react';
import { activityService, type ActivityItem } from '@/lib/activityService';

export function useRealTimeActivities(limit: number = 5, refreshInterval: number = 30000) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = useCallback(async () => {
    try {
      console.log('🔍 useRealTimeActivities: Începe încărcarea activităților...');
      setError(null);
      const result = await activityService.getRecentActivities(limit);
      
      console.log('🔍 useRealTimeActivities: Rezultat primit:', result);
      
      if (result.success && result.data) {
        console.log('✅ useRealTimeActivities: Activități încărcate cu succes:', result.data.length);
        setActivities(result.data);
      } else {
        console.error('❌ useRealTimeActivities: Eroare la încărcare:', result.error);
        setError(result.error || 'Eroare la încărcarea activităților');
      }
    } catch (err) {
      console.error('❌ useRealTimeActivities: Eroare neașteptată:', err);
      setError('Eroare neașteptată');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  // Încarcă activitățile la montarea componentei
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Actualizează la fiecare interval
  useEffect(() => {
    const interval = setInterval(loadActivities, refreshInterval);
    return () => clearInterval(interval);
  }, [loadActivities, refreshInterval]);

  // Funcție pentru a reîncărca manual
  const refresh = useCallback(() => {
    setIsLoading(true);
    loadActivities();
  }, [loadActivities]);

  // Funcție pentru a adăuga o activitate nouă la început
  const addActivity = useCallback((newActivity: ActivityItem) => {
    setActivities(prev => [newActivity, ...prev.slice(0, limit - 1)]);
  }, [limit]);

  return {
    activities,
    isLoading,
    error,
    refresh,
    addActivity
  };
} 