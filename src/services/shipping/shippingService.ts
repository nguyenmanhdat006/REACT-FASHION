/**
 * Shipping Service client — port 8088
 *
 * The Vite dev proxy maps /shipping-api/** → http://localhost:8088/api/**
 * In production set VITE_SHIPPING_BASE_URL.
 *
 * NOTE: Shipping Service does NOT require Auth headers.
 */
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { SHIPPING_BASE_URL } from '@/constants';
import type { ApiResponse } from '@/types/common/common';
import { ShipmentStatus } from '@/types/order/order';

// ─── Request types ───────────────────────────────────────────────────────────

/**
 * POST /api/shipping/calculate-fee
 * FE can call this to preview shipping cost before placing an order.
 */
export interface ShippingFeeRequest {
  city: string;       // e.g. "Ho Chi Minh"
  province: string;   // e.g. "Ho Chi Minh"
  weight: number;     // grams ≥ 1
  orderValue: number; // VND ≥ 0
}

/**
 * POST /api/shipping/create
 * Called after order is CONFIRMED and admin prepares shipment.
 */
export interface CreateShipmentRequest {
  orderId: string;          // UUID
  orderNumber: string;      // e.g. "ORD-20260516-0001"
  recipientName: string;
  phone: string;            // VN format: 0xx or +84xx
  address: string;          // full street address
  shippingFee: number;      // VND ≥ 0
  codAmount: number;        // VND ≥ 0 (0 if already paid online)
  estimatedDays: number;    // ≥ 1
  note?: string;
}

/** PUT /api/shipping/{id}/status */
export interface UpdateShipmentStatusRequest {
  status: ShipmentStatus;
}

/** PUT /api/shipping/{id}/deliver */
export interface DeliverShipmentRequest {
  deliveredAt?: string; // LocalDateTime (null = now)
  signature?: string;   // recipient's signature
}

// ─── Response types ──────────────────────────────────────────────────────────

/** Response from POST /api/shipping/calculate-fee */
export interface ShippingFeeResponse {
  shippingFee: number;    // VND
  estimatedDays: number;
}

/** Response from POST /api/shipping/create and GET /api/shipping/{id} */
export interface ShipmentResponse {
  shipmentId?: number;
  id?: number;            // alias — some endpoints use 'id'
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

// ─── Legacy aliases kept for mock compatibility ───────────────────────────────

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

// ─── API Client ───────────────────────────────────────────────────────────────

class ShippingApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: SHIPPING_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get<T, AxiosResponse<T>>(url, config).then(r => r.data);
  }

  public async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post<T, AxiosResponse<T>>(url, data, config).then(r => r.data);
  }

  public async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put<T, AxiosResponse<T>>(url, data, config).then(r => r.data);
  }
}

const shippingApiClient = new ShippingApiClient();

export const shippingService = {
  /**
   * POST /api/shipping/calculate-fee
   * Preview shipping cost before placing order.
   */
  calculateFee: (payload: ShippingFeeRequest): Promise<ApiResponse<ShippingFeeResponse>> =>
    shippingApiClient.post<ApiResponse<ShippingFeeResponse>>('/shipping/calculate-fee', payload),

  /**
   * POST /api/shipping/create
   * Create a shipment after order is CONFIRMED.
   */
  createShipment: (payload: CreateShipmentRequest): Promise<ApiResponse<ShipmentResponse>> =>
    shippingApiClient.post<ApiResponse<ShipmentResponse>>('/shipping/create', payload),

  /**
   * GET /api/shipping/{id}
   * Get shipment details by numeric ID.
   */
  getShipmentById: (id: number | string): Promise<ApiResponse<ShipmentResponse>> =>
    shippingApiClient.get<ApiResponse<ShipmentResponse>>(`/shipping/${id}`),

  /**
   * PUT /api/shipping/{id}/status
   * Update shipment status (PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY …).
   */
  updateShipmentStatus: (
    id: number | string,
    payload: UpdateShipmentStatusRequest
  ): Promise<ApiResponse<ShipmentResponse>> =>
    shippingApiClient.put<ApiResponse<ShipmentResponse>>(`/shipping/${id}/status`, payload),

  /**
   * PUT /api/shipping/{id}/deliver
   * Confirm successful delivery.
   */
  confirmDelivery: (
    id: number | string,
    payload?: DeliverShipmentRequest
  ): Promise<ApiResponse<ShipmentResponse>> =>
    shippingApiClient.put<ApiResponse<ShipmentResponse>>(`/shipping/${id}/deliver`, payload ?? {}),

  // ─── Legacy / fallback methods ────────────────────────────────────────────
  /** @deprecated Use getShipmentById */
  getShipmentByOrder: (orderId: string): Promise<ApiResponse<ShipmentResponse>> =>
    shippingApiClient.get<ApiResponse<ShipmentResponse>>(`/shipping/order/${orderId}`),

  /** @deprecated */
  trackShipment: (trackingNumber: string): Promise<ApiResponse<Shipment>> =>
    shippingApiClient.get<ApiResponse<Shipment>>(`/shipping/track/${trackingNumber}`),
};
