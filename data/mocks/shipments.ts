import { Shipment } from '@/types';

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    created_at: new Date().toISOString(),
    recipient_name: '홍길동',
    recipient_phone_full: '01012345678',
    recipient_phone_last4: '5678',
    carrier_id: 1,
    tracking_number: '1234567890',
    product_name: '맛있는 사과 5kg',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    created_at: new Date().toISOString(),
    recipient_name: '김철수',
    recipient_phone_full: '01098765432',
    recipient_phone_last4: '5432',
    carrier_id: 2,
    tracking_number: '0987654321',
    product_name: '최신형 노트북',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    created_at: new Date().toISOString(),
    recipient_name: '이영희',
    recipient_phone_full: '01011112222',
    recipient_phone_last4: '2222',
    carrier_id: 1,
    tracking_number: '1122334455',
    product_name: '겨울용 패딩 점퍼',
  },
];

export const MOCK_CARRIERS = [
  { id: 1, name: 'CJ대한통운', base_url: 'https://www.cjlogistics.com/ko/tool/parcel/tracking?gnrlInvoiceNum=' },
  { id: 2, name: '우체국택배', base_url: 'https://service.epost.go.kr/trace.RetrieveDomRgiTraceList.comm?sid1=' },
];
