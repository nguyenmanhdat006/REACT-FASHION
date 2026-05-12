import { useId, useState } from "react";
import {
  X,
  Heart,
  ChevronDown,
  Tag,
  Package,
  Truck,
  CalendarDays,
} from "lucide-react";

const SIZE_OPTIONS = [
  { label: "S", available: true },
  { label: "M", available: true },
  { label: "L", available: true },
  { label: "XL", available: false },
  { label: "XXL", available: true },
];

const SHIPPING_ITEMS = [
  { title: "Discount", value: "Disc 50%", Icon: Tag },
  { title: "Package", value: "Regular Package", Icon: Package },
  { title: "Delivery time", value: "3-4 Working Days", Icon: Truck },
  { title: "Estimation Arrive", value: "10 - 12 Oct 2026", Icon: CalendarDays },
];

const COLORS = {
  primary900: "#1a1a1a",
  grayscale50: "#f5f5f5",
  grayscale100: "#ebebeb",
  grayscale200: "#e0e0e0",
  grayscale400: "#9e9e9e",
  grayscaleBlack: "#0d0d0d",
  muted: "#666666",
  white: "#ffffff",
  black: "#000000",
};

function CloseButton() {
  return (
    <button
      type="button"
      aria-label="Close product details"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px",
        borderRadius: "6px",
        background: "none",
        border: "none",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <X size={24} color={COLORS.grayscaleBlack} />
    </button>
  );
}

function SizePill({ label, available, selected, groupId, onChange }) {
  const bgColor = selected
    ? COLORS.primary900
    : !available
    ? "rgba(243,243,243,0.7)"
    : COLORS.grayscale50;

  const textColor = selected
    ? COLORS.white
    : !available
    ? COLORS.grayscale400
    : COLORS.grayscaleBlack;

  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        flexShrink: 0,
        padding: !available ? "16px 32px" : "12px 32px",
        borderRadius: "32px",
        background: bgColor,
        cursor: !available ? "not-allowed" : "pointer",
        overflow: "hidden",
      }}
    >
      <input
        id={`${groupId}-${label}`}
        type="radio"
        name={groupId}
        value={label}
        checked={selected}
        disabled={!available}
        onChange={onChange}
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        aria-label={`Size ${label}${!available ? " unavailable" : ""}`}
      />
      <span
        style={{
          color: textColor,
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "24px",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </label>
  );
}

function AccordionSection({ title, isOpen, onToggle, children }) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "4px",
        padding: "16px",
        width: "100%",
        background: COLORS.white,
        borderRadius: "16px",
        border: `1px solid ${COLORS.grayscale200}`,
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontSize: "16px",
            fontWeight: 500,
            color: COLORS.black,
            lineHeight: "24px",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
        <span
          style={{
            display: "inline-flex",
            width: "16px",
            height: "16px",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <ChevronDown size={16} color={COLORS.grayscaleBlack} />
        </span>
      </button>
      {isOpen && children}
    </section>
  );
}

function ShippingItem({ title, value, Icon, gridArea }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        gridArea,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          padding: "4px",
          background: COLORS.grayscale100,
          borderRadius: "40px",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <Icon size={24} color={COLORS.grayscaleBlack} />
      </div>
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: 400,
            color: COLORS.muted,
            lineHeight: "18px",
          }}
        >
          {title}
        </span>
        <span
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 500,
            color: COLORS.black,
            lineHeight: "20px",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function ProductImage() {
  return (
    <div
      style={{
        flex: 1,
        alignSelf: "stretch",
        borderRadius: "20px",
        overflow: "hidden",
        background: "linear-gradient(135deg, #c9b99a 0%, #8b6f47 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
      }}
      aria-label="Supper Skinny jogger in brown"
    >
      <span
        style={{
          color: COLORS.white,
          opacity: 0.5,
          fontSize: "14px",
          fontWeight: 400,
        }}
      >
        Product Image
      </span>
    </div>
  );
}

export function ProductDetails() {
  const [selectedSize, setSelectedSize] = useState("S");
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isShippingOpen, setIsShippingOpen] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const sizeGroupId = useId();

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        width: "912px",
        maxWidth: "100%",
        alignItems: "center",
        gap: "16px",
        paddingTop: 0,
        paddingBottom: "16px",
        paddingLeft: "16px",
        paddingRight: "16px",
        background: COLORS.white,
        borderRadius: "16px",
        overflow: "hidden",
        boxSizing: "border-box",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          width: "100%",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "16px",
            borderRadius: "60px",
            overflow: "hidden",
          }}
        >
          <CloseButton />
        </div>
      </header>

      <section
        style={{
          display: "flex",
          height: "634.5px",
          alignItems: "flex-start",
          gap: "16px",
          width: "100%",
        }}
      >
        <ProductImage />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
            flex: 1,
            alignSelf: "stretch",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
              width: "100%",
              flexShrink: 0,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 500,
                color: COLORS.black,
                lineHeight: "28px",
                whiteSpace: "nowrap",
              }}
            >
              Supper Skinny jogger in brown
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: 500,
                color: COLORS.black,
                lineHeight: "28px",
                whiteSpace: "nowrap",
              }}
            >
              $36
            </p>
          </div>

          <div
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: COLORS.muted,
              lineHeight: "20px",
              whiteSpace: "nowrap",
            }}
          >
            Select Size
          </div>

          <fieldset
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              flexShrink: 0,
              overflowX: "auto",
              border: "none",
              padding: 0,
              margin: 0,
              minWidth: 0,
            }}
          >
            <legend
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                overflow: "hidden",
                clip: "rect(0,0,0,0)",
                whiteSpace: "nowrap",
              }}
            >
              Select product size
            </legend>
            {SIZE_OPTIONS.map((size) => (
              <SizePill
                key={size.label}
                label={size.label}
                available={size.available}
                selected={selectedSize === size.label}
                groupId={sizeGroupId}
                onChange={() => setSelectedSize(size.label)}
              />
            ))}
          </fieldset>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              aria-label="Add product to cart"
              style={{
                all: "unset",
                boxSizing: "border-box",
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "12px 32px",
                background: COLORS.grayscale50,
                borderRadius: "32px",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  color: COLORS.grayscaleBlack,
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  whiteSpace: "nowrap",
                }}
              >
                Add To cart
              </span>
            </button>

            <button
              type="button"
              aria-label="Buy now"
              style={{
                all: "unset",
                boxSizing: "border-box",
                display: "flex",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "12px 32px",
                background: COLORS.primary900,
                borderRadius: "32px",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  color: COLORS.white,
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  whiteSpace: "nowrap",
                }}
              >
                Buy Now
              </span>
            </button>

            <button
              type="button"
              aria-pressed={isWishlisted}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={() => setIsWishlisted((prev) => !prev)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "16px",
                borderRadius: "60px",
                background: COLORS.grayscale50,
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "2px",
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                <Heart
                  size={24}
                  color={isWishlisted ? "#e53935" : COLORS.grayscaleBlack}
                  fill={isWishlisted ? "#e53935" : "none"}
                  style={{ transition: "fill 0.2s, color 0.2s" }}
                />
              </span>
            </button>
          </div>

          <AccordionSection
            title="Description"
            isOpen={isDescriptionOpen}
            onToggle={() => setIsDescriptionOpen((prev) => !prev)}
          >
            <p
              style={{
                margin: 0,
                width: "100%",
                fontSize: "14px",
                fontWeight: 400,
                color: COLORS.black,
                lineHeight: "20px",
              }}
            >
              A hoodie is a casual and comfortable sweatshirt made from soft,
              warm fabric, typically featuring a front pocket and an adjustable
              drawstring hood. It is designed for everyday wear, providing both
              style and practicality.
            </p>
          </AccordionSection>

          <AccordionSection
            title="Shipping"
            isOpen={isShippingOpen}
            onToggle={() => setIsShippingOpen((prev) => !prev)}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "auto auto",
                gap: "8px 39px",
                padding: "0 8px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {SHIPPING_ITEMS.map((item, index) => {
                const gridAreas = [
                  "1 / 1 / 2 / 2",
                  "1 / 2 / 2 / 3",
                  "2 / 1 / 3 / 2",
                  "2 / 2 / 3 / 3",
                ];
                return (
                  <ShippingItem
                    key={item.title}
                    title={item.title}
                    value={item.value}
                    Icon={item.Icon}
                    gridArea={gridAreas[index]}
                  />
                );
              })}
            </div>
          </AccordionSection>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;