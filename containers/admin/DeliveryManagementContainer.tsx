'use client';

import { useEffect } from 'react';
import { DeliveryManagementView } from '@/views/admin/DeliveryManagementView';
import { useAdminShipments, useDeleteShipment, useCarriers } from '@/hooks/queries';
import { useDeliveryStore } from '@/stores';
import { toast } from 'sonner';

export const DeliveryManagementContainer = () => {
  // Zustand store에서 UI 상태 가져오기
  const {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    setDebouncedSearchTerm,
    page,
    limit,
    setPage,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    isManualRegisterDialogOpen,
    setIsManualRegisterDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedShipment,
    openEditDialog,
    openDeleteDialog,
    closeAllDialogs,
  } = useDeliveryStore();

  // Debounce 검색어 (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, setDebouncedSearchTerm]);

  // React Query hooks - debouncedSearchTerm 사용
  const {
    data: shipmentsData,
    isLoading,
    error: shipmentsError,
  } = useAdminShipments(page, limit, debouncedSearchTerm);

  const { data: carriersData, error: carriersError } = useCarriers();

  const deleteShipmentMutation = useDeleteShipment();

  // 에러 처리
  useEffect(() => {
    if (shipmentsError) {
      toast.error('배송 목록을 불러오는데 실패했습니다');
    }
  }, [shipmentsError]);

  useEffect(() => {
    if (carriersError) {
      toast.error('택배사 목록을 불러오는데 실패했습니다');
    }
  }, [carriersError]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedShipment) return;

    try {
      await deleteShipmentMutation.mutateAsync(selectedShipment.id);
      toast.success('배송 정보가 삭제되었습니다');
      closeAllDialogs();
    } catch (error) {
      console.error('Delete shipment error:', error);
      toast.error('삭제 중 오류가 발생했습니다');
    }
  };

  // 데이터 추출
  const shipments = shipmentsData?.shipments ?? [];
  const carriers = carriersData?.carriers ?? [];
  const pagination = shipmentsData?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  };

  return (
    <DeliveryManagementView
      shipments={shipments}
      carriers={carriers}
      searchTerm={searchTerm}
      isLoading={isLoading}
      pagination={pagination}
      onSearchChange={handleSearchChange}
      isUploadDialogOpen={isUploadDialogOpen}
      setIsUploadDialogOpen={setIsUploadDialogOpen}
      isManualRegisterDialogOpen={isManualRegisterDialogOpen}
      setIsManualRegisterDialogOpen={setIsManualRegisterDialogOpen}
      isEditOpen={isEditDialogOpen}
      setIsEditOpen={setIsEditDialogOpen}
      isDeleteOpen={isDeleteDialogOpen}
      setIsDeleteOpen={setIsDeleteDialogOpen}
      selectedShipment={selectedShipment}
      onEditClick={openEditDialog}
      onDeleteClick={openDeleteDialog}
      onDeleteConfirm={handleDeleteConfirm}
      onSuccess={() => {}} // React Query가 자동으로 캐시 무효화 처리
      onPageChange={setPage}
    />
  );
};
