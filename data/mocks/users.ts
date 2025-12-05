export type UserRole = 'master' | 'sub_admin';

export interface User {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'admin_master',
    name: '최고관리자',
    role: 'master',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    username: 'admin_sub1',
    name: '배송담당자1',
    role: 'sub_admin',
    created_at: '2023-06-15T09:30:00Z',
  },
  {
    id: 3,
    username: 'admin_sub2',
    name: '배송담당자2',
    role: 'sub_admin',
    created_at: '2023-08-20T14:15:00Z',
  },
];
