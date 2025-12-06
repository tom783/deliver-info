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

// 공통 에러 처리 함수
async function handleResponse<T>(res: Response, defaultError: string): Promise<T> {
  if (!res.ok) {
    let errorMessage = defaultError;
    try {
      const data = await res.json();
      errorMessage = data.error || defaultError;
    } catch {
      // JSON 파싱 실패 시 기본 에러 메시지 사용
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

// 관리자 목록 조회
export async function getUsers(): Promise<UsersResponse> {
  try {
    const res = await fetch('/api/admin/users', {
      credentials: 'include',
    });

    return handleResponse<UsersResponse>(res, '사용자 목록 조회 중 오류가 발생했습니다');
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 관리자 생성
export async function createUser(data: CreateUserData): Promise<{ user: User }> {
  try {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<{ user: User }>(res, '사용자 생성 중 오류가 발생했습니다');
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 관리자 수정
export async function updateUser(id: string, data: UpdateUserData): Promise<{ user: User }> {
  try {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<{ user: User }>(res, '사용자 수정 중 오류가 발생했습니다');
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 관리자 삭제
export async function deleteUser(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    return handleResponse<{ success: boolean; message: string }>(res, '사용자 삭제 중 오류가 발생했습니다');
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}
