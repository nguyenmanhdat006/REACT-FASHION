import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { ROUTES } from '@/constants';
import LoadingSpinner from '@/components/feedback/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'USER' | 'CUSTOMER';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (
    requiredRole &&
    !user?.roles?.includes(requiredRole) &&
    !user?.roles?.includes('ADMIN')
  ) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
