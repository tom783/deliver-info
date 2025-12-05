import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/lib/api/stats';

export const statsKeys = {
  all: ['stats'] as const,
  dashboard: () => [...statsKeys.all, 'dashboard'] as const,
};

export function useStats() {
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: getStats,
  });
}
