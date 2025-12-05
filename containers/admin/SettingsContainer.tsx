'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SettingsView } from '@/views/admin/SettingsView';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/api/users';
import { User } from '@/types';
import { toast } from 'sonner';

export const SettingsContainer = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data.users);
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('사용자 목록을 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveUser = async (userData: {
    email?: string;
    password?: string;
    name: string;
    role: 'master' | 'sub_admin';
    id?: string;
  }) => {
    if (userData.id) {
      // Update existing user
      await updateUser(userData.id, {
        name: userData.name,
        role: userData.role,
        password: userData.password,
      });
      toast.success('사용자 정보가 수정되었습니다');
    } else {
      // Create new user
      if (!userData.email || !userData.password) {
        throw new Error('이메일과 비밀번호를 입력해주세요');
      }
      await createUser({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role,
      });
      toast.success('사용자가 생성되었습니다');
    }
    setIsUserDialogOpen(false);
    fetchUsers();
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      toast.success('사용자가 삭제되었습니다');
      setSelectedUser(null);
      setIsDeleteDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다');
    }
  };

  return (
    <SettingsView
      users={users}
      isLoading={isLoading}
      isUserDialogOpen={isUserDialogOpen}
      setIsUserDialogOpen={setIsUserDialogOpen}
      isDeleteDialogOpen={isDeleteDialogOpen}
      setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      selectedUser={selectedUser}
      onAddUser={handleAddUser}
      onEditUser={handleEditUser}
      onDeleteUser={handleDeleteUser}
      onSaveUser={handleSaveUser}
      onConfirmDelete={handleConfirmDelete}
    />
  );
};
