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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Carrier } from '@/types';
import { useCreateShipment } from '@/hooks/queries';

interface ManualRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carriers: Carrier[];
  onSuccess?: () => void;
}

export const ManualRegistrationDialog: React.FC<ManualRegistrationDialogProps> = ({
  open,
  onOpenChange,
  carriers,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    carrierId: '',
    trackingNumber: '',
    productName: '',
  });
  const [error, setError] = useState<string | null>(null);

  const createShipmentMutation = useCreateShipment();

  useEffect(() => {
    if (open) {
      setError(null);
      setFormData({
        recipientName: '',
        phone: '',
        carrierId: '',
        trackingNumber: '',
        productName: '',
      });
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 클라이언트 유효성 검사
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      setError('전화번호는 10-11자리 숫자여야 합니다');
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(formData.trackingNumber)) {
      setError('운송장번호는 영문과 숫자만 입력 가능합니다');
      return;
    }

    try {
      await createShipmentMutation.mutateAsync({
        recipientName: formData.recipientName,
        phone: formData.phone,
        carrierId: parseInt(formData.carrierId, 10),
        trackingNumber: formData.trackingNumber,
        productName: formData.productName,
      });

      toast.success('배송 정보가 등록되었습니다.');
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error('Create shipment error:', err);
      setError(err instanceof Error ? err.message : '등록 중 오류가 발생했습니다');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>배송 정보 개별 등록</DialogTitle>
          <DialogDescription>
            새로운 배송 정보를 수동으로 입력하여 등록합니다.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recipientName" className="text-right">
              수취인명
            </Label>
            <Input
              id="recipientName"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              전화번호
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="carrierId" className="text-right">
              택배사
            </Label>
            <select
              id="carrierId"
              name="carrierId"
              value={formData.carrierId}
              onChange={handleChange}
              className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="" disabled>
                선택해주세요
              </option>
              {carriers.map((carrier) => (
                <option key={carrier.id} value={carrier.id}>
                  {carrier.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="trackingNumber" className="text-right">
              운송장번호
            </Label>
            <Input
              id="trackingNumber"
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="productName" className="text-right">
              상품명
            </Label>
            <Input
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={createShipmentMutation.isPending}>
              {createShipmentMutation.isPending ? '등록 중...' : '등록'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
