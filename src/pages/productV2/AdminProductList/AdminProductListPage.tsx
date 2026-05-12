import { Helmet } from 'react-helmet-async';

import AdminProductList from '@/components/admin/AdminProductList';

import { ADMIN_PRODUCT_LIST_MOCK } from '@/pages/admin/adminProductListMock';

/** Admin products page — mock rows via AdminProductList on TableView. */
export default function AdminProductListPage() {
  return (
    <>
      <Helmet>
        <title>Products — Admin</title>
      </Helmet>
        <AdminProductList products={ADMIN_PRODUCT_LIST_MOCK} />
    </>
  );
}
