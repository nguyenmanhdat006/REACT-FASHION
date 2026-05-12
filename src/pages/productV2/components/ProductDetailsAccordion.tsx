import { type JSX, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { PRODUCT_DETAILS_COLORS } from "../ProductDetailsV2/constants";

export interface ProductDetailsAccordionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function ProductDetailsAccordion({
  title,
  isOpen,
  onToggle,
  children,
}: ProductDetailsAccordionProps): JSX.Element {
  return (
    <section
      className={cn(
        "flex w-full flex-col items-start gap-1 rounded-2xl border p-4",
        "bg-white"
      )}
      style={{ borderColor: PRODUCT_DETAILS_COLORS.grayscale200 }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between text-left"
      >
        <span className="whitespace-nowrap text-body-medium">
          {title}
        </span>
        <span
          className="inline-flex size-4 items-center justify-center transition-transform duration-200"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <ChevronDown
            size={16}
            color={PRODUCT_DETAILS_COLORS.grayscaleBlack}
          />
        </span>
      </button>
      {isOpen ? children : null}
    </section>
  );
}
