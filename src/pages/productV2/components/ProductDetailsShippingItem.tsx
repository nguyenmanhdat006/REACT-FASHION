import { type JSX } from "react";
import { type LucideIcon } from "lucide-react";

import { PRODUCT_DETAILS_COLORS } from "../ProductDetailsV2/constants";

export interface ProductDetailsShippingItemProps {
  title: string;
  value: string;
  Icon: LucideIcon;
  gridArea: string;
}

export function ProductDetailsShippingItem({
  title,
  value,
  Icon,
  gridArea,
}: ProductDetailsShippingItemProps): JSX.Element {
  return (
    <div
      className="inline-flex items-center justify-start gap-2"
      style={{ gridArea }}
    >
      <div
        className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full p-1"
        style={{ background: PRODUCT_DETAILS_COLORS.grayscale100 }}
      >
        <Icon size={24} color={PRODUCT_DETAILS_COLORS.grayscaleBlack} />
      </div>
      <div className="inline-flex flex-col items-start">
        <span
          className="block text-caption-sm-regular"
          style={{ color: PRODUCT_DETAILS_COLORS.muted }}
        >
          {title}
        </span>
        <span className="block text-caption-lg-medium leading-5 text-black">
          {value}
        </span>
      </div>
    </div>
  );
}
