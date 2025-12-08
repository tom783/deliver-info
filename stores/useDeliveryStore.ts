import { create } from 'zustand';
import { Shipment } from '@/types';

interface DeliveryState {
  // 검색
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debouncedSearchTerm: string;
  setDebouncedSearchTerm: (term: string) => void;

  // 페이지네이션
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetPagination: () => void;

  // Dialog 상태
  isUploadDialogOpen: boolean;
  setIsUploadDialogOpen: (open: boolean) => void;

  isManualRegisterDialogOpen: boolean;
  setIsManualRegisterDialogOpen: (open: boolean) => void;

  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;

  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;

  // 선택된 배송
  selectedShipment: Shipment | null;
  setSelectedShipment: (shipment: Shipment | null) => void;

  // 편집/삭제 액션
  openEditDialog: (shipment: Shipment) => void;
  openDeleteDialog: (shipment: Shipment) => void;
  closeAllDialogs: () => void;
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
  // 검색
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  debouncedSearchTerm: '',
  setDebouncedSearchTerm: (term) => set({ debouncedSearchTerm: term, page: 1 }),

  // 페이지네이션
  page: 1,
  limit: 20,
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  resetPagination: () => set({ page: 1 }),

  // Dialog 상태
  isUploadDialogOpen: false,
  setIsUploadDialogOpen: (open) => set({ isUploadDialogOpen: open }),

  isManualRegisterDialogOpen: false,
  setIsManualRegisterDialogOpen: (open) => set({ isManualRegisterDialogOpen: open }),

  isEditDialogOpen: false,
  setIsEditDialogOpen: (open) => set({ isEditDialogOpen: open }),

  isDeleteDialogOpen: false,
  setIsDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),

  // 선택된 배송
  selectedShipment: null,
  setSelectedShipment: (shipment) => set({ selectedShipment: shipment }),

  // 편집/삭제 액션
  openEditDialog: (shipment) => set({ selectedShipment: shipment, isEditDialogOpen: true }),
  openDeleteDialog: (shipment) => set({ selectedShipment: shipment, isDeleteDialogOpen: true }),
  closeAllDialogs: () =>
    set({
      isUploadDialogOpen: false,
      isManualRegisterDialogOpen: false,
      isEditDialogOpen: false,
      isDeleteDialogOpen: false,
      selectedShipment: null,
    }),
}));
