import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ROUTESV2 } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrdersThunk } from '@/store/thunks';

const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector(state => state.orders);

  useEffect(() => {
    void dispatch(fetchOrdersThunk({ page: 0, size: 20 }));
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Orders - React Fashion</title>
      </Helmet>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading orders...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">You do not have any orders yet.</p>
        ) : (
          items.map(order => {
            const firstImage = order.items && order.items.length > 0 ? order.items[0].productImageUrl : undefined;
            const getImageUrl = (url?: string | null) => {
              if (!url || url === 'null' || url === 'undefined' || url.trim() === '') return '/images/2164f1ee2b6a236aea160f5c3012a58b.jpg';
              return url;
            };

            return (
              <Card key={order.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={getImageUrl(firstImage)} alt="thumbnail" className="h-12 w-12 rounded-md object-cover" />
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{order.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">${order.total}</p>
                    <Link
                      className="text-sm text-primary-600 hover:underline"
                      to={ROUTESV2.ORDER_DETAIL(order.id)}
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </>
  );
};

export default Orders;
