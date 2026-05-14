import { useId, useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type CartItem = {
  id: string;
  title: string;
  size: string;
  color: string;
  price: string;
  quantity: number;
  imageSrc: string;
};

const initialItems: CartItem[] = [
  {
    id: "item-1",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageSrc: "/frame-514.png",
  },
  {
    id: "item-2",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageSrc: "/image.png",
  },
  {
    id: "item-3",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageSrc: "/frame-514-2.png",
  },
  {
    id: "item-4",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageSrc: "/frame-514-3.png",
  },
  {
    id: "item-5",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageSrc: "/frame-514-4.png",
  },
  {
    id: "item-6",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageSrc: "/frame-514-5.png",
  },
  {
    id: "item-7",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageSrc: "/frame-514-6.png",
  },
];

export const CartItemListSection = (): JSX.Element => {
  const checkboxGroupId = useId();
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelected = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setSelectedIds((current) => current.filter((itemId) => itemId !== id));
  };

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
                onCheckedChange={() => toggleSelected(item.id)}
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
                      onClick={() => removeItem(item.id)}
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
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label={`Decrease quantity of ${item.title}`}
                      className="inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto] hover:opacity-70 transition-opacity"
                    >
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <Minus size={14} strokeWidth={2} className="text-black" />
                      </div>
                    </button>

                    <output
                      aria-live="polite"
                      className="relative w-fit mt-[-1px] font-medium text-black text-sm leading-5 whitespace-nowrap"
                    >
                      {item.quantity}
                    </output>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label={`Increase quantity of ${item.title}`}
                      className="inline-flex items-center justify-center relative flex-[0_0_auto] hover:opacity-70 transition-opacity"
                    >
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <Plus size={14} strokeWidth={2} className="text-black" />
                      </div>
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