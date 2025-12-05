'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ResultView } from '@/views/user/ResultView';
import { searchShipments } from '@/lib/api/shipments';
import { Shipment, Carrier } from '@/types';

export const ResultContainer = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';
  const phone = searchParams.get('phone') || '';

  const [shipments, setShipments] = useState<(Shipment & { carrier: Carrier })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await searchShipments(name, phone);
        setShipments(data.shipments);
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : '조회 중 오류가 발생했습니다');
        setShipments([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (name && phone) {
      fetchShipments();
    } else {
      setIsLoading(false);
    }
  }, [name, phone]);

  // carrier 정보를 shipments에서 추출
  const carriers = shipments.map((s) => s.carrier).filter(
    (carrier, index, self) => self.findIndex((c) => c.id === carrier.id) === index
  );

  return (
    <ResultView
      shipments={shipments}
      carriers={carriers}
      isLoading={isLoading}
      error={error}
      searchParams={{ name, phone }}
    />
  );
};
