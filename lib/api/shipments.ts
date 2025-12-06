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

// 공통 에러 처리 함수
async function handleResponse<T>(res: Response, defaultError: string): Promise<T> {
  if (!res.ok) {
    let errorMessage = defaultError;
    try {
      const data = await res.json();
      errorMessage = data.error || defaultError;
    } catch {
      // JSON 파싱 실패 시 기본 에러 메시지 사용
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

// 사용자 배송 조회
export async function searchShipments(
  recipientName: string,
  phoneLast4: string
): Promise<SearchShipmentsResponse> {
  try {
    const res = await fetch('/api/shipments/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientName, phoneLast4 }),
    });

    return handleResponse<SearchShipmentsResponse>(res, '조회 중 오류가 발생했습니다');
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 관리자 배송 목록 조회
export async function getAdminShipments(
  page = 1,
  limit = 20,
  search = ''
): Promise<AdminShipmentsResponse> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
    });

    const res = await fetch(`/api/admin/shipments?${params}`, {
      credentials: 'include',
    });

    return handleResponse<AdminShipmentsResponse>(res, '목록 조회 중 오류가 발생했습니다');
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 관리자 배송 등록
export async function createShipment(data: CreateShipmentData): Promise<{ shipment: Shipment }> {
  try {
    const res = await fetch('/api/admin/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<{ shipment: Shipment }>(res, '등록 중 오류가 발생했습니다');
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 관리자 배송 수정
export async function updateShipment(
  id: string,
  data: UpdateShipmentData
): Promise<{ shipment: Shipment }> {
  try {
    const res = await fetch(`/api/admin/shipments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    return handleResponse<{ shipment: Shipment }>(res, '수정 중 오류가 발생했습니다');
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 관리자 배송 삭제
export async function deleteShipment(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`/api/admin/shipments/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    return handleResponse<{ success: boolean; message: string }>(res, '삭제 중 오류가 발생했습니다');
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 관리자 엑셀 대량 업로드
export async function bulkUploadShipments(file: File): Promise<BulkUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/shipments/bulk-upload', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    return handleResponse<BulkUploadResponse>(res, '업로드 중 오류가 발생했습니다');
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}
