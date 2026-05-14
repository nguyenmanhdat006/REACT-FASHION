/** Cart item type definition */
export type CartItem = {
  id: string;
  title: string;
  size: string;
  color: string;
  price: string;
  quantity: number;
  imageSrc: string;
};

/** Initial cart items (mock data) */
export const initialCartItems: CartItem[] = [
  {
    id: 'item-1',
    title: 'Supper Skinny jogger in brown',
    size: 'XL',
    color: 'White',
    price: '$145',
    quantity: 1,
    imageSrc: '/frame-514.png',
  },
  {
    id: 'item-2',
    title: 'Supper Skinny jogger in brown',
    size: 'XL',
    color: 'White',
    price: '$145',
    quantity: 1,
    imageSrc: '/image.png',
  },
  {
    id: 'item-3',
    title: 'Supper Skinny jogger in brown',
    size: 'XL',
    color: 'White',
    price: '$145',
    quantity: 1,
    imageSrc: '/frame-514-2.png',
  },
  {
    id: 'item-4',
    title: 'Supper Skinny jogger in brown',
    size: 'XL',
    color: 'White',
    price: '$145',
    quantity: 1,
    imageSrc: '/frame-514-3.png',
  },
  {
    id: 'item-5',
    title: 'Supper Skinny jogger in brown',
    size: 'XL',
    color: 'White',
    price: '$145',
    quantity: 1,
    imageSrc: '/frame-514-4.png',
  },
  {
    id: 'item-6',
    title: 'Supper Skinny jogger in brown',
    size: 'XL',
    color: 'White',
    price: '$145',
    quantity: 1,
    imageSrc: '/frame-514-5.png',
  },
  {
    id: 'item-7',
    title: 'Supper Skinny jogger in brown',
    size: 'XL',
    color: 'White',
    price: '$145',
    quantity: 1,
    imageSrc: '/frame-514-6.png',
  },
];
