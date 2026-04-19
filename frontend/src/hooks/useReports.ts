import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api/endpoints';

export const useReports = (params?: any) => {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => reportsApi.getPublicReports(params),
  });
};

export const useMyReports = (params?: any) => {
  return useQuery({
    queryKey: ['my-reports', params],
    queryFn: () => reportsApi.getMyReports(params),
  });
};
