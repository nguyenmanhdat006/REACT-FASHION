export { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from '@/mocks/product/productSeedData';
export {
  buildSeedCart,
  buildSeedOrders,
} from '@/mocks/storage/mockState';

import { buildSeedCart, buildSeedOrders } from '@/mocks/storage/mockState';

export const MOCK_CART = buildSeedCart();
export const MOCK_ORDERS = buildSeedOrders();
