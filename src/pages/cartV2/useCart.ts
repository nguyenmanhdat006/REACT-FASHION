import { useState } from 'react';
import type { CartItem } from './cartTypes';
import { initialCartItems } from './cartTypes';

/**
 * Custom hook to manage cart state and operations
 * Handles item selection, quantity updates, and item removal
 */
export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelected = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setSelectedIds((current) => current.filter((itemId) => itemId !== id));
  };

  return {
    items,
    selectedIds,
    toggleSelected,
    updateQuantity,
    removeItem,
  };
};
