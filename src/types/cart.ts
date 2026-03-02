export enum CartStatus {
  ACTIVE = 'ACTIVE',
  ABANDONED = 'ABANDONED',
  CONVERTED_TO_ORDER = 'CONVERTED_TO_ORDER',
}

export interface CartItem {
  id: string;
  productId: string;
  productVariantId?: string;
  productName: string;
  productImageUrl: string;
  quantity: number;
  price: number;
  total: number;
  inStock: boolean;
  createdAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  status: CartStatus;
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  productVariantId?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
}
