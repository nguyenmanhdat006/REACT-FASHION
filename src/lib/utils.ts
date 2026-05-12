import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

import { TYPOGRAPHY_FONT_SIZE_CLASS_SUFFIXES } from "@/lib/tailwindMergeTypography"

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...TYPOGRAPHY_FONT_SIZE_CLASS_SUFFIXES] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
