import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { useBulkUploadShipments } from '@/hooks/queries';

interface ExcelUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ExcelUploadDialog: React.FC<ExcelUploadDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bulkUploadMutation = useBulkUploadShipments();

  useEffect(() => {
    if (open) {
      setFile(null);
      setError(null);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    setError(null);

    if (!file) {
      setError('파일을 선택해주세요');
      return;
    }

    try {
      const result = await bulkUploadMutation.mutateAsync(file);

      if (result.errorCount > 0) {
        toast.warning(
          `${result.successCount}건 업로드 완료, ${result.errorCount}건 실패`
        );
      } else {
        toast.success(`${result.successCount}건 업로드가 완료되었습니다.`);
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다');
    }
  };

  const handleDownloadTemplate = () => {
    const headers = ['수취인명', '전화번호', '택배사명', '운송장번호', '상품명'];
    const sampleData = [
      {
        수취인명: '홍길동',
        전화번호: '010-1234-5678',
        택배사명: 'CJ대한통운',
        운송장번호: '1234567890',
        상품명: '사과 5kg',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData, { header: headers });

    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 }, // 수취인명
      { wch: 20 }, // 전화번호
      { wch: 15 }, // 택배사명
      { wch: 20 }, // 운송장번호
      { wch: 30 }, // 상품명
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '배송정보_양식');

    XLSX.writeFile(workbook, '배송정보_업로드_양식.xlsx');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>엑셀 업로드</DialogTitle>
          <DialogDescription>
            배송 정보가 담긴 엑셀 파일을 업로드해주세요.
            <Button
              variant="link"
              className="px-0 ml-2 text-blue-600 h-auto font-normal"
              onClick={handleDownloadTemplate}
            >
              양식 다운로드
            </Button>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".xlsx, .xls"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            {file ? (
              <div className="text-center">
                <FileSpreadsheet className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">
                  클릭하거나 파일을 드래그하세요
                </p>
                <p className="text-xs text-gray-500">.xlsx, .xls 파일만 지원</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleUpload} disabled={!file || bulkUploadMutation.isPending}>
            {bulkUploadMutation.isPending ? '업로드 중...' : '업로드'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
