import type {
  Shipment,
  ShippingFeeRequest,
  ShippingFeeResponse,
} from '@/services/shipping/shippingService';

export const MOCK_SHIPPING_FEE_REQUEST: ShippingFeeRequest = {
  fromAddress: {
    province: 'Ha Noi',
    district: 'Cau Giay',
  },
  toAddress: {
    province: 'Ho Chi Minh City',
    district: 'District 1',
  },
  weight: 1200,
  provider: 'GHN',
};

export const MOCK_SHIPPING_FEE_RESPONSE: ShippingFeeResponse = {
  fee: 32000,
  estimatedDays: 3,
};

export const MOCK_SHIPMENT: Shipment = {
  id: 'ship-1',
  trackingNumber: 'GHN123456789VN',
  provider: 'GHN',
  status: 'IN_TRANSIT',
  currentLocation: 'Da Nang Sorting Center',
  estimatedDelivery: '2026-03-18T10:00:00Z',
};
