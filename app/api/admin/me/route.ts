import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role.toLowerCase(),
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json({ error: '사용자 정보 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}
