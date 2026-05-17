import { useCallback } from 'react';
import toast from 'react-hot-toast';

import {
  cancelOrderThunk,
  fetchOrdersThunk,
  confirmOrderPaymentThunk,
  markOrderDeliveredThunk,
  updateOrderStatusThunk,
  confirmOrderThunk,
} from '@/store/thunks';
import { useAppDispatch } from '@/store/hooks';
import type { PaginationParams } from '@/types/common/common';
import type { ConfirmPaymentRequest } from '@/types/payment/payment';

const payloadMessage = (payload: unknown, fallback: string) =>
  typeof payload === 'string' && payload ? payload : fallback;

export function useOrders() {
  const dispatch = useAppDispatch();

  const fetchOrdersPage = useCallback(
    async (params: PaginationParams) => {
      const result = await dispatch(fetchOrdersThunk(params));
      if (fetchOrdersThunk.rejected.match(result)) {
        toast.error(payloadMessage(result.payload, 'Không thể tải danh sách đơn hàng'));
      }
    },
    [dispatch],
  );

  /**
   * PUT /api/orders/{id}/status → CANCELLED
   */
  const cancelOrder = useCallback(
    async (
      id: string,
      notes: string | undefined,
      refetchParams: PaginationParams,
    ): Promise<boolean> => {
      const result = await dispatch(cancelOrderThunk({ id, notes }));
      if (cancelOrderThunk.fulfilled.match(result)) {
        toast.success('Đơn hàng đã được huỷ');
        await dispatch(fetchOrdersThunk(refetchParams));
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Không thể huỷ đơn hàng'));
      return false;
    },
    [dispatch],
  );

  const confirmOrder = useCallback(
    async (
      id: string,
      refetchParams: PaginationParams,
    ): Promise<boolean> => {
      const result = await dispatch(confirmOrderThunk(id));
      if (confirmOrderThunk.fulfilled.match(result)) {
        toast.success('Đơn hàng đã được xác nhận');
        await dispatch(fetchOrdersThunk(refetchParams));
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Không thể xác nhận đơn hàng'));
      return false;
    },
    [dispatch],
  );

  const updateOrderStatus = useCallback(
    async (
      id: string,
      status: string,
      refetchParams: PaginationParams,
    ): Promise<boolean> => {
      const result = await dispatch(updateOrderStatusThunk({ id, status }));
      if (updateOrderStatusThunk.fulfilled.match(result)) {
        toast.success(`Đã cập nhật trạng thái thành ${status}`);
        await dispatch(fetchOrdersThunk(refetchParams));
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Không thể cập nhật trạng thái đơn hàng'));
      return false;
    },
    [dispatch],
  );

  /**
   * PUT /api/orders/{id}/payment-confirmed
   * Called after VNPAY redirect back to FE.
   */
  const confirmPayment = useCallback(
    async (orderId: string, payload: ConfirmPaymentRequest): Promise<boolean> => {
      const result = await dispatch(confirmOrderPaymentThunk({ orderId, payload }));
      if (confirmOrderPaymentThunk.fulfilled.match(result)) {
        toast.success('Thanh toán đã được xác nhận!');
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Xác nhận thanh toán thất bại'));
      return false;
    },
    [dispatch],
  );

  /**
   * PUT /api/orders/{id}/delivered
   * Admin / shipper marks delivery complete. For COD, also triggers payment success.
   */
  const markDelivered = useCallback(
    async (orderId: string): Promise<boolean> => {
      const result = await dispatch(markOrderDeliveredThunk(orderId));
      if (markOrderDeliveredThunk.fulfilled.match(result)) {
        toast.success('Giao hàng thành công!');
        return true;
      }
      toast.error(payloadMessage(result.payload, 'Không thể xác nhận giao hàng'));
      return false;
    },
    [dispatch],
  );

  return {
    fetchOrdersPage,
    cancelOrder,
    confirmOrder,
    updateOrderStatus,
    confirmPayment,
    markDelivered,
  };
}
