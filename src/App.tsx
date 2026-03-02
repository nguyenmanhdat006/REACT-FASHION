import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import { useTheme } from './hooks/useTheme';

// Lazy load pages
const Home = React.lazy(() => import('@/pages/Home'));
const Products = React.lazy(() => import('@/pages/Products'));
const ProductDetail = React.lazy(() => import('@/pages/ProductDetail'));
const Cart = React.lazy(() => import('@/pages/Cart'));
const Checkout = React.lazy(() => import('@/pages/Checkout'));
const Orders = React.lazy(() => import('@/pages/Orders'));
const OrderDetail = React.lazy(() => import('@/pages/OrderDetail'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard'));
const Login = React.lazy(() => import('@/pages/Login'));
const SignUp = React.lazy(() => import('@/pages/SignUp'));
const ForgotPassword = React.lazy(() => import('@/pages/ForgotPassword'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

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
