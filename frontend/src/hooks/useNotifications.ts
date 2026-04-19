import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/endpoints';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications(),
    refetchInterval: 1000 * 60, // Poll every 60 seconds
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unreadCount'],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 1000 * 30, // Poll every 30 seconds
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
