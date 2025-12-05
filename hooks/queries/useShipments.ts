import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminShipments,
  createShipment,
  updateShipment,
  deleteShipment,
  bulkUploadShipments,
  searchShipments,
} from '@/lib/api/shipments';
import { statsKeys } from './useStats';

export const shipmentKeys = {
  all: ['shipments'] as const,
  lists: () => [...shipmentKeys.all, 'list'] as const,
  list: (params: { page: number; limit: number; search: string }) =>
    [...shipmentKeys.lists(), params] as const,
  search: (recipientName: string, phoneLast4: string) =>
    [...shipmentKeys.all, 'search', { recipientName, phoneLast4 }] as const,
};

// 관리자 배송 목록 조회
export function useAdminShipments(page = 1, limit = 20, search = '') {
  return useQuery({
    queryKey: shipmentKeys.list({ page, limit, search }),
    queryFn: () => getAdminShipments(page, limit, search),
  });
}

// 사용자 배송 검색
export function useSearchShipments(recipientName: string, phoneLast4: string) {
  return useQuery({
    queryKey: shipmentKeys.search(recipientName, phoneLast4),
    queryFn: () => searchShipments(recipientName, phoneLast4),
    enabled: !!recipientName && !!phoneLast4,
  });
}

// 배송 생성
export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
    },
  });
}

// 배송 수정
export function useUpdateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateShipment>[1] }) =>
      updateShipment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
    },
  });
}

// 배송 삭제
export function useDeleteShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteShipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
    },
  });
}

// 엑셀 대량 업로드
export function useBulkUploadShipments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUploadShipments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statsKeys.all });
    },
  });
}
