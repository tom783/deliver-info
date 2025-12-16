import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const searchSchema = z.object({
  recipientName: z.string().min(1, '이름을 입력해주세요'),
  phoneLast4: z.string().min(1, '전화번호 뒷4자리를 입력해주세요'),
});

// 숫자만 추출
function normalizeDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = searchSchema.parse(body);

    // 전화번호 뒷4자리에서 숫자만 추출
    const phoneLast4 = normalizeDigits(validated.phoneLast4);

    if (phoneLast4.length !== 4) {
      return NextResponse.json({ error: '전화번호 뒷4자리를 정확히 입력해주세요' }, { status: 400 });
    }

    const shipments = await prisma.shipment.findMany({
      where: {
        recipientName: validated.recipientName,
        recipientPhoneLast4: phoneLast4,
      },
      include: {
        carrier: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const response = shipments.map((s) => ({
      id: s.id,
      created_at: s.createdAt.toISOString(),
      recipient_name: s.recipientName,
      recipient_phone_last4: s.recipientPhoneLast4,
      tracking_number: s.trackingNumber,
      product_name: s.productName,
      carrier_id: Number(s.carrierId),
      carrier: {
        id: Number(s.carrier.id),
        name: s.carrier.name,
        base_url: s.carrier.baseUrl,
      },
    }));

    return NextResponse.json({ shipments: response });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Search error:', error);
    return NextResponse.json({ error: '조회 중 오류가 발생했습니다' }, { status: 500 });
  }
}
