import React from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';

import LayoutV2 from '@/components/layout/LayoutV2';
import ProtectedRoute from '@/components/navigation/ProtectedRoute';
import HomeV2 from '@/pages/productV2';

import { adminRoute } from './adminRoute';

const Products = React.lazy(() => import('@/pages/productV2/ProductV2'));
const ProductDetail = React.lazy(() => import('@/pages/product/ProductDetail'));
const Cart = React.lazy(() => import('@/pages/cart/Cart'));
const Checkout = React.lazy(() => import('@/pages/cart/Checkout'));
const Orders = React.lazy(() => import('@/pages/order/Orders'));
const OrderDetail = React.lazy(() => import('@/pages/order/OrderDetail'));
const Profile = React.lazy(() => import('@/pages/user/Profile'));

export const userRoute: RouteObject = {
  element: (
    <LayoutV2 aria-label="Home">
      <Outlet />
    </LayoutV2>
  ),
  children: [
    { index: true, element: <HomeV2 /> },
    { path: 'products', element: <Products /> },
    { path: 'products/clothing', element: <Products /> },
    { path: 'products/deal', element: <Products /> },
    { path: 'products/inspirations', element: <Products /> },
    { path: 'products/:slug', element: <ProductDetail /> },
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
        adminRoute,
      ],
    },
  ],
};
