import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';
import * as XLSX from 'xlsx';
import { addDays } from 'date-fns';

interface ExcelRow {
  수취인명: string;
  전화번호: string;
  택배사명: string;
  운송장번호: string;
  상품명: string;
}

function normalizePhone(phone: string): { full: string; last4: string } {
  const digitsOnly = String(phone).replace(/\D/g, '');
  return {
    full: digitsOnly,
    last4: digitsOnly.slice(-4),
  };
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '파일이 필요합니다' }, { status: 400 });
    }

    // 파일 검증
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: '엑셀 파일만 업로드 가능합니다' }, { status: 400 });
    }

    // 파일 파싱
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

    if (rows.length === 0) {
      return NextResponse.json({ error: '데이터가 없습니다' }, { status: 400 });
    }

    // 택배사 목록 조회 (이름 -> ID 매핑)
    const carriers = await prisma.carrier.findMany();
    const carrierMap = new Map(carriers.map((c) => [c.name, c.id]));

    // 데이터 변환 및 검증
    const now = new Date();
    const validData: Array<{
      recipientName: string;
      recipientPhoneFull: string;
      recipientPhoneLast4: string;
      carrierId: bigint;
      trackingNumber: string;
      productName: string;
      viewableUntil: Date;
      deleteAt: Date;
    }> = [];
    const errors: Array<{ row: number; message: string }> = [];

    rows.forEach((row, index) => {
      const rowNum = index + 2; // 헤더 제외, 1-based

      if (!row['수취인명']) {
        errors.push({ row: rowNum, message: '수취인명 누락' });
        return;
      }
      if (!row['전화번호']) {
        errors.push({ row: rowNum, message: '전화번호 누락' });
        return;
      }
      if (!row['택배사명']) {
        errors.push({ row: rowNum, message: '택배사명 누락' });
        return;
      }
      if (!row['운송장번호']) {
        errors.push({ row: rowNum, message: '운송장번호 누락' });
        return;
      }

      const carrierId = carrierMap.get(row['택배사명']);
      if (!carrierId) {
        errors.push({ row: rowNum, message: `택배사 '${row['택배사명']}'를 찾을 수 없음` });
        return;
      }

      const { full, last4 } = normalizePhone(row['전화번호']);

      validData.push({
        recipientName: row['수취인명'],
        recipientPhoneFull: full,
        recipientPhoneLast4: last4,
        carrierId,
        trackingNumber: String(row['운송장번호']),
        productName: row['상품명'] || '',
        viewableUntil: addDays(now, 5),
        deleteAt: addDays(now, 14),
      });
    });

    // 유효한 데이터 일괄 삽입
    if (validData.length > 0) {
      await prisma.shipment.createMany({
        data: validData,
      });
    }

    return NextResponse.json({
      success: true,
      totalRows: rows.length,
      successCount: validData.length,
      errorCount: errors.length,
      errors: errors.slice(0, 10), // 최대 10개 오류만 반환
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ error: '업로드 처리 중 오류가 발생했습니다' }, { status: 500 });
  }
}
