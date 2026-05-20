import type { LucideIcon } from 'lucide-react';
import {
  Compass,
  Home,
  LayoutDashboard,
  MessageCircle,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Store,
  Tag,
  User,
  Users,
} from 'lucide-react';

import { ROUTES } from '@/constants';

export type AppShellRoute = {
  to: string;
  label: string;
  headerTitle: string;
  icon: LucideIcon;
  showInSidebar: boolean;
  sidebarOrder: number;
  showHeaderFiltersRow: boolean;
  showQuickFilter: boolean;
};

export const APP_SHELL_ROUTES: AppShellRoute[] = [
  {
    to: ROUTES.HOME,
    label: 'Home',
    headerTitle: 'Home',
    icon: Home,
    showInSidebar: true,
    sidebarOrder: 0,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: ROUTES.PRODUCTS,
    label: 'Explore New',
    headerTitle: 'Explore',
    icon: Compass,
    showInSidebar: true,
    sidebarOrder: 1,
    showHeaderFiltersRow: true,
    showQuickFilter: true,
  },
  {
    to: ROUTES.PRODUCTS_CLOTHING,
    label: 'Clothing',
    headerTitle: 'Clothing',
    icon: Shirt,
    showInSidebar: true,
    sidebarOrder: 2,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: ROUTES.CART,
    label: 'Cart',
    headerTitle: 'Shopping Cart',
    icon: ShoppingCart,
    showInSidebar: true,
    sidebarOrder: 3,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: ROUTES.ORDERS,
    label: 'My Orders',
    headerTitle: 'My Orders',
    icon: ShoppingBag,
    showInSidebar: true,
    sidebarOrder: 4,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: ROUTES.PROFILE,
    label: 'Profile',
    headerTitle: 'Profile',
    icon: User,
    showInSidebar: false,
    sidebarOrder: 99,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: ROUTES.CHECKOUT,
    label: 'Checkout',
    headerTitle: 'Checkout',
    icon: ShoppingCart,
    showInSidebar: false,
    sidebarOrder: 101,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
];

export const ADMIN_SHELL_ROUTES: AppShellRoute[] = [
  {
    to: ROUTES.ADMIN_DASHBOARD,
    label: 'Dashboard',
    headerTitle: 'Dashboard',
    icon: LayoutDashboard,
    showInSidebar: true,
    sidebarOrder: 0,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: ROUTES.ADMIN_PRODUCTS,
    label: 'Products',
    headerTitle: 'Products',
    icon: Tag,
    showInSidebar: true,
    sidebarOrder: 1,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: ROUTES.ADMIN_CATEGORY,
    label: 'Category',
    headerTitle: 'Category',
    icon: ShoppingBag,
    showInSidebar: true,
    sidebarOrder: 2,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: ROUTES.ADMIN_ORDERS,
    label: 'Orders',
    headerTitle: 'Orders',
    icon: ShoppingCart,
    showInSidebar: true,
    sidebarOrder: 3,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: ROUTES.ADMIN_BRAND,
    label: 'Brand',
    headerTitle: 'Brand',
    icon: Store,
    showInSidebar: true,
    sidebarOrder: 4,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: ROUTES.ADMIN_USERS,
    label: 'Users',
    headerTitle: 'Users',
    icon: Users,
    showInSidebar: true,
    sidebarOrder: 5,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
];

/** Admin messages: reachable via Quick Actions only — not listed in primary sidebar. */
const ADMIN_MESSAGES_ROUTE_META: AppShellRoute = {
  to: ROUTES.ADMIN_MESSAGES,
  label: 'Messages',
  headerTitle: 'Messages',
  icon: MessageCircle,
  showInSidebar: false,
  sidebarOrder: 99,
  showHeaderFiltersRow: false,
  showQuickFilter: false,
};

export const SIDEBAR_NAV_ITEMS: AppShellRoute[] = APP_SHELL_ROUTES.filter(
  (r) => r.showInSidebar,
).sort((a, b) => a.sidebarOrder - b.sidebarOrder);

function matchAdminRoute(pathname: string): AppShellRoute | null {
  const candidates = ADMIN_SHELL_ROUTES.filter(
    (r) => pathname === r.to || pathname.startsWith(`${r.to}/`),
  );
  if (candidates.length === 0) {
    return null;
  }
  return candidates.reduce((best, r) => (r.to.length > best.to.length ? r : best));
}

export function getSidebarNavItems(pathname: string): AppShellRoute[] {
  if (pathname.includes('/admin')) {
    return ADMIN_SHELL_ROUTES.filter((r) => r.showInSidebar).sort(
      (a, b) => a.sidebarOrder - b.sidebarOrder,
    );
  }
  return SIDEBAR_NAV_ITEMS;
}

export function getCurrentRoute(pathname: string): AppShellRoute | null {
  if (pathname.includes('/admin')) {
    if (
      pathname === ROUTES.ADMIN_MESSAGES ||
      pathname.startsWith(`${ROUTES.ADMIN_MESSAGES}/`)
    ) {
      return ADMIN_MESSAGES_ROUTE_META;
    }
    return matchAdminRoute(pathname);
  }
  return APP_SHELL_ROUTES.find((r) => r.to === pathname) ?? null;
}
