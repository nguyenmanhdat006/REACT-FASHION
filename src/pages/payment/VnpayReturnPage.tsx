/**
 * VNPay Payment Return Page
 *
 * Flow (Luồng 2 từ flow.md):
 * 1. VNPAY redirects to this page with query params: vnp_ResponseCode, vnp_TxnRef, vnp_TransactionNo, etc.
 * 2. FE reads params from URL.
 * 3. If success (vnp_ResponseCode === "00"):
 *    → Call PUT /api/orders/{orderId}/payment-confirmed with { paymentNumber, transactionId }
 *    → Navigate to order detail page.
 * 4. If failed → Show error, let user retry.
 *
 * The orderId is stored in localStorage by CheckoutV2 before redirecting to VNPAY.
 */
import { useEffect, useRef, type JSX } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/store/hooks';
import { confirmOrderPaymentThunk } from '@/store/thunks';
import { ROUTESV2 } from '@/constants';

const VNPAY_SUCCESS_CODE = '00';
const PENDING_ORDER_ID_KEY = 'vnpay_pending_order_id';

/** Called by CheckoutV2 before redirecting to VNPAY payment URL. */
export const saveVnpayPendingOrderId = (orderId: string): void => {
  localStorage.setItem(PENDING_ORDER_ID_KEY, orderId);
};

const getAndClearPendingOrderId = (): string | null => {
  const id = localStorage.getItem(PENDING_ORDER_ID_KEY);
  localStorage.removeItem(PENDING_ORDER_ID_KEY);
  return id;
};

export default function VnpayReturnPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const processed = useRef(false); // prevent double-call in StrictMode

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const responseCode = searchParams.get('vnp_ResponseCode');
    const txnRef = searchParams.get('vnp_TxnRef');       // usually the orderNumber
    const transactionNo = searchParams.get('vnp_TransactionNo'); // VNPay transaction ID

    const orderId = getAndClearPendingOrderId();

    const handleSuccess = async () => {
      if (!orderId) {
        // orderId not found — try to navigate to orders list
        toast.success('Thanh toán thành công! Vui lòng kiểm tra danh sách đơn hàng.');
        navigate(ROUTESV2.ORDERS);
        return;
      }

      const result = await dispatch(
        confirmOrderPaymentThunk({
          orderId,
          payload: {
            paymentNumber: txnRef ?? undefined,
            transactionId: transactionNo ?? undefined,
          },
        })
      );

      if (confirmOrderPaymentThunk.fulfilled.match(result)) {
        toast.success('Thanh toán thành công! Đơn hàng đã được xác nhận.');
        navigate(ROUTESV2.ORDER_DETAIL(orderId));
      } else {
        toast.error('Xác nhận thanh toán thất bại. Vui lòng liên hệ hỗ trợ.');
        navigate(ROUTESV2.ORDERS);
      }
    };

    if (responseCode === VNPAY_SUCCESS_CODE) {
      void handleSuccess();
    } else {
      toast.error(
        `Thanh toán VNPAY thất bại (mã lỗi: ${responseCode ?? 'unknown'}). Vui lòng thử lại.`
      );
      navigate(ROUTESV2.CHECKOUT);
    }
  }, [dispatch, navigate, searchParams]);

  return (
    <>
      <Helmet>
        <title>Đang xử lý thanh toán — React Fashion</title>
      </Helmet>

      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Spinner */}
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-body-medium text-gray-700">Đang xác nhận thanh toán...</p>
          <p className="text-caption-sm-regular text-gray-500">
            Vui lòng không đóng trang này.
          </p>
        </div>
      </main>
    </>
  );
}
