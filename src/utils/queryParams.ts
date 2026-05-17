export function toQueryParams<T extends object>(params?: T): Partial<T> {
  return { ...params };
}
