import { Carrier } from '@/types';

interface CarriersResponse {
  carriers: Carrier[];
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

// 택배사 목록 조회
export async function getCarriers(): Promise<CarriersResponse> {
  try {
    const res = await fetch('/api/admin/carriers', {
      credentials: 'include',
    });

    return handleResponse<CarriersResponse>(res, '택배사 목록 조회 중 오류가 발생했습니다');
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}
