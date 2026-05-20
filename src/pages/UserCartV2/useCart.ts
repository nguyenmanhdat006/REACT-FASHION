import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { removeCartItemThunk } from '@/store/thunks/cartThunks';
import type { CartItem as V2CartItem } from './cartTypes';
import { useCart as useGlobalCart } from '@/hooks/cart/useCart';

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

  const [localItems, setLocalItems] = useState<V2CartItem[]>([]);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);
  // Removed backfill effect for product images

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
      try {
        setLocalItems((cur) => cur.filter((it) => it.id !== id));

        const result = await removeItemGlobal(id);

        const fetchRes = await fetchCart();
        const fetchedItems = (fetchRes as any)?.payload?.data?.items as
          | { id: string }[]
          | undefined;

        const removedInFetch = Array.isArray(fetchedItems)
          ? !fetchedItems.some((it) => it.id === id)
          : false;

        if (removeCartItemThunk.fulfilled.match(result) || removedInFetch) {
          toast.success('Removed from cart');
        } else if (removeCartItemThunk.rejected.match(result)) {
          const payloadMsg = (result as any).payload;
          const errMsg = payloadMsg || (result as any).error?.message || 'Failed to remove item';
          toast.error(errMsg);
        } else {
          toast.error('Failed to remove item');
        }
      } catch (e) {
        toast.error('Failed to remove item');
      } finally {
        setSelectedIds((current) => current.filter((itemId) => itemId !== id));
        void fetchCart();
      }
    },
    [removeItemGlobal]
  );

  return {
    items: localItems,
    selectedIds,
    toggleSelected,
    updateQuantity,
    removeItem,
    isLoading,
    rawCart: cart,
  };
};
