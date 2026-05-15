import React from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

import LayoutV2 from '@/components/layout/LayoutV2';
import ProtectedRoute from '@/components/navigation/ProtectedRoute';
import HomeV2 from '@/pages/productV2';

import { adminRoute } from './adminRoute';

const Products = React.lazy(() => import('@/pages/productV2/ProductV2'));
const Cart = React.lazy(() => import('@/pages/cart/Cart'));
const Checkout = React.lazy(() => import('@/pages/cart/Checkout'));
const Orders = React.lazy(() => import('@/pages/order/Orders'));
const OrderDetail = React.lazy(() => import('@/pages/order/OrderDetail'));
const OrderV2 = React.lazy(() => import('@/pages/orderv2/index'));
const ProfileV2 = React.lazy(() => import('@/pages/user/ProfileV2'));
const CartV2 = React.lazy(() => import('@/pages/cartV2/index'));
const CheckoutV2 = React.lazy(() => import('@/pages/checkoutV2/index'));

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
    { path: 'order', element: <OrderV2 /> },
    { path: 'products', element: <Products /> },
    { path: 'products/clothing', element: <Products /> },
    { path: 'products/deal', element: <Products /> },
    { path: 'products/inspirations', element: <Products /> },
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
