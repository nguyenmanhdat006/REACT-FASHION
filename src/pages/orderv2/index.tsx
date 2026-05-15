import { useState } from 'react';
import { OrderDetailsListSection } from "./OrderDetailsListSection";

type OrderStatus = 'all' | 'pending' | 'shipping' | 'arrived' | 'cancelled';

const ORDER_FILTERS = [
  { id: 'pending', label: 'Pending', count: 3 },
  { id: 'shipping', label: 'On Shipping', count: 8 },
  { id: 'arrived', label: 'Arrived', count: 3 },
  { id: 'cancelled', label: 'Cancelled', count: 3 },
];

export const Frame = (): JSX.Element => {
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('all');

  return (
    <main className="relative w-full bg-white px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-[1140px]">
        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {ORDER_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveStatus(filter.id as OrderStatus)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-body-regular font-medium transition-colors ${
                activeStatus === filter.id || activeStatus === 'all'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filter.label}
              <span className="text-caption-sm-regular text-gray-500">{filter.count}</span>
            </button>
          ))}
        </div>

        {/* Order Details List */}
        <section aria-label="Order details" className="w-full">
          <OrderDetailsListSection />
        </section>
      </div>
    </main>
  );
};

export default Frame;
