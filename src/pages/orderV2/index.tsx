import { JSX } from 'react';
import OrderV2Layout from './components/OrderV2Layout';
import { OrdersSection } from './sections/OrdersSection';

export const OrderList = (): JSX.Element => {
  return (
    <OrderV2Layout>
      <OrdersSection />
    </OrderV2Layout>
  );
};

export default OrderList;
