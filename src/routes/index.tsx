import React from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

import LayoutV2 from '@/components/layout/LayoutV2';
import ProtectedRoute from '@/components/navigation/ProtectedRoute';

import { adminRoute } from './adminRoute';

const HomeV2 = React.lazy(() => import('@/pages/UserHomeV2'));
const UserProductListV2 = React.lazy(
  () => import('@/pages/UserProductV2/UserProductListV2'),
);
const CartV2 = React.lazy(() => import('@/pages/cartV2/index'));
const CheckoutV2 = React.lazy(() => import('@/pages/checkoutV2/index'));
const UserOrderV2 = React.lazy(() => import('@/pages/UserOrderV2'));
const UserProfileV2 = React.lazy(() => import('@/pages/UserProfileV2'));
const VnpayReturnPage = React.lazy(() => import('@/pages/VnpayReturnPage'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

const LoginV2 = React.lazy(() => import('@/pages/authV2/LoginV2/index'));
const SignUpV2 = React.lazy(() => import('@/pages/authV2/SignUpV2/index'));
const ForgotPasswordV2 = React.lazy(() => import('@/pages/authV2/ForgotPasswordV2/index'));
const ForgotPasswordSentV2 = React.lazy(
  () => import('@/pages/authV2/ForgotPasswordSentV2/index'),
);
const AuthCallback = React.lazy(() => import('@/pages/authV2/AuthCallback'));

export const routes: RouteObject[] = [
  { path: 'login', element: <LoginV2 /> },
  { path: 'signup', element: <SignUpV2 /> },
  { path: 'forgot-password', element: <ForgotPasswordV2 /> },
  { path: 'forgot-password/sent', element: <ForgotPasswordSentV2 /> },
  {
    path: '/',
    element: (
      <LayoutV2 aria-label="Home">
        <Outlet />
      </LayoutV2>
    ),
    children: [
      { index: true, element: <HomeV2 /> },
      { path: 'products', element: <UserProductListV2 /> },
      { path: 'products/clothing', element: <UserProductListV2 /> },
      { path: 'products/deal', element: <UserProductListV2 /> },
      { path: 'products/inspirations', element: <UserProductListV2 /> },
      { path: 'cart', element: <CartV2 /> },
      { path: 'checkout', element: <CheckoutV2 /> },
      { path: 'payment/return', element: <VnpayReturnPage /> },
      { path: 'orders', element: <UserOrderV2 /> },
      {
        element: (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: 'profile', element: <UserProfileV2 /> },
          adminRoute,
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
];
