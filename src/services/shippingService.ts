import { API_ENDPOINTS } from '@/constants';
import type { ApiResponse } from '@/types/common';
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
  calculateFee: async (payload: ShippingFeeRequest): Promise<ShippingFeeResponse> => {
    const response = await apiClient.post<ApiResponse<ShippingFeeResponse>>(
      API_ENDPOINTS.SHIPPING.CALCULATE_FEE,
      payload
    );
    return response.data;
  },

  getShipmentByOrder: async (orderId: string): Promise<Shipment> => {
    const response = await apiClient.get<ApiResponse<Shipment>>(
      API_ENDPOINTS.SHIPPING.BY_ORDER(orderId)
    );
    return response.data;
  },

  trackShipment: async (trackingNumber: string): Promise<Shipment> => {
    const response = await apiClient.get<ApiResponse<Shipment>>(
      API_ENDPOINTS.SHIPPING.TRACK(trackingNumber)
    );
    return response.data;
  },
};
