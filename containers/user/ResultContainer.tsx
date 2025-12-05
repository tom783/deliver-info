'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ResultView } from '@/views/user/ResultView';
import { MOCK_SHIPMENTS, MOCK_CARRIERS } from '@/data/mocks/shipments';
import { Shipment } from '@/types';

export const ResultContainer = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || '';
  const phone = searchParams.get('phone') || '';
  
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const filtered = MOCK_SHIPMENTS.filter(
        (s) =>
          s.recipient_name === name &&
          s.recipient_phone_last4 === phone
      );
      
      setShipments(filtered);
      setIsLoading(false);
    };

    if (name && phone) {
      fetchShipments();
    } else {
      setIsLoading(false);
    }
  }, [name, phone]);

  return (
    <ResultView
      shipments={shipments}
      carriers={MOCK_CARRIERS}
      isLoading={isLoading}
      searchParams={{ name, phone }}
    />
  );
};
