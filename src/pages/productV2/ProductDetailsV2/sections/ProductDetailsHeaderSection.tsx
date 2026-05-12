import { type JSX } from "react";
import { X } from "lucide-react";

import { IconButton } from "@/components/buttons/IconButton";

export default function ProductDetailsHeaderSection({
  onClose,
}: {
  onClose?: () => void;
}): JSX.Element {
  return (
    <header className="flex w-full flex-col items-end justify-center">
      {onClose ? (
        <div className="inline-flex items-center gap-2 overflow-hidden rounded-[60px] p-4">
          <IconButton
            icon={X}
            ariaLabel="Close product details"
            onClick={onClose}
            className="rounded-md bg-transparent px-0.5 py-0.5 hover:bg-transparent"
            iconClassName="size-6 text-gray-black"
          />
        </div>
      ) : null}
    </header>
  );
}
