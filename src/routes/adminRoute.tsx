import React from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

import ProtectedRoute from '@/components/navigation/ProtectedRoute';
const AdminDashboard = React.lazy(() => import('@/pages/Dashboard'));
const AdminProductListPage = React.lazy(
  () => import('@/pages/AdminProductV2/AdminProductList/AdminProductListPage'),
);
const AdminCreateProduct = React.lazy(
  () => import('@/pages/AdminProductV2/AdminCreateProduct'),
);
const AdminReadProduct = React.lazy(
  () => import('@/pages/AdminProductV2/AdminReadProduct'),
);
const AdminUpdateProduct = React.lazy(
  () => import('@/pages/AdminProductV2/AdminUpdateProduct'),
);
const AdminOrderV2 = React.lazy(() => import('@/pages/AdminOrderV2'));
const AdminUserListPage = React.lazy(() => import('@/pages/AdminUserV2'));
const AdminCategoryListPage = React.lazy(
  () => import('@/pages/AdminCategoryV2'),
);
const AdminBrandListPage = React.lazy(() => import('@/pages/AdminBrandV2'));

export const adminRoute: RouteObject = {
  element: (
    <ProtectedRoute requiredRole="ADMIN">
      <Outlet />
    </ProtectedRoute>
  ),
  children: [
    {
      path: 'admin',
      element: <Outlet />,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: 'products', element: <AdminProductListPage /> },
        { path: 'products/add', element: <AdminCreateProduct /> },
        { path: 'products/:id/edit', element: <AdminUpdateProduct /> },
        { path: 'products/:id', element: <AdminReadProduct /> },
        { path: 'category', element: <AdminCategoryListPage /> },
        { path: 'orders', element: <AdminOrderV2 /> },
        { path: 'brand', element: <AdminBrandListPage /> },
        { path: 'users', element: <AdminUserListPage /> },
      ],
    },
  ],
};
