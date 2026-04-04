import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/feedback/LoadingSpinner';
import { useTheme } from './hooks/theme/useTheme';

// Lazy load pages
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

// Protected Route Component
import ProtectedRoute from './components/navigation/ProtectedRoute';

function App() {
  const { theme } = useTheme();

  return (
    <>
      <Helmet>
        <html lang="en" className={theme} />
      </Helmet>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:slug" element={<ProductDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="forgot-password" element={<ForgotPassword />} />

            {/* Protected routes */}
            <Route
              path="cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
