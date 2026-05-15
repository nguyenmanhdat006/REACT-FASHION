import { Package, ChevronRight } from "lucide-react";

type OrderItem = {
  id: number;
  name: string;
  size: string;
  color: string;
  price: string;
  quantity: string;
  imageSrc: string;
  imageLabel: string;
};

type Order = {
  id: string;
  origin: string;
  estimatedArrival: string;
  destination: string;
  items: OrderItem[];
  total: string;
};

const mockOrders: Order[] = [
  {
    id: 'ORD-20260302-0001',
    origin: 'Cau Giay, HN',
    estimatedArrival: '28 April 2026',
    destination: 'Vinh Bao, Hai Phong',
    items: [
      {
        id: 1,
        name: "Supper Skinny jogger in brown",
        size: "XL",
        color: "White",
        price: "$145",
        quantity: "x3",
        imageSrc: "/frame-514.png",
        imageLabel: "Supper Skinny jogger in brown product image 1",
      },
      {
        id: 2,
        name: "Supper Skinny jogger in brown",
        size: "XL",
        color: "White",
        price: "$145",
        quantity: "x3",
        imageSrc: "/image.png",
        imageLabel: "Supper Skinny jogger in brown product image 2",
      },
    ],
    total: '$290',
  },
  {
    id: 'ORD-20260302-0002',
    origin: 'Cau Giay, HN',
    estimatedArrival: '28 April 2026',
    destination: 'Vinh Bao, Hai Phong',
    items: [
      {
        id: 3,
        name: "Supper Skinny jogger in brown",
        size: "XL",
        color: "White",
        price: "$145",
        quantity: "x3",
        imageSrc: "/frame-514-2.png",
        imageLabel: "Supper Skinny jogger in brown product image 3",
      },
    ],
    total: '$145',
  },
];

export const OrderDetailsListSection = (): JSX.Element => {
  return (
    <div className="flex flex-col gap-4">
      {mockOrders.map((order) => (
        <section
          key={order.id}
          aria-label={`Order ${order.id}`}
          className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          {/* Order Header */}
          <header className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center shrink-0">
              <Package size={24} strokeWidth={1.5} className="text-gray-900" />
            </div>
            <h3 className="text-body-semi text-gray-900">{order.id}</h3>
          </header>

          {/* Shipment Route */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
              <span className="text-caption-sm-regular text-gray-900 whitespace-nowrap">{order.origin}</span>
            </div>
            <ChevronRight
              size={14}
              strokeWidth={2.5}
              className="text-gray-400 shrink-0"
            />
            <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
              <span className="text-caption-sm-regular text-gray-600 whitespace-nowrap">
                Estimated Arrival: {order.estimatedArrival}
              </span>
            </div>
            <ChevronRight
              size={14}
              strokeWidth={2.5}
              className="text-gray-400 shrink-0"
            />
            <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
              <span className="text-caption-sm-regular text-gray-900 whitespace-nowrap">{order.destination}</span>
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
                  style={{ backgroundImage: `url(${item.imageSrc})` }}
                  role="img"
                  aria-label={item.imageLabel}
                />
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div className="flex-1">
                    <p className="text-body-medium text-gray-900">{item.name}</p>
                    <div className="flex gap-3 text-caption-sm-regular text-gray-600">
                      <span>Size: {item.size}</span>
                      <span>Color: {item.color}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-body-medium font-medium text-gray-900">
                      {item.price}
                    </span>
                    <span className="text-caption-sm-regular text-gray-500">
                      {item.quantity}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Footer: Total and Details Button */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-body-regular text-gray-600">Total:</span>
              <span className="text-h4-semi text-gray-900">{order.total}</span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2 text-body-medium font-medium text-gray-900 transition-colors hover:bg-gray-100"
            >
              Details
            </button>
          </div>
        </section>
      ))}
    </div>
  );
};