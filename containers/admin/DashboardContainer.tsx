'use client';

import { useEffect } from 'react';
import { DashboardView } from '@/views/admin/DashboardView';
import { useStats } from '@/hooks/queries';
import { toast } from 'sonner';

export const DashboardContainer = () => {
  const { data, isLoading, error } = useStats();

  useEffect(() => {
    if (error) {
      toast.error('통계 데이터를 불러오는데 실패했습니다');
    }
  }, [error]);

  const stats = data ?? {
    totalShipments: 0,
    todayShipments: 0,
    viewableShipments: 0,
  };

  return <DashboardView stats={stats} isLoading={isLoading} />;
};
