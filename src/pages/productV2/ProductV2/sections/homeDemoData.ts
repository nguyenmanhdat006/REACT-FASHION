import type { LucideIcon } from 'lucide-react';
import {
  Compass,
  Home,
  Lightbulb,
  LogOut,
  Shirt,
  Tag,
} from 'lucide-react';

import { IMAGES } from '@/constants/images';

import type { ActionIconVariant } from './ActionIconButton';

export type PrimaryNavItem = {
  label: string;
  icon: LucideIcon;
  active: boolean;
};

export type LastOrderItem = {
  label: string;
  imageUrl: string;
};

export type PromoCardModel =
  | {
      id: string;
      layout: 'discountCta';
      title: string;
      buttonText: string;
      imageUrl: string;
      titleAsParagraph?: boolean;
    }
  | {
      id: string;
      layout: 'headlineSubtitle';
      title: string;
      subtitle: string;
      actionIcon: ActionIconVariant;
      imageUrl: string;
      rowAlign?: boolean;
      bordered?: boolean;
    }
  | {
      id: string;
      layout: 'offerFavorite';
      buttonText: string;
      imageUrl: string;
      bordered?: boolean;
    }
  | {
      id: string;
      layout: 'prelineTitleExternal';
      title: string;
      imageUrl: string;
      bordered?: boolean;
    };

export type ProductTile = {
  id: string;
  imageUrl: string;
  title: string;
  price: string;
};

export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { label: 'Home', icon: Home, active: true },
  { label: 'Explore New', icon: Compass, active: false },
  { label: 'Clothing', icon: Shirt, active: false },
  { label: 'Deal', icon: Tag, active: false },
  { label: 'Inspirations', icon: Lightbulb, active: false },
];

export const LAST_ORDERS: LastOrderItem[] = [
  { label: 'Thang dep c...', imageUrl: IMAGES.PRODUCT_DEMO_1 },
  { label: 'Huddie', imageUrl: IMAGES.PRODUCT_DEMO_2 },
];

export const SIDEBAR_LOGOUT_ICON = LogOut;

export const LEFT_TOP_PROMOS: PromoCardModel[] = [
  {
    id: 'discount-main',
    layout: 'discountCta',
    title: 'GET UP TO 50% OFF',
    buttonText: 'Get Discount',
    imageUrl: IMAGES.DISCOUNT_BANNER,
    titleAsParagraph: true,
  },
  {
    id: 'summer-weekend',
    layout: 'headlineSubtitle',
    title: "Summer's Weekend",
    subtitle: 'Keep it casual',
    actionIcon: 'external',
    imageUrl: IMAGES.DISCOUNT_BANNER_2,
    rowAlign: true,
    bordered: true,
  },
];

export const LEFT_BOTTOM_PROMOS: PromoCardModel[] = [
  {
    id: 'offer-now',
    layout: 'offerFavorite',
    buttonText: 'Offer Now!',
    imageUrl: IMAGES.OFFER_BANNER,
    bordered: true,
  },
  {
    id: 'split-discount',
    layout: 'prelineTitleExternal',
    title: 'GET UP TO\n50% OFF',
    imageUrl: IMAGES.PROMO_TILE,
    bordered: true,
  },
];

export const FEATURED_PROMO: PromoCardModel = {
  id: 'bold-fashion',
  layout: 'headlineSubtitle',
  title: 'Bring Bold Fashion',
  subtitle: 'Layers on Layers',
  actionIcon: 'external',
  imageUrl: IMAGES.RIGHT_BRAND_BANNER,
  rowAlign: true,
  bordered: true,
};

export const PRODUCT_TILES: ProductTile[] = [
  {
    id: 'p1',
    imageUrl: IMAGES.PRODUCT_DEMO_1,
    title: 'Supper Skinny jogger in brown',
    price: '$36',
  },
  {
    id: 'p2',
    imageUrl: IMAGES.PRODUCT_DEMO_2,
    title: 'Supper Skinny jogger in brown',
    price: '$36',
  },
];
