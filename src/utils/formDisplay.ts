const EM_DASH = '—';

export function dash(v: string | null | undefined): string {
  return v != null && String(v).trim() !== '' ? v : EM_DASH;
}
