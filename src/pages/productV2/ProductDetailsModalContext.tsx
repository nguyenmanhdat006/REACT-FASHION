import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
  type ReactPortal,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

import { ProductDetails } from '@/pages/productV2/ProductDetailsV2';

type ProductDetailsModalContextValue = {
  openProductDetails: () => void;
  closeProductDetails: () => void;
  isOpen: boolean;
};

const ProductDetailsModalContext =
  createContext<ProductDetailsModalContextValue | null>(null);

function ProductDetailsModalPortal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): ReactPortal | null {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4',
        'backdrop-blur-[2px]'
      )}
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-details-title"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-[min(100%,912px)] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <ProductDetails onClose={onClose} />
      </div>
    </div>,
    document.body
  );
}

export function ProductDetailsModalProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const openProductDetails = useCallback(() => setOpen(true), []);
  const closeProductDetails = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({
      openProductDetails,
      closeProductDetails,
      isOpen: open,
    }),
    [open, openProductDetails, closeProductDetails]
  );

  return (
    <ProductDetailsModalContext.Provider value={value}>
      {children}
      <ProductDetailsModalPortal open={open} onClose={closeProductDetails} />
    </ProductDetailsModalContext.Provider>
  );
}

export function useProductDetailsModal(): ProductDetailsModalContextValue {
  const ctx = useContext(ProductDetailsModalContext);
  if (!ctx) {
    throw new Error(
      'useProductDetailsModal must be used within ProductDetailsModalProvider'
    );
  }
  return ctx;
}
