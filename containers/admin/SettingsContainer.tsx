import React, { useState } from 'react';
import { SettingsView } from '@/views/admin/SettingsView';
import { MOCK_USERS, User } from '@/data/mocks/users';

export const SettingsContainer = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  const handleSaveUser = (userData: Omit<User, 'id' | 'created_at'> & { id?: number }) => {
    if (userData.id) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userData.id
            ? { ...u, ...userData, created_at: u.created_at }
            : u
        )
      );
    } else {
      // Create new user
      const newUser: User = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        created_at: new Date().toISOString(),
        ...userData,
      } as User;
      setUsers((prev) => [...prev, newUser]);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      setSelectedUser(null);
    }
  };

  return (
    <SettingsView
      users={users}
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
