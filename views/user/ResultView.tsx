import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shipment, Carrier } from '@/types';
import { Copy, ExternalLink, Package } from 'lucide-react';
import { toast } from 'sonner';

interface ResultViewProps {
  shipments: Shipment[];
  carriers: Carrier[];
  isLoading: boolean;
  error?: string | null;
  searchParams: { name: string; phone: string };
}

export const ResultView: React.FC<ResultViewProps> = ({
  shipments,
  carriers,
  isLoading,
  error,
  searchParams,
}) => {
  const getCarrier = (id: number) => carriers.find((c) => c.id === id);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('운송장 번호가 복사되었습니다.');
  };

  const handleTrack = (carrier: Carrier | undefined, trackingNumber: string) => {
    if (!carrier) return;
    window.open(`${carrier.base_url}${trackingNumber}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-lg text-gray-600">배송 정보를 조회하고 있습니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <Card className="border-none shadow-sm max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
            <Package className="w-12 h-12 text-red-300" />
            <p className="text-red-500 text-center">{error}</p>
            <Button variant="outline" onClick={() => window.history.back()}>
              다시 조회하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-4">
        <header className="py-4">
          <h1 className="text-2xl font-bold text-gray-900">조회 결과</h1>
          <p className="text-gray-500">
            {searchParams.name}님 ({searchParams.phone})의 배송 정보입니다.
          </p>
        </header>

        {shipments.length === 0 ? (
          <Card className="border-none shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
              <Package className="w-12 h-12 text-gray-300" />
              <p className="text-gray-500">조회된 배송 정보가 없습니다.</p>
              <Button variant="outline" onClick={() => window.history.back()}>
                다시 조회하기
              </Button>
            </CardContent>
          </Card>
        ) : (
          shipments.map((shipment) => {
            const carrier = getCarrier(shipment.carrier_id);
            return (
              <Card key={shipment.id} className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-white border-b pb-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-sm font-medium">
                      {carrier?.name || '택배사 미상'}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {new Date(shipment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-2">{shipment.product_name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <span className="font-mono text-lg font-bold text-gray-800">
                      {shipment.tracking_number}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(shipment.tracking_number)}
                      className="h-8 px-2"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      복사
                    </Button>
                  </div>
                  <Button
                    className="w-full bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold"
                    onClick={() => handleTrack(carrier, shipment.tracking_number)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    배송 조회하기
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
