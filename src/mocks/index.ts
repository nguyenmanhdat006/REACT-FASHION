export {
  findMockLoginAccount,
  MOCK_ADMIN_ACCOUNT,
  MOCK_DEMO_PASSWORD,
  MOCK_LOGIN_ACCOUNTS,
  MOCK_USER_ACCOUNT,
} from './auth/authMockData';
export * from './cart/cartMockData';
export * from './chat/chatMockData';
export * from './dashboard/dashboardMockData';
export * from './ecommerce/ecommerceMockData';
export * from './notification/notificationMockData';
export * from './order/orderMockData';
export * from './payment/paymentMockData';
export * from './product/productMockData';
export * from './review/reviewMockData';
export * from './shipping/shippingMockData';
export * from './storage/mockStorage';
export * from './user/userMockData';

export {
  MOCK_BRANDS,
  MOCK_CATALOG_IMAGE_FILES,
  MOCK_CATEGORIES,
  MOCK_IMAGE_FILES,
  MOCK_PRODUCTS,
  buildProductFromSeed,
  findMockProductById,
  findMockProductImageUrl,
  mockImageUrl,
} from './product/productSeedData';

export {
  buildSeedCart,
  buildSeedOrders,
  buildSeedChatConversations,
  buildSeedChatMessages,
  buildSeedNotifications,
  buildSeedReviews,
  getMockAddresses,
  getMockBrands,
  getMockCart,
  getMockCategories,
  getMockChatConversations,
  getMockChatMessages,
  getMockNotifications,
  getMockOrders,
  getMockPayment,
  getMockProducts,
  getMockReviews,
  getMockUser,
  getMockUsers,
  initMockState,
  recalculateMockCart,
  resetMockState,
  setMockAddresses,
  setMockBrands,
  setMockCart,
  setMockCategories,
  setMockChatConversations,
  setMockChatMessages,
  setMockNotifications,
  setMockOrders,
  setMockPayment,
  setMockProducts,
  setMockReviews,
  setMockUser,
  setMockUsers,
  updateMockCart,
} from './storage/mockState';
