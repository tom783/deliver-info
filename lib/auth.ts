import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export interface AdminUserInfo {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function getAdminUser(): Promise<AdminUserInfo | null> {
  try {
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
