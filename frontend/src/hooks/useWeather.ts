import { useQuery } from '@tanstack/react-query';
import { weatherApi, disastersApi } from '../api/endpoints';
import { useState, useEffect } from 'react';

export function useWeather(spatialUnitId: string | undefined) {
  return useQuery({
    queryKey: ['weather', spatialUnitId],
    queryFn: () => weatherApi.getSpatialUnitWeather(spatialUnitId!),
    enabled: !!spatialUnitId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useSearchLocations(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  return useQuery({
    queryKey: ['searchLocations', debouncedQuery],
    queryFn: () => weatherApi.searchLocations(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });
}

export function useActiveWarnings(spatialUnitId?: string) {
  return useQuery({
    queryKey: ['activeWarnings', spatialUnitId],
    queryFn: () => spatialUnitId
      ? weatherApi.getActiveWarningsForUnit(spatialUnitId)
      : disastersApi.getActiveWarnings(),
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });
}

export function useNearestWeather(lat: number | null, lng: number | null) {
  return useQuery({
    queryKey: ['nearestWeather', lat, lng],
    queryFn: () => weatherApi.getNearestWeather(lat!, lng!),
    enabled: lat !== null && lng !== null,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useForecast(lat: number | null, lng: number | null) {
  return useQuery({
    queryKey: ['forecast', lat, lng],
    queryFn: () => weatherApi.getForecast(lat!, lng!),
    enabled: lat !== null && lng !== null,
    staleTime: 1000 * 60 * 2,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
