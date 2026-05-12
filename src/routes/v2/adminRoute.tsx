import React from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

// import ProtectedRoute from '@/components/navigation/ProtectedRoute';

const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProductListPage = React.lazy(
  () => import('@/pages/productV2/AdminProductList/AdminProductListPage'),
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
        { path: 'category', element: <AdminDashboard /> },
        { path: 'orders', element: <AdminDashboard /> },
        { path: 'brand', element: <AdminDashboard /> },
        { path: 'users', element: <AdminDashboard /> },
      ],
    },
  ],
};
