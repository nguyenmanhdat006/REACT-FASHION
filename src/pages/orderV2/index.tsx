import { OrdersSection } from "./OrdersSection";
import { SidebarNavigationSection } from "./SidebarNavigationSection";

export const OrderList = (): JSX.Element => {
  return (
    <main className="relative flex min-h-screen items-start justify-center bg-grayscale-50">
      <SidebarNavigationSection />
      <OrdersSection />
    </main>
  );
};

export default OrderList;
