import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CartItem as V2CartItem } from './cartTypes';
import { useCart as useGlobalCart } from '@/hooks/cart/useCart';

// Adapter hook: maps API-backed cart to v2 UI shape
export const useCart = () => {
  const { cart, fetchCart, updateQuantity: updateQuantityGlobal, removeItem: removeItemGlobal, isLoading } = useGlobalCart();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  const items = useMemo<V2CartItem[]>(() => {
    if (!cart?.items) return [];

    return cart.items.map((it) => ({
      id: it.id,
      title: it.productName,
      size: '',
      color: '',
      price: `$${it.price}`,
      quantity: it.quantity,
      imageSrc: it.productImageUrl,
    }));
  }, [cart?.items]);

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
    );
  }, []);

  const updateQuantity = useCallback(
    async (id: string, delta: number) => {
      const current = cart?.items.find((it) => it.id === id);
      if (!current) return;
      const newQuantity = Math.max(1, current.quantity + delta);
      await updateQuantityGlobal(id, newQuantity);
    },
    [cart?.items, updateQuantityGlobal]
  );

  const removeItem = useCallback(
    async (id: string) => {
      await removeItemGlobal(id);
      setSelectedIds((current) => current.filter((itemId) => itemId !== id));
    },
    [removeItemGlobal]
  );

  return {
    items,
    selectedIds,
    toggleSelected,
    updateQuantity,
    removeItem,
    isLoading,
    rawCart: cart,
  };
};
