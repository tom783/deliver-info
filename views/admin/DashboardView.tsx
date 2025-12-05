import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, Eye } from 'lucide-react';

interface DashboardViewProps {
  stats: {
    totalShipments: number;
    todayShipments: number;
    viewableShipments: number;
  };
  isLoading?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ stats, isLoading }) => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">대시보드</h2>
        <p className="text-gray-500">배송 정보 현황을 한눈에 확인하세요.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">전체 배송 건수</CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalShipments.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">오늘 등록된 건수</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold">{stats.todayShipments.toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">조회 가능 건수</CardTitle>
            <Eye className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
            ) : (
              <div className="text-2xl font-bold">{stats.viewableShipments.toLocaleString()}</div>
            )}
            <p className="text-xs text-gray-400 mt-1">등록 후 5일 이내</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
