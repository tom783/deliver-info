import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';
import type { Carrier } from '@prisma/client';

// GET: 택배사 목록 조회
export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    const carriers = await prisma.carrier.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      carriers: carriers.map((carrier: Carrier) => ({
        id: Number(carrier.id),
        name: carrier.name,
        base_url: carrier.baseUrl,
      })),
    });
  } catch (error) {
    console.error('Get carriers error:', error);
    return NextResponse.json({ error: '택배사 목록 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}
