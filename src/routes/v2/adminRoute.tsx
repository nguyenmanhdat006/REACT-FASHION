import React from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

// import ProtectedRoute from '@/components/navigation/ProtectedRoute';

const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProductListPage = React.lazy(
  () => import('@/pages/productV2/AdminProductList/AdminProductListPage'),
);
const AdminAddProduct = React.lazy(() => import('@/pages/productV2/AdminAddProduct'));
const AdminOrderListPage = React.lazy(
  () => import('@/pages/orderv2/AdminOrderList/AdminOrderListPage'),
);
const AdminUserListPage = React.lazy(
  () => import('@/pages/userv2/AdminUserList/AdminUserListPage'),
);
const AdminCategoryListPage = React.lazy(
  () => import('@/pages/productV2/AdminCategoryList/AdminCategoryListPage'),
);
const AdminBrandListPage = React.lazy(
  () => import('@/pages/productV2/AdminBrandList/AdminBrandListPage'),
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
        { path: 'category', element: <AdminCategoryListPage /> },
        { path: 'orders', element: <AdminOrderListPage /> },
        { path: 'brand', element: <AdminBrandListPage /> },
        { path: 'users', element: <AdminUserListPage /> },
      ],
    },
  ],
};
