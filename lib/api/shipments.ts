import { Shipment, Carrier } from '@/types';

interface SearchShipmentsResponse {
  shipments: (Shipment & { carrier: Carrier })[];
}

interface AdminShipmentsResponse {
  shipments: (Shipment & { carrier: Carrier })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CreateShipmentData {
  recipientName: string;
  phone: string;
  carrierId: number;
  trackingNumber: string;
  productName: string;
}

interface UpdateShipmentData {
  recipientName?: string;
  phone?: string;
  carrierId?: number;
  trackingNumber?: string;
  productName?: string;
}

interface BulkUploadResponse {
  success: boolean;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{ row: number; message: string }>;
}

// 사용자 배송 조회
export async function searchShipments(
  recipientName: string,
  phoneLast4: string
): Promise<SearchShipmentsResponse> {
  const res = await fetch('/api/shipments/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipientName, phoneLast4 }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '조회 중 오류가 발생했습니다');
  }

  return res.json();
}

// 관리자 배송 목록 조회
export async function getAdminShipments(
  page = 1,
  limit = 20,
  search = ''
): Promise<AdminShipmentsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search && { search }),
  });

  const res = await fetch(`/api/admin/shipments?${params}`);

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '목록 조회 중 오류가 발생했습니다');
  }

  return res.json();
}

// 관리자 배송 등록
export async function createShipment(data: CreateShipmentData): Promise<{ shipment: Shipment }> {
  const res = await fetch('/api/admin/shipments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const resData = await res.json();
    throw new Error(resData.error || '등록 중 오류가 발생했습니다');
  }

  return res.json();
}

// 관리자 배송 수정
export async function updateShipment(
  id: string,
  data: UpdateShipmentData
): Promise<{ shipment: Shipment }> {
  const res = await fetch(`/api/admin/shipments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const resData = await res.json();
    throw new Error(resData.error || '수정 중 오류가 발생했습니다');
  }

  return res.json();
}

// 관리자 배송 삭제
export async function deleteShipment(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`/api/admin/shipments/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '삭제 중 오류가 발생했습니다');
  }

  return res.json();
}

// 관리자 엑셀 대량 업로드
export async function bulkUploadShipments(file: File): Promise<BulkUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/admin/shipments/bulk-upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '업로드 중 오류가 발생했습니다');
  }

  return res.json();
}
