import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';
import { z } from 'zod';

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

// PUT: 배송 정보 수정
const updateShipmentSchema = z.object({
  recipientName: z.string().min(1, '수취인명을 입력해주세요').optional(),
  phone: z.string().min(10, '올바른 전화번호를 입력해주세요').optional(),
  carrierId: z.number().int().positive('택배사를 선택해주세요').optional(),
  trackingNumber: z.string().min(1, '운송장번호를 입력해주세요').optional(),
  productName: z.string().min(1, '상품명을 입력해주세요').optional(),
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

    const { id } = await params;
    const body = await request.json();
    const validated = updateShipmentSchema.parse(body);

    const existing = await prisma.shipment.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: '배송 정보를 찾을 수 없습니다' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (validated.recipientName) {
      updateData.recipientName = validated.recipientName;
    }
    if (validated.phone) {
      const { full, last4 } = normalizePhone(validated.phone);
      updateData.recipientPhoneFull = full;
      updateData.recipientPhoneLast4 = last4;
    }
    if (validated.carrierId) {
      updateData.carrierId = BigInt(validated.carrierId);
    }
    if (validated.trackingNumber) {
      updateData.trackingNumber = normalizeTrackingNumber(validated.trackingNumber);
    }
    if (validated.productName) {
      updateData.productName = validated.productName;
    }

    const shipment = await prisma.shipment.update({
      where: { id },
      data: updateData,
      include: { carrier: true },
    });

    return NextResponse.json({
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
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error('Update shipment error:', error);
    return NextResponse.json({ error: '수정 중 오류가 발생했습니다' }, { status: 500 });
  }
}

// DELETE: 배송 정보 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.shipment.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: '배송 정보를 찾을 수 없습니다' }, { status: 404 });
    }

    await prisma.shipment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: '배송 정보가 삭제되었습니다' });
  } catch (error) {
    console.error('Delete shipment error:', error);
    return NextResponse.json({ error: '삭제 중 오류가 발생했습니다' }, { status: 500 });
  }
}
