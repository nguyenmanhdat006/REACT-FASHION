/** Parse a positive money amount from user input (strips currency symbols and grouping). */
export function parseMoney(input: string): number | null {
  const cleaned = input.replace(/[$€£,\s]/g, '').trim();
  if (!cleaned) return null;
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Parse a discount percentage (0–100 exclusive) from strings like "15" or "15%". */
export function parseDiscountPercent(input: string | undefined): number | null {
  if (!input?.trim()) return null;
  const m = input.match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number.parseFloat(m[1]);
  if (!Number.isFinite(n) || n <= 0 || n >= 100) return null;
  return n;
}

/** Build a URL slug from a display name (lowercase, hyphenated, max 220 chars). */
export function slugFromName(name: string): string | undefined {
  const s = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!s) return undefined;
  return s.slice(0, 220);
}

export function trimOrUndefined(value: string | undefined): string | undefined {
  const t = value?.trim();
  return t ? t : undefined;
}

export function optionalNonNegativeInt(value: string | undefined): number | undefined {
  const t = value?.trim();
  if (!t) return undefined;
  const n = Number.parseInt(t, 10);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return n;
}
