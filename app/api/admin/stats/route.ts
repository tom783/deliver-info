import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';
import { startOfDay, endOfDay } from 'date-fns';

// GET: 대시보드 통계
export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const [totalShipments, todayShipments, viewableShipments] = await Promise.all([
      // 전체 배송 건수
      prisma.shipment.count(),
      // 오늘 등록된 건수
      prisma.shipment.count({
        where: {
          createdAt: { gte: todayStart, lte: todayEnd },
        },
      }),
      // 현재 조회 가능 건수 (5일 이내)
      prisma.shipment.count({
        where: {
          viewableUntil: { gte: now },
        },
      }),
    ]);

    return NextResponse.json({
      totalShipments,
      todayShipments,
      viewableShipments,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: '통계 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}
