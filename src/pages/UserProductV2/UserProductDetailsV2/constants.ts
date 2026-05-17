import {
  CalendarDays,
  Package,
  Tag,
  Truck,
  type LucideIcon,
} from "lucide-react";

export const SIZE_OPTIONS = [
  { label: "S", available: true },
  { label: "M", available: true },
  { label: "L", available: true },
  { label: "XL", available: false },
  { label: "XXL", available: true },
] as const;

export const SHIPPING_ITEMS: readonly {
  title: string;
  value: string;
  Icon: LucideIcon;
}[] = [
  { title: "Discount", value: "Disc 50%", Icon: Tag },
  { title: "Package", value: "Regular Package", Icon: Package },
  { title: "Delivery time", value: "3-4 Working Days", Icon: Truck },
  {
    title: "Estimation Arrive",
    value: "10 - 12 Oct 2026",
    Icon: CalendarDays,
  },
];
