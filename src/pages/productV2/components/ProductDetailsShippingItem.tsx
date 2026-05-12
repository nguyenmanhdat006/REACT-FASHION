import { type JSX } from "react";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ProductDetailsShippingItemProps {
  title: string;
  value: string;
  Icon: LucideIcon;
  className?: string;
}

export function ProductDetailsShippingItem({
  title,
  value,
  Icon,
  className,
}: ProductDetailsShippingItemProps): JSX.Element {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-start gap-2",
        className
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 p-1">
        <Icon className="size-6 text-gray-black" aria-hidden />
      </div>
      <div className="inline-flex flex-col items-start">
        <span className="block text-caption-sm-regular text-gray-500">
          {title}
        </span>
        <span className="block text-caption-lg-medium leading-5 text-black">
          {value}
        </span>
      </div>
    </div>
  );
}
