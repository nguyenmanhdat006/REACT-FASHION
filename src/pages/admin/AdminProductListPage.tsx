import { Helmet } from 'react-helmet-async';

import AdminProductList from '@/components/admin/AdminProductList';

import { ADMIN_PRODUCT_LIST_MOCK } from '@/pages/admin/adminProductListMock';

/**
 * Admin — product list table (mock data). Uses {@link AdminProductList} from `@/components/admin/AdminProductList`.
 */
export default function AdminProductListPage() {
  return (
    <>
      <Helmet>
        <title>Products — Admin</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-body-bold text-foreground md:text-h5-bold">Products</h1>
          <p className="mt-1 text-caption-lg-regular text-muted-foreground">
            Manage catalog, stock, and categories (demo data).
          </p>
        </div>
        <AdminProductList products={ADMIN_PRODUCT_LIST_MOCK} />
      </div>
    </>
  );
}
