import type { ApiResponse } from '@/types/common/common';
import { ShipmentStatus } from '@/types/order/order';
import { apiClient } from '@/utils/api';

export interface ShippingFeeRequest {
  city: string;
  province: string;
  weight: number;
  orderValue: number;
}

export interface CreateShipmentRequest {
  orderId: string;
  orderNumber: string;
  recipientName: string;
  phone: string;
  address: string;
  shippingFee: number;
  codAmount: number;
  estimatedDays: number;
  note?: string;
}

/** PUT /api/shipping/{id}/status */
export interface UpdateShipmentStatusRequest {
  status: ShipmentStatus;
}

/** PUT /api/shipping/{id}/deliver */
export interface DeliverShipmentRequest {
  deliveredAt?: string;
  signature?: string;
}


/** Response from POST /api/shipping/calculate-fee */
export interface ShippingFeeResponse {
  shippingFee: number;    // VND
  estimatedDays: number;
}

/** Response from POST /api/shipping/create and GET /api/shipping/{id} */
export interface ShipmentResponse {
  shipmentId?: number;
  id?: number;
  shipmentNumber?: string;
  orderId: string;
  orderNumber: string;
  status: ShipmentStatus;
  shippingFee: number;
  codAmount: number;
  recipientName?: string;
  recipientPhone?: string;
  address?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt?: string;
}

/** @deprecated Use ShippingFeeRequest */
export type ShippingFeeRequestLegacy = ShippingFeeRequest;
/** @deprecated Use ShippingFeeResponse */
export type ShippingFeeResponseLegacy = ShippingFeeResponse;
/** @deprecated Use ShipmentResponse */
export interface Shipment {
  id: string;
  trackingNumber: string;
  provider: 'GHN' | 'GHTK';
  status: ShipmentStatus | 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  currentLocation: string;
  estimatedDelivery: string;
}

export const shippingService = {

  calculateFee: async (payload: ShippingFeeRequest): Promise<ApiResponse<ShippingFeeResponse>> => {
    const raw = await apiClient.post<unknown>('/shipping/calculate-fee', payload);
    return normalizeShippingFeeResp(raw);
  },

  createShipment: async (payload: CreateShipmentRequest): Promise<ApiResponse<ShipmentResponse>> => {
    const raw = await apiClient.post<unknown>('/shipping/create', payload);
    return normalizeShipmentResp(raw);
  },

  getShipmentById: async (id: number | string): Promise<ApiResponse<ShipmentResponse>> => {
    const raw = await apiClient.get<unknown>(`/shipping/${id}`);
    return normalizeShipmentResp(raw);
  },

  updateShipmentStatus: async (
    id: number | string,
    payload: UpdateShipmentStatusRequest
  ): Promise<ApiResponse<ShipmentResponse>> => {
    const raw = await apiClient.put<unknown>(`/shipping/${id}/status`, payload);
    return normalizeShipmentResp(raw);
  },

  confirmDelivery: async (
    id: number | string,
    payload?: DeliverShipmentRequest
  ): Promise<ApiResponse<ShipmentResponse>> => {
    const raw = await apiClient.put<unknown>(`/shipping/${id}/deliver`, payload ?? {});
    return normalizeShipmentResp(raw);
  },

  getShipmentByOrder: async (orderId: string): Promise<ApiResponse<ShipmentResponse>> => {
    const raw = await apiClient.get<unknown>(`/shipping/order/${orderId}`);
    return normalizeShipmentResp(raw);
  },

  trackShipment: async (trackingNumber: string): Promise<ApiResponse<Shipment>> => {
    const raw = await apiClient.get<unknown>(`/shipping/track/${trackingNumber}`);
    return normalizeTrackResp(raw);
  },
};

function normalizeShipmentResp(raw: unknown): ApiResponse<ShipmentResponse> {
  const r = raw as Record<string, unknown>;
  if (typeof r.success === 'boolean') return raw as ApiResponse<ShipmentResponse>;
  return {
    success: true,
    data: raw as ShipmentResponse,
    error: null,
    message: null,
    timestamp: new Date().toISOString(),
  };
}

function normalizeShippingFeeResp(raw: unknown): ApiResponse<ShippingFeeResponse> {
  const r = raw as Record<string, unknown>;
  if (typeof r.success === 'boolean') return raw as ApiResponse<ShippingFeeResponse>;
  return {
    success: true,
    data: raw as ShippingFeeResponse,
    error: null,
    message: null,
    timestamp: new Date().toISOString(),
  };
}

function normalizeTrackResp(raw: unknown): ApiResponse<Shipment> {
  const r = raw as Record<string, unknown>;
  if (typeof r.success === 'boolean') return raw as ApiResponse<Shipment>;
  return {
    success: true,
    data: raw as Shipment,
    error: null,
    message: null,
    timestamp: new Date().toISOString(),
  };
}
