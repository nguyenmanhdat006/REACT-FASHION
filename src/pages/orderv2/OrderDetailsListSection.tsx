import { Package, ChevronRight } from "lucide-react";
import type { Order } from "@/types/order/order";

interface OrderDetailsListSectionProps {
  orders: Order[];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export const OrderDetailsListSection = ({ orders }: OrderDetailsListSectionProps): JSX.Element => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
        Bạn chưa có đơn hàng nào.
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
            <header className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center shrink-0">
                <Package size={24} strokeWidth={1.5} className="text-gray-900" />
              </div>
              <h3 className="text-body-semi text-gray-900 font-bold">{order.orderNumber}</h3>
              <span className={`text-caption-sm-regular px-2 py-1 rounded-full ${
                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {order.status}
              </span>
            </header>

            {/* Shipment Route */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
                <span className="text-caption-sm-regular text-gray-900 whitespace-nowrap">Kho hàng</span>
              </div>
              <ChevronRight
                size={14}
                strokeWidth={2.5}
                className="text-gray-400 shrink-0"
              />
              <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
                <span className="text-caption-sm-regular text-gray-600 whitespace-nowrap">
                  Dự kiến giao: {order.createdAt ? new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
              <ChevronRight
                size={14}
                strokeWidth={2.5}
                className="text-gray-400 shrink-0"
              />
              <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 max-w-[300px] overflow-hidden">
                <span className="text-caption-sm-regular text-gray-900 truncate" title={destination}>{destination}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                >
                  <div
                    className="relative min-h-24 min-w-24 shrink-0 rounded-lg bg-gray-200 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.productImageUrl || 'https://via.placeholder.com/150?text=No+Image'})` }}
                    role="img"
                    aria-label={item.productName}
                  />
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div className="flex-1">
                      <p className="text-body-medium text-gray-900 font-medium truncate">{item.productName}</p>
                      <div className="flex gap-3 text-caption-sm-regular text-gray-600 mt-1">
                        <span>Mặc định</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-body-medium font-medium text-gray-900">
                        {formatPrice(item.price)}
                      </span>
                      <span className="text-caption-sm-regular text-gray-500">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Footer: Total and Details Button */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-body-regular text-gray-600">Tổng cộng:</span>
                <span className="text-h4-semi text-gray-900 font-bold">{formatPrice(order.total)}</span>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 text-body-medium font-medium text-gray-900 transition-colors hover:bg-gray-100 border border-gray-200"
              >
                Chi tiết
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
};