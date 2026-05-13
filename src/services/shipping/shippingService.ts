import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse } from '@/types/common/common';
import apiClient from '@/utils/api';

export interface ShippingFeeRequest {
  fromAddress: {
    province: string;
    district: string;
  };
  toAddress: {
    province: string;
    district: string;
  };
  weight: number;
  provider: 'GHN' | 'GHTK';
}

export interface ShippingFeeResponse {
  fee: number;
  estimatedDays: number;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  provider: 'GHN' | 'GHTK';
  status: 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  currentLocation: string;
  estimatedDelivery: string;
}

export const shippingService = {
  calculateFee: (
    payload: ShippingFeeRequest
  ): Promise<ApiResponse<ShippingFeeResponse>> =>
    apiClient.post<ApiResponse<ShippingFeeResponse>>(
      API_ENDPOINTS.SHIPPING.CALCULATE_FEE,
      payload
    ),

  getShipmentByOrder: (orderId: string): Promise<ApiResponse<Shipment>> =>
    apiClient.get<ApiResponse<Shipment>>(API_ENDPOINTS.SHIPPING.BY_ORDER(orderId)),

  trackShipment: (trackingNumber: string): Promise<ApiResponse<Shipment>> =>
    apiClient.get<ApiResponse<Shipment>>(API_ENDPOINTS.SHIPPING.TRACK(trackingNumber)),
};
