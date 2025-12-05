import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UserManagementTable } from '@/components/admin/UserManagementTable';
import { UserDialog } from '@/components/admin/UserDialog';
import { DeleteUserDialog } from '@/components/admin/DeleteUserDialog';
import { User } from '@/types';

interface SettingsViewProps {
  users: User[];
  isLoading?: boolean;
  isUserDialogOpen: boolean;
  setIsUserDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedUser: User | null;
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onSaveUser: (user: {
    email?: string;
    password?: string;
    name: string;
    role: 'master' | 'sub_admin';
    id?: string;
  }) => Promise<void>;
  onConfirmDelete: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  users,
  isLoading,
  isUserDialogOpen,
  setIsUserDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedUser,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onSaveUser,
  onConfirmDelete,
}) => {
  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">설정</h1>
          <p className="text-gray-500">관리자 계정 및 권한을 관리합니다.</p>
        </div>
        <Button onClick={onAddUser} className="bg-gray-900 text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          계정 추가
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">계정 관리</h2>
        <UserManagementTable
          users={users}
          isLoading={isLoading}
          onEdit={onEditUser}
          onDelete={onDeleteUser}
        />
      </div>

      <UserDialog
        open={isUserDialogOpen}
        onOpenChange={setIsUserDialogOpen}
        user={selectedUser}
        onSave={onSaveUser}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
};
