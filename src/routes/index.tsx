import React from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/navigation/ProtectedRoute';
import { authV2Routes } from './v2/authV2Routes';
import { userRoute } from './v2/userRoute';

const Home = React.lazy(() => import('@/pages/public/Home'));
const Products = React.lazy(() => import('@/pages/product/Products'));
const ProductDetail = React.lazy(() => import('@/pages/product/ProductDetail'));
const Cart = React.lazy(() => import('@/pages/cart/Cart'));
const Checkout = React.lazy(() => import('@/pages/cart/Checkout'));
const Orders = React.lazy(() => import('@/pages/order/Orders'));
const OrderDetail = React.lazy(() => import('@/pages/order/OrderDetail'));
const Profile = React.lazy(() => import('@/pages/user/Profile'));
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const Login = React.lazy(() => import('@/pages/auth/Login'));
const SignUp = React.lazy(() => import('@/pages/auth/SignUp'));
const ForgotPassword = React.lazy(() => import('@/pages/auth/ForgotPassword'));
const NotFound = React.lazy(() => import('@/pages/public/NotFound'));

const AuthCallback = React.lazy(() => import('@/pages/auth/AuthCallback'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:slug', element: <ProductDetail /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      {
        element: (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: 'cart', element: <Cart /> },
          { path: 'checkout', element: <Checkout /> },
          { path: 'orders', element: <Orders /> },
          { path: 'orders/:id', element: <OrderDetail /> },
          { path: 'profile', element: <Profile /> },
          {
            element: (
              <ProtectedRoute requiredRole="ADMIN">
                <Outlet />
              </ProtectedRoute>
            ),
            children: [{ path: 'admin', element: <AdminDashboard /> }],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />
  },
  {
    path: '/v2',
    children: [...authV2Routes, userRoute, { path: '*', element: <NotFound /> }],
  },
];