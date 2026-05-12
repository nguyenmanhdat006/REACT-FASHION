import { useState, type JSX } from "react";
import { Heart } from "lucide-react";

import { IconButton } from "@/components/buttons/IconButton";
import { LabelButton } from "@/components/buttons/LabelButton";
import { cn } from "@/lib/utils";

import {
  SHIPPING_GRID_AREAS,
  SHIPPING_ITEMS,
  SIZE_OPTIONS,
} from "../constants";
import { ProductDetailsAccordion } from "../../components/ProductDetailsAccordion";
import { ProductDetailsShippingItem } from "../../components/ProductDetailsShippingItem";

export default function ProductDetailsRightSection(): JSX.Element {
  const [selectedSize, setSelectedSize] = useState("S");
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isShippingOpen, setIsShippingOpen] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="flex min-w-0 flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex w-full shrink-0 flex-col items-start gap-2">
        <h1 className="m-0 whitespace-nowrap text-h5-medium leading-7 text-black">
          Supper Skinny jogger in brown
        </h1>
        <p className="m-0 whitespace-nowrap text-h5-medium leading-7 text-black">
          $36
        </p>
      </div>

      <div className="whitespace-nowrap text-caption-lg-regular leading-5 text-[#666666]">
        Select Size
      </div>

      <div
        role="group"
        aria-label="Select product size"
        className="flex min-w-0 w-full shrink-0 items-center gap-2 overflow-x-auto"
      >
        {SIZE_OPTIONS.map((size) => {
          const selected = selectedSize === size.label;
          return (
            <LabelButton
              key={size.label}
              type="button"
              label={size.label}
              disabled={!size.available}
              tone={size.available && selected ? "primary" : "default"}
              aria-label={`Size ${size.label}${!size.available ? " unavailable" : ""}`}
              aria-pressed={size.available ? selected : undefined}
              onClick={() => {
                if (size.available) setSelectedSize(size.label);
              }}
            />
          );
        })}
      </div>

      <div className="flex w-full shrink-0 items-center gap-2">
        <LabelButton
          label="Add To cart"
          ariaLabel="Add product to cart"
          tone="default"
          className="flex-1"
        />

        <LabelButton
          label="Buy Now"
          ariaLabel="Buy now"
          tone="primary"
          className="flex-1"
        />

        <IconButton
          icon={Heart}
          ariaLabel={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={isWishlisted}
          onClick={() => setIsWishlisted((prev) => !prev)}
          className={cn(
            "shrink-0 rounded-[60px] bg-[#f5f5f5] px-4 py-4 hover:bg-[#f5f5f5]",
            "shadow-none focus-visible:ring-0"
          )}
          iconClassName={cn(
            "size-6 transition-[fill,color] duration-200",
            isWishlisted
              ? "fill-[#e53935] text-[#e53935]"
              : "fill-none text-gray-black"
          )}
        />
      </div>

      <ProductDetailsAccordion
        title="Description"
        isOpen={isDescriptionOpen}
        onToggle={() => setIsDescriptionOpen((prev) => !prev)}
      >
        <p className="w-full text-caption-lg-regular">
          A hoodie is a casual and comfortable sweatshirt made from soft, warm
          fabric, typically featuring a front pocket and an adjustable drawstring
          hood. It is designed for everyday wear, providing both style and
          practicality.
        </p>
      </ProductDetailsAccordion>

      <ProductDetailsAccordion
        title="Shipping"
        isOpen={isShippingOpen}
        onToggle={() => setIsShippingOpen((prev) => !prev)}
      >
        <div
          className="box-border grid w-full grid-cols-2 gap-x-auto gap-y-2 px-2"
          style={{
            gridTemplateRows: "auto auto",
          }}
        >
          {SHIPPING_ITEMS.map((item, index) => (
            <ProductDetailsShippingItem
              key={item.title}
              title={item.title}
              value={item.value}
              Icon={item.Icon}
              gridArea={SHIPPING_GRID_AREAS[index] ?? SHIPPING_GRID_AREAS[0]}
            />
          ))}
        </div>
      </ProductDetailsAccordion>
    </div>
  );
}
