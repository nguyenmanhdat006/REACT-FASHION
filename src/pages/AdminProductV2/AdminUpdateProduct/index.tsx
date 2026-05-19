import { Helmet } from 'react-helmet-async';
import type { JSX } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants';
import AdminProductV2Form from '@/forms/AdminProductV2';

import { AdminProductPageNav } from '../components/AdminProductPageNav';

export default function AdminUpdateProduct(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return <Navigate to={ROUTES.ADMIN_PRODUCTS} replace />;
  }

  return (
    <>
      <Helmet>
        <title>Edit product — Admin</title>
      </Helmet>
      <div className="w-full text-foreground">
        <AdminProductPageNav productId={id} variant="edit" />
        <AdminProductV2Form
          mode="update"
          productId={id}
          onSuccess={() => navigate(ROUTES.ADMIN_PRODUCT_DETAIL(id))}
        />
      </div>
    </>
  );
}
