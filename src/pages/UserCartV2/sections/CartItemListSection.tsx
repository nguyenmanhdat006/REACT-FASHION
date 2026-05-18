import { useId } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
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
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <div
        role="list"
        aria-labelledby={checkboxGroupId}
        className="max-h-[calc(100vh-9rem)] overflow-y-auto"
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
              className="flex items-center gap-4 border-b border-gray-200 px-4 py-4 transition-colors last:border-b-0 hover:bg-gray-50 sm:px-6"
            >
              <Checkbox
                id={`checkbox-${item.id}`}
                checked={isSelected}
                onCheckedChange={() => onToggleSelected(item.id)}
                aria-label={`Select ${item.title}`}
                className="h-6 w-6 shrink-0 rounded-md border border-gray-200 data-[state=checked]:border-primary-900 data-[state=checked]:bg-primary-900"
              />

              <div
                className="relative h-20 w-20 shrink-0 rounded-2xl bg-cover bg-center ring-1 ring-gray-100"
                style={{ backgroundImage: `url(${item.imageSrc})` }}
                aria-hidden="true"
              />

              <div className="flex flex-col items-start justify-between relative flex-1 self-stretch grow min-w-0">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                    <h3 className="relative w-fit truncate text-body-medium text-gray-900">
                      {item.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Remove ${item.title} from cart`}
                      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-destructive transition-colors hover:bg-red-50 hover:text-destructive/80"
                    >
                      <Trash2 size={18} strokeWidth={1.75} />
                    </button>
                  </div>

                  <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto] text-caption-sm-regular text-gray-500">
                    <span className="relative w-fit whitespace-nowrap">
                      Size:
                    </span>
                    <span className="relative w-fit whitespace-nowrap">
                      {item.size}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto] text-caption-sm-regular text-gray-500">
                    <span className="relative w-fit whitespace-nowrap">
                      Color:
                    </span>
                    <span className="relative w-fit whitespace-nowrap">
                      {item.color}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                  <span className="relative w-fit text-body-medium font-medium text-gray-900 whitespace-nowrap">
                    {item.price}
                  </span>

                  <div
                    className="inline-flex items-center gap-3 rounded-2xl bg-gray-50 px-2 py-1 text-gray-900"
                    aria-label={`Quantity controls for ${item.title}`}
                  >
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      aria-label={`Decrease quantity for ${item.title}`}
                      className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="min-w-4 text-center text-body-medium font-medium">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      aria-label={`Increase quantity for ${item.title}`}
                      className="flex h-6 w-6 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                    >
                      <Plus size={16} />
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
