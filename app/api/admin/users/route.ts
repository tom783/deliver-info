import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// GET: 관리자 목록 조회
export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    // Master 권한 체크
    if (admin.role !== 'MASTER') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    }

    const users = await prisma.adminUser.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role.toLowerCase(),
        created_at: u.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: '사용자 목록 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}

// POST: 관리자 생성
const createUserSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
  name: z.string().min(1, '이름을 입력해주세요'),
  role: z.enum(['master', 'sub_admin']),
});

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    // Master 권한 체크
    if (admin.role !== 'MASTER') {
      return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
    }

    const body = await request.json();
    const validated = createUserSchema.parse(body);

    // Supabase Admin Client로 사용자 생성
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validated.email,
      password: validated.password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already')) {
        return NextResponse.json({ error: '이미 등록된 이메일입니다' }, { status: 400 });
      }
      throw authError;
    }

    // AdminUser 테이블에 저장
    const user = await prisma.adminUser.create({
      data: {
        authId: authData.user.id,
        email: validated.email,
        name: validated.name,
        role: validated.role === 'master' ? 'MASTER' : 'SUB_ADMIN',
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.toLowerCase(),
          created_at: user.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Create user error:', error);
    return NextResponse.json({ error: '사용자 생성 중 오류가 발생했습니다' }, { status: 500 });
  }
}
