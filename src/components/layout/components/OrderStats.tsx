import React from 'react';

interface OrderStatsProps {
  orderCount?: number;
  period?: string;
  label?: string;
}

export const OrderStats: React.FC<OrderStatsProps> = ({ 
  orderCount = 37, 
  period = 'Last 7 days', 
  label = 'Orders' 
}) => {
  return (
    <div className="relative inline-flex w-auto items-center justify-center gap-2">
      <div className="relative whitespace-nowrap text-h3-medium text-gray-black">
        {orderCount}
      </div>
      <div className="relative h-5 w-px bg-gray-400" aria-hidden="true" />
      <div className="relative inline-flex self-stretch flex-col items-center justify-center">
        <div className="relative leading-tight self-stretch text-body-regular text-gray-black">
          {label}
        </div>
        <div className="relative self-stretch text-caption-lg-regular text-gray-500">
          {period}
        </div>
      </div>
    </div>
  );
};