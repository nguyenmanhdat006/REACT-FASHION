import { useId, useState } from "react";
import image1 from "./image.svg";
import vector from "./vector.svg";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";
import vector5 from "./vector-5.svg";
import vector6 from "./vector-6.svg";
import vector7 from "./vector-7.svg";
import vector8 from "./vector-8.svg";
import vector9 from "./vector-9.svg";
import vector10 from "./vector-10.svg";
import vector11 from "./vector-11.svg";
import vector12 from "./vector-12.svg";
import vector13 from "./vector-13.svg";
import vector14 from "./vector-14.svg";
import vector15 from "./vector-15.svg";
import vector16 from "./vector-16.svg";
import vector17 from "./vector-17.svg";
import vector18 from "./vector-18.svg";
import vector19 from "./vector-19.svg";
import vector20 from "./vector-20.svg";

type CartItem = {
  id: string;
  title: string;
  size: string;
  color: string;
  price: string;
  quantity: number;
  imageClassName: string;
  removeIcon: string;
  decrementIcon: string;
  incrementIcon: string;
};

const initialItems: CartItem[] = [
  {
    id: "item-1",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageClassName: "bg-[url(/frame-514.png)]",
    removeIcon: vector,
    decrementIcon: vector2,
    incrementIcon: image1,
  },
  {
    id: "item-2",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageClassName: "bg-[url(/image.png)]",
    removeIcon: vector3,
    decrementIcon: vector5,
    incrementIcon: vector4,
  },
  {
    id: "item-3",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageClassName: "bg-[url(/frame-514-2.png)]",
    removeIcon: vector6,
    decrementIcon: vector8,
    incrementIcon: vector7,
  },
  {
    id: "item-4",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageClassName: "bg-[url(/frame-514-3.png)]",
    removeIcon: vector9,
    decrementIcon: vector11,
    incrementIcon: vector10,
  },
  {
    id: "item-5",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageClassName: "bg-[url(/frame-514-4.png)]",
    removeIcon: vector12,
    decrementIcon: vector14,
    incrementIcon: vector13,
  },
  {
    id: "item-6",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageClassName: "bg-[url(/frame-514-5.png)]",
    removeIcon: vector15,
    decrementIcon: vector17,
    incrementIcon: vector16,
  },
  {
    id: "item-7",
    title: "Supper Skinny jogger in brown",
    size: "XL",
    color: "White",
    price: "$145",
    quantity: 1,
    imageClassName: "bg-[url(/frame-514-6.png)]",
    removeIcon: vector18,
    decrementIcon: vector20,
    incrementIcon: vector19,
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
        : [...current, id],
    );
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
            }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setSelectedIds((current) => current.filter((itemId) => itemId !== id));
  };

  return (
    <section
      aria-label="Cart item list"
      className="flex flex-col items-center px-8 py-0 relative flex-1 self-stretch grow bg-grayscalewhite rounded-2xl overflow-hidden border border-solid border-grayscale-200 overflow-y-scroll"
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
              className="flex items-center gap-4 px-0 py-4 relative self-stretch w-full flex-[0_0_auto] bg-grayscalewhite border-b [border-bottom-style:solid] border-grayscale-200"
            >
              <label className="relative flex h-6 w-6 cursor-pointer items-center justify-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelected(item.id)}
                  aria-label={`Select ${item.title}`}
                  className="peer absolute inset-0 m-0 h-6 w-6 cursor-pointer appearance-none rounded-lg border border-solid border-grayscale-200 bg-white"
                />
                <span className="pointer-events-none absolute inset-[5px] rounded-[4px] bg-black opacity-0 transition-opacity peer-checked:opacity-100" />
              </label>
              <div
                className={`relative w-[100px] h-[100px] rounded-2xl aspect-[1] ${item.imageClassName} bg-cover bg-[50%_50%]`}
                aria-hidden="true"
              />
              <div className="flex flex-col items-start justify-between relative flex-1 self-stretch grow">
                <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                    <h3 className="relative w-fit font-medium-body-base-medium font-[number:var(--medium-body-base-medium-font-weight)] text-black text-[length:var(--medium-body-base-medium-font-size)] tracking-[var(--medium-body-base-medium-letter-spacing)] leading-[var(--medium-body-base-medium-line-height)] whitespace-nowrap [font-style:var(--medium-body-base-medium-font-style)]">
                      {item.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.title} from cart`}
                      className="relative w-7 h-[31px]"
                    >
                      <div className="relative top-[7px] left-0.5 w-6 h-6 flex">
                        <img
                          className="flex-1 w-[18px]"
                          alt=""
                          src={item.removeIcon}
                        />
                      </div>
                    </button>
                  </div>
                  <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] font-regular-caption-large-regular font-[number:var(--regular-caption-large-regular-font-weight)] text-black text-[length:var(--regular-caption-large-regular-font-size)] tracking-[var(--regular-caption-large-regular-letter-spacing)] leading-[var(--regular-caption-large-regular-line-height)] whitespace-nowrap [font-style:var(--regular-caption-large-regular-font-style)]">
                      Size:
                    </div>
                    <div className="relative w-fit mt-[-1.00px] font-regular-caption-large-regular font-[number:var(--regular-caption-large-regular-font-weight)] text-[#666666] text-[length:var(--regular-caption-large-regular-font-size)] tracking-[var(--regular-caption-large-regular-letter-spacing)] leading-[var(--regular-caption-large-regular-line-height)] whitespace-nowrap [font-style:var(--regular-caption-large-regular-font-style)]">
                      {item.size}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                    <div className="text-black relative w-fit mt-[-1.00px] font-regular-caption-large-regular font-[number:var(--regular-caption-large-regular-font-weight)] text-[length:var(--regular-caption-large-regular-font-size)] tracking-[var(--regular-caption-large-regular-letter-spacing)] leading-[var(--regular-caption-large-regular-line-height)] whitespace-nowrap [font-style:var(--regular-caption-large-regular-font-style)]">
                      Color:
                    </div>
                    <div className="text-[#666666] relative w-fit mt-[-1.00px] font-regular-caption-large-regular font-[number:var(--regular-caption-large-regular-font-weight)] text-[length:var(--regular-caption-large-regular-font-size)] tracking-[var(--regular-caption-large-regular-letter-spacing)] leading-[var(--regular-caption-large-regular-line-height)] whitespace-nowrap [font-style:var(--regular-caption-large-regular-font-style)]">
                      {item.color}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                  <div className="text-[length:var(--medium-body-base-medium-font-size)] leading-[var(--medium-body-base-medium-line-height)] relative w-fit font-medium-body-base-medium font-[number:var(--medium-body-base-medium-font-weight)] text-black tracking-[var(--medium-body-base-medium-letter-spacing)] whitespace-nowrap [font-style:var(--medium-body-base-medium-font-style)]">
                    {item.price}
                  </div>
                  <div
                    className="inline-flex items-center gap-4 p-1 relative flex-[0_0_auto] bg-grayscale-50 rounded-2xl overflow-hidden"
                    aria-label={`Quantity controls for ${item.title}`}
                  >
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label={`Decrease quantity of ${item.title}`}
                      className="inline-flex items-center justify-center gap-2.5 relative flex-[0_0_auto]"
                    >
                      <div className="relative w-6 h-6">
                        <img
                          className="h-[53.12%] top-[46.88%] absolute w-[87.50%] left-[12.50%]"
                          alt=""
                          src={item.decrementIcon}
                        />
                      </div>
                    </button>
                    <output
                      aria-live="polite"
                      className="relative w-fit mt-[-1.00px] font-medium-body-base-medium font-[number:var(--medium-body-base-medium-font-weight)] text-black text-[length:var(--medium-body-base-medium-font-size)] tracking-[var(--medium-body-base-medium-letter-spacing)] leading-[var(--medium-body-base-medium-line-height)] whitespace-nowrap [font-style:var(--medium-body-base-medium-font-style)]"
                    >
                      {item.quantity}
                    </output>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label={`Increase quantity of ${item.title}`}
                      className="inline-flex items-center justify-center relative flex-[0_0_auto]"
                    >
                      <div className="relative w-6 h-6">
                        <img
                          className="h-[87.50%] top-[12.50%] absolute w-[87.50%] left-[12.50%]"
                          alt=""
                          src={item.incrementIcon}
                        />
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
