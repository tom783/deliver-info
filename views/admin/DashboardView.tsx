import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Package, Users, Settings } from 'lucide-react';

export const DashboardView = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">Delivery Admin</h1>
        </div>
        <nav className="space-y-1 px-3">
          <Button
            variant="ghost"
            className="w-full justify-start font-medium bg-gray-100"
            onClick={() => window.location.href = '/admin/delivery'}
          >
            <Package className="w-5 h-5 mr-3" />
            배송 관리
          </Button>
          <Button variant="ghost" className="w-full justify-start font-medium text-gray-600">
            <Users className="w-5 h-5 mr-3" />
            사용자 관리
          </Button>
          <Button variant="ghost" className="w-full justify-start font-medium text-gray-600">
            <Settings className="w-5 h-5 mr-3" />
            설정
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">배송 목록</h2>
          <Button className="bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold">
            <Upload className="w-4 h-4 mr-2" />
            엑셀 업로드
          </Button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">전체 배송 건수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">오늘 등록된 건수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">56</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">조회 완료 건수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">892</div>
            </CardContent>
          </Card>
        </div>

        {/* Table Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>최근 등록 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>등록일시</TableHead>
                  <TableHead>수취인</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>택배사</TableHead>
                  <TableHead>운송장번호</TableHead>
                  <TableHead>상품명</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                    데이터를 불러오는 중입니다... (Skeleton)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
