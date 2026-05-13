import { Helmet } from 'react-helmet-async';

import AdminOrderList from '@/pages/orderV2/AdminOrderList/sections/AdminOrderList';

import { ADMIN_ORDER_LIST_MOCK } from '@/pages/orderV2/AdminOrderList/adminOrderList';

/** Admin orders page — mock rows via AdminOrderList on TableView. */
export default function AdminOrderListPage() {
  return (
    <>
      <Helmet>
        <title>Orders — Admin</title>
      </Helmet>
      <AdminOrderList orders={ADMIN_ORDER_LIST_MOCK} />
    </>
  );
}
