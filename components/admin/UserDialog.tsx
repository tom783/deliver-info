import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, UserRole } from '@/types';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (user: {
    email?: string;
    password?: string;
    name: string;
    role: UserRole;
    id?: string;
  }) => Promise<void>;
}

export const UserDialog: React.FC<UserDialogProps> = ({ open, onOpenChange, user, onSave }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'sub_admin' as UserRole,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      if (user) {
        setFormData({
          email: user.email,
          name: user.name,
          password: '',
          role: user.role,
        });
      } else {
        setFormData({
          email: '',
          name: '',
          password: '',
          role: 'sub_admin',
        });
      }
    }
  }, [user, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // 클라이언트 측 유효성 검사
    if (!user && formData.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSave({
        id: user?.id,
        email: user ? undefined : formData.email,
        password: formData.password || undefined,
        name: formData.name,
        role: formData.role,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? '사용자 수정' : '사용자 등록'}</DialogTitle>
          <DialogDescription>
            {user ? '사용자 정보를 수정합니다.' : '새로운 관리자 계정을 생성합니다.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              이메일
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3"
              required={!user}
              disabled={!!user} // Email cannot be changed
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              이름
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              비밀번호
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="col-span-3"
              placeholder={user ? '변경시에만 입력' : '필수 입력'}
              required={!user}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              권한
            </Label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="sub_admin">일반 관리자 (배송 관리)</option>
              <option value="master">최고 관리자 (전체 권한)</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '저장'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
