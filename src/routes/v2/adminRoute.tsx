import React from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

import ProtectedRoute from '@/components/navigation/ProtectedRoute';

const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));

export const adminRoute: RouteObject = {
  element: (
    <ProtectedRoute requiredRole="ADMIN">
      <Outlet />
    </ProtectedRoute>
  ),
  children: [{ path: 'admin', element: <AdminDashboard /> }],
};
