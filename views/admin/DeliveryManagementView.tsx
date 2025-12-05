import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shipment, Carrier } from '@/types';
import { Search, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { ExcelUploadDialog } from '@/components/admin/ExcelUploadDialog';
import { ManualRegistrationDialog } from '@/components/admin/ManualRegistrationDialog';
import { EditDeliveryDialog } from '@/components/admin/EditDeliveryDialog';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

interface DeliveryManagementViewProps {
  shipments: Shipment[];
  carriers: Carrier[];
  searchTerm: string;
  isLoading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploadDialogOpen: boolean;
  setIsUploadDialogOpen: (open: boolean) => void;
  isManualRegisterDialogOpen: boolean;
  setIsManualRegisterDialogOpen: (open: boolean) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedShipment: Shipment | null;
  onEditClick: (shipment: Shipment) => void;
  onDeleteClick: (shipment: Shipment) => void;
  onDeleteConfirm: () => void;
  onSuccess?: () => void;
}

export const DeliveryManagementView: React.FC<DeliveryManagementViewProps> = ({
  shipments,
  carriers,
  searchTerm,
  isLoading,
  pagination,
  onSearchChange,
  isUploadDialogOpen,
  setIsUploadDialogOpen,
  isManualRegisterDialogOpen,
  setIsManualRegisterDialogOpen,
  isEditOpen,
  setIsEditOpen,
  isDeleteOpen,
  setIsDeleteOpen,
  selectedShipment,
  onEditClick,
  onDeleteClick,
  onDeleteConfirm,
  onSuccess,
}) => {
  const getCarrierName = (id: number) => {
    return carriers.find((c) => c.id === id)?.name || 'Unknown';
  };

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">배송 관리!!</h1>
          <p className="text-gray-500">등록된 배송 정보를 조회하고 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsManualRegisterDialogOpen(true)}
          >
            개별 등록
          </Button>
          <Button
            className="bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            엑셀 업로드
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        <div className="flex items-center gap-2 max-w-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="이름, 전화번호, 운송장번호 검색"
            value={searchTerm}
            onChange={onSearchChange}
            className="border-none shadow-none focus-visible:ring-0 pl-0"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>등록일시</TableHead>
              <TableHead>수취인</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>택배사</TableHead>
              <TableHead>운송장번호</TableHead>
              <TableHead>상품명</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="text-gray-500">
                    {new Date(shipment.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{shipment.recipient_name}</TableCell>
                  <TableCell>{shipment.recipient_phone_full}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCarrierName(shipment.carrier_id)}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{shipment.tracking_number}</TableCell>
                  <TableCell>{shipment.product_name}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => onEditClick(shipment)}
                          className="cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeleteClick(shipment)}
                          className="text-red-600 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination UI (Mock) */}
        <div className="flex items-center justify-end space-x-2 p-4 border-t">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>
          <Button variant="outline" size="sm" disabled>
            다음
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ExcelUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onSuccess={onSuccess}
      />

      <ManualRegistrationDialog
        open={isManualRegisterDialogOpen}
        onOpenChange={setIsManualRegisterDialogOpen}
        carriers={carriers}
        onSuccess={onSuccess}
      />

      <EditDeliveryDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        shipment={selectedShipment}
        carriers={carriers}
        onSuccess={onSuccess}
      />

      <DeleteConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={onDeleteConfirm}
      />
    </div>
  );
};
