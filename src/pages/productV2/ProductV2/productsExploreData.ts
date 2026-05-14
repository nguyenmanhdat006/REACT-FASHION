import { IMAGES } from '@/constants/images';

export type ExploreCategoryId = 'all' | 'men' | 'women';

export type ExploreProductTile = {
  id: string;
  imageUrl: string;
  title: string;
  price: string;
  category: Exclude<ExploreCategoryId, 'all'>;
};

export const EXPLORE_PRODUCTS: ExploreProductTile[] = [
  {
    id: 'e1',
    imageUrl: IMAGES.PRODUCT_DEMO_1,
    title: 'Supper Skinny jogger in brown',
    price: '$38',
    category: 'men',
  },
  {
    id: 'e2',
    imageUrl: IMAGES.PRODUCT_DEMO_2,
    title: 'Supper Skinny jogger in brown',
    price: '$38',
    category: 'women',
  },
  {
    id: 'e3',
    imageUrl: IMAGES.PRODUCT_DEMO_1,
    title: 'Relaxed fit hoodie in charcoal',
    price: '$42',
    category: 'men',
  },
  {
    id: 'e4',
    imageUrl: IMAGES.PRODUCT_DEMO_2,
    title: 'Lightweight trench in sand',
    price: '$56',
    category: 'women',
  },
  {
    id: 'e5',
    imageUrl: IMAGES.PRODUCT_DEMO_2,
    title: 'Cropped puffer jacket',
    price: '$64',
    category: 'women',
  },
  {
    id: 'e6',
    imageUrl: IMAGES.PRODUCT_DEMO_1,
    title: 'Slim cargo pants in olive',
    price: '$44',
    category: 'men',
  },
  {
    id: 'e7',
    imageUrl: IMAGES.PRODUCT_DEMO_1,
    title: 'Merino crewneck sweater',
    price: '$48',
    category: 'men',
  },
  {
    id: 'e8',
    imageUrl: IMAGES.PRODUCT_DEMO_2,
    title: 'Pleated midi skirt',
    price: '$36',
    category: 'women',
  },
];
