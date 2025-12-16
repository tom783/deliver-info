import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';
import { z } from 'zod';
import { addDays } from 'date-fns';
import { Prisma } from '@prisma/client';

function normalizePhone(phone: string): { full: string; last4: string } {
  const digitsOnly = phone.replace(/\D/g, '');
  return {
    full: digitsOnly,
    last4: digitsOnly.slice(-4),
  };
}

function normalizeTrackingNumber(trackingNumber: string): string {
  // 숫자와 영문만 남기고 제거
  return trackingNumber.replace(/[^a-zA-Z0-9]/g, '');
}

// GET: 배송 목록 조회
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { recipientName: { contains: search } },
            { recipientPhoneFull: { contains: search } },
            { trackingNumber: { contains: search } },
          ],
        }
      : {};

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        include: { carrier: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.shipment.count({ where }),
    ]);

    return NextResponse.json({
      shipments: shipments.map((s) => ({
        id: s.id,
        created_at: s.createdAt.toISOString(),
        recipient_name: s.recipientName,
        recipient_phone_full: s.recipientPhoneFull,
        recipient_phone_last4: s.recipientPhoneLast4,
        tracking_number: s.trackingNumber,
        product_name: s.productName,
        carrier_id: Number(s.carrierId),
        carrier: {
          id: Number(s.carrier.id),
          name: s.carrier.name,
          base_url: s.carrier.baseUrl,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('List shipments error:', error);
    return NextResponse.json({ error: '목록 조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}

// POST: 배송 개별 등록
const createShipmentSchema = z.object({
  recipientName: z.string().min(1, '수취인명을 입력해주세요'),
  phone: z.string().min(10, '올바른 전화번호를 입력해주세요'),
  carrierId: z.number().int().positive('택배사를 선택해주세요'),
  trackingNumber: z.string().min(1, '운송장번호를 입력해주세요'),
  productName: z.string().min(1, '상품명을 입력해주세요'),
});

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    const body = await request.json();
    const validated = createShipmentSchema.parse(body);

    const { full, last4 } = normalizePhone(validated.phone);
    const normalizedTrackingNumber = normalizeTrackingNumber(validated.trackingNumber);
    const now = new Date();

    const shipment = await prisma.shipment.create({
      data: {
        recipientName: validated.recipientName,
        recipientPhoneFull: full,
        recipientPhoneLast4: last4,
        carrierId: BigInt(validated.carrierId),
        trackingNumber: normalizedTrackingNumber,
        productName: validated.productName,
        viewableUntil: addDays(now, 10),
        deleteAt: addDays(now, 14),
      },
      include: { carrier: true },
    });

    return NextResponse.json(
      {
        shipment: {
          id: shipment.id,
          created_at: shipment.createdAt.toISOString(),
          recipient_name: shipment.recipientName,
          recipient_phone_full: shipment.recipientPhoneFull,
          recipient_phone_last4: shipment.recipientPhoneLast4,
          tracking_number: shipment.trackingNumber,
          product_name: shipment.productName,
          carrier_id: Number(shipment.carrierId),
          carrier: {
            id: Number(shipment.carrier.id),
            name: shipment.carrier.name,
            base_url: shipment.carrier.baseUrl,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    // Prisma unique constraint 위반 (P2002)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { error: '이미 등록된 배송 정보입니다' },
        { status: 409 }
      );
    }
    console.error('Create shipment error:', error);
    return NextResponse.json({ error: '등록 중 오류가 발생했습니다' }, { status: 500 });
  }
}
