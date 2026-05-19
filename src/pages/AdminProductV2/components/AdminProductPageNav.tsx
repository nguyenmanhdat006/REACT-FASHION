import { ChevronLeft, Pencil } from 'lucide-react';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconButton } from '@/components/buttons/IconButton';
import { ROUTES } from '@/constants';

export type AdminProductPageNavProps = {
  productId: string;
  variant: 'read' | 'edit';
};

export function AdminProductPageNav({
  productId,
  variant,
}: AdminProductPageNavProps): JSX.Element {
  const navigate = useNavigate();

  const backTarget =
    variant === 'read'
      ? ROUTES.ADMIN_PRODUCTS
      : ROUTES.ADMIN_PRODUCT_DETAIL(productId);

  const backAriaLabel =
    variant === 'read' ? 'Back to product list' : 'Back to product detail';

  return (
    <nav
      className="mb-2 flex items-center justify-start gap-2"
      aria-label="Product page navigation"
    >
      <IconButton
        icon={ChevronLeft}
        ariaLabel={backAriaLabel}
        variant="outline"
        className="rounded-lg px-3 py-3 bg-white hover:bg-white/60"
        iconClassName="size-5"
        onClick={() => navigate(backTarget)}
      />
      {variant === 'read' ? (
        <IconButton
          icon={Pencil}
          ariaLabel="Edit this product"
          variant="outline"
          className="rounded-lg px-3 py-3 bg-white [&_svg]:text-white bg-secondary-400 hover:bg-secondary-500"
          iconClassName="size-5"
          onClick={() => navigate(ROUTES.ADMIN_PRODUCT_EDIT(productId))}
        />
      ) : null}
    </nav>
  );
}
