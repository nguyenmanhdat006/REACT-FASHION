import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrderByIdThunk } from '@/store/thunks';

const OrderDetail: React.FC = () => {
  const { id = '' } = useParams();
  const dispatch = useAppDispatch();
  const { selectedOrder } = useAppSelector(state => state.orders);

  useEffect(() => {
    if (id) {
      void dispatch(fetchOrderByIdThunk(id));
    }
  }, [dispatch, id]);

  if (!selectedOrder) {
    return <p className="text-gray-600 dark:text-gray-300">Loading order...</p>;
  }

  return (
    <>
      <Helmet>
        <title>Order Detail - React Fashion</title>
      </Helmet>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedOrder.orderNumber}</h1>
        <Card>
          <p className="text-sm text-gray-500 mb-4">Status: {selectedOrder.status}</p>
          <div className="space-y-2">
            {selectedOrder.items.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={(!item.productImageUrl || item.productImageUrl === 'null' || item.productImageUrl === 'undefined') ? '/images/2164f1ee2b6a236aea160f5c3012a58b.jpg' : item.productImageUrl}
                    alt={item.productName}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <span>{item.productName} × {item.quantity}</span>
                </div>
                <span>${item.subtotal}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span>${selectedOrder.total}</span>
          </div>
        </Card>
      </div>
    </>
  );
};

export default OrderDetail;
