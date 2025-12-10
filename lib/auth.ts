import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { headers } from 'next/headers';

export interface AdminUserInfo {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function getAdminUser(): Promise<AdminUserInfo | null> {
  try {
    // middleware에서 전달된 user ID 확인 (중복 인증 호출 방지)
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (userId) {
      // middleware에서 이미 인증됨 - DB만 조회
      const adminUser = await prisma.adminUser.findUnique({
        where: { authId: userId },
      });

      if (adminUser) {
        return {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
        };
      }
    }

    // fallback: middleware 외부에서 호출된 경우 (Server Component 등)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const adminUser = await prisma.adminUser.findUnique({
      where: { authId: user.id },
    });

    if (!adminUser) return null;

    return {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    };
  } catch (error) {
    console.error('Get admin user error:', error);
    return null;
  }
}

export async function requireAdmin(): Promise<AdminUserInfo> {
  const admin = await getAdminUser();
  if (!admin) {
    throw new Error('Unauthorized');
  }
  return admin;
}

export async function requireMaster(): Promise<AdminUserInfo> {
  const admin = await requireAdmin();
  if (admin.role !== 'MASTER') {
    throw new Error('Forbidden: Master role required');
  }
  return admin;
}
