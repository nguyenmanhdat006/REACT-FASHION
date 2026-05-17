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
import { UserProductDetailsV2 } from '@/pages/UserProductV2/UserProductDetailsV2';
import { useAppDispatch } from '@/store/hooks';
import { clearProductDetail } from '@/store/slices/productsSlice';

type ProductDetailsModalContextValue = {
  openProductDetails: (productId?: string) => void;
  closeProductDetails: () => void;
  isOpen: boolean;
  detailProductId: string | undefined;
};

const ProductDetailsModalContext =
  createContext<ProductDetailsModalContextValue | null>(null);

function ProductDetailsModalPortal({
  open,
  onClose,
  detailProductId,
}: {
  open: boolean;
  onClose: () => void;
  detailProductId: string | undefined;
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
        <UserProductDetailsV2 onClose={onClose} productId={detailProductId} />
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
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [detailProductId, setDetailProductId] = useState<string | undefined>();

  const openProductDetails = useCallback((productId?: string) => {
    setDetailProductId(productId);
    setOpen(true);
  }, []);

  const closeProductDetails = useCallback(() => {
    setOpen(false);
    setDetailProductId(undefined);
    dispatch(clearProductDetail());
  }, [dispatch]);

  const value = useMemo(
    () => ({
      openProductDetails,
      closeProductDetails,
      isOpen: open,
      detailProductId,
    }),
    [open, openProductDetails, closeProductDetails, detailProductId]
  );

  return (
    <ProductDetailsModalContext.Provider value={value}>
      {children}
      <ProductDetailsModalPortal
        open={open}
        onClose={closeProductDetails}
        detailProductId={detailProductId}
      />
    </ProductDetailsModalContext.Provider>
  );
}

/** Consumer hook lives next to provider so the modal feature stays in one module. */
// eslint-disable-next-line react-refresh/only-export-components -- intentional paired export
export function useProductDetailsModal(): ProductDetailsModalContextValue {
  const ctx = useContext(ProductDetailsModalContext);
  if (!ctx) {
    throw new Error(
      'useProductDetailsModal must be used within ProductDetailsModalProvider'
    );
  }
  return ctx;
}
