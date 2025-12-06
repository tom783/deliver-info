interface StatsResponse {
  totalShipments: number;
  todayShipments: number;
  viewableShipments: number;
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

// 대시보드 통계 조회
export async function getStats(): Promise<StatsResponse> {
  try {
    const res = await fetch('/api/admin/stats', {
      credentials: 'include',
    });

    return handleResponse<StatsResponse>(res, '통계 조회 중 오류가 발생했습니다');
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
}
