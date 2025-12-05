import { Carrier } from '@/types';

interface CarriersResponse {
  carriers: Carrier[];
}

// 택배사 목록 조회
export async function getCarriers(): Promise<CarriersResponse> {
  const res = await fetch('/api/admin/carriers');

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '택배사 목록 조회 중 오류가 발생했습니다');
  }

  return res.json();
}
