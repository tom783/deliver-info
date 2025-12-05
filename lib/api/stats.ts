interface StatsResponse {
  totalShipments: number;
  todayShipments: number;
  viewableShipments: number;
}

// 대시보드 통계 조회
export async function getStats(): Promise<StatsResponse> {
  const res = await fetch('/api/admin/stats', {
    credentials: 'include',
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || '통계 조회 중 오류가 발생했습니다');
  }

  return res.json();
}
