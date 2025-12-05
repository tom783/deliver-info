import { User } from '@/types';

interface UsersResponse {
  users: User[];
}

interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: 'master' | 'sub_admin';
}

interface UpdateUserData {
  name?: string;
  role?: 'master' | 'sub_admin';
  password?: string;
}

// 관리자 목록 조회
export async function getUsers(): Promise<UsersResponse> {
  const res = await fetch('/api/admin/users', {
    credentials: 'include',
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '사용자 목록 조회 중 오류가 발생했습니다');
  }

  return res.json();
}

// 관리자 생성
export async function createUser(data: CreateUserData): Promise<{ user: User }> {
  const res = await fetch('/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const resData = await res.json();
    throw new Error(resData.error || '사용자 생성 중 오류가 발생했습니다');
  }

  return res.json();
}

// 관리자 수정
export async function updateUser(id: string, data: UpdateUserData): Promise<{ user: User }> {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const resData = await res.json();
    throw new Error(resData.error || '사용자 수정 중 오류가 발생했습니다');
  }

  return res.json();
}

// 관리자 삭제
export async function deleteUser(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '사용자 삭제 중 오류가 발생했습니다');
  }

  return res.json();
}
