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
import { Carrier, Shipment } from '@/types';
import { updateShipment } from '@/lib/api/shipments';

interface EditDeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipment: Shipment | null;
  carriers: Carrier[];
  onSuccess?: () => void;
}

export const EditDeliveryDialog: React.FC<EditDeliveryDialogProps> = ({
  open,
  onOpenChange,
  shipment,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      if (shipment) {
        setFormData({
          recipientName: shipment.recipient_name,
          phone: shipment.recipient_phone_full,
          carrierId: shipment.carrier_id.toString(),
          trackingNumber: shipment.tracking_number,
          productName: shipment.product_name,
        });
      }
    }
  }, [shipment, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment) return;

    setIsSubmitting(true);

    try {
      await updateShipment(shipment.id, {
        recipientName: formData.recipientName,
        phone: formData.phone,
        carrierId: parseInt(formData.carrierId, 10),
        trackingNumber: formData.trackingNumber,
        productName: formData.productName,
      });

      toast.success('배송 정보가 수정되었습니다.');
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      console.error('Update shipment error:', err);
      setError(err instanceof Error ? err.message : '수정 중 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>배송 정보 수정</DialogTitle>
          <DialogDescription>등록된 배송 정보를 수정합니다.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-recipientName" className="text-right">
              수취인명
            </Label>
            <Input
              id="edit-recipientName"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-phone" className="text-right">
              전화번호
            </Label>
            <Input
              id="edit-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-carrierId" className="text-right">
              택배사
            </Label>
            <select
              id="edit-carrierId"
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
            <Label htmlFor="edit-trackingNumber" className="text-right">
              운송장번호
            </Label>
            <Input
              id="edit-trackingNumber"
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-productName" className="text-right">
              상품명
            </Label>
            <Input
              id="edit-productName"
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '수정 중...' : '수정'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
