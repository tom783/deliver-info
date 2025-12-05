import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// PUT: 관리자 정보 수정
const updateUserSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').optional(),
  role: z.enum(['master', 'sub_admin']).optional(),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다').optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    // Master 권한 체크
    if (admin.role !== 'MASTER') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = updateUserSchema.parse(body);

    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 });
    }

    // 비밀번호 변경이 있는 경우 Supabase Auth 업데이트
    if (validated.password) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );

      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        existing.authId,
        { password: validated.password }
      );

      if (authError) {
        throw authError;
      }
    }

    // AdminUser 테이블 업데이트
    const updateData: Record<string, unknown> = {};
    if (validated.name) updateData.name = validated.name;
    if (validated.role) updateData.role = validated.role === 'master' ? 'MASTER' : 'SUB_ADMIN';

    const user = await prisma.adminUser.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.toLowerCase(),
        created_at: user.createdAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Update user error:', error);
    return NextResponse.json({ error: '사용자 수정 중 오류가 발생했습니다' }, { status: 500 });
  }
}

// DELETE: 관리자 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    // Master 권한 체크
    if (admin.role !== 'MASTER') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    }

    const { id } = await params;

    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 });
    }

    // 자기 자신은 삭제 불가
    if (existing.id === admin.id) {
      return NextResponse.json({ error: '자기 자신은 삭제할 수 없습니다' }, { status: 400 });
    }

    // Supabase Auth에서 사용자 삭제
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(existing.authId);

    if (authError) {
      console.error('Delete auth user error:', authError);
      // Auth 삭제 실패해도 DB에서는 삭제 진행
    }

    // AdminUser 테이블에서 삭제
    await prisma.adminUser.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: '사용자가 삭제되었습니다' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: '사용자 삭제 중 오류가 발생했습니다' }, { status: 500 });
  }
}
