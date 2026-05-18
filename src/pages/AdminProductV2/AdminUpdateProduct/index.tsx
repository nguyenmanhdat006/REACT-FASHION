import { Helmet } from 'react-helmet-async';
import type { JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/constants';
import AdminProductV2Form from '@/forms/AdminProductV2';

export default function AdminUpdateProduct(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Edit product — Admin</title>
      </Helmet>
      <div className="w-full text-foreground">
        <AdminProductV2Form
          mode="update"
          productId={id}
          onSuccess={() => navigate(ROUTES.ADMIN_PRODUCTS)}
        />
      </div>
    </>
  );
}
