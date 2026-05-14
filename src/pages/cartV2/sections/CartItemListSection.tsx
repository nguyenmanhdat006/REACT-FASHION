import { useId } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { CartItem } from '../cartTypes';

type CartItemListSectionProps = {
  items: CartItem[];
  selectedIds: string[];
  onToggleSelected: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
};

export const CartItemListSection = ({
  items,
  selectedIds,
  onToggleSelected,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemListSectionProps): JSX.Element => {
  const checkboxGroupId = useId();

  return (
    <section
      aria-label="Cart item list"
      className="flex flex-col items-center px-8 py-0 relative flex-1 self-stretch grow bg-white rounded-2xl overflow-hidden border border-solid border-gray-200 overflow-y-scroll"
    >
      <div
        role="list"
        aria-labelledby={checkboxGroupId}
        className="relative self-stretch w-full"
      >
        <span id={checkboxGroupId} className="sr-only">
          Shopping cart items
        </span>

        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);

          return (
            <article
              key={item.id}
              role="listitem"
              className="flex items-center gap-4 px-0 py-4 relative self-stretch w-full flex-[0_0_auto] bg-white border-b border-solid border-gray-200"
            >
              {/* Checkbox */}
              <Checkbox
                id={`checkbox-${item.id}`}
                checked={isSelected}
                onCheckedChange={() => onToggleSelected(item.id)}
                aria-label={`Select ${item.title}`}
                className="h-6 w-6 rounded-lg border border-gray-200 data-[state=checked]:bg-black data-[state=checked]:border-black shrink-0"
              />

              {/* Product Image */}
              <div
                className="relative w-[100px] h-[100px] shrink-0 rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: `url(${item.imageSrc})` }}
                aria-hidden="true"
              />

              {/* Content */}
              <div className="flex flex-col items-start justify-between relative flex-1 self-stretch grow min-w-0">
                {/* Top: title + remove */}
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                    <h3 className="relative w-fit font-medium text-black text-sm leading-5 whitespace-nowrap truncate">
                      {item.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Remove ${item.title} from cart`}
                      className="relative w-7 h-[31px] flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
                    >
                      <X size={18} strokeWidth={1.5} className="text-black" />
                    </button>
                  </div>

                  {/* Size */}
                  <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                    <span className="relative w-fit mt-[-1px] text-black text-xs leading-4 whitespace-nowrap">
                      Size:
                    </span>
                    <span className="relative w-fit mt-[-1px] text-[#666666] text-xs leading-4 whitespace-nowrap">
                      {item.size}
                    </span>
                  </div>

                  {/* Color */}
                  <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                    <span className="text-black relative w-fit mt-[-1px] text-xs leading-4 whitespace-nowrap">
                      Color:
                    </span>
                    <span className="text-[#666666] relative w-fit mt-[-1px] text-xs leading-4 whitespace-nowrap">
                      {item.color}
                    </span>
                  </div>
                </div>

                {/* Bottom: price + quantity */}
                <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                  <span className="text-sm leading-5 relative w-fit font-medium text-black whitespace-nowrap">
                    {item.price}
                  </span>

                  {/* Quantity Controls */}
                  <div
                    className="inline-flex items-center gap-4 p-1 relative flex-[0_0_auto] bg-gray-50 rounded-2xl overflow-hidden"
                    aria-label={`Quantity controls for ${item.title}`}
                  >
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      aria-label={`Decrease quantity for ${item.title}`}
                      className="relative w-fit h-[26px] flex items-center justify-center hover:opacity-70 transition-opacity"
                    >
                      <Minus size={16} className="text-black" />
                    </button>

                    <span className="text-xs font-medium text-black">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      aria-label={`Increase quantity for ${item.title}`}
                      className="relative w-fit h-[26px] flex items-center justify-center hover:opacity-70 transition-opacity"
                    >
                      <Plus size={16} className="text-black" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
