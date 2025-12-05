'use client';

import React, { useState, useEffect } from 'react';
import { DashboardView } from '@/views/admin/DashboardView';
import { getStats } from '@/lib/api/stats';
import { toast } from 'sonner';

export const DashboardContainer = () => {
  const [stats, setStats] = useState({
    totalShipments: 0,
    todayShipments: 0,
    viewableShipments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error('Fetch stats error:', error);
        toast.error('통계 데이터를 불러오는데 실패했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return <DashboardView stats={stats} isLoading={isLoading} />;
};
