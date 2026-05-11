import type { LucideIcon } from 'lucide-react';
import { Compass, Home, Lightbulb, Shirt, Tag, User } from 'lucide-react';

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
];

export const SIDEBAR_NAV_ITEMS: AppShellRoute[] = APP_SHELL_ROUTES.filter(
  (r) => r.showInSidebar,
).sort((a, b) => a.sidebarOrder - b.sidebarOrder);

export function getCurrentRoute(pathname: string): AppShellRoute | null {
  return APP_SHELL_ROUTES.find((r) => r.to === pathname) ?? null;
}
