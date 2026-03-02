import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Card from '@/components/Card';
import Table from '@/components/Table';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '@/mocks/ecommerceMockData';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrdersThunk, fetchProductsThunk } from '@/store/thunks';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const ordersState = useAppSelector(state => state.orders.items);
  const productsState = useAppSelector(state => state.products.items);

  const orders = ordersState.length > 0 ? ordersState : MOCK_ORDERS;
  const products = productsState.length > 0 ? productsState : MOCK_PRODUCTS;

  useEffect(() => {
    void dispatch(fetchOrdersThunk({ page: 0, size: 5 }));
    void dispatch(fetchProductsThunk({ page: 0, size: 5 }));
  }, [dispatch]);

  const orderColumns = [
    { key: 'orderNumber', header: 'Order' },
    { key: 'status', header: 'Status' },
    { key: 'total', header: 'Total' },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - React Fashion</title>
      </Helmet>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Orders">
            <p className="text-2xl font-bold text-primary-600">{orders.length}</p>
          </Card>
          <Card title="Products">
            <p className="text-2xl font-bold text-primary-600">{products.length}</p>
          </Card>
          <Card title="Revenue">
            <p className="text-2xl font-bold text-primary-600">
              ${orders.reduce((sum, order) => sum + order.total, 0)}
            </p>
          </Card>
        </div>

        <Card title="Recent Orders">
          <Table data={orders} columns={orderColumns} />
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
