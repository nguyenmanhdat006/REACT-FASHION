import { Helmet } from 'react-helmet-async';

import AdminProductList from '@/pages/productV2/AdminProductList/sections/AdminProductList';

import { ADMIN_PRODUCT_LIST_MOCK } from '@/pages/productV2/AdminProductList/adminProductList';

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
