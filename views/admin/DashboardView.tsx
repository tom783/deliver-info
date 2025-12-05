import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload } from 'lucide-react';

export const DashboardView = () => {
  return (
    <div className="p-8">
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
    </div>
  );
};
