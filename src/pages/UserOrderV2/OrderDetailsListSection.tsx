import { useState } from "react";
import { Package, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { orderService } from "@/services/order/orderService";
import type { Order } from "@/types/order/order";

interface OrderDetailsListSectionProps {
  orders: Order[];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
};

const getImageUrl = (url?: string | null) => {
  if (!url || url === 'null' || url === 'undefined' || url.trim() === '') {
    return '/images/2164f1ee2b6a236aea160f5c3012a58b.jpg'; // local fallback
  }
  return url;
};

export const OrderDetailsListSection = ({ orders }: OrderDetailsListSectionProps): JSX.Element => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDetails = async (id: string) => {
    setSelectedOrderId(id);
    setIsLoading(true);
    setOrderDetails(null);
    try {
      const res = await orderService.getOrderById(id);
      if (res.success && res.data) {
        setOrderDetails(res.data);
      } else {
        toast.error('Could not load order details');
        setSelectedOrderId(null);
      }
    } catch (e) {
      toast.error('An error occurred while loading order details');
      setSelectedOrderId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedOrderId(null);
    setOrderDetails(null);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
        You have no orders.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => {
        const destination = [
          order.shippingAddress.address,
          order.shippingAddress.city,
          order.shippingAddress.province
        ].filter(Boolean).join(', ') || 'Chưa xác định';

        return (
          <section
            key={order.id}
            aria-label={`Order ${order.orderNumber}`}
            className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            {/* Order Header */}
            <header className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div
                className="relative w-8 h-8 aspect-[1] flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <Package size={30} strokeWidth={1.5} className="text-black" />
              </div>
              <h2 className="relative w-fit font-semibold text-black text-2xl leading-8 whitespace-nowrap">
                {order.orderNumber}
              </h2>
            </header>

            {/* Shipment Route */}
            <div className="flex flex-wrap items-center justify-between relative self-stretch w-full flex-[0_0_auto] gap-2 pt-2 pb-2">
              <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 relative flex-[0_0_auto] bg-[#f3f3f3b2] rounded-[32px] overflow-hidden border border-solid border-gray-200">
                <span className="relative w-fit mt-[-1px] text-black text-xs leading-4 whitespace-nowrap">
                  Cau Giay, HN
                </span>
              </div>

              <div className="flex items-center gap-0 flex-1 max-w-[120px]">
                <div className="w-1.5 h-1.5 bg-black rounded-full shrink-0"></div>
                <div className="flex-1 border-t border-dashed border-[#b3b3b3]"></div>
              </div>

              <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 relative flex-[0_0_auto] bg-[#f3f3f3b2] rounded-[32px] overflow-hidden border border-solid border-gray-200">
                <p className="text-[#666666] relative w-fit mt-[-1px] text-xs leading-4 whitespace-nowrap">
                  Estimated Arrival: {order.createdAt ? new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
              </div>

              <div className="flex items-center gap-0 flex-1 max-w-[120px]">
                <div className="w-1.5 h-1.5 bg-black rounded-full shrink-0"></div>
                <div className="flex-1 border-t border-dashed border-[#b3b3b3]"></div>
                <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-t-transparent border-b-transparent border-l-black shrink-0"></div>
              </div>

              <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 relative flex-[0_0_auto] bg-[#f3f3f3b2] rounded-[32px] overflow-hidden border border-solid border-gray-200 max-w-[200px]">
                <span className="text-black relative w-fit mt-[-1px] text-xs leading-4 whitespace-nowrap truncate" title={destination}>
                  {destination}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
              {order.items.map((item) => (
                <article
                  key={item.id}
                  className="flex items-center gap-4 p-4 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-2xl overflow-hidden border border-solid border-gray-200"
                >
                  <div
                    className="relative w-[100px] h-[100px] rounded-2xl aspect-[1] bg-cover bg-center shrink-0 bg-gray-200"
                    style={{ backgroundImage: `url(${getImageUrl(item.productImageUrl)})` }}
                    aria-hidden="true"
                  />
                  <div className="flex flex-col items-start justify-between relative flex-1 self-stretch grow min-w-0">
                    <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                      <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                        <p className="relative w-fit mt-[-1px] font-medium text-black text-sm leading-5 whitespace-nowrap truncate">
                          {item.productName}
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto] mt-1">
                        <span className="relative w-fit mt-[-1px] text-black text-xs leading-4 whitespace-nowrap">
                          Size:
                        </span>
                        <span className="relative w-fit mt-[-1px] text-[#666666] text-xs leading-4 whitespace-nowrap">
                          XL
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                        <span className="text-black relative w-fit mt-[-1px] text-xs leading-4 whitespace-nowrap">
                          Color:
                        </span>
                        <span className="text-[#666666] relative w-fit mt-[-1px] text-xs leading-4 whitespace-nowrap">
                          White
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto] mt-2">
                      <span className="relative w-fit mt-[-1px] font-medium text-black text-sm leading-5 whitespace-nowrap">
                        {formatPrice(item.price)}
                      </span>
                      <span className="relative w-fit mt-[-1px] font-medium text-black text-sm leading-5 whitespace-nowrap">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Footer: Total and Details Button */}
            <footer className="flex items-center justify-between pt-4 relative self-stretch w-full flex-[0_0_auto] border-t border-solid border-gray-200 mt-2">
              <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                <span className="relative w-fit mt-[-1px] font-normal text-black text-2xl leading-8 whitespace-nowrap">
                  Total:
                </span>
                <strong className="relative w-fit mt-[-1px] font-semibold text-black text-2xl leading-8 whitespace-nowrap">
                  {formatPrice(order.total)}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => handleOpenDetails(order.id)}
                className="flex w-full max-w-[120px] items-center justify-center gap-2.5 px-8 py-3 relative bg-gray-50 rounded-[32px] overflow-hidden hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 border border-solid border-gray-200"
                aria-label="View order details"
              >
                <span className="relative w-fit mt-[-1px] font-normal text-black text-base leading-6 whitespace-nowrap">
                  Details
                </span>
              </button>
            </footer>
          </section>
        );
      })}

      {/* Modal Overlay */}
      {selectedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 sm:p-6">
              <h2 className="text-h4-semi text-gray-900">Order Details</h2>
              <button
                onClick={closeModal}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600 mb-4" />
                  <p className="text-body-medium text-gray-600">Loading details...</p>
                </div>
              ) : orderDetails ? (
                <div className="flex flex-col gap-6">
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4 border border-gray-100">
                      <span className="text-caption-sm-regular text-gray-500">Order Number</span>
                      <span className="text-body-medium font-medium text-gray-900">{orderDetails.orderNumber}</span>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4 border border-gray-100">
                      <span className="text-caption-sm-regular text-gray-500">Order Date</span>
                      <span className="text-body-medium font-medium text-gray-900">
                        {orderDetails.createdAt ? new Date(orderDetails.createdAt).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4 border border-gray-100">
                      <span className="text-caption-sm-regular text-gray-500">Payment Method</span>
                      <span className="text-body-medium font-medium text-gray-900">{orderDetails.paymentMethod}</span>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4 border border-gray-100">
                      <span className="text-caption-sm-regular text-gray-500">Status</span>
                      <span className="text-body-medium font-medium text-gray-900">{orderDetails.status}</span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Shipping Information</h3>
                    <div className="text-body-regular text-gray-600 space-y-1 mt-1">
                      <p><span className="font-medium text-gray-900">Name:</span> {orderDetails.shippingAddress.recipientName}</p>
                      <p><span className="font-medium text-gray-900">Phone:</span> {orderDetails.shippingAddress.phone}</p>
                      <p><span className="font-medium text-gray-900">Address:</span> {orderDetails.shippingAddress.address}, {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.province}, {orderDetails.shippingAddress.zipCode}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Items</h3>
                    <div className="flex flex-col gap-3 mt-1">
                      {orderDetails.items.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div
                            className="h-16 w-16 rounded-lg bg-gray-200 bg-cover bg-center shrink-0 border border-gray-100"
                            style={{ backgroundImage: `url(${getImageUrl(item.productImageUrl)})` }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-body-medium font-medium text-gray-900 truncate">{item.productName}</p>
                            <p className="text-caption-sm-regular text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-body-medium font-medium text-gray-900">
                            {formatPrice(item.subtotal)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 border border-gray-100">
                    <div className="flex justify-between items-center text-body-regular text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(orderDetails.subtotal)}</span>
                    </div>
                    {orderDetails.discount > 0 && (
                      <div className="flex justify-between items-center text-body-regular text-gray-600">
                        <span>Discount</span>
                        <span className="text-destructive">-{formatPrice(orderDetails.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-body-regular text-gray-600">
                      <span>Shipping Fee</span>
                      <span>{formatPrice(orderDetails.shipping)}</span>
                    </div>
                    <div className="flex justify-between items-center text-body-medium font-bold text-gray-900 pt-2 border-t border-gray-200 mt-1">
                      <span>Total</span>
                      <span>{formatPrice(orderDetails.total)}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50">
              <button
                onClick={closeModal}
                className="w-full sm:w-auto sm:float-right inline-flex justify-center items-center rounded-full bg-gray-900 px-6 py-2.5 text-body-medium font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
              <div className="clear-both"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};