import React from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

// import ProtectedRoute from '@/components/navigation/ProtectedRoute';

const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProductListPage = React.lazy(
  () => import('@/pages/productV2/AdminProductList/AdminProductListPage'),
);
const AdminAddProduct = React.lazy(() => import('@/pages/productV2/AdminAddProduct'));
const AdminOrderListPage = React.lazy(
  () => import('@/pages/orderV2/AdminOrderList/AdminOrderListPage'),
);

export const adminRoute: RouteObject = {
  // element: (
  //   <ProtectedRoute requiredRole="ADMIN">
  //     <Outlet />
  //   </ProtectedRoute>
  // ),
  children: [
    {
      path: 'admin',
      element: <Outlet />,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: 'products', element: <AdminProductListPage /> },
        { path: 'products/add', element: <AdminAddProduct /> },
        { path: 'category', element: <AdminDashboard /> },
        { path: 'orders', element: <AdminOrderListPage /> },
        { path: 'brand', element: <AdminDashboard /> },
        { path: 'users', element: <AdminDashboard /> },
      ],
    },
  ],
};
