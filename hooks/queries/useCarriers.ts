import { useQuery } from '@tanstack/react-query';
import { getCarriers } from '@/lib/api/carriers';

export const carrierKeys = {
  all: ['carriers'] as const,
  list: () => [...carrierKeys.all, 'list'] as const,
};

export function useCarriers() {
  return useQuery({
    queryKey: carrierKeys.list(),
    queryFn: getCarriers,
    staleTime: 5 * 60 * 1000, // 5분 (택배사는 자주 변경되지 않음)
  });
}
