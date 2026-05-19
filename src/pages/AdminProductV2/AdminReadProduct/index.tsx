import { Helmet } from 'react-helmet-async';
import type { JSX } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants';
import AdminProductV2Form from '@/forms/AdminProductV2';

import { AdminProductPageNav } from '../components/AdminProductPageNav';

export default function AdminReadProduct(): JSX.Element {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to={ROUTES.ADMIN_PRODUCTS} replace />;
  }

  return (
    <>
      <Helmet>
        <title>View product — Admin</title>
      </Helmet>
      <div className="w-full text-foreground">
        <AdminProductPageNav productId={id} variant="read" />
        <AdminProductV2Form mode="read" productId={id} />
      </div>
    </>
  );
}
