import React from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

import LayoutV2 from '@/components/layout/LayoutV2';
import ProtectedRoute from '@/components/navigation/ProtectedRoute';
import HomeV2 from '@/pages/HomeV2';

import { adminRoute } from './adminRoute';

const UserProductListV2 = React.lazy(
  () => import('@/pages/UserProductV2/UserProductListV2'),
);
const Cart = React.lazy(() => import('@/pages/cart/Cart'));
const Checkout = React.lazy(() => import('@/pages/cart/Checkout'));
const Orders = React.lazy(() => import('@/pages/order/Orders'));
const OrderDetail = React.lazy(() => import('@/pages/order/OrderDetail'));
const OrderV2 = React.lazy(() => import('@/pages/orderv2/index'));
const ProfileV2 = React.lazy(() => import('@/pages/user/ProfileV2'));
const CartV2 = React.lazy(() => import('@/pages/cartV2/index'));
const CheckoutV2 = React.lazy(() => import('@/pages/checkoutV2/index'));
const VnpayReturnPage = React.lazy(() => import('@/pages/payment/VnpayReturnPage'));

export const userRoute: RouteObject = {
  element: (
    <LayoutV2 aria-label="Home">
      <Outlet />
    </LayoutV2>
  ),
  children: [
    { index: true, element: <HomeV2 /> },
    { path: 'cart', element: <CartV2 /> },
    { path: 'checkout', element: <CheckoutV2 /> },
    { path: 'payment/return', element: <VnpayReturnPage /> },
    { path: 'order', element: <OrderV2 /> },
    { path: 'products', element: <UserProductListV2 /> },
    { path: 'products/clothing', element: <UserProductListV2 /> },
    { path: 'products/deal', element: <UserProductListV2 /> },
    { path: 'products/inspirations', element: <UserProductListV2 /> },
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
        { path: 'profile', element: <ProfileV2 /> },
        adminRoute,
      ],
    },
  ],
};
