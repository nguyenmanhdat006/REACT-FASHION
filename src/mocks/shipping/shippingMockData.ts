import type {
  ShipmentResponse,
  ShippingFeeRequest,
  ShippingFeeResponse,
} from '@/services/shipping/shippingService';
import { ShipmentStatus } from '@/types/order/order';

export const MOCK_SHIPPING_FEE_REQUEST: ShippingFeeRequest = {
  city: 'Ho Chi Minh',
  province: 'Ho Chi Minh',
  weight: 1500,
  orderValue: 500000,
};

export const MOCK_SHIPPING_FEE_RESPONSE: ShippingFeeResponse = {
  shippingFee: 30000,
  estimatedDays: 2,
};

export const MOCK_SHIPMENT_RESPONSE: ShipmentResponse = {
  shipmentId: 1,
  shipmentNumber: 'SHIP-20260516-0001',
  orderId: '550e8400-e29b-41d4-a716-446655440000',
  orderNumber: 'ORD-20260516-0001',
  status: ShipmentStatus.IN_TRANSIT,
  shippingFee: 30000,
  codAmount: 0,
  recipientName: 'Nguyen Van A',
  recipientPhone: '0901234567',
  address: '123 Le Loi, Q1, HCM',
  estimatedDelivery: '2026-05-18T09:00:00',
  createdAt: '2026-05-16T09:00:00',
  updatedAt: '2026-05-16T12:00:00',
};

// ─── Legacy aliases for mock handler compatibility ────────────────────────────

/** @deprecated Use MOCK_SHIPMENT_RESPONSE */
export const MOCK_SHIPMENT = {
  id: 'ship-1',
  trackingNumber: 'SHIP-20260516-0001',
  provider: 'GHN' as const,
  status: ShipmentStatus.IN_TRANSIT,
  currentLocation: 'HCM Sorting Center',
  estimatedDelivery: '2026-05-18T10:00:00Z',
};
