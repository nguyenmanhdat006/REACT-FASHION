import { Package, ChevronRight } from "lucide-react";

type OrderItem = {
  id: number;
  name: string;
  size: string;
  color: string;
  price: string;
  quantity: string;
  imageSrc: string;
};

const orderItems: OrderItem[] = [
  {
    id: 1,
    name: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: "x3",
    imageSrc: "/frame-514.png",
  },
  {
    id: 2,
    name: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: "x3",
    imageSrc: "/image.png",
  },
];

export const OrderSummaryCardSection = (): JSX.Element => {
  return (
    <section
      aria-label="Order summary"
      className="self-stretch w-full flex flex-col items-center gap-4 relative flex-[0_0_auto] bg-white rounded-2xl overflow-hidden border border-solid border-gray-200 overflow-y-scroll"
    >
      <div className="flex flex-col items-start gap-4 p-4 relative self-stretch w-full flex-[0_0_auto]">
        {/* Header with Order ID */}
        <header className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
          <div
            className="relative w-8 h-8 aspect-[1] flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <Package size={30} strokeWidth={1.5} className="text-black" />
          </div>
          <h2 className="relative w-fit font-semibold text-black text-2xl leading-8 whitespace-nowrap">
            ORD-20260302-0001
          </h2>
        </header>

        {/* Shipment Route Pills */}
        <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto] flex-wrap gap-2">
          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 relative flex-[0_0_auto] bg-[#f3f3f3b2] rounded-[32px] overflow-hidden border border-solid border-gray-200">
            <span className="relative w-fit mt-[-1px] text-black text-xs leading-4 whitespace-nowrap">
              Cau Giay, HN
            </span>
          </div>

          <ChevronRight
            size={20}
            strokeWidth={2}
            className="text-gray-400 shrink-0"
            aria-hidden="true"
          />

          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 relative flex-[0_0_auto] bg-[#f3f3f3b2] rounded-[32px] overflow-hidden border border-solid border-gray-200">
            <p className="text-[#666666] relative w-fit mt-[-1px] text-xs leading-4 whitespace-nowrap">
              Estimated Arrival: 28 April 2026
            </p>
          </div>

          <ChevronRight
            size={20}
            strokeWidth={2}
            className="text-gray-400 shrink-0"
            aria-hidden="true"
          />

          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 relative flex-[0_0_auto] bg-[#f3f3f3b2] rounded-[32px] overflow-hidden border border-solid border-gray-200">
            <span className="text-black relative w-fit mt-[-1px] text-xs leading-4 whitespace-nowrap">
              Vinh Bao, Hai Phong
            </span>
          </div>
        </div>

        {/* Order Items List */}
        <div className="flex flex-col items-start gap-4 relative self-stretch w-full flex-[0_0_auto]">
          {orderItems.map((item) => (
            <article
              key={item.id}
              className="flex items-center gap-4 p-4 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-2xl overflow-hidden border border-solid border-gray-200"
            >
              <div
                className="relative w-[100px] h-[100px] rounded-2xl aspect-[1] bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url(${item.imageSrc})` }}
                aria-hidden="true"
              />
              <div className="flex flex-col items-start justify-between relative flex-1 self-stretch grow min-w-0">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                    <p className="relative w-fit mt-[-1px] font-medium text-black text-sm leading-5 whitespace-nowrap truncate">
                      {item.name}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                    <span className="relative w-fit mt-[-1px] text-black text-xs leading-4 whitespace-nowrap">
                      Size:
                    </span>
                    <span className="relative w-fit mt-[-1px] text-[#666666] text-xs leading-4 whitespace-nowrap">
                      {item.size}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                    <span className="text-black relative w-fit mt-[-1px] text-xs leading-4 whitespace-nowrap">
                      Color:
                    </span>
                    <span className="text-[#666666] relative w-fit mt-[-1px] text-xs leading-4 whitespace-nowrap">
                      {item.color}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                  <span className="relative w-fit mt-[-1px] font-medium text-black text-sm leading-5 whitespace-nowrap">
                    {item.price}
                  </span>
                  <span className="relative w-fit mt-[-1px] font-medium text-black text-sm leading-5 whitespace-nowrap">
                    {item.quantity}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Footer with Total and Details Button */}
      <footer className="flex items-center justify-between p-4 relative self-stretch w-full flex-[0_0_auto] border-t border-solid border-gray-200">
        <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
          <span className="relative w-fit mt-[-1px] font-normal text-black text-2xl leading-8 whitespace-nowrap">
            Total:
          </span>
          <strong className="relative w-fit mt-[-1px] font-semibold text-black text-2xl leading-8 whitespace-nowrap">
            $290
          </strong>
        </div>
        <button
          type="button"
          className="flex w-full max-w-[188px] items-center justify-center gap-2.5 px-8 py-3 relative bg-gray-50 rounded-[32px] overflow-hidden hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
          aria-label="View order details"
        >
          <span className="relative w-fit mt-[-1px] font-normal text-black text-base leading-6 whitespace-nowrap">
            Details
          </span>
        </button>
      </footer>
    </section>
  );
};