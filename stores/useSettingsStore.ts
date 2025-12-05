import { create } from 'zustand';
import { User } from '@/types';

interface SettingsState {
  // Dialog 상태
  isUserDialogOpen: boolean;
  setIsUserDialogOpen: (open: boolean) => void;

  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;

  // 선택된 사용자
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;

  // 액션
  openAddUserDialog: () => void;
  openEditUserDialog: (user: User) => void;
  openDeleteUserDialog: (user: User) => void;
  closeAllDialogs: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  // Dialog 상태
  isUserDialogOpen: false,
  setIsUserDialogOpen: (open) => set({ isUserDialogOpen: open }),

  isDeleteDialogOpen: false,
  setIsDeleteDialogOpen: (open) => set({ isDeleteDialogOpen: open }),

  // 선택된 사용자
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),

  // 액션
  openAddUserDialog: () => set({ selectedUser: null, isUserDialogOpen: true }),
  openEditUserDialog: (user) => set({ selectedUser: user, isUserDialogOpen: true }),
  openDeleteUserDialog: (user) => set({ selectedUser: user, isDeleteDialogOpen: true }),
  closeAllDialogs: () =>
    set({
      isUserDialogOpen: false,
      isDeleteDialogOpen: false,
      selectedUser: null,
    }),
}));
