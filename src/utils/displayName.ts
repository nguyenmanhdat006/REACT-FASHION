export function initialsFromDisplayName(name: string): string {
  const t = name.trim();
  if (!t) {
    return '';
  }
  const first = t.split(/\s+/).filter(Boolean)[0]?.[0] ?? t[0];
  return first ? first.toUpperCase() : '';
}

export function resolveProfileDisplayName(
  fullName: string | null | undefined,
  email: string | null | undefined,
): string {
  const name = fullName?.trim();
  if (name) return name;
  const local = email?.split('@')[0]?.trim();
  if (local) return local;
  return 'Account';
}
