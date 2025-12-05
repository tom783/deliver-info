export interface Carrier {
  id: number;
  name: string;
  base_url: string;
}

export interface Shipment {
  id: string; // UUID
  created_at: string; // ISO string
  recipient_name: string;
  recipient_phone_full: string;
  recipient_phone_last4: string;
  carrier_id: number;
  tracking_number: string;
  product_name: string;
}

export type UserRole = 'master' | 'sub_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}
