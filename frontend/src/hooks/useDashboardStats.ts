import { useQuery } from '@tanstack/react-query';
import { disastersApi, reportsApi, floodApi, adminApi } from '../api/endpoints';
import { useAuthStore } from '../store/authStore';

export const useDashboardStats = () => {
  const { isAdmin } = useAuthStore();
  const isUserAdmin = isAdmin();

  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // For a real production app, we would have a single aggregate endpoint.
      // Here we fetch from multiple for the demo if needed, but we'll try to be efficient.
      const [warnings, reports, flood] = await Promise.all([
        disastersApi.getActiveWarnings(),
        reportsApi.getPublicReports({ size: 1, status: 'VERIFIED' }),
        floodApi.getFloodDashboard(),
      ]);

      // SOS incidents - only admins can see global active ones
      let sosCount = 0;
      if (isUserAdmin) {
        try {
          const sos = await adminApi.getActiveSos();
           sosCount = sos.length;
        } catch (e) {
           console.error("Failed to fetch SOS stats", e);
        }
      }

      return {
        activeWarnings: warnings.length,
        verifiedReports: reports.totalElements || 0,
        floodAlerts: flood.alertCount || 0,
        sosIncidents: sosCount
      };
    },
    refetchInterval: 30000, // Refresh every 30s
  });
};
