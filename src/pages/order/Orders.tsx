import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { ROUTES } from '@/constants';
import { MOCK_ORDERS } from '@/mocks/ecommerce/ecommerceMockData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrdersThunk } from '@/store/thunks';

const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading } = useAppSelector(state => state.orders);

  useEffect(() => {
    void dispatch(fetchOrdersThunk({ page: 0, size: 20 }));
  }, [dispatch]);

  const orderList = items.length > 0 ? items : MOCK_ORDERS;

  return (
    <>
      <Helmet>
        <title>Orders - React Fashion</title>
      </Helmet>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
        {isLoading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading orders...</p>
        ) : (
          orderList.map(order => (
            <Card key={order.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.status}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">${order.total}</p>
                  <Link
                    className="text-sm text-primary-600 hover:underline"
                    to={ROUTES.ORDER_DETAIL(order.id)}
                  >
                    View details
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
};

export default Orders;
