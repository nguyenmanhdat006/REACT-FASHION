import type { LucideIcon } from 'lucide-react';
import {
  Compass,
  Home,
  LayoutDashboard,
  Lightbulb,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Store,
  Tag,
  User,
  Users,
} from 'lucide-react';

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
    to: '/v2',
    label: 'Home',
    headerTitle: 'Home',
    icon: Home,
    showInSidebar: true,
    sidebarOrder: 0,
    showHeaderFiltersRow: true,
    showQuickFilter: false,
  },
  {
    to: '/v2/products',
    label: 'Explore New',
    headerTitle: 'Explore',
    icon: Compass,
    showInSidebar: true,
    sidebarOrder: 1,
    showHeaderFiltersRow: true,
    showQuickFilter: true,
  },
  {
    to: '/v2/products/clothing',
    label: 'Clothing',
    headerTitle: 'Clothing',
    icon: Shirt,
    showInSidebar: true,
    sidebarOrder: 2,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: '/v2/products/deal',
    label: 'Deal',
    headerTitle: 'Deal',
    icon: Tag,
    showInSidebar: true,
    sidebarOrder: 3,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: '/v2/products/inspirations',
    label: 'Inspirations',
    headerTitle: 'Inspirations',
    icon: Lightbulb,
    showInSidebar: true,
    sidebarOrder: 4,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: '/v2/profile',
    label: 'Profile',
    headerTitle: 'Profile',
    icon: User,
    showInSidebar: false,
    sidebarOrder: 99,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: '/v2/cart/v2',
    label: 'Shopping Cart',
    headerTitle: 'Shopping Cart',
    icon: ShoppingCart,
    showInSidebar: false,
    sidebarOrder: 100,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
];

export const ADMIN_SHELL_ROUTES: AppShellRoute[] = [
  {
    to: '/v2/admin',
    label: 'Dashboard',
    headerTitle: 'Dashboard',
    icon: LayoutDashboard,
    showInSidebar: true,
    sidebarOrder: 0,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: '/v2/admin/products',
    label: 'Products',
    headerTitle: 'Products',
    icon: Tag,
    showInSidebar: true,
    sidebarOrder: 1,
    showHeaderFiltersRow: true,
    showQuickFilter: false,
  },
  {
    to: '/v2/admin/category',
    label: 'Category',
    headerTitle: 'Category',
    icon: ShoppingBag,
    showInSidebar: true,
    sidebarOrder: 2,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: '/v2/admin/orders',
    label: 'Orders',
    headerTitle: 'Orders',
    icon: ShoppingCart,
    showInSidebar: true,
    sidebarOrder: 3,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: '/v2/admin/brand',
    label: 'Brand',
    headerTitle: 'Brand',
    icon: Store,
    showInSidebar: true,
    sidebarOrder: 4,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
  {
    to: '/v2/admin/users',
    label: 'Users',
    headerTitle: 'Users',
    icon: Users,
    showInSidebar: true,
    sidebarOrder: 5,
    showHeaderFiltersRow: false,
    showQuickFilter: false,
  },
];

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
    return matchAdminRoute(pathname);
  }
  return APP_SHELL_ROUTES.find((r) => r.to === pathname) ?? null;
}
