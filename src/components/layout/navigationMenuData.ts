import type { LucideIcon } from 'lucide-react';
import { Compass, Home, Lightbulb, Shirt, Tag } from 'lucide-react';

export type PrimaryNavigationItem = {
  label: string;
  icon: LucideIcon;
  to: string;
};

export const PRIMARY_NAV_ITEMS: PrimaryNavigationItem[] = [
  { label: 'Home', icon: Home, to: '/v2' },
  { label: 'Explore New', icon: Compass, to: '/v2/products' },
  { label: 'Clothing', icon: Shirt, to: '/v2/products#clothing' },
  { label: 'Deal', icon: Tag, to: '/v2/products#deal' },
  { label: 'Inspirations', icon: Lightbulb, to: '/v2/products#inspirations' },
];
