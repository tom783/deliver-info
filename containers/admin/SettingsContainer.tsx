'use client';

import { useEffect } from 'react';
import { SettingsView } from '@/views/admin/SettingsView';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/queries';
import { useSettingsStore } from '@/stores';
import { toast } from 'sonner';

export const SettingsContainer = () => {
  // Zustand store에서 UI 상태 가져오기
  const {
    isUserDialogOpen,
    setIsUserDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedUser,
    openAddUserDialog,
    openEditUserDialog,
    openDeleteUserDialog,
    closeAllDialogs,
  } = useSettingsStore();

  // React Query hooks
  const { data: usersData, isLoading, error: usersError } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // 에러 처리
  useEffect(() => {
    if (usersError) {
      toast.error('사용자 목록을 불러오는데 실패했습니다');
    }
  }, [usersError]);

  const handleSaveUser = async (userData: {
    email?: string;
    password?: string;
    name: string;
    role: 'master' | 'sub_admin';
    id?: string;
  }) => {
    if (userData.id) {
      // Update existing user
      await updateUserMutation.mutateAsync({
        id: userData.id,
        data: {
          name: userData.name,
          role: userData.role,
          password: userData.password,
        },
      });
      toast.success('사용자 정보가 수정되었습니다');
    } else {
      // Create new user
      if (!userData.email || !userData.password) {
        throw new Error('이메일과 비밀번호를 입력해주세요');
      }
      await createUserMutation.mutateAsync({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role,
      });
      toast.success('사용자가 생성되었습니다');
    }
    setIsUserDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      toast.success('사용자가 삭제되었습니다');
      closeAllDialogs();
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다');
    }
  };

  const users = usersData?.users ?? [];

  return (
    <SettingsView
      users={users}
      isLoading={isLoading}
      isUserDialogOpen={isUserDialogOpen}
      setIsUserDialogOpen={setIsUserDialogOpen}
      isDeleteDialogOpen={isDeleteDialogOpen}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      selectedUser={selectedUser}
      onAddUser={openAddUserDialog}
      onEditUser={openEditUserDialog}
      onDeleteUser={openDeleteUserDialog}
      onSaveUser={handleSaveUser}
      onConfirmDelete={handleConfirmDelete}
    />
  );
};
