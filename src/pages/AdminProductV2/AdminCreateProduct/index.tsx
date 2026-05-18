import { Helmet } from 'react-helmet-async';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants';
import AdminProductV2Form from '@/forms/AdminProductV2';

export default function AdminCreateProduct(): JSX.Element {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Add product — Admin</title>
      </Helmet>

      <div className="w-full text-foreground">
        <AdminProductV2Form
          mode="create"
          onSuccess={() => navigate(ROUTES.ADMIN_PRODUCTS)}
        />
      </div>
    </>
  );
}
