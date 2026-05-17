import { Helmet } from 'react-helmet-async';
import type { JSX } from 'react';
import { useParams } from 'react-router-dom';

import AdminProductV2Form from '@/forms/AdminProductV2';

export default function AdminReadProduct(): JSX.Element {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Helmet>
        <title>View product — Admin</title>
      </Helmet>
      <div className="w-full text-foreground">
        <AdminProductV2Form mode="read" productId={id} />
      </div>
    </>
  );
}
